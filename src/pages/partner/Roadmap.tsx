import { CheckCircle, Circle, ArrowRight } from 'lucide-react'

const PHASES = [
  {
    phase: 'Phase 1', period: 'Q2 2026', title: 'Conser MVP',
    items: ['7 Produktionspartner live', '2,3M Produkte auf dem Marktplatz', 'Payment-System aktiv'],
    partnerBenefit: 'Ihr Katalog ist live und suchbar für alle Handwerker.',
    status: 'active',
  },
  {
    phase: 'Phase 2', period: 'Q3 2026', title: 'Avento Beta',
    items: ['ERP-Integration für Handwerker', 'Erste automatische Bestellungen', 'Mobile App Beta'],
    partnerBenefit: 'Erste automatische Bestellungen von Avento-Nutzern direkt an Sie.',
    status: 'upcoming',
  },
  {
    phase: 'Phase 3', period: 'Q4 2026', title: 'Deep Integration',
    items: ['Conser ↔ Avento Vollsync', 'KI-Produktempfehlungen', 'Echtzeit Verfügbarkeit'],
    partnerBenefit: 'KI empfiehlt Ihre Produkte aktiv basierend auf Projektbedarf.',
    status: 'upcoming',
  },
  {
    phase: 'Phase 4', period: 'Q1 2027', title: 'Mobile & Advanced',
    items: ['iOS/Android App Launch', '1-Click Bestellung', 'Push-Benachrichtigungen für Lieferungen'],
    partnerBenefit: 'Handwerker bestellen mobil von der Baustelle — direkt bei Ihnen.',
    status: 'upcoming',
  },
  {
    phase: 'Phase 5', period: 'Q2 2027', title: 'GA Launch & Expansion',
    items: ['75.000 Kunden Ziel', 'Europa-Expansion (AT, CH)', '100+ Produktionspartner'],
    partnerBenefit: 'Zugang zum europäischen Markt mit 100+ Partnern im Netzwerk.',
    status: 'upcoming',
  },
]

const EXPANSION = [
  { phase: '1', partners: '7', region: 'DACH Kernmarkt' },
  { phase: '2-3', partners: '+8-12', region: 'Erweiterte DACH' },
  { phase: '4-5', partners: '+10-20', region: 'Europa' },
]

export default function PartnerRoadmap() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-up">

      <div className="mb-6">
        <p className="label-overline mb-1">Roadmap</p>
        <h1 className="font-bold text-2xl md:text-3xl mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Wohin wir uns entwickeln
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          5 Phasen von MVP bis Europa-Launch — und was jede Phase für Sie bedeutet.
        </p>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-4 mb-6">
        {PHASES.map((p, i) => (
          <div key={p.phase} className={`card overflow-hidden animate-fade-up delay-${i + 1}`}
            style={p.status === 'active' ? { border: '1px solid var(--brand)' } : {}}>
            <div className="flex items-center gap-3 px-5 py-3"
              style={{ borderBottom: '1px solid var(--border)', background: p.status === 'active' ? 'var(--brand-dim)' : 'transparent' }}>
              {p.status === 'active' ? (
                <Circle size={14} fill="var(--brand)" style={{ color: 'var(--brand)' }} />
              ) : (
                <CheckCircle size={14} style={{ color: 'var(--text-tertiary)' }} />
              )}
              <span className="text-xs font-bold" style={{ color: p.status === 'active' ? 'var(--brand)' : 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {p.phase} · {p.period}
              </span>
              <span className="flex-1" />
              {p.status === 'active' && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--brand)', color: 'white' }}>Aktuell</span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>Meilensteine</p>
                  <ul className="space-y-1.5">
                    {p.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="shrink-0 mt-0.5" style={{ color: 'var(--brand)' }}>·</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--brand)' }}>Was das für Sie bedeutet</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.partnerBenefit}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expansion */}
      <div className="card p-5 md:p-6 animate-fade-up delay-4">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>PARTNER-EXPANSION</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPANSION.map((e, i) => (
            <div key={e.phase} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-center">
                <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Phase {e.phase}</p>
                <p className="text-metric-md" style={{ color: 'var(--brand)' }}>{e.partners}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Partner</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{e.region}</p>
              </div>
              {i < EXPANSION.length - 1 && (
                <ArrowRight size={12} style={{ color: 'var(--text-tertiary)' }} className="hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
