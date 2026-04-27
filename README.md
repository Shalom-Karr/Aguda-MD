# Baltimore Community Resource Network

The public website for [Baltimore Community Resource Network](https://baltcrn.org) — a project of Ahavas Yisrael Charity Fund and Agudath Israel of Maryland that helps Maryland residents navigate government assistance programs (SNAP, Medicaid, WIC, Energy Assistance, TCA, Child Care Scholarship, Water4All, Mobility Links Transportation).

Live: <https://agudathisrael-md-demo.pages.dev>

---

## What's here

| File / dir | Purpose |
|------------|---------|
| `index.html`              | Home page — hero + program grid + booking section |
| `posts.html`              | Per-program guide. URL: `/posts.html?title=<slug>` |
| `faq.html`                | Site-wide FAQ page (renders only when the FAQ toggle is on; otherwise serves a 404) |
| `book.html`               | Inline Calendly booking page |
| `admin.html`              | Admin console — programs editor, FAQ editor, site settings |
| `assets/config.js`        | Static defaults: brand, copy, Calendly URL, Supabase keys, `faqEnabled` toggle |
| `assets/apply-config.js`  | Merges DB-stored settings on top of the static defaults at page load |
| `assets/supabase-client.js` | Data layer — Supabase when configured, localStorage seed otherwise |
| `assets/footer.js`        | Shared footer, rendered against the merged config |
| `assets/admin.js` / `admin.css` | Admin console logic + styling |
| `supabase/schema.sql`     | Initial Postgres schema, RLS, admin allowlist, settings, FAQs |
| `supabase/migration*.sql` | Numbered migrations applied in order on top of `schema.sql` |
| `_redirects`              | Clean URLs for Cloudflare Pages / Netlify |
| `docs/`                   | Setup, customization, deployment, admin, and architecture docs |

---

## Quick start (no backend)

Open `index.html` in a browser. The site boots in demo mode with seeded programs and FAQs in `localStorage`. Click **Admin** to edit; everything saves locally. Clear site data to reset.

## Production setup

1. Create a Supabase project, run `supabase/schema.sql`, then every `migration*.sql` in numeric order.
2. Add admin emails to the `agudah_md_ga_admins` table and matching auth users in Supabase Authentication.
3. Fill in `supabase.url` and `supabase.anonKey` in `assets/config.js`.
4. Deploy to Cloudflare Pages, Netlify, or any static host.

Detailed walkthroughs:

- **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** — local setup, how the pieces fit
- **[docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md)** — rebrand (name, palette, Calendly)
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Supabase + Cloudflare/Netlify
- **[docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md)** — for the person editing content
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — how the code is organized

---

## Admin features

- **Programs** — markdown editor + live preview, side-by-side. Each program has a Guide tab and a per-program FAQ tab. Sort order field controls homepage ordering. Image upload by paste, drag-drop, or file picker (uploads to a Supabase Storage bucket).
- **FAQs** — site-wide FAQs with per-FAQ toggles for "show on homepage" / "show on FAQ page" / "publish".
- **Settings** — every public string is editable: site name, hero copy, contact info, Calendly URL, footer partner names/links, FAQ page copy, and a master switch (`Enable the general FAQ section`) that hides the FAQ link from every header, the homepage teaser, and turns `/faq` into a 404 page.

DB settings are merged on top of `assets/config.js` defaults at page load — leave a field blank in the admin to fall back to the default.

---

## Tech stack

- **HTML + Tailwind CDN** — no build step.
- **Vanilla JS** — no framework, no bundler.
- **[Supabase](https://supabase.com)** — Postgres + auth + storage + REST.
- **[marked](https://marked.js.org)** — markdown rendering.
- **[DOMPurify](https://github.com/cure53/DOMPurify)** — XSS sanitization. External `http(s)` links auto-open in a new tab via a sanitizer hook.
- **[Calendly](https://calendly.com)** — booking widget, inline or external.

---

## Repository policies

- [LICENSE](LICENSE) — copyright + use terms
- [SECURITY.md](SECURITY.md) — how to report a vulnerability
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to propose a change
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — community standards

Built by [Shalom Karr](https://shalomkarr.pages.dev).
