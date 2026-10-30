/* ================================================================
   Shangbao Images — Image Resolution & Fallback Manager
   Vanilla JS — No external runtime dependencies
   
   Directory Organization:
     assets/images/brand/        - Logos & app store badges
     assets/images/backgrounds/  - Decorative background textures
     assets/images/banners/      - Header advertising banners
     assets/images/articles/     - Article photographs
     assets/images/sidebar/      - Sidebar widgets & graphics
     assets/images/placeholders/ - Fallback placeholder graphics

   Priority Order:
     1. assets/images/articles/<id-artikel>.(jpg|png|webp)
     2. Manual mapping in window.SHANGBAO_IMAGES
     3. Pool: images in window.SHANGBAO_IMAGE_POOL shared round-robin
     4. Default neutral SVG placeholder (news-placeholder.svg)
   ================================================================ */

// Priority 2: Manual article-id -> image URL mapping.
// Individual articles can be pinned to specific images here.
window.SHANGBAO_IMAGES = window.SHANGBAO_IMAGES || {
  "economy-1793073564": "assets/images/articles/Road Improvement Project.jpg",
  "economy-1793073483": "assets/images/articles/Export textile.jpg",
  "economy-1793071177": "assets/images/articles/National working reference.jpg",
  "financial-1793069962": "assets/images/articles/Teamwork relationships.jpg"
};

// Priority 3: Local image pool shared round-robin across articles.
window.SHANGBAO_IMAGE_POOL = window.SHANGBAO_IMAGE_POOL || [
  "assets/images/articles/Export textile.jpg",
  "assets/images/articles/National working reference.jpg",
  "assets/images/articles/Road Improvement Project.jpg",
  "assets/images/articles/Teamwork relationships.jpg"
];

/**
 * Handle dynamic image fallback across priority stages purely with native onerror.
 * @param {HTMLImageElement} img - The image element
 * @param {string} articleId - The unique article identifier
 * @param {number} stage - The current fallback stage
 */
window.shangbaoHandleImgFallback = function(img, articleId, stage) {
  stage = stage || 0;
  var safeId = encodeURIComponent(articleId);
  var manual = window.SHANGBAO_IMAGES ? window.SHANGBAO_IMAGES[articleId] : null;
  var pool = window.SHANGBAO_IMAGE_POOL || [];
  var isHero = img.classList.contains('hero-photo');

  if (stage === 0) {
    // Try Priority 1a: assets/images/articles/<id>.jpg
    img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 1); };
    img.src = 'assets/images/articles/' + safeId + '.jpg';
    return;
  }
  if (stage === 1) {
    // Try Priority 1b: assets/images/articles/<id>.png
    img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 2); };
    img.src = 'assets/images/articles/' + safeId + '.png';
    return;
  }
  if (stage === 2) {
    // Try Priority 1c: legacy assets/img/<id>.jpg (backwards compatibility)
    img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 3); };
    img.src = 'assets/img/' + safeId + '.jpg';
    return;
  }
  if (stage === 3) {
    // Try Priority 2: manual map in images.js
    if (manual && manual !== img.getAttribute('src')) {
      img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 4); };
      img.src = manual;
      return;
    }
    stage = 4;
  }
  if (stage === 4) {
    // Try Priority 3: round-robin pool image
    if (pool && pool.length > 0) {
      var hash = 0;
      for (var i = 0; i < articleId.length; i++) {
        hash = ((hash << 5) - hash + articleId.charCodeAt(i)) | 0;
      }
      var poolIndex = Math.abs(hash) % pool.length;
      var poolSrc = pool[poolIndex];
      if (poolSrc && poolSrc !== img.getAttribute('src')) {
        img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 5); };
        img.src = poolSrc;
        return;
      }
    }
    stage = 5;
  }

  // Priority 4: Fallback to SVG placeholder asset
  var placeholderAsset = isHero ?
    'assets/images/placeholders/hero-placeholder.svg' :
    'assets/images/placeholders/news-placeholder.svg';

  if (img.getAttribute('src') !== placeholderAsset) {
    img.onerror = function() {
      // Ultimate fallback: CSS abstract rendering
      img.style.display = 'none';
      var parent = img.parentElement;
      if (parent) {
        parent.classList.remove('has-photo');
        var inner = parent.querySelector('.scene-placeholder') || parent.querySelector('.hero-art-inner');
        if (inner) inner.style.display = 'block';
      }
    };
    img.src = placeholderAsset;
  }
};
