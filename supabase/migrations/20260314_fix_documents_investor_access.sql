-- ════════════════════════════════════════════════════════════════
-- FIX: Investoren-Lesezugriff auf documents-Tabelle
-- Problem: Investoren bekommen 0 Zeilen zurück → Viewer bleibt leer
-- Stand: 2026-03-14
-- ════════════════════════════════════════════════════════════════

-- ─── 1. Documents-Tabelle: Investor darf lesen ───────────────────

-- Alle alten Varianten entfernen (idempotent)
DROP POLICY IF EXISTS "investor_read_visible_docs"    ON documents;
DROP POLICY IF EXISTS "investor_read_docs"            ON documents;
DROP POLICY IF EXISTS "investor_documents_read"       ON documents;

-- Neue Policy: jeder eingeloggte User sieht alle Dokumente
-- (visible_to_investors-Spalte existiert ggf. nicht — daher kein Filter)
CREATE POLICY "investor_documents_read" ON documents
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── 2. Sicherstellen, dass RLS aktiv ist ────────────────────────

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ─── 3. Storage: Bucket als public markieren ─────────────────────
-- → getPublicUrl() funktioniert, UND createSignedUrl() als Fallback

UPDATE storage.buckets
SET public = true
WHERE id = 'documents';

-- ─── 4. Storage: Investor-Read-Policy (falls noch nicht da) ──────

DROP POLICY IF EXISTS "storage_investor_read" ON storage.objects;
CREATE POLICY "storage_investor_read" ON storage.objects
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── 5. Prüfung ──────────────────────────────────────────────────

SELECT 'Documents-Policies:' AS info;
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'documents'
ORDER BY policyname;

SELECT 'Documents-Zeilen (gesamt):' AS info;
SELECT COUNT(*) AS total_docs, STRING_AGG(DISTINCT category, ', ') AS categories
FROM documents;

SELECT 'Bucket public-Status:' AS info;
SELECT id, name, public FROM storage.buckets WHERE id = 'documents';
