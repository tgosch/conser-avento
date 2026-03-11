import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `Du bist ein hilfreicher KI-Assistent für das Investoren-Portal von Avento & Conser.

Über Avento Software: Software-Unternehmen, gegründet von Torben Gosch (CEO) und Martin Groote (CTO). Spezialisiert auf innovative B2B- und B2C-Softwarelösungen.
Über Conser Market: Marktplatz-Plattform, gleiche Gründer. Verbindet Anbieter und Kunden digital.
Externer Entwicklungspartner: Code Ara GmbH (10% Unternehmensanteile).

Du beantwortest Fragen zu:
- Den Unternehmen Avento und Conser und ihrem Geschäftsmodell
- Investitionsmöglichkeiten (5.000€ bis 50.000€+)
- Dem Gründerteam
- Nächsten Schritten für Investoren
- Dokumenten und Plänen im Portal

Sei professionell, präzise und überzeugend. Antworte immer auf Deutsch. Halte Antworten prägnant (max. 3-4 Sätze). Bei spezifischen Finanzfragen verweise auf die Dokumente im Portal.`

export default function AiChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hallo! Ich bin Ihr KI-Assistent für das Investor-Portal. Wie kann ich Ihnen helfen?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (!apiKey || apiKey === 'HIER_DEINEN_KEY_EINTRAGEN') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'KI-Assistent nicht konfiguriert. Bitte VITE_ANTHROPIC_API_KEY in der .env Datei eintragen.'
        }])
        return
      }

      // Note: Requires anthropic-dangerous-allow-browser header for browser usage
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [...messages, userMsg]
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error?.message ?? `HTTP ${response.status}`)
      }

      const data = await response.json()
      const reply = data.content?.[0]?.text ?? 'Keine Antwort erhalten.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Fehler: ${msg}. Bitte versuchen Sie es erneut.`
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-card hover:opacity-90 transition-all duration-200 hover:scale-105"
        style={{ background: '#063D3E' }}
        aria-label="KI-Assistent öffnen"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat overlay */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 w-[380px] bg-surface rounded-card shadow-card border border-black/5 flex flex-col overflow-hidden slide-up"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/5" style={{ background: '#063D3E' }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">KI-Assistent</p>
              <p className="text-white/50 text-xs">Avento & Conser</p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/50 hover:text-white">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-[16px] text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-[4px]'
                      : 'bg-surface2 text-text rounded-bl-[4px]'
                  }`}
                  style={msg.role === 'user' ? { background: '#063D3E' } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface2 rounded-[16px] rounded-bl-[4px] px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-black/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Frage stellen…"
              className="flex-1 bg-surface2 rounded-full px-4 py-2 text-sm outline-none font-sans text-text placeholder-secondary/60"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full text-white flex items-center justify-center transition hover:opacity-80 disabled:opacity-40 shrink-0"
              style={{ background: '#063D3E' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
