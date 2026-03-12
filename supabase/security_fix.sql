-- ============================================================
-- SECURITY FIX: Admin über app_metadata statt VITE_-Variablen
-- Führe dieses Script im Supabase SQL-Editor aus
-- ============================================================

-- 1. Admin-Flag setzen (nur über Service-Key möglich → sicher)
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'torben@avento-conser.de';

-- Prüfung
SELECT id, email, raw_app_meta_data FROM auth.users WHERE email = 'torben@avento-conser.de';

-- ============================================================
-- 2. RLS-Policies: Admin-User (anon key reicht) darf alles
-- ============================================================

-- Helper-Function: ist der aktuelle User ein Admin?
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  )
$$;

-- documents: Admin darf alles
DROP POLICY IF EXISTS "admin_all_documents" ON documents;
CREATE POLICY "admin_all_documents" ON documents
  FOR ALL USING (auth.is_admin());

-- partners: Admin darf alles
DROP POLICY IF EXISTS "admin_all_partners" ON partners;
CREATE POLICY "admin_all_partners" ON partners
  FOR ALL USING (auth.is_admin());

-- team_members: Admin darf alles
DROP POLICY IF EXISTS "admin_all_team" ON team_members;
CREATE POLICY "admin_all_team" ON team_members
  FOR ALL USING (auth.is_admin());

-- investors: Admin darf alles lesen
DROP POLICY IF EXISTS "admin_read_investors" ON investors;
CREATE POLICY "admin_read_investors" ON investors
  FOR SELECT USING (auth.is_admin());

-- messages: Admin darf alles
DROP POLICY IF EXISTS "admin_all_messages" ON messages;
CREATE POLICY "admin_all_messages" ON messages
  FOR ALL USING (auth.is_admin());

-- updates: Admin darf alles
DROP POLICY IF EXISTS "admin_all_updates" ON updates;
CREATE POLICY "admin_all_updates" ON updates
  FOR ALL USING (auth.is_admin());

-- phases: Admin darf alles
DROP POLICY IF EXISTS "admin_all_phases" ON phases;
CREATE POLICY "admin_all_phases" ON phases
  FOR ALL USING (auth.is_admin());

-- ============================================================
-- 3. Storage: Admin darf alle Buckets lesen/schreiben
-- ============================================================
DROP POLICY IF EXISTS "admin_storage_all" ON storage.objects;
CREATE POLICY "admin_storage_all" ON storage.objects
  FOR ALL USING (auth.is_admin());

-- ============================================================
-- 4. Prüfung: alle Policies zeigen
-- ============================================================
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE policyname LIKE 'admin_%'
ORDER BY tablename;
