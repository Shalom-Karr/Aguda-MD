# Agudah MD Resources

A static-site concept for a Maryland government-programs resource website. Visitors browse program guides; an admin uses a side-by-side markdown editor to add or update them.

**Live demo mode**: open `index.html` directly in a browser — it works immediately with seed data stored in `localStorage`, no backend needed.

---

## What's here

| File | Purpose |
|------|---------|
| `index.html`     | Home page with the list of programs + search |
| `posts.html`     | Program guide page, rendered from markdown. URL: `/posts?title=<slug>` |
| `admin.html`     | Admin panel with side-by-side markdown editor + live preview |
| `faq.html`       | Static FAQ page |
| `assets/config.js`          | **Edit this to rebrand.** Name, tagline, Calendly URL, Supabase config. |
| `assets/supabase-client.js` | Data layer. Uses Supabase if configured, else localStorage. |
| `supabase/schema.sql`       | Database schema + row-level security policies |
| `_redirects`                | Clean-URL rules for Cloudflare Pages / Netlify |
| `docs/`                     | Full documentation (see below) |

---

## Quick start (5 seconds)

Open `index.html` in a browser. That's it. The site runs in demo mode with 6 sample Maryland programs. You can:

- Click a program card → see the full markdown-rendered guide
- Click **Admin** (top-right) → add, edit, or delete programs with a side-by-side editor
- Click **FAQ** → see the FAQ page

All edits save to your browser's localStorage. Clear the browser data to reset to seeds.

---

## Going to production

See the docs:

- **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** — local setup, how the pieces fit
- **[docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md)** — rebrand in 5 minutes (name, colors, Calendly)
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** — connect Supabase, add auth, deploy to Cloudflare Pages or Netlify
- **[docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md)** — for the person editing content
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — how the code is organized and why

---

## Tech stack

- **HTML + TailwindCSS (CDN)** — no build step. Edit and refresh.
- **Vanilla JavaScript** — no framework, no bundler.
- **Supabase** — Postgres + auth + REST API (swap in for localStorage in production).
- **[marked](https://marked.js.org)** — markdown → HTML rendering.
- **[DOMPurify](https://github.com/cure53/DOMPurify)** — XSS sanitization for rendered markdown.
- **[Calendly](https://calendly.com)** embed — "book a call" CTA.

---

## License

All rights reserved, for now. Add a LICENSE file before open-sourcing.
