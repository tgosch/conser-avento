import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Phase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'

export default function OwnerPhasePlan() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [form, setForm] = useState({ name: '', description: '', start_date: '', end_date: '', status: 'planned' })

  const fetchPhases = () => {
    supabase.from('phases').select('*').order('order_index')
      .then(({ data }) => { if (data) setPhases(data as Phase[]) })
  }

  useEffect(() => { fetchPhases() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('phases').insert([{ ...form, order_index: phases.length }])
      if (error) throw error
      toast.success('Phase gespeichert')
      setForm({ name: '', description: '', start_date: '', end_date: '', status: 'planned' })
      fetchPhases()
    } catch { toast.error('Fehler beim Speichern') }
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('phases').update({ status }).eq('id', id)
    if (error) toast.error('Fehler')
    else fetchPhases()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('phases').delete().eq('id', id)
    if (error) toast.error('Fehler')
    else { toast.success('Phase gelöscht'); fetchPhases() }
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    planned: { bg: 'rgba(110,110,115,0.12)', text: 'var(--text-secondary)' },
    in_progress: { bg: 'rgba(6,61,62,0.12)', text: '#063D3E' },
    completed: { bg: 'rgba(34,197,94,0.12)', text: '#16a34a' },
  }
  const statusLabel: Record<string, string> = { planned: 'Geplant', in_progress: 'In Arbeit', completed: 'Abgeschlossen' }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>PhasenPlan</h1>

      <form onSubmit={handleSubmit} className="rounded-[20px] p-6 border mb-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Neue Phase</h2>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Phasenname" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="planned">Geplant</option>
              <option value="in_progress">In Arbeit</option>
              <option value="completed">Abgeschlossen</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" placeholder="Startdatum" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" placeholder="Enddatum" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <textarea placeholder="Beschreibung (optional)" value={form.description} rows={2}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border resize-none"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button type="submit" className="py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition" style={{ background: '#063D3E' }}>
            Phase hinzufügen →
          </button>
        </div>
      </form>

      {/* Gantt-style Timeline */}
      {phases.length > 0 && (
        <div>
          <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Timeline</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />
            <div className="flex flex-col gap-4">
              {phases.map((p, i) => (
                <div key={p.id} className="flex gap-4">
                  <div className="w-16 flex items-start justify-center pt-3 shrink-0">
                    <div
                      className="w-4 h-4 rounded-full border-2 z-10"
                      style={{
                        background: p.status === 'completed' ? '#16a34a' : p.status === 'in_progress' ? '#063D3E' : 'var(--surface)',
                        borderColor: p.status === 'completed' ? '#16a34a' : p.status === 'in_progress' ? '#063D3E' : 'var(--border)',
                      }}
                    />
                  </div>
                  <div className="flex-1 rounded-[20px] p-5 border mb-2" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          Phase {i + 1}: {p.name}
                        </h3>
                        {(p.start_date || p.end_date) && (
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {p.start_date && new Date(p.start_date).toLocaleDateString('de-DE')}
                            {p.start_date && p.end_date && ' – '}
                            {p.end_date && new Date(p.end_date).toLocaleDateString('de-DE')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={p.status}
                          onChange={e => updateStatus(p.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-lg outline-none border"
                          style={{ background: statusColors[p.status]?.bg, color: statusColors[p.status]?.text, borderColor: 'var(--border)' }}
                        >
                          {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {p.description && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
