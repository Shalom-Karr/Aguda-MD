-- =============================================================================
-- migration12.sql
-- -----------------------------------------------------------------------------
-- 1. Adds a sort_order column to programs so admins can control the homepage
--    order from the admin panel (same UX as the FAQ sort_order).
-- 2. Seeds the original BCRN order from the program-guide PDFs:
--      SNAP -> Medicaid -> WIC -> Energy -> TCA -> Child Care -> Water4All -> Transportation
--    (10/20/30/... so admins can squeeze new entries in between later.)
-- 3. Disables the general FAQ section sitewide via the settings JSON.
--    With faqEnabled = false the public site:
--      * removes the "FAQ" link from the header on every page,
--      * hides the FAQ teaser block on the homepage,
--      * makes /faq.html return a "page not found" message.
--    Per-program FAQs (the FAQ tab on each guide page) are NOT affected.
--
-- Idempotent — safe to re-run.
-- =============================================================================

-- 1. ----- Programs sort_order ------------------------------------------------
alter table public.agudah_md_ga_programs
  add column if not exists sort_order int not null default 0;

create index if not exists agudah_md_ga_programs_sort_idx
  on public.agudah_md_ga_programs (sort_order, updated_at desc);

-- 2. ----- Seed canonical order for the original 8 BCRN programs --------------
update public.agudah_md_ga_programs set sort_order = 10  where slug = 'snap';
update public.agudah_md_ga_programs set sort_order = 20  where slug = 'medicaid';
update public.agudah_md_ga_programs set sort_order = 30  where slug = 'wic';
update public.agudah_md_ga_programs set sort_order = 40  where slug = 'energy-assistance';
update public.agudah_md_ga_programs set sort_order = 50  where slug = 'tca';
update public.agudah_md_ga_programs set sort_order = 60  where slug = 'child-care-scholarship';
update public.agudah_md_ga_programs set sort_order = 70  where slug = 'water4all';
update public.agudah_md_ga_programs set sort_order = 80  where slug = 'transportation-disabilities';

-- Anything else (drafts, future programs) drops to the bottom unless edited.
update public.agudah_md_ga_programs
   set sort_order = 999
 where sort_order = 0;

-- 3. ----- Disable the general FAQ section ------------------------------------
-- Either update the existing settings row or insert one if none exists.
update public.agudah_md_ga_settings
   set data = coalesce(data, '{}'::jsonb) || jsonb_build_object('faqEnabled', false);

insert into public.agudah_md_ga_settings (data)
select jsonb_build_object('faqEnabled', false)
 where not exists (select 1 from public.agudah_md_ga_settings);

-- Verify with:
--   select slug, title, sort_order from public.agudah_md_ga_programs order by sort_order;
--   select data from public.agudah_md_ga_settings;
