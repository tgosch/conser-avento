import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Update, Document } from '../../lib/supabase'

export default function OwnerDashboard() {
  const [investorCount, setInvestorCount] = useState(0)
  const [updates, setUpdates] = useState<Update[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [intentCount, setIntentCount] = useState(0)

  useEffect(() => {
    supabase.from('investors').select('*', { count: 'exact', head: true }).then(({ count }) => { if (count !== null) setInvestorCount(20 + count) })
    supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(5).then(({ data }) => { if (data) setUpdates(data) })
    supabase.from('documents').select('id, name, file_path, category').order('id', { ascending: false }).limit(5).then(({ data }) => { if (data) setDocs(data) })
    supabase.from('investment_intents').select('*', { count: 'exact', head: true }).then(({ count }) => { if (count) setIntentCount(count) })
  }, [])

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Owner Dashboard</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Übersicht über alle Aktivitäten</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {[
          { label: 'Interessenten', value: investorCount, icon: '👥' },
          { label: 'Investitionsabsichten', value: intentCount, icon: '💼' },
          { label: 'Aktuelle Phase', value: 'Phase 1', icon: '🚀' },
          { label: 'Updates', value: updates.length, icon: '📢' },
        ].map(s => (
          <div key={s.label} className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Letzte Updates</h3>
          {updates.length === 0 ? (
            <p className="text-xs text-secondary">Noch keine Updates</p>
          ) : (
            <div className="flex flex-col gap-2">
              {updates.map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{u.title}</span>
                  <span className="text-xs ml-2 shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(u.created_at).toLocaleDateString('de-DE')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Zuletzt hochgeladen</h3>
          {docs.length === 0 ? (
            <p className="text-xs text-secondary">Noch keine Dokumente</p>
          ) : (
            <div className="flex flex-col gap-2">
              {docs.map(d => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{d.name || d.file_name || d.section || 'Dokument'}</span>
                  <span className="text-xs ml-2 shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                    {d.updated_at ? new Date(d.updated_at).toLocaleDateString('de-DE') : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
