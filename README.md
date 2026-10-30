# Shangbao Indonesia — Frontend Reconstruction

This is a **pure frontend reconstruction prototype** of the Shangbao Indonesia homepage, developed with **HTML5, CSS3, and Vanilla JavaScript**. It uses local assets with no external build tools, no Node.js runtime dependencies, and no framework overhead.

The frontend is specifically prepared to be portable into **CrafterCMS** as a FreeMarker templated project.

> See [`DESIGN_TOKENS.md`](./DESIGN_TOKENS.md) for all measured design values and [`GAP_REPORT.md`](./GAP_REPORT.md) for the detailed visual comparison against original screenshots.

---

## Quick Start (How to Run)

Because this project uses pure static web standards with all prototype data bundled in `assets/js/data.js`, no backend, database, or build step is required:

1. **Option 1 (Direct in Browser):**
   - Double-click `index.html` to open it directly in any modern browser.

2. **Option 2 (Local Web Server):**
   - **Laragon / Apache:** Already hosted if placed in `c:\laragon\www\shangbao-reconstruction\` (open `http://localhost/shangbao-reconstruction/` or `http://shangbao-reconstruction.test/`).
   - **Windows batch launcher:** Double-click `serve.bat`.
   - **Any static server:** `python -m http.server 8000` or PHP built-in server `php -S localhost:8000`.

---

## Technology Stack

- **Markup:** Semantic HTML5 with accessibility attributes (`aria-*`, skip-links, role attributes)
- **Styling:** Modern responsive CSS3 with CSS Custom Properties (Design Tokens), flexbox, grid, and fluid typography (`clamp()`)
- **Scripting:** Pure Vanilla JavaScript (ES6+), zero external runtime dependencies, native DOM manipulation
- **Media:** Clean local image assets and crisp vector SVGs (brand badges, icons, banners, charts)

---

## Project Structure

```text
shangbao-reconstruction/
├── index.html                  ← Main frontend markup (with CrafterCMS block boundaries)
├── DESIGN_TOKENS.md            ← All measured colors, typography, dimensions, and spacing
├── GAP_REPORT.md               ← Visual comparison report vs original screenshot
├── README.md                   ← Project documentation and execution instructions
├── SOURCE_ANALYSIS.md          ← Analysis of the original snapshot
├── NOTICE.txt                  ← Legal notices and usage constraints
├── assets/
│   ├── css/
│   │   └── styles.css          ← Author-crafted CSS rules based on measured tokens
│   ├── js/
│   │   ├── data.js             ← Extracted article records and navigation data
│   │   ├── images.js           ← Image mapping, pool manager, and fallback logic
│   │   └── app.js              ← Vanilla JS rendering, routing, clock, and UI interactions
│   └── images/
│       ├── brand/              ← Logos, Google Play badge, App Store badge (SVG)
│       ├── backgrounds/        ← Outer vignette and background textures
│       ├── banners/            ← Header advertising banner (SVG / responsive)
│       ├── articles/           ← Local article photographs (JPG / PNG / WebP)
│       ├── sidebar/            ← Sidebar market chart graphic (SVG)
│       └── placeholders/       ← High-resolution fallback placeholders (SVG)
├── reference-shots/            ← Original reference screenshots for visual validation
└── reference/                  ← Original snapshot HTML (gitignored)
```

---

## Image Asset Management & Fallback

Images are managed with a multi-tier fallback mechanism in `assets/js/images.js` without requiring build steps:

1. **Specific article file:** `assets/images/articles/<id-artikel>.(jpg|png|webp)` (or legacy `assets/img/`)
2. **Manual mapping:** Explicitly mapped in `window.SHANGBAO_IMAGES` in `images.js`
3. **Pool distribution:** Round-robin allocation from `window.SHANGBAO_IMAGE_POOL` across articles
4. **Clean SVG placeholder:** `assets/images/placeholders/news-placeholder.svg`
5. **CSS abstract scene:** Pure CSS visual placeholder if image loading fails

Slot aspect ratios are strictly preserved with `object-fit: cover`:
- Carousel hero: `1.87` (or `1.76`)
- Lead story: `1.38`
- Thumbnail grid: `1.35`
- Sidebar highlight: `1.25`

---

## CrafterCMS Integration Readiness

The source is structured with clear separation of concerns to enable seamless porting into CrafterCMS:

- **Presentation (`index.html` & `styles.css`):**
  - Section blocks are explicitly demarcated with header comments (`HEADER`, `NAV PRIMARY`, `NAV SECONDARY`, `MASTHEAD`, `TICKER`, `HERO CAROUSEL`, `SIDEBAR`, `CATEGORY FEED`, `FOOTER`).
  - Class names are semantic and stable (`.site-shell`, `.nav-primary`, `.hero-carousel`, `.widget-title`, `.lead-story`, `.category-section`).
  - Can be mapped 1-to-1 to CrafterCMS FreeMarker component templates (`.ftl`).
- **Client Interactions (`app.js`):**
  - UI behaviors (navigation toggling, carousel cycling, search filtering, sidebar tabs, live clock) operate on clean DOM selectors independently of the data source.
- **Content Data (`data.js`):**
  - Prototype data structure (`navigation`, `ticker`, `features`, `categories`, `popular`, `articles`) mimics typical CMS content model schemas.
- **Media Assets (`assets/images/`):**
  - Organized by domain (`brand/`, `banners/`, `articles/`, `sidebar/`, `placeholders/`), ready to be relocated into CrafterCMS asset management paths (e.g., `/static-assets/images/...`).
