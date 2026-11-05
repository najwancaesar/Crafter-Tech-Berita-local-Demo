# Shangbao Indonesia — Multilingual Translation & Search Architecture

## Overview

This document provides a comprehensive technical overview and operational guide for the **Page-Wide Translation Engine**, **UI Localization**, and **Multilingual Search System** built for the Shangbao Indonesia website reconstruction project.

The system is designed from the ground up to be **100% offline-first**, self-contained, and performant, while offering transparent live integration with the **Google Cloud Translation v2 API** via a secure server-side PHP proxy.

---

## 1. Supported Locales & Default Locale

| Locale Code | Language | Native Name | Coverage | Default |
|-------------|----------|-------------|----------|---------|
| `zh-CN` | Simplified Chinese | 简体中文 | Canonical original dataset & UI | **YES** |
| `en` | English | English | Full UI & Page-wide translated news content | No |
| `id` | Bahasa Indonesia | Bahasa Indonesia | Full UI & Page-wide translated news content | No |

### Default Locale & Persistence Policy
- **Default Locale:** `zh-CN` (Simplified Chinese). Shangbao Indonesia is a daily Chinese-language Indonesian newspaper; hence Mandarin remains canonical.
- **Persistence:** Saved in `localStorage` under key `shangbao_locale`.
- **Validation:** Any unrecognized locale automatically resolves to `zh-CN`.
- **Zero Data Mutation:** The source dataset in `assets/js/data.js` (`window.SHANGBAO_DATA`) is strictly immutable. Translated strings are resolved via normalized lookups in `window.SHANGBAO_TRANSLATE.getLocalizedArticle(a, locale)` and never overwrite source objects.

---

## 2. Architecture & Component Interaction

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 Browser Runtime                                  │
├─────────────────────────────────────────┬────────────────────────────────────────┤
│           Offline UI Engine             │           Search System                │
│           assets/js/i18n.js             │           assets/js/app.js             │
│   • Semantic dictionary (zh-CN, en, id) │   • Offline substring matching         │
│   • [data-i18n] dynamic binding         │   • Localized fields + Chinese fallback│
│   • Accessible dropdown selector        │   • View-state preservation            │
│   • Custom event: shangbao:localechange │   • Localized pagination ("Load More") │
├─────────────────────────────────────────┴────────────────────────────────────────┤
│                     Centralized Content Translation Engine                       │
│                     assets/js/content-translation.js                             │
│   • Normalized API: getLocalizedArticle(), getLocalizedCategory()                │
│   • Fast 2-tier caching: In-memory Map + localStorage (TTL 30 days)              │
│   • Seed Hydration: assets/js/seed-translations.js (all 91 articles)             │
│   • In-flight Promise deduplication registry (prevents redundant fetches)        │
│   • Chunked batch requests (36 strings/request)                                  │
│   • Status bar management: translating ⏳, complete ✓, error ⚠️, retry 🔄         │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ POST JSON (api/translate.php)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            Secure PHP API Proxy                                  │
│                            api/translate.php                                     │
│   • POST-only method guard (405 on GET)                                          │
│   • String deduplication before provider dispatch                                │
│   • Security bounds: max 100 items/batch, max 150KB body, max 5KB per string     │
│   • API Key Priority: Environment Variable -> Protected config/translation.php   │
│   • Standardized error mapping (TRANSLATION_NOT_CONFIGURED, RATE_LIMITED, etc.)  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ HTTPS with Server Secret
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         Google Cloud Translation API                             │
│       https://translation.googleapis.com/language/translate/v2                   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Details

