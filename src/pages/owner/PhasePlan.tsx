import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import type { Phase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  Plus, Trash2, CheckCircle, Clock, AlertCircle, Circle,
  ChevronDown, ChevronUp, X, Calendar,
} from 'lucide-react'

/* ─── Status config ─────────────────────────────────────────────── */
const STATUS = {
  planned: {
    label: 'Geplant',
    color: '#8E8E93',
    bg: 'rgba(142,142,147,0.10)',
    circleColor: '#E5E7EB',
    circleBg: '#FFFFFF',
    borderColor: '#E5E7EB',
    icon: Circle,
  },
  in_progress: {
    label: 'In Arbeit',
    color: '#0066FF',
    bg: 'rgba(0,102,255,0.08)',
    circleColor: '#0066FF',
    circleBg: '#0066FF',
    borderColor: '#0066FF',
    icon: Clock,
  },
  completed: {
    label: 'Abgeschlossen',
    color: '#34C759',
    bg: 'rgba(52,199,89,0.10)',
    circleColor: '#34C759',
    circleBg: '#34C759',
    borderColor: '#34C759',
    icon: CheckCircle,
  },
  delayed: {
    label: 'Verzögert',
    color: '#FF9500',
    bg: 'rgba(255,149,0,0.10)',
    circleColor: '#FF9500',
    circleBg: '#FF9500',
    borderColor: '#FF9500',
    icon: AlertCircle,
  },
}
type StatusKey = keyof typeof STATUS

/* ─── Info Tooltip ──────────────────────────────────────────────── */
function InfoTooltip({ text }: { text: string }) {
  const [vis, setVis] = useState(false)
  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setVis(true)}
        onMouseLeave={() => setVis(false)}
        onFocus={() => setVis(true)}
        onBlur={() => setVis(false)}
        className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-white font-bold focus:outline-none shrink-0"
        style={{ background: '#0066FF', fontSize: 10, lineHeight: 1 }}
        aria-label="Info"
      >
        i
      </button>
      {vis && (
        <div
          className="absolute z-50 bottom-full mb-2 px-3 py-2 rounded-xl text-white text-xs pointer-events-none"
          style={{
            background: 'rgba(0,0,0,0.88)',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'normal',
            lineHeight: 1.5,
            width: 240,
            animation: 'tooltip-in 0.18s ease-out forwards',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
          role="tooltip"
        >
          {text}
          <div
            className="absolute top-full"
            style={{
              left: '50%', transform: 'translateX(-50%)',
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid rgba(0,0,0,0.88)',
            }}
          />
        </div>
      )}
    </span>
  )
}

/* ─── Styled input helper ───────────────────────────────────────── */
function Field({
  label, tooltip, required, children,
}: {
  label: string
  tooltip?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center text-sm font-semibold" style={{ color: '#000000' }}>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {tooltip && <InfoTooltip text={tooltip} />}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  height: 44,
  border: '1.5px solid #E5E7EB',
  borderRadius: 8,
  padding: '0 14px',
  fontSize: 15,
  color: '#333333',
  background: '#FFFFFF',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}
const inputFocus = {
  borderColor: '#0066FF',
  boxShadow: '0 0 0 3px rgba(0,102,255,0.10)',
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...(focused ? inputFocus : {}) }}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
    />
  )
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      {...props}
      style={{
        ...inputStyle,
        height: 'auto',
        minHeight: 90,
        padding: '10px 14px',
        resize: 'vertical',
        ...(focused ? inputFocus : {}),
      } as React.CSSProperties}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
    />
  )
}

