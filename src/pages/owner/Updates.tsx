import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Update } from '../../lib/supabase'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'

export default function OwnerUpdates() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [form, setForm] = useState({ title: '', content: '', category: 'general' })
  const [loading, setLoading] = useState(false)

  const fetchUpdates = () => {
    supabase.from('updates').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setUpdates(data as Update[]) })
  }

  useEffect(() => { fetchUpdates() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) return
    setLoading(true)
    try {
      const { error } = await supabase.from('updates').insert([form])
      if (error) throw error
      toast.success('Update veröffentlicht')
      setForm({ title: '', content: '', category: 'general' })
      fetchUpdates()
    } catch { toast.error('Fehler beim Speichern') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('updates').delete().eq('id', id)
    if (error) toast.error('Fehler beim Löschen')
    else { toast.success('Update gelöscht'); fetchUpdates() }
  }

  const categoryColor: Record<string, string> = { general: '#6E6E73', milestone: '#063D3E', important: '#D4662A' }
  const categoryLabel: Record<string, string> = { general: 'Allgemein', milestone: 'Meilenstein', important: 'Wichtig' }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Updates veröffentlichen</h1>

      <form onSubmit={handleSubmit} className="rounded-[20px] p-6 border mb-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Neues Update</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text" placeholder="Titel" required value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <textarea
            placeholder="Inhalt" required value={form.content} rows={4}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border resize-none"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <select
            value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="general">Allgemein</option>
            <option value="milestone">Meilenstein</option>
            <option value="important">Wichtig</option>
          </select>
          <button
            type="submit" disabled={loading}
            className="py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition"
            style={{ background: '#063D3E' }}
          >
            {loading ? 'Wird veröffentlicht…' : 'Update veröffentlichen →'}
          </button>
        </div>
      </form>

      <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Bisherige Updates ({updates.length})</h2>
      <div className="flex flex-col gap-3">
        {updates.map(u => (
          <div key={u.id} className="rounded-[20px] p-5 border flex items-start gap-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${categoryColor[u.category]}20`, color: categoryColor[u.category] }}>
                  {categoryLabel[u.category]}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{new Date(u.created_at).toLocaleDateString('de-DE')}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{u.title}</h3>
              <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{u.content}</p>
            </div>
            <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 transition shrink-0 mt-1">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
