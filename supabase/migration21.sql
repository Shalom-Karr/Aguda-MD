ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS session_id text;
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS referrer  text;
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS device    text;
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS is_new    boolean;
