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

    const addressHtml = address
      ? address.split(',').map(s => escAttr(s.trim())).join('<br>')
      : '';

    target.className = 'bg-slate-900 text-slate-300 mt-20';
    target.innerHTML = `
      <div class="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">${escAttr(aboutLabel)}</p>
          <div class="flex items-center gap-4 flex-wrap">
            <a href="${escAttr(p1Url)}" target="_blank" rel="noopener" title="${escAttr(p1Name)}"
               class="bg-white rounded-lg p-3 inline-block hover:scale-105 transition-transform">
              <img src="assets/logo-ay.png" alt="${escAttr(p1Name)}" class="h-12 w-auto">
            </a>
            <a href="${escAttr(p2Url)}" target="_blank" rel="noopener" title="${escAttr(p2Name)}"
               class="bg-white rounded-lg p-3 inline-block hover:scale-105 transition-transform">
              <img src="assets/logo-aimd.png" alt="${escAttr(p2Name)}" class="h-12 w-auto">
            </a>
          </div>
        </div>

        <div>
          <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">${escAttr(contactLabel)}</p>
          <ul class="space-y-2 text-sm">
            ${email   ? `<li><a href="mailto:${escAttr(email)}" class="hover:text-white">${escAttr(email)}</a></li>` : ''}
            ${phone   ? `<li><a href="tel:${escAttr(phone.replace(/[^\d+]/g,''))}" class="hover:text-white">${escAttr(phone)}</a></li>` : ''}
            ${address ? `<li class="text-slate-400 leading-relaxed">${addressHtml}</li>` : ''}
          </ul>
        </div>

        <div>
          <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">${escAttr(linksLabel)}</p>
          <ul class="space-y-2 text-sm">
            <li><a href="index.html" class="hover:text-white">Programs</a></li>
            <li><a href="faq.html" class="hover:text-white">FAQ</a></li>
            <li><a href="book.html" class="hover:text-white">Book a Call</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-slate-800 py-5 px-6 space-y-1">
        <p class="text-center text-xs text-slate-400">${escAttr(copyright)}</p>
        <p class="text-center text-[11px] text-slate-500">
          Built by <a href="https://github.com/Shalom-Karr" target="_blank" rel="noopener" class="text-slate-300 hover:text-white underline-offset-2 hover:underline">Shalom Karr</a>
        </p>
      </div>`;
  };
})();
