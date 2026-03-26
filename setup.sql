-- Investors
CREATE TABLE IF NOT EXISTS investors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  consent BOOLEAN DEFAULT false,
  consent_date TIMESTAMPTZ,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  from_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment Intents
CREATE TABLE IF NOT EXISTS investment_intents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  category TEXT DEFAULT 'business',
  file_name TEXT,
  file_url TEXT,
  visible_to_investors BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updates
CREATE TABLE IF NOT EXISTS updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Future Content
CREATE TABLE IF NOT EXISTS future_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planned',
  timeframe TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phase Plan
CREATE TABLE IF NOT EXISTS phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planned',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  initials TEXT,
  color TEXT DEFAULT '#063D3E',
  type TEXT DEFAULT 'internal',
  equity_percent NUMERIC DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- ════════════════════════════════════════════════
-- SICHERE RLS POLICIES
-- ════════════════════════════════════════════════

-- INVESTORS
-- Neue Interessenten dürfen sich eintragen (anon)
CREATE POLICY "anon_insert_investors" ON investors
  FOR INSERT WITH CHECK (true);
-- Eingeloggter Investor sieht nur eigene Daten
CREATE POLICY "investor_read_own" ON investors
  FOR SELECT USING (auth.uid() = id);
-- Investor darf eigene Daten aktualisieren
CREATE POLICY "investor_update_own" ON investors
  FOR UPDATE USING (auth.uid() = id);

-- MESSAGES
-- Investor schreibt eigene Nachrichten
CREATE POLICY "investor_insert_message" ON messages
  FOR INSERT WITH CHECK (auth.uid() = investor_id);
-- Investor liest nur eigene Nachrichten
CREATE POLICY "investor_read_messages" ON messages
  FOR SELECT USING (auth.uid() = investor_id);

-- INVESTMENT INTENTS
-- Investor reicht eigene Absichten ein
CREATE POLICY "investor_insert_intent" ON investment_intents
  FOR INSERT WITH CHECK (auth.uid() = investor_id);
-- Investor sieht nur eigene Absichten
CREATE POLICY "investor_read_intent" ON investment_intents
  FOR SELECT USING (auth.uid() = investor_id);

-- DOCUMENTS
-- Eingeloggte Investoren sehen sichtbare Dokumente
CREATE POLICY "investor_read_visible_docs" ON documents
  FOR SELECT USING (
    auth.role() = 'authenticated' AND visible_to_investors = true
  );

-- UPDATES, FUTURE_CONTENT, PHASES, TEAM_MEMBERS
-- Lesbar für alle eingeloggten Nutzer (öffentliche Inhalte)
CREATE POLICY "auth_read_updates" ON updates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_future" ON future_content
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_phases" ON phases
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_team" ON team_members
  FOR SELECT USING (auth.role() = 'authenticated');

-- HINWEIS: Write-Operationen für Owner/Admin werden über
-- den Supabase Service-Role-Key (nur serverseitig) oder
-- eine dedizierte admin_users Tabelle mit JWT-Claims abgesichert.

-- Seed Team Members
INSERT INTO team_members (name, role, bio, initials, color, type, equity_percent, order_index)
VALUES
  ('Torben Gosch', 'CEO · Chief Executive Officer', 'Gründer und Geschäftsführer. Verantwortet Strategie, Partnerschaften und Investorenbeziehungen.', 'TG', '#063D3E', 'founder', 0, 1),
  ('Martin Groote', 'CTO · Chief Technology Officer', 'Technologieleiter und Mitgründer. Verantwortet Produktentwicklung und technische Innovation.', 'MG', '#D4662A', 'founder', 0, 2),
  ('Code Ara GmbH', 'Externer Entwicklungspartner', 'Strategischer Technologiepartner. Verantwortet externe Software-Entwicklung.', 'CA', '#2d6a4f', 'external', 10, 3)
ON CONFLICT DO NOTHING;
