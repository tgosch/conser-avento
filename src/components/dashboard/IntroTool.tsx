import { Plus, CheckCircle, Clock, AlertCircle, Circle, Trash2 } from 'lucide-react'
import type { Phase, PhaseEntry } from '../../lib/supabase'

const STATUS_COLORS: Record<string, string> = {
  planned: '#8E8E93', in_progress: '#0066FF', completed: '#34C759', delayed: '#FF9500',
}
const STATUS_LABELS: Record<string, string> = {
  planned: 'Geplant', in_progress: 'In Arbeit', completed: 'Abgeschlossen', delayed: 'Verzögert',
}

function StatusIcon({ status }: { status: string }) {
  const size = 14
  if (status === 'completed') return <CheckCircle size={size} style={{ color: STATUS_COLORS.completed }} />
  if (status === 'in_progress') return <Clock size={size} style={{ color: STATUS_COLORS.in_progress }} />
  if (status === 'delayed') return <AlertCircle size={size} style={{ color: STATUS_COLORS.delayed }} />
  return <Circle size={size} style={{ color: STATUS_COLORS.planned }} />
}

interface Props {
  phases: Phase[]
  entries: PhaseEntry[]
  entryForm: { title: string; description: string; date: string }
  setEntryForm: React.Dispatch<React.SetStateAction<{ title: string; description: string; date: string }>>
  addingEntry: boolean
  onAddEntry: (e: React.FormEvent) => void
  onDeleteEntry: (id: string) => void
  assignToPhase: (date: string) => string | null
  getPhaseName: (phaseId: string | null) => string | null
}

export default function IntroTool({
  phases, entries, entryForm, setEntryForm, addingEntry,
  onAddEntry, onDeleteEntry, assignToPhase, getPhaseName,
}: Props) {
  return (
    <div className="card overflow-hidden animate-fade-up delay-4">
      <div className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)' }}>
        <div>
          <h2 className="font-bold text-sm text-white">Intro-Tool & Roadmap</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Phasen-Übersicht und neue Einträge</p>
        </div>
        <span className="text-2xl">🗺️</span>
      </div>
      <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: Phases list */}
        <div>
          <p className="label-overline mb-3">Phasen</p>
          <div className="flex flex-col gap-2">
            {phases.map(phase => (
              <div key={phase.id} className="card p-3 flex items-center gap-3">
                <StatusIcon status={phase.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{phase.name}</p>
                  {phase.start_date && (
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(phase.start_date).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })}
                      {phase.end_date ? ` – ${new Date(phase.end_date).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })}` : ''}
                    </p>
                  )}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${STATUS_COLORS[phase.status]}18`, color: STATUS_COLORS[phase.status] }}>
                  {STATUS_LABELS[phase.status]}
                </span>
              </div>
            ))}
            {phases.length === 0 && (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Noch keine Phasen angelegt.</p>
            )}
          </div>

          {entries.filter(e => !e.phase_id).length > 0 && (
            <div className="mt-4">
              <p className="label-overline mb-2">Ohne Phase</p>
              <div className="flex flex-col gap-1.5">
                {entries.filter(e => !e.phase_id).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'var(--surface2)' }}>
                    <p className="text-xs font-medium flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{entry.title}</p>
                    <button onClick={() => onDeleteEntry(entry.id)}
                      className="text-red-400 hover:text-red-600 shrink-0 transition">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Add Entry Form */}
        <div>
          <p className="label-overline mb-3">Neuer Eintrag</p>
          <form onSubmit={onAddEntry} className="flex flex-col gap-3">
            <input type="text" placeholder="Titel *" required value={entryForm.title}
              onChange={e => setEntryForm(p => ({ ...p, title: e.target.value }))}
              className="input-base" />
            <textarea placeholder="Beschreibung (optional)" value={entryForm.description} rows={3}
              onChange={e => setEntryForm(p => ({ ...p, description: e.target.value }))}
              className="input-base resize-none" />
            <input type="date" value={entryForm.date}
              onChange={e => setEntryForm(p => ({ ...p, date: e.target.value }))}
              className="input-base" />
            {entryForm.date && phases.length > 0 && (
              <p className="text-xs flex items-center gap-1"
                style={{ color: assignToPhase(entryForm.date) ? '#34C759' : 'var(--text-tertiary)' }}>
                {assignToPhase(entryForm.date)
                  ? <>✓ Wird zugewiesen: <strong>{getPhaseName(assignToPhase(entryForm.date))}</strong></>
                  : '⚠ Kein Phasen-Zeitraum gefunden'}
              </p>
            )}
            <button type="submit" disabled={addingEntry} className="btn btn-primary w-full">
              <Plus size={15} /> {addingEntry ? 'Wird gespeichert…' : 'Eintrag hinzufügen'}
            </button>
          </form>

          {entries.filter(e => e.phase_id).length > 0 && (
            <div className="mt-4">
              <p className="label-overline mb-2">Letzte Einträge</p>
              <div className="flex flex-col gap-1.5">
                {entries.filter(e => e.phase_id).slice(0, 5).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'var(--surface2)' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{entry.title}</p>
                      {entry.date && (
                        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                          {new Date(entry.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </p>
                      )}
                    </div>
                    <button onClick={() => onDeleteEntry(entry.id)}
                      className="text-red-400 hover:text-red-600 shrink-0 transition">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
