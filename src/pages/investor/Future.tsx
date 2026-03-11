import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { FutureContent } from '../../lib/supabase'

export default function InvestorFuture() {
  const [items, setItems] = useState<FutureContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('future_content').select('*').order('priority')
      .then(({ data }) => { if (data) setItems(data as FutureContent[]); setLoading(false) })
      .then(undefined, () => setLoading(false))
  }, [])

  const features = items.filter(i => i.type === 'feature')
  const markets = items.filter(i => i.type === 'market')
  const phases = items.filter(i => i.type === 'phase')

  const statusColor: Record<string, string> = {
    planned: 'rgba(110,110,115,0.12)',
    in_progress: 'rgba(6,61,62,0.12)',
    live: 'rgba(34,197,94,0.12)',
  }
  const statusTextColor: Record<string, string> = {
    planned: 'var(--text-secondary)',
    in_progress: '#063D3E',
    live: '#16a34a',
  }
  const statusLabel: Record<string, string> = {
    planned: 'Geplant',
    in_progress: 'In Arbeit',
    live: 'Live',
  }

  if (loading) return <div className="p-8 text-center text-secondary">Lädt…</div>

  if (items.length === 0) return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Zukunft & Roadmap</h1>
      <div className="rounded-[20px] p-12 text-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <p className="text-5xl mb-4">🚀</p>
        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Roadmap in Vorbereitung</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Das Gründerteam arbeitet an der Zukunftsplanung. Bald mehr Infos.</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Zukunft & Roadmap</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Vision, Features und Wachstumsmärkte</p>

      {features.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Geplante Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.id} className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2"
                    style={{ background: statusColor[f.status], color: statusTextColor[f.status] }}>
                    {statusLabel[f.status]}
                  </span>
                </div>
                {f.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {markets.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Zielmärkte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {markets.map(m => (
              <div key={m.id} className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{m.title}</h3>
                {m.timeframe && <p className="text-xs font-medium mb-2 text-accent1">{m.timeframe}</p>}
                {m.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {phases.length > 0 && (
        <div>
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Phasen-Roadmap</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {phases.map((p, i) => (
              <div key={p.id} className="flex-1 rounded-[20px] p-5 border relative overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mb-3"
                  style={{ background: i === 0 ? '#063D3E' : i === 1 ? '#D4662A' : '#2d6a4f' }}>
                  {i + 1}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                {p.timeframe && <p className="text-xs font-medium mb-2 text-accent1">{p.timeframe}</p>}
                {p.description && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>}
                <span className="mt-3 inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: statusColor[p.status], color: statusTextColor[p.status] }}>
                  {statusLabel[p.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
