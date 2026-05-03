-- Fix 403: grant table-level INSERT privilege to anon role (RLS alone is not enough)
GRANT INSERT ON agudah_md_ga_page_views TO anon;
GRANT USAGE, SELECT ON SEQUENCE agudah_md_ga_page_views_id_seq TO anon;

-- Add url column to store full path+query (e.g. /posts?title=snap&view=faq)
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS url text;

-- Rebuild view_counts to include url in grouping
DROP FUNCTION IF EXISTS agudah_md_ga_view_counts();
CREATE FUNCTION agudah_md_ga_view_counts()
RETURNS TABLE(page text, page_type text, tab text, url text, view_count bigint)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT page, page_type, tab, url, COUNT(*)::bigint AS view_count
  FROM agudah_md_ga_page_views
  GROUP BY page, page_type, tab, url
  ORDER BY view_count DESC;
$$;

GRANT EXECUTE ON FUNCTION agudah_md_ga_view_counts() TO authenticated;
