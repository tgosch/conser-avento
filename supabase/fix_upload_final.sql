-- ============================================================
-- FINALER UPLOAD-FIX — Führe das KOMPLETT im SQL-Editor aus
-- ============================================================

-- 1. ALLE alten Storage-Policies löschen (clean slate)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
  END LOOP;
END $$;

-- 2. Storage: KOMPLETT OFFEN — keine Auth nötig
--    (Buckets sind public, App-Level-Auth schützt das Portal)
CREATE POLICY "storage_allow_all" ON storage.objects
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Buckets sicherstellen
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents',     'documents',     true, NULL, NULL),
  ('team-photos',   'team-photos',   true, NULL, NULL),
  ('partner-logos', 'partner-logos', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = NULL,
  allowed_mime_types = NULL;

-- 4. team_members und partners: RLS deaktivieren (kein Investoren-Risiko)
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE partners     DISABLE ROW LEVEL SECURITY;

-- 5. documents-Tabelle: RLS bleibt AN, aber offene Insert-Policy
DROP POLICY IF EXISTS "admin_all_documents"       ON documents;
DROP POLICY IF EXISTS "documents_insert_auth"     ON documents;
DROP POLICY IF EXISTS "documents_insert_open"     ON documents;
DROP POLICY IF EXISTS "investor_read_visible_docs" ON documents;

-- Jeder authenticated User darf inserieren (Owner ist authenticated nach Login)
CREATE POLICY "documents_insert_auth" ON documents
  FOR INSERT TO authenticated WITH CHECK (true);

-- Admin darf alles
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
$$;

CREATE POLICY "admin_all_documents" ON documents
  FOR ALL USING (auth.is_admin()) WITH CHECK (auth.is_admin());

-- Investoren sehen nur sichtbare Dokumente
CREATE POLICY "investor_read_visible_docs" ON documents
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND (visible_to_investors = true OR visible_to_investors IS NULL)
  );

-- 6. Admin-Flag setzen
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'torben@avento-conser.de';

-- 7. PRÜFUNG
SELECT 'Storage Policies:' AS info;
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

SELECT 'Buckets:' AS info;
SELECT id, name, public FROM storage.buckets WHERE id IN ('documents','team-photos','partner-logos');

SELECT 'Admin Flag:' AS info;
SELECT email, raw_app_meta_data->>'is_admin' AS is_admin FROM auth.users
WHERE email = 'torben@avento-conser.de';
