# Article Architecture — Shangbao Indonesia Reconstruction

## Overview

This document describes the dynamic article detail page implementation for the Shangbao Indonesia reconstruction project (Milestone 3).

## Route Convention

Articles are opened via hash-based routing:

```
http://localhost/shangbao-reconstruction/#article/{article-id}
```

**Examples:**
- `#article/berita-luar-negeri-1793842820` — Full-content reference article
- `#article/economy-1793073564` — Partial-content article (excerpt only)

The router is implemented in `assets/js/app.js` inside the `hashchange` and `DOMContentLoaded` event handlers.

---

## Content Block Types

The article renderer (`renderContentBlocks()` in `app.js`) supports these block types in the article `content` array:

| Block Type | Field Key | Rendered As |
|---|---|---|
| `paragraph` | `text` | `<p class="article-paragraph">` |
| `heading` | `text` | `<h2 class="article-heading">` |
| `subheading` | `text` | `<h3 class="article-subheading">` |
| `quote` | `text` | `<blockquote class="article-quote">` |
| `list` | `items` (array) | `<ul class="article-list">` |
| `table` | `headers`, `rows` | `<table class="article-table">` |
| `image` | `src`, `alt`, `caption` | `<figure class="article-inline-figure">` |

**Example data structure:**
```js
content: [
  { type: "paragraph", text: "正文第一段..." },
  { type: "quote", text: "引言内容..." },
  { type: "list", items: ["要点一", "要点二", "要点三"] },
]
```

---

## Article Data Classification

| Classification | Count | Description |
|---|---|---|
| **Full-content** | 1 | Has complete `content[]` block array; authentic text from official source |
| **Partial-content** | 91 | Has `excerpt` only; shows legal attribution notice + link to original |
| **Total** | 92 | — |

### Full-Content Article
- **ID:** `berita-luar-negeri-1793842820`
- **Title:** 法国卢浮宫举办特展纪念摄影术诞生200周年
- **Source:** 中新社 (China News Service)
- **Content blocks:** 7 paragraphs
- **Image:** `assets/images/articles/louvre-exhibition.jpg`
- **Data source:** Official Shangbao Indonesia article page (authentic, verbatim)

### Partial-Content Articles (91)
These display the `excerpt` field followed by a legal attribution notice:
- An info box explaining the article is a summary
- A "Read on Shangbao Indonesia" button linking to `article.sourceUrl`
- No fabricated full-text content

---

## Translation Integration

The article detail page integrates with the existing multilingual engine:

```
assets/js/i18n.js            → UI label translations (breadcrumb, buttons, metadata labels)
assets/js/content-translation.js → Article content translations via getLocalizedArticle()
assets/js/seed-translations.js   → Pre-seeded EN + ID translations for article berita-luar-negeri-1793842820
```

### Supported Locales
| Locale | Language | Default |
|---|---|---|
| `zh-CN` | Simplified Chinese | ✅ Yes |
| `en` | English | No |
| `id` | Bahasa Indonesia | No |

### Translation Fields Supported
- `title` — Article headline
- `excerpt` — Summary text
- `caption` — Featured image caption
- `content` — Full content blocks array (when available)

### Translation Flow
1. User selects language via language switcher.
2. `window.SHANGBAO_TRANSLATE.getLocalizedArticle(article)` is called.
3. Returns localized fields from seed cache → localStorage cache → Google Cloud Translation API → Chinese fallback.
4. Article view re-renders with localized content.

---

## Article Detail Page Layout

```
┌─────────────────────────────────────────────────────┐
│ [Header + Navigation]                                │
│ [Breaking News Ticker]                               │
│ [Ad Banner]                                          │
├──────────────────────────────────┬──────────────────┤
│ MAIN ARTICLE (col ~75%)          │ SIDEBAR (col ~25%)│
│                                  │                   │
│ ▸ Breadcrumb nav                 │ [Existing sidebar │
│ ▸ Category tag + Date + Source   │  components:]     │
│ ▸ View count                     │  - Carousel       │
│ ▸ Article headline (h1)          │  - Popular news   │
│ ▸ Featured image + caption       │  - Corporate      │
│ ▸ [Translate bar]                │  - Finance banner │
│ ▸ Article body                   │  - E-paper banner │
│   (content blocks OR excerpt box)│                   │
│ ▸ Social share bar               │                   │
│ ▸ Source attribution             │                   │
│ ▸ Prev / Next article nav        │                   │
│ ▸ Related articles grid (2-col)  │                   │
└──────────────────────────────────┴──────────────────┘
│ [Footer]                                             │
└──────────────────────────────────────────────────────┘
```

---

## Source Attribution Policy

Every article displayed must include:
1. **Source agency** (`article.summarySource` or `article.source`) in the meta bar.
2. **Source attribution box** at the bottom of the article linking to `article.sourceUrl`.
3. If `sourceUrl` is missing, an archive badge is shown instead.
4. Articles with `summarySource: "headline-derived-demo"` show a clear notice that content is a demo summary.

---

## Image Resolution

Images are resolved via `getCandidateSrc(article)` in `app.js`:

1. Check `window.SHANGBAO_IMAGES[article.id]` → explicit mapping
2. Check `window.SHANGBAO_IMAGES[article.imageKey]` → key-based mapping
3. Fall back to placeholder image

---

## Browser History / Navigation

- Opening an article: `window.location.hash = '#article/' + id`
- Browser Back button: `hashchange` event restores previous view state
- Previous/Next article: navigates within the same category, sorted by date

---

## Files Modified in Milestone 3

| File | Change |
|---|---|
| `assets/js/data.js` | Added article `berita-luar-negeri-1793842820` with 7 content blocks |
| `assets/js/images.js` | Mapped `berita-luar-negeri-1793842820` → `louvre-exhibition.jpg` |
| `assets/js/seed-translations.js` | Added EN + ID translations for reference article |
| `assets/js/content-translation.js` | Extended `getLocalizedArticle()` to include `caption`, `content`, `author`, `source`, `viewCount` |
| `assets/js/i18n.js` | Added article-page i18n keys for all 3 locales |
| `assets/js/app.js` | Replaced `openArticle()` with full dynamic renderer + `renderContentBlocks()` |
| `assets/css/styles.css` | Appended ~500 lines of article-page component CSS |
| `assets/images/articles/louvre-exhibition.jpg` | New image (downloaded from official S3 source) |

