/* ============================================================================
 * APPLY-CONFIG.JS
 * ----------------------------------------------------------------------------
 * Merges editable site settings (stored in the agudah_md_ga_settings table)
 * over the static defaults in assets/config.js. Provides one helper:
 *
 *   await window.applyDynamicConfig()
 *
 * Returns the merged SITE_CONFIG so callers can paint their DOM with it.
 * ========================================================================== */
(function () {
  function deepMerge(base, over) {
    if (!over || typeof over !== 'object') return base;
    if (Array.isArray(base) || Array.isArray(over)) return over ?? base;
    const out = { ...base };
    for (const k of Object.keys(over)) {
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) &&
          base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
        out[k] = deepMerge(base[k], over[k]);
      } else if (over[k] !== undefined && over[k] !== null && over[k] !== '') {
        out[k] = over[k];
      }
    }
    return out;
  }

  window.applyDynamicConfig = async function () {
    if (!window.ProgramsDB || !window.SITE_CONFIG) return window.SITE_CONFIG;
    try {
      const dbSettings = await window.ProgramsDB.getSettings();
      if (dbSettings) {
        window.SITE_CONFIG = deepMerge(window.SITE_CONFIG, dbSettings);
      }
    } catch (e) {
      console.warn('[apply-config] failed to load DB settings:', e);
    }
    // Apply global font override
    const font = window.SITE_CONFIG.font;
    if (font && font !== 'Inter') {
      const serif = ['Merriweather', 'Lora'].includes(font);
      let el = document.getElementById('site-font-override');
      if (!el) {
        el = document.createElement('style');
        el.id = 'site-font-override';
        document.head.appendChild(el);
      }
      el.textContent = `body,h1,h2,h3,h4,h5,h6{font-family:'${font}',${serif?'serif':'sans-serif'}!important}`;
    }

    return window.SITE_CONFIG;
  };
})();
