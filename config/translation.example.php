<?php
/**
 * translation.example.php — Configuration template for Translation API
 *
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to: config/translation.php
 *    (translation.php is listed in .gitignore and will NOT be committed)
 *
 * 2. Obtain a Google Cloud Translation API key:
 *    - Go to: https://console.cloud.google.com/apis/credentials
 *    - Create a project (or use an existing one)
 *    - Enable the "Cloud Translation API"
 *    - Create an API key → restrict it to "Cloud Translation API" only
 *    - Optionally restrict the key to your server's IP address
 *
 * 3. Paste the key below (replace the placeholder).
 *    NEVER commit this file with a real key.
 *
 * ALTERNATIVE — Environment variable (recommended for production):
 *    Set GOOGLE_CLOUD_TRANSLATE_API_KEY in your server environment.
 *    The proxy (api/translate.php) checks this variable first.
 *
 * IMPORTANT SECURITY NOTES:
 * - Do not expose this file via a public URL.
 * - Add config/translation.php to your .gitignore.
 * - Restrict the API key on the Google Cloud console to:
 *     - API restriction: Cloud Translation API
 *     - (Optional) HTTP referrer or IP restriction
 * - The API key is only used server-side. It is never sent to the browser.
 *
 * SUPPORTED LANGUAGES:
 *   zh-CN  — Simplified Chinese (source / default)
 *   en     — English
 *   id     — Bahasa Indonesia
 *
 * API DOCUMENTATION:
 *   https://cloud.google.com/translate/docs/reference/rest/v2/translate
 *
 * FREE TIER (as of 2024):
 *   500,000 characters per month free.
 *   Translate API v2 (Basic) charges $20 per million characters beyond free tier.
 */

return [
    // Replace with your actual Google Cloud Translation API key.
    // NEVER commit a real key to version control.
    'google_cloud_translate_key' => 'YOUR_GOOGLE_CLOUD_TRANSLATE_API_KEY_HERE',
];

