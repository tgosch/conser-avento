-- ════════════════════════════════════════════════════════════════
-- SECURITY HARDENING — Storage & RLS Fixes
-- Stand: 2026-03-14
--
-- Probleme die behoben werden:
-- 1. storage_allow_all (USING true) → jeder konnte hochladen
-- 2. team_members + partners hatten RLS deaktiviert
-- 3. messages: Investoren konnten alle Nachrichten sehen
-- ════════════════════════════════════════════════════════════════

-- ─── 1. STORAGE: Overly permissive Policy ersetzen ───────────────

-- Alte "alles erlaubt"-Policy entfernen
DROP POLICY IF EXISTS "storage_allow_all"              ON storage.objects;
DROP POLICY IF EXISTS "storage_authenticated_write"    ON storage.objects;
DROP POLICY IF EXISTS "storage_public_read"            ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_all"              ON storage.objects;
DROP POLICY IF EXISTS "admin_storage_all"              ON storage.objects;

-- Admin: Vollzugriff auf alle Buckets
CREATE POLICY "storage_admin_full_access" ON storage.objects
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- Investoren (authenticated): Lesezugriff auf alle Buckets
-- (public Buckets wie team-photos sind ohnehin per CDN-URL erreichbar)
CREATE POLICY "storage_investor_read" ON storage.objects
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── 2. TEAM_MEMBERS & PARTNERS: RLS wieder aktivieren ───────────

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners     ENABLE ROW LEVEL SECURITY;

-- Bestehende Policies sicherstellen (idempotent)
DROP POLICY IF EXISTS "team_members_public_read"  ON team_members;
DROP POLICY IF EXISTS "admin_all_team"            ON team_members;
DROP POLICY IF EXISTS "partners_public_read"      ON partners;
DROP POLICY IF EXISTS "admin_all_partners"        ON partners;

-- Jeder authenticated User darf Team und Partner sehen (kein Geheimnis)
CREATE POLICY "team_members_auth_read" ON team_members
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "team_members_admin_all" ON team_members
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "partners_auth_read" ON partners
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "partners_admin_all" ON partners
  FOR ALL
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ─── 3. MESSAGES: Investoren sehen nur eigene Nachrichten ────────

DROP POLICY IF EXISTS "investor_own_messages"       ON messages;
DROP POLICY IF EXISTS "investor_messages_read_own"  ON messages;

-- Investor sieht nur Nachrichten wo investor_id = eigene User-ID
CREATE POLICY "investor_own_messages" ON messages
  FOR SELECT USING (
    auth.uid() = investor_id
    OR (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- ─── 4. UPDATES: Investoren sehen alle (public info) ─────────────
-- (Updates sind für Investoren gedacht, keine Einschränkung nötig)

DROP POLICY IF EXISTS "investor_read_updates" ON updates;
CREATE POLICY "investor_read_updates" ON updates
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── 5. PHASES + MILESTONES: Investoren können lesen ─────────────

DROP POLICY IF EXISTS "investor_read_phases"     ON phases;
DROP POLICY IF EXISTS "investor_read_milestones" ON milestones;

CREATE POLICY "investor_read_phases" ON phases
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "investor_read_milestones" ON milestones
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── 6. FUTURE_CONTENT: Investoren können lesen ──────────────────

DROP POLICY IF EXISTS "investor_read_future" ON future_content;
CREATE POLICY "investor_read_future" ON future_content
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── 7. PRÜFUNG ──────────────────────────────────────────────────

SELECT 'Storage Policies (after hardening):' AS info;
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

SELECT 'RLS Status:' AS info;
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('team_members', 'partners', 'messages', 'updates', 'phases', 'milestones', 'documents', 'presentations')
ORDER BY tablename;
