import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Update } from '../../lib/supabase'
import { toast } from 'react-toastify'

export default function InvestorStatus() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUpdates = () => {
    supabase.from('updates').select('id, title, content, category, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { toast.error('Updates konnten nicht geladen werden.') }
        if (data) setUpdates(data as Update[])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUpdates()
    const channel = supabase.channel('investor-status-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, () => fetchUpdates())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const categoryColor: Record<string, string> = {
    general: '#6E6E73', milestone: '#063D3E', important: '#D4662A',
  }
  const categoryLabel: Record<string, string> = {
    general: 'Allgemein', milestone: 'Meilenstein', important: 'Wichtig',
  }
  const categoryStrip: Record<string, string> = {
    general: 'strip-neutral',
    milestone: 'strip-success',
    important: 'strip-warning',
  }

  return (
    <div className="max-w-3xl animate-fade-up">
      <div className="flex items-center gap-3 flex-wrap mb-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Aktueller Stand</h1>
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shrink-0"
          style={{ background: '#063D3E' }}>Phase 1</span>
      </div>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Status-Updates und Meilensteine vom Gründerteam
      </p>

      {/* ERGÄNZUNG 1 — Status-Banner */}
      <div className="card p-4 mb-6 flex items-center gap-3 animate-fade-up"
           style={{ background: 'rgba(52,199,89,0.08)', border: '1px solid rgba(52,199,89,0.2)' }}>
        <span className="text-xl shrink-0">✅</span>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Aktuelle Phase: Phase 1 — Finanzierungsrunde läuft
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Das Team arbeitet an Avento MVP · Conser-Integration · Seed-Runde Q2 2026
          </p>
        </div>
        {updates[0] && (
          <div className="text-right shrink-0">
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Letztes Update:<br/>
              {new Date(updates[0].created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-[20px] h-24 animate-pulse" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      ) : updates.length === 0 ? (
        /* ERGÄNZUNG 3 — Besserer Empty State */
        <div className="card p-12 text-center">
          <span className="text-5xl block mb-4">📭</span>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
            Noch keine Updates
          </h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            Das Gründerteam wird hier regelmäßig über Meilensteine und Entwicklungen berichten.
          </p>
          <Link to="/investor/chat"
            className="btn btn-primary">
            Direktfrage an Torben stellen →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {updates.map(u => (
            /* ERGÄNZUNG 2 — Farbiger Left-Border */
            <div key={u.id}
              className={`rounded-[20px] p-5 border ${categoryStrip[u.category] ?? 'status-strip-neutral'}`}
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
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
