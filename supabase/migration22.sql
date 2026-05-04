-- Time on page (seconds) and scroll depth (0–100%) per view
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS time_on_page integer;
ALTER TABLE agudah_md_ga_page_views ADD COLUMN IF NOT EXISTS scroll_depth integer;

-- Click event tracking (Apply Now, Learn More, Book a Call, Message Us)
CREATE TABLE IF NOT EXISTS agudah_md_ga_click_events (
  id          bigserial    PRIMARY KEY,
  session_id  text,
  page        text         NOT NULL,
  button      text         NOT NULL,   -- 'apply_now' | 'learn_more' | 'book_call' | 'message_us'
  target_url  text,
  clicked_at  timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE agudah_md_ga_click_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert_clicks"  ON agudah_md_ga_click_events FOR INSERT TO anon          WITH CHECK (true);
CREATE POLICY "auth_select_clicks"  ON agudah_md_ga_click_events FOR SELECT TO authenticated USING (true);
GRANT INSERT ON agudah_md_ga_click_events TO anon;
GRANT USAGE, SELECT ON SEQUENCE agudah_md_ga_click_events_id_seq TO anon;
GRANT SELECT ON agudah_md_ga_click_events TO authenticated;

-- Help request log (mirrors contact form submissions into the DB)
CREATE TABLE IF NOT EXISTS agudah_md_ga_help_requests (
  id          bigserial    PRIMARY KEY,
  name        text,
  email       text,
  subject     text,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE agudah_md_ga_help_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert_help"  ON agudah_md_ga_help_requests FOR INSERT TO anon          WITH CHECK (true);
CREATE POLICY "auth_select_help"  ON agudah_md_ga_help_requests FOR SELECT TO authenticated USING (true);
GRANT INSERT ON agudah_md_ga_help_requests TO anon;
GRANT USAGE, SELECT ON SEQUENCE agudah_md_ga_help_requests_id_seq TO anon;
GRANT SELECT ON agudah_md_ga_help_requests TO authenticated;
