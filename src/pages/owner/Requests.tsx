import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import { sendEmail } from '../../lib/resend'
import {
  Inbox, UserPlus, Clock, CheckCircle, Mail, Phone, MessageSquare,
  ChevronDown, ChevronUp, Send, Search, Filter,
} from 'lucide-react'

interface ContactRequest {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  type?: string
  status: 'neu' | 'gelesen' | 'beantwortet'
  created_at: string
}

interface InvestorRow {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  consent: boolean
  nda_accepted: boolean
  created_at: string
}

type Tab = 'anfragen' | 'interessenten'

export default function Requests() {
  const [tab, setTab] = useState<Tab>('anfragen')
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [investors, setInvestors] = useState<InvestorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [contactRes, invRes] = await Promise.all([
          supabase.from('contact_requests').select('*').order('created_at', { ascending: false }),
          supabase.from('investors').select('*').order('created_at', { ascending: false }),
        ])
        if (contactRes.data) setContacts(contactRes.data.map((c: any) => ({ ...c, status: c.status ?? 'neu' })))
        if (invRes.data) setInvestors(invRes.data)
      } catch {
        toast.error('Daten laden fehlgeschlagen')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleReply = async (email: string, contactId: string) => {
    if (!replyText.trim()) return
    setSending(true)
    try {
      const result = await sendEmail({
        to: email,
        subject: 'Re: Ihre Anfrage — Conser & Avento',
        html: `<div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <p style="color:#333;font-size:14px;line-height:1.7;">${replyText.replace(/\n/g, '<br/>')}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:11px;">Conser & Avento — Das Oekosystem fuer die Baubranche</p>
        </div>`,
      })
      if (result.success) {
        toast.success('Antwort gesendet')
        setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: 'beantwortet' as const } : c))
        setReplyText('')
        setReplyTo(null)
      } else {
        toast.error(`Fehler: ${result.error}`)
      }
    } catch {
      toast.error('Senden fehlgeschlagen')
    } finally {
      setSending(false)
    }
  }

  const markRead = async (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status: 'gelesen' as const } : c))
  }

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.message?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredInvestors = investors.filter(i =>
    `${i.first_name} ${i.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  )

  const neuCount = contacts.filter(c => c.status === 'neu').length

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
          Anfragen & Interessenten
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Kontaktanfragen beantworten, Interessenten verwalten
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Neue Anfragen', value: neuCount, icon: Inbox, color: neuCount > 0 ? '#E04B3E' : 'var(--text-tertiary)', urgent: neuCount > 0 },
          { label: 'Gesamt Anfragen', value: contacts.length, icon: MessageSquare, color: 'var(--brand)' },
          { label: 'Interessenten', value: investors.length, icon: UserPlus, color: '#34C759' },
          { label: 'Beantwortet', value: contacts.filter(c => c.status === 'beantwortet').length, icon: CheckCircle, color: '#8B5CF6' },
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

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex gap-2">
          {([
            { key: 'anfragen' as Tab, label: 'Kontaktanfragen', count: contacts.length },
            { key: 'interessenten' as Tab, label: 'Interessenten', count: investors.length },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              style={{
                background: tab === t.key ? 'var(--brand)' : 'var(--surface2)',
                color: tab === t.key ? 'white' : 'var(--text-secondary)',
              }}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input type="text" placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-base text-sm pl-9 w-full" />
        </div>
      </div>

      {/* Contact Requests */}
      {tab === 'anfragen' && (
        <div className="flex flex-col gap-3">
          {filteredContacts.length === 0 ? (
            <div className="card p-8 text-center">
              <Inbox size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Keine Anfragen</p>
            </div>
          ) : filteredContacts.map(c => (
            <div key={c.id} className="card overflow-hidden">
              <button className="w-full p-4 text-left flex items-center gap-3"
                onClick={() => { setExpandedId(expandedId === c.id ? null : c.id); if (c.status === 'neu') markRead(c.id) }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{c.name || 'Unbekannt'}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{
                      background: c.status === 'neu' ? 'rgba(224,75,62,0.1)' : c.status === 'beantwortet' ? 'rgba(52,199,89,0.1)' : 'rgba(107,114,128,0.1)',
                      color: c.status === 'neu' ? '#E04B3E' : c.status === 'beantwortet' ? '#34C759' : '#6B7280',
                    }}>{c.status}</span>
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{c.email}</p>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(c.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </span>
                {expandedId === c.id ? <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />}
              </button>
              {expandedId === c.id && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="pt-3 space-y-3">
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-1"><Mail size={12} /> {c.email}</span>
                      {c.phone && <span className="flex items-center gap-1"><Phone size={12} /> {c.phone}</span>}
                    </div>
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'var(--surface2)', color: 'var(--text-primary)' }}>
                      {c.message}
                    </div>
                    {/* Reply */}
                    {replyTo === c.id ? (
                      <div className="space-y-2">
                        <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                          placeholder="Antwort schreiben..." rows={3}
                          className="input-base w-full text-sm resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => handleReply(c.email, c.id)} disabled={sending || !replyText.trim()}
                            className="btn btn-primary btn-sm flex items-center gap-1.5">
                            <Send size={12} /> {sending ? 'Sende...' : 'Senden'}
                          </button>
                          <button onClick={() => { setReplyTo(null); setReplyText('') }}
                            className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReplyTo(c.id)}
                        className="btn btn-sm flex items-center gap-1.5" style={{ background: 'var(--brand)', color: 'white' }}>
                        <Mail size={12} /> Antworten
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Investors List */}
      {tab === 'interessenten' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'E-Mail', 'Telefon', 'NDA', 'Datum'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInvestors.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>Keine Interessenten</td></tr>
                ) : filteredInvestors.map(i => (
                  <tr key={i.id} className="hover:bg-[var(--surface2)] transition" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{i.first_name} {i.last_name}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{i.email}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{i.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{
                        background: i.nda_accepted ? 'rgba(52,199,89,0.1)' : 'rgba(224,75,62,0.1)',
                        color: i.nda_accepted ? '#34C759' : '#E04B3E',
                      }}>{i.nda_accepted ? 'Ja' : 'Nein'}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(i.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
