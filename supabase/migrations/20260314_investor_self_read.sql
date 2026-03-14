-- ════════════════════════════════════════════════════════════════
-- INVESTOR SELF-READ POLICY
-- Investoren können ihre eigene Zeile in der investors-Tabelle
-- lesen (wird für Profil-Anzeige und Auth benötigt)
-- ════════════════════════════════════════════════════════════════

-- Investor kann nur eigene Zeile lesen (auth.uid() = id)
DROP POLICY IF EXISTS "investor_read_own" ON investors;
CREATE POLICY "investor_read_own" ON investors
  FOR SELECT USING (auth.uid() = id);

-- Investor kann eigene Zeile einfügen (beim Registrieren)
DROP POLICY IF EXISTS "investor_insert_own" ON investors;
CREATE POLICY "investor_insert_own" ON investors
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Investor kann eigene Zeile aktualisieren (Einstellungen etc.)
DROP POLICY IF EXISTS "investor_update_own" ON investors;
CREATE POLICY "investor_update_own" ON investors
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Prüfung
SELECT 'Investor-Policies:' AS info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'investors' ORDER BY policyname;
