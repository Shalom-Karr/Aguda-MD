/* ============================================================================
 * admin.js — Agudah MD admin page logic
 *
 * Sections:
 *   1. Constants & state
 *   2. Helpers
 *   3. Auth gate
 *   4. View toggle (editor vs settings)
 *   5. Sidebar (post list)
 *   6. Editor: load / new / paint
 *   7. Editor: publish toggle
 *   8. Editor: input bindings + dirty tracking
 *   9. Editor: preview rendering
 *  10. Editor: toolbar / shortcuts
 *  11. Editor: image upload + paste handling
 *  12. Editor: save / delete
 *  13. Editor: sync scroll
 *  14. Settings: load / paint / save
 *  15. Help modal
 *  16. Init
 * ========================================================================== */
(() => {
  'use strict';

  /* ============================ 1. CONSTANTS & STATE ====================== */
  const C = window.SITE_CONFIG;

  // Default category emojis (mirrors index.html / posts.html)
  const CATEGORY_DEFAULT_ICON = {
    Food: '🍎', Health: '🏥', Housing: '🏠',
    Energy: '⚡', Family: '👶', Income: '💵',
  };

  // Icon options for the picker. First entry is "default (use category)".
  const ICON_OPTIONS = [
    '🍎','🏥','🏠','⚡','👶','💵','📋','📚','💼','🎓',
    '⚖️','🛡️','🏛️','📞','✉️','💊','🍼','♿','🩺','🔑',
    '🚌','🍞','💧','🏥','🧑‍⚕️','📝','🎒','👨‍👩‍👧','💳','🆘'
  ];

  let currentPost   = blankPost();
  let isDirty       = false;
  let currentView   = 'editor';                  // 'editor' | 'faqs' | 'settings'
  let editorView    = 'guide';                   // 'guide' | 'faq' (within the program editor)
  let settingsCache = {};
  let settingsDirty = false;
  let faqDirtyIds   = new Set();
  let postFilter    = 'all';                     // 'all' | 'live' | 'draft'
  let cmView        = null;                      // CodeMirror 6 EditorView (set up in initCmEditor)

  function blankPost() {
    return {
      id: null, slug: '', title: '', summary: '',
      category: (C.categories || ['General'])[0],
      icon: '', content_md: '', faq_md: '', is_published: false,
      sort_order: 100,
    };
  }

  /* =================================== 2. HELPERS ========================= */
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function setStatus(msg, color = '#94a3b8') {
    const el = $('#save-status');
    el.textContent = msg;
    el.style.color = color;
  }

  // path: "hero.heading" → reads/writes nested object property
  function getByPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }
  function setByPath(obj, path, value) {
    const keys = path.split('.');
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      cur[keys[i]] = cur[keys[i]] || {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    return obj;
  }

  /* =================================== 3. AUTH GATE ======================= */
  async function requireAdmin() {
    if (window.PROGRAMS_MODE !== 'supabase') return true;

    const user = await window.ProgramsDB.getCurrentUser();
    if (!user) { showLogin(); return false; }

    const allowed = await window.ProgramsDB.isAdmin(user.email);
    if (!allowed) {
      document.body.innerHTML = `
        <div class="flex items-center justify-center h-screen p-6 text-center">
          <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md">
            <h1 class="text-2xl font-extrabold text-slate-900 mb-2">Not authorized</h1>
            <p class="text-slate-600 mb-5">Your account (<strong>${escapeHtml(user.email)}</strong>) is not in the admin list.</p>
            <button id="not-authorized-signout" class="bg-slate-900 text-white font-bold px-5 py-2 rounded-lg">Sign out</button>
          </div>
        </div>`;
      $('#not-authorized-signout').addEventListener('click', async () => {
        await window.ProgramsDB.signOut();
        location.reload();
      });
      return false;
    }

    $('#signout-btn').classList.remove('hidden');
    return true;
  }

  function showLogin() {
    $('#auth-gate').classList.remove('hidden');
    $('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('#login-email').value;
      const pw    = $('#login-password').value;
      const errEl = $('#login-error');
      errEl.textContent = '';
      try {
        await window.ProgramsDB.signIn(email, pw);
        location.reload();
      } catch (err) {
        errEl.textContent = err.message || 'Login failed';
      }
    });
  }

  async function signOut() {
    await window.ProgramsDB.signOut();
    location.reload();
  }

  /* =================================== 4. VIEW TOGGLE ===================== */
  function setView(view) {
    if (view === currentView) return;

    // Warn on unsaved changes when leaving
    if (currentView === 'editor'   && isDirty            && !confirm('You have unsaved changes in the editor. Switch tabs anyway?')) return;
    if (currentView === 'settings' && settingsDirty      && !confirm('You have unsaved settings changes. Switch tabs anyway?')) return;
    if (currentView === 'faqs'     && faqDirtyIds.size   && !confirm('You have unsaved FAQ changes. Switch tabs anyway?')) return;

    currentView = view;

    // Tab styling helper
    const setTab = (id, active) => {
      const el = $(id);
      el.classList.toggle('text-brand-700',   active);
      el.classList.toggle('border-b-2',       active);
      el.classList.toggle('border-brand-700', active);
      el.classList.toggle('bg-brand-50/50',   active);
      el.classList.toggle('text-slate-500',   !active);
    };
    setTab('#tab-programs', view === 'editor');
    setTab('#tab-faqs',     view === 'faqs');
    setTab('#tab-settings', view === 'settings');

    // Sidebar contents
    $('#sidebar-programs').classList.toggle('hidden', view !== 'editor');
    $('#sidebar-faqs').classList.toggle('hidden',     view !== 'faqs');
    $('#sidebar-settings').classList.toggle('hidden', view !== 'settings');

    // Main content
    $('#editor-main').classList.toggle('hidden',   view !== 'editor');
    $('#faqs-main').classList.toggle('hidden',     view !== 'faqs');
    $('#settings-main').classList.toggle('hidden', view !== 'settings');

    // Save buttons (FAQs save inline, no top-bar button)
    $('#save-program-btn').classList.toggle('hidden',  view !== 'editor');
    $('#save-settings-btn').classList.toggle('hidden', view !== 'settings');

    // Lazy-load tab data
    if (view === 'settings' && !settingsCache.__loaded) loadSettings();
    if (view === 'faqs')                                loadFaqList();
  }

  /* =================================== 5. SIDEBAR ========================= */
  async function loadPostList() {
    const listEl = $('#post-list');
    const search = $('#list-search').value.toLowerCase().trim();

    let posts;
    try { posts = await window.ProgramsDB.listAll(); }
    catch (e) {
      listEl.innerHTML = '<div class="p-4 text-xs text-red-600">Failed to load posts.</div>';
      return;
    }

    const filtered = posts
      .filter(p => {
        if (postFilter === 'live')  return p.is_published;
        if (postFilter === 'draft') return !p.is_published;
        return true;
      })
      .filter(p => !search ||
        (p.title || '').toLowerCase().includes(search) ||
        (p.slug || '').includes(search)
      );

    if (!filtered.length) {
      listEl.innerHTML = `
        <div class="p-6 text-sm text-slate-400 text-center">
          ${postFilter === 'all' && !search
            ? 'No programs yet.<br><span class="text-xs">Click "Create New Draft" to start.</span>'
            : 'No matching programs.'}
        </div>`;
      return;
    }

    listEl.innerHTML = filtered.map(p => `
      <div class="post-row border-b border-slate-100 hover:bg-slate-50 ${currentPost.id === p.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : ''}">
        <button data-load-post="${p.id}" class="w-full text-left px-3 py-2.5 pr-20">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <div class="font-semibold text-sm text-slate-900 truncate">
                ${p.icon ? `<span class="mr-1">${escapeHtml(p.icon)}</span>` : ''}${escapeHtml(p.title || '(untitled)')}
              </div>
              <div class="text-[11px] text-slate-500 font-mono truncate">${escapeHtml(p.slug || '—')}</div>
            </div>
            ${p.is_published
              ? '<span class="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">Live</span>'
              : '<span class="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">Draft</span>'}
          </div>
          <div class="text-[10px] text-slate-400 mt-1">
            #${p.sort_order ?? '?'} · ${escapeHtml(p.category || '')} · ${new Date(p.updated_at || p.created_at).toLocaleDateString()}
          </div>
        </button>
        <button class="row-action" data-duplicate="${p.id}" title="Duplicate this program as a new draft">Duplicate</button>
      </div>`).join('');

    listEl.querySelectorAll('[data-load-post]').forEach(btn => {
      btn.addEventListener('click', () => loadPost(btn.dataset.loadPost));
    });
    listEl.querySelectorAll('[data-duplicate]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        duplicatePost(btn.dataset.duplicate);
      });
    });
  }

  /* ----- Status filter pills (sidebar) ----- */
  function wireStatusFilter() {
    $$('#status-filter .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        postFilter = btn.dataset.filter;
        $$('#status-filter .filter-pill').forEach(b =>
          b.classList.toggle('active', b.dataset.filter === postFilter));
        loadPostList();
      });
    });
  }

  /* ----- Duplicate a program as a new unsaved draft ----- */
  async function duplicatePost(id) {
    if (isDirty && !confirm('You have unsaved changes. Discard them and start a duplicate?')) return;
    const all = await window.ProgramsDB.listAll();
    const original = all.find(p => p.id === id);
    if (!original) return;
    currentPost = {
      ...blankPost(),
      ...original,
      id: null,
      slug: (original.slug || '') + '-copy',
      title: (original.title || 'Untitled') + ' (copy)',
      is_published: false,
      sort_order: (original.sort_order || 100) + 1,
    };
    delete currentPost.created_at;
    delete currentPost.updated_at;
    paintFromState();
    isDirty = true;
    setStatus('Duplicated — review and Save to keep', '#1e3a5f');
    loadPostList();
    $('#post-title').focus();
    $('#post-title').select();
  }

  /* ----- Summary length counter (Google snippets ~155 chars) ----- */
  function updateSummaryCounter() {
    const len = ($('#post-summary').value || '').length;
    const el  = $('#summary-counter');
    if (!el) return;
    el.textContent = `${len} / 155`;
    el.style.color = len > 160 ? '#dc2626'
                   : len > 130 ? '#d97706'
                   : '#94a3b8';
  }

  /* ----- Preview the unsaved draft as a visitor would see it ----- */
  function previewDraft() {
    if (!currentPost.title.trim()) {
      alert('Add a title before previewing.');
      return;
    }
    syncActiveContentMd();
    // localStorage (not sessionStorage) so the new tab can read it
    const key = 'bcrn_preview_' + Date.now();
    try {
      localStorage.setItem(key, JSON.stringify({
        ...currentPost,
        slug: currentPost.slug || 'preview',
      }));
    } catch (e) {
      alert('Could not stash preview data: ' + (e.message || e));
      return;
    }
    window.open('posts.html?preview=' + encodeURIComponent(key), '_blank');
  }

  /* ========================== 6. EDITOR — load / new / paint ============== */
  async function loadPost(id) {
    if (isDirty && !confirm('You have unsaved changes. Discard them and load another post?')) return;
    const all = await window.ProgramsDB.listAll();
    const p = all.find(x => x.id === id);
    if (!p) return;
    currentPost = { ...blankPost(), ...p };
    paintFromState();
    isDirty = false;
    setStatus('');
    loadPostList();
  }

  function newPost() {
    if (isDirty && !confirm('You have unsaved changes. Start a new draft anyway?')) return;
    currentPost = blankPost();
    paintFromState();
    isDirty = false;
    setStatus('');
    loadPostList();
    $('#post-title').focus();
  }

  function paintFromState() {
    $('#post-title').value      = currentPost.title    || '';
    $('#post-slug').value       = currentPost.slug     || '';
    $('#post-category').value   = currentPost.category || (C.categories || ['General'])[0];
    $('#post-summary').value    = currentPost.summary  || '';
    $('#post-sort-order').value = (currentPost.sort_order ?? 100);
    updateSummaryCounter();
    $('#preview-draft-btn').classList.toggle('hidden', !currentPost.title);
    $('#post-slug').dataset.manual = currentPost.id ? '1' : '';
    $('#delete-btn').classList.toggle('hidden', !currentPost.id);
    paintIconPicker();
    updateBreadcrumb();
    updatePublishUI();
    updatePreviewLink();
    setEditorView('guide');   // reset to Guide tab on each post load
  }

  /* ---------- Guide / FAQ editor view toggle ---------- */
  function setEditorView(view) {
    editorView = view;
    $$('.editor-content-tabs button').forEach(b => {
      b.classList.toggle('active', b.dataset.editorView === view);
    });
    const newDoc = (view === 'faq')
      ? (currentPost.faq_md || '')
      : (currentPost.content_md || '');
    cmSetValue(newDoc);
    renderPreview();
  }

  function updateBreadcrumb() {
    $('#editor-breadcrumb').textContent =
      currentPost.id ? (currentPost.title || '(untitled)') : 'New draft';
  }

  /* ============================ 6b. EDITOR — icon picker ================== */
  function paintIconPicker() {
    const picker = $('#icon-picker');
    if (!picker) return;
    const selected = currentPost.icon || '';
    const fallback = CATEGORY_DEFAULT_ICON[currentPost.category] || '📋';
    const buttons = [
      `<button type="button" data-icon="" class="${selected === '' ? 'selected' : ''}" title="Use the default icon for the selected category">
         <span class="icon-default">Default<br>${fallback}</span>
       </button>`,
      ...ICON_OPTIONS.map(emoji => `
        <button type="button" data-icon="${escapeHtml(emoji)}" class="${selected === emoji ? 'selected' : ''}" title="Use ${escapeHtml(emoji)}">
          ${escapeHtml(emoji)}
        </button>`)
    ];
    picker.innerHTML = buttons.join('');
    picker.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPost.icon = btn.dataset.icon;
        paintIconPicker();
        markDirty();
      });
    });
  }

  /* ============================== 7. EDITOR — publish toggle ============== */
  function togglePublish() {
    currentPost.is_published = !currentPost.is_published;
    markDirty();
    updatePublishUI();
  }

  function updatePublishUI() {
    const sw    = $('#pub-switch');
    const label = $('#status-label');
    const help  = $('#status-help');
    if (currentPost.is_published) {
      sw.classList.add('on');
      label.textContent = 'Published';
      label.className = 'text-sm font-bold text-emerald-700';
      help.textContent = 'Live on the website';
    } else {
      sw.classList.remove('on');
      label.textContent = 'Draft';
      label.className = 'text-sm font-bold text-amber-700';
      help.textContent = 'Only visible to admins';
    }
    updatePreviewLink();
  }

  function updatePreviewLink() {
    const link = $('#preview-link');
    if (currentPost.slug && currentPost.is_published) {
      link.href = `posts.html?title=${encodeURIComponent(currentPost.slug)}`;
      link.classList.remove('hidden');
    } else {
      link.classList.add('hidden');
    }
  }

  /* ============================ 8. EDITOR — input bindings ================ */
  function wireEditorInputs() {
    $('#post-title').addEventListener('input', (e) => {
      currentPost.title = e.target.value;
      if (!currentPost.id && !$('#post-slug').dataset.manual) {
        const auto = window.slugify(e.target.value);
        $('#post-slug').value = auto;
        currentPost.slug = auto;
        updatePreviewLink();
      }
      updateBreadcrumb();
      markDirty();
    });
    $('#post-slug').addEventListener('input', (e) => {
      currentPost.slug = e.target.value;
      e.target.dataset.manual = '1';
      updatePreviewLink();
      markDirty();
    });
    $('#post-category').addEventListener('change', (e) => {
      currentPost.category = e.target.value;
      paintIconPicker();   // refresh "default" preview
      markDirty();
    });
    $('#post-summary').addEventListener('input', (e) => {
      currentPost.summary = e.target.value;
      updateSummaryCounter();
      markDirty();
    });
    $('#post-sort-order').addEventListener('input', (e) => {
      const n = parseInt(e.target.value, 10);
      currentPost.sort_order = Number.isFinite(n) ? n : 100;
      markDirty();
    });
    // Note: the markdown editor's input listener lives inside CodeMirror
    // (see initCmEditor) — no textarea wiring needed here.
    $('#pub-switch').addEventListener('click', togglePublish);
    $('#list-search').addEventListener('input', loadPostList);
  }

  function markDirty() {
    isDirty = true;
    setStatus('Unsaved changes');
  }

  /* ============================ 9. EDITOR — CodeMirror integration ========
   * CM6 is loaded as an ES module in admin.html and exposed on window.CM6.
   * initCmEditor() awaits it, instantiates the editor, and wires update /
   * paste / drop / shortcut listeners. cmGetValue/cmSetValue/cmReplace are
   * the small surface the rest of the file talks to so we don't sprinkle
   * dispatch() calls everywhere. */
  async function initCmEditor() {
    if (!window.CM6) {
      await new Promise(r => window.addEventListener('cm6-ready', r, { once: true }));
    }
    const { EditorView, basicSetup, keymap, markdown, markdownLanguage,
            syntaxHighlighting, mdHighlight } = window.CM6;

    cmView = new EditorView({
      doc: '',
      parent: $('#post-content-host'),
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        markdown({ base: markdownLanguage }),
        syntaxHighlighting(mdHighlight),
        EditorView.theme({
          '&':            { height: '100%', backgroundColor: 'white' },
          '.cm-scroller': { overflow: 'auto' },
        }),
        EditorView.updateListener.of(update => {
          if (!update.docChanged) return;
          syncActiveContentMd();
          renderPreview();
          markDirty();
        }),
        keymap.of([
          { key: 'Mod-b', preventDefault: true, run: () => { md('**', '**'); return true; } },
          { key: 'Mod-i', preventDefault: true, run: () => { md('*', '*');   return true; } },
          { key: 'Mod-k', preventDefault: true, run: () => { mdLink();        return true; } },
          { key: 'Mod-s', preventDefault: true, run: () => {
            if (currentView === 'editor') savePost();
            else                          saveSettings();
            return true;
          }},
        ]),
      ],
    });

    cmView.dom.addEventListener('paste',    handleEditorPaste);
    cmView.dom.addEventListener('dragover', (e) => e.preventDefault());
    cmView.dom.addEventListener('drop',     handleEditorDrop);
  }

  function cmGetValue() {
    return cmView ? cmView.state.doc.toString() : '';
  }
  function cmSetValue(v) {
    if (!cmView) return;
    cmView.dispatch({
      changes: { from: 0, to: cmView.state.doc.length, insert: v || '' },
    });
  }
  function cmReplaceSelection(text, opts = {}) {
    if (!cmView) return;
    const sel = cmView.state.selection.main;
    cmView.dispatch({
      changes: { from: sel.from, to: sel.to, insert: text },
      selection: opts.selectInserted
        ? { anchor: sel.from, head: sel.from + text.length }
        : { anchor: sel.from + text.length },
    });
  }

  function renderPreview() {
    $('#preview').innerHTML = DOMPurify.sanitize(marked.parse(cmGetValue() || ''));
  }

  /* Updates whichever field (content_md or faq_md) is currently active in
   * the editor with the editor's current value. Called by the toolbar
   * helpers, paste/drop, and CM's update listener. */
  function syncActiveContentMd() {
    const v = cmGetValue();
    if (editorView === 'faq') currentPost.faq_md = v;
    else                      currentPost.content_md = v;
  }

  /* =========================== 10. EDITOR — toolbar / shortcuts =========== */
  function md(before, after) {
    if (!cmView) return;
    const sel  = cmView.state.selection.main;
    const text = cmView.state.doc.sliceString(sel.from, sel.to);
    cmView.dispatch({
      changes: { from: sel.from, to: sel.to, insert: before + text + after },
      selection: text.length === 0
        ? { anchor: sel.from + before.length }
        : { anchor: sel.from + before.length, head: sel.from + before.length + text.length },
    });
    cmView.focus();
  }

  function mdLine(prefix) {
    if (!cmView) return;
    const sel  = cmView.state.selection.main;
    const line = cmView.state.doc.lineAt(sel.from);
    cmView.dispatch({
      changes: { from: line.from, to: line.from, insert: prefix },
      selection: { anchor: sel.from + prefix.length },
    });
    cmView.focus();
  }

  function mdLink() {
    if (!cmView) return;
    const sel = cmView.state.selection.main;
    const text = cmView.state.doc.sliceString(sel.from, sel.to) || 'link text';
    const url  = prompt('Enter the URL:', 'https://');
    if (!url) return;
    const insert = `[${text}](${url})`;
    cmView.dispatch({
      changes: { from: sel.from, to: sel.to, insert },
      selection: { anchor: sel.from + 1, head: sel.from + 1 + text.length },
    });
    cmView.focus();
  }

  function wireKeyboardShortcuts() {
    // ⌘B/I/K/S inside the editor are handled by the CM keymap (see
    // initCmEditor). This catches ⌘S anywhere else on the admin page —
    // e.g. saving from the Settings tab.
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        // Don't double-fire when the editor already handled it
        if (cmView && cmView.dom.contains(document.activeElement)) return;
        e.preventDefault();
        if (currentView === 'editor') savePost();
        else                          saveSettings();
      }
    });
  }

  /* ===================== 11. EDITOR — image upload + paste ================ */
  function insertAtCursor(text) {
    cmReplaceSelection(text);
  }

  async function uploadAndInsertImage(file, placeholderName = 'image') {
    if (!file || !file.type.startsWith('image/')) return;
    const placeholder = `![Uploading ${placeholderName}...]()`;
    insertAtCursor(placeholder);
    setStatus('Uploading image...', '#64748b');
    try {
      const url   = await window.ProgramsDB.uploadImage(file);
      const newMd = cmGetValue().replace(placeholder, `![${placeholderName}](${url})`);
      cmSetValue(newMd);
      setStatus('Image uploaded ✓', '#059669');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error(err);
      // Strip the placeholder on failure
      cmSetValue(cmGetValue().replace(placeholder, ''));
      setStatus('Upload failed', '#dc2626');
      alert('Image upload failed: ' + (err.message || err));
    }
  }

  function handleImageFileInput(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';   // reset so re-selecting the same file fires
    if (file) uploadAndInsertImage(file, file.name.replace(/\.[^.]+$/, ''));
  }

  // CodeMirror's editor DOM receives the paste/drop events; these handlers
  // are wired in initCmEditor().
  async function handleEditorPaste(e) {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (const item of items) {
      if (item.type && item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await uploadAndInsertImage(file, 'pasted image');
        return;
      }
    }
  }

  async function handleEditorDrop(e) {
    const files = e.dataTransfer && e.dataTransfer.files;
    if (!files || !files.length) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    e.preventDefault();
    await uploadAndInsertImage(file, file.name.replace(/\.[^.]+$/, ''));
  }

  /* ============================ 12. EDITOR — save / delete ================ */
  async function savePost() {
    if (!currentPost.title.trim()) { alert('Please enter a title before saving.'); return; }
    if (!currentPost.slug.trim()) {
      currentPost.slug = window.slugify(currentPost.title);
      $('#post-slug').value = currentPost.slug;
    }
    setStatus('Saving...', '#64748b');
    try {
      const saved = await window.ProgramsDB.save(currentPost);
      currentPost = { ...blankPost(), ...saved };
      isDirty = false;
      setStatus('Saved ✓', '#059669');
      setTimeout(() => setStatus(''), 2000);
      $('#delete-btn').classList.remove('hidden');
      updatePreviewLink();
      loadPostList();
    } catch (err) {
      console.error(err);
      setStatus('Error saving', '#dc2626');
      alert('Save failed: ' + (err.message || err));
    }
  }

  async function deletePost() {
    if (!currentPost.id) return;
    const title = currentPost.title || '(untitled)';
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    try {
      await window.ProgramsDB.remove(currentPost.id);
      newPost();
      loadPostList();
      setStatus('Deleted', '#dc2626');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error(err);
      alert('Delete failed: ' + (err.message || err));
    }
  }

  /* =========================== 13. EDITOR — sync scroll =================== */
  function wireSyncScroll() {
    const editorEl  = cmView ? cmView.scrollDOM : null;
    const previewEl = $('#preview');
    if (!editorEl || !previewEl) return;
    let syncing = false;
    function pair(src, dst) {
      src.addEventListener('scroll', () => {
        if (syncing || !$('#sync-scroll').checked) return;
        syncing = true;
        const pct = src.scrollTop / (src.scrollHeight - src.clientHeight || 1);
        dst.scrollTop = pct * (dst.scrollHeight - dst.clientHeight);
        requestAnimationFrame(() => { syncing = false; });
      });
    }
    pair(editorEl,  previewEl);
    pair(previewEl, editorEl);
  }

  /* ============================ 14. SETTINGS ============================== */
  async function loadSettings() {
    try {
      const data = await window.ProgramsDB.getSettings();
      settingsCache = data || {};
      settingsCache.__loaded = true;
    } catch (e) {
      console.warn('Failed to load settings:', e);
      settingsCache = { __loaded: true };
    }
    paintSettingsForm();
    applyFaqTabVisibility();
  }

  /* The FAQs tab edits site-wide FAQs only. When the admin has flipped the
   * "general FAQ section" off, that whole tab becomes pointless — so we hide
   * the tab + sidebar/main and bounce the user back to the editor if they're
   * on it. Per-program FAQs live inside the program editor, not affected. */
  function applyFaqTabVisibility() {
    const enabled = settingsCache.faqEnabled !== false &&
                    (settingsCache.faqEnabled !== undefined || C.faqEnabled !== false);
    $('#tab-faqs').classList.toggle('hidden', !enabled);
    if (!enabled && currentView === 'faqs') setView('editor');
  }

  function paintSettingsForm() {
    $$('[data-setting]').forEach(input => {
      const path = input.dataset.setting;
      const dbVal      = getByPath(settingsCache, path);
      const defaultVal = getByPath(C, path);
      if (input.dataset.bool) {
        // Checkbox-backed boolean setting
        const eff = (dbVal != null ? dbVal : (defaultVal != null ? defaultVal : false));
        input.checked = !!eff;
      } else {
        input.value = (dbVal != null ? dbVal : (defaultVal != null ? defaultVal : ''));
        input.placeholder = defaultVal != null ? String(defaultVal) : input.placeholder;
      }
    });
    settingsDirty = false;
  }

  function wireSettingsInputs() {
    $$('[data-setting]').forEach(input => {
      const evt = (input.type === 'checkbox') ? 'change' : 'input';
      input.addEventListener(evt, () => {
        settingsDirty = true;
        setStatus('Unsaved settings');
      });
    });
  }

  async function saveSettings() {
    const updates = {};
    $$('[data-setting]').forEach(input => {
      const path = input.dataset.setting;
      if (input.dataset.bool) {
        setByPath(updates, path, !!input.checked);
        return;
      }
      const val  = input.value;
      // Empty input = unset (revert to default from config.js)
      setByPath(updates, path, val === '' ? null : val);
    });

    setStatus('Saving settings...', '#64748b');
    try {
      const merged = mergeNonNull(settingsCache, updates);
      const saved  = await window.ProgramsDB.saveSettings(merged);
      settingsCache = saved || {};
      settingsCache.__loaded = true;
      settingsDirty = false;
      applyFaqTabVisibility();
      setStatus('Settings saved ✓', '#059669');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error(err);
      setStatus('Error saving settings', '#dc2626');
      alert('Settings save failed: ' + (err.message || err));
    }
  }

  // Drop null values from `over` (means "use default") while preserving structure
  function mergeNonNull(base, over) {
    const out = { ...base };
    for (const k of Object.keys(over)) {
      if (over[k] === null) {
        delete out[k];
      } else if (typeof over[k] === 'object' && !Array.isArray(over[k])) {
        out[k] = mergeNonNull(base[k] || {}, over[k]);
        if (out[k] && Object.keys(out[k]).length === 0) delete out[k];
      } else {
        out[k] = over[k];
      }
    }
    return out;
  }

  /* ================================ 15. HELP MODAL ======================== */
  function showHelp()  { $('#help-modal').classList.remove('hidden'); }
  function closeHelp() { $('#help-modal').classList.add('hidden'); }

  /* ================================ 14b. FAQS ============================ */
  let faqs = [];

  async function loadFaqList() {
    const listEl = $('#faq-list');
    listEl.innerHTML = '<div class="text-sm text-slate-400 text-center py-8">Loading...</div>';
    try {
      faqs = await window.ProgramsDB.listAllFaqs();
    } catch (e) {
      console.error(e);
      listEl.innerHTML = '<div class="text-sm text-red-600 text-center py-8">Failed to load FAQs.</div>';
      return;
    }
    renderFaqList();
  }

  function renderFaqList() {
    const listEl = $('#faq-list');
    if (!faqs.length) {
      listEl.innerHTML = `
        <div class="text-center py-12 bg-white border-2 border-dashed border-slate-200 rounded-xl">
          <p class="text-slate-500 mb-3">No FAQs yet.</p>
          <button onclick="addFaq()" class="bg-brand-700 hover:bg-brand-800 text-white font-bold px-4 py-2 rounded-lg">+ Add your first FAQ</button>
        </div>`;
      return;
    }
    listEl.innerHTML = faqs.map(f => faqCardHtml(f)).join('');
    wireFaqCards();
  }

  function faqCardHtml(f) {
    const dirty = faqDirtyIds.has(f.id);
    const showHome = f.show_on_homepage === true;
    const showFaq  = f.show_on_faq_page !== false; // default true
    return `
      <div class="faq-card ${dirty ? 'dirty' : ''}" data-faq-id="${escapeHtml(f.id)}">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Question</label>
          <input type="text" class="settings-input" data-field="question" value="${escapeHtml(f.question || '')}" placeholder="What's the question?">
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Answer <span class="text-slate-400 normal-case font-normal">(HTML allowed — &lt;ul&gt;, &lt;a&gt;, &lt;strong&gt;, etc.)</span></label>
          <textarea rows="3" class="settings-input" data-field="answer" placeholder="The answer.">${escapeHtml(f.answer || '')}</textarea>
        </div>
        <div class="flex items-center gap-5 px-1 py-2 bg-slate-50 border border-slate-200 rounded-lg">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">Show on</span>
          <label class="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" data-field="show_on_homepage" ${showHome ? 'checked' : ''} class="w-4 h-4 accent-brand-600">
            Homepage
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" data-field="show_on_faq_page" ${showFaq ? 'checked' : ''} class="w-4 h-4 accent-brand-600">
            FAQ page
          </label>
        </div>
        <div class="faq-toolbar">
          <div class="flex items-center gap-3">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Order</label>
            <input type="number" class="settings-input w-20 text-sm" data-field="sort_order" value="${f.sort_order || 0}">
            <span class="text-xs text-slate-400">lower = first</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold text-slate-500">Draft</span>
            <button class="faq-pub-switch ${f.is_published ? 'on' : ''}" data-action="toggle-pub" aria-label="Toggle published"></button>
            <span class="text-xs font-semibold text-slate-500">Live</span>
            <span class="w-px h-5 bg-slate-300 mx-1"></span>
            <button data-action="delete" class="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg">Delete</button>
            <button data-action="save" class="bg-brand-700 hover:bg-brand-800 text-white font-bold px-4 py-1.5 rounded-lg text-sm">Save</button>
          </div>
        </div>
      </div>`;
  }

  function wireFaqCards() {
    $$('.faq-card').forEach(card => {
      const id = card.dataset.faqId;

      // Field changes mark dirty
      card.querySelectorAll('[data-field]').forEach(input => {
        const evt = (input.type === 'checkbox') ? 'change' : 'input';
        input.addEventListener(evt, () => {
          faqDirtyIds.add(id);
          card.classList.add('dirty');
          setStatus('Unsaved FAQ changes');
        });
      });

      // Toggle published
      const pubBtn = card.querySelector('[data-action="toggle-pub"]');
      pubBtn.addEventListener('click', () => {
        pubBtn.classList.toggle('on');
        faqDirtyIds.add(id);
        card.classList.add('dirty');
        setStatus('Unsaved FAQ changes');
      });

      // Save
      card.querySelector('[data-action="save"]').addEventListener('click', () => saveFaqCard(card));

      // Delete
      card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteFaqCard(card));
    });
  }

  function readFaqCard(card) {
    const id = card.dataset.faqId;
    const orig = faqs.find(f => f.id === id) || {};
    return {
      ...orig,
      id: id.startsWith('new-') ? null : id,
      question:         card.querySelector('[data-field="question"]').value,
      answer:           card.querySelector('[data-field="answer"]').value,
      sort_order:       parseInt(card.querySelector('[data-field="sort_order"]').value, 10) || 0,
      is_published:     card.querySelector('[data-action="toggle-pub"]').classList.contains('on'),
      show_on_homepage: card.querySelector('[data-field="show_on_homepage"]').checked,
      show_on_faq_page: card.querySelector('[data-field="show_on_faq_page"]').checked,
    };
  }

  async function saveFaqCard(card) {
    const data = readFaqCard(card);
    if (!data.question.trim()) { alert('Please enter a question.'); return; }
    setStatus('Saving FAQ...', '#64748b');
    try {
      const saved = await window.ProgramsDB.saveFaq(data);
      // Replace entry in cache
      const oldId = card.dataset.faqId;
      const idx = faqs.findIndex(f => f.id === oldId);
      if (idx >= 0) faqs[idx] = saved;
      else faqs.push(saved);
      faqDirtyIds.delete(oldId);
      faqs.sort((a, b) => a.sort_order - b.sort_order);
      renderFaqList();
      setStatus('Saved ✓', '#059669');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error(err);
      setStatus('Error saving FAQ', '#dc2626');
      alert('Save failed: ' + (err.message || err));
    }
  }

  async function deleteFaqCard(card) {
    const id = card.dataset.faqId;
    const orig = faqs.find(f => f.id === id) || {};
    if (id.startsWith('new-')) {
      // Unsaved new card — just remove from view
      faqs = faqs.filter(f => f.id !== id);
      faqDirtyIds.delete(id);
      renderFaqList();
      return;
    }
    if (!confirm(`Delete this FAQ?\n\n"${orig.question || '(no question yet)'}"\n\nThis cannot be undone.`)) return;
    try {
      await window.ProgramsDB.removeFaq(id);
      faqs = faqs.filter(f => f.id !== id);
      faqDirtyIds.delete(id);
      renderFaqList();
      setStatus('FAQ deleted', '#dc2626');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error(err);
      alert('Delete failed: ' + (err.message || err));
    }
  }

  function addFaq() {
    const tempId = 'new-' + Date.now();
    const nextOrder = (faqs.reduce((m, f) => Math.max(m, f.sort_order || 0), 0)) + 10;
    faqs.push({
      id: tempId, question: '', answer: '', sort_order: nextOrder,
      is_published: true, show_on_homepage: false, show_on_faq_page: true,
    });
    faqDirtyIds.add(tempId);
    renderFaqList();
    // Focus the question of the new card
    setTimeout(() => {
      const card = document.querySelector(`[data-faq-id="${tempId}"]`);
      card && card.querySelector('[data-field="question"]').focus();
    }, 0);
  }

  /* ============================ 15b. FULLSCREEN EDITOR ==================== */
  function toggleFullscreen() {
    document.body.classList.toggle('editor-fullscreen');
    // Make sure we're on the editor view (not settings) when entering fullscreen
    if (document.body.classList.contains('editor-fullscreen') && currentView !== 'editor') {
      setView('editor');
    }
  }

  /* ===================================== 16. INIT ========================= */
  function populateCategoryDropdown() {
    const sel = $('#post-category');
    sel.innerHTML = '';
    (C.categories || ['General']).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      sel.appendChild(opt);
    });
  }

  function exposeGlobals() {
    Object.assign(window, {
      newPost, savePost, deletePost, duplicatePost, previewDraft,
      saveSettings, setView, setEditorView,
      addFaq,
      showHelp, closeHelp, signOut,
      mdLink, toggleFullscreen,
      handleImageFileInput,
    });
    // Toolbar onclick handlers reference these:
    window.md = md;
    window.mdLine = mdLine;
  }

  async function init() {
    $('#mode-label').textContent = window.PROGRAMS_MODE || 'demo';
    if (window.PROGRAMS_MODE === 'demo') $('#demo-banner').classList.remove('hidden');

    populateCategoryDropdown();
    exposeGlobals();

    // Help modal close on click outside / Esc
    $('#help-modal').addEventListener('click', (e) => {
      if (e.target.id === 'help-modal') closeHelp();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!$('#help-modal').classList.contains('hidden')) closeHelp();
        else if (document.body.classList.contains('editor-fullscreen')) toggleFullscreen();
      }
    });

    // Image file picker
    $('#image-upload').addEventListener('change', handleImageFileInput);

    // Guide / FAQ tab toggle inside the program editor
    $$('.editor-content-tabs button').forEach(b => {
      b.addEventListener('click', () => setEditorView(b.dataset.editorView));
    });

    wireEditorInputs();
    wireKeyboardShortcuts();
    wireSettingsInputs();
    wireStatusFilter();

    window.addEventListener('beforeunload', (e) => {
      if (isDirty || settingsDirty) { e.preventDefault(); e.returnValue = ''; }
    });

    const ok = await requireAdmin();
    if (!ok) return;

    // Reveal the admin chrome only after auth succeeds. Until this point
    // the header and main layout are display:none, so removing the auth
    // modal in dev tools leaves an empty page rather than exposing the UI.
    $('#admin-header').classList.remove('hidden');
    $('#admin-shell').classList.remove('hidden');

    // CodeMirror first — every other editor flow (paintFromState ->
    // setEditorView -> cmSetValue) assumes cmView exists.
    await initCmEditor();
    wireSyncScroll();

    paintFromState();
    renderPreview();
    loadPostList();

    // Pre-load settings so the FAQs tab can be hidden immediately when the
    // general FAQ section is off (rather than only after the user clicks
    // into Settings for the first time).
    loadSettings();
  }

  init();
})();
