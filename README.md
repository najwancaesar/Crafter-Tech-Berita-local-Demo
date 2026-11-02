# Shangbao Indonesia — Frontend Reconstruction

This is a **pure frontend reconstruction prototype** of the Shangbao Indonesia homepage, developed with **HTML5, CSS3, and Vanilla JavaScript**. It uses local assets with no external build tools, no Node.js runtime dependencies, and no framework overhead.

The frontend is specifically prepared to be portable into **CrafterCMS 4.x** as a FreeMarker templated project.

> See [`docs/DESIGN_TOKENS.md`](./docs/DESIGN_TOKENS.md) for all measured design values, [`docs/IMAGE_ASSET_CATALOG.md`](./docs/IMAGE_ASSET_CATALOG.md) for the complete image inventory, and [`docs/GAP_REPORT.md`](./docs/GAP_REPORT.md) for the detailed visual comparison against original screenshots.

---

## Quick Start (How to Run)

Because this project uses pure static web standards with all prototype data bundled in `assets/js/data.js`, no backend, database, or build step is required:

1. **Option 1 (Direct in Browser):**
   - Double-click `index.html` to open it directly in any modern browser.

2. **Option 2 (Local Web Server):**
   - **Laragon / Apache:** Already hosted if placed in `c:\laragon\www\shangbao-reconstruction\` (open `http://localhost/shangbao-reconstruction/` or `http://shangbao-reconstruction.test/`).
   - **Any static server:** `python -m http.server 8000` or PHP built-in server `php -S localhost:8000`.

---

## Technology Stack

- **Markup:** Semantic HTML5 with accessibility attributes (`aria-*`, skip-links, role attributes)
- **Styling:** Modern responsive CSS3 with CSS Custom Properties (Design Tokens), flexbox, grid, and fluid typography (`clamp()`)
- **Scripting:** Pure Vanilla JavaScript (ES6+), zero external runtime dependencies, native DOM manipulation
- **Media:** Clean local image assets (36 editorial photographs + 2 promotional banners) and crisp vector SVGs (brand badges, icons, banners, charts)

---

## Project Structure

```text
shangbao-reconstruction/
├── index.html                  ← Main frontend markup (with CrafterCMS block boundaries)
├── README.md                   ← Project documentation and execution instructions
├── NOTICE.txt                  ← Legal notices and usage constraints
├── docs/                       ← Specification and verification documentation
│   ├── DESIGN_TOKENS.md        ← All measured colors, typography, dimensions, and spacing
│   ├── GAP_REPORT.md           ← Visual comparison report vs original screenshot
│   ├── IMAGE_ASSET_CATALOG.md  ← Complete 38-asset inventory, metadata, and mapping
│   └── SOURCE_ANALYSIS.md      ← Detailed reverse engineering of the original snapshot
├── assets/
│   ├── css/
│   │   └── styles.css          ← Author-crafted CSS rules based on measured tokens
│   ├── js/
│   │   ├── data.js             ← 91 audited article records with provenance flags
│   │   ├── images.js           ← Deterministic image mapping, pool manager, and fallback
│   │   └── app.js              ← Vanilla JS rendering, routing, clock, and UI interactions
│   └── images/
│       ├── brand/              ← Logos, Google Play badge, App Store badge (SVG)
│       ├── backgrounds/        ← Outer vignette and background textures (SVG)
│       ├── banners/            ← Header advertising banner (SVG)
│       ├── articles/           ← Canonical editorial photographs (JPG)
│       ├── sidebar/            ← E-Paper banner & market trends graphics (JPG & SVG)
│       └── placeholders/       ← High-resolution fallback placeholders (SVG)
└── reference-shots/            ← Original reference screenshots for visual validation
```

---

## Two-Column Editorial Layout & Content Architecture

The homepage is organized as a persistent two-column grid (`.content-layout`):

1. **Main Column (`.main-column`, ~74.5%):**
   - **Hero Carousel:** 10 headline slides with local editorial photographs, timer controls, and navigation dots.
   - **Search Results (`#searchResults`):** Instant client-side search across all 91 articles.
   - **12 Featured Lead Categories (`.category-featured`):** Core news pillars with prominent lead stories (1.38 ratio photo + excerpt + read more) followed by 2×2 thumbnail grids (热点新闻, 政治, 法律, 首都动态, 国外新闻, 教育与文化, 华社, 社论, 社会, 特别, 财经, 金融).
   - **8 Compact Categories (`.category-compact`):** Clean 2-column compact story cards with proportional 88px thumbnails and meta dates, optimizing vertical rhythm (科学与技术, 评论, 健康知识, 体育, 娱乐, 人民福利, 宗教, 东盟动态).
   - **Article View (`#articleView`):** Clean single-article reading view.
2. **Sidebar (`.sidebar`, ~25.5%):**
   - **Popular News Widget:** Tabbed interface ("热文推荐" / "最多阅读者") with ranked 01–05 numbers.
   - **Market Trends Banner:** Integrated `finance.jpg` market movements card.
   - **E-Paper Card:** Integrated `e-paper2.jpg` digital edition subscription banner.
   - **Today's News Highlights:** 4 curated thumbnail stories with non-repeating local photographs.
   - **Sidebar Advertisement:** Integrated commercial sponsorship placement.

---

## Image Asset Management & Fallback

Images are managed with a multi-tier fallback mechanism in `assets/js/images.js` without requiring build steps:

1. **Deterministic mapping:** Explicitly mapped in `window.SHANGBAO_IMAGES` in `images.js` (36 editorial photos matched to corresponding stories).
2. **Specific article file:** `assets/images/articles/<id-artikel>.(jpg|png|webp)`.
3. **Pool distribution:** Round-robin allocation from `window.SHANGBAO_IMAGE_POOL` across unpinned articles.
4. **Clean SVG placeholder:** `assets/images/placeholders/news-placeholder.svg` (or `hero-placeholder.svg`).
5. **CSS abstract scene:** Pure CSS visual placeholder if image loading fails.

Slot aspect ratios are strictly preserved with `object-fit: cover`:
- Carousel hero: `1.87` (or `1.76`)
- Lead story: `1.38`
- Thumbnail grid: `1.35`
- Sidebar highlight: `1.25`

---

## CrafterCMS Integration Readiness

The source is structured with clear separation of concerns to enable seamless porting into CrafterCMS 4.x:

- **Presentation (`index.html` & `styles.css`):**
  - Section blocks are explicitly demarcated with header comments (`HEADER`, `NAV PRIMARY`, `NAV SECONDARY`, `MASTHEAD`, `TICKER`, `HERO CAROUSEL`, `SIDEBAR`, `CATEGORY FEED`, `FOOTER`).
  - Class names are semantic and stable (`.site-shell`, `.nav-primary`, `.hero-carousel`, `.widget-title`, `.lead-story`, `.category-section`).
  - Can be mapped 1-to-1 to CrafterCMS FreeMarker component templates (`.ftl`).
- **Client Interactions (`app.js`):**
  - UI behaviors (navigation toggling, carousel cycling, search filtering, sidebar tabs, live clock) operate on clean DOM selectors independently of the data source.
- **Content Data (`data.js`):**
  - 91 article records with `summarySource: "original-snapshot"` for genuine lead articles and `summarySource: "headline-derived-demo"` for contextual previews.
- **Media Assets (`assets/images/`):**
  - Canonical lowercase directories (`brand/`, `banners/`, `articles/`, `sidebar/`, `placeholders/`), ready to be relocated into CrafterCMS asset paths (`/static-assets/images/...`).
