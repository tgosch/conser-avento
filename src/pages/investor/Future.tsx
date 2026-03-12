import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { FutureContent } from '../../lib/supabase'
import { CheckCircle, Clock, Zap } from 'lucide-react'

const STATIC_TIMELINE = [
  {
    id: 'past-1',
    phase: 'Vergangenheit',
    date: 'Q3 2024',
    title: 'Ideenfindung & Konzept',
    description: 'Entwicklung der Geschäftsidee für den digitalen Baustoffmarktplatz. Erste Marktanalysen und Wettbewerbsrecherche.',
    status: 'live' as const,
    icon: '💡',
    era: 'past',
  },
  {
    id: 'past-2',
    phase: 'Vergangenheit',
    date: 'Q4 2024',
    title: 'Gründung & Team',
    description: 'Gründung der Conser GmbH. Torben Gosch (CEO), Martin Groote (CTO) und Paul Bockting (CDO) bilden das Kernteam.',
    status: 'live' as const,
    icon: '🤝',
    era: 'past',
  },
  {
    id: 'past-3',
    phase: 'Vergangenheit',
    date: 'Q1 2025',
    title: 'Entwicklungsstart',
    description: 'Code Ara GmbH tritt als strategischer Entwicklungspartner bei. MVP-Entwicklung beginnt. Design System wird festgelegt.',
    status: 'live' as const,
    icon: '🚀',
    era: 'past',
  },
  {
    id: 'now-1',
    phase: 'Gegenwart',
    date: 'Q1–Q2 2025',
    title: 'Platform-Entwicklung',
    description: 'Aktive Entwicklung der B2B-Plattform. Investor-Portal live. Avento GmbH in Gründung. Erste Beta-Partner onboarding.',
    status: 'in_progress' as const,
    icon: '⚙️',
    era: 'now',
  },
  {
    id: 'future-1',
    phase: 'Zukunft',
    date: 'Q3 2025',
    title: 'Beta-Launch',
    description: 'Soft-Launch mit ausgewählten Beta-Nutzern. Feedback-Zyklus und Produktoptimierung. Erste Umsätze erwartet.',
    status: 'planned' as const,
    icon: '🧪',
    era: 'future',
  },
  {
    id: 'future-2',
    phase: 'Zukunft',
    date: 'Q4 2025',
    title: 'Market-Launch',
    description: 'Offizieller Launch auf www.conser-avento.de. Marketing-Kampagne. Onboarding erster zahlender Kunden.',
    status: 'planned' as const,
    icon: '🎯',
    era: 'future',
  },
  {
    id: 'future-3',
    phase: 'Zukunft',
    date: 'Q2 2026',
    title: 'DACH-Expansion',
    description: 'Expansion auf Deutschland, Österreich und Schweiz. Strategische Partnerschaften mit Bauträgern und Großhändlern.',
    status: 'planned' as const,
    icon: '🌍',
    era: 'future',
  },
]

const ERA_CONFIG = {
  past: { label: 'Vergangenheit', color: '#6E6E73', bg: 'rgba(110,110,115,0.10)', line: '#D1D1D6' },
  now: { label: 'Gegenwart', color: '#063D3E', bg: 'rgba(6,61,62,0.10)', line: '#063D3E' },
  future: { label: 'Zukunft', color: '#D4662A', bg: 'rgba(212,102,42,0.10)', line: '#D4662A' },
}

function StatusIcon({ status }: { status: 'live' | 'in_progress' | 'planned' }) {
  if (status === 'live') return <CheckCircle size={16} style={{ color: '#34C759' }} />
  if (status === 'in_progress') return <Zap size={16} style={{ color: '#063D3E' }} />
  return <Clock size={16} style={{ color: '#D4662A' }} />
}

const STATUS_LABEL = { live: 'Abgeschlossen', in_progress: 'Aktuell', planned: 'Geplant' }
const STATUS_COLOR = { live: '#34C759', in_progress: '#063D3E', planned: '#D4662A' }
const STATUS_BG = {
  live: 'rgba(52,199,89,0.12)',
  in_progress: 'rgba(6,61,62,0.12)',
  planned: 'rgba(212,102,42,0.12)',
}

