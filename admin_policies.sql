CREATE TABLE IF NOT EXISTS future_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planned',
  timeframe TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE future_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read_future" ON future_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_future" ON future_content FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);
