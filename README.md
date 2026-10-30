# Shangbao Indonesia — Homepage Reconstruction

This is a **runnable static front-end reconstruction prototype** made from the user-supplied saved homepage HTML. It is not the original source code and it does not include the original server-side application or database.

## Run it

- Easiest: double-click `index.html`. The JavaScript data is bundled in `assets/js/data.js`, so no API server is required.
- Or use a local web server from this directory:
  - Windows: double-click `serve.bat`
  - macOS/Linux/WSL: `python3 -m http.server 8000` and open `http://localhost:8000`

## What's implemented

- Chinese category navigation derived from the provided snapshot
- Breaking-news ticker
- Featured-news carousel with previous/next controls and dots
- News category sections and reusable article cards
- Popular-news sidebar
- Search across the extracted article titles and snippets
- Local article preview routes (`#article/...`) and links back to the source article
- Responsive mobile layout and back-to-top control

## Important source limitations

The supplied `.html` references a sibling folder named `首页 - Shangbao Indonesia_files` for Bootstrap, jQuery, app CSS/JS, logos, banners, and news photos. That folder was **not included** with the upload available for this build. The generated prototype therefore uses locally generated CSS image placeholders, not the original photographs, logo artwork, ad creative, or original CSS.

The snapshot is a rendered homepage only. It does not provide the website's actual backend source, complete article bodies, database schema, private APIs, or admin panel. Any article that is not fully present in the snapshot uses a short explanatory preview; the source article opens in a separate tab.

## Project structure

```text
shangbao-reconstruction/
├── index.html
├── serve.bat
├── serve.sh
├── README.md
├── SOURCE_ANALYSIS.md
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── data.js
│       └── app.js
└── reference/original-homepage-snapshot.html
```

## Replace image placeholders with approved assets

In `assets/js/app.js`, `scene()` currently renders a `.news-scene` CSS placeholder. Replace it with an `<img>` that points to a local authorized asset when the original asset folder or properly licensed image files are available. The hero art can similarly be changed in `renderHero()`.

## How to extend it

1. Replace snapshot-derived news data in `assets/js/data.js` with content you own or have permission to reuse.
2. Add article body content and render it in `openArticle()` if a licensed content source is available.
3. For real content management, implement a backend and database separately (for example Laravel + MySQL); this static prototype has no admin authentication or persistence.
4. Do not deploy it using Shangbao's brand/assets as a public official website without authorization.

## Memasang foto asli (lokal)
1. Siapkan folder `..._files` hasil Save Page > Webpage, Complete (scroll halaman sampai bawah dulu agar foto termuat).
2. Jalankan: `python3 tools/map_images.py "/path/ke/folder_files"`
3. Refresh browser. Artikel tanpa foto tetap memakai placeholder.
Folder `assets/img/` dan `reference/` masuk `.gitignore` agar foto tidak ikut ter-commit.
