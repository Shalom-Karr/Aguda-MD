-- Migration 24: optional per-program SEO overrides.
--
-- Both columns are nullable. When NULL, posts.html falls back to:
--   seo_title       -> "<title> · <site name>"
--   seo_description -> the summary field

ALTER TABLE public.agudah_md_ga_programs
  ADD COLUMN IF NOT EXISTS seo_title       text,
  ADD COLUMN IF NOT EXISTS seo_description text;
