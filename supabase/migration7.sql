-- =============================================================================
-- migration7.sql
-- -----------------------------------------------------------------------------
-- Adds per-program FAQs.
--
-- A new column `program_slug` on agudah_md_ga_faqs lets each FAQ be scoped:
--
--   program_slug IS NULL  -> "site-wide" FAQ (shows on /faq page and the
--                            homepage teaser, controlled by show_on_homepage
--                            and show_on_faq_page).
--   program_slug = '<x>'  -> "program FAQ" — appears on the FAQ tab of the
--                            program with that slug, never on /faq or the
--                            homepage teaser.
--
-- Idempotent — safe to re-run.
-- =============================================================================

alter table public.agudah_md_ga_faqs
  add column if not exists program_slug text;

create index if not exists agudah_md_ga_faqs_program_idx
  on public.agudah_md_ga_faqs (program_slug, sort_order)
  where is_published = true;

-- Verify with:
--   select question, program_slug, sort_order from public.agudah_md_ga_faqs
--   order by program_slug nulls first, sort_order;
