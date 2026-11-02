/* ================================================================
   Shangbao Images — Image Resolution & Fallback Manager
   Vanilla JS — No external runtime dependencies
   
   Directory Organization:
     assets/images/brand/        - Logos & app store badges
     assets/images/backgrounds/  - Decorative background textures
     assets/images/banners/      - Header advertising banners
     assets/images/articles/     - Article photographs
     assets/images/sidebar/      - Sidebar widgets & promotional graphics
     assets/images/placeholders/ - Fallback placeholder graphics

   Priority Order:
     1. assets/images/articles/<id-artikel>.(jpg|png|webp)
     2. Manual mapping in window.SHANGBAO_IMAGES
     3. Pool: images in window.SHANGBAO_IMAGE_POOL shared round-robin
     4. Default neutral SVG placeholder (news-placeholder.svg / hero-placeholder.svg)
   ================================================================ */

// Priority 2: Manual article-id -> image URL mapping.
// Pins high-confidence editorial photographs to specific article IDs.
window.SHANGBAO_IMAGES = window.SHANGBAO_IMAGES || {
  // 财经 (Economy)
  "economy-1793073564": "assets/images/articles/Gas station.jpg",
  "economy-1793073483": "assets/images/articles/Gold antara.jpg",
  "economy-1793071177": "assets/images/articles/Air plane.jpg",
  "economy-1793049934": "assets/images/articles/Bolts material.jpg",
  "economy-1793049878": "assets/images/articles/Export textile.jpg",

  // 金融 (Financial)
  "financial-1793069962": "assets/images/articles/Corporate human.jpg",
  "financial-1793069437": "assets/images/articles/Bank of china.jpg",
  "financial-1793069151": "assets/images/articles/Moneyfestation.jpg",
  "financial-1793068056": "assets/images/articles/Market modal.jpg",
  "financial-1793068190": "assets/images/articles/Teamwork relationships.jpg",

  // 政治 (Politics)
  "politics-1793023446": "assets/images/articles/Mrs. puji.jpg",
  "politics-1792920849": "assets/images/articles/Forek Hulu Migas.jpg",
  "politics-1792764653": "assets/images/articles/Meet up.jpg",
  "politics-1792679463": "assets/images/articles/President moment.jpg",
  "politics-1792679561": "assets/images/articles/President - moment 2.jpg",

  // 法律 (Law)
  "hukum-1792767922": "assets/images/articles/BEM Ui Dukuh atas.jpg",
  "hukum-1792678077": "assets/images/articles/Police jobs - 4.jpg",
  "hukum-1792665126": "assets/images/articles/Security road.jpg",
  "hukum-1792505458": "assets/images/articles/Police jobs-3.jpg",
  "hukum-1792334834": "assets/images/articles/Police jobs.jpg",

  // 首都动态 (Metropolitan)
  "metropolitan-1793024041": "assets/images/articles/Cleaning service machine.jpg",
  "metropolitan-1792942444": "assets/images/articles/Suhut.jpg",
  "metropolitan-1792936918": "assets/images/articles/Road Improvement Project.jpg",
  "metropolitan-1792936002": "assets/images/articles/Infrastruktur relationship.jpg",
  "metropolitan-1792764926": "assets/images/articles/Train.jpg",

  // 评论与社论 (Opinion & Editorial)
  "opinion-1784816528": "assets/images/articles/England country.jpg",
  "opinion-1788183062": "assets/images/articles/Images - 3.jpg",
  "editorial-1793022053": "assets/images/articles/Sir purbaya.jpg",
  "editorial-1792677606": "assets/images/articles/Police jobs -2.jpg",

  // 社会 (Society)
  "society-1793022678": "assets/images/articles/Plane.jpg",

  // 华社 (Chinese Community)
  "chinese-community-1792942692": "assets/images/articles/Images-2.jpg",
  "chinese-community-1792771332": "assets/images/articles/Community.jpg",
  "chinese-community-1792771116": "assets/images/articles/Speech.jpg",
  "chinese-community-1792770737": "assets/images/articles/Speech-2.jpg",
  "chinese-community-1792770527": "assets/images/articles/Teamwork relationships.jpg",

  // 教育与文化 (Education & Culture)
  "pendidikan-kebudayaan-1792159968": "assets/images/articles/PKD.jpg",
  "pendidikan-kebudayaan-1791905274": "assets/images/articles/National working reference.jpg"
};

