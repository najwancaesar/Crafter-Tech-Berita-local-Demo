/* ================================================================
   Shangbao Images — Image resolution & Fallback Manager
   Priority order:
     1. assets/img/<id-artikel>.(jpg|png|webp)
     2. Manual mapping in window.SHANGBAO_IMAGES (below)
     3. Pool: images in assets/img/pool/ shared round-robin
     4. Legacy CSS placeholder
   Fallback happens dynamically via onerror without any build step.
   ================================================================ */

// 1 & 2: Manual article-id -> image URL mapping.
// Users can add custom mappings here if files use arbitrary names.
window.SHANGBAO_IMAGES = window.SHANGBAO_IMAGES || {
  // Example:
  // "economy-1793073564": "assets/img/economy-1793073564.jpg",
};

// 3: Pool array — users can add filenames or URLs into this list.
// If an article has no specific photo, pool images are assigned round-robin.
window.SHANGBAO_IMAGE_POOL = window.SHANGBAO_IMAGE_POOL || [
  // Examples:
  // "assets/img/pool/news-1.jpg",
  // "assets/img/pool/news-2.jpg",
];

/**
 * Handle dynamic image fallback across the 4 priority stages without build tools.
 * @param {HTMLImageElement} img - The image element being loaded
 * @param {string} articleId - The article identifier
 * @param {number} stage - The current fallback stage (0: jpg, 1: png, 2: webp, 3: manual, 4: pool, 5: placeholder)
 */
window.shangbaoHandleImgFallback = function(img, articleId, stage) {
  stage = stage || 0;
  var safeId = encodeURIComponent(articleId);
  var manual = window.SHANGBAO_IMAGES ? window.SHANGBAO_IMAGES[articleId] : null;
  var pool = window.SHANGBAO_IMAGE_POOL || [];

  if (stage === 0) {
    // Try Priority 1a: .jpg
    img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 1); };
    img.src = 'assets/img/' + safeId + '.jpg';
    return;
  }
  if (stage === 1) {
    // Try Priority 1b: .png
    img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 2); };
    img.src = 'assets/img/' + safeId + '.png';
    return;
  }
  if (stage === 2) {
    // Try Priority 1c: .webp
    img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 3); };
    img.src = 'assets/img/' + safeId + '.webp';
    return;
  }
  if (stage === 3) {
    // Try Priority 2: manual map in images.js
    if (manual && manual !== img.src) {
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
      if (poolSrc && poolSrc !== img.src) {
        img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 5); };
        img.src = poolSrc;
        return;
      }
    }
    stage = 5;
  }

  // Priority 4: All image sources failed -> revert cleanly to CSS abstract placeholder
  img.style.display = 'none';
  var parent = img.parentElement;
  if (parent) {
    parent.classList.remove('has-photo');
    var placeholder = parent.querySelector('.scene-placeholder') || parent.querySelector('.hero-art-inner');
    if (placeholder) {
      placeholder.removeAttribute('hidden');
      placeholder.style.display = 'block';
    }
  }
};
