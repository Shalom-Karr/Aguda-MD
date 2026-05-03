/* ============================================================================
 * ANALYTICS TRACKER
 * Fires one page-view record per page load. Silent no-op in demo mode.
 * Must be loaded after config.js and supabase-client.js.
 * ========================================================================== */
(function () {
  const path   = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  let page, pageType;

  if (params.get('title')) {
    page     = params.get('title');
    pageType = 'article';
  } else if (path.includes('index.html') || path === '/' || /\/$/.test(path)) {
    page     = 'home';
    pageType = 'site';
  } else if (path.includes('contact.html')) {
    page     = 'contact';
    pageType = 'site';
  } else if (path.includes('faq.html')) {
    page     = 'faq';
    pageType = 'site';
  } else if (path.includes('book.html')) {
    page     = 'book';
    pageType = 'site';
  } else {
    return; // admin or unknown — skip
  }

  if (window.ProgramsDB && window.ProgramsDB.trackView) {
    window.ProgramsDB.trackView(page, pageType).catch(function () {});
  }
})();
