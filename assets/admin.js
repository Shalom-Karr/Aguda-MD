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
  let currentView   = 'editor';                  // 'editor' | 'settings'
  let settingsCache = {};
  let settingsDirty = false;

  function blankPost() {
    return {
      id: null, slug: '', title: '', summary: '',
      category: (C.categories || ['General'])[0],
      icon: '', content_md: '', is_published: false,
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

    // Warn on unsaved changes when leaving the editor
    if (currentView === 'editor'   && isDirty       && !confirm('You have unsaved changes in the editor. Switch tabs anyway?')) return;
    if (currentView === 'settings' && settingsDirty && !confirm('You have unsaved settings changes. Switch tabs anyway?')) return;

    currentView = view;

    // Tab styling
    $('#tab-programs').classList.toggle('text-brand-700',         view === 'editor');
    $('#tab-programs').classList.toggle('border-b-2',             view === 'editor');
    $('#tab-programs').classList.toggle('border-brand-700',       view === 'editor');
    $('#tab-programs').classList.toggle('bg-brand-50/50',         view === 'editor');
    $('#tab-programs').classList.toggle('text-slate-500',         view !== 'editor');

    $('#tab-settings').classList.toggle('text-brand-700',         view === 'settings');
    $('#tab-settings').classList.toggle('border-b-2',             view === 'settings');
    $('#tab-settings').classList.toggle('border-brand-700',       view === 'settings');
    $('#tab-settings').classList.toggle('bg-brand-50/50',         view === 'settings');
    $('#tab-settings').classList.toggle('text-slate-500',         view !== 'settings');

    // Sidebar contents
    $('#sidebar-programs').classList.toggle('hidden', view !== 'editor');
    $('#sidebar-settings').classList.toggle('hidden', view !== 'settings');

    // Main content
    $('#editor-main').classList.toggle('hidden',   view !== 'editor');
    $('#settings-main').classList.toggle('hidden', view !== 'settings');

    // Save buttons
    $('#save-program-btn').classList.toggle('hidden',  view !== 'editor');
    $('#save-settings-btn').classList.toggle('hidden', view !== 'settings');

    // Lazy-load settings on first switch
    if (view === 'settings' && !settingsCache.__loaded) loadSettings();
  }

  /* =================================== 5. SIDEBAR ========================= */
  async function loadPostList() {
    const listEl = $('#post-list');
    const filter = $('#list-search').value.toLowerCase().trim();

    let posts;
    try { posts = await window.ProgramsDB.listAll(); }
    catch (e) {
      listEl.innerHTML = '<div class="p-4 text-xs text-red-600">Failed to load posts.</div>';
      return;
    }

    const filtered = filter
      ? posts.filter(p => (p.title || '').toLowerCase().includes(filter) || (p.slug || '').includes(filter))
      : posts;

    if (!filtered.length) {
      listEl.innerHTML = `
        <div class="p-6 text-sm text-slate-400 text-center">
          No programs yet.<br>
          <span class="text-xs">Click "Create New Draft" to start.</span>
        </div>`;
      return;
    }

    listEl.innerHTML = filtered.map(p => `
      <div class="border-b border-slate-100 hover:bg-slate-50 ${currentPost.id === p.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : ''}">
        <button data-load-post="${p.id}" class="w-full text-left px-3 py-2.5">
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
            ${escapeHtml(p.category || '')} · ${new Date(p.updated_at || p.created_at).toLocaleDateString()}
          </div>
        </button>
      </div>`).join('');

    listEl.querySelectorAll('[data-load-post]').forEach(btn => {
      btn.addEventListener('click', () => loadPost(btn.dataset.loadPost));
    });
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
    $('#post-title').value    = currentPost.title    || '';
    $('#post-slug').value     = currentPost.slug     || '';
    $('#post-category').value = currentPost.category || (C.categories || ['General'])[0];
    $('#post-summary').value  = currentPost.summary  || '';
    $('#post-content').value  = currentPost.content_md || '';
    $('#post-slug').dataset.manual = currentPost.id ? '1' : '';
    $('#delete-btn').classList.toggle('hidden', !currentPost.id);
    paintIconPicker();
    updateBreadcrumb();
    updatePublishUI();
    updatePreviewLink();
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
      markDirty();
    });
    $('#post-content').addEventListener('input', (e) => {
      currentPost.content_md = e.target.value;
      renderPreview();
      markDirty();
    });
    $('#pub-switch').addEventListener('click', togglePublish);
    $('#list-search').addEventListener('input', loadPostList);
  }

  function markDirty() {
    isDirty = true;
    setStatus('Unsaved changes');
  }

  /* ============================ 9. EDITOR — preview rendering ============= */
  function renderPreview() {
    const md = $('#post-content').value;
    $('#preview').innerHTML = DOMPurify.sanitize(marked.parse(md || ''));
  }

  /* =========================== 10. EDITOR — toolbar / shortcuts =========== */
  function md(before, after) {
    const ta = $('#post-content');
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const selected = v.slice(s, e);
    const replacement = before + selected + after;
    ta.value = v.slice(0, s) + replacement + v.slice(e);
    ta.focus();
    if (selected.length === 0) {
      ta.selectionStart = ta.selectionEnd = s + before.length;
    } else {
      ta.selectionStart = s + before.length;
      ta.selectionEnd   = s + before.length + selected.length;
    }
    currentPost.content_md = ta.value;
    renderPreview();
    markDirty();
  }

  function mdLine(prefix) {
    const ta = $('#post-content');
    const { selectionStart: s, value: v } = ta;
    let lineStart = s;
    while (lineStart > 0 && v[lineStart - 1] !== '\n') lineStart--;
    ta.value = v.slice(0, lineStart) + prefix + v.slice(lineStart);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = s + prefix.length;
    currentPost.content_md = ta.value;
    renderPreview();
    markDirty();
  }

  function mdLink() {
    const ta = $('#post-content');
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const selected = v.slice(s, e) || 'link text';
    const url = prompt('Enter the URL:', 'https://');
    if (!url) return;
    const replacement = `[${selected}](${url})`;
    ta.value = v.slice(0, s) + replacement + v.slice(e);
    ta.focus();
    ta.selectionStart = s + 1;
    ta.selectionEnd   = s + 1 + selected.length;
    currentPost.content_md = ta.value;
    renderPreview();
    markDirty();
  }

  function wireKeyboardShortcuts() {
    $('#post-content').addEventListener('keydown', (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 'b') { e.preventDefault(); md('**', '**'); }
      else if (k === 'i') { e.preventDefault(); md('*', '*'); }
      else if (k === 'k') { e.preventDefault(); mdLink(); }
    });
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (currentView === 'editor') savePost();
        else                          saveSettings();
      }
    });
  }

  /* ===================== 11. EDITOR — image upload + paste ================ */
  function insertAtCursor(text) {
    const ta = $('#post-content');
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    ta.value = v.slice(0, s) + text + v.slice(e);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = s + text.length;
    currentPost.content_md = ta.value;
    renderPreview();
    markDirty();
  }

  async function uploadAndInsertImage(file, placeholderName = 'image') {
    if (!file || !file.type.startsWith('image/')) return;
    const placeholder = `![Uploading ${placeholderName}...]()`;
    insertAtCursor(placeholder);
    setStatus('Uploading image...', '#64748b');
    try {
      const url = await window.ProgramsDB.uploadImage(file);
      const ta = $('#post-content');
      ta.value = ta.value.replace(placeholder, `![${placeholderName}](${url})`);
      currentPost.content_md = ta.value;
      renderPreview();
      markDirty();
      setStatus('Image uploaded ✓', '#059669');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error(err);
      // Strip the placeholder on failure
      const ta = $('#post-content');
      ta.value = ta.value.replace(placeholder, '');
      currentPost.content_md = ta.value;
      renderPreview();
      setStatus('Upload failed', '#dc2626');
      alert('Image upload failed: ' + (err.message || err));
    }
  }

  function handleImageFileInput(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';   // reset so re-selecting the same file fires
    if (file) uploadAndInsertImage(file, file.name.replace(/\.[^.]+$/, ''));
  }

  function wirePasteHandler() {
    $('#post-content').addEventListener('paste', async (e) => {
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
    });
  }

  function wireDragDrop() {
    const ta = $('#post-content');
    ta.addEventListener('dragover', (e) => { e.preventDefault(); });
    ta.addEventListener('drop', async (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (!files || !files.length) return;
      const file = files[0];
      if (!file.type.startsWith('image/')) return;
      e.preventDefault();
      await uploadAndInsertImage(file, file.name.replace(/\.[^.]+$/, ''));
    });
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
    const editorEl  = $('#post-content');
    const previewEl = $('#preview');
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
  }

  function paintSettingsForm() {
    $$('[data-setting]').forEach(input => {
      const path = input.dataset.setting;
      const dbVal      = getByPath(settingsCache, path);
      const defaultVal = getByPath(C, path);
      input.value = (dbVal != null ? dbVal : (defaultVal != null ? defaultVal : ''));
      input.placeholder = defaultVal != null ? String(defaultVal) : input.placeholder;
    });
    settingsDirty = false;
  }

  function wireSettingsInputs() {
    $$('[data-setting]').forEach(input => {
      input.addEventListener('input', () => {
        settingsDirty = true;
        setStatus('Unsaved settings');
      });
    });
  }

  async function saveSettings() {
    const updates = {};
    $$('[data-setting]').forEach(input => {
      const path = input.dataset.setting;
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
      newPost, savePost, deletePost,
      saveSettings, setView,
      showHelp, closeHelp, signOut,
      mdLink,
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
      if (e.key === 'Escape' && !$('#help-modal').classList.contains('hidden')) closeHelp();
    });

    // Image file picker
    $('#image-upload').addEventListener('change', handleImageFileInput);

    wireEditorInputs();
    wireKeyboardShortcuts();
    wirePasteHandler();
    wireDragDrop();
    wireSyncScroll();
    wireSettingsInputs();

    window.addEventListener('beforeunload', (e) => {
      if (isDirty || settingsDirty) { e.preventDefault(); e.returnValue = ''; }
    });

    const ok = await requireAdmin();
    if (!ok) return;

    paintFromState();
    renderPreview();
    loadPostList();
  }

  init();
})();
