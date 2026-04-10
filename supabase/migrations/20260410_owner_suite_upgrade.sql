-- ============================================================
-- OWNER SUITE UPGRADE — 2026-04-10
-- Tables: support_tickets, marketing_posts, coupon_codes,
--         tax_entries, user_activity_log
-- ============================================================

-- 1) SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL DEFAULT ('TK-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0')),
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT DEFAULT 'SONSTIGES' CHECK (category IN ('BILLING','BUG','FEATURE_REQUEST','HOW_TO','SONSTIGES')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status TEXT DEFAULT 'offen' CHECK (status IN ('offen','in_bearbeitung','warten_auf_antwort','geloest','geschlossen')),
  source TEXT DEFAULT 'portal' CHECK (source IN ('portal','email','chat','manual')),
  assigned_to TEXT,
  ai_response TEXT,
  ai_category_confidence DECIMAL(3,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_sender ON support_tickets(sender_email);

-- Ticket replies
CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  from_admin BOOLEAN DEFAULT FALSE,
  body TEXT NOT NULL,
  is_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_replies_ticket ON ticket_replies(ticket_id);

-- Quick-reply templates
CREATE TABLE IF NOT EXISTS reply_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) MARKETING POSTS TRACKER
CREATE TABLE IF NOT EXISTS marketing_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok','instagram','youtube','linkedin','twitter','other')),
  post_type TEXT NOT NULL DEFAULT 'organisch' CHECK (post_type IN ('organisch','paid')),
  description TEXT NOT NULL,
  budget_cents INT DEFAULT 0,
  link TEXT,
  signups_day0 INT DEFAULT 0,
  signups_day1 INT DEFAULT 0,
  signups_day2 INT DEFAULT 0,
  signups_day7 INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_date ON marketing_posts(post_date DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_platform ON marketing_posts(platform);

-- 3) COUPON CODES
CREATE TABLE IF NOT EXISTS coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'percent' CHECK (type IN ('percent','fixed')),
  value DECIMAL(10,2) NOT NULL,
  max_uses INT DEFAULT 1,
  used_count INT DEFAULT 0,
  valid_until DATE,
  product TEXT DEFAULT 'all' CHECK (product IN ('all','buchbalance','avento','spaceai','baudoku')),
  active BOOLEAN DEFAULT TRUE,
  created_by TEXT DEFAULT 'torben',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupon_codes(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupon_codes(active);

-- 4) TAX ENTRIES (GmbH Steuer-Tracking)
CREATE TABLE IF NOT EXISTS tax_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter TEXT NOT NULL,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  type TEXT NOT NULL CHECK (type IN ('ust_voranmeldung','koerperschaftsteuer','gewerbesteuer','gf_gehalt','ruecklage','entnahme')),
  amount_cents BIGINT NOT NULL DEFAULT 0,
  description TEXT,
  status TEXT DEFAULT 'geplant' CHECK (status IN ('geplant','faellig','bezahlt','ueberfaellig')),
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tax_quarter ON tax_entries(year, quarter);
CREATE INDEX IF NOT EXISTS idx_tax_type ON tax_entries(type);

-- 5) USER ACTIVITY LOG (lightweight analytics)
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  product TEXT DEFAULT 'conser-avento' CHECK (product IN ('conser-avento','buchbalance','avento','spaceai','baudoku','conser-shop')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_product ON user_activity_log(product);
CREATE INDEX IF NOT EXISTS idx_activity_created ON user_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_action ON user_activity_log(action);

-- 6) Auto-update triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_tickets_updated') THEN
    CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON support_tickets
      FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_marketing_updated') THEN
    CREATE TRIGGER trg_marketing_updated BEFORE UPDATE ON marketing_posts
      FOR EACH ROW EXECUTE FUNCTION update_modified_column();
  END IF;
END $$;

-- 7) RLS Policies — Admin-only for all new tables
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reply_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin full access
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN VALUES ('support_tickets'),('ticket_replies'),('reply_templates'),
                   ('marketing_posts'),('coupon_codes'),('tax_entries'),('user_activity_log')
  LOOP
    EXECUTE format(
      'CREATE POLICY admin_full_%1$s ON %1$I FOR ALL USING ((auth.jwt() -> ''app_metadata'' ->> ''is_admin'')::boolean = true) WITH CHECK ((auth.jwt() -> ''app_metadata'' ->> ''is_admin'')::boolean = true)',
      t
    );
  END LOOP;
END $$;

-- Users can insert their own activity log entries
CREATE POLICY user_insert_activity ON user_activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own activity
CREATE POLICY user_read_own_activity ON user_activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create support tickets
CREATE POLICY user_create_ticket ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = sender_id OR sender_id IS NULL);

-- Users can read their own tickets
CREATE POLICY user_read_own_tickets ON support_tickets
  FOR SELECT USING (auth.uid() = sender_id);
