/**
 * i18n.js — Shangbao Indonesia Offline-First UI Localization
 * Supports: zh-CN (default), en, id
 * Usage:
 *   window.SHANGBAO_I18N.setLocale('en')
 *   window.SHANGBAO_I18N.t('search')  → 'Search'
 *   window.SHANGBAO_I18N.applyAll()   → updates all [data-i18n] elements
 */
(() => {
  'use strict';

  const STORAGE_KEY  = 'shangbao_locale';
  const VALID_LOCALES = ['zh-CN', 'en', 'id'];
  const DEFAULT_LOCALE = 'zh-CN';

  /* ================================================================
     TRANSLATION DICTIONARY
     All visible UI strings in all three languages.
     Keys map 1-to-1 with data-i18n attribute values in HTML/JS.
  ================================================================ */
  const T = {
    'zh-CN': {
      /* --- Navigation & header --- */
      home:              '首页',
      selectLanguage:    '语言选择',
      langZh:            '中文',
      langEn:            'English',
      langId:            'Bahasa Indonesia',
      searchLabel:       '搜索新闻',
      searchPlaceholder: '检索新闻关键词…',
      searchSubmit:      '搜索',
      searchClear:       '清空',
      searchClose:       '关闭搜索',
      openSearch:        '打开搜索',
      mobileMenu:        '栏目',

      /* --- Nav categories --- */
      nav_热点新闻:  '热点新闻',
      nav_政治:      '政治',
      nav_法律:      '法律',
      nav_首都动态:  '首都动态',
      nav_国外新闻:  '国外新闻',
      nav_教育与文化:'教育与文化',
      nav_华社:      '华社',
      nav_科学与技术:'科学与技术',
      nav_社论:      '社论',
      nav_评论:      '评论',
      nav_健康知识:  '健康知识',
      nav_体育:      '体育',
      nav_社会:      '社会',
      nav_特别:      '特别',
      nav_娱乐:      '娱乐',
      nav_人民福利:  '人民福利',
      nav_宗教:      '宗教',
      nav_东盟动态:  '东盟动态',
      nav_财经:      '财经',
      nav_金融:      '金融',
      nav_广告:      '广告',
      nav_视频:      '视频',

      /* --- Homepage section headings --- */
      featuredNews:  '热点新闻',
      readMore:      '查看更多 »',
      moreNews:      '更多新闻',
      breaking:      '熱點新聞',

      /* --- Category labels (section headings) --- */
      cat_热点新闻:  '热点新闻',
      cat_政治:      '政治',
      cat_法律:      '法律',
      cat_首都动态:  '首都动态',
      cat_国外新闻:  '国外新闻',
      cat_教育与文化:'教育与文化',
      cat_华社:      '华社',
      cat_科学与技术:'科学与技术',
      cat_社论:      '社论',
      cat_评论:      '评论',
      cat_健康知识:  '健康知识',
      cat_体育:      '体育',
      cat_社会:      '社会',
      cat_特别:      '特别',
      cat_娱乐:      '娱乐',
      cat_人民福利:  '人民福利',
      cat_宗教:      '宗教',
      cat_东盟动态:  '东盟动态',
      cat_财经:      '财经',
      cat_金融:      '金融',

      /* --- Sidebar --- */
      popularTab:         '热文推荐',
      mostReadTab:        '最多阅读者',
      hotColumn:          '热点专栏',
      resourceIndustry:   '资源与工业',
      financeWatch:       '金融微观察',
      corporateSection:   '企业与机构专栏',
      todayNews:          '今日要闻',
      moreFinance:        '更多 »',
      sidebarAd:          '印尼商报推广合作',
      fieldObservation:   '实地观察',
      exchangeRates:      '汇市动态',
      learnMore:          '了解更多资讯 »',
      viewFinance:        '查看财经专栏 »',
      noPopular:          '暂无推荐新闻',

      /* --- Search results --- */
      searchResultsHeading: '搜索结果：',
      searchResultsCount:   '{total} 条结果',
      searchResultsShowing: '显示 {shown} / {total} 条',
      searchNoResults:      '没有找到匹配的新闻标题或摘要。',
      searchEmpty:          '请输入关键词后搜索。',
      searchLoadMore:       '加载更多结果',

      /* --- Article view --- */
      backHome:            '← 返回首页',
      articleNote:         '说明：提供的 HTML 是首页快照，并没有完整新闻正文。这里展示的是可用于重建 UI 的本地文章预览，而非原文全文。',
      openOriginal:        '在 Shangbao 原网站打开这篇文章 ↗',
      translateArticle:    '翻译文章',
      viewOriginal:        '查看原文',
      translating:         '翻译中…',
      translationLabel:    '机器翻译',
      articleBreadcrumbHome: '首页',
      articleViewCount:    '阅读量',
      articleSource:       '来源出处',
      articleAuthor:       '责任编辑',
      articleOriginalLink: '查看官方原版报道',
      articleShare:        '分享到：',
      articleShareCopied:  '已复制链接到剪贴板！',
      articleRelatedNews:  '相关新闻推荐',
      articlePrev:         '上一篇',
      articleNext:         '下一篇',
      articleNoMorePrev:   '已经是第一篇了',
      articleNoMoreNext:   '已经是最后一篇了',
      articleNotFoundTitle:'文章未找到',
      articleNotFoundDesc: '抱歉，您访问的新闻文章不存在或已被移动。',
      articleExcerptNoticeTitle: '简讯报道',
      articleExcerptNoticeDesc: '本文为印尼商报官方快讯摘要。完整报道及相关图文版权归官方刊物所有，请访问官方原版链接查阅。',
      openOriginalOnShangbao: '查看官方原版报道',
      translationBy:       '由 Google Cloud Translation 提供',
      noExcerpt:           '此页面快照未包含这篇文章的完整正文。',
      sourceLabel:         '来源',
      dateLabel:           '日期',
      categoryLabel:       '分类',
      relatedArticles:     '相关文章',

      /* --- Footer --- */
      footerLinks:         '友情链接:',
      footerAbout:         '关于我们',
      footerBoard:         '董事经理',
      footerContact:       '联系我们',
      footerCopyright:     '© 2024 Shangbao Indonesia · Reconstruction prototype',
      footerExternal:      '印尼商报网',

      /* --- Error messages --- */
      err_notConfigured:   '翻译服务尚未配置。请联系管理员设置 API 凭据。',
      err_networkUnavailable: '翻译服务暂时不可用，请检查网络连接后重试。',
      err_authError:       'API 认证失败，请检查服务配置。',
      err_quotaExceeded:   '翻译配额已用尽，请稍后再试。',
      err_rateLimited:     '请求过于频繁，请稍后再试。',
      err_timeout:         '翻译请求超时，请稍后重试。',
      err_unavailable:     '翻译服务暂时不可用，请稍后再试。',
      err_invalidRequest:  '翻译请求无效。',
      err_unsupportedLang: '不支持该语言组合。',
      err_failed:          '翻译失败，请稍后再试。',
      err_retry:           '重试',

      /* --- Page-wide translation status --- */
      translatingNews:     '正在翻译新闻内容…',
      translationComplete: '新闻内容翻译完成。',
      translationPartial:  '部分内容无法完成翻译。',
      retryTranslation:    '重试',
    },

    en: {
      /* --- Navigation & header --- */
      home:              'Home',
      selectLanguage:    'Select Language',
      langZh:            '中文',
      langEn:            'English',
      langId:            'Bahasa Indonesia',
      searchLabel:       'Search news',
      searchPlaceholder: 'Search news keywords…',
      searchSubmit:      'Search',
      searchClear:       'Clear',
      searchClose:       'Close search',
      openSearch:        'Open search',
      mobileMenu:        'Menu',

      /* --- Nav categories --- */
      nav_热点新闻:  'Hot News',
      nav_政治:      'Politics',
      nav_法律:      'Law',
      nav_首都动态:  'Metropolitan',
      nav_国外新闻:  'International',
      nav_教育与文化:'Education & Culture',
      nav_华社:      'Chinese Community',
      nav_科学与技术:'Science & Technology',
      nav_社论:      'Editorial',
      nav_评论:      'Opinion',
      nav_健康知识:  'Health',
      nav_体育:      'Sports',
      nav_社会:      'Society',
      nav_特别:      'Special',
      nav_娱乐:      'Entertainment',
      nav_人民福利:  'People\'s Welfare',
      nav_宗教:      'Religion',
      nav_东盟动态:  'ASEAN News',
      nav_财经:      'Economy',
      nav_金融:      'Finance',
      nav_广告:      'Ads',
      nav_视频:      'Video',

      /* --- Homepage section headings --- */
      featuredNews:  'Hot News',
      readMore:      'More »',
      moreNews:      'More News',
      breaking:      'Breaking News',

      /* --- Category labels --- */
      cat_热点新闻:  'Hot News',
      cat_政治:      'Politics',
      cat_法律:      'Law',
      cat_首都动态:  'Metropolitan',
      cat_国外新闻:  'International',
      cat_教育与文化:'Education & Culture',
      cat_华社:      'Chinese Community',
      cat_科学与技术:'Science & Technology',
      cat_社论:      'Editorial',
      cat_评论:      'Opinion',
      cat_健康知识:  'Health',
      cat_体育:      'Sports',
      cat_社会:      'Society',
      cat_特别:      'Special',
      cat_娱乐:      'Entertainment',
      cat_人民福利:  'People\'s Welfare',
      cat_宗教:      'Religion',
      cat_东盟动态:  'ASEAN News',
      cat_财经:      'Economy',
      cat_金融:      'Finance',

      /* --- Sidebar --- */
      popularTab:         'Recommended',
      mostReadTab:        'Most Read',
      hotColumn:          'Featured',
      resourceIndustry:   'Resources & Industry',
      financeWatch:       'Finance Watch',
      corporateSection:   'Corporate Partners',
      todayNews:          'Today\'s News',
      moreFinance:        'More »',
      sidebarAd:          'Advertising',
      fieldObservation:   'Field Report',
      exchangeRates:      'Exchange Rates',
      learnMore:          'Learn More »',
      viewFinance:        'View Finance »',
      noPopular:          'No recommended articles.',

      /* --- Search results --- */
      searchResultsHeading: 'Search Results: ',
      searchResultsCount:   '{total} results',
      searchResultsShowing: 'Showing {shown} of {total}',
      searchNoResults:      'No articles found matching your search.',
      searchEmpty:          'Enter a keyword to search.',
      searchLoadMore:       'Load more results',

      /* --- Article view --- */
      backHome:            '← Back to Home',
      articleNote:         'Note: The source is a homepage snapshot. Only article metadata and excerpts are available locally — not the full article body.',
      openOriginal:        'Open this article on Shangbao website ↗',
      translateArticle:    'Translate Article',
      viewOriginal:        'View Original',
      translating:         'Translating…',
      translationLabel:    'Machine Translation',
      articleBreadcrumbHome: 'Home',
      articleViewCount:    'Views',
      articleSource:       'Source',
      articleAuthor:       'Editor / Author',
      articleOriginalLink: 'View Official Original Report',
      articleShare:        'Share:',
      articleShareCopied:  'Link copied to clipboard!',
      articleRelatedNews:  'Related News',
      articlePrev:         'Previous Article',
      articleNext:         'Next Article',
      articleNoMorePrev:   'This is the first article',
      articleNoMoreNext:   'This is the last article',
      articleNotFoundTitle:'Article Not Found',
      articleNotFoundDesc: 'Sorry, the requested news article could not be found or has been moved.',
      articleExcerptNoticeTitle: 'News Summary',
      articleExcerptNoticeDesc: 'This article is an authenticated summary from Shangbao Indonesia. For the complete publication and copyright-protected materials, please consult the official source link.',
      openOriginalOnShangbao: 'Read Full Story on Official Website',
      translationBy:       'Powered by Google Cloud Translation',
      noExcerpt:           'Full article body is not available in the local dataset.',
      sourceLabel:         'Source',
      dateLabel:           'Date',
      categoryLabel:       'Category',
      relatedArticles:     'Related Articles',

      /* --- Footer --- */
      footerLinks:         'Links:',
      footerAbout:         'About Us',
      footerBoard:         'Board & Management',
      footerContact:       'Contact Us',
      footerCopyright:     '© 2024 Shangbao Indonesia · Reconstruction prototype',
      footerExternal:      'Shangbao Indonesia',

      /* --- Error messages --- */
      err_notConfigured:   'Translation service is not configured. Please contact the administrator.',
      err_networkUnavailable: 'Translation service is temporarily unavailable. Please check your connection and try again.',
      err_authError:       'API authentication failed. Please check the service configuration.',
      err_quotaExceeded:   'Translation quota exceeded. Please try again later.',
      err_rateLimited:     'Too many requests. Please wait a moment and try again.',
      err_timeout:         'Translation request timed out. Please try again.',
      err_unavailable:     'Translation service is temporarily unavailable. Please try again later.',
      err_invalidRequest:  'Invalid translation request.',
      err_unsupportedLang: 'This language combination is not supported.',
      err_failed:          'Translation failed. Please try again later.',
      err_retry:           'Retry',

      /* --- Page-wide translation status --- */
      translatingNews:     'Translating news content…',
      translationComplete: 'News translation complete.',
      translationPartial:  'Some content could not be translated.',
      retryTranslation:    'Retry',
    },

    id: {
      /* --- Navigation & header --- */
      home:              'Beranda',
      selectLanguage:    'Pilih Bahasa',
      langZh:            '中文',
      langEn:            'English',
      langId:            'Bahasa Indonesia',
      searchLabel:       'Cari berita',
      searchPlaceholder: 'Cari kata kunci berita…',
      searchSubmit:      'Cari',
      searchClear:       'Hapus',
      searchClose:       'Tutup pencarian',
      openSearch:        'Buka pencarian',
      mobileMenu:        'Menu',

      /* --- Nav categories --- */
      nav_热点新闻:  'Berita Terkini',
      nav_政治:      'Politik',
      nav_法律:      'Hukum',
      nav_首都动态:  'Metropolitan',
      nav_国外新闻:  'Berita Luar Negeri',
      nav_教育与文化:'Pendidikan & Budaya',
      nav_华社:      'Komunitas Tionghoa',
      nav_科学与技术:'Sains & Teknologi',
      nav_社论:      'Editorial',
      nav_评论:      'Opini',
      nav_健康知识:  'Kesehatan',
      nav_体育:      'Olahraga',
      nav_社会:      'Masyarakat',
      nav_特别:      'Khusus',
      nav_娱乐:      'Hiburan',
      nav_人民福利:  'Kesejahteraan',
      nav_宗教:      'Agama',
      nav_东盟动态:  'ASEAN',
      nav_财经:      'Ekonomi',
      nav_金融:      'Keuangan',
      nav_广告:      'Iklan',
      nav_视频:      'Video',

      /* --- Homepage section headings --- */
      featuredNews:  'Berita Terkini',
      readMore:      'Selengkapnya »',
      moreNews:      'Berita Lainnya',
      breaking:      'Berita Hangat',

      /* --- Category labels --- */
      cat_热点新闻:  'Berita Terkini',
      cat_政治:      'Politik',
      cat_法律:      'Hukum',
      cat_首都动态:  'Metropolitan',
      cat_国外新闻:  'Berita Luar Negeri',
      cat_教育与文化:'Pendidikan & Budaya',
      cat_华社:      'Komunitas Tionghoa',
      cat_科学与技术:'Sains & Teknologi',
      cat_社论:      'Editorial',
      cat_评论:      'Opini',
      cat_健康知识:  'Kesehatan',
      cat_体育:      'Olahraga',
      cat_社会:      'Masyarakat',
      cat_特别:      'Khusus',
      cat_娱乐:      'Hiburan',
      cat_人民福利:  'Kesejahteraan',
      cat_宗教:      'Agama',
      cat_东盟动态:  'ASEAN',
      cat_财经:      'Ekonomi',
      cat_金融:      'Keuangan',

      /* --- Sidebar --- */
      popularTab:         'Rekomendasi',
      mostReadTab:        'Paling Banyak Dibaca',
      hotColumn:          'Kolom Pilihan',
      resourceIndustry:   'Sumber Daya & Industri',
      financeWatch:       'Pantau Keuangan',
      corporateSection:   'Kolom Korporat',
      todayNews:          'Berita Hari Ini',
      moreFinance:        'Selengkapnya »',
      sidebarAd:          'Iklan',
      fieldObservation:   'Laporan Lapangan',
      exchangeRates:      'Kurs Mata Uang',
      learnMore:          'Pelajari Lebih Lanjut »',
      viewFinance:        'Lihat Kolom Keuangan »',
      noPopular:          'Belum ada artikel yang direkomendasikan.',

      /* --- Search results --- */
      searchResultsHeading: 'Hasil Pencarian: ',
      searchResultsCount:   '{total} hasil ditemukan',
      searchResultsShowing: 'Menampilkan {shown} dari {total}',
      searchNoResults:      'Tidak ada artikel yang sesuai dengan pencarian Anda.',
      searchEmpty:          'Masukkan kata kunci untuk mencari.',
      searchLoadMore:       'Muat lebih banyak hasil',

      /* --- Article view --- */
      backHome:            '← Kembali ke Beranda',
      articleNote:         'Catatan: Sumber data adalah snapshot halaman utama. Hanya metadata dan ringkasan artikel yang tersedia secara lokal — bukan isi artikel lengkap.',
      openOriginal:        'Buka artikel ini di website Shangbao ↗',
      translateArticle:    'Terjemahkan Artikel',
      viewOriginal:        'Lihat Versi Asli',
      translating:         'Menerjemahkan…',
      translationLabel:    'Terjemahan Mesin',
      articleBreadcrumbHome: 'Beranda',
      articleViewCount:    'Dilihat',
      articleSource:       'Sumber',
      articleAuthor:       'Editor / Penulis',
      articleOriginalLink: 'Lihat Laporan Asli Resmi',
      articleShare:        'Bagikan:',
      articleShareCopied:  'Tautan disalin ke papan klip!',
      articleRelatedNews:  'Berita Terkait',
      articlePrev:         'Artikel Sebelumnya',
      articleNext:         'Artikel Berikutnya',
      articleNoMorePrev:   'Ini adalah artikel pertama',
      articleNoMoreNext:   'Ini adalah artikel terakhir',
      articleNotFoundTitle:'Artikel Tidak Ditemukan',
      articleNotFoundDesc: 'Maaf, artikel berita yang Anda cari tidak ditemukan atau telah dipindahkan.',
      articleExcerptNoticeTitle: 'Ringkasan Berita',
      articleExcerptNoticeDesc: 'Artikel ini merupakan ringkasan resmi dari Shangbao Indonesia. Untuk publikasi lengkap dan materi berhak cipta, silakan kunjungi tautan sumber resmi.',
      openOriginalOnShangbao: 'Baca Liputan Lengkap di Situs Resmi',
      translationBy:       'Didukung oleh Google Cloud Translation',
      noExcerpt:           'Isi artikel lengkap tidak tersedia dalam dataset lokal.',
      sourceLabel:         'Sumber',
      dateLabel:           'Tanggal',
      categoryLabel:       'Kategori',
      relatedArticles:     'Artikel Terkait',

      /* --- Footer --- */
      footerLinks:         'Tautan:',
      footerAbout:         'Tentang Kami',
      footerBoard:         'Direksi & Manajemen',
      footerContact:       'Hubungi Kami',
      footerCopyright:     '© 2024 Shangbao Indonesia · Prototipe rekonstruksi',
      footerExternal:      'Shangbao Indonesia',

      /* --- Error messages --- */
      err_notConfigured:   'Layanan terjemahan belum dikonfigurasi. Silakan hubungi administrator.',
      err_networkUnavailable: 'Layanan terjemahan sementara tidak tersedia. Silakan periksa koneksi internet dan coba kembali.',
      err_authError:       'Autentikasi API gagal. Periksa konfigurasi layanan.',
      err_quotaExceeded:   'Kuota terjemahan habis. Silakan coba lagi nanti.',
      err_rateLimited:     'Terlalu banyak permintaan. Harap tunggu sebentar.',
      err_timeout:         'Permintaan terjemahan habis waktu. Silakan coba lagi.',
      err_unavailable:     'Layanan terjemahan sementara tidak tersedia. Coba lagi nanti.',
      err_invalidRequest:  'Permintaan terjemahan tidak valid.',
      err_unsupportedLang: 'Kombinasi bahasa ini tidak didukung.',
      err_failed:          'Terjemahan gagal. Silakan coba lagi nanti.',
      err_retry:           'Coba Lagi',

      /* --- Page-wide translation status --- */
      translatingNews:     'Menerjemahkan konten berita…',
      translationComplete: 'Terjemahan berita selesai.',
      translationPartial:  'Sebagian konten gagal diterjemahkan.',
      retryTranslation:    'Coba Lagi',
    }
  };

  /* ================================================================
     ERROR CODE → KEY MAP
  ================================================================ */
  const ERROR_KEY_MAP = {
    TRANSLATION_NOT_CONFIGURED:  'err_notConfigured',
    NETWORK_UNAVAILABLE:         'err_networkUnavailable',
    PROVIDER_AUTH_ERROR:         'err_authError',
    PROVIDER_QUOTA_EXCEEDED:     'err_quotaExceeded',
    PROVIDER_RATE_LIMITED:       'err_rateLimited',
    PROVIDER_TIMEOUT:            'err_timeout',
    PROVIDER_SERVICE_UNAVAILABLE:'err_unavailable',
    INVALID_REQUEST:             'err_invalidRequest',
    UNSUPPORTED_LANGUAGE:        'err_unsupportedLang',
    TRANSLATION_FAILED:          'err_failed',
  };

  /* ================================================================
     LOCALE MANAGER
  ================================================================ */
  let _locale = DEFAULT_LOCALE;

  function _loadSavedLocale() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && VALID_LOCALES.includes(saved)) return saved;
    } catch (_) { /* localStorage blocked */ }
    return DEFAULT_LOCALE;
  }

  function _saveLocale(locale) {
    try { localStorage.setItem(STORAGE_KEY, locale); } catch (_) {}
  }

  /** Return translation string for key in current locale, with fallback chain. */
  function t(key, params) {
    const dict = T[_locale] || T[DEFAULT_LOCALE];
    const fallback = T[DEFAULT_LOCALE];
    let str = dict[key] !== undefined ? dict[key] : (fallback[key] !== undefined ? fallback[key] : key);
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(k => {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
      });
    }
    return str;
  }

  /** Get translation for an error code. */
  function tError(errorCode) {
    const key = ERROR_KEY_MAP[errorCode] || 'err_failed';
    return t(key);
  }

  /** Set locale and update UI. */
  function setLocale(locale) {
    if (!VALID_LOCALES.includes(locale)) locale = DEFAULT_LOCALE;
    _locale = locale;
    _saveLocale(locale);
    document.documentElement.setAttribute('lang',
      locale === 'zh-CN' ? 'zh-Hans' :
      locale === 'id'    ? 'id'      : 'en');
    applyAll();
    _updateLangSelector();
    // Dispatch custom event for app.js to react
    document.dispatchEvent(new CustomEvent('shangbao:localechange', { detail: { locale } }));
  }

  /** Current locale. */
  function getLocale() { return _locale; }

  /** Whether current locale is non-Chinese (needs translation UI). */
  function isTranslatable() { return _locale !== 'zh-CN'; }

  /** Apply translations to all [data-i18n] elements in the DOM. */
  function applyAll(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr'); // optional: 'placeholder', 'aria-label', etc.
      const str = t(key);
      if (attr) {
        el.setAttribute(attr, str);
      } else {
        el.textContent = str;
      }
    });
  }

  /** Update the language selector active state. */
  function _updateLangSelector() {
    const selector = document.getElementById('langSelector');
    if (!selector) return;
    const btn = selector.querySelector('.lang-current');
    if (btn) {
      const labels = { 'zh-CN': '中文', 'en': 'English', 'id': 'Indonesia' };
      btn.textContent = labels[_locale] || '中文';
    }
    selector.querySelectorAll('[data-locale]').forEach(opt => {
      const isActive = opt.dataset.locale === _locale;
      opt.setAttribute('aria-selected', String(isActive));
      opt.classList.toggle('active', isActive);
    });
  }

  /* ================================================================
     INIT
  ================================================================ */
  _locale = _loadSavedLocale();

  // Expose public API
  window.SHANGBAO_I18N = {
    t,
    tError,
    setLocale,
    getLocale,
    isTranslatable,
    applyAll,
    VALID_LOCALES,
    DEFAULT_LOCALE,
  };

})();

