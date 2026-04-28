-- =============================================================================
-- migration13.sql
-- -----------------------------------------------------------------------------
-- Updates the footer copyright text to the new disclaimer line:
--   "© 2026 Baltimore Community Resource Network. A non-profit organization,
--    not affiliated with any government agency. All guides are for
--    informational purposes only."
--
-- The settings JSON is merged on top of assets/config.js defaults at page
-- load, so without this migration the DB-stored value would still win and
-- the live site would keep the old copyright. Idempotent — safe to re-run.
-- =============================================================================

update public.agudah_md_ga_settings
   set data = jsonb_set(
     coalesce(data, '{}'::jsonb),
     '{footer,copyright}',
     to_jsonb('© 2026 Baltimore Community Resource Network. A non-profit organization, not affiliated with any government agency. All guides are for informational purposes only.'::text)
   );

-- Insert a row carrying just the new copyright if no settings row exists.
insert into public.agudah_md_ga_settings (data)
select jsonb_build_object(
  'footer', jsonb_build_object(
    'copyright',
    '© 2026 Baltimore Community Resource Network. A non-profit organization, not affiliated with any government agency. All guides are for informational purposes only.'
  )
)
 where not exists (select 1 from public.agudah_md_ga_settings);

-- Verify with:
--   select data->'footer'->>'copyright' from public.agudah_md_ga_settings;
