import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Message } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const INVESTMENT_OPTIONS = [
  { amount: 5000, label: 'Einsteiger-Beteiligung' },
  { amount: 10000, label: 'Standard-Beteiligung' },
  { amount: 25000, label: 'Premium-Beteiligung' },
  { amount: 50000, label: 'Lead-Investor' },
]

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [investSending, setInvestSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const investorId = user?.investor?.id ?? null

  useEffect(() => {
    const fetchMessages = async () => {
      if (!investorId) return
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('investor_id', investorId)
          .order('created_at', { ascending: true })
        if (error) throw error
        setMessages(data ?? [])
      } catch {
        toast.error('Fehler beim Laden der Nachrichten')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Supabase Realtime subscription
    if (!investorId) return
    const channel = supabase
      .channel(`messages-${investorId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `investor_id=eq.${investorId}` },
        payload => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [investorId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputText.trim() || !investorId) return
    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert({
        investor_id: investorId,
        content: inputText.trim(),
        from_admin: false,
      })
      if (error) throw error
      setInputText('')
    } catch {
      toast.error('Nachricht konnte nicht gesendet werden')
    } finally {
      setSending(false)
    }
  }

  const sendInvestIntent = async () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount
    if (!amount || amount <= 0) {
      toast.error('Bitte wählen Sie einen Betrag aus')
      return
    }
    if (!investorId) {
      toast.error('Kein Investorenkonto gefunden')
      return
    }
    setInvestSending(true)
    try {
      const { error } = await supabase.from('investment_intents').insert({
        investor_id: investorId,
        amount,
        status: 'pending',
      })
      if (error) throw error
      toast.success(`Investitionsabsicht über € ${amount.toLocaleString('de-DE')} wurde gesendet!`)
      setSelectedAmount(null)
      setCustomAmount('')
    } catch {
      toast.error('Fehler beim Senden der Investitionsabsicht')
    } finally {
      setInvestSending(false)
    }
  }

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text">Chat & Invest</h1>
        <p className="text-gray-400 mt-1 text-sm">Direkter Kontakt zu den Gründern & Investitionsabsicht senden</p>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-card shadow-card flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-accent1 flex items-center justify-center text-white font-bold text-sm">
              TG
            </div>
            <div>
              <p className="font-semibold text-text text-sm">Torben Gosch – CEO</p>
              <p className="text-xs text-gray-400">Avento & Conser Gründer</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className="h-10 w-48 bg-gray-100 rounded-2xl animate-pulse" />
                </div>
              ))
            ) : messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-400 text-sm">Noch keine Nachrichten. Starten Sie eine Unterhaltung!</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from_admin ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                      msg.from_admin
                        ? 'bg-bg text-text rounded-bl-md'
                        : 'bg-accent1 text-white rounded-br-md'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.from_admin ? 'text-gray-400' : 'text-white/60'}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Nachricht schreiben..."
              className="flex-1 bg-bg rounded-full px-4 py-2.5 text-sm outline-none font-sans text-text placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !inputText.trim()}
              className="w-10 h-10 rounded-full bg-accent1 text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Invest Panel */}
        <div className="lg:w-[340px] bg-white rounded-card shadow-card p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-text mb-1">💵 Investitionsabsicht</h2>
            <p className="text-xs text-gray-400">Wählen Sie einen Betrag oder geben Sie einen eigenen ein</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {INVESTMENT_OPTIONS.map(opt => (
              <button
                key={opt.amount}
                onClick={() => { setSelectedAmount(opt.amount); setCustomAmount('') }}
                className={`p-3 rounded-2xl border-2 text-left transition ${
                  selectedAmount === opt.amount && !customAmount
                    ? 'border-accent1 bg-accent1/5'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <p className="font-bold text-text text-sm">
                  € {opt.amount.toLocaleString('de-DE')}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.label}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1">Eigener Betrag (€)</label>
            <input
              type="number"
              value={customAmount}
              onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
              placeholder="z.B. 15000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans"
            />
          </div>

          {(selectedAmount || customAmount) && (
            <div className="bg-accent1/5 rounded-xl p-3 text-sm">
              <p className="text-accent1 font-semibold">
                Ausgewählt: € {(customAmount ? parseFloat(customAmount) : selectedAmount ?? 0).toLocaleString('de-DE')}
              </p>
            </div>
          )}

          <button
            onClick={sendInvestIntent}
            disabled={investSending || (!selectedAmount && !customAmount)}
            className="w-full rounded-full py-3 font-semibold text-sm text-white transition disabled:opacity-40"
            style={{ background: '#E5844E' }}
          >
            {investSending ? 'Wird gesendet...' : 'Investitionsabsicht senden →'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Dies ist eine unverbindliche Interessensbekundung. Kein rechtlich bindendes Angebot.
          </p>
        </div>
      </div>
    </div>
  )
}
