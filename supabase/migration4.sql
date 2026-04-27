-- =============================================================================
-- migration4.sql
-- -----------------------------------------------------------------------------
-- BCRN rebrand. After running, the live site reads the new name, copy,
-- contact info, and Calendly link from the settings table (all editable
-- from the admin "Site Settings" tab).
--
-- Includes:
--   1. Three new admins added to the allowlist
--   2. Settings row populated with BCRN identity, hero, book, footer copy
--      and contact info (email / phone / address)
--   3. Existing values preserved — anything an admin previously edited
--      from the admin panel is NOT overwritten
--
-- Idempotent — safe to re-run.
-- =============================================================================


-- =============================================================================
-- 1. NEW ADMINS
-- -----------------------------------------------------------------------------
-- After running this, also create matching auth users:
--   Supabase Dashboard -> Authentication -> Users -> Add user
-- =============================================================================
insert into public.agudah_md_ga_admins (email, full_name) values
  ('asadwin@agudathisrael-md.org', 'A. Sadwin'),
  ('merlbaum@ahavasyisrael.org',   'Merlbaum (Ahavas Yisrael)'),
  ('crothstein@ahavasyisrael.org', 'C. Rothstein (Ahavas Yisrael)')
on conflict (email) do nothing;


-- =============================================================================
-- 2. INITIAL SETTINGS — BCRN copy
-- -----------------------------------------------------------------------------
-- The `||` operator in this update merges right-to-left, so any keys an
-- admin has already saved through the admin panel keep their values; only
-- missing keys get the BCRN defaults filled in.
-- =============================================================================
update public.agudah_md_ga_settings
set data = '{
  "name": "Baltimore Community Resource Network",
  "shortName": "BCRN",
  "tagline": "Connecting You to Resources That Matter.",
  "calendlyUrl": "https://calendly.com/merlbaum-ahavasyisrael/30min",
  "contactEmail": "info@baltcrn.org",
  "phone": "410-775-8525",
  "address": "115 Sudbrook Lane Suite E, Baltimore, MD 21208",
  "bookingMode": "inline",
  "hero": {
    "eyebrow": "A project of Ahavas Yisrael & Agudath Israel of Maryland",
    "heading": "Connecting You to Resources That Matter",
    "subhead": "A nonprofit organization dedicated to helping community members access government assistance programs. We evaluate your situation, research eligible programs, and guide you through every step of the application process — free of charge."
  },
  "book": {
    "heading": "Need a hand with your application?",
    "subhead": "Book a free 20-minute call and we''ll walk you through your options, step by step.",
    "buttonLabel": "Schedule a free call"
  },
  "footer": {
    "copyright": "© 2026 Baltimore Community Resource Network. All guides are for informational purposes only.",
    "aboutLabel": "A project of",
    "contactLabel": "Contact",
    "linksLabel": "Site",
    "partner1Name": "Ahavas Yisrael Charity Fund",
    "partner1Url": "https://ahavasyisrael.org",
    "partner2Name": "Agudath Israel of Maryland",
    "partner2Url": "https://agudathisrael-md.org"
  }
}'::jsonb || data;

-- Verify with:
--   select data from public.agudah_md_ga_settings;
--   select email, full_name from public.agudah_md_ga_admins order by email;
