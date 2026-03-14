import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Phase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  Plus, Trash2, CheckCircle, Clock, AlertCircle, Circle,
  ChevronDown, X, Calendar, Target, Flag,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────── */
interface Milestone {
  id: string
  phase_id: string
  title: string
  description: string | null
  target_date: string | null
  status: MilestoneStatus
  icon: string | null
  category: string | null
  sort_order: number
  created_at: string
}

type PhaseStatus    = 'planned' | 'in_progress' | 'completed' | 'delayed'
type MilestoneStatus = 'planned' | 'in_progress' | 'completed' | 'delayed' | 'cancelled'

/* ─── Config ─────────────────────────────────────────────────── */
const STATUS_CFG = {
  planned:     { label: 'Geplant',        color: '#8E8E93', bg: 'rgba(142,142,147,0.10)', lineColor: '#E5E7EB' },
  in_progress: { label: 'In Arbeit',      color: '#0066FF', bg: 'rgba(0,102,255,0.08)',   lineColor: '#0066FF' },
  completed:   { label: 'Abgeschlossen',  color: '#34C759', bg: 'rgba(52,199,89,0.10)',   lineColor: '#34C759' },
  delayed:     { label: 'Verzögert',      color: '#FF9500', bg: 'rgba(255,149,0,0.10)',   lineColor: '#FF9500' },
}

const M_STATUS_CFG: Record<MilestoneStatus, { label: string; color: string; bg: string }> = {
  planned:     { label: 'Geplant',    color: '#8E8E93', bg: 'rgba(142,142,147,0.10)' },
  in_progress: { label: 'In Arbeit', color: '#0066FF', bg: 'rgba(0,102,255,0.08)'   },
  completed:   { label: 'Fertig',    color: '#34C759', bg: 'rgba(52,199,89,0.10)'   },
  delayed:     { label: 'Verzögert', color: '#FF9500', bg: 'rgba(255,149,0,0.10)'   },
  cancelled:   { label: 'Abgebrochen', color: '#FF3B30', bg: 'rgba(255,59,48,0.10)' },
}

const CATEGORY_ICONS: Record<string, string> = {
  product: '🛠️', financial: '💰', market: '📊', partnership: '🤝', legal: '⚖️', team: '👥',
}

