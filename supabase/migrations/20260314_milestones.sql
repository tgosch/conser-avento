-- ════════════════════════════════════════════════
-- Milestones — verknüpft mit bestehender phases-Tabelle
-- Stand: 2026-03-14
-- ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS milestones (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id    UUID        NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  target_date DATE,
  status      VARCHAR(50) DEFAULT 'planned'
    CHECK (status IN ('completed', 'in_progress', 'planned', 'delayed', 'cancelled')),
  icon        TEXT,
  category    VARCHAR(50),
  sort_order  INT         DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_milestones_phase  ON milestones(phase_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Admin: Full Access
CREATE POLICY "admin_milestones_all" ON milestones
  FOR ALL
  USING      ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- Investors: Read-only
CREATE POLICY "investor_milestones_read" ON milestones
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ─── Seed: Meilensteine für bestehende Phasen ───────────────────
-- Nur einfügen wenn noch keine Meilensteine vorhanden sind

INSERT INTO milestones (phase_id, title, description, target_date, status, icon, category, sort_order)
SELECT p.id, v.title, v.description, v.target_date::DATE, v.status, v.icon, v.category, v.sort_order
FROM phases p
CROSS JOIN (VALUES
  ('Gesamtaufsetzung', 'AWS Cloud Setup & CI/CD',     'AWS EC2, RDS, S3, CloudFront, Pipeline eingerichtet', '2026-04-30', 'planned',     '☁️',  'product',     1),
  ('Gesamtaufsetzung', 'Auth System (OAuth)',          'Supabase Auth + RLS aktiviert',                       '2026-05-15', 'planned',     '🔐',  'product',     2),
  ('Gesamtaufsetzung', 'Design System implementiert',  'Tailwind Config, CSS Tokens, Komponentenbibliothek',  '2026-05-30', 'planned',     '🎨',  'product',     3),
  ('Gesamtaufsetzung', 'Security Audit bestanden',     'Pentest + GDPR Review abgeschlossen',                 '2026-06-20', 'planned',     '🛡️',  'legal',       4),

  ('Conser MVP',       'Produktkatalog 2,3M Produkte', '7 Partner-Integrations abgeschlossen',                '2026-07-31', 'planned',     '📦',  'product',     1),
  ('Conser MVP',       'Payment & Escrow live',         'Stripe PCI-DSS, TaxJar VAT',                         '2026-08-10', 'planned',     '💳',  'financial',   2),
  ('Conser MVP',       '1.000 Kunden akquiriert',       'Organic + Partner-Kanal',                            '2026-08-26', 'planned',     '🎯',  'market',      3),
  ('Conser MVP',       '5M€ GMV erreicht',              'Erster signifikanter Umsatz',                        '2026-08-26', 'planned',     '💰',  'financial',   4),

  ('Avento Beta 1',    'Core ERP Feature-Complete',    'Zeiterfassung, Angebote, Rechnungen, Dashboard',      '2026-09-25', 'planned',     '✅',  'product',     1),
  ('Avento Beta 1',    '1.000 Beta-Kunden',             'Onboarding-Funnel optimiert',                        '2026-10-15', 'planned',     '👥',  'market',      2),
  ('Avento Beta 1',    'NPS 50+ erreicht',              'User-Feedback-Loop etabliert',                       '2026-10-26', 'planned',     '⭐',  'product',     3),

  ('Deep Integration', 'Conser ↔ Avento Sync live',    '1-Click Material-Bestellung aus ERP',                '2026-11-30', 'planned',     '🔄',  'product',     1),
  ('Deep Integration', '5.000 Kunden',                 'Kombiniert: Conser + Avento',                        '2027-01-01', 'planned',     '📊',  'market',      2),
  ('Deep Integration', '400k€ MRR',                    'Break-Even erreicht',                                '2027-01-10', 'planned',     '📈',  'financial',   3),

  ('Mobile & Advanced','iOS App im App Store',         'React Native, stabil auf iOS 16+',                   '2027-02-28', 'planned',     '📱',  'product',     1),
  ('Mobile & Advanced','Android App im Play Store',    'React Native, stabil auf Android 12+',               '2027-03-15', 'planned',     '🤖',  'product',     2),
  ('Mobile & Advanced','KI-Aufmaß Alpha (85%+)',       'Foto → Fläche mit 85%+ Genauigkeit',                 '2027-03-31', 'planned',     '🤖',  'product',     3),

  ('GA Launch',        '75.000 Kunden erreicht',       'European Market Leader',                             '2027-04-30', 'planned',     '🏆',  'market',      1),
  ('GA Launch',        'Series A abgeschlossen',        '20-30M€ Investition',                                '2027-05-01', 'planned',     '💸',  'financial',   2),
  ('GA Launch',        '181M€ Revenue Roadmap',        'Forecast 2031 bestätigt',                            '2027-05-12', 'planned',     '🚀',  'financial',   3)
) AS v(phase_name, title, description, target_date, status, icon, category, sort_order)
WHERE p.name = v.phase_name
  AND NOT EXISTS (SELECT 1 FROM milestones LIMIT 1);
