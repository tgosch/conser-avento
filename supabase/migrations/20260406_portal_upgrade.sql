-- ═══════════════════════════════════════════════════════════════
-- Migration: Portal Upgrade — Contact Requests + Indexes
-- Date: 2026-04-06
-- ═══════════════════════════════════════════════════════════════

-- 1. Contact Requests Tabelle (Kontaktformular Public Website)
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'investor',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Jeder darf Kontaktanfragen senden (öffentliches Formular)
CREATE POLICY "anon_insert_contact" ON contact_requests
  FOR INSERT WITH CHECK (true);

-- Nur Admins dürfen Kontaktanfragen lesen
CREATE POLICY "admin_read_contact" ON contact_requests
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- 2. Performance-Indexes
CREATE INDEX IF NOT EXISTS idx_messages_investor_id ON messages(investor_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- 3. updated_at auf wichtige Tabellen
ALTER TABLE investors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE partners ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Auto-Update Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'investors_updated_at') THEN
    CREATE TRIGGER investors_updated_at BEFORE UPDATE ON investors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'partners_updated_at') THEN
    CREATE TRIGGER partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'documents_updated_at') THEN
    CREATE TRIGGER documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
