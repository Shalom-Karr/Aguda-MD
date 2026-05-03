-- Store full geo JSON from geojs.io per page view
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS geo jsonb;
