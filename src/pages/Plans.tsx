import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const businessFolder = [
  { slug: 'pitch-deck',              icon: '📊', label: 'Pitch-Deck',                    available: true },
  { slug: 'business-plan',           icon: '📋', label: 'Business-Plan Übersicht',        available: false },
  { slug: 'sales-funnel-endkunden',  icon: '📈', label: 'Sales Funnel Endkunden',         available: false },
  { slug: 'sales-funnel-business',   icon: '🏢', label: 'Sales Funnel Business Kunden',   available: false },
  { slug: 'persona-endkunde',        icon: '👤', label: 'Persona Endkunde',               available: false },
  { slug: 'persona-businesspartner', icon: '🤝', label: 'Persona Businesspartner',        available: false },
  { slug: 'finanzanalyse',           icon: '📉', label: 'Detaillierte Finanzanalyse',     available: false },
]

const finanzFolder = [
  { slug: 'finanzplan',              icon: '💰', label: 'Finanzplan Übersicht',            available: false },
  { slug: 'invest-moeglichkeiten',   icon: '💵', label: 'Invest & Möglichkeiten',          available: false },
  { slug: 'roadmap-kapital',         icon: '🗓️', label: 'Roadmap Kapital',                available: false },
  { slug: 'sicherheiten',            icon: '🔐', label: 'Sicherheiten & Treuhänder',       available: false },
]

function FolderCard({
  title,
  subtitle,
  items,
  accentColor,
}: {
  title: string
  subtitle: string
  items: typeof businessFolder
  accentColor: string
}) {
  return (
    <div className="bg-surface rounded-card border border-black/5 overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' }}>
      {/* Folder header */}
      <div className="px-6 py-5 flex items-center gap-4" style={{ background: accentColor }}>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">
          {title.includes('Business') ? '📁' : '💼'}
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <p className="text-white/55 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Items */}
      <div className="p-3 flex flex-col gap-0.5">
        {items.map(item => (
          <Link
            key={item.slug}
            to={`/dashboard/plans/${item.slug}`}
            className="flex items-center gap-4 px-4 py-3 rounded-[12px] hover:bg-surface2 transition-all duration-150 group"
          >
            <span className="text-xl w-7 text-center shrink-0">{item.icon}</span>
            <span className="flex-1 text-sm font-medium text-text group-hover:text-text transition">{item.label}</span>
            <span className={`shrink-0 label-tag px-2.5 py-1 rounded-full text-[10px] ${
              item.available
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {item.available ? 'Verfügbar' : 'Kommt bald'}
            </span>
            <ChevronRight size={14} className="text-secondary/30 group-hover:text-secondary transition shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Plans() {
  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Pläne & Dokumente</h1>
        <p className="text-secondary text-sm mt-1">Alle strategischen Dokumente strukturiert nach Bereichen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FolderCard
          title="Business-Plan"
          subtitle="7 Dokumente · Strategie & Märkte"
          items={businessFolder}
          accentColor="#063D3E"
        />
        <FolderCard
          title="Finanzplan"
          subtitle="4 Dokumente · Investition & Kapital"
          items={finanzFolder}
          accentColor="#D4662A"
        />
      </div>
    </div>
  )
}
