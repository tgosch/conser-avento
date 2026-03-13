/**
 * ProductOverview — Owner-only internal page
 * 5 tabs: Features · Roadmap · Vision · Feedback · Market
 * Uses conser-avento design tokens (--surface, --bg, --accent1, etc.)
 */
import { useState, useEffect, useCallback } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  LayoutGrid, Map, Lightbulb, MessageSquare, BarChart2,
  Plus, Trash2, CheckCircle, Clock, Circle, AlertCircle, XCircle,
  Edit2, X, Save,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type FeatureStatus = 'live' | 'in_progress' | 'planned' | 'deprecated'
type MilestoneStatus = 'done' | 'in_progress' | 'planned' | 'delayed' | 'cancelled'
type FeedbackStatus = 'open' | 'in_review' | 'implemented' | 'dismissed'

interface Feature {
  id: string
  title: string
  description: string | null
  category: string | null
  status: FeatureStatus
  icon: string | null
  sort_order: number
  created_at: string
}

interface Milestone {
  id: string
  title: string
  description: string | null
  target_date: string | null
  status: MilestoneStatus
  sort_order: number
}

interface FeedbackItem {
  id: string
  source: string | null
  content: string
  status: FeedbackStatus
  milestone_id: string | null
  submitted_at: string
}

// ── Constants ──────────────────────────────────────────────────────────────
const FEATURE_STATUS: Record<FeatureStatus, { label: string; color: string; bg: string }> = {
  live:        { label: 'Live',        color: '#34C759', bg: 'rgba(52,199,89,0.12)'  },
  in_progress: { label: 'In Arbeit',   color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
  planned:     { label: 'Geplant',     color: '#8E8E93', bg: 'rgba(142,142,147,0.12)' },
  deprecated:  { label: 'Veraltet',    color: '#FF3B30', bg: 'rgba(255,59,48,0.12)'  },
}

const MILESTONE_STATUS: Record<MilestoneStatus, { label: string; color: string }> = {
  done:        { label: 'Fertig',       color: '#34C759' },
  in_progress: { label: 'In Arbeit',    color: '#0066FF' },
  planned:     { label: 'Geplant',      color: '#8E8E93' },
  delayed:     { label: 'Verzögert',    color: '#FF9500' },
  cancelled:   { label: 'Abgebrochen',  color: '#FF3B30' },
}

const FEEDBACK_STATUS: Record<FeedbackStatus, { label: string; color: string }> = {
  open:        { label: 'Offen',         color: '#8E8E93' },
  in_review:   { label: 'In Prüfung',    color: '#FF9500' },
  implemented: { label: 'Umgesetzt',     color: '#34C759' },
  dismissed:   { label: 'Abgelehnt',     color: '#FF3B30' },
}

const TABS = [
  { id: 'features',  label: 'Features',  icon: LayoutGrid   },
  { id: 'roadmap',   label: 'Roadmap',   icon: Map          },
  { id: 'vision',    label: 'Vision',    icon: Lightbulb    },
  { id: 'feedback',  label: 'Feedback',  icon: MessageSquare },
  { id: 'market',    label: 'Markt',     icon: BarChart2    },
]

// ── Helper: strip HTML-like chars ──────────────────────────────────────────
function sanitize(s: string): string {
  return s.replace(/[<>]/g, '')
}

// ── Status icon helper ─────────────────────────────────────────────────────
function MilestoneIcon({ status }: { status: MilestoneStatus }) {
  const size = 15
  if (status === 'done')        return <CheckCircle size={size} style={{ color: MILESTONE_STATUS.done.color }} />
  if (status === 'in_progress') return <Clock       size={size} style={{ color: MILESTONE_STATUS.in_progress.color }} />
  if (status === 'delayed')     return <AlertCircle size={size} style={{ color: MILESTONE_STATUS.delayed.color }} />
  if (status === 'cancelled')   return <XCircle     size={size} style={{ color: MILESTONE_STATUS.cancelled.color }} />
  return <Circle size={size} style={{ color: MILESTONE_STATUS.planned.color }} />
}

// ── Input style ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface2)',
  color: 'var(--text-primary)',
  fontSize: 13,
  outline: 'none',
}

const btnPrimary: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 16px',
  borderRadius: 10,
  border: 'none',
  background: '#063D3E',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
}

