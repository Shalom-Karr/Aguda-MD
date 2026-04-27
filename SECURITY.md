# Security Policy

## Supported versions

Only the `main` branch of this repository is supported. The deployed BCRN site tracks `main`; older commits are not patched.

## Reporting a vulnerability

**Please do not open a public GitHub issue for a security report.**

Email the maintainer privately:

- **Shalom Karr** — via the contact form at <https://shalomkarr.pages.dev>

Include:

1. A description of the issue and its impact.
2. Steps to reproduce (URL, request payload, screenshots, or a short PoC).
3. Affected commit hash, browser, and any relevant environment details.
4. Whether you intend to disclose publicly, and on what timeline.

You should expect:

- An acknowledgement within **5 business days**.
- A status update within **14 days** of acknowledgement.
- Credit in the fix commit / release notes if you'd like to be named.

## Scope

In scope:

- The HTML/JS/CSS in this repository.
- The Supabase row-level-security policies in `supabase/schema.sql` and `supabase/migration*.sql`.
- The admin authentication and authorization flow.

Out of scope:

- Third-party services we depend on — report to them directly:
  - **Supabase** — <https://supabase.com/.well-known/security.txt>
  - **Cloudflare Pages** — <https://www.cloudflare.com/disclosure>
  - **Calendly** — <https://help.calendly.com/hc/en-us/articles/360062338813>
- Issues that require physical access to an admin's device.
- Self-XSS or social-engineering of admins.
- Missing security headers that have no exploitable impact (e.g. `X-Frame-Options` on a page that has no sensitive interactions).

## What we ask

- Make a good-faith effort to avoid privacy violations, data destruction, and service interruption.
- Do not access or modify data that does not belong to you.
- Do not run automated scanners that generate significant traffic against the production site.
- Give us reasonable time to remediate before public disclosure (we aim for 90 days max).

## Hardening already in place

- All admin writes are gated by Supabase row-level security plus an `agudah_md_ga_admins` allowlist; the public `anon` key cannot bypass RLS.
- Markdown rendered from the database is sanitized through DOMPurify before insertion. External `http(s)` links are forced to `target="_blank" rel="noopener noreferrer"` via a DOMPurify hook.
- The site is fully static — no server-side execution, no cookies issued by us, no user accounts for the public.

If you find a gap in any of the above, that is exactly the kind of report we want.
