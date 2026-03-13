-- Seed: 6 Projektphasen für Enterprise Roadmap 2026-2027
-- Nur einfügen wenn die Tabelle leer ist, damit manuelle Änderungen nicht überschrieben werden.

INSERT INTO phases (name, description, start_date, end_date, status, order_index)
SELECT * FROM (VALUES
  (
    'Gesamtaufsetzung',
    'AWS Cloud Setup, Auth System (OAuth), Design System, CI/CD Pipeline, Monitoring, RLS & Security. Kosten: 180k€. Delivery: 30. Jun 2026.',
    '2026-04-01', '2026-06-30', 'planned', 0
  ),
  (
    'Conser MVP',
    '2,3M Produkte Live, 7 Partner Integration, Product Search, Shopping Cart, Payment & Escrow, Order Management. Ziel: 1.000+ Kunden, 5M€ GMV.',
    '2026-07-01', '2026-08-26', 'planned', 1
  ),
  (
    'Avento Beta 1',
    'Core ERP: Zeiterfassung, Kalender, Angebote, Rechnungen, Dashboard, Admin Panel. Ziel: 1.000 Kunden, 40k€ MRR, NPS 50+, Retention 95%+.',
    '2026-09-01', '2026-10-26', 'planned', 2
  ),
  (
    'Deep Integration',
    'Conser ↔ Avento Sync, KI-Mitarbeiter, Baustellen-Doku, Analytics, Mobile App, Smart Recommendations. Ziel: 5.000 Kunden, 400k€ MRR.',
    '2026-11-01', '2027-01-10', 'planned', 3
  ),
  (
    'Mobile & Advanced',
    'iOS/Android Apps, KI-Aufmaß, Intelligent Offers, Lager Management, Offline Mode, Push Notifications. Ziel: 25.000 Kunden, 2,0M€ MRR.',
    '2027-02-01', '2027-03-31', 'planned', 4
  ),
  (
    'GA Launch',
    'Workflow Engine, Full Union (Conser + Avento), UI/UX Polish, Code Cleanup, Hardening. Ziel: 75.000+ Kunden, 181M€ Revenue, NPS 60+.',
    '2027-04-01', '2027-05-12', 'planned', 5
  )
) AS v(name, description, start_date, end_date, status, order_index)
WHERE NOT EXISTS (SELECT 1 FROM phases LIMIT 1);
