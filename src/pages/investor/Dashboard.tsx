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
  const today = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    supabase.from('updates').select('id, title, content, category, created_at').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setUpdates(data) })
    supabase.from('investors').select('id', { count: 'exact', head: true })
      .then(({ count }) => { if (count !== null) setInvestorCount(count) })
  }, [])

  const categoryColor: Record<string, string> = {
    general: '#6E6E73', milestone: '#063D3E', important: '#D4662A',
  }
  const categoryLabel: Record<string, string> = {
    general: 'Allgemein', milestone: 'Meilenstein', important: 'Wichtig',
  }

  const businessItems = [
    { icon: '📋', label: 'Business-Plan', to: '/investor/plans/business-plan' },
    { icon: '📈', label: 'Sales Funnel Endkunden', to: '/investor/plans/sales-funnel-endkunden' },
    { icon: '🏢', label: 'Sales Funnel Business', to: '/investor/plans/sales-funnel-business' },
    { icon: '👤', label: 'Persona Endkunde', to: '/investor/plans/persona-endkunde' },
  ]
  const finanzItems = [
    { icon: '💰', label: 'Finanzplan', to: '/investor/plans/finanzplan' },
    { icon: '💵', label: 'Invest & Möglichkeiten', to: '/investor/plans/invest-moeglichkeiten' },
    { icon: '🗓️', label: 'Roadmap Kapital', to: '/investor/plans/roadmap-kapital' },
    { icon: '🔐', label: 'Sicherheiten & Treuhänder', to: '/investor/plans/sicherheiten' },
  ]

  return (
    <div className="max-w-6xl">

      {/* ── Greeting ── */}
      <div className="mb-5">
        <h1 className="text-xl md:text-3xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          Guten Tag, {firstName} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{today}</p>
      </div>

      {/* ── Pitch Deck Hero ── */}
      <div className="rounded-[20px] p-5 md:p-8 mb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}>
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10" style={{ background: 'white' }} />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            📊 Pitch-Deck · Aktuell
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Avento &amp; Conser</h2>
          <p className="text-white/70 text-sm mb-4">Investorenpräsentation · Vision &amp; Wachstumsstrategie</p>
          <Link
            to="/investor/plans/pitch-deck"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] font-semibold hover:opacity-90 transition"
            style={{ background: 'white', color: '#063D3E', fontSize: '14px' }}
          >
            Präsentation öffnen →
          </Link>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Interessenten', value: investorCount, icon: '👥' },
          { label: 'Investitionsabsichten', value: '–', icon: '💼' },
          { label: 'Phase', value: '1', icon: '🚀' },
        ].map(s => (
          <div key={s.label} className="rounded-[16px] p-3.5 border flex flex-col items-center text-center"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-2xl mb-1">{s.icon}</span>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
            <span className="text-[11px] mt-0.5 leading-tight" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Updates ── */}
      <div className="mb-5">
        <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Neuigkeiten</h2>
        {updates.length === 0 ? (
          <div className="rounded-[16px] p-6 text-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-3xl mb-2">📭</p>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Noch keine Updates</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Das Team teilt bald Neuigkeiten</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3">
            {updates.map(u => (
              <div key={u.id} className="rounded-[16px] p-4 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${categoryColor[u.category]}18`, color: categoryColor[u.category] }}>
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

      {/* ── Dokumente ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business-Plan */}
        <div className="rounded-[18px] overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3.5 flex items-center gap-2.5" style={{ borderBottom: '3px solid #063D3E' }}>
            <span className="text-lg">📋</span>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Business-Plan</h3>
          </div>
          <div className="p-1.5">
            {businessItems.map(item => (
              <Link key={item.to} to={item.to}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition active:bg-surface2"
                style={{ color: 'var(--text-primary)', minHeight: '48px' }}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link to="/investor/plans" className="text-sm font-semibold text-accent1">Alle anzeigen →</Link>
          </div>
        </div>

        {/* Finanzplan */}
        <div className="rounded-[18px] overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3.5 flex items-center gap-2.5" style={{ borderBottom: '3px solid #D4662A' }}>
            <span className="text-lg">💹</span>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Finanzplan</h3>
          </div>
          <div className="p-1.5">
            {finanzItems.map(item => (
              <Link key={item.to} to={item.to}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition active:bg-surface2"
                style={{ color: 'var(--text-primary)', minHeight: '48px' }}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link to="/investor/plans" className="text-sm font-semibold hover:underline" style={{ color: '#D4662A' }}>Alle anzeigen →</Link>
          </div>
        </div>
      </div>

    </div>
  )
}
