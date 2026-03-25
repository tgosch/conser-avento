-- Partner Self-Registration RLS Policies
-- Erlaubt: Neue Partner können sich selbst registrieren (INSERT)
-- Erlaubt: Partner können eigenes Profil lesen (SELECT)
-- Bestehende Policy "auth_read_partners" bleibt für visible=true Partner

-- Partner can insert own record (self-registration)
DROP POLICY IF EXISTS "partner_self_insert" ON partners;
CREATE POLICY "partner_self_insert" ON partners
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Partner can read own record (regardless of visible flag)
DROP POLICY IF EXISTS "partner_self_read" ON partners;
CREATE POLICY "partner_self_read" ON partners
  FOR SELECT USING (auth.uid() = id);

-- Admin can do everything
DROP POLICY IF EXISTS "admin_full_partners" ON partners;
CREATE POLICY "admin_full_partners" ON partners
  FOR ALL USING (
    (SELECT (raw_app_meta_data->>'is_admin')::boolean FROM auth.users WHERE id = auth.uid())
  );
