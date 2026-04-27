-- =============================================================================
-- migration11.sql
-- -----------------------------------------------------------------------------
-- Adds one more admin to the BCRN allowlist.
--
-- Don't forget to also create the matching auth user in:
--   Supabase Dashboard -> Authentication -> Users -> Add user
-- using the same email (alencz@agudathisrael-md.org) and a strong password.
-- The row in agudah_md_ga_admins is just the allowlist; Supabase Auth
-- handles the actual login.
--
-- Idempotent — safe to re-run.
-- =============================================================================

insert into public.agudah_md_ga_admins (email, full_name) values
  ('alencz@agudathisrael-md.org', 'Alencz')
on conflict (email) do nothing;

-- Verify with:
--   select email, full_name from public.agudah_md_ga_admins order by email;
