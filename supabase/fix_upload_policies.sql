-- ============================================================
-- FIX: Upload-Policies — Admin kann Dateien hochladen
-- Führe dieses Script im Supabase SQL-Editor aus
-- Erstellt: 2026-03-13
-- ============================================================

-- ── 1. auth.is_admin() Funktion sicherstellen ───────────────

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  )
$$;

-- ── 2. Admin-Flag setzen (dein Supabase-Account) ───────────
-- WICHTIG: Passe die E-Mail-Adresse an deinen Supabase-Account an!

UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'torben@avento-conser.de';

-- ── 3. Storage: Admin darf alles (INSERT + UPDATE + DELETE) ─

DROP POLICY IF EXISTS "admin_storage_all" ON storage.objects;
CREATE POLICY "admin_storage_all" ON storage.objects
  FOR ALL
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

-- ── 4. Storage: Anon darf lesen (public bucket) ─────────────

-- Sicherstellen dass anon SELECT auf allen public Buckets möglich ist
DROP POLICY IF EXISTS "documents_select_anon"     ON storage.objects;
DROP POLICY IF EXISTS "team_photos_select_anon"    ON storage.objects;
DROP POLICY IF EXISTS "partner_logos_select_anon"  ON storage.objects;

CREATE POLICY "documents_select_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'documents');

CREATE POLICY "team_photos_select_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'team-photos');

CREATE POLICY "partner_logos_select_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'partner-logos');

-- ── 5. Storage: Authenticated darf schreiben ────────────────

DROP POLICY IF EXISTS "documents_insert_auth"      ON storage.objects;
DROP POLICY IF EXISTS "documents_update_auth"      ON storage.objects;
DROP POLICY IF EXISTS "documents_delete_owner"     ON storage.objects;
DROP POLICY IF EXISTS "team_photos_insert_auth"    ON storage.objects;
DROP POLICY IF EXISTS "team_photos_update_auth"    ON storage.objects;
DROP POLICY IF EXISTS "team_photos_delete_auth"    ON storage.objects;
DROP POLICY IF EXISTS "partner_logos_insert_auth"  ON storage.objects;
DROP POLICY IF EXISTS "partner_logos_update_auth"  ON storage.objects;
DROP POLICY IF EXISTS "partner_logos_delete_auth"  ON storage.objects;

CREATE POLICY "documents_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "documents_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'documents')
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "documents_delete_owner" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "team_photos_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'team-photos');

CREATE POLICY "team_photos_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'team-photos')
  WITH CHECK (bucket_id = 'team-photos');

CREATE POLICY "team_photos_delete_auth" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'team-photos');

CREATE POLICY "partner_logos_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "partner_logos_update_auth" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'partner-logos')
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "partner_logos_delete_auth" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'partner-logos');

-- ── 6. Buckets sicherstellen (public, keine Restrictions) ───

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents',     'documents',     true, NULL, NULL),
  ('team-photos',   'team-photos',   true, NULL, NULL),
  ('partner-logos', 'partner-logos', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = NULL,
  allowed_mime_types = NULL;

-- ── 7. DB-Tabellen: Admin-Policies ──────────────────────────

DROP POLICY IF EXISTS "admin_all_documents" ON documents;
CREATE POLICY "admin_all_documents" ON documents
  FOR ALL USING (auth.is_admin()) WITH CHECK (auth.is_admin());

DROP POLICY IF EXISTS "admin_all_team" ON team_members;
CREATE POLICY "admin_all_team" ON team_members
  FOR ALL USING (auth.is_admin()) WITH CHECK (auth.is_admin());

DROP POLICY IF EXISTS "admin_all_partners" ON partners;
CREATE POLICY "admin_all_partners" ON partners
  FOR ALL USING (auth.is_admin()) WITH CHECK (auth.is_admin());

-- ── 8. Prüfung ──────────────────────────────────────────────

-- Admin-Flag prüfen:
SELECT id, email, raw_app_meta_data->>'is_admin' AS is_admin
FROM auth.users WHERE email = 'torben@avento-conser.de';

-- Storage-Policies prüfen:
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
