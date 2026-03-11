import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Update } from '../lib/supabase'
import { toast } from 'react-toastify'

interface Stats { investorCount: number; totalVolume: number }

const categoryStyle = {
  general:   { label: 'Allgemein',  bg: 'bg-gray-100',  text: 'text-gray-500' },
  milestone: { label: 'Meilenstein', bg: 'bg-green-100', text: 'text-green-700' },
  important: { label: 'Wichtig',    bg: 'bg-orange-100', text: 'text-orange-700' },
}

const businessItems = [
  { slug: 'pitch-deck',               icon: '📊', label: 'Pitch-Deck' },
  { slug: 'sales-funnel-endkunden',   icon: '📈', label: 'Sales Funnel Endkunden' },
  { slug: 'sales-funnel-business',    icon: '🏢', label: 'Sales Funnel Business' },
  { slug: 'persona-endkunde',         icon: '👤', label: 'Persona Endkunde' },
  { slug: 'persona-businesspartner',  icon: '🤝', label: 'Persona Businesspartner' },
  { slug: 'finanzanalyse',            icon: '📉', label: 'Detaillierte Finanzanalyse' },
]

const finanzItems = [
  { slug: 'finanzplan',               icon: '💹', label: 'Übersicht' },
  { slug: 'invest-moeglichkeiten',    icon: '💵', label: 'Invest & Möglichkeiten' },
  { slug: 'roadmap-kapital',          icon: '🗓️', label: 'Roadmap Kapital' },
  { slug: 'sicherheiten',             icon: '🔐', label: 'Sicherheiten & Treuhänder' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ investorCount: 0, totalVolume: 0 })
  const [updates, setUpdates] = useState<Update[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUpdates, setLoadingUpdates] = useState(true)

  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const firstName = user?.investor?.first_name ?? (user?.isAdmin ? 'Admin' : '')

  useEffect(() => {
    Promise.all([
      supabase.from('investors').select('*', { count: 'exact', head: true }),
      supabase.from('investment_intents').select('amount'),
    ]).then(([countRes, volRes]) => {
      setStats({
        investorCount: countRes.count ?? 0,
        totalVolume: (volRes.data ?? []).reduce((s, r) => s + r.amount, 0),
      })
      setLoadingStats(false)
    }).catch(() => { toast.error('Fehler beim Laden'); setLoadingStats(false) })

    supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => { setUpdates((data ?? []) as Update[]); setLoadingUpdates(false) })
  }, [])

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Guten Tag, {firstName} 👋</h1>
        <p className="text-secondary text-sm mt-1">{today} · Willkommen im Investoren-Portal</p>
      </div>

      {/* A) PITCH-DECK HERO */}
      <div
        className="rounded-card p-8 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-14 right-32 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 right-64 w-24 h-24 rounded-full bg-white/5 pointer-events-none" style={{ transform: 'translateY(-50%)' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <span className="inline-block label-tag px-3 py-1 rounded-full text-white mb-4" style={{ background: 'rgba(212,102,42,0.8)' }}>
              📊 Pitch-Deck · Investorenpräsentation
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">Avento & Conser</h2>
            <p className="text-white/65 text-sm max-w-md leading-relaxed">
              Unsere Vision, das Geschäftsmodell und die Wachstumsstrategie im vollständigen Überblick
            </p>
          </div>
          <Link
            to="/dashboard/plans/pitch-deck"
            className="shrink-0 flex items-center gap-2 bg-white text-accent1 rounded-btn px-6 py-3 font-semibold text-sm hover:bg-surface2 transition shadow-sm2"
          >
            Präsentation öffnen <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* B) UPDATES */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text">Aktuelle Updates vom Team</h2>
          <Link to="/dashboard/updates" className="flex items-center gap-1 text-accent1 text-sm font-semibold hover:opacity-70 transition">
            Alle Updates <ExternalLink size={13} />
          </Link>
        </div>

        {loadingUpdates ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-card p-5 animate-pulse shadow-sm2">
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : updates.length === 0 ? (
          <div className="bg-surface rounded-card p-8 text-center shadow-sm2 border border-black/5">
            <p className="text-secondary text-sm">Keine Updates vorhanden</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {updates.map(u => {
              const style = categoryStyle[u.category] ?? categoryStyle.general
              return (
                <div key={u.id} className="bg-surface rounded-card p-5 shadow-sm2 border border-black/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`label-tag px-2.5 py-1 rounded-full text-xs ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                    <span className="text-xs text-secondary">
                      {new Date(u.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-text text-sm">{u.title}</h3>
                  <p className="text-secondary text-xs leading-relaxed line-clamp-3">{u.content}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* C) BUSINESS-PLAN | FINANZPLAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Business Plan */}
        <div className="bg-surface rounded-card shadow-sm2 border border-black/5 overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#063D3E' }}>
            <span className="text-xl">📋</span>
            <div>
              <h3 className="font-bold text-white text-base">Business-Plan</h3>
              <p className="text-white/50 text-xs">Strategie & Markt</p>
            </div>
          </div>
          <div className="p-2">
            {businessItems.map(item => (
              <Link
                key={item.slug}
                to={`/dashboard/plans/${item.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-surface2 transition group"
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                <span className="flex-1 text-sm text-text font-medium group-hover:text-accent1 transition">{item.label}</span>
                <ChevronRight size={14} className="text-secondary/40 group-hover:text-accent1 transition" />
              </Link>
            ))}
            <Link
              to="/dashboard/plans"
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-accent1 hover:opacity-70 transition mt-1"
            >
              Alle anzeigen <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Finanzplan */}
        <div className="bg-surface rounded-card shadow-sm2 border border-black/5 overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#D4662A' }}>
            <span className="text-xl">💰</span>
            <div>
              <h3 className="font-bold text-white text-base">Finanzplan</h3>
              <p className="text-white/50 text-xs">Investition & Kapital</p>
            </div>
          </div>
          <div className="p-2">
            {finanzItems.map(item => (
              <Link
                key={item.slug}
                to={`/dashboard/plans/${item.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-surface2 transition group"
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                <span className="flex-1 text-sm text-text font-medium group-hover:text-accent2 transition">{item.label}</span>
                <ChevronRight size={14} className="text-secondary/40 group-hover:text-accent2 transition" />
              </Link>
            ))}
            <Link
              to="/dashboard/plans"
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-accent2 hover:opacity-70 transition mt-1"
            >
              Alle anzeigen <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* D) QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loadingStats ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-card p-6 shadow-sm2 animate-pulse border border-black/5">
              <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
              <div className="h-7 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : (
          <>
            <StatCard icon="👥" label="Registrierte Investoren" value={stats.investorCount.toString()} />
            <StatCard icon="💰" label="Investitionsvolumen" value={`€ ${stats.totalVolume.toLocaleString('de-DE')}`} />
            <StatCard icon="🎯" label="Nächste Milestone" value="Q3 2025" highlight />
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-card p-6 border border-black/5 ${highlight ? 'bg-accent1' : 'bg-surface shadow-sm2'}`}>
      <p className={`text-xs font-semibold mb-3 flex items-center gap-2 ${highlight ? 'text-white/60' : 'text-secondary'}`}>
        <span className="text-lg">{icon}</span>
        {label}
      </p>
      <p className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-accent1'}`}>{value}</p>
    </div>
  )
}
