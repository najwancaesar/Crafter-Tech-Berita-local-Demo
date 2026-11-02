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
  // --- 财经 (Economy) ---
  "economy-1793073564": "assets/images/articles/Gas station.jpg",
  "economy-1793073483": "assets/images/articles/Gold antara.jpg",
  "economy-1793071177": "assets/images/articles/Air plane.jpg",
  "economy-1793049878": "assets/images/articles/Export textile.jpg",
  "economy-1793049934": "assets/images/articles/Bolts material.jpg",

  // --- 金融 (Financial) ---
  "financial-1793069962": "assets/images/articles/Corporate human.jpg",
  "financial-1793069437": "assets/images/articles/Bank of china.jpg",
  "financial-1793069151": "assets/images/articles/Moneyfestation.jpg",
  "financial-1793068190": "assets/images/articles/Teamwork relationships.jpg",
  "financial-1793068056": "assets/images/articles/Market modal.jpg",

  // --- 政治 (Politics) ---
  "politics-1793023446": "assets/images/articles/Mrs. puji.jpg",
  "politics-1792920849": "assets/images/articles/Forek Hulu Migas.jpg",
  "politics-1792764653": "assets/images/articles/Meet up.jpg",
  "politics-1792679463": "assets/images/articles/President moment.jpg",
  "politics-1792679561": "assets/images/articles/President - moment 2.jpg",

  // --- 法律 (Law) ---
  "hukum-1792767922": "assets/images/articles/BEM Ui Dukuh atas.jpg",
  "hukum-1792678077": "assets/images/articles/Police jobs - 4.jpg",
  "hukum-1792665126": "assets/images/articles/Security road.jpg",
  "hukum-1792505458": "assets/images/articles/Police jobs-3.jpg",
  "hukum-1792334834": "assets/images/articles/Police jobs.jpg",

  // --- 首都动态 (Metropolitan) ---
  "metropolitan-1793024041": "assets/images/articles/Cleaning service machine.jpg",
  "metropolitan-1792942444": "assets/images/articles/Suhut.jpg",
  "metropolitan-1792936918": "assets/images/articles/Road Improvement Project.jpg",
  "metropolitan-1792936002": "assets/images/articles/Infrastruktur relationship.jpg",
  "metropolitan-1792764926": "assets/images/articles/Train.jpg",

  // --- 国外新闻 (Foreign News) ---
  "berita-luar-negeri-1793020357": "assets/images/articles/England country.jpg",
  "berita-luar-negeri-1793020287": "assets/images/articles/Meet up.jpg",
  "berita-luar-negeri-1793020240": "assets/images/articles/President - moment 2.jpg",
  "berita-luar-negeri-1793020191": "assets/images/articles/Bolts material.jpg",
  "berita-luar-negeri-1793020136": "assets/images/articles/Market modal.jpg",

  // --- 教育与文化 (Education & Culture) ---
  "pendidikan-kebudayaan-1792159968": "assets/images/articles/PKD.jpg",
  "pendidikan-kebudayaan-1791905274": "assets/images/articles/National working reference.jpg",
  "pendidikan-kebudayaan-1791553638": "assets/images/articles/Teamwork relationships.jpg",
  "pendidikan-kebudayaan-1791443418": "assets/images/articles/Speech.jpg",
  "pendidikan-kebudayaan-1791381594": "assets/images/articles/Speech-2.jpg",

  // --- 华社 (Chinese Community) ---
  "chinese-community-1792942692": "assets/images/articles/Images-2.jpg",
  "chinese-community-1792771332": "assets/images/articles/Community.jpg",
  "chinese-community-1792771116": "assets/images/articles/Speech.jpg",
  "chinese-community-1792770737": "assets/images/articles/Speech-2.jpg",
  "chinese-community-1792770527": "assets/images/articles/Teamwork relationships.jpg",

  // --- 科学与技术 (Science & Technology - Compact) ---
  "science-technology-1792595097": "assets/images/articles/Infrastruktur relationship.jpg",
  "science-technology-1792504793": "assets/images/articles/Police jobs -2.jpg",
  "science-technology-1792504145": "assets/images/articles/PKD.jpg",
  "science-technology-1792402040": "assets/images/articles/Corporate human.jpg",
  "science-technology-1792333245": "assets/images/articles/National working reference.jpg",

  // --- 社论 (Editorial) ---
  "editorial-1793022053": "assets/images/articles/Sir purbaya.jpg",
  "editorial-1792934839": "assets/images/articles/Moneyfestation.jpg",
  "editorial-1792764191": "assets/images/articles/Export textile.jpg",
  "editorial-1792677606": "assets/images/articles/Police jobs -2.jpg",
  "editorial-1792590871": "assets/images/articles/Market modal.jpg",

  // --- 评论 (Opinion - Compact) ---
  "opinion-1788183062": "assets/images/articles/Images - 3.jpg",
  "opinion-1784816528": "assets/images/articles/England country.jpg",

  // --- 健康知识 (Health - Compact) ---
  "kesehatan-1792744525": "assets/images/articles/Mrs. puji.jpg",
  "kesehatan-1791294014": "assets/images/articles/Corporate human.jpg",
  "kesehatan-1791208688": "assets/images/articles/Cleaning service machine.jpg",
  "kesehatan-1790232583": "assets/images/articles/Bolts material.jpg",
  "kesehatan-1788875653": "assets/images/articles/BEM Ui Dukuh atas.jpg",

  // --- 体育 (Sports - Compact) ---
  "sports-1792943277": "assets/images/articles/Meet up.jpg",
  "sports-1792937052": "assets/images/articles/President moment.jpg",
  "sports-1792936981": "assets/images/articles/Air plane.jpg",
  "sports-1792936891": "assets/images/articles/Road Improvement Project.jpg",
  "sports-1792936836": "assets/images/articles/Train.jpg",

  // --- 社会 (Society) ---
  "society-1793022678": "assets/images/articles/Plane.jpg",
  "society-1793022494": "assets/images/articles/Community.jpg",
  "society-1792936058": "assets/images/articles/Corporate human.jpg",
  "society-1792935805": "assets/images/articles/Images - 3.jpg",
  "society-1792768129": "assets/images/articles/National working reference.jpg",

  // --- 特别 (Special Features) ---
  "special-news-1789913890": "assets/images/articles/Speech.jpg",
  "special-news-1789742168": "assets/images/articles/Images-2.jpg",
  "special-news-1789741346": "assets/images/articles/Export textile.jpg",
  "special-news-1789657230": "assets/images/articles/Speech-2.jpg",
  "special-news-1788871340": "assets/images/articles/Gold antara.jpg",

  // --- 娱乐 (Entertainment - Compact) ---
  "entertainment-1793026627": "assets/images/articles/Images-2.jpg",
  "entertainment-1793026057": "assets/images/articles/Images - 3.jpg",
  "entertainment-1792931938": "assets/images/articles/President moment.jpg",
  "entertainment-1792773097": "assets/images/articles/Police jobs - 4.jpg",
  "entertainment-1792772810": "assets/images/articles/Teamwork relationships.jpg",

  // --- 人民福利 (Public Welfare - Compact) ---
  "kesra-1792935381": "assets/images/articles/Bolts material.jpg",
  "kesra-1792744718": "assets/images/articles/Moneyfestation.jpg",
  "kesra-1792593503": "assets/images/articles/Export textile.jpg",
  "kesra-1792505372": "assets/images/articles/Cleaning service machine.jpg",
  "kesra-1791986271": "assets/images/articles/Infrastruktur relationship.jpg",

  // --- 宗教 (Religion - Compact) ---
  "agama-1790603125": "assets/images/articles/Suhut.jpg",
  "agama-1788527820": "assets/images/articles/England country.jpg",
  "agama-1785678771": "assets/images/articles/Speech-2.jpg",
  "agama-1785163205": "assets/images/articles/Community.jpg",

  // --- 东盟动态 (ASEAN - Compact) ---
  "asean-1792942737": "assets/images/articles/Plane.jpg",
  "asean-1792750018": "assets/images/articles/Forek Hulu Migas.jpg",
  "asean-1792456939": "assets/images/articles/Speech.jpg",
  "asean-1792420118": "assets/images/articles/Community.jpg",
  "asean-1792073980": "assets/images/articles/Bank of china.jpg"
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
  var manual = window.SHANGBAO_IMAGES ? window.SHANGBAO_IMAGES[articleId] : null;
  var pool = window.SHANGBAO_IMAGE_POOL || [];
  var isHero = img.classList.contains('hero-photo');

  if (stage === 0) {
    // Stage 0: Priority 1 - Explicit article ID mapping from window.SHANGBAO_IMAGES
    if (manual && manual !== img.getAttribute('src')) {
      img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 1); };
      img.src = manual;
      return;
    }
    stage = 1;
  }

  if (stage === 1) {
    // Stage 1: Priority 2 - Existing local image pool via deterministic hash
    if (pool && pool.length > 0) {
      var hash = 0;
      var str = articleId || 'default';
      for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
      }
      var poolIndex = Math.abs(hash) % pool.length;
      var poolSrc = pool[poolIndex];
      if (poolSrc && poolSrc !== img.getAttribute('src')) {
        img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 2); };
        img.src = poolSrc;
        return;
      }
    }
    stage = 2;
  }

  if (stage === 2) {
    // Stage 2: Priority 3 - Verified default local photograph (no non-existent filenames)
    var defaultPhoto = isHero ?
      'assets/images/articles/Gas station.jpg' :
      'assets/images/articles/Corporate human.jpg';
    if (img.getAttribute('src') !== defaultPhoto) {
      img.onerror = function() { window.shangbaoHandleImgFallback(img, articleId, 3); };
      img.src = defaultPhoto;
      return;
    }
    stage = 3;
  }

  // Stage 3 & 4: Last-resort technical fallback to SVG placeholder asset
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
