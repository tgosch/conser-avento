-- Migration: NDA & Consent Spalten zu investors-Tabelle hinzufügen
-- Führe dieses SQL im Supabase SQL-Editor aus

ALTER TABLE investors
  ADD COLUMN IF NOT EXISTS nda_accepted   boolean   DEFAULT false,
  ADD COLUMN IF NOT EXISTS nda_date       timestamptz,
  ADD COLUMN IF NOT EXISTS consent_date   timestamptz;

-- Bestehende Rows: consent_date auf created_at setzen falls NULL
UPDATE investors
SET consent_date = created_at
WHERE consent_date IS NULL AND consent = true;

-- Prüfung
SELECT id, email, consent, consent_date, nda_accepted, nda_date
FROM investors
LIMIT 5;
