import { useNavigate } from 'react-router-dom'

const plans = [
  { slug: 'pitch-deck', icon: '📊', label: 'Pitch-Deck', desc: 'Vollständige Unternehmenspräsentation', color: 'accent1' },
  { slug: 'business-plan', icon: '📋', label: 'Business-Plan', desc: 'Strategische Planung und Märkte', color: 'accent1' },
  { slug: 'finanzplan', icon: '💹', label: 'Finanzplan', desc: 'Finanzierungsübersicht und Prognosen', color: 'accent2' },
  { slug: 'sales-funnel-endkunden', icon: '📈', label: 'Sales Funnel Endkunden', desc: 'Verkaufsstrategie für Endkunden', color: 'accent1' },
  { slug: 'sales-funnel-business', icon: '🏢', label: 'Sales Funnel Business', desc: 'B2B Verkaufsstrategie', color: 'accent2' },
  { slug: 'persona-endkunde', icon: '👤', label: 'Persona Endkunde', desc: 'Zielgruppen-Profil Endkunden', color: 'accent1' },
  { slug: 'persona-businesspartner', icon: '🤝', label: 'Persona Businesspartner', desc: 'Zielgruppen-Profil B2B', color: 'accent2' },
  { slug: 'finanzanalyse', icon: '📊', label: 'Detaillierte Finanzanalyse', desc: 'Tiefgehende Finanzauswertung', color: 'accent1' },
  { slug: 'invest-moeglichkeiten', icon: '💵', label: 'Invest & Möglichkeiten', desc: 'Investitionsoptionen und Rendite', color: 'accent2' },
  { slug: 'roadmap-kapital', icon: '🗓️', label: 'Roadmap Kapital', desc: 'Kapitalbedarf-Planung', color: 'accent1' },
  { slug: 'sicherheiten', icon: '🔐', label: 'Sicherheiten & Treuhänder', desc: 'Rechtliche Absicherung', color: 'accent2' },
]

export default function Plans() {
  const navigate = useNavigate()

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Pläne & Dokumente</h1>
        <p className="text-gray-400 mt-1 text-sm">Alle strategischen Dokumente und Analysen auf einen Blick</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map(plan => (
          <button
            key={plan.slug}
            onClick={() => navigate(`/dashboard/plans/${plan.slug}`)}
            className="bg-white rounded-card shadow-card p-6 text-left hover:shadow-lg transition-shadow group relative overflow-hidden"
          >
            {/* Top border accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 rounded-t-card ${plan.color === 'accent1' ? 'bg-accent1' : 'bg-accent2'}`}
            />

            {/* Tag */}
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 mt-1 ${
                plan.color === 'accent1'
                  ? 'bg-accent1/10 text-accent1'
                  : 'bg-accent2/10 text-accent2'
              }`}
            >
              {plan.color === 'accent1' ? 'Strategie' : 'Finanzen'}
            </span>

            <div className="text-3xl mb-3">{plan.icon}</div>
            <h3 className="font-bold text-text text-lg mb-1 group-hover:text-accent1 transition-colors">
              {plan.label}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>

            <span className="inline-block text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-400 rounded-full">
              Inhalt folgt
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
