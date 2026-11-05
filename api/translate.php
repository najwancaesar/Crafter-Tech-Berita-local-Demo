<?php
/**
 * translate.php — Shangbao Indonesia Translation Proxy
 *
 * Secure PHP proxy for Google Cloud Translation API.
 * - Accepts POST requests only (JSON body)
 * - Supports both single-article requests and batch translation requests
 * - Validates source/target languages (zh-CN, en, id)
 * - Enforces input size limits, text limits, and batch size limits
 * - Deduplicates repeated strings before forwarding to provider
 * - Never exposes API key or credentials to the client
 * - Returns structured JSON
 *
 * Single Mode Payload:
 *   { "articleId": "...", "source": "zh-CN", "target": "en", "title": "...", "excerpt": "..." }
 *
 * Batch Mode Payload:
 *   {
 *     "source": "zh-CN",
 *     "target": "en",
 *     "batch": [
 *       { "id": "art-1-title", "text": "..." },
 *       { "id": "art-1-excerpt", "text": "..." }
 *     ]
 *   }
 */

declare(strict_types=1);

// ── Security headers ─────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Constants ────────────────────────────────────────────────────────────────
const VALID_LOCALES     = ['zh-CN', 'en', 'id'];
const MAX_ITEM_BYTES    = 5000;            // per-string limit
const MAX_BATCH_ITEMS   = 100;             // max strings per batch call
const MAX_BODY_BYTES    = 150000;          // max request payload
const CURL_TIMEOUT_S    = 15;
const TRANSLATE_API     = 'https://translation.googleapis.com/language/translate/v2';

// ── Helper: emit JSON error and exit ─────────────────────────────────────────
function fail(string $code, string $msg, int $status = 400): never {
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $code, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Method guard ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('INVALID_REQUEST', 'POST method required.', 405);
}

// ── Load API key ─────────────────────────────────────────────────────────────
// Priority 1: server environment variable
$apiKey = getenv('GOOGLE_CLOUD_TRANSLATE_API_KEY') ?: '';

// Priority 2: local config file (protected by .htaccess and .gitignore)
if ($apiKey === '') {
    $configFile = __DIR__ . '/../config/translation.php';
    if (is_readable($configFile)) {
        $cfg = require $configFile;
        $apiKey = $cfg['google_cloud_translate_key'] ?? '';
    }
}

if ($apiKey === '') {
    fail('TRANSLATION_NOT_CONFIGURED', 'Translation API key is not configured on this server.', 503);
}

// ── Parse request body ───────────────────────────────────────────────────────
$raw = (string) file_get_contents('php://input');
if (strlen($raw) > MAX_BODY_BYTES) {
    fail('INVALID_REQUEST', 'Request body exceeds maximum allowed size.');
}

$body = json_decode($raw, true, 8);
if (!is_array($body)) {
    fail('INVALID_REQUEST', 'Request body must be valid JSON.');
}

$targetLocale = trim((string) ($body['target'] ?? ''));
$sourceLocale = trim((string) ($body['source'] ?? 'zh-CN'));

// ── Validate locales ─────────────────────────────────────────────────────────
if (!in_array($targetLocale, VALID_LOCALES, true)) {
    fail('UNSUPPORTED_LANGUAGE', 'Target language not supported: ' . $targetLocale);
}
if (!in_array($sourceLocale, VALID_LOCALES, true)) {
    fail('UNSUPPORTED_LANGUAGE', 'Source language not supported: ' . $sourceLocale);
}

$langMap    = ['zh-CN' => 'zh-CN', 'en' => 'en', 'id' => 'id'];
$targetLang = $langMap[$targetLocale] ?? $targetLocale;
$sourceLang = $langMap[$sourceLocale] ?? $sourceLocale;

// ── Determine Mode: Batch vs Single ──────────────────────────────────────────
$isBatch = isset($body['batch']) && is_array($body['batch']);