export default function InvestorFuture() {
  const [items, setItems] = useState<FutureContent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'past' | 'now' | 'future'>('all')

  useEffect(() => {
    supabase.from('future_content').select('*').order('priority')
      .then(({ data }) => { if (data) setItems(data as FutureContent[]); setLoading(false) }, () => setLoading(false))
  }, [])

  const dbPhases = items.filter(i => i.type === 'phase')
  const dbFeatures = items.filter(i => i.type === 'feature')
  const dbMarkets = items.filter(i => i.type === 'market')

  const filteredTimeline = filter === 'all'
    ? STATIC_TIMELINE
    : STATIC_TIMELINE.filter(t => t.era === filter)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: '#063D3E' }} />
    </div>
  )

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Zukunft & Stand</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Timeline, Roadmap & Vision</p>

      {/* ── Era filter ── */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {([
          { key: 'all', label: 'Alle' },
          { key: 'past', label: 'Vergangenheit' },
          { key: 'now', label: 'Gegenwart' },
          { key: 'future', label: 'Zukunft' },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: filter === f.key ? '#063D3E' : 'var(--surface)',
              color: filter === f.key ? 'white' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: filter === f.key ? '#063D3E' : 'var(--border)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Interactive Timeline ── */}
      <div className="relative mb-10">
        {/* Vertical line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-0.5"
          style={{ background: 'linear-gradient(180deg, #D1D1D6 0%, #063D3E 40%, #D4662A 100%)' }}
        />

        <div className="flex flex-col gap-0">
          {filteredTimeline.map((item) => {
            const cfg = ERA_CONFIG[item.era as keyof typeof ERA_CONFIG]
            const isNow = item.era === 'now'

            return (
              <div key={item.id} className="relative pl-16 pb-8">
                {/* Node */}
                <div
                  className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md"
                  style={{
                    background: isNow ? '#063D3E' : 'var(--surface)',
                    border: `2px solid ${cfg.line}`,
                    zIndex: 1,
                    top: '0',
                    boxShadow: isNow ? '0 0 0 4px rgba(6,61,62,0.15)' : 'none',
                  }}
                >
                  {item.icon}
                </div>

                {/* Card */}
                <div
                  className={`rounded-[18px] p-5 border transition-all duration-200 ${isNow ? 'shadow-md' : ''}`}
                  style={{
                    background: isNow ? 'rgba(6,61,62,0.04)' : 'var(--surface)',
                    borderColor: isNow ? '#063D3E' : 'var(--border)',
                    borderWidth: isNow ? '2px' : '1px',
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: cfg.bg, color: cfg.color }}>
                          {item.phase}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.date}</span>
                      </div>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <StatusIcon status={item.status} />
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: STATUS_BG[item.status], color: STATUS_COLOR[item.status] }}>
                        {STATUS_LABEL[item.status]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── DB-Features (if available) ── */}
      {dbFeatures.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Geplante Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dbFeatures.map(f => (
              <div key={f.id} className="rounded-[18px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2"
                    style={{ background: STATUS_BG[f.status as keyof typeof STATUS_BG], color: STATUS_COLOR[f.status as keyof typeof STATUS_COLOR] }}>
                    {STATUS_LABEL[f.status as keyof typeof STATUS_LABEL]}
                  </span>
                </div>
                {f.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DB-Markets (if available) ── */}
      {dbMarkets.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Zielmärkte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dbMarkets.map(m => (
              <div key={m.id} className="rounded-[18px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{m.title}</h3>
                {m.timeframe && <p className="text-xs font-medium mb-2" style={{ color: '#063D3E' }}>{m.timeframe}</p>}
                {m.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DB-Phases (if available) ── */}
      {dbPhases.length > 0 && (
        <div>
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Phasen-Roadmap</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {dbPhases.map((p, idx) => (
              <div key={p.id} className="flex-1 rounded-[18px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mb-3"
                  style={{ background: idx === 0 ? '#063D3E' : idx === 1 ? '#D4662A' : '#2d6a4f' }}>
                  {idx + 1}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                {p.timeframe && <p className="text-xs font-medium mb-2" style={{ color: '#063D3E' }}>{p.timeframe}</p>}
                {p.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
