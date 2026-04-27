-- =============================================================================
-- migration6.sql
-- -----------------------------------------------------------------------------
-- Refines the hero copy in the settings table. Unlike the merge in
-- migration4 (which preserves admin edits), this update OVERWRITES the
-- hero block specifically with cleaner wording. Run after migration5.
-- =============================================================================

update public.agudah_md_ga_settings
set data = data || $${
  "hero": {
    "eyebrow": "A project of Ahavas Yisrael & Agudath Israel of Maryland",
    "heading": "Connecting You to Resources That Matter",
    "subhead": "We help Maryland residents apply for SNAP, Medicaid, WIC, energy assistance, and more — free, fast, and step-by-step."
  }
}$$::jsonb;

-- Verify with:
--   select data->'hero' from public.agudah_md_ga_settings;
