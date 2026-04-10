import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import { sendEmail } from '../../lib/resend'
import {
  Mail, Send, Users, Briefcase, Building2, Search, UserCircle,
  MessageSquare, Clock, CheckCircle2,
} from 'lucide-react'

interface Recipient {
  id: string
  name: string
  email: string
  type: 'investor' | 'partner'
}

interface SentMessage {
  id: string
  to: string
  toName: string
  subject: string
  body: string
  type: 'investor' | 'partner'
  sentAt: string
}

export default function Communication() {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'alle' | 'investor' | 'partner'>('alle')

  useEffect(() => {
    const load = async () => {
      try {
        const [invRes, partRes] = await Promise.all([
          supabase.from('investors').select('id, first_name, last_name, email'),
          supabase.from('partners').select('id, name, description'),
        ])
        const invRecipients: Recipient[] = (invRes.data ?? []).map((i: any) => ({
          id: i.id,
          name: `${i.first_name} ${i.last_name}`,
          email: i.email,
          type: 'investor' as const,
        }))
        // Partners don't have email directly — extract from description if available
        const partRecipients: Recipient[] = (partRes.data ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          email: '', // Will need to be filled from auth users
          type: 'partner' as const,
        }))
        setRecipients([...invRecipients, ...partRecipients])
      } catch {
        toast.error('Empfaenger laden fehlgeschlagen')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSend = async () => {
    if (!selectedRecipient || !subject.trim() || !body.trim()) {
      toast.error('Empfaenger, Betreff und Nachricht erforderlich')
      return
    }
    if (!selectedRecipient.email) {
      toast.error('Keine E-Mail-Adresse fuer diesen Empfaenger')
      return
    }
    setSending(true)
    try {
      const result = await sendEmail({
        to: selectedRecipient.email,
        subject,
        html: `<div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
          <p style="color:#063D3E;font-weight:600;font-size:13px;margin-bottom:4px;">Nachricht von Torben Gosch</p>
          <p style="color:#999;font-size:11px;margin-bottom:20px;">Conser & Avento — Owner</p>
          <div style="color:#333;font-size:14px;line-height:1.7;">${body.replace(/\n/g, '<br/>')}</div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:11px;text-align:center;">Conser & Avento · conser-avento.de</p>
        </div>`,
      })
      if (result.success) {
        const msg: SentMessage = {
          id: crypto.randomUUID(),
          to: selectedRecipient.email,
          toName: selectedRecipient.name,
          subject,
          body,
          type: selectedRecipient.type,
          sentAt: new Date().toISOString(),
        }
        setSentMessages(prev => [msg, ...prev])
        toast.success(`Nachricht an ${selectedRecipient.name} gesendet`)
        setSubject('')
        setBody('')
        setSelectedRecipient(null)
      } else {
        toast.error(`Fehler: ${result.error}`)
      }
    } catch {
      toast.error('Senden fehlgeschlagen')
    } finally {
      setSending(false)
    }
  }

  const filteredRecipients = recipients.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'alle' || r.type === filter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h1 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Kommunikation
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Direkte Nachrichten an Investoren und Partner senden
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Investoren', value: recipients.filter(r => r.type === 'investor').length, icon: Briefcase, color: '#34C759' },
          { label: 'Partner', value: recipients.filter(r => r.type === 'partner').length, icon: Building2, color: '#8B5CF6' },
          { label: 'Gesendet', value: sentMessages.length, icon: Send, color: 'var(--brand)' },
          { label: 'Gesamt Kontakte', value: recipients.length, icon: Users, color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <k.icon size={14} style={{ color: k.color }} />
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{k.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Recipients */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="relative mb-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
                <input type="text" placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)}
                  className="input-base text-xs pl-9 w-full" />
              </div>
              <div className="flex gap-1.5">
                {(['alle', 'investor', 'partner'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="px-2 py-1 rounded-md text-[10px] font-semibold transition"
                    style={{ background: filter === f ? 'var(--brand)' : 'var(--surface2)', color: filter === f ? 'white' : 'var(--text-tertiary)' }}>
                    {f === 'alle' ? 'Alle' : f === 'investor' ? 'Investoren' : 'Partner'}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {filteredRecipients.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Keine Empfaenger gefunden</p>
                </div>
              ) : filteredRecipients.map(r => (
                <button key={r.id} onClick={() => setSelectedRecipient(r)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--surface2)]"
                  style={{ borderBottom: '1px solid var(--border)', background: selectedRecipient?.id === r.id ? 'var(--surface2)' : 'transparent' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{ background: r.type === 'investor' ? '#34C759' : '#8B5CF6' }}>
                    {r.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                      {r.email || 'Keine E-Mail'} · {r.type === 'investor' ? 'Investor' : 'Partner'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Compose */}
        <div className="lg:col-span-3">
          <div className="card p-5">
            {selectedRecipient ? (
              <>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: selectedRecipient.type === 'investor' ? '#34C759' : '#8B5CF6' }}>
                    {selectedRecipient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>An: {selectedRecipient.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{selectedRecipient.email || 'Keine E-Mail hinterlegt'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <input type="text" placeholder="Betreff..." value={subject} onChange={e => setSubject(e.target.value)}
                    className="input-base text-sm w-full" />
                  <textarea placeholder="Nachricht schreiben..." value={body} onChange={e => setBody(e.target.value)}
                    rows={8} className="input-base text-sm w-full resize-none" />
                  <div className="flex gap-2">
                    <button onClick={handleSend} disabled={sending || !subject.trim() || !body.trim() || !selectedRecipient.email}
                      className="btn btn-primary btn-sm flex items-center gap-1.5">
                      <Send size={12} /> {sending ? 'Sende...' : 'Nachricht senden'}
                    </button>
                    <button onClick={() => { setSelectedRecipient(null); setSubject(''); setBody('') }}
                      className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
                      Abbrechen
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <Mail size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 12px' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Empfaenger auswaehlen</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Waehle links einen Investor oder Partner aus</p>
              </div>
            )}
          </div>

          {/* Sent Messages Log */}
          {sentMessages.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                Gesendet ({sentMessages.length})
              </p>
              <div className="flex flex-col gap-2">
                {sentMessages.map(m => (
                  <div key={m.id} className="card p-3 flex items-center gap-3">
                    <CheckCircle2 size={14} style={{ color: '#34C759' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{m.subject}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>An: {m.toName}</p>
                    </div>
                    <span className="text-[10px] shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(m.sentAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
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
