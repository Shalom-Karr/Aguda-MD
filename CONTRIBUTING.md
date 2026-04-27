# Contributing

This repository is the source of the production BCRN site. It is a small project with a single primary maintainer, but well-scoped contributions are welcome.

If your change is more than a one-line typo fix, **open an issue first** so we can agree on the approach before code is written.

## Ground rules

- The site is plain HTML + Tailwind CDN + vanilla JS. **No build step, no bundler, no framework.** PRs that introduce one will be closed.
- Keep changes minimal and surgical. A bug fix is a bug fix, not a refactor opportunity.
- Match the existing code style: short comments only when *why* is non-obvious, named helpers over clever one-liners, top-of-file file-purpose docstrings.
- All public copy is editable from the admin Settings tab — if you're adding new visible strings, wire them through `assets/config.js` defaults so they remain editable.
- Do not add tracking, analytics, third-party scripts, or external CDNs without prior discussion.

## Setup

1. Clone the repo. There's nothing to install.
2. Open `index.html` in a browser. The site runs in demo mode with localStorage-backed seed data.
3. To test against a real backend, fill in `assets/supabase` keys in `assets/config.js`.

## Branching and commits

- Branch from `main`. Use a short descriptive branch name: `fix/...`, `feat/...`, `docs/...`.
- Commits should describe **why**, not just **what**. The diff already says what changed.
- Squash trivial fixup commits before requesting review.
- One logical change per PR. Don't bundle a typo fix with a feature change.

## Database changes

- **Never** edit `supabase/schema.sql` to retroactively change shipped behavior. The schema represents the original install.
- Add a new migration: `supabase/migrationN.sql` (next free number). Make it idempotent — `if not exists`, `on conflict do nothing`, etc. — so it's safe to re-run.
- Document the migration's purpose in a top comment block. Include verification queries at the bottom.

## Pull request checklist

Before opening a PR, verify:

- [ ] The site loads in demo mode (`index.html` opened directly in a browser) without console errors.
- [ ] The admin console (`admin.html`) loads, you can edit a program, save, and see the change reflected on the public page.
- [ ] If your change touches the public pages, you've checked it on a narrow viewport (~375px) and a desktop one (~1280px).
- [ ] If your change adds or modifies a setting, the admin form has a corresponding input bound via `data-setting`.
- [ ] No secrets, credentials, or PII are committed. The Supabase anon key in `config.js` is the only credential expected to ship.
- [ ] No new external script tags or `<link>` to third-party CDNs unless previously discussed.

## What we won't accept

- Major architectural rewrites (React, build tooling, TypeScript migration).
- Adding analytics, ads, or tracking pixels.
- Changes that break the demo-mode (no-Supabase) experience.
- Drive-by formatting changes mixed into substantive PRs.

## Reporting bugs

Open a GitHub issue with:

- What you expected to happen.
- What actually happened.
- Steps to reproduce, including the URL, browser, and any settings state that's relevant.
- A screenshot or short screen recording if the bug is visual.

Security issues — see [SECURITY.md](SECURITY.md), do not file them in public issues.

## Code of conduct

Participation in this project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
