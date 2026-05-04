/* ============================================================================
 * ANALYTICS TRACKER
 * Fires one page-view record per page load (and one per tab switch on
 * article pages). Silent no-op in demo mode.
 * Must be loaded after config.js and supabase-client.js.
 * ========================================================================== */
(function () {
  const path       = window.location.pathname;
  const params     = new URLSearchParams(window.location.search);
  const url        = path + (window.location.search || '');
  const screenSize = window.screen.width + 'x' + window.screen.height;
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

  let _state = null;
  let _geo   = null;

  // Session ID: one UUID per browser session (links all views in one visit)
  let _sessionId = sessionStorage.getItem('bcrn_sid');
  if (!_sessionId) {
    _sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    sessionStorage.setItem('bcrn_sid', _sessionId);
  }

  // New vs returning: localStorage flag persists across sessions
  const isNew = !localStorage.getItem('bcrn_v');
  if (isNew) localStorage.setItem('bcrn_v', '1');

  // Referral source
  const referrer = document.referrer || null;

  // Device type from screen width
  const device = window.screen.width < 768 ? 'mobile' : 'desktop';

  function track(tab) {
    if (window.ProgramsDB && window.ProgramsDB.trackView) {
      window.ProgramsDB.trackView(page, pageType, tab || null, url, screenSize, _state, _geo, _sessionId, referrer, device, isNew).catch(function () {});
    }
  }

  // Determine initial tab: articles default to guide unless ?view=faq in URL
  const initialTab = pageType === 'article'
    ? (params.get('view') === 'faq' ? 'faq' : 'guide')
    : null;

  // Fetch full geo JSON, then fire the initial track (3-second timeout)
  Promise.race([
    fetch('https://get.geojs.io/v1/ip/geo.json').then(function (r) { return r.json(); }),
    new Promise(function (_, reject) { setTimeout(function () { reject('timeout'); }, 3000); }),
  ])
    .then(function (d) {
      _state = d.region || null;
      _geo   = d || null;
    })
    .catch(function () {})
    .finally(function () { track(initialTab); });

  // Expose hook so posts.html can fire a separate event when tabs switch
  if (pageType === 'article') {
    window.trackTabView = function (tab) { track(tab); };
  }
})();
