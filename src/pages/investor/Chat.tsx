import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
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
  const bottomRef = useRef<HTMLDivElement>(null)

  const investorId = user?.investor?.id

  useEffect(() => {
    if (!investorId) return
    supabase.from('messages').select('*').eq('investor_id', investorId).order('created_at')
      .then(({ data }) => { if (data) setMessages(data as Message[]) })

    const channel = supabase.channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [investorId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !investorId) return
    const { error } = await supabase.from('messages').insert([{
      investor_id: investorId,
      content: input.trim(),
      from_admin: false,
    }])
    if (error) toast.error('Nachricht konnte nicht gesendet werden')
    else setInput('')
  }

  const sendProposal = async () => {
    if (!proposal.trim() || !investorId) return
    setSubmitting(true)
    try {
      const content = `[Investitionsvorschlag] ${proposal.trim()}`
      const { error } = await supabase.from('messages').insert([{
        investor_id: investorId,
        content,
        from_admin: false,
      }])
      if (error) throw error
      toast.success('Ihr Vorschlag wurde übermittelt. Wir melden uns persönlich bei Ihnen.')
      setProposal('')
    } catch {
      toast.error('Übermittlung fehlgeschlagen. Bitte versuchen Sie es erneut.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Chat & Kontakt</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Direkter Kontakt zum Gründerteam und Investitionsvorschlag mitteilen
      </p>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Chat */}
        <div className="md:col-span-2 rounded-[20px] flex flex-col border overflow-hidden"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', height: 'clamp(360px, 55vh, 520px)' }}>
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: '#063D3E' }}>TG</div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Torben Gosch – CEO</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Online</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="text-center mt-10">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Noch keine Nachrichten</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Starten Sie jetzt das Gespräch</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from_admin ? 'justify-start' : 'justify-end'}`}>
                <div
                  className="max-w-[75%] px-4 py-2.5 text-sm"
                  style={{
                    borderRadius: m.from_admin ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    background: m.from_admin ? 'var(--surface2)' : '#063D3E',
                    color: m.from_admin ? 'var(--text-primary)' : 'white',
                  }}
                >
                  {m.content.startsWith('[Investitionsvorschlag]')
                    ? <><span className="font-semibold block text-xs mb-1 opacity-80">Ihr Vorschlag</span>{m.content.replace('[Investitionsvorschlag] ', '')}</>
                    : m.content
                  }
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-2 items-center rounded-xl px-3 py-2 border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ihre Nachricht..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
              <button onClick={sendMessage} className="text-accent1 hover:opacity-70 transition">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Investitionsvorschlag Panel */}
        <div className="rounded-[20px] p-4 md:p-5 border flex flex-col gap-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Investitionsmöglichkeiten</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Beteiligungsoptionen</p>
          </div>

          {/* Info-Chips: nur informativ, nicht wählbar */}
          <div className="flex gap-2">
            <div className="flex-1 py-2.5 rounded-xl text-center border font-semibold text-sm"
              style={{ background: 'rgba(6,61,62,0.06)', borderColor: 'rgba(6,61,62,0.15)', color: '#063D3E' }}>
              5% Beteiligung
            </div>
            <div className="flex-1 py-2.5 rounded-xl text-center border font-semibold text-sm"
              style={{ background: 'rgba(6,61,62,0.06)', borderColor: 'rgba(6,61,62,0.15)', color: '#063D3E' }}>
              10% Beteiligung
            </div>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Sie können uns Ihren Investitionsvorschlag mitteilen. Wir melden uns dann persönlich bei Ihnen.
          </p>

          <div className="flex flex-col gap-2 mt-auto">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Ihr Vorschlag / Ihre Idee
            </label>
            <textarea
              value={proposal}
              onChange={e => setProposal(e.target.value)}
              placeholder="Beschreiben Sie Ihren Investitionsvorschlag oder stellen Sie Fragen…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border resize-none"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <button
            onClick={sendProposal}
            disabled={!proposal.trim() || submitting}
            className="py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition"
            style={{ background: '#D4662A' }}
          >
            {submitting ? 'Wird übermittelt…' : 'Vorschlag senden →'}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
            Unverbindliche Interessensbekundung
          </p>
        </div>
      </div>
    </div>
  )
}
