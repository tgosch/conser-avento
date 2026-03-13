-- ============================================================
-- STORAGE POLICY TIGHTENING
-- Führe das im Supabase SQL-Editor aus (nach dem Admin-Login-Fix)
-- ============================================================

-- Alte offene Policy entfernen
DROP POLICY IF EXISTS "storage_allow_all" ON storage.objects;

-- Nur authentifizierte User dürfen hochladen / löschen / überschreiben
CREATE POLICY "storage_authenticated_write" ON storage.objects
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Jeder darf lesen (öffentliche Buckets — für Bildanzeige)
CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT
  USING (true);

-- Prüfung
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';
