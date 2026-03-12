import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { Update, Document, Phase, PhaseEntry } from '../../lib/supabase'
import { Plus, CheckCircle, Clock, AlertCircle, Circle, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

const STATUS_COLORS: Record<string, string> = {
  planned: '#8E8E93',
  in_progress: '#0066FF',
  completed: '#34C759',
  delayed: '#FF9500',
}
const STATUS_LABELS: Record<string, string> = {
  planned: 'Geplant',
  in_progress: 'In Arbeit',
  completed: 'Abgeschlossen',
  delayed: 'Verzögert',
}
const StatusIcon = ({ status }: { status: string }) => {
  const size = 14
  if (status === 'completed') return <CheckCircle size={size} style={{ color: STATUS_COLORS.completed }} />
  if (status === 'in_progress') return <Clock size={size} style={{ color: STATUS_COLORS.in_progress }} />
  if (status === 'delayed') return <AlertCircle size={size} style={{ color: STATUS_COLORS.delayed }} />
  return <Circle size={size} style={{ color: STATUS_COLORS.planned }} />
}

export default function OwnerDashboard() {
  const [investorCount, setInvestorCount] = useState(0)
  const [updates, setUpdates] = useState<Update[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [intentCount, setIntentCount] = useState(0)

  // Intro-Tool State
  const [phases, setPhases] = useState<Phase[]>([])
  const [entries, setEntries] = useState<PhaseEntry[]>([])
  const [entryForm, setEntryForm] = useState({ title: '', description: '', date: '' })
  const [addingEntry, setAddingEntry] = useState(false)

  const fetchPhases = () => {
    supabase.from('phases').select('*').order('order_index')
      .then(({ data }) => { if (data) setPhases(data as Phase[]) })
  }

  const fetchEntries = () => {
    supabase.from('phase_entries').select('*').order('date', { ascending: false }).limit(10)
      .then(({ data }) => { if (data) setEntries(data as PhaseEntry[]) })
  }

  useEffect(() => {
    supabase.from('investors').select('*', { count: 'exact', head: true })
      .then(({ count }) => { if (count !== null) setInvestorCount(20 + count) })
    supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setUpdates(data) })
    supabase.from('documents').select('id, name, file_path, category').order('id', { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setDocs(data) })
    supabase.from('investment_intents').select('*', { count: 'exact', head: true })
      .then(({ count }) => { if (count) setIntentCount(count) })
    fetchPhases()
    fetchEntries()
  }, [])

  // Eintrag der passenden Phase zuweisen basierend auf Datum
  const assignToPhase = (date: string): string | null => {
    if (!date || phases.length === 0) return null
    const entryDate = new Date(date)
    const match = phases.find(p => {
      if (!p.start_date || !p.end_date) return false
      return entryDate >= new Date(p.start_date) && entryDate <= new Date(p.end_date)
    })
    return match?.id ?? null
  }

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entryForm.title.trim()) return
    setAddingEntry(true)
    try {
      const phaseId = assignToPhase(entryForm.date)
      const { error } = await supabase.from('phase_entries').insert([{
        title: entryForm.title.trim(),
        description: entryForm.description.trim() || null,
        date: entryForm.date || null,
        phase_id: phaseId,
      }])
      if (error) throw error
      toast.success(phaseId
        ? `Eintrag wurde Phase "${phases.find(p => p.id === phaseId)?.name}" zugewiesen`
        : 'Eintrag gespeichert (keine passende Phase gefunden)')
      setEntryForm({ title: '', description: '', date: '' })
      fetchEntries()
    } catch { toast.error('Fehler beim Speichern') }
    finally { setAddingEntry(false) }
  }

  const handleDeleteEntry = async (id: string) => {
    const { error } = await supabase.from('phase_entries').delete().eq('id', id)
    if (error) toast.error('Fehler')
    else { fetchEntries() }
  }

  const getPhaseName = (phaseId: string | null) => {
    if (!phaseId) return null
    return phases.find(p => p.id === phaseId)?.name ?? null
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Owner Dashboard</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Übersicht über alle Aktivitäten</p>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {[
          { label: 'Interessenten', value: investorCount, icon: '👥' },
          { label: 'Investitionsvorschläge', value: intentCount, icon: '💼' },
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

      {/* Letzte Updates + Dokumente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Letzte Updates</h3>
          {updates.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Noch keine Updates</p>
          ) : (
            <div className="flex flex-col gap-2">
              {updates.map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: 'var(--border)' }}>
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
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Noch keine Dokumente</p>
          ) : (
            <div className="flex flex-col gap-2">
              {docs.map(d => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {d.name || d.file_name || d.section || 'Dokument'}
                  </span>
                  <span className="text-xs ml-2 shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                    {d.updated_at ? new Date(d.updated_at).toLocaleDateString('de-DE') : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── INTRO-TOOL / ROADMAP WIDGET ── */}
      <div className="rounded-[24px] border overflow-hidden mb-8"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        {/* Widget Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}>
          <div>
            <h2 className="font-bold text-base text-white">Intro-Tool & Roadmap</h2>
            <p className="text-xs mt-0.5 text-white/70">Phasen-Übersicht und neue Einträge hinzufügen</p>
          </div>
          <span className="text-2xl">🗺️</span>
        </div>

        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Bereich A: Phasen-Übersicht */}
          <div>
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
              Projektphasen
            </h3>
            {phases.length === 0 ? (
              <div className="text-center py-8 rounded-[16px] border border-dashed"
                style={{ borderColor: 'var(--border)' }}>
                <p className="text-2xl mb-2">📋</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Noch keine Phasen angelegt
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Erstelle Phasen unter → Projektphasen
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {phases.map((phase, i) => (
                  <div key={phase.id}
                    className="flex items-start gap-3 p-3 rounded-[14px] border"
                    style={{
                      background: 'var(--surface2)',
                      borderColor: 'var(--border)',
                      borderLeft: `3px solid ${STATUS_COLORS[phase.status] ?? '#8E8E93'}`,
                    }}>
                    <div className="shrink-0 mt-0.5">
                      <StatusIcon status={phase.status} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          Phase {i + 1}: {phase.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{
                            background: `${STATUS_COLORS[phase.status]}15`,
                            color: STATUS_COLORS[phase.status] ?? '#8E8E93',
                          }}>
                          {STATUS_LABELS[phase.status] ?? phase.status}
                        </span>
                      </div>
                      {(phase.start_date || phase.end_date) && (
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          {phase.start_date && new Date(phase.start_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          {phase.start_date && phase.end_date && ' – '}
                          {phase.end_date && new Date(phase.end_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      )}
                      {/* Phase-Einträge */}
                      {entries.filter(e => e.phase_id === phase.id).length > 0 && (
                        <div className="mt-2 flex flex-col gap-1">
                          {entries.filter(e => e.phase_id === phase.id).map(entry => (
                            <div key={entry.id} className="flex items-center justify-between gap-2">
                              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                                · {entry.title}
                                {entry.date && <span style={{ color: 'var(--text-tertiary)' }}>
                                  {' '}({new Date(entry.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })})
                                </span>}
                              </span>
                              <button onClick={() => handleDeleteEntry(entry.id)}
                                className="shrink-0 hover:text-red-500 transition"
                                style={{ color: 'var(--text-tertiary)' }}>
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* Nicht zugeordnete Einträge */}
                {entries.filter(e => !e.phase_id).length > 0 && (
                  <div className="p-3 rounded-[14px] border border-dashed" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Nicht zugeordnet
                    </p>
                    {entries.filter(e => !e.phase_id).map(entry => (
                      <div key={entry.id} className="flex items-center justify-between gap-2">
                        <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          · {entry.title}
                        </span>
                        <button onClick={() => handleDeleteEntry(entry.id)}
                          className="shrink-0 hover:text-red-500 transition"
                          style={{ color: 'var(--text-tertiary)' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bereich B: Neuen Eintrag hinzufügen */}
          <div>
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
              Neuen Eintrag hinzufügen
            </h3>
            <form onSubmit={handleAddEntry} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Titel der Änderung / Ergänzung *
                </label>
                <input
                  type="text"
                  placeholder="z.B. API-Integration abgeschlossen"
                  required
                  value={entryForm.title}
                  onChange={e => setEntryForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Beschreibung / Details
                </label>
                <textarea
                  placeholder="Optional: Weitere Details zum Eintrag…"
                  rows={3}
                  value={entryForm.description}
                  onChange={e => setEntryForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border resize-none"
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Datum (für automatische Phasenzuweisung)
                </label>
                <input
                  type="date"
                  value={entryForm.date}
                  onChange={e => setEntryForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border"
                  style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
                {entryForm.date && phases.length > 0 && (
                  <p className="text-xs mt-1.5 flex items-center gap-1"
                    style={{ color: assignToPhase(entryForm.date) ? '#34C759' : 'var(--text-tertiary)' }}>
                    {assignToPhase(entryForm.date)
                      ? <>✓ Wird zugewiesen: <strong>{getPhaseName(assignToPhase(entryForm.date))}</strong></>
                      : '⚠ Kein Phasen-Zeitraum gefunden — Eintrag wird ohne Zuordnung gespeichert'
                    }
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={addingEntry || !entryForm.title.trim()}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition"
                style={{ background: '#063D3E' }}
              >
                <Plus size={15} />
                {addingEntry ? 'Wird gespeichert…' : 'Zur Roadmap hinzufügen'}
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}
