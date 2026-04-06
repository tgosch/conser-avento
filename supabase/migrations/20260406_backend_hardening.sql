-- ═══════════════════════════════════════════════════════════════
-- Migration: Backend Hardening — Indexes + Constraints
-- Date: 2026-04-06
-- Ausführen im Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Performance-Indexes auf häufig gefilterte Spalten
CREATE INDEX IF NOT EXISTS idx_investors_status ON investors(status);
CREATE INDEX IF NOT EXISTS idx_investors_email ON investors(email);
CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- 2. Falls phase_entries noch nicht existiert
CREATE TABLE IF NOT EXISTS phase_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE phase_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_phase_entries" ON phase_entries
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE INDEX IF NOT EXISTS idx_phase_entries_phase_id ON phase_entries(phase_id);
CREATE INDEX IF NOT EXISTS idx_phase_entries_date ON phase_entries(date DESC);

-- 3. Investment Intents Index (falls Tabelle existiert)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'investment_intents') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_investment_intents_investor_id ON investment_intents(investor_id)';
  END IF;
END $$;

-- 4. Storage Buckets (falls nicht vorhanden)
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-photos', 'team-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS für team-photos
CREATE POLICY "team_photos_select_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'team-photos');

CREATE POLICY "team_photos_admin_all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'team-photos' AND
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Storage RLS für partner-logos
CREATE POLICY "partner_logos_select_auth" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'partner-logos');

CREATE POLICY "partner_logos_admin_all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'partner-logos' AND
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );
