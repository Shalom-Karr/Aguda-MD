-- =============================================================================
-- migration2.sql
-- -----------------------------------------------------------------------------
-- Run after migration1.sql. Adds:
--
--   1. agudah_md_ga_faqs table  (frequently-asked questions, editable from
--      the admin panel — replaces the hardcoded array in faq.html)
--   2. RLS policies (public-read-published, admin-manage)
--   3. Initial seed of 8 FAQs published by default
--
-- Idempotent — safe to re-run.
-- =============================================================================


-- =============================================================================
-- 1. FAQS TABLE
-- =============================================================================
create table if not exists public.agudah_md_ga_faqs (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text,
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists agudah_md_ga_faqs_sort_idx
  on public.agudah_md_ga_faqs (sort_order);

create index if not exists agudah_md_ga_faqs_published_idx
  on public.agudah_md_ga_faqs (is_published, sort_order);

drop trigger if exists agudah_md_ga_faqs_set_updated_at
  on public.agudah_md_ga_faqs;
create trigger agudah_md_ga_faqs_set_updated_at
  before update on public.agudah_md_ga_faqs
  for each row execute function public.agudah_md_ga_set_updated_at();


-- =============================================================================
-- 2. ROW-LEVEL SECURITY — faqs
-- =============================================================================
alter table public.agudah_md_ga_faqs enable row level security;

drop policy if exists "Public can read published faqs" on public.agudah_md_ga_faqs;
create policy "Public can read published faqs"
  on public.agudah_md_ga_faqs for select
  using (is_published = true);

drop policy if exists "Admins can read all faqs" on public.agudah_md_ga_faqs;
create policy "Admins can read all faqs"
  on public.agudah_md_ga_faqs for select
  to authenticated
  using (public.agudah_md_ga_is_admin());

drop policy if exists "Admins can insert faqs" on public.agudah_md_ga_faqs;
create policy "Admins can insert faqs"
  on public.agudah_md_ga_faqs for insert
  to authenticated
  with check (public.agudah_md_ga_is_admin());

drop policy if exists "Admins can update faqs" on public.agudah_md_ga_faqs;
create policy "Admins can update faqs"
  on public.agudah_md_ga_faqs for update
  to authenticated
  using (public.agudah_md_ga_is_admin())
  with check (public.agudah_md_ga_is_admin());

drop policy if exists "Admins can delete faqs" on public.agudah_md_ga_faqs;
create policy "Admins can delete faqs"
  on public.agudah_md_ga_faqs for delete
  to authenticated
  using (public.agudah_md_ga_is_admin());


-- =============================================================================
-- 3. SEED — initial FAQs (these match the placeholders that were hardcoded
--    in faq.html in the previous version). Edit, replace, or delete in the
--    admin panel once you sign in.
-- =============================================================================
insert into public.agudah_md_ga_faqs (question, answer, sort_order, is_published) values
('Is this service really free?',
 'Yes — 100% free. We never charge to help you apply for a government program. Our work is funded by community donations.',
 10, true),

('Do I need to be Jewish or part of a specific community?',
 'No. We help anyone in Maryland regardless of religion, background, or immigration status.',
 20, true),

('Will applying for benefits affect my immigration status?',
 'Most programs on this site (WIC, Medicaid for kids, school meals, emergency medical) do NOT count against you for public charge. SNAP and cash assistance can in some cases — we recommend booking a call before applying if you have concerns.',
 30, true),

('How long do applications take to be approved?',
 '<ul class="list-disc pl-5 space-y-1"><li>SNAP: 30 days (7 days for emergencies)</li><li>Medicaid: up to 45 days (90 for disability)</li><li>WIC: same-day at your appointment</li><li>Energy Assistance: 30-50 days</li><li>Section 8 vouchers: 2-5 year waitlists typically</li></ul>',
 40, true),

('Can you submit the application for me?',
 'We can''t submit on your behalf, but we can sit with you (in person or on a video call) and walk through every question while you fill it out. Many people find that easier than doing it alone.',
 50, true),

('What if I was denied?',
 'You have the right to appeal. Most denials have a 30-90 day appeal window. Book a call and we''ll review the denial letter and help you file an appeal.',
 60, true),

('How do I know my information is safe?',
 'We don''t store your personal information after a call. All application data goes directly to the agency you''re applying with — never through us.',
 70, true),

('What languages do you support?',
 'English and Yiddish. For other languages, Maryland 211 (dial 211) provides interpreters in 170+ languages for benefits applications.',
 80, true)
on conflict do nothing;


-- =============================================================================
-- DONE.
-- -----------------------------------------------------------------------------
-- Verify with:
--   select question, sort_order, is_published from public.agudah_md_ga_faqs
--     order by sort_order;
-- =============================================================================
