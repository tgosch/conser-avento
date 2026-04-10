import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { sendEmail } from '../../lib/resend'
import { toast } from 'react-toastify'
import {
  Inbox, AlertTriangle, Clock, CheckCircle2, MessageSquare, Send,
  Search, Filter, Plus, Tag, ChevronDown, ChevronUp, Bookmark,
  CircleDot, ArrowUpRight,
} from 'lucide-react'

interface Ticket {
  id: string
  ticket_number: string
  sender_email: string
  sender_name: string | null
  subject: string
  body: string
  category: string
  priority: string
  status: string
  source: string
  ai_response: string | null
  notes: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
}

interface Template {
  id: string
  title: string
  body: string
  category: string | null
}

const STATUS_CONFIG = {
  offen: { label: 'Offen', color: '#E04B3E', bg: 'rgba(224,75,62,0.08)' },
  in_bearbeitung: { label: 'In Bearbeitung', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  warten_auf_antwort: { label: 'Wartet', color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
  geloest: { label: 'Geloest', color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
  geschlossen: { label: 'Geschlossen', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
} as const

const PRIORITY_CONFIG = {
  urgent: { label: 'Dringend', color: '#E04B3E', icon: AlertTriangle },
  high: { label: 'Hoch', color: '#F59E0B', icon: ArrowUpRight },
  normal: { label: 'Normal', color: 'var(--brand)', icon: CircleDot },
  low: { label: 'Niedrig', color: '#6B7280', icon: Clock },
} as const

const CATEGORY_LABELS: Record<string, string> = {
  BILLING: 'Abrechnung',
  BUG: 'Bug',
  FEATURE_REQUEST: 'Feature',
  HOW_TO: 'Anleitung',
  SONSTIGES: 'Sonstiges',
}

type StatusFilter = 'alle' | keyof typeof STATUS_CONFIG

export default function SupportCenter() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('alle')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({ sender_email: '', sender_name: '', subject: '', body: '', category: 'SONSTIGES', priority: 'normal' })
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [newTemplate, setNewTemplate] = useState({ title: '', body: '', category: '' })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [ticketRes, templateRes] = await Promise.all([
        supabase.from('support_tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('reply_templates').select('*').order('usage_count', { ascending: false }),
      ])
      if (ticketRes.data) setTickets(ticketRes.data)
      if (templateRes.data) setTemplates(templateRes.data)
    } catch {
      // Tables may not exist yet — use empty state
    } finally {
      setLoading(false)
    }
  }

  const createTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.body.trim() || !newTicket.sender_email.trim()) {
      toast.error('E-Mail, Betreff und Nachricht erforderlich')
      return
    }
    try {
      const { error } = await supabase.from('support_tickets').insert([{
        sender_email: newTicket.sender_email.trim(),
        sender_name: newTicket.sender_name.trim() || null,
        subject: newTicket.subject.trim(),
        body: newTicket.body.trim(),
        category: newTicket.category,
        priority: newTicket.priority,
        source: 'manual',
      }])
      if (error) throw error
      toast.success('Ticket erstellt')
      setNewTicket({ sender_email: '', sender_name: '', subject: '', body: '', category: 'SONSTIGES', priority: 'normal' })
      setShowNewTicket(false)
      loadData()
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const update: any = { status }
      if (status === 'geloest' || status === 'geschlossen') update.resolved_at = new Date().toISOString()
      const { error } = await supabase.from('support_tickets').update(update).eq('id', id)
      if (error) throw error
      setTickets(prev => prev.map(t => t.id === id ? { ...t, ...update } : t))
      toast.success('Status aktualisiert')
    } catch {
      toast.error('Fehler beim Aktualisieren')
    }
  }

  const sendReply = async (ticket: Ticket) => {
    if (!replyText.trim()) return
    setSending(true)
    try {
      // Save reply
      await supabase.from('ticket_replies').insert([{ ticket_id: ticket.id, from_admin: true, body: replyText.trim() }])
      // Send email
      const result = await sendEmail({
        to: ticket.sender_email,
        subject: `Re: ${ticket.subject} [${ticket.ticket_number}]`,
        html: `<div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
          <p style="color:#063D3E;font-weight:600;font-size:12px;margin-bottom:4px;">Ticket ${ticket.ticket_number}</p>
          <div style="color:#333;font-size:14px;line-height:1.7;margin:16px 0;">${replyText.replace(/\n/g, '<br/>')}</div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:11px;">Conser & Avento Support · conser-avento.de</p>
        </div>`,
      })
      if (result.success) {
        updateStatus(ticket.id, 'warten_auf_antwort')
        toast.success('Antwort gesendet')
        setReplyText('')
      } else {
        toast.error(`E-Mail Fehler: ${result.error}`)
      }
    } catch {
      toast.error('Senden fehlgeschlagen')
    } finally {
      setSending(false)
    }
  }

  const useTemplate = (tpl: Template) => {
    setReplyText(tpl.body)
    // Increment usage count
    supabase.from('reply_templates').update({ usage_count: (tpl as any).usage_count + 1 }).eq('id', tpl.id)
  }

  const saveTemplate = async () => {
    if (!newTemplate.title.trim() || !newTemplate.body.trim()) return
    try {
      const { error } = await supabase.from('reply_templates').insert([{
        title: newTemplate.title.trim(),
        body: newTemplate.body.trim(),
        category: newTemplate.category || null,
      }])
      if (error) throw error
      toast.success('Vorlage gespeichert')
      setNewTemplate({ title: '', body: '', category: '' })
      setShowTemplateEditor(false)
      loadData()
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`)
    }
  }

  const filtered = tickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.sender_email.toLowerCase().includes(search.toLowerCase()) ||
      t.ticket_number.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'alle' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const openCount = tickets.filter(t => t.status === 'offen').length
  const inProgressCount = tickets.filter(t => t.status === 'in_bearbeitung').length

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-bold text-xl md:text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Support Center</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Tickets, Anfragen und Vorlagen verwalten</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTemplateEditor(!showTemplateEditor)}
            className="btn btn-sm flex items-center gap-1" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
            <Bookmark size={12} /> Vorlagen
          </button>
          <button onClick={() => setShowNewTicket(!showNewTicket)} className="btn btn-primary btn-sm flex items-center gap-1">
            <Plus size={12} /> Ticket
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {[
          { label: 'Offen', value: openCount, color: '#E04B3E' },
          { label: 'In Bearbeitung', value: inProgressCount, color: '#F59E0B' },
          { label: 'Geloest', value: tickets.filter(t => t.status === 'geloest').length, color: '#34C759' },
          { label: 'Gesamt', value: tickets.length, color: 'var(--brand)' },
          { label: 'Vorlagen', value: templates.length, color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="card p-3">
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
            <p className="text-[9px] font-semibold uppercase" style={{ color: k.color }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* New Ticket Form */}
      {showNewTicket && (
        <div className="card p-4 mb-4 animate-fade-up" style={{ borderLeft: '3px solid var(--brand)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Neues Ticket</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input type="email" placeholder="E-Mail des Kunden *" value={newTicket.sender_email}
              onChange={e => setNewTicket(p => ({ ...p, sender_email: e.target.value }))} className="input-base text-xs" />
            <input type="text" placeholder="Name" value={newTicket.sender_name}
              onChange={e => setNewTicket(p => ({ ...p, sender_name: e.target.value }))} className="input-base text-xs" />
          </div>
          <input type="text" placeholder="Betreff *" value={newTicket.subject}
            onChange={e => setNewTicket(p => ({ ...p, subject: e.target.value }))} className="input-base text-xs w-full mb-2" />
          <textarea placeholder="Beschreibung *" value={newTicket.body} rows={3}
            onChange={e => setNewTicket(p => ({ ...p, body: e.target.value }))} className="input-base text-xs w-full resize-none mb-2" />
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex gap-1">
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <button key={k} onClick={() => setNewTicket(p => ({ ...p, category: k }))}
                  className="px-2 py-0.5 rounded-md text-[9px] font-semibold transition"
                  style={{ background: newTicket.category === k ? 'var(--brand)' : 'var(--surface2)', color: newTicket.category === k ? 'white' : 'var(--text-tertiary)' }}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                <button key={k} onClick={() => setNewTicket(p => ({ ...p, priority: k }))}
                  className="px-2 py-0.5 rounded-md text-[9px] font-semibold transition"
                  style={{ background: newTicket.priority === k ? v.color : 'var(--surface2)', color: newTicket.priority === k ? 'white' : 'var(--text-tertiary)' }}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createTicket} className="btn btn-primary btn-sm">Erstellen</button>
            <button onClick={() => setShowNewTicket(false)} className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* Template Editor */}
      {showTemplateEditor && (
        <div className="card p-4 mb-4 animate-fade-up" style={{ borderLeft: '3px solid #8B5CF6' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Schnellantwort-Vorlagen</p>
          {templates.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {templates.map(t => (
                <button key={t.id} onClick={() => useTemplate(t)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium hover-press transition"
                  style={{ background: 'var(--surface2)', color: 'var(--text-primary)' }}>
                  {t.title}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <input type="text" placeholder="Vorlagen-Titel..." value={newTemplate.title}
              onChange={e => setNewTemplate(p => ({ ...p, title: e.target.value }))} className="input-base text-xs w-full" />
            <textarea placeholder="Vorlagen-Text..." value={newTemplate.body} rows={3}
              onChange={e => setNewTemplate(p => ({ ...p, body: e.target.value }))} className="input-base text-xs w-full resize-none" />
            <div className="flex gap-2">
              <button onClick={saveTemplate} className="btn btn-sm" style={{ background: '#8B5CF6', color: 'white' }}>Speichern</button>
              <button onClick={() => setShowTemplateEditor(false)} className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>Schliessen</button>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input type="text" placeholder="Ticket-Nr, E-Mail oder Betreff..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-base text-xs pl-8 w-full" />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {(['alle', 'offen', 'in_bearbeitung', 'warten_auf_antwort', 'geloest', 'geschlossen'] as StatusFilter[]).map(s => {
            const conf = s === 'alle' ? null : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-2 py-1 rounded-md text-[9px] font-semibold whitespace-nowrap transition"
                style={{ background: statusFilter === s ? (conf?.color ?? 'var(--brand)') : 'var(--surface2)', color: statusFilter === s ? 'white' : 'var(--text-tertiary)' }}>
                {s === 'alle' ? 'Alle' : conf?.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center">
            <Inbox size={20} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Keine Tickets</p>
          </div>
        ) : filtered.map(t => {
          const sc = STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.offen
          const pc = PRIORITY_CONFIG[t.priority as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG.normal
          const expanded = expandedId === t.id
          return (
            <div key={t.id} className="card overflow-hidden">
              <button className="w-full p-3 text-left flex items-center gap-2"
                onClick={() => setExpandedId(expanded ? null : t.id)}>
                <pc.icon size={12} style={{ color: pc.color }} className="shrink-0" />
                <span className="text-[10px] font-bold shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{t.ticket_number}</span>
                <span className="text-xs font-medium truncate flex-1" style={{ color: 'var(--text-primary)' }}>{t.subject}</span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${CATEGORY_LABELS[t.category] ? 'var(--surface2)' : 'var(--surface2)'}`, color: 'var(--text-tertiary)' }}>
                  {CATEGORY_LABELS[t.category] ?? t.category}
                </span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: sc.bg, color: sc.color }}>
                  {sc.label}
                </span>
                <span className="text-[9px] shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(t.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                </span>
                {expanded ? <ChevronUp size={12} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={12} style={{ color: 'var(--text-tertiary)' }} />}
              </button>
              {expanded && (
                <div className="px-3 pb-3 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="pt-3 flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                    <span>Von: <b style={{ color: 'var(--text-secondary)' }}>{t.sender_name ?? t.sender_email}</b></span>
                    <span>{t.sender_email}</span>
                    <span>Quelle: {t.source}</span>
                  </div>
                  <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--surface2)', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {t.body}
                  </div>
                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <button key={k} onClick={() => updateStatus(t.id, k)} disabled={t.status === k}
                        className="px-2 py-0.5 rounded-md text-[9px] font-semibold transition"
                        style={{ background: t.status === k ? v.color : 'var(--surface2)', color: t.status === k ? 'white' : v.color, opacity: t.status === k ? 1 : 0.7 }}>
                        {v.label}
                      </button>
                    ))}
                  </div>
                  {/* Quick Templates */}
                  {templates.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[9px] self-center mr-1" style={{ color: 'var(--text-tertiary)' }}>Vorlagen:</span>
                      {templates.slice(0, 5).map(tpl => (
                        <button key={tpl.id} onClick={() => setReplyText(tpl.body)}
                          className="px-2 py-0.5 rounded text-[9px] hover-press" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
                          {tpl.title}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Reply */}
                  <div className="space-y-2">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                      placeholder="Antwort schreiben... (Markdown)" rows={3}
                      className="input-base text-xs w-full resize-none" style={{ fontFamily: 'var(--font-mono)' }} />
                    <button onClick={() => sendReply(t)} disabled={sending || !replyText.trim()}
                      className="btn btn-primary btn-sm flex items-center gap-1">
                      <Send size={11} /> {sending ? 'Sende...' : 'Antwort senden'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
