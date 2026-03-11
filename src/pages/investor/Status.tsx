import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Update } from '../../lib/supabase'

export default function InvestorStatus() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('updates').select('id, title, content, category, created_at').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[Status]', error.message)
        if (data) setUpdates(data as Update[])
        setLoading(false)
      })
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

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 flex-wrap mb-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Aktueller Stand</h1>
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shrink-0" style={{ background: '#063D3E' }}>Phase 1</span>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Status-Updates und Meilensteine vom Gründerteam</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-[20px] h-24 animate-pulse" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      ) : updates.length === 0 ? (
        <div className="rounded-[20px] p-12 text-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-5xl mb-4">📊</p>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Noch keine Updates</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Das Team wird bald Status-Updates teilen.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {updates.map(u => (
            <div key={u.id} className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: `${categoryColor[u.category]}20`, color: categoryColor[u.category] }}>
                  {categoryLabel[u.category]}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {new Date(u.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{u.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{u.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
