-- ============================================================
-- FIX: documents Bucket — alle MIME-Restrictions entfernen
-- Führe dieses Script im Supabase SQL-Editor aus
-- ============================================================

-- Bucket aktualisieren: keine MIME-Einschränkungen, kein Dateigrößen-Limit
UPDATE storage.buckets
SET
  allowed_mime_types = NULL,
  file_size_limit    = NULL,
  public             = true
WHERE id = 'documents';

-- Falls der Bucket noch nicht existiert: anlegen (ohne jede Einschränkung)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  allowed_mime_types = NULL,
  file_size_limit    = NULL,
  public             = true;

-- RLS-Policy für Uploads über Service-Key (owner portal)
-- Service-Key bypassed RLS — aber zur Sicherheit Policy setzen
DROP POLICY IF EXISTS "documents_all_service" ON storage.objects;
CREATE POLICY "documents_all_service" ON storage.objects
  FOR ALL USING (bucket_id = 'documents');

-- Prüfung: zeige aktuelle Bucket-Einstellungen
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'documents';
