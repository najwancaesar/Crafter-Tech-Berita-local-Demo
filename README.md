# Shangbao Indonesia — Homepage Reconstruction

This is a **runnable static front-end reconstruction prototype** made from the user-supplied saved homepage HTML. It is not the original source code and it does not include the original server-side application or database.

> See [`DESIGN_TOKENS.md`](./DESIGN_TOKENS.md) for all measured design values and [`GAP_REPORT.md`](./GAP_REPORT.md) for before/after comparison.

## Run it

- Easiest: serve this folder with Laragon (already configured at `http://shangbao-reconstruction.test/`) or any local HTTP server.
- Or: double-click `index.html` (works without a server — all data is bundled in `assets/js/data.js`).
- Windows: double-click `serve.bat`  
- macOS/Linux/WSL: `python3 -m http.server 8000` → `http://localhost:8000`

## What's implemented

| Feature | Status |
|---|---|
| Chinese category navigation (primary red bar + secondary light bar) | ✅ |
| Breaking-news ticker with chevron label | ✅ |
| Featured-news carousel (prev/next, dots, auto-rotate) | ✅ |
| News category sections with lead story + grid | ✅ |
| Popular-news sidebar (two-tab style) | ✅ |
| Full-text search across article titles and snippets | ✅ |
| Local article preview (`#article/...`) with link to source | ✅ |
| Dark outer background with centered white container | ✅ |
| Two-row navigation (red primary + light secondary) | ✅ |
| SELECT LANGUAGE box (yellow, display only) | ✅ |
| Search button (blue) in nav | ✅ |
| Live clock in weather block | ✅ |
| Responsive mobile layout (390px–1920px) | ✅ |
| Image pool fallback mechanism | ✅ |
| Back-to-top button | ✅ |

## Adding your images

**Priority order (no build step required):**

1. **By article ID** — place file as `assets/img/<article-id>.jpg` (or `.png`, `.webp`)
2. **Manual map** — edit `assets/js/images.js` and add `'article-id': 'assets/img/filename.jpg'`
3. **Pool** — put any image in `assets/img/pool/` and declare the filenames in `window.SHANGBAO_IMAGE_POOL` in `images.js`
4. **Automatic map** (from a saved-page folder):
   ```
   python tools/map_images.py "/path/to/首页 - Shangbao Indonesia_files"
   ```

Image aspect ratios preserved: carousel 1.76 · lead story 1.38 · small thumbnail 1.35 · sidebar highlight 1.25.

## Project structure

```text
shangbao-reconstruction/
├── index.html                  ← main page
├── DESIGN_TOKENS.md            ← all measured design values
├── GAP_REPORT.md               ← visual gap analysis
├── README.md
├── SOURCE_ANALYSIS.md
├── take_screenshots.py        ← Playwright verification screenshot script
├── assets/
│   ├── css/styles.css          ← all styles (authored from scratch)
│   └── js/
│       ├── data.js             ← article data (do not edit)
│       ├── images.js           ← image map + pool fallback
│       └── app.js              ← rendering & routing logic
├── reference-shots/            ← reference screenshots for comparison
├── tools/map_images.py         ← image mapping helper
└── reference/                  ← original snapshot HTML (gitignored)
```

## CSS class naming guide (stable for CrafterCMS FreeMarker templates)

| Block | Key classes |
|---|---|
| Shell | `.site-shell` |
| Header | `.site-header` |
| Nav primary (red) | `.nav-primary-wrap`, `.site-nav.nav-primary`, `.nav-link` |
| Nav secondary (light) | `.nav-secondary-wrap`, `.site-nav.nav-secondary-sub`, `.nav-link-sub` |
| Language box | `.lang-box` |
| Search | `.search-btn`, `.search-panel` |
| Masthead | `.masthead`, `.brand`, `.brand-mark`, `.brand-copy`, `.app-badges`, `.store-badge`, `.weather` |
| Ticker | `.ticker`, `.ticker-label`, `.ticker-viewport`, `.ticker-track` |
| Top grid | `.top-grid`, `.hero-area`, `.hero-carousel`, `.hero-slide`, `.hero-caption` |
| Sidebar | `.sidebar`, `.widget`, `.widget-title`, `.widget-tab`, `.popular-list`, `.popular-num`, `.side-highlight` |
| Category feed | `.category-feed`, `.category-column`, `.category-section`, `.category-heading`, `.lead-story`, `.story-grid`, `.small-story` |
| News image | `.news-scene`, `.news-photo`, `.hero-photo` |
| Footer | `.site-footer`, `.footer-top`, `.footer-brand`, `.footer-links`, `.footer-social`, `.footer-bottom` |

## Source limitations

The snapshot references a sibling folder `首页 - Shangbao Indonesia_files` for Bootstrap, jQuery, logos, banners, and news photos. That folder was not included. This prototype uses original CSS (not copied from the source) and placeholder imagery. Full article bodies, backend, database, APIs, and admin panel are not part of this reconstruction.

## Legal

See `NOTICE.txt`. Do not deploy publicly using Shangbao's brand or assets without authorization.
