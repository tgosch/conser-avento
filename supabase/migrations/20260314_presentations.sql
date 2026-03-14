-- ════════════════════════════════════════════════
-- Presentations Schema
-- Stand: 2026-03-14
-- ════════════════════════════════════════════════

-- Presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT         NOT NULL,
  description   TEXT,
  category      VARCHAR(50)  NOT NULL CHECK (category IN ('pitch','roadmap','team','investor-update','financial','partner')),
  file_path     TEXT         NOT NULL,
  file_size_mb  DECIMAL(10,2),
  file_type     VARCHAR(20),
  uploaded_by   UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ  DEFAULT now(),
  updated_at    TIMESTAMPTZ  DEFAULT now(),
  tags          TEXT[]       DEFAULT '{}',
  version       INT          DEFAULT 1,
  is_public     BOOLEAN      DEFAULT FALSE,
  download_count INT         DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_presentations_category ON presentations(category);
CREATE INDEX IF NOT EXISTS idx_presentations_created  ON presentations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presentations_public   ON presentations(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_presentations_tags     ON presentations USING GIN(tags);

ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

-- Admin: Full Access
CREATE POLICY "admin_presentations_all" ON presentations
  FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- Investors: read public only
CREATE POLICY "investor_presentations_view" ON presentations
  FOR SELECT USING (
    is_public = TRUE AND auth.uid() IS NOT NULL
  );

-- Atomic download counter
CREATE OR REPLACE FUNCTION increment_download_count(pres_id UUID)
RETURNS void AS $$
  UPDATE presentations
  SET download_count = download_count + 1,
      updated_at = now()
  WHERE id = pres_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Storage bucket (500 MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'presentations',
  'presentations',
  false,
  524288000,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'image/png',
    'image/jpeg'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Storage: Admin full access
CREATE POLICY "admin_presentations_storage" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'presentations' AND
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    bucket_id = 'presentations' AND
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Storage: Investors read-only
CREATE POLICY "investor_presentations_storage_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'presentations' AND
    auth.uid() IS NOT NULL
  );
