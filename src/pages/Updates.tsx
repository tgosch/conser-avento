import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Update } from '../lib/supabase'

const categoryStyle = {
  general:   { label: 'Allgemein',   bg: 'bg-gray-100',   text: 'text-gray-500' },
  milestone: { label: 'Meilenstein', bg: 'bg-green-100',  text: 'text-green-700' },
  important: { label: 'Wichtig',     bg: 'bg-orange-100', text: 'text-orange-700' },
}

export default function Updates() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('updates').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUpdates((data ?? []) as Update[]); setLoading(false) })
  }, [])

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <nav className="flex items-center gap-1.5 text-xs text-secondary mb-6">
        <Link to="/dashboard" className="hover:text-accent1 transition">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-text font-medium">Alle Updates</span>
      </nav>

      <h1 className="text-3xl font-bold text-text mb-2">Updates vom Team</h1>
      <p className="text-secondary text-sm mb-8">Neuigkeiten, Meilensteine und wichtige Hinweise</p>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-card p-6 animate-pulse shadow-sm2 border border-black/5">
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : updates.length === 0 ? (
        <div className="bg-surface rounded-card p-12 text-center shadow-sm2 border border-black/5">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-secondary text-sm">Noch keine Updates vorhanden</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {updates.map(u => {
            const style = categoryStyle[u.category] ?? categoryStyle.general
            return (
              <div key={u.id} className="bg-surface rounded-card p-6 shadow-sm2 border border-black/5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`label-tag px-2.5 py-1 rounded-full text-xs ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                  <span className="text-xs text-secondary">
                    {new Date(u.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-bold text-text text-base mb-2">{u.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{u.content}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
