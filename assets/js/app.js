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

  /**
   * Determine initial candidate image source for an article.
   * Priority: (1) assets/img/<id>.jpg (2) manual map (3) pool (4) placeholder
   */
  function getCandidateSrc(a) {
    if (IMG[a.id]) return IMG[a.id];
    if (POOL.length > 0) {
      let hash = 0;
      for (let i = 0; i < a.id.length; i++) hash = ((hash << 5) - hash + a.id.charCodeAt(i)) | 0;
      return POOL[Math.abs(hash) % POOL.length];
    }
    return `assets/images/articles/${encodeURIComponent(a.id)}.jpg`;
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

  function articleLink(a, cls='') { return `<a class="${cls}" href="${articleHref(a)}" data-article-id="${esc(a.id)}">${esc(a.title)}</a>`; }

  function renderNav() {
    const navPrimary = $('#siteNav');
    const navSub     = $('#siteNavSub');
    const all = data.navigation.length ? data.navigation : [{label:'首页',path:''}];
    // First item is home; items 1..16 go to primary row (total 17 items: home + 16 categories)
    // Remaining 5 categories go to secondary row with language + search tools.
    const PRIMARY_MAX = 17;
    const primary = all.slice(0, PRIMARY_MAX);
    const secondary = all.slice(PRIMARY_MAX);

    navPrimary.innerHTML = primary.map((n, i) =>
      `<a class="nav-link ${i===0?'home active':''}" href="${n.path ? `#category/${encodeURIComponent(n.label)}` : '#home'}" data-nav-label="${esc(n.label)}">${i===0?'<svg class="home-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>':esc(n.label)}</a>`
    ).join('');

    if (navSub) {
      navSub.innerHTML = secondary.map(n =>
        `<a class="nav-link-sub" href="#category/${encodeURIComponent(n.label)}" data-nav-label="${esc(n.label)}">${esc(n.label)}</a>`
      ).join('');
    }
  }

  // Live clock for weather display
  function startClock() {
    const el = document.getElementById('weatherTime');
    if (!el) return;
    function tick() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      el.textContent = `${h}:${m}:${s}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  function renderTicker() {
    const stories = data.ticker.map(id => byId.get(id)).filter(Boolean);
    const items = (stories.length ? stories : data.articles.slice(0, 5));
    const oneSet = items.map(a => `<a href="${articleHref(a)}" data-article-id="${esc(a.id)}"><b>【${esc(a.category)}】</b> ${esc(a.title)}</a>`).join('');
    $('#tickerTrack').innerHTML = oneSet + oneSet;
  }

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

  function renderPopular(isMostRead = false) {
    const listEl = $('#popularList');
    if (!listEl) return;
    const offset = isMostRead ? 5 : 0;
    const stories = data.popular.slice(offset, offset + 5).map(id => byId.get(id)).filter(Boolean);
    const list = stories.length ? stories : data.articles.slice(offset, offset + 5);
    listEl.innerHTML = list.map((a, i) =>
      `<li><span class="popular-num">${String(i + 1).padStart(2, '0')}</span>${articleLink(a)}</li>`
    ).join('') || '<li>暂无推荐新闻</li>';

    const quick = data.articles.slice(0, 2);
    const sideHighlights = $('#sideHighlights');
    if (sideHighlights) {
      sideHighlights.innerHTML = quick.map(a =>
        `<article class="side-highlight">${scene(a)}<div><h3>${articleLink(a)}</h3><p>${esc(sourceDate(a))}</p></div></article>`
      ).join('');
    }
  }

  function cardList(ids) { return ids.map(id => byId.get(id)).filter(Boolean); }

  function renderCategorySection(category) {
    const stories = cardList(category.articles);
    if (!stories.length) return '';
    const [lead, ...rest] = stories;
    return `<section class="category-section" data-category="${esc(category.name)}">
      <div class="category-heading">
        <h2>${esc(category.name)}</h2>
        <a href="#category/${encodeURIComponent(category.name)}" data-category-link="${esc(category.name)}">查看更多 »</a>
      </div>
      <article class="lead-story">
        ${scene(lead)}
        <div class="story-copy">
          <h3>${articleLink(lead)}</h3>
          <div class="meta">⏱ ${esc(sourceDate(lead))}</div>
          <p>${esc(lead.excerpt || '此 HTML 首页快照未包含完整文章正文。')}</p>
          <a class="read-more" href="${articleHref(lead)}" data-article-id="${esc(lead.id)}">查看更多 »</a>
        </div>
      </article>
      ${rest.length ? `<div class="story-grid">${rest.slice(0, 4).map(a =>
        `<article class="small-story">${scene(a)}<div><h3>${articleLink(a)}</h3><div class="meta">⏱ ${esc(sourceDate(a))}</div></div></article>`
      ).join('')}</div>` : ''}
    </section>`;
  }

  function renderCategories(filterName=null) {
    const feed = $('#categoryFeed');
    let cats = data.categories;
    if (filterName) cats = cats.filter(c => c.name === filterName);
    if (!cats.length) {
      feed.innerHTML = `<div class="empty-state">没有找到「${esc(filterName)}」分类。 <a href="#home">返回首页</a></div>`;
      return;
    }
    feed.innerHTML = cats.map(renderCategorySection).join('');
  }

  function renderSearch(query) {
    const q = text(query).toLocaleLowerCase();
    const box = $('#searchResults');
    const hero = $('#heroArea');
    if (!q) {
      box.hidden = true;
      box.innerHTML = '';
      if (hero) hero.hidden = false;
      $('#categoryFeed').hidden = false;
      return;
    }
    const results = data.articles.filter(a => `${a.title} ${a.category} ${a.excerpt}`.toLocaleLowerCase().includes(q)).slice(0, 40);
    box.hidden = false;
    if (hero) hero.hidden = true;
    $('#categoryFeed').hidden = true;
    box.innerHTML = `<h2>搜索结果：${esc(query)} <small>（${results.length} 条）</small></h2>${results.length ? `<div class="result-list">${results.map(a => `<article class="result-card">${scene(a)}<div><h3>${articleLink(a)}</h3><div class="meta">${esc(a.category)} · ${esc(sourceDate(a))}</div><p>${esc(a.excerpt||'首页快照未包含正文。')}</p></div></article>`).join('')}</div>` : '<p>没有找到匹配的新闻标题或摘要。</p>'}`;
  }

  function openArticle(id) {
    const a = byId.get(id);
    if (!a) return;
    const hero = $('#heroArea');
    if (hero) hero.hidden = true;
    const ad = $('.ad-placeholder');
    if (ad) ad.hidden = true;
    $('#categoryFeed').hidden = true;
    $('#searchResults').hidden = true;
    $('#articleView').hidden = false;
    $('#articleView').innerHTML = `<a class="back-link" href="#home">← 返回首页</a><article><div class="meta">${esc(a.category)} · ${esc(sourceDate(a))}</div><h1>${esc(a.title)}</h1>${scene(a)}<p class="article-lead">${esc(a.excerpt || '此页面快照未包含这篇文章的完整正文。')}</p><div class="article-note">说明：提供的 HTML 是首页快照，并没有完整新闻正文。这里展示的是可用于重建 UI 的本地文章预览，而非原文全文。</div><p><a class="source-link" href="${esc(a.sourceUrl)}" target="_blank" rel="noopener noreferrer">在 Shangbao 原网站打开这篇文章 ↗</a></p></article>`;
    document.title = `${a.title} - Shangbao Indonesia | Reconstruction`;
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function showHome() {
    const hero = $('#heroArea');
    if (hero) hero.hidden = false;
    const ad = $('.ad-placeholder');
    if (ad) ad.hidden = false;
    $('#articleView').hidden = true;
    $('#categoryFeed').hidden = false;
    $('#searchResults').hidden = true;
    renderCategories();
    document.title = '首页 - Shangbao Indonesia | Reconstruction';
  }

  function route() {
    const hash = decodeURIComponent(location.hash || '#home');
    if (hash.startsWith('#article/')) { openArticle(decodeURIComponent(hash.slice('#article/'.length))); return; }
    if (hash.startsWith('#category/')) {
      const cat = hash.slice('#category/'.length);
      const hero = $('#heroArea');
      if (hero) hero.hidden = true;
      const ad = $('.ad-placeholder');
      if (ad) ad.hidden = false;
      $('#articleView').hidden = true;
      $('#searchResults').hidden = true;
      $('#categoryFeed').hidden = false;
      renderCategories(cat);
      document.title = `${cat} - Shangbao Indonesia | Reconstruction`;
      window.scrollTo({top: 0, behavior: 'smooth'});
      return;
    }
    showHome();
    const navLinks = $$('.nav-link');
    navLinks.forEach(link => link.classList.toggle('active', (hash === '#home' && !link.dataset.navLabel) || (hash === '#home' && link.textContent.trim() === '')));
  }

  renderNav(); renderTicker(); renderHero(); renderPopular(); renderCategories(); startClock();

  $('#prevSlide').addEventListener('click', () => setSlide(slideIndex - 1));
  $('#nextSlide').addEventListener('click', () => setSlide(slideIndex + 1));
  $('#carouselDots').addEventListener('click', e => { const b = e.target.closest('[data-dot]'); if (b) setSlide(Number(b.dataset.dot)); });

  $('#searchToggle').addEventListener('click', () => {
    const panel = $('#searchPanel');
    panel.hidden = !panel.hidden;
    $('#searchToggle').setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) $('#searchInput').focus();
  });
  $('#searchClose').addEventListener('click', () => {
    $('#searchPanel').hidden = true;
    $('#searchToggle').setAttribute('aria-expanded', 'false');
    $('#searchInput').value = '';
    renderSearch('');
  });
  $('#searchPanel').addEventListener('submit', e => {
    e.preventDefault();
    renderSearch($('#searchInput').value);
  });
  $('#searchInput').addEventListener('keydown', e => { if (e.key === 'Escape') $('#searchClose').click(); });

  const tabPop = $('#tabPopular');
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

  $('#mobileMenu').addEventListener('click', () => {
    const isOpen = $('#siteNav').classList.toggle('open');
    $('#mobileMenu').setAttribute('aria-expanded', String(isOpen));
  });

  $('#siteNav').addEventListener('click', e => {
    const a = e.target.closest('[data-nav-label]');
    if (a && a.dataset.navLabel === '首页') {
      e.preventDefault();
      location.hash = '#home';
    }
  });

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

  document.addEventListener('click', e => {
    const cat = e.target.closest('[data-category-link]');
    if (cat) {
      e.preventDefault();
      location.hash = `#category/${encodeURIComponent(cat.dataset.categoryLink)}`;
    }
  });

  window.addEventListener('hashchange', route);

  const topButton = $('#backToTop');
  window.addEventListener('scroll', () => topButton.classList.toggle('visible', window.scrollY > 450), {passive: true});
  topButton.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => setSlide(slideIndex + 1), 7000);
  }

  route();
})();