/* ─── Helpers ────────────────────────────────────────────────── */
function formatDate(d?: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function MilestoneCircle({ status }: { status: MilestoneStatus }) {
  const cfg = M_STATUS_CFG[status]
  if (status === 'completed')
    return <CheckCircle size={14} style={{ color: cfg.color, flexShrink: 0 }} />
  if (status === 'in_progress')
    return <Clock size={14} style={{ color: cfg.color, flexShrink: 0 }} />
  if (status === 'cancelled')
    return <X size={14} style={{ color: cfg.color, flexShrink: 0 }} />
  if (status === 'delayed')
    return <AlertCircle size={14} style={{ color: cfg.color, flexShrink: 0 }} />
  return <Circle size={14} style={{ color: '#D1D5DB', flexShrink: 0 }} />
}

/* ─── Milestone Row ──────────────────────────────────────────── */
function MilestoneRow({
  milestone,
  onStatusChange,
  onDelete,
}: {
  milestone: Milestone
  onStatusChange: (id: string, status: MilestoneStatus) => void
  onDelete: (id: string) => void
}) {
  const [showStatus, setShowStatus] = useState(false)
  const cfg = M_STATUS_CFG[milestone.status]
  const catIcon = milestone.category ? (CATEGORY_ICONS[milestone.category] ?? '📌') : (milestone.icon ?? '📌')

  return (
    <div className="group flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition">
      <button
        onClick={() => setShowStatus(v => !v)}
        className="mt-0.5 shrink-0 relative"
        title="Status ändern"
      >
        <MilestoneCircle status={milestone.status} />
        {showStatus && (
          <div
            className="absolute left-0 top-6 z-20 rounded-xl border shadow-lg p-1 flex flex-col gap-0.5"
            style={{ background: '#FFF', borderColor: '#E5E7EB', minWidth: 140 }}
            onMouseLeave={() => setShowStatus(false)}
          >
            {(Object.entries(M_STATUS_CFG) as [MilestoneStatus, typeof M_STATUS_CFG[MilestoneStatus]][]).map(([k, v]) => (
              <button
                key={k}
                onClick={() => { onStatusChange(milestone.id, k); setShowStatus(false) }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left hover:bg-gray-50 transition"
                style={{ color: v.color }}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{catIcon}</span>
          <p
            className="text-sm font-medium"
            style={{
              color: milestone.status === 'cancelled' ? '#999' : '#000',
              textDecoration: milestone.status === 'cancelled' ? 'line-through' : 'none',
            }}
          >
            {milestone.title}
          </p>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-auto shrink-0"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>
        {milestone.target_date && (
          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#999' }}>
            <Calendar size={10} />
            {formatDate(milestone.target_date)}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(milestone.id)}
        className="opacity-0 group-hover:opacity-100 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-50 transition-all"
        title="Löschen"
      >
        <Trash2 size={11} style={{ color: '#FF3B30' }} />
      </button>
    </div>
  )
}

/* ─── Quick Add Milestone ────────────────────────────────────── */
function AddMilestoneRow({
  phaseId,
  onAdded,
}: {
  phaseId: string
  onAdded: () => void
}) {
  const [title, setTitle] = useState('')
  const [date, setDate]   = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAdd = async () => {
    if (!title.trim()) return
    setSaving(true)
    const { error } = await supabase.from('milestones').insert({
      phase_id: phaseId,
      title: title.trim(),
      target_date: date || null,
      status: 'planned',
      sort_order: 99,
    })
    if (error) toast.error(error.message)
    else { setTitle(''); setDate(''); onAdded() }
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-2 py-2 px-3">
      <Target size={14} style={{ color: '#0066FF', flexShrink: 0 }} />
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
        placeholder="Meilenstein hinzufügen…"
        className="flex-1 text-sm outline-none bg-transparent"
        style={{ color: '#000' }}
        disabled={saving}
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="text-xs outline-none border rounded-lg px-2 py-1"
        style={{ borderColor: '#E5E7EB', color: '#666', background: '#FAFAFA', width: 110 }}
        disabled={saving}
      />
      <button
        onClick={handleAdd}
        disabled={!title.trim() || saving}
        className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition"
        style={{ background: '#0066FF' }}
      >
        {saving ? '…' : '+ Add'}
      </button>
    </div>
  )
}

/* ─── Phase Card ─────────────────────────────────────────────── */
function PhaseCard({
  phase,
  index,
  isLast,
  milestones,
  onStatusChange,
  onDelete,
  onMilestoneStatusChange,
  onMilestoneDelete,
  onMilestoneAdded,
}: {
  phase: Phase
  index: number
  isLast: boolean
  milestones: Milestone[]
  onStatusChange: (id: string, status: PhaseStatus) => void
  onDelete: (id: string) => void
  onMilestoneStatusChange: (id: string, status: MilestoneStatus) => void
  onMilestoneDelete: (id: string) => void
  onMilestoneAdded: () => void
}) {
  const [expanded, setExpanded] = useState(phase.status === 'in_progress')
  const s = STATUS_CFG[phase.status as PhaseStatus] ?? STATUS_CFG.planned

  const completedMs = milestones.filter(m => m.status === 'completed').length
  const totalMs     = milestones.length
  const progress    = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 48 }}>
        {/* Node */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200"
          style={{
            background: phase.status === 'planned' ? '#FFFFFF' : s.lineColor,
            border: `2.5px solid ${s.lineColor}`,
            color: phase.status === 'planned' ? '#D1D5DB' : '#FFFFFF',
            boxShadow: phase.status !== 'planned' ? `0 0 0 4px ${s.color}1A` : 'none',
          }}
        >
          {phase.status === 'completed' ? <CheckCircle size={18} color="white" /> : <span>{index + 1}</span>}
        </button>
        {/* Connector */}
        {!isLast && (
          <div
            className="flex-1 w-0.5 my-1"
            style={{
              minHeight: 24,
              background: phase.status === 'completed'
                ? s.lineColor
                : `repeating-linear-gradient(to bottom, #D1D5DB 0 4px, transparent 4px 8px)`,
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 mb-4 rounded-2xl border overflow-hidden transition-all duration-300"
        style={{
          background: '#FFFFFF',
          borderColor: expanded ? s.lineColor : '#E5E7EB',
          borderLeft: `3px solid ${s.lineColor}`,
          boxShadow: expanded
            ? `0 4px 20px ${s.color}18, 0 0 0 1px ${s.lineColor}22`
            : '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 p-4 cursor-pointer"
          onClick={() => setExpanded(v => !v)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm" style={{ color: '#000' }}>
                Phase {index + 1}: {phase.name}
              </h3>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: s.bg, color: s.color }}
              >
                {s.label}
              </span>
              {totalMs > 0 && (
                <span className="text-[11px] font-medium" style={{ color: '#999' }}>
                  {completedMs}/{totalMs} Meilensteine
                </span>
              )}
            </div>
            {(phase.start_date || phase.end_date) && (
              <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#999' }}>
                <Calendar size={10} />
                {formatDate(phase.start_date)}
                {phase.start_date && phase.end_date && ' – '}
                {formatDate(phase.end_date)}
              </p>
            )}
            {/* Progress bar */}
            {totalMs > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: s.lineColor }}
                  />
                </div>
                <span className="text-[10px] font-bold shrink-0" style={{ color: s.color }}>{progress}%</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={e => { e.stopPropagation(); onDelete(phase.id) }}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition"
            >
              <Trash2 size={13} style={{ color: '#FF3B30' }} />
            </button>
            <div className="w-7 h-7 flex items-center justify-center" style={{ color: '#999' }}>
              <ChevronDown
                size={16}
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
              />
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="border-t" style={{ borderColor: '#F3F4F6' }}>
            {/* Status changer */}
            <div className="px-4 pt-3 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#999' }}>
                Status ändern
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(STATUS_CFG) as [PhaseStatus, typeof STATUS_CFG[PhaseStatus]][]).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => onStatusChange(phase.id, k)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all"
                    style={{
                      background: phase.status === k ? v.bg : '#FAFAFA',
                      color: phase.status === k ? v.color : '#999',
                      borderColor: phase.status === k ? v.color : '#E5E7EB',
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            {phase.description && (
              <div className="px-4 pb-3">
                <p className="text-xs leading-relaxed" style={{ color: '#666' }}>{phase.description}</p>
              </div>
            )}

            {/* Milestones */}
            <div className="border-t" style={{ borderColor: '#F3F4F6' }}>
              {milestones.length > 0 && (
                <div className="px-1 pt-1">
                  {milestones.map(m => (
                    <MilestoneRow
                      key={m.id}
                      milestone={m}
                      onStatusChange={onMilestoneStatusChange}
                      onDelete={onMilestoneDelete}
                    />
                  ))}
                </div>
              )}
              <div className="border-t" style={{ borderColor: '#F9FAFB' }}>
                <AddMilestoneRow phaseId={phase.id} onAdded={onMilestoneAdded} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── New Phase Modal ────────────────────────────────────────── */
function NewPhaseModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: '', description: '', start_date: '', end_date: '', status: 'planned' as PhaseStatus })
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('phases').insert([{
      name: form.name.trim(),
      description: form.description.trim() || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
      order_index: 99,
    }])
    if (error) toast.error(error.message)
    else { toast.success('Phase gespeichert'); onSaved(); onClose() }
    setSaving(false)
  }

  const s = STATUS_CFG[form.status]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
      <div ref={ref} className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#FFF', boxShadow: '0 24px 64px rgba(0,0,0,0.20)', maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: '#F3F4F6' }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: '#000' }}>Neue Phase</h2>
            <p className="text-xs mt-0.5" style={{ color: '#999' }}>Neue Projektphase hinzufügen</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
            <X size={18} style={{ color: '#666' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#333' }}>Phasenname *</label>
            <input type="text" required maxLength={80} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="z.B. Seed Round, MVP Launch…"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#E5E7EB', color: '#000', background: '#FAFAFA' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#333' }}>Startdatum</label>
              <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#E5E7EB', color: '#000', background: '#FAFAFA' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#333' }}>Enddatum</label>
              <input type="date" value={form.end_date} min={form.start_date || undefined}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: '#E5E7EB', color: '#000', background: '#FAFAFA' }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#333' }}>Status</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(STATUS_CFG) as [PhaseStatus, typeof STATUS_CFG[PhaseStatus]][]).map(([k, v]) => (
                <button key={k} type="button" onClick={() => setForm(f => ({ ...f, status: k }))}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    background: form.status === k ? v.bg : '#FAFAFA',
                    color: form.status === k ? v.color : '#999',
                    borderColor: form.status === k ? v.color : '#E5E7EB',
                  }}>
                  <Flag size={13} style={{ color: form.status === k ? v.color : '#CCC' }} />
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#333' }}>Beschreibung</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Ziele & Deliverables dieser Phase…"
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
              style={{ borderColor: '#E5E7EB', color: '#000', background: '#FAFAFA' }} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border"
              style={{ background: '#F3F4F6', color: '#000', borderColor: '#E5E7EB' }}>
              Abbrechen
            </button>
            <button type="submit" disabled={saving || !form.name.trim()}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition"
              style={{ background: s.color, boxShadow: `0 4px 12px ${s.color}40` }}>
              {saving ? 'Speichere…' : 'Phase hinzufügen →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function PhasesAndMilestones() {
  const [phases, setPhases]         = useState<Phase[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [showModal, setShowModal]   = useState(false)

  const fetchAll = async () => {
    const [{ data: pData }, { data: mData }] = await Promise.all([
      supabase.from('phases').select('*').order('order_index'),
      supabase.from('milestones').select('*').order('sort_order'),
    ])
    if (pData) setPhases(pData as Phase[])
    if (mData) setMilestones(mData as Milestone[])
  }

  useEffect(() => { fetchAll() }, [])

  const milestonesForPhase = (phaseId: string) =>
    milestones.filter(m => m.phase_id === phaseId)

  const handlePhaseStatus = async (id: string, status: PhaseStatus) => {
    const { error } = await supabase.from('phases').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else setPhases(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  const handlePhaseDelete = async (id: string) => {
    if (!confirm('Phase + alle Meilensteine löschen?')) return
    const { error } = await supabase.from('phases').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Phase gelöscht'); fetchAll() }
  }

  const handleMilestoneStatus = async (id: string, status: MilestoneStatus) => {
    const { error } = await supabase.from('milestones').update({ status }).eq('id', id)
    if (error) toast.error(error.message)
    else setMilestones(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  const handleMilestoneDelete = async (id: string) => {
    const { error } = await supabase.from('milestones').delete().eq('id', id)
    if (error) toast.error(error.message)
    else setMilestones(prev => prev.filter(m => m.id !== id))
  }

  /* ── Overall progress ── */
  const totalMs     = milestones.length
  const completedMs = milestones.filter(m => m.status === 'completed').length
  const overallPct  = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0
  const completedPhases = phases.filter(p => p.status === 'completed').length

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000' }}>Phasen & Meilensteine</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666' }}>
            {completedPhases}/{phases.length} Phasen · {completedMs}/{totalMs} Meilensteine abgeschlossen
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shrink-0"
          style={{ background: '#0066FF', boxShadow: '0 4px 12px rgba(0,102,255,0.28)' }}
        >
          <Plus size={16} /> Neue Phase
        </button>
      </div>

      {/* Overall progress */}
      {phases.length > 1 && (
        <div
          className="rounded-[18px] p-4 border mb-6"
          style={{ background: '#FFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: '#000' }}>Gesamtfortschritt</p>
            <p className="text-sm font-bold" style={{ color: '#0066FF' }}>{overallPct}%</p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #0066FF, #34C759)' }}
            />
          </div>
          <div className="flex gap-4 mt-3">
            {(Object.entries(STATUS_CFG) as [PhaseStatus, typeof STATUS_CFG[PhaseStatus]][]).map(([k, v]) => {
              const count = phases.filter(p => p.status === k).length
              if (count === 0) return null
              return (
                <div key={k} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: v.lineColor }} />
                  <span className="text-xs" style={{ color: '#666' }}>{count} {v.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {phases.length === 0 && (
        <div className="rounded-[20px] border p-16 text-center" style={{ background: '#FFF', borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-center gap-0 mb-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center">
                <div className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center font-bold"
                  style={{ borderColor: '#D1D5DB', color: '#D1D5DB', background: '#F9FAFB' }}>{i + 1}</div>
                {i < 2 && <div className="w-12 border-t-2 border-dashed" style={{ borderColor: '#E5E7EB' }} />}
              </div>
            ))}
          </div>
          <p className="font-bold text-base mb-1" style={{ color: '#000' }}>Noch keine Phasen</p>
          <p className="text-sm mb-5" style={{ color: '#999' }}>Erstelle die erste Projektphase</p>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold mx-auto"
            style={{ background: '#0066FF', boxShadow: '0 4px 12px rgba(0,102,255,0.30)' }}>
            <Plus size={16} /> Erste Phase hinzufügen
          </button>
        </div>
      )}

      {/* Timeline */}
      {phases.length > 0 && (
        <div>
          {phases.map((phase, i) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={i}
              isLast={i === phases.length - 1}
              milestones={milestonesForPhase(phase.id)}
              onStatusChange={handlePhaseStatus}
              onDelete={handlePhaseDelete}
              onMilestoneStatusChange={handleMilestoneStatus}
              onMilestoneDelete={handleMilestoneDelete}
              onMilestoneAdded={fetchAll}
            />
          ))}
        </div>
      )}

      {showModal && <NewPhaseModal onClose={() => setShowModal(false)} onSaved={fetchAll} />}
    </div>
  )
}