/* ─── Empty state ───────────────────────────────────────────────── */
function EmptyTimeline({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {/* Illustration: 3 empty circles + dotted line */}
      <div className="flex items-center gap-0 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-sm font-bold"
              style={{ borderColor: '#D1D5DB', color: '#D1D5DB', background: '#F9FAFB' }}
            >
              {i + 1}
            </div>
            {i < 2 && (
              <div className="w-12 border-t-2 border-dashed" style={{ borderColor: '#E5E7EB' }} />
            )}
          </div>
        ))}
      </div>
      <h3 className="text-lg font-bold mb-1.5" style={{ color: '#000000' }}>
        Erstelle deine erste Phase
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: '#666666' }}>
        Organisiere dein Projekt in überschaubare Etappen und behalte den Überblick
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
        style={{ background: '#0066FF', boxShadow: '0 4px 12px rgba(0,102,255,0.30)' }}
      >
        <Plus size={16} />
        Erste Phase hinzufügen
      </button>
    </div>
  )
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function OwnerPhasePlan() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', start_date: '', end_date: '', status: 'planned' as StatusKey,
  })
  const [submitting, setSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const fetchPhases = () =>
    supabase.from('phases').select('*').order('order_index')
      .then(({ data }) => { if (data) setPhases(data as Phase[]) })

  useEffect(() => { fetchPhases() }, [])

  // Close modal on backdrop click
  useEffect(() => {
    if (!showModal) return
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setShowModal(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { error } = await supabase.from('phases').insert([{ ...form, order_index: phases.length }])
      if (error) throw error
      toast.success('Phase gespeichert')
      setForm({ name: '', description: '', start_date: '', end_date: '', status: 'planned' })
      setShowModal(false)
      fetchPhases()
    } catch { toast.error('Fehler beim Speichern') }
    finally { setSubmitting(false) }
  }

  const updateStatus = async (id: string, status: string) => {
    setSavingId(id)
    const { error } = await supabase.from('phases').update({ status }).eq('id', id)
    if (error) toast.error('Fehler')
    else fetchPhases()
    setSavingId(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('phases').delete().eq('id', id)
    if (error) toast.error('Fehler')
    else { toast.success('Phase gelöscht'); fetchPhases() }
  }

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Projektphasen</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666666' }}>Verwalte deinen Projektfahrplan visuell</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 shrink-0"
          style={{ background: '#0066FF', boxShadow: '0 4px 12px rgba(0,102,255,0.28)' }}
        >
          <Plus size={16} />
          Neue Phase
        </button>
      </div>

      {/* Empty state */}
      {phases.length === 0 && (
        <div
          className="rounded-[20px] border"
          style={{ background: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <EmptyTimeline onAdd={() => setShowModal(true)} />
        </div>
      )}

      {/* Timeline */}
      {phases.length > 0 && (
        <div className="space-y-0">

          {/* Progress bar across top */}
          {phases.length > 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2" style={{ color: '#999999' }}>
                <span>Fortschritt</span>
                <span className="font-semibold" style={{ color: '#0066FF' }}>
                  {Math.round((phases.filter(p => p.status === 'completed').length / phases.length) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(phases.filter(p => p.status === 'completed').length / phases.length) * 100}%`,
                    background: 'linear-gradient(90deg, #0066FF, #34C759)',
                  }}
                />
              </div>
            </div>
          )}

          {phases.map((phase, i) => {
            const s = STATUS[phase.status as StatusKey] ?? STATUS.planned
            const StatusIcon = s.icon
            const isExpanded = expandedId === phase.id
            const isLast = i === phases.length - 1

            return (
              <div key={phase.id} className="flex gap-4">

                {/* Timeline column */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 48 }}>
                  {/* Circle */}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer"
                    style={{
                      background: s.circleBg,
                      border: `2.5px solid ${s.circleColor}`,
                      color: phase.status === 'planned' ? '#D1D5DB' : '#FFFFFF',
                      boxShadow: phase.status !== 'planned' ? `0 0 0 4px ${s.color}18` : 'none',
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : phase.id)}
                    title={phase.name}
                  >
                    {phase.status === 'completed'
                      ? <StatusIcon size={18} color="white" />
                      : <span style={{ color: phase.status === 'planned' ? '#D1D5DB' : 'white' }}>{i + 1}</span>
                    }
                  </div>
                  {/* Connecting line */}
                  {!isLast && (
                    <div
                      className="flex-1 w-0.5 mt-1 mb-1"
                      style={{
                        background: phase.status === 'completed'
                          ? '#34C759'
                          : `repeating-linear-gradient(to bottom, #D1D5DB 0 4px, transparent 4px 8px)`,
                        minHeight: 24,
                      }}
                    />
                  )}
                </div>

                {/* Phase card */}
                <div
                  className="flex-1 mb-3 rounded-2xl border overflow-hidden transition-all duration-300 card-enter hover-lift"
                  style={{
                    background: '#FFFFFF',
                    borderColor: isExpanded ? s.circleColor : '#E5E7EB',
                    boxShadow: isExpanded
                      ? `0 4px 16px ${s.color}18, 0 0 0 1px ${s.circleColor}30`
                      : '0 1px 3px rgba(0,0,0,0.06)',
                    borderLeft: `3px solid ${s.circleColor}`,
                  }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-start justify-between gap-3 p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : phase.id)}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm" style={{ color: '#000000' }}>
                            Phase {i + 1}: {phase.name}
                          </h3>
                          <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: s.bg, color: s.color }}
                          >
                            {s.label}
                          </span>
                        </div>
                        {(phase.start_date || phase.end_date) && (
                          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#999999' }}>
                            <Calendar size={11} />
                            {formatDate(phase.start_date)}
                            {phase.start_date && phase.end_date && ' – '}
                            {formatDate(phase.end_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(phase.id) }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} style={{ color: '#FF3B30' }} />
                      </button>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: '#999999' }}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: '#F3F4F6' }}>
                      {phase.description && (
                        <p className="text-sm mt-3 mb-3" style={{ color: '#666666', lineHeight: 1.6 }}>
                          {phase.description}
                        </p>
                      )}
                      {/* Status changer */}
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: '#999999' }}>
                          STATUS ÄNDERN
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(Object.entries(STATUS) as [StatusKey, typeof STATUS[StatusKey]][]).map(([k, v]) => (
                            <button
                              key={k}
                              disabled={savingId === phase.id}
                              onClick={() => updateStatus(phase.id, k)}
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                              style={{
                                background: phase.status === k ? v.bg : '#F9FAFB',
                                color: phase.status === k ? v.color : '#999999',
                                border: `1.5px solid ${phase.status === k ? v.circleColor : '#E5E7EB'}`,
                                opacity: savingId === phase.id ? 0.6 : 1,
                              }}
                            >
                              <v.icon size={12} />
                              {v.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal overlay */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
        >
          <div
            ref={modalRef}
            className="modal-enter w-full max-w-lg rounded-3xl overflow-hidden"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 24px 64px rgba(0,0,0,0.20)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b sticky top-0 z-10"
              style={{ borderColor: '#F3F4F6', background: '#FFFFFF' }}
            >
              <div>
                <h2 className="font-bold text-lg" style={{ color: '#000000' }}>Neue Phase</h2>
                <p className="text-xs mt-0.5" style={{ color: '#999999' }}>Füge eine neue Projektphase hinzu</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              >
                <X size={18} style={{ color: '#666666' }} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

              {/* Phase name */}
              <Field
                label="Phasenname"
                required
                tooltip="Kurzer, prägnanter Name für diese Phase (max. 50 Zeichen)"
              >
                <StyledInput
                  type="text"
                  placeholder="z.B. Konzeptphase, Entwicklung..."
                  value={form.name}
                  maxLength={50}
                  required
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                />
              </Field>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Startdatum"
                  tooltip="Das Startdatum sollte nicht in der Vergangenheit liegen"
                >
                  <StyledInput
                    type="date"
                    value={form.start_date}
                    onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))}
                  />
                </Field>
                <Field
                  label="Enddatum"
                  tooltip="Das Enddatum muss nach dem Startdatum liegen"
                >
                  <StyledInput
                    type="date"
                    value={form.end_date}
                    min={form.start_date || undefined}
                    onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))}
                  />
                </Field>
              </div>

              {/* Status */}
              <Field
                label="Status"
                tooltip="Wähle den aktuellen Stand dieser Phase"
              >
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(STATUS) as [StatusKey, typeof STATUS[StatusKey]][]).map(([k, v]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, status: k }))}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={{
                        background: form.status === k ? v.bg : '#F9FAFB',
                        color: form.status === k ? v.color : '#999999',
                        border: `1.5px solid ${form.status === k ? v.circleColor : '#E5E7EB'}`,
                      }}
                    >
                      <v.icon size={14} />
                      {v.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Description */}
              <Field
                label="Beschreibung"
                tooltip="Optionale Details zu Zielen, Deliverables oder Verantwortlichkeiten"
              >
                <StyledTextarea
                  placeholder="Was soll in dieser Phase erreicht werden?"
                  value={form.description}
                  rows={3}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </Field>

              {/* Divider */}
              <div className="h-px" style={{ background: '#F3F4F6' }} />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border"
                  style={{ background: '#F3F4F6', color: '#000000', borderColor: '#E5E7EB' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#E5E7EB')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F3F4F6')}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.name.trim()}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: '#0066FF',
                    boxShadow: submitting || !form.name.trim() ? 'none' : '0 4px 12px rgba(0,102,255,0.30)',
                  }}
                >
                  {submitting ? 'Wird gespeichert…' : 'Phase hinzufügen →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
