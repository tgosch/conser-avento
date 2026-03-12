-- ============================================================
-- STORAGE RLS — Vollständige Bucket-Konfiguration
-- Führe dieses Script im Supabase SQL-Editor aus
-- Erstellt: 2026-03-12
-- ============================================================

-- ── 1. Buckets anlegen / aktualisieren ─────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents',    'documents',    true, NULL, NULL),
  ('images',       'images',       true, NULL, NULL),
  ('updates',      'updates',      true, NULL, NULL),
  ('team-photos',  'team-photos',  true, NULL, NULL),
  ('partner-logos','partner-logos',true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = NULL,
  allowed_mime_types = NULL;

-- ── 2. RLS auf storage.objects aktivieren ──────────────────

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ── 3. Alte Policies entfernen (idempotent) ────────────────

DROP POLICY IF EXISTS "documents_all_service"      ON storage.objects;
DROP POLICY IF EXISTS "documents_insert_auth"       ON storage.objects;
DROP POLICY IF EXISTS "documents_select_auth"       ON storage.objects;
DROP POLICY IF EXISTS "documents_delete_owner"      ON storage.objects;
DROP POLICY IF EXISTS "images_insert_auth"          ON storage.objects;
DROP POLICY IF EXISTS "images_select_auth"          ON storage.objects;
DROP POLICY IF EXISTS "images_delete_owner"         ON storage.objects;
DROP POLICY IF EXISTS "updates_insert_auth"         ON storage.objects;
DROP POLICY IF EXISTS "updates_select_auth"         ON storage.objects;
DROP POLICY IF EXISTS "updates_delete_owner"        ON storage.objects;
DROP POLICY IF EXISTS "team_photos_insert_auth"     ON storage.objects;
DROP POLICY IF EXISTS "team_photos_select_auth"     ON storage.objects;
DROP POLICY IF EXISTS "team_photos_delete_auth"     ON storage.objects;
DROP POLICY IF EXISTS "partner_logos_insert_auth"   ON storage.objects;
DROP POLICY IF EXISTS "partner_logos_select_auth"   ON storage.objects;
DROP POLICY IF EXISTS "partner_logos_delete_auth"   ON storage.objects;

-- ── 4. DOCUMENTS Bucket ────────────────────────────────────

CREATE POLICY "documents_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "documents_select_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents');

-- Anon-Lesezugriff für öffentliche Dokumente
CREATE POLICY "documents_select_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'documents');

CREATE POLICY "documents_delete_owner" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'documents');

-- UPDATE für upsert-Unterstützung
CREATE POLICY "documents_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'documents')
  WITH CHECK (bucket_id = 'documents');

-- ── 5. IMAGES Bucket ───────────────────────────────────────

CREATE POLICY "images_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "images_select_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'images');

CREATE POLICY "images_select_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'images');

CREATE POLICY "images_delete_owner" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'images');

CREATE POLICY "images_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

-- ── 6. UPDATES Bucket ─────────────────────────────────────

CREATE POLICY "updates_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'updates');

CREATE POLICY "updates_select_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'updates');

CREATE POLICY "updates_select_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'updates');

CREATE POLICY "updates_delete_owner" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'updates');

CREATE POLICY "updates_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'updates')
  WITH CHECK (bucket_id = 'updates');

-- ── 7. TEAM-PHOTOS Bucket ─────────────────────────────────

CREATE POLICY "team_photos_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'team-photos');

CREATE POLICY "team_photos_select_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'team-photos');

CREATE POLICY "team_photos_select_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'team-photos');

CREATE POLICY "team_photos_delete_auth" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'team-photos');

CREATE POLICY "team_photos_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'team-photos')
  WITH CHECK (bucket_id = 'team-photos');

-- ── 8. PARTNER-LOGOS Bucket ───────────────────────────────

CREATE POLICY "partner_logos_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "partner_logos_select_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'partner-logos');

CREATE POLICY "partner_logos_select_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'partner-logos');

CREATE POLICY "partner_logos_delete_auth" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'partner-logos');

CREATE POLICY "partner_logos_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'partner-logos')
  WITH CHECK (bucket_id = 'partner-logos');

-- ── 9. Verify ─────────────────────────────────────────────

SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
ORDER BY name;
