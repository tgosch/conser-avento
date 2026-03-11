import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Update } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function InvestorDashboard() {
  const { user } = useAuth()
  const [updates, setUpdates] = useState<Update[]>([])
  const [investorCount, setInvestorCount] = useState<number>(0)

  const firstName = user?.investor?.first_name || 'Investor'
  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setUpdates(data) })
    supabase.from('investors').select('*', { count: 'exact', head: true })
      .then(({ count }) => { if (count !== null) setInvestorCount(count) })
  }, [])

  const categoryColor: Record<string, string> = {
    general: '#6E6E73',
    milestone: '#063D3E',
    important: '#D4662A',
  }
  const categoryLabel: Record<string, string> = {
    general: 'Allgemein',
    milestone: 'Meilenstein',
    important: 'Wichtig',
  }

  const businessItems = [
    { icon: '📋', label: 'Übersicht', to: '/investor/plans/business-plan' },
    { icon: '📈', label: 'Sales Funnel Endkunden', to: '/investor/plans/sales-funnel-endkunden' },
    { icon: '🏢', label: 'Sales Funnel Business', to: '/investor/plans/sales-funnel-business' },
    { icon: '👤', label: 'Persona Endkunde', to: '/investor/plans/persona-endkunde' },
    { icon: '🤝', label: 'Persona Businesspartner', to: '/investor/plans/persona-businesspartner' },
    { icon: '📉', label: 'Detaillierte Finanzanalyse', to: '/investor/plans/finanzanalyse' },
  ]
  const finanzItems = [
    { icon: '💰', label: 'Übersicht', to: '/investor/plans/finanzplan' },
    { icon: '💵', label: 'Invest & Möglichkeiten', to: '/investor/plans/invest-moeglichkeiten' },
    { icon: '🗓️', label: 'Roadmap Kapital', to: '/investor/plans/roadmap-kapital' },
    { icon: '🔐', label: 'Sicherheiten & Treuhänder', to: '/investor/plans/sicherheiten' },
  ]

  return (
    <div className="max-w-6xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Guten Tag, {firstName} 👋</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Willkommen bei Avento & Conser · {today}</p>
      </div>

      {/* Pitch Deck Hero */}
      <div className="rounded-[24px] p-8 mb-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
        <div className="absolute right-20 bottom-0 w-40 h-40 rounded-full opacity-10" style={{ background: 'white', transform: 'translateY(30%)' }} />
        <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
              📊 Pitch-Deck · Aktuell
            </span>
            <h2 className="text-3xl font-bold text-white mb-1">Avento & Conser</h2>
            <p className="text-white/70 text-sm">Investorenpräsentation · Vision & Wachstumsstrategie</p>
          </div>
          <Link
            to="/investor/plans/pitch-deck"
            className="flex items-center gap-2 px-6 py-3 rounded-[14px] font-semibold text-sm hover:opacity-90 transition shrink-0"
            style={{ background: 'white', color: '#063D3E' }}
          >
            Präsentation öffnen →
          </Link>
        </div>
      </div>

      {/* Updates */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Neuigkeiten vom Team</h2>
        </div>
        {updates.length === 0 ? (
          <div className="rounded-[20px] p-8 text-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-4xl mb-2">📭</p>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Noch keine Updates</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Das Gründerteam wird bald Neuigkeiten teilen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {updates.map(u => (
              <div key={u.id} className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${categoryColor[u.category]}20`, color: categoryColor[u.category] }}>
                    {categoryLabel[u.category]}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(u.created_at).toLocaleDateString('de-DE')}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{u.title}</h3>
                <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{u.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Business-Plan */}
        <div className="rounded-[20px] overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #063D3E' }}>
            <span className="text-xl">📋</span>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Business-Plan</h3>
          </div>
          <div className="p-2">
            {businessItems.map(item => (
              <Link key={item.to} to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface2 transition text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
          <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link to="/investor/plans" className="text-xs font-semibold text-accent1 hover:underline">Alle anzeigen →</Link>
          </div>
        </div>

        {/* Finanzplan */}
        <div className="rounded-[20px] overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '3px solid #D4662A' }}>
            <span className="text-xl">💹</span>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Finanzplan</h3>
          </div>
          <div className="p-2">
            {finanzItems.map(item => (
              <Link key={item.to} to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface2 transition text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
          <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link to="/investor/plans" className="text-xs font-semibold hover:underline" style={{ color: '#D4662A' }}>Alle anzeigen →</Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Registrierte Interessenten', value: investorCount, icon: '👥' },
          { label: 'Investitionsabsichten', value: '–', icon: '💼' },
          { label: 'Aktuelle Phase', value: 'Phase 1', icon: '🚀' },
        ].map(s => (
          <div key={s.label} className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
