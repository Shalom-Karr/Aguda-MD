-- =============================================================================
-- migration3.sql
-- -----------------------------------------------------------------------------
-- Run after migration2.sql. Adds two per-FAQ visibility flags so each
-- question can be controlled independently:
--
--   show_on_homepage  — appears in the teaser block on the homepage
--   show_on_faq_page  — appears in the full /faq page list
--
-- Idempotent — safe to re-run.
-- =============================================================================

alter table public.agudah_md_ga_faqs
  add column if not exists show_on_homepage boolean not null default false;

alter table public.agudah_md_ga_faqs
  add column if not exists show_on_faq_page boolean not null default true;

-- For existing data: bump the first 5 FAQs (by sort order) onto the homepage
-- so the teaser block isn't empty for current sites.
update public.agudah_md_ga_faqs
set show_on_homepage = true
where id in (
  select id from public.agudah_md_ga_faqs
  where is_published = true
  order by sort_order
  limit 5
);

-- Helpful indexes
create index if not exists agudah_md_ga_faqs_homepage_idx
  on public.agudah_md_ga_faqs (show_on_homepage, sort_order)
  where is_published = true;

create index if not exists agudah_md_ga_faqs_faqpage_idx
  on public.agudah_md_ga_faqs (show_on_faq_page, sort_order)
  where is_published = true;

-- =============================================================================
-- DONE.
-- -----------------------------------------------------------------------------
-- Verify with:
--   select question, sort_order, show_on_homepage, show_on_faq_page
--   from public.agudah_md_ga_faqs order by sort_order;
-- =============================================================================
