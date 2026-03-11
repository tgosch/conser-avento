import { Link } from 'react-router-dom'
import aventoLogo from '../../assets/avento_kachel.png'
import conserLogo from '../../assets/conser_kachel.png'

const businessDocs = [
  { icon: '📊', label: 'Pitch-Deck', slug: 'pitch-deck', available: true },
  { icon: '📋', label: 'Business-Plan', slug: 'business-plan', available: true },
  { icon: '📈', label: 'Sales Funnel Endkunden', slug: 'sales-funnel-endkunden', available: true },
  { icon: '🏢', label: 'Sales Funnel Business', slug: 'sales-funnel-business', available: true },
  { icon: '👤', label: 'Persona Endkunde', slug: 'persona-endkunde', available: true },
  { icon: '🤝', label: 'Persona Businesspartner', slug: 'persona-businesspartner', available: false },
]

const finanzDocs = [
  { icon: '💰', label: 'Finanzplan', slug: 'finanzplan', available: true },
  { icon: '📉', label: 'Detaillierte Finanzanalyse', slug: 'finanzanalyse', available: false },
  { icon: '💵', label: 'Invest & Möglichkeiten', slug: 'invest-moeglichkeiten', available: true },
  { icon: '🗓️', label: 'Roadmap Kapital', slug: 'roadmap-kapital', available: false },
  { icon: '🔐', label: 'Sicherheiten & Treuhänder', slug: 'sicherheiten', available: false },
]

function DocItem({ icon, label, slug, available }: { icon: string; label: string; slug: string; available: boolean }) {
  return (
    <Link
      to={`/investor/plans/${slug}`}
      className="flex items-center justify-between px-4 py-3 rounded-xl transition hover:bg-surface2 group"
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
      </div>
      <span
        className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
          background: available ? 'rgba(6,61,62,0.12)' : 'rgba(110,110,115,0.12)',
          color: available ? '#063D3E' : 'var(--text-secondary)',
        }}
      >
        {available ? 'Verfügbar' : 'Kommt bald'}
      </span>
    </Link>
  )
}

export default function InvestorPlans() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Pläne & Dokumente</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Alle Investoren-Unterlagen an einem Ort</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Business Folder */}
        <div className="rounded-[20px] overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#063D3E' }}>
            <span className="text-2xl">📁</span>
            <div>
              <h2 className="font-bold text-white text-base">Business</h2>
              <p className="text-white/60 text-xs">Strategie & Markt</p>
            </div>
          </div>
          <div className="p-3">
            {businessDocs.map(d => <DocItem key={d.slug} {...d} />)}
          </div>
        </div>

        {/* Finanzen Folder */}
        <div className="rounded-[20px] overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#D4662A' }}>
            <span className="text-2xl">📁</span>
            <div>
              <h2 className="font-bold text-white text-base">Finanzen</h2>
              <p className="text-white/60 text-xs">Zahlen & Investitionen</p>
            </div>
          </div>
          <div className="p-3">
            {finanzDocs.map(d => <DocItem key={d.slug} {...d} />)}
          </div>
        </div>
      </div>

      {/* Logos Section */}
      <div className="rounded-[20px] p-6 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Über die Unternehmen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <img src={aventoLogo} alt="Avento" className="rounded-xl object-cover shrink-0" style={{ height: '56px', width: '100px' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Avento Software</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>B2B Software-Plattform für skalierbare Unternehmensprozesse</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src={conserLogo} alt="Conser" className="rounded-xl object-cover shrink-0" style={{ height: '56px', width: '100px' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Conser Market</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Digitaler Marktplatz für professionelle Dienstleistungen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
