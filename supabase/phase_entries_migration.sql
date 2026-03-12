-- ============================================================
-- PHASE ENTRIES — Tabelle für Roadmap-Einträge mit Auto-Zuweisung
-- Führe dieses Script im Supabase SQL-Editor aus
-- Erstellt: 2026-03-12
-- ============================================================

CREATE TABLE IF NOT EXISTS phase_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id    UUID REFERENCES phases(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  date        DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS aktivieren
ALTER TABLE phase_entries ENABLE ROW LEVEL SECURITY;

-- Eingeloggte Nutzer können lesen
CREATE POLICY "auth_read_phase_entries" ON phase_entries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Eingeloggte Nutzer können schreiben (Owner-Portal)
CREATE POLICY "auth_insert_phase_entries" ON phase_entries
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_delete_phase_entries" ON phase_entries
  FOR DELETE TO authenticated
  USING (true);
