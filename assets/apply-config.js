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
    return window.SITE_CONFIG;
  };
})();
