-- ════════════════════════════════════════════════════════════════
-- DSGVO Art. 17 — Vollständige Datenlöschung bei Account-Deletion
-- CASCADE sicherstellt: Investor löschen → alle zugehörigen Daten weg
-- ════════════════════════════════════════════════════════════════

-- messages: ON DELETE CASCADE für investor_id
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_investor_id_fkey;
ALTER TABLE messages
  ADD CONSTRAINT messages_investor_id_fkey
  FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE;

-- investment_intents: ON DELETE CASCADE für investor_id
ALTER TABLE investment_intents DROP CONSTRAINT IF EXISTS investment_intents_investor_id_fkey;
ALTER TABLE investment_intents
  ADD CONSTRAINT investment_intents_investor_id_fkey
  FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE;
