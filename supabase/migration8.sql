-- =============================================================================
-- migration8.sql
-- -----------------------------------------------------------------------------
-- Overwrites the footer copy in settings (specifically the copyright line)
-- with BCRN values. Earlier migrations used `defaults || data` which
-- preserves existing settings — that meant a leftover Agudath Israel
-- copyright from initial testing kept showing on every page.
--
-- This update uses `data || newFooter` so the new values win.
-- =============================================================================

update public.agudah_md_ga_settings
set data = data || $${
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
}$$::jsonb;

-- Verify with:
--   select data->'footer' from public.agudah_md_ga_settings;