if ($isBatch) {
    // ════════════════════════════════════════════════════════════════════════
    // BATCH MODE
    // ════════════════════════════════════════════════════════════════════════
    $batch = $body['batch'];
    $itemCount = count($batch);

    if ($itemCount === 0) {
        echo json_encode([
            'ok'           => true,
            'source'       => $sourceLocale,
            'target'       => $targetLocale,
            'translations' => [],
            'count'        => 0,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($itemCount > MAX_BATCH_ITEMS) {
        fail('INVALID_REQUEST', 'Batch exceeds maximum item count of ' . MAX_BATCH_ITEMS . '.');
    }

    // Validate and collect unique non-empty strings
    $uniqueStrings = []; // string => index in api payload
    $itemsParsed   = []; // list of ['id' => ..., 'text' => ..., 'empty' => bool]

    foreach ($batch as $idx => $item) {
        if (!is_array($item)) {
            fail('INVALID_REQUEST', "Batch item at index {$idx} must be an object.");
        }
        $itemId = trim((string) ($item['id'] ?? ''));
        $text   = (string) ($item['text'] ?? '');

        if ($itemId === '') {
            fail('INVALID_REQUEST', "Batch item at index {$idx} missing 'id'.");
        }
        if (strlen($text) > MAX_ITEM_BYTES) {
            fail('INVALID_REQUEST', "Text for item '{$itemId}' exceeds maximum size.");
        }

        $trimmed = trim($text);
        if ($trimmed === '' || $targetLocale === $sourceLocale) {
            $itemsParsed[] = ['id' => $itemId, 'text' => $text, 'empty' => true];
        } else {
            $itemsParsed[] = ['id' => $itemId, 'text' => $text, 'empty' => false];
            if (!isset($uniqueStrings[$text])) {
                $uniqueStrings[$text] = count($uniqueStrings);
            }
        }
    }

    // If all strings are empty or noop
    if (empty($uniqueStrings)) {
        $out = [];
        foreach ($itemsParsed as $it) {
            $out[] = ['id' => $it['id'], 'translatedText' => $it['text']];
        }
        echo json_encode([
            'ok'           => true,
            'source'       => $sourceLocale,
            'target'       => $targetLocale,
            'translations' => $out,
            'count'        => count($out),
            'noop'         => true,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Prepare payload for Google Translate v2
    $apiTexts = array_keys($uniqueStrings);
    $payload = json_encode([
        'q'      => $apiTexts,
        'source' => $sourceLang,
        'target' => $targetLang,
        'format' => 'text',
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => TRANSLATE_API . '?key=' . urlencode($apiKey),
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => CURL_TIMEOUT_S,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response   = curl_exec($ch);
    $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError  = curl_error($ch);
    curl_close($ch);

    if ($response === false || $curlError !== '') {
        $isTimeout = str_contains(strtolower($curlError), 'timeout');
        fail(
            $isTimeout ? 'PROVIDER_TIMEOUT' : 'NETWORK_UNAVAILABLE',
            $isTimeout ? 'Translation request timed out.' : 'Could not reach the translation provider.',
            503
        );
    }

    $data = json_decode($response, true);

    if ($httpStatus === 401 || $httpStatus === 403) {
        fail('PROVIDER_AUTH_ERROR', 'API authentication failed. Check the server configuration.', 502);
    }
    if ($httpStatus === 429) {
        fail('PROVIDER_RATE_LIMITED', 'Translation provider rate limit reached. Try again later.', 503);
    }
    if ($httpStatus === 408 || $httpStatus === 504) {
        fail('PROVIDER_TIMEOUT', 'Translation provider timed out. Try again later.', 503);
    }
    if ($httpStatus >= 500) {
        fail('PROVIDER_SERVICE_UNAVAILABLE', 'Translation provider is currently unavailable.', 503);
    }
    if ($httpStatus !== 200 || !isset($data['data']['translations'])) {
        $apiMsg = $data['error']['message'] ?? 'Unknown provider error.';
        fail('TRANSLATION_FAILED', 'Translation failed: ' . $apiMsg, 502);
    }

    // Map Google API results back to unique strings
    $googleTrans = $data['data']['translations'];
    $translatedMap = []; // original string => translatedText
    foreach ($apiTexts as $idx => $origStr) {
        $translatedMap[$origStr] = $googleTrans[$idx]['translatedText'] ?? $origStr;
    }

    // Assemble final ordered results by item ID
    $finalResults = [];
    foreach ($itemsParsed as $it) {
        if ($it['empty']) {
            $finalResults[] = ['id' => $it['id'], 'translatedText' => $it['text']];
        } else {
            $finalResults[] = ['id' => $it['id'], 'translatedText' => $translatedMap[$it['text']] ?? $it['text']];
        }
    }

    http_response_code(200);
    echo json_encode([
        'ok'           => true,
        'source'       => $sourceLocale,
        'target'       => $targetLocale,
        'translations' => $finalResults,
        'count'        => count($finalResults),
        'cached'       => false,
    ], JSON_UNESCAPED_UNICODE);
    exit;

} else {
    // ════════════════════════════════════════════════════════════════════════
    // SINGLE ARTICLE MODE (Backward-compatible)
    // ════════════════════════════════════════════════════════════════════════
    $articleId = trim((string) ($body['articleId'] ?? ''));
    $title     = trim((string) ($body['title'] ?? ''));
    $excerpt   = trim((string) ($body['excerpt'] ?? ''));

    if ($targetLocale === $sourceLocale) {
        echo json_encode([
            'ok'        => true,
            'articleId' => $articleId,
            'source'    => $sourceLocale,
            'target'    => $targetLocale,
            'title'     => $title,
            'excerpt'   => $excerpt,
            'cached'    => false,
            'noop'      => true,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($title === '' && $excerpt === '') {
        fail('INVALID_REQUEST', 'At least one of title or excerpt must be provided.');
    }
    if (strlen($title) > MAX_ITEM_BYTES || strlen($excerpt) > MAX_ITEM_BYTES) {
        fail('INVALID_REQUEST', 'Text fields exceed the maximum allowed size.');
    }

    if ($articleId !== '' && !preg_match('/^[a-zA-Z0-9_\-]{1,128}$/', $articleId)) {
        fail('INVALID_REQUEST', 'Invalid articleId format.');
    }

    $texts = [];
    if ($title !== '')   $texts['title']   = $title;
    if ($excerpt !== '') $texts['excerpt'] = $excerpt;

    $payload = json_encode([
        'q'      => array_values($texts),
        'source' => $sourceLang,
        'target' => $targetLang,
        'format' => 'text',
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => TRANSLATE_API . '?key=' . urlencode($apiKey),
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => CURL_TIMEOUT_S,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response   = curl_exec($ch);
    $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError  = curl_error($ch);
    curl_close($ch);

    if ($response === false || $curlError !== '') {
        $isTimeout = str_contains(strtolower($curlError), 'timeout');
        fail(
            $isTimeout ? 'PROVIDER_TIMEOUT' : 'NETWORK_UNAVAILABLE',
            $isTimeout ? 'Translation request timed out.' : 'Could not reach the translation provider.',
            503
        );
    }

    $data = json_decode($response, true);

    if ($httpStatus === 401 || $httpStatus === 403) {
        fail('PROVIDER_AUTH_ERROR', 'API authentication failed. Check the server configuration.', 502);
    }
    if ($httpStatus === 429) {
        fail('PROVIDER_RATE_LIMITED', 'Translation provider rate limit reached. Try again later.', 503);
    }
    if ($httpStatus === 408 || $httpStatus === 504) {
        fail('PROVIDER_TIMEOUT', 'Translation provider timed out. Try again later.', 503);
    }
    if ($httpStatus >= 500) {
        fail('PROVIDER_SERVICE_UNAVAILABLE', 'Translation provider is currently unavailable.', 503);
    }
    if ($httpStatus !== 200 || !isset($data['data']['translations'])) {
        $apiMsg = $data['error']['message'] ?? 'Unknown provider error.';
        fail('TRANSLATION_FAILED', 'Translation failed: ' . $apiMsg, 502);
    }

    $translations = $data['data']['translations'];
    $keys   = array_keys($texts);
    $result = [];
    foreach ($keys as $i => $key) {
        $result[$key] = $translations[$i]['translatedText'] ?? '';
    }

    http_response_code(200);
    echo json_encode([
        'ok'        => true,
        'articleId' => $articleId,
        'source'    => $sourceLocale,
        'target'    => $targetLocale,
        'title'     => $result['title']   ?? '',
        'excerpt'   => $result['excerpt'] ?? '',
        'cached'    => false,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
