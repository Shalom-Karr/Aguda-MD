-- Replace direct anon INSERT + RETURNING with a security-definer function.
-- Anon has INSERT but not SELECT, so .insert().select('id') returns 401.
-- This function runs as the table owner and returns the new row id safely.

CREATE OR REPLACE FUNCTION agudah_md_ga_insert_page_view(
  p_page        text,
  p_page_type   text,
  p_tab         text     DEFAULT NULL,
  p_url         text     DEFAULT NULL,
  p_screen_size text     DEFAULT NULL,
  p_state       text     DEFAULT NULL,
  p_geo         jsonb    DEFAULT NULL,
  p_session_id  text     DEFAULT NULL,
  p_referrer    text     DEFAULT NULL,
  p_device      text     DEFAULT NULL,
  p_is_new      boolean  DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id bigint;
BEGIN
  INSERT INTO agudah_md_ga_page_views
    (page, page_type, tab, url, screen_size, state, geo, session_id, referrer, device, is_new)
  VALUES
    (p_page, p_page_type, p_tab, p_url, p_screen_size, p_state, p_geo, p_session_id, p_referrer, p_device, p_is_new)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION agudah_md_ga_insert_page_view TO anon;