### A. Centralized Content Translation Engine (`assets/js/content-translation.js`)
Exposes `window.SHANGBAO_TRANSLATE` singleton:
- `getLocalizedArticle(articleOrId, locale)`: Synchronous normalized article getter returning `{ id, title, excerpt, category, date, sourceUrl, isTranslated }`.
- `getLocalizedCategory(categoryName, locale)`: Translates category names using the i18n dictionary.
- `translateAllArticles(targetLocale, options)`: Iterates all 91 articles in `data.js`, identifies uncached items, batches them in chunks of 36 strings, and updates views progressively via `shangbao:content-chunk-loaded` events.
- `translateSingleArticle(articleOrId, targetLocale)`: On-demand single article translation used by Article View.
- `getStats()`: Returns article and excerpt cache hit rates for `en` and `id`.
- `clearCache(locale)`: Cleans up memory and localStorage cache for testing or maintenance.

### B. Offline Seed Translations (`assets/js/seed-translations.js`)
Provides high-fidelity, editorial-quality offline translations for all 91 canonical articles in both English and Indonesian.
When the user switches languages while offline or without an active Google Cloud API key, `_loadFromStorage` automatically hydrates from the seed dataset into memory and `localStorage`, providing an immediate 100% translated browsing experience across:
- Breaking News Ticker
- Hero 5-slide Carousel
- 12 Featured Category Sections (Hot News, Politics, Law, Metropolitan, International, Education, Chinese Community, Editorial, Society, Special, Economy, Finance)
- 8 Compact Category Sections
- Sidebar Popular News & Most-Read News
- Sidebar Highlights & Editorial News
- Search Results
- Full Article View

### C. UI Localization Dictionary (`assets/js/i18n.js`)
Contains comprehensive terminology for all structural UI elements:
- Navigation items and category links
- Header and footer branding, slogan, and copyright
- Search placeholders, buttons, counts, and zero-state messages
- Translation status bar messages and error codes
- Accessible ARIA labels

### D. Secure Translation Proxy (`api/translate.php`)
- Strict POST method enforcement.
- Input validation: verifies `source` and `target` against `['zh-CN', 'en', 'id']`.
- Deduplication: identical strings within a batch are collapsed to a single query before sending to Google Cloud Translation, reducing character billing.
- Safe fallback: when no API key is present, returns HTTP 503 with `{ ok: false, error: "TRANSLATION_NOT_CONFIGURED" }` instead of crashing.
- Protected configuration: `config/.htaccess` prevents direct HTTP access to configuration credentials (`Require all denied`).

---

## 4. Search Refinement

### A. View State & Context Preservation
- Opening search hides active views (`heroArea`, `categoryFeed`, `articleView`) and remembers the previous location hash in `_prevHash`.
- Closing search (via close button, Escape key, or clear) restores the exact previous view: homepage, category page, or article preview.
- Clicking any search result opens the article view cleanly, and the article's "Back" link navigates back to the pre-search context.

### B. Multilingual Query Matching
1. Searches the current localized title, category, and excerpt if `en` or `id` is active.
2. In English/Indonesian mode, queries also search canonical Chinese text as a fallback.
3. Matching results display localized cards with highlighted titles, excerpts, localized category badge, and localized date/time.

### C. Load More Pagination
- Search displays localized result count headers: e.g., `Showing 20 of 48 results for "Pertamina"`.
- Results are paginated with a responsive "Load More" button to maintain rapid rendering.

---

## 5. Security & Configuration

### A. HTTP Access Blocking for `config/`
The `config/.htaccess` file guarantees that configuration files are never accessible via HTTP:
```apache
<IfModule mod_authz_core.c>
    Require all denied
</IfModule>
<IfModule !mod_authz_core.c>
    Order deny,allow
    Deny from all
</IfModule>
```
Tested and verified:
`curl -i http://localhost/shangbao-reconstruction/config/translation.example.php` -> **HTTP 403 Forbidden**.

### B. Optional: Configuring Google Cloud Translation API
To enable live translation for new or uncached articles beyond the bundled seed:
1. Copy `config/translation.example.php` to `config/translation.php`:
   ```bash
   cp config/translation.example.php config/translation.php
   ```
