import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'react-toastify'

interface Stats {
  investorCount: number
  totalVolume: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ investorCount: 0, totalVolume: 0 })
  const [loadingStats, setLoadingStats] = useState(true)
  const [businessExpanded, setBusinessExpanded] = useState(false)
  const [finanzExpanded, setFinanzExpanded] = useState(false)

  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [countResult, volumeResult] = await Promise.all([
          supabase.from('investors').select('*', { count: 'exact', head: true }),
          supabase.from('investment_intents').select('amount'),
        ])
        const totalVolume = (volumeResult.data ?? []).reduce((sum, r) => sum + r.amount, 0)
        setStats({
          investorCount: countResult.count ?? 0,
          totalVolume,
        })
      } catch {
        toast.error('Fehler beim Laden der Statistiken')
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [])

  const firstName = user?.investor?.first_name ?? (user?.isAdmin ? 'Admin' : '')

  return (
    <div className="p-6 md:p-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Guten Tag, {firstName} 👋</h1>
        <p className="text-gray-400 mt-1 text-sm">Willkommen im Investoren-Portal · {today}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {loadingStats ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-card shadow-card p-6 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-3" />
              <div className="h-7 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              label="Registrierte Investoren"
              value={stats.investorCount.toString()}
              icon="👥"
            />
            <StatCard
              label="Investitionsvolumen"
              value={`€ ${stats.totalVolume.toLocaleString('de-DE')}`}
              icon="💰"
            />
            <StatCard
              label="Nächste Milestone"
              value="Q3 2025"
              icon="🎯"
            />
          </>
        )}
      </div>

      {/* Pitch-Deck Hero */}
      <div
        className="rounded-card p-7 mb-6 relative overflow-hidden flex items-center justify-between"
        style={{ background: '#094849' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 right-24 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 text-white"
            style={{ background: '#E5844E' }}
          >
            📊 Pitch-Deck
          </span>
          <h2 className="text-xl font-bold text-white mb-1">Avento & Conser – Unternehmenspräsentation</h2>
          <p className="text-white/60 text-sm max-w-md">
            Vollständige Präsentation inklusive Marktanalyse, Geschäftsmodell und Finanzplanung
          </p>
        </div>

        <a
          href="/dashboard/plans/pitch-deck"
          className="relative z-10 shrink-0 flex items-center gap-2 bg-white text-accent1 rounded-full px-5 py-2.5 font-semibold text-sm hover:bg-opacity-90 transition ml-4"
        >
          Öffnen <ExternalLink size={14} />
        </a>
      </div>

      {/* Business Plan + Finanzplan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Plan */}
        <div className="bg-white rounded-card shadow-card p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-accent1/10 flex items-center justify-center text-xl shrink-0">
              📋
            </div>
            <div>
              <h3 className="font-bold text-text text-lg">Business-Plan</h3>
              <p className="text-gray-400 text-sm mt-0.5">Strategische Planung, Märkte und Wachstumsstrategie</p>
            </div>
          </div>

          <button
            onClick={() => setBusinessExpanded(!businessExpanded)}
            className="flex items-center gap-2 text-sm text-accent1 font-semibold hover:opacity-70 transition"
          >
            {businessExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {businessExpanded ? 'Weniger anzeigen' : 'Mehr Inhalte'}
          </button>

          {businessExpanded && (
            <div className="mt-4 flex flex-col gap-2">
              {[
                { icon: '📈', label: 'Sales Funnel Endkunden', slug: 'sales-funnel-endkunden' },
                { icon: '🏢', label: 'Sales Funnel Business Kunden', slug: 'sales-funnel-business' },
                { icon: '👤', label: 'Persona Endkunde', slug: 'persona-endkunde' },
                { icon: '🤝', label: 'Persona Businesspartner', slug: 'persona-businesspartner' },
                { icon: '📊', label: 'Detaillierte Finanzanalyse', slug: 'finanzanalyse' },
              ].map(item => (
                <a
                  key={item.slug}
                  href={`/dashboard/plans/${item.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg transition text-sm text-text font-medium"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Finanzplan */}
        <div className="bg-white rounded-card shadow-card p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-accent2/10 flex items-center justify-center text-xl shrink-0">
              💵
            </div>
            <div>
              <h3 className="font-bold text-text text-lg">Finanzplan</h3>
              <p className="text-gray-400 text-sm mt-0.5">Investitionsmöglichkeiten, Roadmap und Sicherheiten</p>
            </div>
          </div>

          <button
            onClick={() => setFinanzExpanded(!finanzExpanded)}
            className="flex items-center gap-2 text-sm text-accent1 font-semibold hover:opacity-70 transition"
          >
            {finanzExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {finanzExpanded ? 'Weniger anzeigen' : 'Mehr Inhalte'}
          </button>

          {finanzExpanded && (
            <div className="mt-4 flex flex-col gap-2">
              {[
                { icon: '💵', label: 'Invest & Möglichkeiten', slug: 'invest-moeglichkeiten' },
                { icon: '🗓️', label: 'Roadmap – Kapitalbedarf', slug: 'roadmap-kapital' },
                { icon: '🔐', label: 'Sicherheiten & Treuhänder', slug: 'sicherheiten' },
              ].map(item => (
                <a
                  key={item.slug}
                  href={`/dashboard/plans/${item.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg transition text-sm text-text font-medium"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm text-gray-400 font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold text-accent1">{value}</p>
    </div>
  )
}