// Priority 3: Local image pool shared round-robin across unpinned articles.
window.SHANGBAO_IMAGE_POOL = window.SHANGBAO_IMAGE_POOL || [
  "assets/images/articles/Air plane.jpg",
  "assets/images/articles/BEM Ui Dukuh atas.jpg",
  "assets/images/articles/Bank of china.jpg",
  "assets/images/articles/Bolts material.jpg",
  "assets/images/articles/Cleaning service machine.jpg",
  "assets/images/articles/Community.jpg",
  "assets/images/articles/Corporate human.jpg",
  "assets/images/articles/England country.jpg",
  "assets/images/articles/Export textile.jpg",
  "assets/images/articles/Forek Hulu Migas.jpg",
  "assets/images/articles/Gas station.jpg",
  "assets/images/articles/Gold antara.jpg",
  "assets/images/articles/Images - 3.jpg",
  "assets/images/articles/Images-2.jpg",
  "assets/images/articles/Infrastruktur relationship.jpg",
  "assets/images/articles/Market modal.jpg",
  "assets/images/articles/Meet up.jpg",
  "assets/images/articles/Moneyfestation.jpg",
  "assets/images/articles/Mrs. puji.jpg",
  "assets/images/articles/National working reference.jpg",
  "assets/images/articles/PKD.jpg",
  "assets/images/articles/Plane.jpg",
  "assets/images/articles/Police jobs - 4.jpg",
  "assets/images/articles/Police jobs -2.jpg",
  "assets/images/articles/Police jobs-3.jpg",
  "assets/images/articles/Police jobs.jpg",
  "assets/images/articles/President - moment 2.jpg",
  "assets/images/articles/President moment.jpg",
  "assets/images/articles/Road Improvement Project.jpg",
  "assets/images/articles/Security road.jpg",
  "assets/images/articles/Sir purbaya.jpg",
  "assets/images/articles/Speech-2.jpg",
  "assets/images/articles/Speech.jpg",
  "assets/images/articles/Suhut.jpg",
  "assets/images/articles/Teamwork relationships.jpg",
  "assets/images/articles/Train.jpg"
];

/**
 * Handle dynamic image fallback across priority stages purely with native onerror.
 * Guarantees zero infinite loops and fails gracefully to neutral SVG placeholders.
 * 
 * @param {HTMLImageElement} img - The image element
 * @param {string} articleId - The unique article identifier
 * @param {number} stage - The current fallback stage (0-4)
 */
window.shangbaoHandleImgFallback = function(img, articleId, stage) {
  stage = stage || 0;
  var safeId = encodeURIComponent(articleId || '');
  var manual = window.SHANGBAO_IMAGES ? window.SHANGBAO_IMAGES[articleId] : null;
  var pool = window.SHANGBAO_IMAGE_POOL || [];
  var isHero = img.classList.contains('hero-photo');

  if (stage === 0) {
    // Stage 0: Try manual mapping if defined
    if (manual && manual !== img.getAttribute('src')) {
      img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 1); };
      img.src = manual;
      return;
    }
    stage = 1;
  }

  if (stage === 1) {
    // Stage 1: Try direct article ID file assets/images/articles/<id>.jpg
    var idPath = 'assets/images/articles/' + safeId + '.jpg';
    if (img.getAttribute('src') !== idPath) {
      img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 2); };
      img.src = idPath;
      return;
    }
    stage = 2;
  }

  if (stage === 2) {
    // Stage 2: Try round-robin pool image via consistent hash
    if (pool && pool.length > 0) {
      var hash = 0;
      var str = articleId || 'default';
      for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
      }
      var poolIndex = Math.abs(hash) % pool.length;
      var poolSrc = pool[poolIndex];
      if (poolSrc && poolSrc !== img.getAttribute('src')) {
        img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 3); };
        img.src = poolSrc;
        return;
      }
    }
    stage = 3;
  }

  // Stage 3 & 4: Fallback to SVG placeholder asset
  var placeholderAsset = isHero ?
    'assets/images/placeholders/hero-placeholder.svg' :
    'assets/images/placeholders/news-placeholder.svg';

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

  if (img.getAttribute('src') !== placeholderAsset) {
    img.src = placeholderAsset;
  }
};
