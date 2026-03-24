import { useEffect, useMemo, useRef, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { Investor, Message } from '../../lib/supabase'
import { Send, ArrowLeft, Search, Circle } from 'lucide-react'
import { toast } from 'react-toastify'

export default function OwnerChat() {
  const [investors, setInvestors] = useState<Investor[]>([])
  // filtered is derived via useMemo below
  const [selected, setSelected] = useState<Investor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [unread, setUnread] = useState<Record<string, boolean>>({})
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // On mobile: show list or chat
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')

  useEffect(() => {
    supabase.from('investors').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setInvestors(data as Investor[])
          // investors state drives filtered via useMemo
        }
      })
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return q ? investors.filter(inv =>
      `${inv.first_name} ${inv.last_name} ${inv.email}`.toLowerCase().includes(q)
    ) : investors
  }, [search, investors])

  useEffect(() => {
    if (!selected) return
    // Load messages
    supabase.from('messages').select('*').eq('investor_id', selected.id).order('created_at')
      .then(({ data }) => {
        if (data) {
          setMessages(data as Message[])
          // Mark as read
          setUnread(prev => ({ ...prev, [selected.id]: false }))
        }
      })

    const channel = supabase.channel(`owner-chat-${selected.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `investor_id=eq.${selected.id}`,
      }, payload => {
        const m = payload.new as Message
        setMessages(prev => [...prev, m])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selected])

  // Global listener for new investor messages (unread indicator)
  useEffect(() => {
    const channel = supabase.channel('owner-all-messages')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
      }, payload => {
        const m = payload.new as Message
        if (!m.from_admin && m.investor_id !== selected?.id) {
          setUnread(prev => ({ ...prev, [m.investor_id]: true }))
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selected])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendReply = async () => {
    if (!input.trim() || !selected) return
    const text = input.trim()
    setInput('')
    const { error } = await supabase.from('messages').insert([{
      investor_id: selected.id,
      content: text,
      from_admin: true,
    }])
    if (error) toast.error('Fehler beim Senden')
    else inputRef.current?.focus()
  }

  const selectInvestor = (inv: Investor) => {
    setSelected(inv)
    setMessages([])
    setMobileView('chat')
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    new:         { label: 'Neu',          color: '#063D3E', bg: 'rgba(6,61,62,0.1)' },
    contacted:   { label: 'In Kontakt',   color: '#D4662A', bg: 'rgba(212,102,42,0.1)' },
    negotiating: { label: 'Verhandlung',  color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  }

  const InvestorList = (
    <div className="flex flex-col h-full">
      {/* List Header */}
      <div className="px-4 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Interessenten
            <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
              {investors.length}
            </span>
          </h2>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 rounded-[10px] px-3 py-2 border"
          style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Suchen…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="text-xs p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            {search ? 'Keine Treffer' : 'Noch keine Interessenten'}
          </p>
        ) : (
          filtered.map(inv => {
            const sc = statusConfig[inv.status] || { label: inv.status, color: '#6E6E73', bg: 'rgba(110,110,115,0.1)' }
            const isActive = selected?.id === inv.id
            const hasUnread = unread[inv.id]
            return (
              <button
                key={inv.id}
                onClick={() => selectInvestor(inv)}
                className="w-full text-left px-3 py-3 rounded-[12px] transition mb-0.5 flex items-center gap-3"
                style={{ background: isActive ? 'var(--surface2)' : 'transparent' }}>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: '#063D3E' }}>
                  {inv.first_name[0]}{inv.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {inv.first_name} {inv.last_name}
                    </p>
                    {hasUnread && (
                      <Circle size={6} fill="#D4662A" style={{ color: '#D4662A' }} />
                    )}
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{inv.email}</p>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 inline-block"
                    style={{ background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )

  const ChatWindow = (
    <div className="flex flex-col h-full">
      {!selected ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--surface2)' }}>
              <span className="text-2xl">💬</span>
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Investor auswählen</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Wählen Sie links einen Investor</p>
          </div>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
            {/* Mobile back */}
            <button
              onClick={() => setMobileView('list')}
              className="md:hidden mr-1 p-1 rounded-lg transition hover:bg-surface2">
              <ArrowLeft size={18} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: '#063D3E' }}>
              {selected.first_name[0]}{selected.last_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {selected.first_name} {selected.last_name}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{selected.email}</p>
            </div>
            {/* Status badge */}
            {(() => {
              const sc = statusConfig[selected.status] || { label: selected.status, color: '#6E6E73', bg: 'rgba(110,110,115,0.1)' }
              return (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: sc.bg, color: sc.color }}>
                  {sc.label}
                </span>
              )
            })()}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Noch keine Nachrichten</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Schreiben Sie dem Investor</p>
              </div>
            )}
            {messages.map((m, idx) => {
              const isProposal = m.content.startsWith('[Investitionsvorschlag]')
              const prevSame = idx > 0 && messages[idx - 1].from_admin === m.from_admin
              return (
                <div key={m.id} className={`flex ${m.from_admin ? 'justify-end' : 'justify-start'} ${prevSame ? 'mt-0.5' : 'mt-2'}`}>
                  <div
                    className="max-w-[75%] px-4 py-2.5 text-sm"
                    style={{
                      borderRadius: m.from_admin
                        ? (prevSame ? '18px 4px 14px 18px' : '18px 4px 18px 18px')
                        : (prevSame ? '4px 18px 18px 14px' : '4px 18px 18px 18px'),
                      background: m.from_admin ? '#063D3E' : 'var(--surface2)',
                      color: m.from_admin ? 'white' : 'var(--text-primary)',
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
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendReply()}
                placeholder="Antwort eingeben…"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                onClick={sendReply}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 transition disabled:opacity-30"
                style={{ background: '#063D3E' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto animate-fade-up" style={{ height: 'calc(100dvh - var(--topbar-height) - var(--bottom-nav-total) - 2rem)' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Investor-Chat</h1>

      {/* Desktop: side-by-side; Mobile: single view */}
      <div className="card overflow-hidden" style={{
        height: 'calc(100% - 52px)',
      }}>
        {/* Mobile */}
        <div className="flex h-full md:hidden">
          {mobileView === 'list' ? InvestorList : ChatWindow}
        </div>

        {/* Desktop */}
        <div className="hidden md:grid h-full" style={{ gridTemplateColumns: '260px 1fr' }}>
          <div className="border-r h-full overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            {InvestorList}
          </div>
          <div className="h-full overflow-hidden">
            {ChatWindow}
          </div>
        </div>
      </div>
    </div>
  )
}
