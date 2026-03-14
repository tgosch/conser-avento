import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SESSION_LIMIT = 30 // max messages per browser session

export default function AiChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const msgCount = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    if (!input.trim() || loading) return
    if (msgCount.current >= SESSION_LIMIT) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sitzungslimit erreicht. Bitte Seite neu laden.' }])
      return
    }
    msgCount.current += 1
    const userMsg: ChatMessage = { role: 'user', content: input.trim().slice(0, 2000) } // cap input length
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMsg]
      // API-Key wird NIEMALS im Browser verwendet — Proxy via /api/chat (Vercel Edge Function)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Du bist ein professioneller KI-Assistent für das Investor-Portal von Avento & Conser.

Avento Software: B2B Software-Unternehmen, gegründet von Torben Gosch (CEO), Martin Groote (CTO) und Paul Bockting (UI/UX).
Conser GmbH: Bereits gegründetes Unternehmen. Avento GmbH: In Gründung. Beide unter der Bautech Holding.
Code Ara GmbH ist strategischer Entwicklungspartner (10% Anteile).

Du beantwortest Fragen zu:
- Den Unternehmen Avento Software und Conser GmbH sowie der Bautech Holding
- Dem Gründerteam (Torben Gosch CEO, Martin Groote CTO, Paul Bockting UI/UX)
- Dem Geschäftsmodell, der Technologie und der Wachstumsstrategie
- Dem aktuellen Entwicklungsstand, Phasen und Meilensteinen
- Partnern, Beta-Nutzern und Produktionsprozessen

Wichtig: Mache KEINE Investitionsvorschläge, empfehle KEINE Investitionssummen und schlage KEINE Beteiligungsmodelle vor. Verweise bei Fragen zu Investitionen auf den direkten Kontakt mit dem Team.
Antworte professionell, präzise und auf Deutsch. Bei spezifischen Zahlen verweise auf die Dokumente im Portal.`,
          messages: history,
        }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Entschuldigung, keine Antwort erhalten.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Fehler beim Verbinden. Bitte erneut versuchen.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-50 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg2 hover:opacity-90 transition-transform hover:scale-105"
        style={{ background: '#063D3E', bottom: 'var(--fab-bottom)', right: '16px' }}
      >
        <MessageCircle size={24} />
      </button>

      {open && (
        <div
          className="fixed z-50 rounded-[20px] flex flex-col overflow-hidden border"
          style={{
            width: 'min(380px, calc(100vw - 24px))',
            height: 'min(500px, calc(100dvh - var(--bottom-nav-height) - 100px))',
            bottom: 'calc(var(--fab-bottom) + 64px)',
            right: '16px',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-lg)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: '#063D3E' }}>
            <div>
              <p className="text-white text-sm font-semibold">KI-Assistent</p>
              <p className="text-white/60 text-xs">Avento & Conser</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="text-center mt-8">
                <div className="text-4xl mb-3">🤖</div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Wie kann ich helfen?</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Fragen zu Avento & Conser, Investitionen oder dem Gründerteam</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[80%] px-3 py-2 text-sm leading-relaxed"
                  style={{
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.role === 'user' ? '#063D3E' : 'var(--surface2)',
                    color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2.5 rounded-[18px_18px_18px_4px]" style={{ background: 'var(--surface2)' }}>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-2 items-center rounded-xl px-3 py-2 border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Nachricht eingeben..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
              <button onClick={send} disabled={!input.trim() || loading} className="text-accent1 hover:opacity-70 disabled:opacity-30 transition">
                <Send size={16} />
              </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Powered by Claude · Anthropic</p>
          </div>
        </div>
      )}
    </>
  )
}
