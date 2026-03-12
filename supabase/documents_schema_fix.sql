-- ============================================================
-- FIX: documents-Tabelle auf neues Schema aktualisieren
-- Führe dieses Script im Supabase SQL-Editor aus
-- ============================================================

-- 1. Fehlende Spalten hinzufügen (IF NOT EXISTS verhindert Fehler)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS owner_id UUID;

-- 2. section-Spalte optional machen (war NOT NULL, verhindert neue Inserts)
ALTER TABLE documents ALTER COLUMN section DROP NOT NULL;

-- 3. RLS-Policy für Investoren aktualisieren (sehen nur sichtbare Dokumente)
DROP POLICY IF EXISTS "investor_read_visible_docs" ON documents;
CREATE POLICY "investor_read_visible_docs" ON documents
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND (visible_to_investors = true OR visible_to_investors IS NULL)
  );

-- 4. Supabase Storage Bucket Limit auf 1 GB setzen
-- HINWEIS: Bucket-Limit kann NICHT per SQL gesetzt werden.
-- Gehe zu: Supabase Dashboard → Storage → documents Bucket → Edit
-- Setze "File size limit" auf: 1073741824 (= 1 GB)
-- ODER: lösche den Bucket und lass ihn vom Code neu erstellen.

-- 5. Prüfung: Zeige aktuelle Spalten der documents-Tabelle
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'documents'
ORDER BY ordinal_position;
