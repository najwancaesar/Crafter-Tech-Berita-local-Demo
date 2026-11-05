/**
 * content-translation.js — Shangbao Indonesia Centralized Content Translation Engine
 *
 * Responsibilities:
 * - One source of truth: canonical Chinese data in data.js is never mutated
 * - Normalized article lookup: getLocalizedArticle(article, locale)
 * - Normalized category lookup: getLocalizedCategory(category, locale)
 * - Client-side translation cache (localStorage with 30-day TTL & memory cache)
 * - Duplicate request protection via in-flight Promise registry
 * - Page-wide batch translation via api/translate.php
 * - Progressive rendering: cached items render immediately, uncached update progressively
 * - Unobtrusive translation status bar with localized progress and retry handling
 */
(() => {
  'use strict';

  const CACHE_VERSION    = 1;
  const CACHE_TTL_MS     = 30 * 24 * 60 * 60 * 1000; // 30 days
  const CACHE_KEY_PREFIX = 'shangbao_translation_';
  const BATCH_CHUNK_SIZE = 36; // Max strings per HTTP batch request (well within provider limits)

  // In-memory cache for fast synchronous lookup: Map<"articleId_locale", { title, excerpt, timestamp, version }>
  const _memCache = new Map();

  // In-flight request registry: Map<locale, Promise>
  const _inFlightBatches = new Map();
  const _inFlightSingles = new Map();

  // Status bar auto-hide timer
  let _hideStatusTimer = null;

  /* ================================================================
     CACHE MANAGEMENT
  ================================================================ */

  function _getCacheKey(articleId, locale) {
    return `${CACHE_KEY_PREFIX}${articleId}_${locale}`;
  }

  function _loadFromStorage(articleId, locale) {
    const memKey = `${articleId}_${locale}`;
    if (_memCache.has(memKey)) {
      return _memCache.get(memKey);
    }
    try {
      const raw = localStorage.getItem(_getCacheKey(articleId, locale));
      if (raw) {
        const data = JSON.parse(raw);
        if (data.version === CACHE_VERSION && (Date.now() - data.timestamp <= CACHE_TTL_MS)) {
          _memCache.set(memKey, data);
          return data;
        }
      }
    } catch (_) {}

    // Fallback to bundled seed translations if available
    const seeds = window.SHANGBAO_SEED_TRANSLATIONS;
    if (seeds && seeds[locale] && seeds[locale][articleId]) {
      const seed = seeds[locale][articleId];
      const payload = {
        version:   CACHE_VERSION,
        timestamp: Date.now(),
        source:    'zh-CN',
        target:    locale,
        title:     seed.title || '',
        excerpt:   seed.excerpt || '',
        caption:   seed.caption || '',
        content:   seed.content || null
      };
      _memCache.set(memKey, payload);
      try {
        localStorage.setItem(_getCacheKey(articleId, locale), JSON.stringify(payload));
      } catch (_) {}
      return payload;
    }

    return null;
  }

  function _saveToStorage(articleId, locale, payload) {
    const data = {
      version:   CACHE_VERSION,
      timestamp: Date.now(),
      source:    'zh-CN',
      target:    locale,
      title:     payload.title || '',
      excerpt:   payload.excerpt || '',
      caption:   payload.caption || '',
      content:   payload.content || null
    };
    const memKey = `${articleId}_${locale}`;
    _memCache.set(memKey, data);

    try {
      localStorage.setItem(_getCacheKey(articleId, locale), JSON.stringify(data));
    } catch (e) {
      // If localStorage is full, clean up expired entries or fail gracefully
      console.warn('[SHANGBAO_TRANSLATE] LocalStorage write failed:', e);
    }
  }

  /* ================================================================
     NORMALIZED LOOKUP FUNCTIONS
  ================================================================ */

  function _getArticleObj(articleOrId) {
    if (!articleOrId) return null;
    if (typeof articleOrId === 'object' && articleOrId.id) return articleOrId;
    const data = window.SHANGBAO_DATA;
    if (data && Array.isArray(data.articles)) {
      return data.articles.find(a => a.id === articleOrId) || null;
    }
    return null;
  }

  /**
   * Return the localized category name using the i18n dictionary.
   */
  function getLocalizedCategory(categoryName, locale) {
    if (!categoryName) return '';
    const i18n = window.SHANGBAO_I18N;
    if (!i18n) return categoryName;
    const key = `cat_${categoryName}`;
    const trans = i18n.t(key);
    return (trans && trans !== key) ? trans : categoryName;
  }

  /**
   * Central normalized article lookup function used by ALL site views:
   * Homepage, Hero, Lead Categories, Compact Categories, Sidebar, Search, Article Preview.
   */
  function getLocalizedArticle(articleOrId, locale) {
    const a = _getArticleObj(articleOrId);
    if (!a) return null;

    const loc = locale || (window.SHANGBAO_I18N ? window.SHANGBAO_I18N.getLocale() : 'zh-CN');

    // Canonical Mandarin — always return untouched source fields
    if (!loc || loc === 'zh-CN') {
      return {
        id:           a.id,
        title:        a.title,
        excerpt:      a.excerpt,
        caption:      a.caption || '',
        content:      a.content || null,
        category:     a.category,
        date:         a.date,
        sourceUrl:    a.sourceUrl,
        imageKey:     a.imageKey,
        summarySource:a.summarySource,
        author:       a.author || null,
        source:       a.source || null,
        viewCount:    a.viewCount !== undefined ? a.viewCount : null,
        isTranslated: false,
        sourceLocale: 'zh-CN',
        targetLocale: 'zh-CN'
      };
    }

    // Check memory / localStorage cache
    const cached = _loadFromStorage(a.id, loc);
    const localizedCat = getLocalizedCategory(a.category, loc);

    if (cached && (cached.title || cached.excerpt)) {
      return {
        id:           a.id,
        title:        cached.title || a.title,
        excerpt:      cached.excerpt || a.excerpt,
        caption:      cached.caption || a.caption || '',
        content:      cached.content || a.content || null,
        category:     localizedCat,
        date:         a.date,
        sourceUrl:    a.sourceUrl,
        imageKey:     a.imageKey,
        summarySource:a.summarySource,
        author:       a.author || null,
        source:       a.source || null,
        viewCount:    a.viewCount !== undefined ? a.viewCount : null,
        isTranslated: true,
        sourceLocale: 'zh-CN',
        targetLocale: loc
      };
    }

    // Fallback: original Chinese title & excerpt, but localized category label
    return {
      id:           a.id,
      title:        a.title,
      excerpt:      a.excerpt,
      caption:      a.caption || '',
      content:      a.content || null,
      category:     localizedCat,
      date:         a.date,
      sourceUrl:    a.sourceUrl,
      imageKey:     a.imageKey,
      summarySource:a.summarySource,
      author:       a.author || null,
      source:       a.source || null,
      viewCount:    a.viewCount !== undefined ? a.viewCount : null,
      isTranslated: false,
      sourceLocale: 'zh-CN',
      targetLocale: loc
    };
  }

  /* ================================================================
     TRANSLATION STATUS BAR UI
  ================================================================ */

  function updateStatusUI(state, details) {
    const bar     = document.getElementById('translationStatusBar');
    const textEl  = document.getElementById('translationStatusText');
    const retryEl = document.getElementById('translationStatusRetry');
    const iconEl  = bar ? bar.querySelector('.status-icon') : null;
    if (!bar || !textEl) return;

    if (_hideStatusTimer) {
      clearTimeout(_hideStatusTimer);
      _hideStatusTimer = null;
    }

    const i18n = window.SHANGBAO_I18N;
    const t = (k, p) => i18n ? i18n.t(k, p) : k;

    if (state === 'translating') {
      bar.hidden = false;
      bar.className = 'translation-status-bar status-translating';
      if (iconEl) iconEl.textContent = '⏳';
      const pct = details && details.total > 0 ? Math.round((details.completed / details.total) * 100) : 0;
      textEl.textContent = pct > 0
        ? `${t('translatingNews')} (${pct}%)`
        : t('translatingNews');
      if (retryEl) retryEl.hidden = true;

    } else if (state === 'complete') {
      bar.hidden = false;
      bar.className = 'translation-status-bar status-complete';
      if (iconEl) iconEl.textContent = '✓';
      textEl.textContent = t('translationComplete');
      if (retryEl) retryEl.hidden = true;

      // Auto-hide after 3.5 seconds
      _hideStatusTimer = setTimeout(() => {
        bar.hidden = true;
      }, 3500);

    } else if (state === 'error') {
      bar.hidden = false;
      bar.className = 'translation-status-bar status-error';
      if (iconEl) iconEl.textContent = '⚠️';
      const errCode = (details && details.error && details.error.code) || 'TRANSLATION_FAILED';
      textEl.textContent = (i18n && i18n.tError)
        ? i18n.tError(errCode)
        : (details && details.error && details.error.message ? details.error.message : t('translationPartial'));
      if (retryEl) {
        retryEl.hidden = false;
        retryEl.textContent = t('retryTranslation');
      }

    } else if (state === 'hide') {
      bar.hidden = true;
    }
  }

  /* ================================================================
     PAGE-WIDE BATCH TRANSLATION ENGINE
  ================================================================ */

  /**
   * Request batch translation of all uncached articles for targetLocale.
   * Uses chunked requests to api/translate.php with duplicate request prevention.
   */
  async function translateAllArticles(targetLocale, options = {}) {
    if (!targetLocale || targetLocale === 'zh-CN') {
      updateStatusUI('hide');
      return { ok: true, status: 'complete', count: 0 };
    }

    // In-flight registry: if a batch for this locale is currently running, reuse it
    if (_inFlightBatches.has(targetLocale)) {
      return _inFlightBatches.get(targetLocale);
    }

    const batchPromise = (async () => {
      const data = window.SHANGBAO_DATA;
      if (!data || !Array.isArray(data.articles) || data.articles.length === 0) {
        return { ok: true, status: 'complete', count: 0 };
      }

      // Collect uncached text items
      const missingItems = [];
      data.articles.forEach(a => {
        const cached = _loadFromStorage(a.id, targetLocale);
        if (!cached || !cached.title) {
          missingItems.push({ id: `${a.id}-title`, text: a.title, articleId: a.id, field: 'title' });
        }
        if (a.excerpt && (!cached || !cached.excerpt)) {
          missingItems.push({ id: `${a.id}-excerpt`, text: a.excerpt, articleId: a.id, field: 'excerpt' });
        }
      });

      // If all articles are already cached
      if (missingItems.length === 0) {
        updateStatusUI('complete');
        document.dispatchEvent(new CustomEvent('shangbao:content-translated', {
          detail: { locale: targetLocale, status: 'complete', total: data.articles.length, cached: true }
        }));
        return { ok: true, status: 'complete', count: 0, cached: true };
      }

      updateStatusUI('translating', { completed: 0, total: missingItems.length });
      document.dispatchEvent(new CustomEvent('shangbao:content-translating', {
        detail: { locale: targetLocale, total: missingItems.length }
      }));

      // Split missing items into bounded chunks
      const chunkSize = options.chunkSize || BATCH_CHUNK_SIZE;
      let completedCount = 0;
      let encounteredError = null;

      for (let i = 0; i < missingItems.length; i += chunkSize) {
        const chunk = missingItems.slice(i, i + chunkSize);
        try {
          const resp = await fetch('api/translate.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: 'zh-CN',
              target: targetLocale,
              batch: chunk.map(item => ({ id: item.id, text: item.text }))
            }),
            signal: AbortSignal.timeout(18000)
          });

          const json = await resp.json();
          if (!json.ok) {
            throw { code: json.error, message: json.message };
          }

          // Map results to articles and write to storage
          const resultMap = new Map((json.translations || []).map(r => [r.id, r.translatedText]));

          // Group by articleId
          const updatedArticles = new Set();
          chunk.forEach(item => {
            const translatedText = resultMap.get(item.id);
            if (translatedText !== undefined) {
              const current = _loadFromStorage(item.articleId, targetLocale) || {};
              current[item.field] = translatedText;
              _saveToStorage(item.articleId, targetLocale, current);
              updatedArticles.add(item.articleId);
            }
          });

          completedCount += chunk.length;
          updateStatusUI('translating', { completed: completedCount, total: missingItems.length });

          // Dispatch chunk-loaded event so views can update progressively
          document.dispatchEvent(new CustomEvent('shangbao:content-chunk-loaded', {
            detail: { locale: targetLocale, chunkCount: chunk.length, articles: [...updatedArticles] }
          }));

        } catch (err) {
          encounteredError = err;
          console.warn('[SHANGBAO_TRANSLATE] Batch chunk error:', err);
          break; // Stop further chunk requests on provider error
        }
      }

      if (encounteredError) {
        updateStatusUI('error', { error: encounteredError });
        document.dispatchEvent(new CustomEvent('shangbao:content-translated', {
          detail: { locale: targetLocale, status: 'error', error: encounteredError }
        }));
        throw encounteredError;
      }

      updateStatusUI('complete');
      document.dispatchEvent(new CustomEvent('shangbao:content-translated', {
        detail: { locale: targetLocale, status: 'complete', count: completedCount }
      }));

      return { ok: true, status: 'complete', count: completedCount };
    })();

    _inFlightBatches.set(targetLocale, batchPromise);
    try {
      return await batchPromise;
    } finally {
      _inFlightBatches.delete(targetLocale);
    }
  }

  /**
   * Translate a single article (used by Article Preview).
   * Deduplicates concurrent calls for the same article.
   */
  async function translateSingleArticle(articleOrId, targetLocale) {
    const a = _getArticleObj(articleOrId);
    if (!a) return null;
    const loc = targetLocale || (window.SHANGBAO_I18N ? window.SHANGBAO_I18N.getLocale() : 'en');
    if (loc === 'zh-CN') return getLocalizedArticle(a, 'zh-CN');

    // Cache hit?
    const cached = _loadFromStorage(a.id, loc);
    if (cached && (cached.title || cached.excerpt)) {
      return getLocalizedArticle(a, loc);
    }

    const key = `${a.id}_${loc}`;
    if (_inFlightSingles.has(key)) {
      return _inFlightSingles.get(key);
    }

    const singlePromise = (async () => {
      try {
        const resp = await fetch('api/translate.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId: a.id,
            source: 'zh-CN',
            target: loc,
            title: a.title,
            excerpt: a.excerpt || ''
          }),
          signal: AbortSignal.timeout(12000)
        });

        const json = await resp.json();
        if (!json.ok) {
          throw { code: json.error, message: json.message };
        }

        _saveToStorage(a.id, loc, { title: json.title, excerpt: json.excerpt });
        return getLocalizedArticle(a, loc);

      } catch (err) {
        throw err;
      }
    })();

    _inFlightSingles.set(key, singlePromise);
    try {
      return await singlePromise;
    } finally {
      _inFlightSingles.delete(key);
    }
  }

  /**
   * Return translation cache statistics.
   */
  function getStats() {
    const data = window.SHANGBAO_DATA;
    const total = (data && Array.isArray(data.articles)) ? data.articles.length : 0;
    let cachedEn = 0;
    let cachedId = 0;

    if (data && Array.isArray(data.articles)) {
      data.articles.forEach(a => {
        if (_loadFromStorage(a.id, 'en')) cachedEn++;
        if (_loadFromStorage(a.id, 'id')) cachedId++;
      });
    }

    return {
      totalArticles: total,
      totalTitles:   total,
      totalExcerpts: total,
      cachedEn,
      cachedId
    };
  }

  /**
   * Clear cache for a specific locale or all locales.
   */
  function clearCache(locale) {
    _memCache.clear();
    const data = window.SHANGBAO_DATA;
    if (data && Array.isArray(data.articles)) {
      const locales = locale ? [locale] : ['en', 'id'];
      data.articles.forEach(a => {
        locales.forEach(loc => {
          try { localStorage.removeItem(_getCacheKey(a.id, loc)); } catch (_) {}
        });
      });
    }
  }

  // Pre-load all existing cached articles into _memCache on script load
  function _preloadCache() {
    const data = window.SHANGBAO_DATA;
    if (data && Array.isArray(data.articles)) {
      data.articles.forEach(a => {
        _loadFromStorage(a.id, 'en');
        _loadFromStorage(a.id, 'id');
      });
    }
  }

  // Wire retry button on status bar
  function _wireStatusBar() {
    const retryBtn = document.getElementById('translationStatusRetry');
    const closeBtn = document.getElementById('translationStatusClose');

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        const i18n = window.SHANGBAO_I18N;
        const curLocale = i18n ? i18n.getLocale() : 'en';
        translateAllArticles(curLocale, { force: true }).catch(() => {});
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        updateStatusUI('hide');
      });
    }
  }

  // DOM ready wireup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      _preloadCache();
      _wireStatusBar();
    });
  } else {
    _preloadCache();
    _wireStatusBar();
  }

  // Expose public API
  window.SHANGBAO_TRANSLATE = {
    getLocalizedArticle,
    getLocalizedCategory,
    translateAllArticles,
    translateSingleArticle,
    updateStatusUI,
    getStats,
    clearCache
  };

})();

