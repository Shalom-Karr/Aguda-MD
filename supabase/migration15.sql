-- Analytics: page view tracking
-- Anon users can insert (visitors); authenticated admins can read.

CREATE TABLE agudah_md_ga_page_views (
  id         bigserial    PRIMARY KEY,
  page       text         NOT NULL,
  page_type  text         NOT NULL CHECK (page_type IN ('site', 'article')),
  viewed_at  timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX idx_pv_page ON agudah_md_ga_page_views(page);
CREATE INDEX idx_pv_type ON agudah_md_ga_page_views(page_type);
CREATE INDEX idx_pv_at   ON agudah_md_ga_page_views(viewed_at);

ALTER TABLE agudah_md_ga_page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert"  ON agudah_md_ga_page_views FOR INSERT TO anon          WITH CHECK (true);
CREATE POLICY "auth_select"  ON agudah_md_ga_page_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_delete"  ON agudah_md_ga_page_views FOR DELETE TO authenticated USING (true);

-- Helper function: grouped view counts (used by admin analytics panel)
CREATE OR REPLACE FUNCTION agudah_md_ga_view_counts()
RETURNS TABLE(page text, page_type text, view_count bigint)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT page, page_type, COUNT(*)::bigint AS view_count
  FROM agudah_md_ga_page_views
  GROUP BY page, page_type
  ORDER BY view_count DESC;
$$;

GRANT EXECUTE ON FUNCTION agudah_md_ga_view_counts() TO authenticated;
