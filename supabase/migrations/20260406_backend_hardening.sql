-- ═══════════════════════════════════════════════════════════════
-- Migration: Backend Hardening — Indexes + Storage
-- Date: 2026-04-06
-- EINZELN AUSFÜHREN — jedes Statement separat kopieren
-- ═══════════════════════════════════════════════════════════════

-- ── BLOCK 1: Indexes (einzeln ausführen, Fehler ignorieren) ──

-- Nur ausführen wenn investors Tabelle existiert:
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'investors') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_investors_email ON investors(email)';
  END IF;
END $$;

-- Nur ausführen wenn updates Tabelle existiert:
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'updates') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC)';
  END IF;
END $$;

-- Nur ausführen wenn documents Tabelle existiert:
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'documents') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category)';
  END IF;
END $$;

-- Nur ausführen wenn investment_intents Tabelle existiert:
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'investment_intents') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_investment_intents_investor_id ON investment_intents(investor_id)';
  END IF;
END $$;

-- ── BLOCK 2: phase_entries (nur wenn phases existiert) ──

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'phases') THEN
    CREATE TABLE IF NOT EXISTS phase_entries (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      date DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE phase_entries ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_phase_entries_phase_id ON phase_entries(phase_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_phase_entries_date ON phase_entries(date DESC)';
  END IF;
END $$;

-- RLS für phase_entries (ignoriert Fehler wenn Tabelle nicht existiert)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'phase_entries') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'phase_entries' AND policyname = 'admin_all_phase_entries') THEN
      EXECUTE 'CREATE POLICY "admin_all_phase_entries" ON phase_entries FOR ALL USING ((auth.jwt() -> ''app_metadata'' ->> ''is_admin'')::boolean = true)';
    END IF;
  END IF;
END $$;

-- ── BLOCK 3: Storage Buckets ──

INSERT INTO storage.buckets (id, name, public)
VALUES ('team-photos', 'team-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (ignoriert wenn bereits vorhanden)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'team_photos_select_auth') THEN
    EXECUTE 'CREATE POLICY "team_photos_select_auth" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = ''team-photos'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'team_photos_admin_all') THEN
    EXECUTE 'CREATE POLICY "team_photos_admin_all" ON storage.objects FOR ALL USING (bucket_id = ''team-photos'' AND (auth.jwt() -> ''app_metadata'' ->> ''is_admin'')::boolean = true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_logos_select_auth') THEN
    EXECUTE 'CREATE POLICY "partner_logos_select_auth" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = ''partner-logos'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'partner_logos_admin_all') THEN
    EXECUTE 'CREATE POLICY "partner_logos_admin_all" ON storage.objects FOR ALL USING (bucket_id = ''partner-logos'' AND (auth.jwt() -> ''app_metadata'' ->> ''is_admin'')::boolean = true)';
  END IF;
END $$;
