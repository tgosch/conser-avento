import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Investor, Message } from '../../lib/supabase'
import { Send } from 'lucide-react'
import { toast } from 'react-toastify'

export default function OwnerChat() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [selected, setSelected] = useState<Investor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('investors').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setInvestors(data as Investor[]) })
  }, [])

  useEffect(() => {
    if (!selected) return
    supabase.from('messages').select('*').eq('investor_id', selected.id).order('created_at')
      .then(({ data }) => { if (data) setMessages(data as Message[]) })

    const channel = supabase.channel(`admin-chat-${selected.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const m = payload.new as Message
        if (m.investor_id === selected.id) setMessages(prev => [...prev, m])
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selected])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendReply = async () => {
    if (!input.trim() || !selected) return
    const { error } = await supabase.from('messages').insert([{ investor_id: selected.id, content: input.trim(), from_admin: true }])
    if (error) toast.error('Fehler beim Senden')
    else setInput('')
  }

  const statusColor: Record<string, string> = { new: '#063D3E', contacted: '#D4662A', negotiating: '#7c3aed' }
  const statusLabel: Record<string, string> = { new: 'Neu', contacted: 'In Kontakt', negotiating: 'Verhandelt' }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Investor-Chat</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ height: '560px' }}>
        {/* Investor List */}
        <div className="rounded-[20px] border overflow-y-auto" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Interessenten ({investors.length})</h3>
          </div>
          {investors.length === 0 ? (
            <p className="text-xs p-4 text-secondary">Noch keine Interessenten</p>
          ) : (
            <div className="p-2">
              {investors.map(inv => (
                <button
                  key={inv.id}
                  onClick={() => setSelected(inv)}
                  className="w-full text-left px-3 py-3 rounded-xl transition hover:bg-surface2"
                  style={{ background: selected?.id === inv.id ? 'var(--surface2)' : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: '#063D3E' }}>
                      {inv.first_name[0]}{inv.last_name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{inv.first_name} {inv.last_name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{inv.email}</p>
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${statusColor[inv.status] || '#6E6E73'}20`, color: statusColor[inv.status] || 'var(--text-secondary)' }}>
                      {statusLabel[inv.status] || inv.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="md:col-span-2 rounded-[20px] border flex flex-col overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Investor auswählen</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Wählen Sie einen Investor aus der Liste</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#063D3E' }}>
                  {selected.first_name[0]}{selected.last_name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{selected.first_name} {selected.last_name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{selected.email}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.from_admin ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[75%] px-4 py-2.5 text-sm"
                      style={{
                        borderRadius: m.from_admin ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: m.from_admin ? '#063D3E' : 'var(--surface2)',
                        color: m.from_admin ? 'white' : 'var(--text-primary)',
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex gap-2 items-center rounded-xl px-3 py-2 border" style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
                  <input
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendReply()}
                    placeholder="Antwort eingeben..."
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: 'var(--text-primary)' }}
                  />
                  <button onClick={sendReply} className="text-accent1 hover:opacity-70 transition"><Send size={16} /></button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
