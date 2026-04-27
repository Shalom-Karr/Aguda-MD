-- =============================================================================
-- Agudath Israel of Maryland — Government Assistance Resource Site
-- Supabase schema
-- -----------------------------------------------------------------------------
-- All tables are namespaced with the prefix `agudah_md_ga_` so this database
-- can be shared with other Agudah projects later without naming collisions.
--
-- HOW TO USE:
--   1. Create a new Supabase project at https://supabase.com.
--   2. In the Supabase dashboard, open SQL Editor → New query.
--   3. Paste this entire file. Click Run.
--   4. Copy your project URL + anon key (Settings → API) into
--      assets/config.js.
--   5. In Supabase Auth → Users, create the first admin user (email +
--      password). The email must match a row in agudah_md_ga_admins —
--      see the bootstrap section near the end of this file and edit the
--      placeholder before running.
--
-- This script is idempotent — safe to re-run.
-- =============================================================================


-- =============================================================================
-- 1. PROGRAMS TABLE
-- =============================================================================
create table if not exists public.agudah_md_ga_programs (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  summary       text,
  category      text,
  icon          text,
  content_md    text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists agudah_md_ga_programs_slug_idx
  on public.agudah_md_ga_programs (slug);
create index if not exists agudah_md_ga_programs_published_idx
  on public.agudah_md_ga_programs (is_published, updated_at desc);
create index if not exists agudah_md_ga_programs_category_idx
  on public.agudah_md_ga_programs (category);


-- =============================================================================
-- 2. ADMINS TABLE
-- -----------------------------------------------------------------------------
-- This is an allowlist of emails that have admin access. Login itself is
-- handled by Supabase Auth — this table only controls who is permitted to
-- write/edit programs once they've signed in.
--
-- To add a new admin:
--   1. Insert their email here.
--   2. Create a corresponding user in Supabase Auth → Users (same email).
-- =============================================================================
create table if not exists public.agudah_md_ga_admins (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  full_name   text,
  created_at  timestamptz not null default now()
);

create index if not exists agudah_md_ga_admins_email_idx
  on public.agudah_md_ga_admins (lower(email));


-- =============================================================================
-- 2b. SETTINGS TABLE
-- -----------------------------------------------------------------------------
-- One-row table holding editable site settings (name, hero copy, Calendly URL,
-- footer text, etc.) as JSONB. The admin page edits this; public pages read it
-- and merge it over the static defaults in assets/config.js.
-- =============================================================================
create table if not exists public.agudah_md_ga_settings (
  id          uuid primary key default gen_random_uuid(),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Make sure exactly one row always exists
insert into public.agudah_md_ga_settings (data)
select '{}'::jsonb
where not exists (select 1 from public.agudah_md_ga_settings);


-- =============================================================================
-- 3. updated_at AUTO-TRIGGER
-- =============================================================================
create or replace function public.agudah_md_ga_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists agudah_md_ga_programs_set_updated_at
  on public.agudah_md_ga_programs;
create trigger agudah_md_ga_programs_set_updated_at
  before update on public.agudah_md_ga_programs
  for each row execute function public.agudah_md_ga_set_updated_at();

drop trigger if exists agudah_md_ga_settings_set_updated_at
  on public.agudah_md_ga_settings;
create trigger agudah_md_ga_settings_set_updated_at
  before update on public.agudah_md_ga_settings
  for each row execute function public.agudah_md_ga_set_updated_at();


-- =============================================================================
-- 4. ADMIN-CHECK HELPER FUNCTION
-- -----------------------------------------------------------------------------
-- Returns true if the current authenticated user's email is in the admins
-- table. Used by RLS policies below.
-- =============================================================================
create or replace function public.agudah_md_ga_is_admin()
returns boolean as $$
  select exists (
    select 1 from public.agudah_md_ga_admins
    where lower(email) = lower((select email from auth.users where id = auth.uid()))
  );
$$ language sql stable security definer;


-- =============================================================================
-- 5. ROW-LEVEL SECURITY — programs
-- =============================================================================
alter table public.agudah_md_ga_programs enable row level security;

-- Anyone (including anon visitors) can read PUBLISHED programs
drop policy if exists "Public can read published programs"
  on public.agudah_md_ga_programs;
create policy "Public can read published programs"
  on public.agudah_md_ga_programs for select
  using (is_published = true);

-- Authenticated admins can read EVERYTHING (including drafts)
drop policy if exists "Admins can read all programs"
  on public.agudah_md_ga_programs;
create policy "Admins can read all programs"
  on public.agudah_md_ga_programs for select
  to authenticated
  using (public.agudah_md_ga_is_admin());

-- Only authenticated admins can insert / update / delete
drop policy if exists "Admins can insert programs"
  on public.agudah_md_ga_programs;
create policy "Admins can insert programs"
  on public.agudah_md_ga_programs for insert
  to authenticated
  with check (public.agudah_md_ga_is_admin());

drop policy if exists "Admins can update programs"
  on public.agudah_md_ga_programs;
create policy "Admins can update programs"
  on public.agudah_md_ga_programs for update
  to authenticated
  using (public.agudah_md_ga_is_admin())
  with check (public.agudah_md_ga_is_admin());

drop policy if exists "Admins can delete programs"
  on public.agudah_md_ga_programs;
create policy "Admins can delete programs"
  on public.agudah_md_ga_programs for delete
  to authenticated
  using (public.agudah_md_ga_is_admin());


-- =============================================================================
-- 6. ROW-LEVEL SECURITY — admins
-- =============================================================================
alter table public.agudah_md_ga_admins enable row level security;

-- Authenticated admins can read the admin list
drop policy if exists "Admins can read admin list"
  on public.agudah_md_ga_admins;
create policy "Admins can read admin list"
  on public.agudah_md_ga_admins for select
  to authenticated
  using (public.agudah_md_ga_is_admin());

-- Authenticated admins can manage (insert/update/delete) the admin list
drop policy if exists "Admins can manage admin list"
  on public.agudah_md_ga_admins;
create policy "Admins can manage admin list"
  on public.agudah_md_ga_admins for all
  to authenticated
  using (public.agudah_md_ga_is_admin())
  with check (public.agudah_md_ga_is_admin());


-- =============================================================================
-- 6b. ROW-LEVEL SECURITY — settings
-- =============================================================================
alter table public.agudah_md_ga_settings enable row level security;

-- Anyone (including anonymous visitors) can read settings — these drive the
-- public-facing site copy
drop policy if exists "Public can read settings"
  on public.agudah_md_ga_settings;
create policy "Public can read settings"
  on public.agudah_md_ga_settings for select
  using (true);

-- Only authenticated admins can update settings
drop policy if exists "Admins can update settings"
  on public.agudah_md_ga_settings;
create policy "Admins can update settings"
  on public.agudah_md_ga_settings for update
  to authenticated
  using (public.agudah_md_ga_is_admin())
  with check (public.agudah_md_ga_is_admin());


-- =============================================================================
-- 6c. STORAGE BUCKET — agudah-md-ga-images
-- -----------------------------------------------------------------------------
-- Public-read bucket for image uploads (used in program guides, hero images,
-- etc). Only authenticated admins can upload, update, or delete.
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('agudah-md-ga-images', 'agudah-md-ga-images', true)
on conflict (id) do nothing;

drop policy if exists "agudah_md_ga_images_public_read" on storage.objects;
create policy "agudah_md_ga_images_public_read"
  on storage.objects for select
  using (bucket_id = 'agudah-md-ga-images');

drop policy if exists "agudah_md_ga_images_admin_insert" on storage.objects;
create policy "agudah_md_ga_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'agudah-md-ga-images' and public.agudah_md_ga_is_admin());

drop policy if exists "agudah_md_ga_images_admin_update" on storage.objects;
create policy "agudah_md_ga_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'agudah-md-ga-images' and public.agudah_md_ga_is_admin())
  with check (bucket_id = 'agudah-md-ga-images' and public.agudah_md_ga_is_admin());

drop policy if exists "agudah_md_ga_images_admin_delete" on storage.objects;
create policy "agudah_md_ga_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'agudah-md-ga-images' and public.agudah_md_ga_is_admin());


-- =============================================================================
-- 7. BOOTSTRAP — first admin
-- -----------------------------------------------------------------------------
-- IMPORTANT: edit the email below to match the first admin's email BEFORE
-- running this script.
--
-- After running, you must also create a matching user in:
--   Supabase Dashboard → Authentication → Users → Add user
-- using the SAME email and a strong password.
-- =============================================================================
insert into public.agudah_md_ga_admins (email, full_name) values
  ('chani@agudathisrael-md.org', 'Chani Vilner'),
  ('shalomkarrsphone@gmail.com', 'Shalom Karr')
on conflict (email) do nothing;


-- =============================================================================
-- DONE.
-- -----------------------------------------------------------------------------
-- Verify with:
--   select * from public.agudah_md_ga_programs;
--   select * from public.agudah_md_ga_admins;
--
-- Next steps in the codebase:
--   1. Fill in `supabase.url` and `supabase.anonKey` in assets/config.js.
--   2. Push to production. Visit /admin and log in with the bootstrap user.
-- =============================================================================
