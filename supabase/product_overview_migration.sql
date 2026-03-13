-- ─────────────────────────────────────────────────────────────────────────
-- Product Overview — Internal (Owner-only)
-- Tables: product_features, roadmap_milestones, feedback_items
-- ─────────────────────────────────────────────────────────────────────────

-- ── product_features ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_features (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT,
  status       TEXT NOT NULL DEFAULT 'live'
               CHECK (status IN ('live','in_progress','planned','deprecated')),
  icon         TEXT,
  sort_order   INT  DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ── roadmap_milestones ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  target_date  DATE,
  status       TEXT NOT NULL DEFAULT 'planned'
               CHECK (status IN ('done','in_progress','planned','delayed','cancelled')),
  sort_order   INT  DEFAULT 0,
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ── feedback_items ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source         TEXT,
  content        TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open','in_review','implemented','dismissed')),
  milestone_id   UUID REFERENCES roadmap_milestones(id) ON DELETE SET NULL,
  submitted_at   TIMESTAMPTZ DEFAULT now(),
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS product_features_status_idx     ON product_features(status);
CREATE INDEX IF NOT EXISTS roadmap_milestones_status_idx   ON roadmap_milestones(status);
CREATE INDEX IF NOT EXISTS roadmap_milestones_date_idx     ON roadmap_milestones(target_date);
CREATE INDEX IF NOT EXISTS feedback_items_status_idx       ON feedback_items(status);
CREATE INDEX IF NOT EXISTS feedback_items_milestone_idx    ON feedback_items(milestone_id);

-- ── RLS — authenticated users only (owner-only enforced in frontend) ──────
ALTER TABLE product_features   ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_items     ENABLE ROW LEVEL SECURITY;

-- Read: any logged-in user
CREATE POLICY "auth_read_features"
  ON product_features FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_read_milestones"
  ON roadmap_milestones FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_read_feedback"
  ON feedback_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Write: any logged-in user (owner-only gated in frontend via OwnerGuard)
CREATE POLICY "auth_insert_features"
  ON product_features FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_features"
  ON product_features FOR UPDATE
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_insert_milestones"
  ON roadmap_milestones FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_milestones"
  ON roadmap_milestones FOR UPDATE
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_milestones"
  ON roadmap_milestones FOR DELETE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_insert_feedback"
  ON feedback_items FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_update_feedback"
  ON feedback_items FOR UPDATE
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- ── Seed: initial product features ───────────────────────────────────────
INSERT INTO product_features (title, description, category, status, icon, sort_order) VALUES
  ('Dashboard',         'KPI-Übersicht mit Leads, Aufgaben und DonutCharts',           'Übersicht',     'live',        '📊', 10),
  ('Lead-Radar',        'Lead-Pipeline mit Status, Tags und KI-Priorisierung',          'Marketing',     'live',        '🎯', 20),
  ('Marketing-Fabrik',  'Kampagnen-Studio, Vorlagen und KI-Texterstellung',             'Marketing',     'live',        '📢', 30),
  ('Landingpages',      'LP-Builder mit Editor und Template-Auswahl',                   'Marketing',     'live',        '🌐', 40),
  ('Chat-Bots',         'Web-Bot und WhatsApp-Connector',                               'Chat',          'in_progress', '🤖', 50),
  ('Dokumenten-DMS',    '3 Workspaces (Finanzen, Verträge, Wissen) mit KI-Editor',     'Dokumente',     'live',        '📁', 60),
  ('PDF-Export',        'HTML2Canvas + jsPDF mit Branding',                             'Dokumente',     'live',        '📄', 70),
  ('Zeiterfassung',     'ArbZG-konformer Timer (6h/9h/10h Grenzen)',                    'Business Suite','live',        '⏱', 80),
  ('Kanban-Board',      'Aufgaben-Board mit Drag-and-Drop und Kommentaren',             'Business Suite','live',        '🗂', 90),
  ('Anträge',           'Urlaub, Homeoffice und Sonderurlaub mit Genehmigungsflow',     'Business Suite','live',        '📋', 100),
  ('Quartalsziele',     'OKR-Tracking mit KI-Tasks und Donut-Charts',                  'Business Suite','live',        '🎯', 110),
  ('Mitarbeiter-App',   'Mobile-App mit Bottom-Nav, Zeiterfassung und Anträgen',        'Mitarbeiter',   'in_progress', '📱', 120),
  ('Stripe Billing',    'Pläne, Webhooks und Abrechnungs-Panel',                        'System',        'planned',     '💳', 130),
  ('White-Label',       'Custom Domain, Branding und Partner-Portal',                   'System',        'planned',     '🎨', 140)
ON CONFLICT DO NOTHING;
