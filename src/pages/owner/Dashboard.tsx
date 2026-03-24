import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { Update, Document, Phase, PhaseEntry } from '../../lib/supabase'
import { Plus, CheckCircle, Clock, AlertCircle, Circle, Trash2, ChevronRight, MessageSquare, Bell, Handshake } from 'lucide-react'
import { toast } from 'react-toastify'

const STATUS_COLORS: Record<string, string> = {
  planned: '#8E8E93', in_progress: '#0066FF', completed: '#34C759', delayed: '#FF9500',
}
const STATUS_LABELS: Record<string, string> = {
  planned: 'Geplant', in_progress: 'In Arbeit', completed: 'Abgeschlossen', delayed: 'Verzögert',
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
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [partnerCount, setPartnerCount] = useState(0)
  const [docCount, setDocCount] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)

  // Intro-Tool State
  const [phases, setPhases] = useState<Phase[]>([])
  const [entries, setEntries] = useState<PhaseEntry[]>([])
  const [entryForm, setEntryForm] = useState({ title: '', description: '', date: '' })
  const [addingEntry, setAddingEntry] = useState(false)

  const fetchPhases = () => {
    supabase.from('phases').select('*').order('order_index')
      .then(({ data, error }) => {
        if (error) { toast.error('Phasen laden fehlgeschlagen'); return }
        if (data) setPhases(data as Phase[])
      })
  }
  const fetchEntries = () => {
    supabase.from('phase_entries').select('*').order('date', { ascending: false }).limit(10)
      .then(({ data, error }) => {
        if (error) { toast.error('Eintraege laden fehlgeschlagen'); return }
        if (data) setEntries(data as PhaseEntry[])
      })
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [inv, upd, doc, intent, msg, partner, docCnt] = await Promise.all([
          supabase.from('investors').select('*', { count: 'exact', head: true }),
          supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('documents').select('id, name, file_path, category').order('id', { ascending: false }).limit(5),
          supabase.from('investment_intents').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }).eq('from_admin', false),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
          supabase.from('documents').select('id', { count: 'exact', head: true }),
        ])
        if (inv.count !== null) setInvestorCount(20 + (inv.count ?? 0))
        if (upd.data) setUpdates(upd.data)
        if (doc.data) setDocs(doc.data)
        if (intent.count) setIntentCount(intent.count)
        if (msg.count !== null) setUnreadMessages(msg.count ?? 0)
        if (partner.count !== null) setPartnerCount(partner.count ?? 0)
        if (docCnt.count !== null) setDocCount(docCnt.count ?? 0)
      } catch {
        toast.error('Dashboard-Daten konnten nicht geladen werden')
      } finally {
        setPageLoading(false)
      }
    }
    load()
    fetchPhases()
    fetchEntries()
  }, [])

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

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
  const today = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

  if (pageLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">

      {/* GREETING */}
      <div className="mb-6">
        <p className="label-overline mb-1">{today}</p>
        <h1 className="font-bold text-2xl md:text-3xl mb-1"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: 'var(--font-body)' }}>
          {greeting}, Torben 👋
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {investorCount} Interessenten · {intentCount} Vorschläge
          </p>
          {unreadMessages > 0 && (
            <Link to="/owner/chat"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition hover-press"
              style={{ background: 'var(--danger-dim)', color: 'var(--danger)' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--danger)' }} />
              {unreadMessages} ungelesen
            </Link>
          )}
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Interessenten', value: investorCount,  color: 'var(--brand)',           icon: '👥', isText: false },
          { label: 'Vorschläge',    value: intentCount,    color: 'var(--accent)',           icon: '💼', isText: false },
          { label: 'Ungelesen',     value: unreadMessages, color: unreadMessages > 0 ? 'var(--danger)' : 'var(--text-tertiary)', icon: '💬', isText: false, urgent: unreadMessages > 0 },
          { label: 'Partner',       value: partnerCount,   color: 'var(--brand)',            icon: '🤝', isText: false },
          { label: 'Dokumente',     value: docCount,       color: 'var(--text-secondary)',   icon: '📄', isText: false },
          { label: 'Phase',         value: 'Phase 1',      color: 'var(--info)',             icon: '🚀', isText: true  },
        ].map((kpi, i) => (
          <div key={kpi.label} className={`card p-4 animate-fade-up delay-${i + 1}`}
            style={kpi.urgent ? { borderColor: 'rgba(196,40,28,0.3)', boxShadow: '0 0 0 2px rgba(196,40,28,0.08)' } : {}}>
            <span className="text-lg block mb-1.5">{kpi.icon}</span>
            <p className="text-metric-md mb-0.5" style={{ color: kpi.color }}>
              {kpi.isText ? kpi.value : (kpi.value as number).toLocaleString('de-DE')}
            </p>
            <p className="label-overline" style={{ color: 'var(--text-tertiary)' }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* PRIORITY QUEUE */}
      <div className="mb-6 animate-fade-up delay-2">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>HEUTE WICHTIG</p>
        <div className="card overflow-hidden">
          {unreadMessages > 0 && (
            <Link to="/owner/chat"
              className="flex items-center gap-4 p-4 transition group strip-danger border-b"
              style={{ borderColor: 'var(--border)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--danger-dim)' }}>
                <MessageSquare size={16} style={{ color: 'var(--danger)' }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {unreadMessages} Investor-Nachricht{unreadMessages > 1 ? 'en' : ''} ungelesen
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Investoren warten auf eine Antwort</p>
              </div>
              <span className="btn btn-danger btn-sm shrink-0">Jetzt →</span>
            </Link>
          )}
          <Link to="/owner/updates"
            className="flex items-center gap-4 p-4 transition group strip-info border-b"
            style={{ borderColor: 'var(--border)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--info-dim)' }}>
              <Bell size={16} style={{ color: 'var(--info)' }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Update für Investoren verfassen</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Letztes: {updates[0]
                  ? new Date(updates[0].created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
                  : 'Noch keines'}
              </p>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/owner/partners"
            className="flex items-center gap-4 p-4 transition group strip-neutral">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--brand-dim)' }}>
              <Handshake size={16} style={{ color: 'var(--brand)' }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Partner-Pipeline: {partnerCount} / 30 Mindest-Ziel
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface3)' }}>
                  <div style={{ width: `${Math.min((partnerCount / 30) * 100, 100)}%`, height: '100%', background: 'var(--brand)', borderRadius: 'inherit', transition: 'width 0.6s ease' }} />
                </div>
                <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  {Math.round((partnerCount / 30) * 100)}%
                </span>
              </div>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2-COLUMN: Updates + Docs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 animate-fade-up delay-3">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Letzte Updates</h3>
            <Link to="/owner/updates" className="text-xs font-semibold hover-press" style={{ color: 'var(--brand)' }}>Alle →</Link>
          </div>
          {updates.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Noch keine Updates</p>
          ) : (
            <div className="flex flex-col">
              {updates.map((u, i) => (
                <div key={u.id} className={`flex items-center justify-between py-2.5 ${i < updates.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium truncate flex-1 mr-3" style={{ color: 'var(--text-primary)' }}>{u.title}</span>
                  <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(u.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Zuletzt hochgeladen</h3>
            <Link to="/owner/docs" className="text-xs font-semibold hover-press" style={{ color: 'var(--brand)' }}>Alle →</Link>
          </div>
          {docs.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Noch keine Dokumente</p>
          ) : (
            <div className="flex flex-col">
              {docs.map((d, i) => (
                <div key={d.id} className={`flex items-center justify-between py-2.5 ${i < docs.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium truncate flex-1 mr-3" style={{ color: 'var(--text-primary)' }}>
                    {d.name || d.file_name || d.section || 'Dokument'}
                  </span>
                  <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {d.updated_at ? new Date(d.updated_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* INTRO-TOOL */}
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

            {/* Entries without phase */}
            {entries.filter(e => !e.phase_id).length > 0 && (
              <div className="mt-4">
                <p className="label-overline mb-2">Ohne Phase</p>
                <div className="flex flex-col gap-1.5">
                  {entries.filter(e => !e.phase_id).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
                      style={{ background: 'var(--surface2)' }}>
                      <p className="text-xs font-medium flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{entry.title}</p>
                      <button onClick={() => handleDeleteEntry(entry.id)}
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
            <form onSubmit={handleAddEntry} className="flex flex-col gap-3">
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

            {/* Latest entries with phase */}
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
                      <button onClick={() => handleDeleteEntry(entry.id)}
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

    </div>
  )
}
