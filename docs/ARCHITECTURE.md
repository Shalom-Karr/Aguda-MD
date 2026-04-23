# Architecture

How the code is organized, and why.

---

## Design principles

1. **No build step.** Every page is plain HTML you can open directly. This keeps the barrier to editing low — anyone who can edit a text file can edit this site.
2. **Single config file.** Branding lives in `assets/config.js`. You shouldn't need to hunt through HTML to rebrand.
3. **Demo mode first.** The site works without any backend. This lets the developer show the client the flow before setting up Supabase.
4. **Progressive enhancement.** Content is always markdown. If JS fails, markdown renders as plain text (still readable).
5. **The data layer is swappable.** `assets/supabase-client.js` exposes a single interface (`window.ProgramsDB`). It uses Supabase when configured, localStorage otherwise. Pages don't know or care which is active.

---

## Pages

### `index.html` — homepage

- Loads `config.js` → applies site name, hero copy, etc. to DOM elements by ID.
- Loads `supabase-client.js` → exposes `window.ProgramsDB`.
- Calls `ProgramsDB.listPublished()` → gets an array of program objects.
- Renders them as cards. Cards link to `posts.html?title=<slug>`.
- Filters client-side via the search input.

### `posts.html` — program guide

- Reads `?title=<slug>` from the URL.
- Calls `ProgramsDB.getBySlug(slug)`.
- Pipes `content_md` through `marked.parse()` → `DOMPurify.sanitize()` → `innerHTML`.
- Renders with Tailwind typography (`prose` class).

### `admin.html` — markdown editor

- Same data layer (`ProgramsDB.listAll`, `.save`, etc.).
- State is held in a `currentPost` object.
- `<textarea>` is the markdown source of truth. Every keystroke triggers `renderPreview()` which runs `marked → DOMPurify → innerHTML` into the right-hand pane.
- Sync-scroll pairs the two panes by scroll percentage.
- Save serializes `currentPost` and calls `ProgramsDB.save()`.
- Cmd+S keyboard shortcut; `beforeunload` warning for unsaved changes.

### `faq.html` — FAQ

- Static content (FAQs in a JS array at the bottom of the file).
- Uses `<details>/<summary>` for native accordion behavior — no JS for open/close.

---

## Data layer — `assets/supabase-client.js`

Exposes `window.ProgramsDB` with six methods:

```js
listPublished()     // returns Program[] where is_published = true
listAll()           // returns Program[] (published + drafts)
getBySlug(slug)     // returns Program | null, published only
getBySlugAny(slug)  // returns Program | null, any status (for admin)
save(program)       // insert or update, returns the saved Program
remove(id)          // delete by id
```

The factory picks Supabase or demo mode based on whether `SITE_CONFIG.supabase.url` and `.anonKey` are both filled in.

### Demo mode

Reads/writes to `localStorage` under key `agudah_md_programs_v1`. On first load, seeds 6 sample Maryland programs. This is purely for presenting/testing the concept — it doesn't sync across browsers.

### Supabase mode

Lazy-loads `@supabase/supabase-js` from a CDN on first DB call. Uses the `programs` table defined in `supabase/schema.sql`. The anon key is safe to expose because Row-Level Security enforces "public can read published, authenticated can write" — see `schema.sql` for the exact policies.

---

## The `Program` shape

```ts
{
  id:            string;          // UUID in Supabase, 'seed-*' or 'local-*' in demo
  slug:          string;          // lowercase-with-dashes, URL-safe
  title:         string;
  summary:       string;          // short — shown on homepage card
  category:      string;          // one of SITE_CONFIG.categories
  content_md:    string;          // markdown source
  is_published:  boolean;
  created_at:    string;          // ISO timestamp
  updated_at:    string;          // ISO timestamp
}
```

---

## Why client-only instead of SSR?

- **Simplicity for handoff.** This is a small nonprofit site. A static host + Supabase REST API is near-zero operational overhead.
- **No build toolchain to maintain.** Whoever inherits this can open the files and make changes.
- **SEO is fine for this use case.** Programs are indexed via Supabase's REST API + client hydration; for perfect SEO, the developer could add a pre-render step later, but it's not needed for discoverability through search engines for this traffic level.

If the site grows into needing SSR, the natural upgrade path is:

- Next.js / Astro static export — keeps the same markdown-in-Supabase data model but pre-renders each program page at deploy time.

---

## File references

- **Branding / copy**: `assets/config.js`
- **Data layer / DB**: `assets/supabase-client.js`
- **Schema / RLS**: `supabase/schema.sql`
- **Routing**: `_redirects` (Cloudflare Pages / Netlify)
- **Dependencies**: all via CDN — Tailwind, marked, DOMPurify, Google Fonts, @supabase/supabase-js (lazy)

---

## What's NOT here (yet)

Intentionally omitted, to keep the first version simple:

- **Image uploads** in the admin. (Add a `<input type="file">` wired to `supabase.storage.from('images').upload(...)`.)
- **Categories/tags management UI**. (Currently a hardcoded array in `config.js`.)
- **Multi-author support**. (One admin account.)
- **Versioning / edit history**.
- **Analytics**. (Add `<script>` for Plausible / Fathom if desired.)
- **Search beyond titles/summaries**. (For full-text search, use Supabase's `tsvector` columns.)

Each of these is a small, isolated addition when the client wants it.
