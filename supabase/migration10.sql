-- =============================================================================
-- migration10.sql
-- -----------------------------------------------------------------------------
-- Seeds the FAQ page copy into settings so admins can edit it from the
-- admin "Site Settings" tab. Was previously hardcoded into faq.html.
--
-- Uses `defaults || data` so any admin edits already present win; only
-- missing keys get the defaults filled in.
-- =============================================================================

update public.agudah_md_ga_settings
set data = $${
  "faqPage": {
    "heading": "Frequently asked questions",
    "subhead": "Can't find your question? Book a call below.",
    "ctaHeading": "Still stuck?",
    "ctaSubhead": "Talk to a real person — it's free.",
    "ctaButton": "Book a free call"
  }
}$$::jsonb || data;

-- Verify with:
--   select data->'faqPage' from public.agudah_md_ga_settings;
