-- =============================================================================
-- migration9.sql
-- -----------------------------------------------------------------------------
-- Two small copy fixes from client review:
--   1. Hero eyebrow: "Agudath Israel of Maryland" -> "Agudah Maryland"
--   2. Book button label: "Schedule a free call" -> "Book a Call"
--
-- These overwrite the hero and book blocks in the settings JSONB
-- (jsonb || does a shallow merge — the right side wins on key collision).
-- =============================================================================

update public.agudah_md_ga_settings
set data = data || $${
  "hero": {
    "eyebrow": "A project of Ahavas Yisrael & Agudah Maryland",
    "heading": "Connecting You to Resources That Matter",
    "subhead": "We help Maryland residents apply for SNAP, Medicaid, WIC, energy assistance, and more — free, fast, and step-by-step."
  },
  "book": {
    "heading": "Not sure where to start?",
    "subhead": "Book a free 20-minute call. We'll figure out which programs you qualify for and walk you through the next steps.",
    "buttonLabel": "Book a Call"
  }
}$$::jsonb;

-- Verify with:
--   select data->'hero'->>'eyebrow', data->'book'->>'buttonLabel'
--   from public.agudah_md_ga_settings;
