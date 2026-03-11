import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Message } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const AMOUNTS = [
  { value: 5000,  label: 'Einsteiger-Beteiligung' },
  { value: 10000, label: 'Standard-Beteiligung' },
  { value: 25000, label: 'Premium-Beteiligung' },
  { value: 50000, label: 'Lead-Investor' },
]

export default function Chat() {
  const { user } = useAuth()
  const investorId = user?.investor?.id ?? null
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!investorId) return
    supabase.from('messages').select('*').eq('investor_id', investorId).order('created_at')
      .then(({ data }) => { setMessages(data ?? []); setLoading(false) })
      .then(undefined, () => setLoading(false))

    const channel = supabase
      .channel(`chat-${investorId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `investor_id=eq.${investorId}`,
      }, payload => setMessages(prev => [...prev, payload.new as Message]))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [investorId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !investorId) return
    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert({
        investor_id: investorId, content: input.trim(), from_admin: false,
      })
      if (error) throw error
      setInput('')
    } catch { toast.error('Nachricht konnte nicht gesendet werden') }
    finally { setSending(false) }
  }

  const sendInvestIntent = async () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount
    if (!amount || amount <= 0 || !investorId) { toast.error('Bitte Betrag auswählen'); return }
    setInvesting(true)
    try {
      const { error } = await supabase.from('investment_intents').insert({
        investor_id: investorId, amount, status: 'pending',
      })
      if (error) throw error
      toast.success(`Investitionsabsicht über € ${amount.toLocaleString('de-DE')} eingereicht!`)
      setSelectedAmount(null); setCustomAmount('')
    } catch { toast.error('Fehler beim Einreichen') }
    finally { setInvesting(false) }
  }

  const fmt = (iso: string) => new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text">Chat & Invest</h1>
        <p className="text-secondary text-sm mt-1">Direktkontakt zu den Gründern & Investitionsabsicht einreichen</p>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row" style={{ height: 'calc(100vh - 220px)', minHeight: '520px' }}>
        {/* Chat */}
        <div className="flex-1 bg-surface rounded-card border border-black/5 shadow-sm2 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: '#063D3E' }}>TG</div>
            <div className="flex-1">
              <p className="font-semibold text-text text-sm">Torben Gosch – CEO</p>
              <p className="text-secondary text-xs">Avento & Conser Gründer</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-secondary">Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
                  <div className="h-10 w-48 bg-surface2 rounded-2xl animate-pulse" />
                </div>
              ))
            ) : messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-secondary text-sm">Starten Sie das Gespräch mit dem Gründerteam</p>
              </div>
            ) : messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from_admin ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 text-sm rounded-[18px] ${
                  msg.from_admin
                    ? 'bg-surface2 text-text rounded-bl-[4px]'
                    : 'text-white rounded-br-[4px]'
                }`}
                  style={!msg.from_admin ? { background: '#063D3E' } : {}}
                >
                  <p>{msg.content}</p>
                  <p className={`text-[11px] mt-1 ${msg.from_admin ? 'text-secondary/60' : 'text-white/50'}`}>{fmt(msg.created_at)}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-black/5 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Nachricht schreiben…"
              className="flex-1 bg-surface2 rounded-full px-4 py-2.5 text-sm outline-none font-sans text-text placeholder-secondary/60"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="w-10 h-10 rounded-full text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 shrink-0"
              style={{ background: '#063D3E' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Invest Panel */}
        <div className="lg:w-[340px] bg-surface rounded-card border border-black/5 shadow-sm2 p-6 flex flex-col gap-5">
          <div>
            <h2 className="font-bold text-text text-lg">Investitionsabsicht einreichen</h2>
            <p className="text-secondary text-xs mt-1">Wählen Sie einen Betrag oder geben Sie einen eigenen ein</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AMOUNTS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setSelectedAmount(opt.value); setCustomAmount('') }}
                className={`p-3.5 rounded-[14px] border-2 text-left transition-all duration-150 ${
                  selectedAmount === opt.value && !customAmount
                    ? 'border-accent1 bg-accent1/5'
                    : 'border-black/8 hover:border-black/20 bg-surface2'
                }`}
              >
                <p className="font-bold text-text text-sm">€ {opt.value.toLocaleString('de-DE')}</p>
                <p className="text-secondary text-xs mt-0.5">{opt.label}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Eigener Betrag (€)</label>
            <input
              type="number"
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
              placeholder="z.B. 15.000"
              className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent2 transition font-sans text-text"
            />
          </div>

          {(selectedAmount || customAmount) && (
            <div className="rounded-btn px-4 py-2.5 text-sm font-semibold text-white" style={{ background: '#063D3E' }}>
              Ausgewählt: € {(customAmount ? parseFloat(customAmount) : selectedAmount ?? 0).toLocaleString('de-DE')}
            </div>
          )}

          <button
            onClick={sendInvestIntent}
            disabled={investing || (!selectedAmount && !customAmount)}
            className="w-full rounded-btn py-3 font-bold text-sm text-white transition disabled:opacity-40 mt-auto hover:opacity-90"
            style={{ background: '#D4662A' }}
          >
            {investing ? 'Wird eingereicht…' : 'Absicht einreichen →'}
          </button>

          <p className="text-[11px] text-secondary/60 text-center -mt-2">
            Unverbindliche Interessensbekundung. Kein rechtsverbindliches Angebot.
          </p>
        </div>
      </div>
    </div>
  )
}
