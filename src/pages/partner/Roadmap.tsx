import { CheckCircle, Circle, ArrowRight } from 'lucide-react'

const PHASES = [
  {
    phase: 'Phase 1', period: 'Q2 2026', title: 'Conser MVP', icon: '🚀',
    items: ['9 Produktionspartner live', '2,3M Produkte auf dem Marktplatz', 'Payment-System aktiv'],
    partnerBenefit: 'Ihr Katalog ist live und suchbar für alle Handwerker.',
    status: 'active',
  },
  {
    phase: 'Phase 2', period: 'Q3 2026', title: 'Avento Beta', icon: '⚡',
    items: ['ERP-Integration für Handwerker', 'Erste automatische Bestellungen', 'Mobile App Beta'],
    partnerBenefit: 'Erste automatische Bestellungen von Avento-Nutzern direkt an Sie.',
    status: 'upcoming',
  },
  {
    phase: 'Phase 3', period: 'Q4 2026', title: 'Deep Integration', icon: '🔗',
    items: ['Conser ↔ Avento Vollsync', 'KI-Produktempfehlungen', 'Echtzeit Verfügbarkeit'],
    partnerBenefit: 'KI empfiehlt Ihre Produkte aktiv basierend auf Projektbedarf.',
    status: 'upcoming',
  },
  {
    phase: 'Phase 4', period: 'Q1 2027', title: 'Mobile & Advanced', icon: '📱',
    items: ['iOS/Android App Launch', '1-Click Bestellung', 'Push-Benachrichtigungen für Lieferungen'],
    partnerBenefit: 'Handwerker bestellen mobil von der Baustelle — direkt bei Ihnen.',
    status: 'upcoming',
  },
  {
    phase: 'Phase 5', period: 'Q2 2027', title: 'GA Launch & Expansion', icon: '🌍',
    items: ['75.000 Kunden Ziel', 'Europa-Expansion (AT, CH)', '100+ Produktionspartner'],
    partnerBenefit: 'Zugang zum europäischen Markt mit 100+ Partnern im Netzwerk.',
    status: 'upcoming',
  },
]

export default function PartnerRoadmap() {
  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-8 animate-fade-up">
        <p className="label-overline mb-2">Roadmap</p>
        <h1 className="text-display-md mb-3" style={{ color: 'var(--text-primary)' }}>
          Wohin wir uns entwickeln
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          5 Phasen von MVP bis Europa-Launch — und was jede Phase für Sie als Partner bedeutet.
        </p>
      </div>

      {/* ── TIMELINE ── */}
      <div className="flex flex-col gap-4 mb-8">
        {PHASES.map((p, i) => (
          <div key={p.phase} className={`card overflow-hidden animate-fade-up delay-${Math.min(i + 1, 4)} group hover:translate-y-[-1px] transition-all duration-300`}
            style={p.status === 'active' ? { border: '1.5px solid var(--brand)', boxShadow: '0 4px 20px rgba(6,61,62,0.08)' } : {}}>
            <div className="flex items-center gap-3 px-5 py-3"
              style={{ borderBottom: '1px solid var(--border)', background: p.status === 'active' ? 'var(--brand-dim)' : 'transparent' }}>
              <span className="text-lg">{p.icon}</span>
              {p.status === 'active' ? (
                <Circle size={13} fill="var(--brand)" style={{ color: 'var(--brand)' }} />
              ) : (
                <CheckCircle size={13} style={{ color: 'var(--text-tertiary)' }} />
              )}
              <span className="text-xs font-bold" style={{ color: p.status === 'active' ? 'var(--brand)' : 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {p.phase} · {p.period}
              </span>
              <span className="flex-1" />
              {p.status === 'active' && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide"
                  style={{ background: 'var(--brand)', color: 'white' }}>
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'white' }} />
                  AKTUELL
                </span>
              )}
            </div>
            <div className="p-5 md:p-6">
              <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-wide mb-2.5" style={{ color: 'var(--text-tertiary)' }}>MEILENSTEINE</p>
                  <ul className="space-y-2">
                    {p.items.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--brand)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-bold tracking-wide mb-2" style={{ color: 'var(--brand)' }}>FÜR SIE ALS PARTNER</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.partnerBenefit}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── EXPANSION ── */}
      <div className="card overflow-hidden animate-fade-up delay-4">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>PARTNER-EXPANSION</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { phase: '1', partners: '7', region: 'DACH Kernmarkt', icon: '🇩🇪', active: true },
            { phase: '2-3', partners: '+12', region: 'Erweiterte DACH', icon: '🇦🇹', active: false },
            { phase: '4-5', partners: '+20', region: 'Europa', icon: '🇪🇺', active: false },
          ].map((e, i) => (
            <div key={e.phase} className="relative flex items-center gap-4 p-4 rounded-xl group hover:translate-y-[-1px] transition-all duration-300"
              style={{ background: 'var(--surface2)', border: e.active ? '1.5px solid var(--brand)' : '1.5px solid var(--border)' }}>
              <span className="text-2xl">{e.icon}</span>
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-wide mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Phase {e.phase}</p>
                <p className="text-metric-md" style={{ color: 'var(--brand)' }}>{e.partners}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{e.region}</p>
              </div>
              {i < 2 && (
                <ArrowRight size={12} style={{ color: 'var(--text-tertiary)' }} className="absolute -right-3 hidden md:block z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
