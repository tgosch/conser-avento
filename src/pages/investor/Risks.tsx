import { Shield, TrendingDown, Users, Banknote, AlertTriangle, CheckCircle2 } from 'lucide-react'

const risks = [
  {
    icon: TrendingDown,
    category: 'Marktrisiko',
    title: 'Digitalisierungstempo der Baubranche',
    risk: 'Die Baubranche digitalisiert langsamer als erwartet. Unsere Wachstumsprognosen basieren auf einer schrittweisen Adoption — aber das Tempo könnte niedriger ausfallen.',
    mitigation: 'Unser Produkt löst ein akutes Schmerzproblem (Zettelwirtschaft, manuelle Bestellungen). Selbst bei konservativer Adoption von 5% statt 10% erreichen wir Break-Even. Zudem senken regulatorische Anforderungen (e-Rechnung, GoBD) den Widerstand gegen Digitalisierung.',
    monitoring: 'Tracking: Monatliche Analyse der Partner-Pipeline und Conversion-Rate',
    probability: 'Mittel',
    impact: 'Hoch',
  },
  {
    icon: Shield,
    category: 'Wettbewerbsrisiko',
    title: 'Nemetschek, SAP, Procore',
    risk: 'Große Player wie Nemetschek, SAP oder Procore könnten ein ähnliches integriertes Ökosystem bauen und uns mit Marketing-Budget überholen.',
    mitigation: 'Unser Vorteil ist Geschwindigkeit und Fokus. SAP baut für Konzerne, wir für den 5-Mann-Betrieb. Nemetschek fokussiert Architekten, nicht Handwerker. Procore ist US-zentriert. Unser Markt (KMU-Handwerker DACH) wird von keinem dieser Player aktiv bedient. Zudem schaffen wir Switching Costs durch integrierte Workflows und Datenhistorie.',
    monitoring: 'Tracking: Sprint-Velocity und Uptime-Monitoring (99,9% SLA)',
    probability: 'Niedrig',
    impact: 'Hoch',
  },
  {
    icon: Users,
    category: 'Ausführungsrisiko',
    title: 'Team-Aufbau und Partner-Commitment',
    risk: 'Wir könnten Schwierigkeiten haben, Senior-Entwickler zu rekrutieren. Produktionspartner könnten ihre Zusagen verzögern oder zurückziehen.',
    mitigation: 'Unser CTO hat ein aktives Netzwerk in der DACH-Tech-Community. Für die ersten 12 Monate setzen wir auf ein schlankes Core-Team (3-5 Entwickler) plus bewährten Entwicklungspartner. Bei den Produktionspartnern haben wir Absichtserklärungen und laufende Gespräche — der Marktplatz funktioniert auch mit 3 Partnern profitabel.',
    monitoring: 'Tracking: Quartals-Review der Teamzufriedenheit und offenen Positionen',
    probability: 'Mittel',
    impact: 'Mittel',
  },
  {
    icon: Banknote,
    category: 'Finanzrisiko',
    title: 'Burn Rate und Runway',
    risk: 'Die Seed-Finanzierung könnte bei Verzögerungen nicht bis zum Break-Even reichen. Unser geplanter Runway beträgt mindestens 12–18 Monate.',
    mitigation: 'Unser Kostenmodell ist schlank: 60% Engineering, 20% Marketing, 20% Operations. Bei Bedarf können wir Marketing zurückfahren und den Runway auf 24 Monate strecken. Zudem generiert der Conser Marktplatz ab Tag 1 Kommissions-Einnahmen — jede Bestellung reduziert unseren Netto-Burn.',
    monitoring: 'Tracking: Wöchentlicher Cash-Flow-Report, monatlicher Burn-Rate-Check',
    probability: 'Niedrig',
    impact: 'Hoch',
  },
]

const probabilityColor: Record<string, string> = {
  'Niedrig': '#22C55E',
  'Mittel': '#EAB308',
  'Hoch': '#EF4444',
}

export default function Risks() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle size={20} style={{ color: 'var(--accent)' }} />
          <h1 className="text-display-md" style={{ color: 'var(--text-primary)' }}>Risiken & Gegenmaßnahmen</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Transparente Einschätzung der wesentlichen Risiken und wie wir ihnen begegnen.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {risks.map((r, i) => (
          <div key={r.category} className={`card p-6 md:p-8 animate-fade-up delay-${i + 1}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--brand-dim)' }}>
                  <r.icon size={18} style={{ color: 'var(--brand)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    {r.category}
                  </p>
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{r.title}</h3>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>Eintritt</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${probabilityColor[r.probability]}15`, color: probabilityColor[r.probability] }}>
                    {r.probability}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>Auswirkung</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${probabilityColor[r.impact]}15`, color: probabilityColor[r.impact] }}>
                    {r.impact}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk */}
            <div className="mb-4">
              <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Risiko</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.risk}</p>
            </div>

            {/* Mitigation */}
            <div className="p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>Gegenmaßnahme</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.mitigation}</p>
              {r.monitoring && (
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  📊 {r.monitoring}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
