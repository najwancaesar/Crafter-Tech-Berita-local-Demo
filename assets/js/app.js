(() => {
  'use strict';
  const data = window.SHANGBAO_DATA || {navigation:[],ticker:[],features:[],categories:[],popular:[],articles:[]};
  const byId = new Map(data.articles.map(a => [a.id, a]));
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const text = value => String(value ?? '').trim();
  const articleHref = a => `#article/${encodeURIComponent(a.id)}`;
  const sourceDate = a => a.date || '首页快照未提供日期';
  const sceneHue = a => ((Number(a.imageKey || 0) * 29 + 18) % 360);
  const IMG = window.SHANGBAO_IMAGES || {};
  const POOL = window.SHANGBAO_IMAGE_POOL || [];

  // i18n & translation helpers
  const i18n = window.SHANGBAO_I18N;
  const t = (key, params) => i18n ? i18n.t(key, params) : key;

  function getLocalized(a) {
    if (window.SHANGBAO_TRANSLATE) {
      return window.SHANGBAO_TRANSLATE.getLocalizedArticle(a);
    }
    return a;
  }

  function getCategoryName(categoryName) {
    if (window.SHANGBAO_TRANSLATE) {
      return window.SHANGBAO_TRANSLATE.getLocalizedCategory(categoryName);
    }
    return categoryName;
  }

  function getNavLabel(rawLabel) {
    if (!i18n) return rawLabel;
    const key = `nav_${rawLabel}`;
    const trans = i18n.t(key);
    return (trans && trans !== key) ? trans : rawLabel;
  }

  /* ----------------------------------------------------------------
     IMAGE HELPERS
  ---------------------------------------------------------------- */
  function getCandidateSrc(a) {
    const map = window.SHANGBAO_IMAGES || IMG;
    if (a && a.id && map[a.id]) return map[a.id];
    const pool = (window.SHANGBAO_IMAGE_POOL && window.SHANGBAO_IMAGE_POOL.length) ? window.SHANGBAO_IMAGE_POOL : POOL;
    if (pool.length > 0 && a && a.id) {
      let hash = 0;
      for (let i = 0; i < a.id.length; i++) hash = ((hash << 5) - hash + a.id.charCodeAt(i)) | 0;
      return pool[Math.abs(hash) % pool.length];
    }
    return pool.length > 0 ? pool[0] : 'assets/images/placeholders/news-placeholder.svg';
  }

  function scene(a, className='') {
    const candidate = getCandidateSrc(a);
    return `<div class="news-scene has-photo ${className}">
      <img class="news-photo" src="${esc(candidate)}" alt="${esc(a.title)}" loading="lazy"
        onerror="window.shangbaoHandleImgFallback && window.shangbaoHandleImgFallback(this, '${esc(a.id)}', 0)">
      <div class="scene-placeholder" style="--hue:${sceneHue(a)}" aria-label="新闻图片占位" hidden>
        <span class="scene-label">图片待替换</span>
      </div>
    </div>`;
  }

  function articleLink(a, cls='') {
    const la = getLocalized(a);
    return `<a class="${cls}" href="${articleHref(a)}" data-article-id="${esc(a.id)}">${esc(la.title)}</a>`;
  }

  /* ----------------------------------------------------------------
     NAVIGATION
  ---------------------------------------------------------------- */
  function renderNav() {
    const navPrimary = $('#siteNav');
    const navSub     = $('#siteNavSub');
    const all = data.navigation.length ? data.navigation : [{label:'首页',path:''}];
    const PRIMARY_MAX = 17;
    const primary   = all.slice(0, PRIMARY_MAX);
    const secondary = all.slice(PRIMARY_MAX);

    navPrimary.innerHTML = primary.map((n, i) => {
      const dispLabel = getNavLabel(n.label);
      return `<a class="nav-link ${i===0?'home active':''}" href="${n.path ? `#category/${encodeURIComponent(n.label)}` : '#home'}" data-nav-label="${esc(n.label)}">${i===0?'<svg class="home-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>':esc(dispLabel)}</a>`;
    }).join('');

    if (navSub) {
      navSub.innerHTML = secondary.map(n => {
        const dispLabel = getNavLabel(n.label);
        return `<a class="nav-link-sub" href="#category/${encodeURIComponent(n.label)}" data-nav-label="${esc(n.label)}">${esc(dispLabel)}</a>`;
      }).join('');
    }
  }

  // Live clock
  function startClock() {
    const el = document.getElementById('weatherTime');
    if (!el) return;
    function tick() {
      const now = new Date();
      el.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0')).join(':');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ----------------------------------------------------------------
     TICKER
  ---------------------------------------------------------------- */
  function renderTicker() {
    const stories = data.ticker.map(id => byId.get(id)).filter(Boolean);
    const items = (stories.length ? stories : data.articles.slice(0, 5));
    const oneSet = items.map(a => {
      const la = getLocalized(a);
      return `<a href="${articleHref(a)}" data-article-id="${esc(a.id)}"><b>【${esc(la.category)}】</b> ${esc(la.title)}</a>`;
    }).join('');
    $('#tickerTrack').innerHTML = oneSet + oneSet;
  }

  /* ----------------------------------------------------------------
     HERO CAROUSEL
  ---------------------------------------------------------------- */
  let slideIndex = 0;
  function renderHero() {
    const slides = data.features.map(id => byId.get(id)).filter(Boolean).slice(0, 10);
    const list = slides.length ? slides : data.articles.slice(0, 5);
    $('#heroCarousel').innerHTML = list.map((a, i) => {
      const candidate = getCandidateSrc(a);
      return `<article class="hero-slide ${i===slideIndex?'active':''}" data-slide="${i}">
        <div class="hero-art has-photo">
          <img class="hero-photo" src="${esc(candidate)}" alt="${esc(a.title)}"
            onerror="window.shangbaoHandleImgFallback && window.shangbaoHandleImgFallback(this, '${esc(a.id)}', 0)">
          <div class="hero-art-inner" style="--hue:${sceneHue(a)}" hidden>
            <span class="art-orb"></span><span class="art-building"></span><span class="art-building two"></span><span class="art-building three"></span>
            <span class="hero-art-label">新闻头条 · 图片占位</span>
          </div>
        </div>
        <div class="hero-caption">
          <h1>${articleLink(a)}</h1>
          <div class="meta"><i class="fa-clock" aria-hidden="true">⏱</i> ${esc(sourceDate(a))}</div>
        </div>
      </article>`;
    }).join('');
    $('#carouselDots').innerHTML = list.map((_, i) => `<button type="button" class="${i===slideIndex?'active':''}" data-dot="${i}" aria-label="第 ${i+1} 条头条新闻"></button>`).join('');
  }

  function setSlide(index) {
    const slides = $$('.hero-slide', $('#heroCarousel'));
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
    $$('#carouselDots button').forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
  }

  /* ----------------------------------------------------------------
     POPULAR / SIDEBAR
  ---------------------------------------------------------------- */
  function renderPopular(isMostRead = false) {
    const listEl = $('#popularList');
    if (!listEl) return;
    const offset = isMostRead ? 5 : 0;
    const stories = data.popular.slice(offset, offset + 5).map(id => byId.get(id)).filter(Boolean);
    const list = stories.length ? stories : data.articles.slice(offset, offset + 5);
    listEl.innerHTML = list.map((a, i) =>
      `<li><span class="popular-num">${String(i + 1).padStart(2, '0')}</span>${articleLink(a)}</li>`
    ).join('') || `<li>${t('noPopular')}</li>`;

    const highlightIds = [
      'politics-1792679463', 'metropolitan-1792764926',
      'chinese-community-1792771116', 'editorial-1793022053'
    ];
    const quick = highlightIds.map(id => byId.get(id)).filter(Boolean);
    const sideHighlights = $('#sideHighlights');
    if (sideHighlights) {
      sideHighlights.innerHTML = quick.map(a =>
        `<article class="side-highlight">${scene(a)}<div><h3>${articleLink(a)}</h3><p>⏱ ${esc(sourceDate(a))}</p></div></article>`
      ).join('');
    }
  }

  /* ----------------------------------------------------------------
     SIDEBAR CAROUSEL
  ---------------------------------------------------------------- */
  const SIDEBAR_SLIDES = [
    { src: 'assets/images/sidebar/Infrastruktur relationship.jpg', badge: '专题视点', title: '印新两国外长举行闭门会晤', sub: '针对核心敏感议题深入对表', href: '#category/国外新闻', isExternal: false },
    { src: 'assets/images/articles/Plane.jpg', badge: '特别行动', title: '空军开展人工降雨作业', sub: '调集运输机与专业设备加速灭火', href: '#category/社会', isExternal: false },
    { src: 'assets/images/articles/Forek Hulu Migas.jpg', badge: '能源政经', title: '推进上游油气投资峰会', sub: '多方签署合作协议保障能源发展', href: '#category/政治', isExternal: false },
    { src: 'assets/images/articles/Air plane.jpg', badge: '交通民生', title: '交通部拟调降航季机票价格', sub: '优化运力配置便利节假日出行', href: '#category/财经', isExternal: false }
  ];

  let sbSlideIndex = 0;
  let sbTimer = null;

  function initSidebarCarousel() {
    const track     = $('#sidebarCarouselTrack');
    const dotsWrap  = $('#sidebarCarouselDots');
    const counter   = $('#sidebarCarouselCounter');
    const container = $('#sidebarCarousel');
    if (!track || !container) return;

    track.innerHTML = SIDEBAR_SLIDES.map((s, i) => `
      <div class="sidebar-slide ${i === 0 ? 'active' : ''}" data-sidebar-slide="${i}"
        role="group" aria-roledescription="slide" aria-label="第 ${i + 1} 条，共 ${SIDEBAR_SLIDES.length} 条"
        aria-hidden="${i === 0 ? 'false' : 'true'}">
        <a href="${esc(s.href)}" class="sidebar-slide-link" tabindex="${i === 0 ? '0' : '-1'}"
          ${s.isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          <img src="${esc(s.src)}" alt="${esc(s.title)}" class="sidebar-slide-img"
            loading="${i === 0 ? 'eager' : 'lazy'}" width="360" height="225">
          <div class="sidebar-slide-caption">
            <span class="sidebar-slide-badge">${esc(s.badge)}</span>
            <h4 class="sidebar-slide-title">${esc(s.title)}</h4>
            <p class="sidebar-slide-sub">${esc(s.sub)}</p>
          </div>
        </a>
      </div>
    `).join('');

    if (dotsWrap) {
      dotsWrap.innerHTML = SIDEBAR_SLIDES.map((_, i) => `
        <button type="button" class="sidebar-carousel-dot ${i === 0 ? 'active' : ''}"
          role="tab" data-sb-dot="${i}" aria-label="第 ${i + 1} 张轮播图"
          aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}"></button>
      `).join('');
    }

    function setSbSlide(idx) {
      const slides = $$('.sidebar-slide', track);
      if (!slides.length) return;
      sbSlideIndex = (idx + slides.length) % slides.length;
      slides.forEach((sl, i) => {
        const isActive = (i === sbSlideIndex);
        sl.classList.toggle('active', isActive);
        sl.setAttribute('aria-hidden', String(!isActive));
        const link = sl.querySelector('a');
        if (link) link.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      if (dotsWrap) {
        $$('.sidebar-carousel-dot', dotsWrap).forEach((dot, i) => {
          const isActive = (i === sbSlideIndex);
          dot.classList.toggle('active', isActive);
          dot.setAttribute('aria-selected', String(isActive));
          dot.setAttribute('tabindex', isActive ? '0' : '-1');
        });
      }
      if (counter) counter.textContent = `${sbSlideIndex + 1} / ${SIDEBAR_SLIDES.length}`;
    }

    function startAuto() {
      stopAuto();
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (document.hidden) return;
      sbTimer = setInterval(() => setSbSlide(sbSlideIndex + 1), 5000);
    }
    function stopAuto() {
      if (sbTimer) { clearInterval(sbTimer); sbTimer = null; }
    }

    const prevBtn = $('#sbCarouselPrev');
    const nextBtn = $('#sbCarouselNext');
    if (prevBtn) prevBtn.onclick = () => { setSbSlide(sbSlideIndex - 1); startAuto(); };
    if (nextBtn) nextBtn.onclick = () => { setSbSlide(sbSlideIndex + 1); startAuto(); };

    if (dotsWrap) {
      dotsWrap.onclick = e => {
        const btn = e.target.closest('[data-sb-dot]');
        if (btn) { setSbSlide(Number(btn.dataset.sbDot)); startAuto(); }
      };
    }

    container.addEventListener('mouseenter', stopAuto);
    container.addEventListener('mouseleave', startAuto);
    container.addEventListener('focusin', stopAuto);
    container.addEventListener('focusout', e => {
      if (!container.contains(e.relatedTarget)) startAuto();
    });
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopAuto() : startAuto();
    });
    container.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setSbSlide(sbSlideIndex - 1); startAuto(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setSbSlide(sbSlideIndex + 1); startAuto(); }
    });

    if (counter) counter.textContent = `1 / ${SIDEBAR_SLIDES.length}`;
    startAuto();
  }

  /* ----------------------------------------------------------------
     SIDEBAR EDITORIAL NEWS
  ---------------------------------------------------------------- */
  function renderSidebarEditorialNews() {
    const container = $('#sidebarEditorialNews');
    if (!container) return;
    const newsIds = [
      'economy-1793073483', 'economy-1793071177',
      'financial-1793069437', 'politics-1792920849',
      'metropolitan-1792942444'
    ];
    const items = newsIds.map(id => byId.get(id)).filter(Boolean);
    container.innerHTML = items.map(a => {
      const la = getLocalized(a);
      return `
        <article class="sidebar-editorial-card">
          <div class="sidebar-editorial-thumb">${scene(a, 'sidebar-editorial-scene')}</div>
          <div class="sidebar-editorial-info">
            <span class="sidebar-editorial-cat">${esc(la.category)}</span>
            <h4 class="sidebar-editorial-title">${articleLink(a)}</h4>
            <div class="sidebar-editorial-meta">⏱ ${esc(sourceDate(a))}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  /* ----------------------------------------------------------------
     CATEGORY FEED
  ---------------------------------------------------------------- */
  function cardList(ids) { return ids.map(id => byId.get(id)).filter(Boolean); }

  const FEATURED_CATEGORIES = new Set([
    '热点新闻','政治','法律','首都动态','国外新闻','教育与文化',
    '华社','社论','社会','特别','财经','金融'
  ]);

  function renderCategorySection(category) {
    const stories = cardList(category.articles);
    if (!stories.length) return '';
    const isFeatured = FEATURED_CATEGORIES.has(category.name);
    const catTitle = getCategoryName(category.name);
    const readMoreLabel = t('readMore');

    if (isFeatured) {
      const [lead, ...rest] = stories;
      const leadLocal = getLocalized(lead);
      return `<section class="category-section category-featured" data-category="${esc(category.name)}">
        <div class="category-heading">
          <h2>${esc(catTitle)}</h2>
          <a href="#category/${encodeURIComponent(category.name)}" data-category-link="${esc(category.name)}">${readMoreLabel}</a>
        </div>
        <article class="lead-story">
          ${scene(lead)}
          <div class="story-copy">
            <h3>${articleLink(lead)}</h3>
            <div class="meta">⏱ ${esc(sourceDate(lead))}</div>
            <p>${esc(leadLocal.excerpt || t('noExcerpt'))}</p>
            <a class="read-more" href="${articleHref(lead)}" data-article-id="${esc(lead.id)}">${readMoreLabel}</a>
          </div>
        </article>
        ${rest.length ? `<div class="story-grid">${rest.slice(0, 4).map(a =>
          `<article class="small-story">${scene(a)}<div><h3>${articleLink(a)}</h3><div class="meta">⏱ ${esc(sourceDate(a))}</div></div></article>`
        ).join('')}</div>` : ''}
      </section>`;
    } else {
      return `<section class="category-section category-compact" data-category="${esc(category.name)}">
        <div class="category-heading">
          <h2>${esc(catTitle)}</h2>
          <a href="#category/${encodeURIComponent(category.name)}" data-category-link="${esc(category.name)}">${readMoreLabel}</a>
        </div>
        <div class="compact-grid">
          ${stories.map(a =>
            `<article class="compact-story">
              ${scene(a, 'compact-scene')}
              <div class="compact-copy">
                <h3>${articleLink(a)}</h3>
                <div class="meta">⏱ ${esc(sourceDate(a))}</div>
              </div>
            </article>`
          ).join('')}
        </div>
      </section>`;
    }
  }

  function renderCategories(filterName=null) {
    const feed = $('#categoryFeed');
    let cats = data.categories;
    if (filterName) cats = cats.filter(c => c.name === filterName);
    if (!cats.length) {
      feed.innerHTML = `<div class="empty-state">没有找到「${esc(filterName)}」分类。 <a href="#home">${esc(t('backHome'))}</a></div>`;
      return;
    }
    feed.innerHTML = cats.map(renderCategorySection).join('');
  }

  /* ================================================================
     SEARCH — refined with state preservation, count, clear, Escape
  ================================================================ */

  let _prevHash = '#home';
  const SEARCH_PAGE_SIZE = 20;
  let _searchQuery = '';
  let _searchPage  = 0;
  let _searchAllResults = [];

  function _hideAllViews() {
    const hero = $('#heroArea');
    const ad   = $('.ad-placeholder');
    if (hero) hero.hidden = true;
    if (ad)   ad.hidden   = true;
    $('#categoryFeed').hidden  = true;
    $('#articleView').hidden   = true;
    $('#searchResults').hidden = true;
  }

  function openSearch() {
    if ($('#searchResults').hidden !== false) {
      _prevHash = location.hash || '#home';
    }
    _hideAllViews();
    $('#searchResults').hidden = false;
    const panel = $('#searchPanel');
    panel.hidden = false;
    $('#searchToggle').setAttribute('aria-expanded', 'true');
    const input = $('#searchInput');
    input.focus();
    if (!input.value.trim()) {
      renderSearch('');
    } else {
      renderSearch(input.value);
    }
  }

  function closeSearch() {
    $('#searchPanel').hidden = true;
    $('#searchToggle').setAttribute('aria-expanded', 'false');
    $('#searchInput').value = '';
    $('#searchResults').hidden = true;
    $('#searchResults').innerHTML = '';
    _searchQuery = '';
    _searchPage  = 0;
    _searchAllResults = [];
    _updateClearBtn();
    const restoreHash = _prevHash || '#home';
    if (location.hash !== restoreHash) {
      location.hash = restoreHash;
    } else {
      route();
    }
  }

  function _updateClearBtn() {
    const clearBtn = $('#searchClear');
    if (clearBtn) clearBtn.hidden = !$('#searchInput').value;
  }

  function renderSearch(query, page) {
    const q = text(query).toLocaleLowerCase();
    const box = $('#searchResults');

    if (!q || !q.replace(/\s/g, '')) {
      box.hidden = true;
      box.innerHTML = `<p class="search-empty">${t('searchEmpty')}</p>`;
      box.hidden = false;
      _hideAllViews();
      box.hidden = false;
      return;
    }

    _searchQuery = query;
    _searchPage  = page ?? 0;

    // Multilingual Search: match against localized fields as primary, Chinese as fallback
    const locale = i18n ? i18n.getLocale() : 'zh-CN';
    _searchAllResults = data.articles.filter(a => {
      const la = getLocalized(a);
      // 1. Search current localized fields
      const locText = `${la.title} ${la.category} ${la.excerpt}`.toLocaleLowerCase();
      if (locText.includes(q)) return true;

      // 2. If viewing in English/Indonesian, also match original Chinese text as fallback
      if (locale !== 'zh-CN') {
        const zhText = `${a.title} ${a.category} ${a.excerpt}`.toLocaleLowerCase();
        if (zhText.includes(q)) return true;
      }
      return false;
    });

    const total  = _searchAllResults.length;
    const start  = _searchPage * SEARCH_PAGE_SIZE;
    const shown  = _searchAllResults.slice(start, start + SEARCH_PAGE_SIZE);
    const visibleCount = start + shown.length;

    _hideAllViews();
    box.hidden = false;

    const countLabel = total <= SEARCH_PAGE_SIZE
      ? t('searchResultsCount', { total })
      : t('searchResultsShowing', { shown: visibleCount, total });

    box.innerHTML = `
      <div class="search-results-header">
        <h2>${t('searchResultsHeading')}<em>${esc(query)}</em>
          <small class="search-result-count">${esc(countLabel)}</small>
        </h2>
      </div>
      ${shown.length
        ? `<div class="result-list">${shown.map(a => {
            const la = getLocalized(a);
            return `<article class="result-card">
              ${scene(a)}
              <div>
                <h3><a href="${articleHref(a)}" data-article-id="${esc(a.id)}">${esc(la.title)}</a></h3>
                <div class="meta">${esc(la.category)} · ${esc(sourceDate(a))}</div>
                <p>${esc(la.excerpt || t('noExcerpt'))}</p>
              </div>
            </article>`;
          }).join('')}</div>`
        : `<p class="search-no-results">${t('searchNoResults')}</p>`
      }
      ${visibleCount < total
        ? `<div class="search-load-more-wrap">
            <button type="button" class="search-load-more" id="searchLoadMore"
              data-page="${_searchPage + 1}">
              ${t('searchLoadMore')} (${total - visibleCount})
            </button>
          </div>`
        : ''
      }
    `;
  }

  /* ================================================================
     ARTICLE VIEW — Dynamic Content-Block Architecture & Full Layout
  ================================================================ */

  function renderContentBlocks(articleObj, localizedObj) {
    const blocks = localizedObj.content || articleObj.content;
    if (Array.isArray(blocks) && blocks.length > 0) {
      return `<div class="article-body" id="articleBody">
        ${blocks.map(block => {
          if (!block || typeof block !== 'object') return '';
          switch (block.type) {
            case 'paragraph':
              return `<p class="article-paragraph">${esc(block.text || '')}</p>`;
            case 'heading':
              return `<h2 class="article-heading">${esc(block.text || '')}</h2>`;
            case 'subheading':
              return `<h3 class="article-subheading">${esc(block.text || '')}</h3>`;
            case 'quote':
              return `<blockquote class="article-quote"><p>${esc(block.text || '')}</p>${block.cite ? `<cite>— ${esc(block.cite)}</cite>` : ''}</blockquote>`;
            case 'list': {
              const items = Array.isArray(block.items) ? block.items : [];
              return `<ul class="article-list">${items.map(it => `<li>${esc(it)}</li>`).join('')}</ul>`;
            }
            case 'table': {
              const headers = Array.isArray(block.headers) ? block.headers : [];
              const rows = Array.isArray(block.rows) ? block.rows : [];
              return `
                <div class="article-table-wrap table-responsive">
                  <table class="article-table">
                    ${headers.length ? `<thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>` : ''}
                    <tbody>${rows.map(r => `<tr>${(Array.isArray(r) ? r : []).map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
                  </table>
                </div>
              `;
            }
            case 'image':
              return `
                <figure class="article-inline-figure">
                  <img src="${esc(block.src || '')}" alt="${esc(block.caption || '')}" loading="lazy">
                  ${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''}
                </figure>
              `;
            default:
              return block.text ? `<p class="article-paragraph">${esc(block.text)}</p>` : '';
          }
        }).join('')}
      </div>`;
    } else {
      // Partial content: render authentic lead excerpt & legal attribution box
      return `<div class="article-body" id="articleBody">
        <p class="article-lead" id="articleExcerpt">${esc(localizedObj.excerpt || t('noExcerpt'))}</p>
        <div class="article-excerpt-box">
          <div class="article-excerpt-header">
            <span class="notice-icon" aria-hidden="true">ℹ️</span>
            <span>${esc(t('articleExcerptNoticeTitle'))}</span>
          </div>
          <p class="article-excerpt-text">${esc(t('articleExcerptNoticeDesc'))}</p>
          ${articleObj.sourceUrl ? `
            <a class="btn-open-original-full" href="${esc(articleObj.sourceUrl)}" target="_blank" rel="noopener noreferrer">
              ${esc(t('openOriginalOnShangbao'))} ↗
            </a>
          ` : ''}
        </div>
      </div>`;
    }
  }

  function openArticle(id) {
    const a = byId.get(id);

    // 1. Invalid Article ID -> Graceful Not Found State
    if (!a) {
      _hideAllViews();
      const ad = $('.ad-placeholder');
      if (ad) ad.hidden = false;
      const articleViewEl = $('#articleView');
      articleViewEl.hidden = false;
      articleViewEl.innerHTML = `
        <div class="article-not-found" role="alert">
          <div class="article-not-found-icon">⚠️</div>
          <h2>${esc(t('articleNotFoundTitle'))}</h2>
          <p>${esc(t('articleNotFoundDesc'))}</p>
          <a href="${esc(_prevHash || '#home')}" class="btn-back-home" id="notFoundBackBtn">${esc(t('backHome'))}</a>
        </div>
      `;
      const notFoundBack = $('#notFoundBackBtn');
      if (notFoundBack) {
        notFoundBack.addEventListener('click', e => {
          e.preventDefault();
          const dest = _prevHash || '#home';
          if (location.hash !== dest) location.hash = dest;
          else route();
        });
      }
      document.title = `${t('articleNotFoundTitle')} - Shangbao Indonesia`;
      window.scrollTo({top: 0, behavior: 'smooth'});
      return;
    }

    _hideAllViews();
    const ad = $('.ad-placeholder');
    if (ad) ad.hidden = false;
    $('#articleView').hidden = false;

    const locale = i18n ? i18n.getLocale() : 'zh-CN';
    const needsTranslation = (locale !== 'zh-CN');
    const la = getLocalized(a);
    const isTranslated = la.isTranslated;

    // Breadcrumb
    const breadcrumbHtml = `
      <nav class="article-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">${esc(t('articleBreadcrumbHome'))}</a>
        <span class="sep">›</span>
        <a href="#category/${encodeURIComponent(a.category)}">${esc(la.category)}</a>
        <span class="sep">›</span>
        <span class="current" title="${esc(la.title)}">${esc(la.title)}</span>
      </nav>
    `;

    // Metadata Bar
    const hasViewCount = (a.viewCount !== undefined && a.viewCount !== null && a.viewCount !== '' && !isNaN(Number(a.viewCount)));
    const sourceAgency = a.source || a.author || (a.excerpt && a.excerpt.startsWith('【中新社】') ? '中新社' : '印尼商报');
    const metaBarHtml = `
      <div class="article-meta-bar">
        <div class="meta-left">
          <a class="meta-tag-category" href="#category/${encodeURIComponent(a.category)}">${esc(la.category)}</a>
          <span class="article-meta-item"><i class="fa-clock" aria-hidden="true">⏱</i> ${esc(sourceDate(a))}</span>
          <span class="article-meta-item meta-tag-source">${esc(sourceAgency)}</span>
        </div>
        <div class="meta-right">
          ${hasViewCount ? `
            <span class="article-meta-item article-views" title="${esc(t('articleViewCount'))}">
              <svg class="meta-icon eye-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <span>${esc(String(a.viewCount))}</span>
            </span>
          ` : ''}
        </div>
      </div>
    `;

    // Featured Media & Caption
    const candidate = getCandidateSrc(a);
    const captionText = la.caption || a.caption || '';
    const mediaHtml = `
      <div class="article-featured-media">
        <img class="article-featured-img" src="${esc(candidate)}" alt="${esc(la.title)}"
          onerror="window.shangbaoHandleImgFallback && window.shangbaoHandleImgFallback(this, '${esc(a.id)}', 0)">
        ${captionText ? `<p class="article-caption" id="articleCaption">${esc(captionText)}</p>` : ''}
      </div>
    `;

    // Translation Bar
    const translationBarHtml = needsTranslation ? `
      <div class="article-translate-bar" id="translateBar" data-article-id="${esc(a.id)}">
        ${isTranslated
          ? `<button type="button" class="btn-view-original" id="btnViewOriginal">${esc(t('viewOriginal'))}</button>
             <span class="translation-badge">${esc(t('translationLabel'))}</span>
             <span class="translation-provider">${esc(t('translationBy'))}</span>`
          : `<button type="button" class="btn-translate" id="btnTranslate">${esc(t('translateArticle'))}</button>`
        }
      </div>
      <div id="translateStatus" class="translate-status" hidden></div>
    ` : '';

    // Content Body
    const contentHtml = renderContentBlocks(a, la);

    // Social Sharing Bar
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(la.title);
    const shareBarHtml = `
      <div class="article-share-bar">
        <span class="share-label">${esc(t('articleShare'))}</span>
        <a class="share-btn share-btn-fb" href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          Facebook
        </a>
        <a class="share-btn share-btn-tw" href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}" target="_blank" rel="noopener noreferrer" aria-label="Share on X">
          X / Twitter
        </a>
        <a class="share-btn share-btn-wa" href="https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          WhatsApp
        </a>
        <button type="button" class="share-btn share-btn-copy" id="shareBtnCopy" aria-label="Copy Link">
          <span id="shareBtnCopyText">📋 复制链接</span>
        </button>
      </div>
    `;

    // Source Attribution Box
    const sourceBoxHtml = `
      <div class="article-source-attribution">
        <div class="source-attr-left">
          <strong>${esc(t('articleSource'))}：</strong>
          <span>${esc(sourceAgency)}</span>
        </div>
        ${a.sourceUrl ? `
          <a class="source-link-out" href="${esc(a.sourceUrl)}" target="_blank" rel="noopener noreferrer">
            ${esc(t('articleOriginalLink'))} ↗
          </a>
        ` : `
          <span class="source-archive-tag">历史档案存档</span>
        `}
      </div>
    `;

    // Navigation (Previous / Next Article)
    const artIndex = data.articles.findIndex(item => item.id === a.id);
    const prevArt = artIndex > 0 ? data.articles[artIndex - 1] : null;
    const nextArt = artIndex < data.articles.length - 1 ? data.articles[artIndex + 1] : null;

    const navPrevNextHtml = `
      <div class="article-nav-prev-next">
        ${prevArt ? `
          <a class="article-nav-card nav-prev" href="${articleHref(prevArt)}">
            <div class="article-nav-label">← ${esc(t('articlePrev'))}</div>
            <div class="article-nav-title">${esc(getLocalized(prevArt).title)}</div>
          </a>
        ` : `
          <div class="article-nav-card nav-disabled">
            <div class="article-nav-label">← ${esc(t('articlePrev'))}</div>
            <div class="article-nav-title">${esc(t('articleNoMorePrev'))}</div>
          </div>
        `}
        ${nextArt ? `
          <a class="article-nav-card nav-next" href="${articleHref(nextArt)}">
            <div class="article-nav-label">${esc(t('articleNext'))} →</div>
            <div class="article-nav-title">${esc(getLocalized(nextArt).title)}</div>
          </a>
        ` : `
          <div class="article-nav-card nav-disabled">
            <div class="article-nav-label">${esc(t('articleNext'))} →</div>
            <div class="article-nav-title">${esc(t('articleNoMoreNext'))}</div>
          </div>
        `}
      </div>
    `;

    // Related Articles from same category
    const relatedList = data.articles
      .filter(item => item.category === a.category && item.id !== a.id)
      .slice(0, 4);

    const relatedHtml = relatedList.length ? `
      <div class="article-related-news">
        <h3 class="article-related-heading">${esc(t('articleRelatedNews'))}</h3>
        <div class="related-grid">
          ${relatedList.map(rel => {
            const relLocal = getLocalized(rel);
            const relImg = getCandidateSrc(rel);
            return `
              <a class="related-card" href="${articleHref(rel)}">
                <img class="related-card-img" src="${esc(relImg)}" alt="${esc(relLocal.title)}" loading="lazy"
                  onerror="window.shangbaoHandleImgFallback && window.shangbaoHandleImgFallback(this, '${esc(rel.id)}', 0)">
                <div class="related-card-body">
                  <div class="related-card-meta">${esc(relLocal.category)} · ${esc(sourceDate(rel))}</div>
                  <div class="related-card-title">${esc(relLocal.title)}</div>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    ` : '';

    // Render entire article layout into #articleView
    $('#articleView').innerHTML = `
      <a class="back-link" href="${esc(_prevHash || '#home')}" id="articleBackBtn">← ${esc(t('backHome'))}</a>
      <article class="single-article-container" id="articleContent">
        ${breadcrumbHtml}
        ${metaBarHtml}
        <h1 class="article-headline" id="articleTitle">${esc(la.title)}</h1>
        ${mediaHtml}
        ${translationBarHtml}
        ${contentHtml}
        ${shareBarHtml}
        ${sourceBoxHtml}
        ${navPrevNextHtml}
        ${relatedHtml}
      </article>
    `;

    // Wire Back Button
    const backBtn = $('#articleBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', e => {
        e.preventDefault();
        const dest = _prevHash || '#home';
        if (location.hash !== dest) location.hash = dest;
        else route();
      });
    }

    // Wire Copy Link Button
    const copyBtn = $('#shareBtnCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            const txt = $('#shareBtnCopyText');
            if (txt) {
              const orig = txt.textContent;
              txt.textContent = '✓ ' + (t('articleShareCopied') || '已复制！');
              setTimeout(() => { txt.textContent = orig; }, 2500);
            }
          }).catch(() => {});
        }
      });
    }

    // Wire translate & view original buttons
    _wireTranslateBtn(a, locale);

    document.title = `${la.title} - Shangbao Indonesia | Reconstruction`;
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function _wireTranslateBtn(a, locale) {
    const btnT = $('#btnTranslate');
    const btnO = $('#btnViewOriginal');
    const statusEl = $('#translateStatus');

    if (btnT) {
      btnT.addEventListener('click', async () => {
        await _doTranslate(a, locale, statusEl);
      });
    }
    if (btnO) {
      btnO.addEventListener('click', () => _restoreOriginal(a));
    }
  }

  function _applyTranslation(translated, a) {
    const titleEl   = $('#articleTitle');
    const captionEl = $('#articleCaption');
    const excerptEl = $('#articleExcerpt');
    const bodyEl    = $('#articleBody');
    const barEl     = $('#translateBar');

    if (titleEl && translated.title)     titleEl.textContent   = translated.title;
    if (captionEl && translated.caption) captionEl.textContent = translated.caption;
    if (excerptEl && translated.excerpt) excerptEl.textContent = translated.excerpt;

    if (bodyEl && Array.isArray(translated.content) && translated.content.length > 0) {
      bodyEl.innerHTML = translated.content.map(b => `<p class="article-paragraph">${esc(b.text || '')}</p>`).join('');
    }

    if (barEl) {
      if (a && a.id) barEl.dataset.articleId = a.id;
      barEl.innerHTML = `
        <button type="button" class="btn-view-original" id="btnViewOriginal">${esc(t('viewOriginal'))}</button>
        <span class="translation-badge">${esc(t('translationLabel'))}</span>
        <span class="translation-provider">${esc(t('translationBy'))}</span>
      `;
      const btnO = $('#btnViewOriginal');
      if (btnO) {
        btnO.addEventListener('click', () => {
          const targetArticle = a || (barEl.dataset.articleId ? byId.get(barEl.dataset.articleId) : null);
          if (targetArticle) _restoreOriginal(targetArticle);
        });
      }
    }
  }

  function _restoreOriginal(a) {
    const titleEl   = $('#articleTitle');
    const captionEl = $('#articleCaption');
    const excerptEl = $('#articleExcerpt');
    const bodyEl    = $('#articleBody');
    const barEl     = $('#translateBar');

    if (titleEl)   titleEl.textContent   = a.title;
    if (captionEl) captionEl.textContent = a.caption || '';
    if (excerptEl) excerptEl.textContent = a.excerpt || t('noExcerpt');

    if (bodyEl && Array.isArray(a.content) && a.content.length > 0) {
      bodyEl.innerHTML = a.content.map(b => `<p class="article-paragraph">${esc(b.text || '')}</p>`).join('');
    }

    if (barEl) {
      barEl.dataset.articleId = a.id;
      barEl.innerHTML = `<button type="button" class="btn-translate" id="btnTranslate">${esc(t('translateArticle'))}</button>`;
      const locale = i18n ? i18n.getLocale() : 'en';
      _wireTranslateBtn(a, locale);
    }
  }

  async function _doTranslate(a, locale, statusEl) {
    const btnT = $('#btnTranslate');
    if (btnT) { btnT.disabled = true; btnT.textContent = t('translating'); }
    if (statusEl) { statusEl.hidden = false; statusEl.textContent = t('translating'); statusEl.className = 'translate-status translating'; }

    try {
      if (!window.SHANGBAO_TRANSLATE) {
        throw { code: 'TRANSLATION_FAILED', message: 'Translation engine not loaded.' };
      }
      const res = await window.SHANGBAO_TRANSLATE.translateSingleArticle(a, locale);
      _applyTranslation(res, a);
      if (statusEl) statusEl.hidden = true;
    } catch (err) {
      const errCode = err.code || 'TRANSLATION_FAILED';
      const errMsg = i18n ? i18n.tError(errCode) : (err.message || '翻译失败，请稍后再试。');

      if (statusEl) {
        statusEl.hidden = false;
        statusEl.className = 'translate-status error';
        statusEl.innerHTML = `${esc(errMsg)} <button type="button" class="btn-retry" id="btnRetry">${esc(t('err_retry'))}</button>`;
        const retryBtn = $('#btnRetry');
        if (retryBtn) retryBtn.addEventListener('click', () => _doTranslate(a, locale, statusEl));
      }
    } finally {
      if (btnT) { btnT.disabled = false; btnT.textContent = t('translateArticle'); }
    }
  }

  /* ================================================================
     HOME VIEW
  ================================================================ */
  function showHome() {
    const hero = $('#heroArea');
    if (hero) hero.hidden = false;
    const ad = $('.ad-placeholder');
    if (ad) ad.hidden = false;
    $('#articleView').hidden   = true;
    $('#categoryFeed').hidden  = false;
    $('#searchResults').hidden = true;
    renderCategories();
    document.title = `${t('home')} - Shangbao Indonesia | Reconstruction`;
  }

  /* ================================================================
     HASH ROUTER
  ================================================================ */
  function route() {
    const hash = decodeURIComponent(location.hash || '#home');

    if (hash.startsWith('#article/')) {
      openArticle(decodeURIComponent(hash.slice('#article/'.length)));
      return;
    }
    if (hash.startsWith('#category/')) {
      const cat = hash.slice('#category/'.length);
      const hero = $('#heroArea');
      if (hero) hero.hidden = true;
      const ad = $('.ad-placeholder');
      if (ad) ad.hidden = false;
      $('#articleView').hidden   = true;
      $('#searchResults').hidden = true;
      $('#categoryFeed').hidden  = false;
      renderCategories(cat);
      const dispCat = getCategoryName(cat);
      document.title = `${dispCat} - Shangbao Indonesia | Reconstruction`;
      window.scrollTo({top: 0, behavior: 'smooth'});
      return;
    }
    showHome();
    $$('.nav-link').forEach(link =>
      link.classList.toggle('active', (hash === '#home' && !link.dataset.navLabel) || (hash === '#home' && link.textContent.trim() === ''))
    );
  }

  /* ================================================================
     REFRESH ACTIVE CONTENT
  ================================================================ */
  function refreshActiveContent() {
    renderNav();
    renderTicker();
    renderHero();
    renderPopular();
    renderSidebarEditorialNews();

    const catFeed = $('#categoryFeed');
    if (catFeed && !catFeed.hidden) {
      const currentHash = decodeURIComponent(location.hash || '#home');
      if (currentHash.startsWith('#category/')) {
        renderCategories(currentHash.slice('#category/'.length));
      } else {
        renderCategories();
      }
    }

    if (!$('#searchResults').hidden && _searchQuery) {
      renderSearch(_searchQuery, _searchPage);
    }

    if (!$('#articleView').hidden) {
      const hash = decodeURIComponent(location.hash || '');
      if (hash.startsWith('#article/')) {
        openArticle(decodeURIComponent(hash.slice('#article/'.length)));
      }
    }
  }

  /* ================================================================
     LANGUAGE SELECTOR
  ================================================================ */
  function initLangSelector() {
    const selector  = document.getElementById('langSelector');
    const btn       = document.getElementById('langBtn');
    const dropdown  = document.getElementById('langDropdown');
    if (!selector || !btn || !dropdown) return;

    function openDropdown() {
      dropdown.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      const activeOpt = dropdown.querySelector('.lang-option.active') || dropdown.querySelector('.lang-option');
      if (activeOpt) activeOpt.focus();
    }

    function closeDropdown() {
      dropdown.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (dropdown.hidden) openDropdown(); else closeDropdown();
    });

    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDropdown();
      }
    });

    dropdown.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeDropdown(); btn.focus(); }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const opts = [...dropdown.querySelectorAll('.lang-option')];
        const idx = opts.indexOf(document.activeElement);
        if (idx < opts.length - 1) opts[idx + 1].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const opts = [...dropdown.querySelectorAll('.lang-option')];
        const idx = opts.indexOf(document.activeElement);
        if (idx > 0) opts[idx - 1].focus();
        else { closeDropdown(); btn.focus(); }
      }
    });

    dropdown.addEventListener('click', e => {
      const opt = e.target.closest('[data-locale]');
      if (!opt) return;
      const locale = opt.dataset.locale;
      closeDropdown();
      btn.focus();
      if (i18n) i18n.setLocale(locale);
    });

    document.addEventListener('click', e => {
      if (!selector.contains(e.target)) closeDropdown();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !dropdown.hidden) { closeDropdown(); btn.focus(); }
    });

    if (i18n) {
      const stored = i18n.getLocale();
      const labels = { 'zh-CN': '中文', 'en': 'English', 'id': 'Indonesia' };
      const currentSpan = btn.querySelector('.lang-current');
      if (currentSpan) currentSpan.textContent = labels[stored] || '中文';
      dropdown.querySelectorAll('[data-locale]').forEach(opt => {
        const isActive = opt.dataset.locale === stored;
        opt.setAttribute('aria-selected', String(isActive));
        opt.classList.toggle('active', isActive);
      });
    }
  }

  /* ================================================================
     LOCALE CHANGE HANDLER
  ================================================================ */
  document.addEventListener('shangbao:localechange', e => {
    const locale = (e && e.detail && e.detail.locale) || (i18n ? i18n.getLocale() : 'zh-CN');

    if (i18n) i18n.applyAll();

    // Re-render UI immediately using available cached / fallback data
    refreshActiveContent();

    // Trigger page-wide batch translation
    if (window.SHANGBAO_TRANSLATE) {
      if (locale !== 'zh-CN') {
        window.SHANGBAO_TRANSLATE.translateAllArticles(locale).catch(err => {
          console.warn('[SHANGBAO] Batch translation completed with notice:', err);
        });
      } else {
        window.SHANGBAO_TRANSLATE.updateStatusUI('hide');
      }
    }
  });

  // Listen for incremental chunk translations and completion
  document.addEventListener('shangbao:content-chunk-loaded', refreshActiveContent);
  document.addEventListener('shangbao:content-translated', refreshActiveContent);

  /* ================================================================
     INIT — wire up all event listeners
  ================================================================ */
  renderNav();
  renderTicker();
  renderHero();
  renderPopular();
  renderCategories();
  initSidebarCarousel();
  renderSidebarEditorialNews();
  startClock();

  // Hero carousel controls
  $('#prevSlide').addEventListener('click', () => setSlide(slideIndex - 1));
  $('#nextSlide').addEventListener('click', () => setSlide(slideIndex + 1));
  $('#carouselDots').addEventListener('click', e => {
    const b = e.target.closest('[data-dot]');
    if (b) setSlide(Number(b.dataset.dot));
  });

  // Search panel toggle
  $('#searchToggle').addEventListener('click', () => {
    const panel = $('#searchPanel');
    if (panel.hidden) {
      openSearch();
    } else {
      closeSearch();
    }
  });

  // Search close button
  $('#searchClose').addEventListener('click', () => closeSearch());

  // Search clear button
  const searchClearBtn = $('#searchClear');
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      $('#searchInput').value = '';
      _updateClearBtn();
      $('#searchInput').focus();
      renderSearch('');
    });
  }

  // Update clear button visibility as user types
  $('#searchInput').addEventListener('input', _updateClearBtn);

  // Search form submit
  $('#searchPanel').addEventListener('submit', e => {
    e.preventDefault();
    renderSearch($('#searchInput').value, 0);
  });

  // Escape key closes search panel
  $('#searchInput').addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
  });

  // Load more results
  document.addEventListener('click', e => {
    const btn = e.target.closest('#searchLoadMore');
    if (btn) {
      const page = Number(btn.dataset.page) || 1;
      renderSearch(_searchQuery, page);
    }
  });

  // Popular tabs
  const tabPop  = $('#tabPopular');
  const tabMost = $('#tabMostRead');
  if (tabPop && tabMost) {
    tabPop.addEventListener('click', () => {
      tabPop.classList.add('active');
      tabMost.classList.remove('active');
      renderPopular(false);
    });
    tabMost.addEventListener('click', () => {
      tabMost.classList.add('active');
      tabPop.classList.remove('active');
      renderPopular(true);
    });
  }

  // Mobile menu
  $('#mobileMenu').addEventListener('click', () => {
    const isOpen = $('#siteNav').classList.toggle('open');
    $('#mobileMenu').setAttribute('aria-expanded', String(isOpen));
  });

  // Primary nav home link
  $('#siteNav').addEventListener('click', e => {
    const a = e.target.closest('[data-nav-label]');
    if (a && a.dataset.navLabel === '首页') {
      e.preventDefault();
      _prevHash = '#home';
      location.hash = '#home';
    }
  });

  // Secondary nav
  const navSubEl = $('#siteNavSub');
  if (navSubEl) {
    navSubEl.addEventListener('click', e => {
      const a = e.target.closest('[data-nav-label]');
      if (a) {
        e.preventDefault();
        location.hash = `#category/${encodeURIComponent(a.dataset.navLabel)}`;
      }
    });
  }

  // Category links within page
  document.addEventListener('click', e => {
    const cat = e.target.closest('[data-category-link]');
    if (cat) {
      e.preventDefault();
      location.hash = `#category/${encodeURIComponent(cat.dataset.categoryLink)}`;
    }
  });

  // Hash change
  window.addEventListener('hashchange', () => {
    if (!$('#searchResults').hidden) {
      $('#searchResults').hidden = true;
      $('#searchResults').innerHTML = '';
      $('#searchPanel').hidden = true;
      $('#searchToggle').setAttribute('aria-expanded', 'false');
      _searchQuery = '';
    }
    const newHash = location.hash || '#home';
    if (!newHash.startsWith('#article/')) {
      _prevHash = newHash;
    }
    route();
  });

  // Back-to-top
  const topButton = $('#backToTop');
  window.addEventListener('scroll', () => topButton.classList.toggle('visible', window.scrollY > 450), {passive: true});
  topButton.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

  // Hero auto-advance
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => setSlide(slideIndex + 1), 7000);
  }

  // Language selector
  initLangSelector();

  // Apply i18n to initial DOM
  if (i18n) i18n.applyAll();

  // Initial route
  route();

  // If initial locale is English or Indonesian, trigger background translation
  const initLoc = i18n ? i18n.getLocale() : 'zh-CN';
  if (initLoc !== 'zh-CN' && window.SHANGBAO_TRANSLATE) {
    window.SHANGBAO_TRANSLATE.translateAllArticles(initLoc).catch(() => {});
  }

})();