// ══════════════════════════════════════════════════════════════════════════
// Features Tab
// ══════════════════════════════════════════════════════════════════════════
function FeaturesTab() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<FeatureStatus>('live')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('product_features')
      .select('*')
      .order('sort_order')
    if (error) toast.error('Fehler beim Laden der Features')
    else setFeatures((data ?? []) as Feature[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const saveStatus = async (id: string) => {
    const { error } = await supabase
      .from('product_features')
      .update({ status: editStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) toast.error('Speichern fehlgeschlagen')
    else { toast.success('Status aktualisiert'); setEditingId(null); load() }
  }

  if (loading) return <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Lade Features…</div>

  const byCategory = features.reduce<Record<string, Feature[]>>((acc, f) => {
    const cat = f.category ?? 'Sonstige'
    ;(acc[cat] ??= []).push(f)
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Object.entries(byCategory).map(([cat, items]) => (
        <div key={cat}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>
            {cat}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {items.map(f => {
              const s = FEATURE_STATUS[f.status]
              const isEditing = editingId === f.id
              return (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, background: 'rgba(6,61,62,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, flexShrink: 0,
                  }}>
                    {f.icon ?? '⚙️'}
                  </div>
                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{f.title}</p>
                    {f.description && (
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {f.description}
                      </p>
                    )}
                  </div>
                  {/* Status */}
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as FeatureStatus)}
                        style={{ ...inputStyle, width: 'auto', padding: '4px 8px', fontSize: 12 }}
                      >
                        {(Object.keys(FEATURE_STATUS) as FeatureStatus[]).map(k => (
                          <option key={k} value={k}>{FEATURE_STATUS[k].label}</option>
                        ))}
                      </select>
                      <button onClick={() => saveStatus(f.id)} style={{ ...btnPrimary, padding: '4px 10px' }}>
                        <Save size={12} />
                      </button>
                      <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                        background: s.bg, color: s.color,
                      }}>{s.label}</span>
                      <button
                        onClick={() => { setEditingId(f.id); setEditStatus(f.status) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                        title="Status ändern"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// Roadmap Tab
// ══════════════════════════════════════════════════════════════════════════
function RoadmapTab() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', description: '', target_date: '', status: 'planned' as MilestoneStatus })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('roadmap_milestones')
      .select('*')
      .order('sort_order')
    if (error) toast.error('Fehler beim Laden')
    else setMilestones((data ?? []) as Milestone[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    const { error } = await supabase.from('roadmap_milestones').insert([{
      title: sanitize(form.title.trim()).slice(0, 120),
      description: form.description ? sanitize(form.description.trim()).slice(0, 500) : null,
      target_date: form.target_date || null,
      status: form.status,
    }])
    if (error) toast.error('Fehler beim Speichern')
    else { toast.success('Meilenstein hinzugefügt'); setForm({ title: '', description: '', target_date: '', status: 'planned' }); load() }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('roadmap_milestones').delete().eq('id', id)
    if (error) toast.error('Löschen fehlgeschlagen')
    else { load() }
  }

  const updateStatus = async (id: string, status: MilestoneStatus) => {
    const { error } = await supabase.from('roadmap_milestones').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) toast.error('Fehler'); else load()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="md:grid-cols-2">
      {/* List */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>Meilensteine</p>
        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Lädt…</p>
        ) : milestones.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Noch keine Meilensteine</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {milestones.map(m => {
              const s = MILESTONE_STATUS[m.status]
              return (
                <div key={m.id} style={{
                  padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)',
                  background: 'var(--surface)', borderLeft: `3px solid ${s.color}`,
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <div style={{ marginTop: 1 }}><MilestoneIcon status={m.status} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{m.title}</p>
                    {m.description && (
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>{m.description}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {m.target_date && (
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                          🗓 {new Date(m.target_date).toLocaleDateString('de-DE')}
                        </span>
                      )}
                      <select
                        value={m.status}
                        onChange={e => updateStatus(m.id, e.target.value as MilestoneStatus)}
                        style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', color: s.color, cursor: 'pointer' }}
                      >
                        {(Object.keys(MILESTONE_STATUS) as MilestoneStatus[]).map(k => (
                          <option key={k} value={k}>{MILESTONE_STATUS[k].label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', flexShrink: 0 }}
                    title="Löschen"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add form */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>Neuer Meilenstein</p>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            required
            placeholder="Titel *"
            maxLength={120}
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            style={inputStyle}
          />
          <textarea
            placeholder="Beschreibung (optional)"
            maxLength={500}
            rows={3}
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <input
            type="date"
            value={form.target_date}
            onChange={e => setForm(p => ({ ...p, target_date: e.target.value }))}
            style={inputStyle}
          />
          <select
            value={form.status}
            onChange={e => setForm(p => ({ ...p, status: e.target.value as MilestoneStatus }))}
            style={inputStyle}
          >
            {(Object.keys(MILESTONE_STATUS) as MilestoneStatus[]).map(k => (
              <option key={k} value={k}>{MILESTONE_STATUS[k].label}</option>
            ))}
          </select>
          <button type="submit" disabled={saving || !form.title.trim()} style={btnPrimary}>
            <Plus size={14} /> {saving ? 'Wird gespeichert…' : 'Meilenstein hinzufügen'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// Feedback Tab
// ══════════════════════════════════════════════════════════════════════════
function FeedbackTab() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ source: '', content: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('feedback_items')
      .select('*')
      .order('submitted_at', { ascending: false })
    if (error) toast.error('Fehler beim Laden')
    else setItems((data ?? []) as FeedbackItem[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim()) return
    setSaving(true)
    const { error } = await supabase.from('feedback_items').insert([{
      source: form.source ? sanitize(form.source.trim()).slice(0, 50) : null,
      content: sanitize(form.content.trim()).slice(0, 1000),
      status: 'open',
    }])
    if (error) toast.error('Fehler beim Speichern')
    else { toast.success('Feedback gespeichert'); setForm({ source: '', content: '' }); load() }
    setSaving(false)
  }

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    const { error } = await supabase.from('feedback_items').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) toast.error('Fehler'); else load()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="md:grid-cols-2">
      {/* List */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>Eingegangenes Feedback</p>
        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Lädt…</p>
        ) : items.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Noch kein Feedback</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(item => {
              const s = FEEDBACK_STATUS[item.status]
              return (
                <div key={item.id} style={{
                  padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      {item.source && (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 5, background: 'rgba(6,61,62,0.15)', color: '#063D3E' }}>
                          {item.source}
                        </span>
                      )}
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                        {new Date(item.submitted_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <select
                      value={item.status}
                      onChange={e => updateStatus(item.id, e.target.value as FeedbackStatus)}
                      style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', color: s.color, cursor: 'pointer', flexShrink: 0 }}
                    >
                      {(Object.keys(FEEDBACK_STATUS) as FeedbackStatus[]).map(k => (
                        <option key={k} value={k}>{FEEDBACK_STATUS[k].label}</option>
                      ))}
                    </select>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.content}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add form */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>Feedback erfassen</p>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            placeholder="Quelle (z.B. Email, Slack, Call)"
            maxLength={50}
            value={form.source}
            onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
            style={inputStyle}
          />
          <textarea
            required
            placeholder="Feedback-Inhalt *"
            maxLength={1000}
            rows={5}
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <button type="submit" disabled={saving || !form.content.trim()} style={btnPrimary}>
            <Plus size={14} /> {saving ? 'Wird gespeichert…' : 'Feedback speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// Vision Tab (static for now)
// ══════════════════════════════════════════════════════════════════════════
function VisionTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 }}>
      {[
        {
          icon: '🎯',
          title: 'Mission',
          text: 'Wir bauen das führende KI-Business-OS für DACH-KMUs mit 5–50 Mitarbeitern. Zentari ersetzt 5–8 Einzeltools durch eine integrierte Plattform mit KI-First-Ansatz.',
        },
        {
          icon: '🚀',
          title: 'Vision 2027',
          text: 'Marktführer im deutschsprachigen KMU-Segment. 10.000+ Unternehmen nutzen Zentari als primäres Business-OS. ARR von €5M+.',
        },
        {
          icon: '💡',
          title: 'Differenzierung',
          text: 'Anders als generische Tools ist Zentari DSGVO-nativ, sprachoptimiert für DACH und tief in KI integriert — nicht als Addon, sondern als Kern des Produkts.',
        },
        {
          icon: '📈',
          title: 'Wachstumsstrategie',
          text: 'Bottom-Up über Marketing-Agenturen und Franchise-Netzwerke. Jeder Reseller kann White-Label-Instanzen deployen und monatliche Recurring Revenue erzielen.',
        },
      ].map(item => (
        <div key={item.title} style={{
          padding: '16px 20px', borderRadius: 14, border: '1px solid var(--border)',
          background: 'var(--surface)', display: 'flex', gap: 14,
        }}>
          <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{item.icon}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 5 }}>{item.title}</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// Market Tab (static)
// ══════════════════════════════════════════════════════════════════════════
function MarketTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 }}>
      {[
        { label: 'Zielmarkt (TAM)', value: '~3,6M KMUs in DACH', icon: '🌍' },
        { label: 'Serviceable Market (SAM)', value: '~280.000 digitalisierungsaffine KMUs', icon: '🎯' },
        { label: 'Realistisch erreichbar (SOM)', value: '~12.000 Unternehmen bis 2028', icon: '📊' },
        { label: 'Ø Jahresumsatz pro Kunde', value: '€600–€1.800 / Jahr (Business–Agency)', icon: '💰' },
        { label: 'Hauptwettbewerber', value: 'HubSpot, Notion, Monday.com, ClickUp', icon: '⚔️' },
        { label: 'Zentari-Vorteil', value: 'DSGVO-nativ, DACH-lokalisiert, All-in-One + KI', icon: '✅' },
      ].map(item => (
        <div key={item.label} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)',
          background: 'var(--surface)',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>{item.label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// Main Page
// ══════════════════════════════════════════════════════════════════════════
export default function ProductOverview() {
  const [activeTab, setActiveTab] = useState('features')

  const renderTab = () => {
    switch (activeTab) {
      case 'features':  return <FeaturesTab />
      case 'roadmap':   return <RoadmapTab />
      case 'feedback':  return <FeedbackTab />
      case 'vision':    return <VisionTab />
      case 'market':    return <MarketTab />
      default:          return null
    }
  }

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Produkt-Übersicht
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Interne Roadmap, Feature-Status, Kundenfeedback und Marktpositionierung
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, flexWrap: 'wrap',
        padding: '4px', borderRadius: 14, background: 'var(--surface)',
        border: '1px solid var(--border)', marginBottom: 24,
      }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: 10, border: 'none',
                background: active ? '#063D3E' : 'transparent',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div>{renderTab()}</div>
    </div>
  )
}