2. Enter your Google Cloud Translation API key:
   ```php
   return [
       'google_cloud_translate_key' => 'YOUR_GOOGLE_CLOUD_API_KEY',
   ];
   ```
3. Alternatively, export `GOOGLE_CLOUD_TRANSLATE_API_KEY` in your Apache/PHP server environment.
4. Note: `config/translation.php` is strictly ignored by `.gitignore` and must never be committed.

---

## 6. Automated Regression Test Matrix

Executed via Playwright with Headless Chrome at `http://localhost/shangbao-reconstruction/`:

| Test Case | Description | Expected | Result |
|-----------|-------------|----------|--------|
| **SEC-01** | `config/.htaccess` HTTP access | HTTP 403 Forbidden | **PASS** |
| **SEC-02** | `config/translation.example.php` access | HTTP 403 Forbidden | **PASS** |
| **AST-01** | Brand Favicon SVG (`assets/images/brand/favicon.svg`) | HTTP 200 `image/svg+xml` | **PASS** |
| **API-01** | `api/translate.php` GET guard | HTTP 405 Method Not Allowed | **PASS** |
| **API-02** | `api/translate.php` unconfigured response | HTTP 503 `TRANSLATION_NOT_CONFIGURED` | **PASS** |
| **DOM-01** | Initial Chinese homepage load console errors | 0 errors | **PASS** |
| **DOM-02** | Chinese homepage document title | Contains `首页` | **PASS** |
| **DOM-03** | Navigation links count (primary + secondary) | 23 items | **PASS** |
| **DOM-04** | Chinese hero carousel headline | Canonical Chinese text | **PASS** |
| **TR-01** | Switch to English (`en`): Navigation | `Hot News`, `Politics`, `Law`, etc. | **PASS** |
| **TR-02** | Switch to English (`en`): Hero Headline | English translation rendered | **PASS** |
| **TR-03** | Switch to English (`en`): Category Headings | English section titles rendered | **PASS** |
| **TR-04** | Switch to English (`en`): Sidebar Popular | English article titles rendered | **PASS** |
| **TR-05** | Switch to Indonesian (`id`): Hero Headline | Indonesian translation rendered | **PASS** |
| **TR-06** | Switch to Indonesian (`id`): Navigation | `Berita Terkini`, `Politik`, etc. | **PASS** |
| **TR-07** | Switch to Indonesian (`id`): Category Headings | Indonesian section titles rendered | **PASS** |
| **ART-01** | Article View (EN): Title & content localization | English text rendered | **PASS** |
| **ART-02** | Article View (EN): "View Original" button | Toggles back to canonical Chinese | **PASS** |
| **ART-03** | Article View (EN): "Translate Article" button | Restores English translation | **PASS** |
| **ART-04** | Article View (ID): Title & content localization | Indonesian text rendered | **PASS** |
| **SRC-01** | Multilingual Search: English query "Pertamina" | Matches localized articles | **PASS** |
| **MOB-01** | Mobile 390x844 layout overflow | `scrollWidth <= clientWidth` (True) | **PASS** |
| **MOB-02** | Mobile language dropdown interaction | Semantic dropdown accessible | **PASS** |
| **CAP-01** | Capture `desktop_zh_1920x1080.png` | Saved & Copied to Artifacts | **PASS** |
| **CAP-02** | Capture `desktop_en_1920x1080.png` | Saved & Copied to Artifacts | **PASS** |
| **CAP-03** | Capture `desktop_id_1920x1080.png` | Saved & Copied to Artifacts | **PASS** |
| **CAP-04** | Capture `article_en_1920x1080.png` | Saved & Copied to Artifacts | **PASS** |
| **CAP-05** | Capture `article_id_1920x1080.png` | Saved & Copied to Artifacts | **PASS** |
| **CAP-06** | Capture `mobile_lang_390x844.png` | Saved & Copied to Artifacts | **PASS** |

**Summary:** 28 / 28 Tests Passed (100% Pass Rate). Zero Regressions.
