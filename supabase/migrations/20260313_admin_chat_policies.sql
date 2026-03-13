-- ════════════════════════════════════════════════
-- Admin Chat & Investor Read Policies
-- Stand: 2026-03-13
-- Problem: Admins konnten keine Nachrichten lesen/schreiben
--          (RLS blockierte alle anderen als den Investor selbst)
-- ════════════════════════════════════════════════

-- Admin kann alle Nachrichten lesen
CREATE POLICY "admin_read_all_messages" ON messages
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Admin kann Nachrichten für beliebige Investoren senden
CREATE POLICY "admin_insert_any_message" ON messages
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Admin kann alle Investoren lesen
CREATE POLICY "admin_read_all_investors" ON investors
  FOR SELECT USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Admin kann Investor-Status aktualisieren (CRM)
CREATE POLICY "admin_update_investors" ON investors
  FOR UPDATE USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Admin kann alle Tabellen schreiben
CREATE POLICY "admin_write_updates" ON updates
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "admin_write_future" ON future_content
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "admin_write_phases" ON phases
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "admin_write_team" ON team_members
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "admin_write_documents" ON documents
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );
