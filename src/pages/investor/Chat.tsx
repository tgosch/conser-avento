import { useEffect, useRef, useState } from 'react'
import { Send, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Message } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

export default function InvestorChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [proposal, setProposal] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showProposal, setShowProposal] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const investorId = user?.investor?.id

  useEffect(() => {
    if (!investorId) return
    supabase.from('messages').select('*').eq('investor_id', investorId).order('created_at')
      .then(({ data }) => { if (data) setMessages(data as Message[]) })

    const channel = supabase.channel(`inv-chat-${investorId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `investor_id=eq.${investorId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [investorId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!investorId) {
      toast.error('Sitzung abgelaufen. Bitte neu anmelden.')
      return
    }
    if (!input.trim()) return
    const text = input.trim()
    setInput('')
    const { error } = await supabase.from('messages').insert([{
      investor_id: investorId, content: text, from_admin: false,
    }])
    if (error) toast.error('Nachricht konnte nicht gesendet werden')
  }

  const sendProposal = async () => {
    if (!proposal.trim() || !investorId) return
    setSubmitting(true)
    try {
      const content = `[Investitionsvorschlag] ${proposal.trim()}`
      const { error } = await supabase.from('messages').insert([{
        investor_id: investorId, content, from_admin: false,
      }])
      if (error) throw error
      toast.success('Ihr Vorschlag wurde übermittelt. Wir melden uns persönlich bei Ihnen.')
      setProposal('')
      setShowProposal(false)
    } catch {
      toast.error('Übermittlung fehlgeschlagen. Bitte versuchen Sie es erneut.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-up" style={{ height: 'calc(100dvh - var(--topbar-height) - var(--bottom-nav-total) - 2rem)' }}>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-4 h-full">

        {/* ── Chat Window ── */}
        <div className="md:col-span-2 card flex flex-col overflow-hidden"
          style={{ minHeight: '420px', flex: '1 1 auto' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: '#063D3E' }}>TG</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Torben Gosch – CEO</p>
              {/* ERGÄNZUNG 1 — Antwortzeit */}
              <div className="flex flex-col mt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#34C759' }} />
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Direkt erreichbar</span>
                </div>
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                  Antwortet typisch innerhalb 4 Stunden
                </span>
              </div>
            </div>
            <button onClick={() => setShowProposal(v => !v)}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
              style={{ background: 'rgba(212,102,42,0.1)', color: '#D4662A' }}>
              Vorschlag
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--surface2)' }}>
                  <span className="text-2xl">💬</span>
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Noch keine Nachrichten</p>
                <p className="text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>Starten Sie jetzt das Gespräch</p>
              </div>
            )}

            {/* ERGÄNZUNG 2 — Starter-Fragen */}
            {messages.length === 0 && (
              <div className="p-4">
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)' }}>HÄUFIGE FRAGEN</p>
                <div className="flex flex-col gap-2">
                  {[
                    'Was ist der aktuelle Stand der Seed-Runde?',
                    'Wie unterscheidet ihr euch von SAP und Weclapp?',
                    'Was sind die Investitionskonditionen?',
                  ].map(q => (
                    <button key={q}
                      onClick={() => { setInput(q); inputRef.current?.focus() }}
                      className="text-left px-4 py-2.5 rounded-[12px] text-xs font-medium transition hover:opacity-80"
                      style={{ background: 'var(--surface2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                      {q} →
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, idx) => {
              const isProposal = m.content.startsWith('[Investitionsvorschlag]')
              const prevSame = idx > 0 && messages[idx - 1].from_admin === m.from_admin
              return (
                <div key={m.id} className={`flex ${m.from_admin ? 'justify-start' : 'justify-end'} ${prevSame ? 'mt-0.5' : 'mt-2'}`}>
                  {m.from_admin && !prevSame && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold mr-2 mt-auto mb-0.5 shrink-0"
                      style={{ background: '#063D3E' }}>TG</div>
                  )}
                  {m.from_admin && prevSame && <div className="w-6 mr-2 shrink-0" />}
                  <div className="max-w-[75%] px-4 py-2.5 text-sm"
                    style={{
                      borderRadius: m.from_admin
                        ? (prevSame ? '14px 18px 18px 4px' : '4px 18px 18px 18px')
                        : (prevSame ? '18px 4px 14px 18px' : '18px 4px 18px 18px'),
                      background: m.from_admin ? 'var(--surface2)' : '#063D3E',
                      color: m.from_admin ? 'var(--text-primary)' : 'white',
                      lineHeight: '1.5',
                    }}>
                    {isProposal ? (
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wide mb-1.5 opacity-60">
                          Investitionsvorschlag
                        </span>
                        {m.content.replace('[Investitionsvorschlag] ', '')}
                      </div>
                    ) : m.content}
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-2 items-center rounded-[14px] px-4 py-2.5 border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <input ref={inputRef} type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ihre Nachricht..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }} />
              <button onClick={sendMessage} disabled={!input.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 transition disabled:opacity-30"
                style={{ background: '#063D3E' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Investment Panel ── */}
        <div className={`card flex-col gap-0 overflow-hidden shrink-0
          ${showProposal ? 'flex' : 'hidden md:flex'}`}>

          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Investitionsmöglichkeiten</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Beteiligungsoptionen — Seed-Runde</p>
          </div>

          {/* ERGÄNZUNG 3 — Klarere Konditionen */}
          <div className="p-4 flex flex-col gap-3">
            {[
              {
                pct: '5%', min: 'ab €25.000', label: 'Basispaket',
                desc: 'Vollständige Investor-Rechte · Quarterly Updates',
                highlight: false,
              },
              {
                pct: '10%', min: 'ab €75.000', label: 'Premiumpaket',
                desc: 'Advisory-Position im Beirat · Direktzugang zum Gründerteam',
                highlight: true,
              },
            ].map(opt => (
              <div key={opt.pct} className="rounded-[14px] p-4 border"
                   style={{
                     background: opt.highlight ? 'rgba(6,61,62,0.06)' : 'var(--surface2)',
                     borderColor: opt.highlight ? 'rgba(6,61,62,0.25)' : 'var(--border)',
                   }}>
                <div className="flex items-start justify-between mb-1">
                  <span className="text-2xl font-bold" style={{ color: '#063D3E' }}>{opt.pct}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: opt.highlight ? '#063D3E' : 'var(--surface3)',
                          color: opt.highlight ? 'white' : 'var(--text-secondary)',
                        }}>
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs font-semibold mb-1" style={{ color: '#063D3E' }}>{opt.min}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{opt.desc}</p>
              </div>
            ))}
          </div>

          <div className="px-4 pb-2">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Teilen Sie uns Ihren Vorschlag mit. Wir melden uns dann persönlich bei Ihnen — unverbindlich.
            </p>
          </div>

          <div className="p-4 pt-2 flex flex-col gap-3 mt-auto">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Ihr Investitionsvorschlag
            </label>
            <textarea value={proposal} onChange={e => setProposal(e.target.value)}
              placeholder="Beschreiben Sie Ihren Vorschlag oder stellen Sie Ihre Fragen…"
              rows={4}
              className="w-full px-4 py-3 rounded-[12px] text-sm outline-none border resize-none"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)', lineHeight: '1.6' }} />
            <button onClick={sendProposal} disabled={!proposal.trim() || submitting}
              className="btn btn-accent w-full">
              {submitting ? 'Wird übermittelt…' : <>Vorschlag senden <ChevronRight size={14} /></>}
            </button>
            <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
              Unverbindliche Interessensbekundung
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
