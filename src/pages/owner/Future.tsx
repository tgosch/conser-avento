import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { FutureContent } from '../../lib/supabase'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'

export default function OwnerFuture() {
  const [items, setItems] = useState<FutureContent[]>([])
  const [form, setForm] = useState({ type: 'feature', title: '', description: '', status: 'planned', timeframe: '' })

  const fetchItems = () => {
    supabase.from('future_content').select('*').order('priority')
      .then(({ data }) => { if (data) setItems(data as FutureContent[]) })
  }

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('future_content').insert([form])
      if (error) throw error
      toast.success('Eintrag gespeichert')
      setForm({ type: 'feature', title: '', description: '', status: 'planned', timeframe: '' })
      fetchItems()
    } catch { toast.error('Fehler beim Speichern') }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('future_content').delete().eq('id', id)
    if (error) toast.error('Fehler')
    else { toast.success('Gelöscht'); fetchItems() }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Zukunft verwalten</h1>

      <form onSubmit={handleSubmit} className="rounded-[20px] p-6 border mb-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Neuen Eintrag hinzufügen</h2>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="feature">Feature</option>
              <option value="market">Zielmarkt</option>
              <option value="phase">Phase</option>
            </select>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="planned">Geplant</option>
              <option value="in_progress">In Arbeit</option>
              <option value="live">Live</option>
            </select>
          </div>
          <input type="text" placeholder="Titel" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input type="text" placeholder="Zeitraum (z.B. Q1 2026)" value={form.timeframe} onChange={e => setForm(p => ({ ...p, timeframe: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <textarea placeholder="Beschreibung" value={form.description} rows={3}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border resize-none"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button type="submit" className="py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition" style={{ background: '#063D3E' }}>
            Hinzufügen →
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id} className="rounded-[20px] p-4 border flex items-center gap-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-surface2" style={{ color: 'var(--text-secondary)' }}>{item.type}</span>
                <span className="text-xs font-medium text-accent1">{item.timeframe}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
              {item.description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>}
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 transition shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
