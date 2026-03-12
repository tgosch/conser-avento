-- ============================================================
-- FIX: photo_path Spalte zu team_members hinzufügen
-- Führe dieses Script im Supabase SQL-Editor aus
-- ============================================================

-- 1. photo_path Spalte hinzufügen
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_path TEXT;

-- 2. Storage Bucket für Team-Fotos erstellen (öffentlich)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('team-photos', 'team-photos', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 3. RLS-Policy: Jeder kann Fotos lesen (öffentlicher Bucket)
DROP POLICY IF EXISTS "team_photos_read" ON storage.objects;
CREATE POLICY "team_photos_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-photos');

-- 4. RLS-Policy: Nur Admins können hochladen/löschen
-- (service key = supabaseAdmin bypass — kein explizites Policy nötig)

-- 5. Prüfung
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'team_members' ORDER BY ordinal_position;
