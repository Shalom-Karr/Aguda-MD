-- =============================================================================
-- Agudah MD Resources — Supabase schema
-- -----------------------------------------------------------------------------
-- Run this once in the Supabase SQL Editor (https://supabase.com/dashboard).
-- Then fill in `supabase.url` and `supabase.anonKey` in assets/config.js.
--
-- This schema enables:
--   - Public read access to published programs
--   - Authenticated write access (insert/update/delete)
--   - Automatic `updated_at` timestamps
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Main table
-- -----------------------------------------------------------------------------
create table if not exists public.programs (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  summary       text,
  category      text,
  content_md    text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists programs_slug_idx         on public.programs (slug);
create index if not exists programs_published_idx    on public.programs (is_published, updated_at desc);
create index if not exists programs_category_idx     on public.programs (category);

-- -----------------------------------------------------------------------------
-- 2. Auto-update `updated_at` on any row change
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists programs_set_updated_at on public.programs;
create trigger programs_set_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Row-Level Security
-- -----------------------------------------------------------------------------
alter table public.programs enable row level security;

-- Anyone (anon key) can read published programs
drop policy if exists "Public can read published programs" on public.programs;
create policy "Public can read published programs"
  on public.programs for select
  using (is_published = true);

-- Authenticated users can read ALL programs (including drafts) — needed for admin
drop policy if exists "Authenticated can read all programs" on public.programs;
create policy "Authenticated can read all programs"
  on public.programs for select
  to authenticated
  using (true);

-- Only authenticated users can insert / update / delete
drop policy if exists "Authenticated can insert" on public.programs;
create policy "Authenticated can insert"
  on public.programs for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update" on public.programs;
create policy "Authenticated can update"
  on public.programs for update
  to authenticated
  using (true) with check (true);

drop policy if exists "Authenticated can delete" on public.programs;
create policy "Authenticated can delete"
  on public.programs for delete
  to authenticated
  using (true);

-- -----------------------------------------------------------------------------
-- 4. Seed data (optional — remove this section if you don't want sample content)
-- -----------------------------------------------------------------------------
insert into public.programs (slug, title, summary, category, is_published, content_md) values
('snap-food-supplement-program',
 'SNAP (Food Supplement Program)', 'Monthly benefits to help pay for groceries for low-income Maryland households.',
 'Food', true,
 E'## What is SNAP?\n\nThe Food Supplement Program (FSP) is Maryland''s name for SNAP — federal food assistance benefits loaded onto an EBT card each month.\n\n## Who qualifies?\n\nYou may qualify if your household''s gross monthly income is at or below 200% of the federal poverty level.\n\n## How to apply\n\n1. Online at mydhrbenefits.dhr.state.md.us\n2. In person at your local Department of Social Services\n3. By phone: 1-800-332-6347'),

('medicaid-medical-assistance',
 'Medicaid (Medical Assistance)',
 'Free or low-cost health insurance for eligible children, adults, pregnant women, and seniors.',
 'Health', true,
 E'## What is Medicaid?\n\nMaryland Medicaid covers doctor visits, hospital care, prescriptions, dental, vision, and mental health — at no cost to most eligible people.\n\n## How to apply\n\n- Online at marylandhealthconnection.gov\n- By phone: 1-855-642-8572')
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- Done. Next steps:
--   1. Go to Supabase Dashboard → Settings → API, copy the "anon public" key
--      and project URL into assets/config.js.
--   2. Enable Email auth in Supabase Dashboard → Authentication → Providers.
--   3. Create an admin user: Dashboard → Authentication → Users → Add User.
--   4. Add Supabase auth to admin.html (see docs/DEPLOYMENT.md).
-- -----------------------------------------------------------------------------
