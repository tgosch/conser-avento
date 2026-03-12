-- Partners Table
-- DSGVO-Hinweis: Nur Firmendaten (keine personenbezogenen Daten)
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('production', 'customer')),
  category TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'negotiating' CHECK (status IN ('negotiating', 'active', 'beta', 'partner')),
  logo_path TEXT,
  initials TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#063D3E',
  visible BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Eingeloggte Investoren können Partner lesen
CREATE POLICY "auth_read_partners" ON partners
  FOR SELECT USING (auth.role() = 'authenticated' AND visible = true);

-- Seed: Produktionspartner (alle "In Verhandlungen")
INSERT INTO partners (name, type, category, description, status, initials, color, order_index) VALUES
  ('Richter+Frenzel', 'production', 'Sanitär · Heizung · Installation', 'Führender Großhändler für Haustechnik in Deutschland. Starkes SHK-Netzwerk mit über 180 Standorten bundesweit.', 'negotiating', 'RF', '#B71C1C', 1),
  ('Gebhardt Bauzentrum', 'production', 'Baustoffhandel', 'Regionaler Baustoffhändler mit breitem Produktportfolio für den professionellen Tiefbau und Hochbau.', 'negotiating', 'GB', '#1A5C1A', 2),
  ('FEGA & Schmitt', 'production', 'Elektrotechnik · Großhandel', 'Elektrogroßhändler mit Vollsortiment für Elektroinstallation, Industrietechnik und Gebäudeautomation.', 'negotiating', 'FS', '#003DA5', 3),
  ('Klöpfer Holzhandel', 'production', 'Holz · Holzwerkstoffe', 'Einer der größten Holzgroßhändler Deutschlands. Spezialist für Schnittholz, Platten und Veredelungsprodukte.', 'negotiating', 'KH', '#7B3F00', 4),
  ('AWN Stahl', 'production', 'Stahlhandel · Metallbau', 'Stahl- und Metallgroßhandel für Bau und Industrie. Breites Sortiment an Trägern, Rohren und Blechen.', 'negotiating', 'AW', '#455A64', 5),
  ('BayWa AG', 'production', 'Agrar · Bau · Energie', 'Internationaler Handels- und Dienstleistungskonzern mit starkem Fokus auf Baustoffe und Agrarprodukte.', 'negotiating', 'BA', '#00695C', 6),
  ('Rexel Germany', 'production', 'Elektrotechnik · B2B', 'Global führender B2B-Distributor für Elektromaterial. Spezialist für Installations- und Industrietechnik.', 'negotiating', 'RX', '#C62828', 7),
  ('Binderholz Group', 'production', 'Holz · Massivholz · CLT', 'Europaweit führender Massivholzproduzent. Spezialist für CLT, BSH und konstruktiven Holzbauprodukten.', 'negotiating', 'BH', '#2E7D32', 8),
  ('Holz Ziller', 'production', 'Holzhandel · Bayern', 'Regionaler Holzfachhändler in Bayern mit Fokus auf Sägewerk-Produkte, Zimmerei-Holz und Holzwerkstoffe.', 'negotiating', 'HZ', '#E65100', 9)
ON CONFLICT DO NOTHING;

-- Seed: Endkunden
INSERT INTO partners (name, type, category, description, status, initials, color, order_index) VALUES
  ('P+E Schmitt', 'customer', 'Bauunternehmen', 'Mittelständisches Bauunternehmen mit Fokus auf schlüsselfertige Projekte im Wohnungs- und Gewerbebau.', 'beta', 'PS', '#1565C0', 1),
  ('In Concept', 'customer', 'Architektur · Planung', 'Architektur- und Planungsbüro für gewerbliche und wohnwirtschaftliche Bauprojekte im DACH-Raum.', 'beta', 'IC', '#6A1B9A', 2),
  ('IKEA Bau', 'customer', 'Retail · Bau', 'Bau- und Einrichtungsmarkt mit starker Supply-Chain-Nachfrage nach digitalen Beschaffungskanälen.', 'beta', 'IB', '#003087', 3),
  ('Dietrich Group', 'customer', 'Baugruppe · Projektentwicklung', 'Baugruppe mit Schwerpunkt auf Projektentwicklung und Generalunternehmen für Wohn- und Gewerbeimmobilien.', 'beta', 'DG', '#00838F', 4),
  ('Eckpfeiler Immobilien', 'customer', 'Immobilienentwicklung', 'Immobilienentwickler mit Fokus auf nachhaltige Wohnbauprojekte und gemischte Nutzungskonzepte.', 'beta', 'EI', '#1B5E20', 5)
ON CONFLICT DO NOTHING;
