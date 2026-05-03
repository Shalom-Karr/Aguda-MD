-- Add screen_size column (e.g. "1920x1080") for device/viewport tracking
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS screen_size text;

-- Grant authenticated role direct SELECT on the raw table for recent-views query
GRANT SELECT ON agudah_md_ga_page_views TO authenticated;
