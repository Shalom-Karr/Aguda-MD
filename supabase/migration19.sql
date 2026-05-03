-- Add state column for IP-based geolocation (e.g. "MD", "NY")
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS state text;
