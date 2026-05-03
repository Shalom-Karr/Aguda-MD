-- Add tab column (guide / faq) to page_views for per-tab tracking
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS tab text;

-- Drop old function so return type can change (tab column added)
DROP FUNCTION IF EXISTS agudah_md_ga_view_counts();

-- Rebuild view_counts to include tab breakdown
CREATE OR REPLACE FUNCTION agudah_md_ga_view_counts()
RETURNS TABLE(page text, page_type text, tab text, view_count bigint)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT page, page_type, tab, COUNT(*)::bigint AS view_count
  FROM agudah_md_ga_page_views
  GROUP BY page, page_type, tab
  ORDER BY view_count DESC;
$$;

-- 30-day time-series (one row per day × page_type)
CREATE OR REPLACE FUNCTION agudah_md_ga_views_by_day(days_back integer DEFAULT 30)
RETURNS TABLE(day date, page_type text, view_count bigint)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT DATE(viewed_at AT TIME ZONE 'UTC') AS day,
         page_type,
         COUNT(*)::bigint                    AS view_count
  FROM   agudah_md_ga_page_views
  WHERE  viewed_at >= NOW() - (days_back || ' days')::interval
  GROUP  BY day, page_type
  ORDER  BY day;
$$;

GRANT EXECUTE ON FUNCTION agudah_md_ga_view_counts()           TO authenticated;
GRANT EXECUTE ON FUNCTION agudah_md_ga_views_by_day(integer)   TO authenticated;
