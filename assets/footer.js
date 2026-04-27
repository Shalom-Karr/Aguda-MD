/* ============================================================================
 * footer.js — shared footer renderer
 * ----------------------------------------------------------------------------
 * Each public page just includes this script and an empty
 *   <footer id="site-footer"></footer>
 *
 * The renderer reads SITE_CONFIG (already merged with DB settings by
 * apply-config.js) and builds the markup. Re-renderable: call mountFooter()
 * again after applyDynamicConfig() resolves to update with DB values.
 *
 * Editable footer fields live under SITE_CONFIG.footer:
 *   copyright       — small grey line at bottom
 *   aboutLabel      — "A project of" label
 *   contactLabel    — heading on contact column ("Contact")
 *   linksLabel      — heading on site-links column ("Site")
 *   partner1Name    — first partner display name (alt text + tooltip)
 *   partner1Url     — first partner website
 *   partner2Name    — second partner display name
 *   partner2Url     — second partner website
 *
 * Top-level fields used: contactEmail, phone, address.
 * Logo paths are fixed in /assets/ — replace those files to change logos.
 * ========================================================================== */
(function () {
  function escAttr(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  window.mountFooter = function () {
    const target = document.getElementById('site-footer');
    if (!target) return;
    const C = window.SITE_CONFIG || {};
    const f = C.footer || {};

    const aboutLabel   = f.aboutLabel   || 'A project of';
    const contactLabel = f.contactLabel || 'Contact';
    const linksLabel   = f.linksLabel   || 'Site';
    const copyright    = f.copyright    || '';

    const p1Name = f.partner1Name || 'Ahavas Yisrael Charity Fund';
    const p1Url  = f.partner1Url  || '#';
    const p2Name = f.partner2Name || 'Agudath Israel of Maryland';
    const p2Url  = f.partner2Url  || '#';

    const email   = C.contactEmail || '';
    const phone   = C.phone || '';
    const address = C.address || '';

    // "Street, City, State ZIP" -> "Street<br>City, State ZIP" (split on first comma only)
    let addressHtml = '';
    if (address) {
      const idx = address.indexOf(',');
      if (idx > 0) {
        addressHtml = escAttr(address.slice(0, idx).trim()) + '<br>' +
                      escAttr(address.slice(idx + 1).trim());
      } else {
        addressHtml = escAttr(address);
      }
    }

    target.className = 'relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-900 to-slate-900 text-blue-100 mt-20';
    target.innerHTML = `
      <!-- Subtle radial glow to echo the hero (mirrored to bottom-right) -->
      <div aria-hidden="true" style="position:absolute;width:700px;height:700px;bottom:-250px;right:-200px;background:radial-gradient(circle at center, rgba(59,130,246,0.28), transparent 60%);pointer-events:none;z-index:0;"></div>

      <div class="relative max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-12 gap-8 md:gap-10">
        <div class="md:col-span-5">
          <p class="text-[11px] font-bold uppercase tracking-widest text-blue-200/70 mb-4">${escAttr(aboutLabel)}</p>
          <div class="flex items-center gap-3">
            <a href="${escAttr(p1Url)}" target="_blank" rel="noopener" title="${escAttr(p1Name)}"
               class="bg-white rounded-lg p-2 inline-flex items-center hover:scale-105 transition-transform shadow-md shadow-black/20">
              <img src="assets/logo-ay.png" alt="${escAttr(p1Name)}" class="h-10 w-auto">
            </a>
            <a href="${escAttr(p2Url)}" target="_blank" rel="noopener" title="${escAttr(p2Name)}"
               class="bg-white rounded-lg p-2 inline-flex items-center hover:scale-105 transition-transform shadow-md shadow-black/20">
              <img src="assets/logo-aimd.png" alt="${escAttr(p2Name)}" class="h-10 w-auto">
            </a>
          </div>
        </div>

        <div class="md:col-span-4">
          <p class="text-[11px] font-bold uppercase tracking-widest text-blue-200/70 mb-4">${escAttr(contactLabel)}</p>
          <ul class="space-y-2 text-sm">
            ${email   ? `<li><a href="mailto:${escAttr(email)}" class="text-blue-100 hover:text-white transition-colors">${escAttr(email)}</a></li>` : ''}
            ${phone   ? `<li><a href="tel:${escAttr(phone.replace(/[^\d+]/g,''))}" class="text-blue-100 hover:text-white transition-colors">${escAttr(phone)}</a></li>` : ''}
            ${address ? `<li class="text-blue-100/70 leading-relaxed">${addressHtml}</li>` : ''}
          </ul>
        </div>

        <div class="md:col-span-3">
          <p class="text-[11px] font-bold uppercase tracking-widest text-blue-200/70 mb-4">${escAttr(linksLabel)}</p>
          <ul class="space-y-2 text-sm">
            <li><a href="index.html"  class="text-blue-100 hover:text-white transition-colors">Programs</a></li>
            <li><a href="faq.html"    class="text-blue-100 hover:text-white transition-colors">FAQ</a></li>
            <li><a href="book.html"   class="text-blue-100 hover:text-white transition-colors">Book a Call</a></li>
          </ul>
        </div>
      </div>
      <div class="relative border-t border-white/10 py-6 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-blue-200/70 text-center md:text-left">${escAttr(copyright)}</p>
        <a href="https://shalomkarr.pages.dev" target="_blank" rel="noopener"
           class="group relative inline-flex items-center justify-center gap-3 px-5 py-2 bg-slate-900/60 hover:bg-slate-900 rounded-full border border-white/10 hover:border-blue-300/60 transition-all duration-500 hover:shadow-[0_0_25px_rgba(147,197,253,0.20)] active:scale-95">
          <span class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent"></span>
          <span class="relative text-[10px] uppercase tracking-[0.2em] text-blue-200/50 group-hover:text-blue-200 transition-colors font-bold">Built By</span>
          <span class="relative flex items-center gap-2 border-l border-white/10 pl-3">
            <span class="font-bold text-blue-100 group-hover:text-white transition-colors text-sm">Shalom Karr</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-300 opacity-70 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </span>
        </a>
      </div>`;
  };
})();
