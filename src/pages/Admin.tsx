import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Download, Upload, Send, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Investor, Message, InvestmentIntent, Update } from '../lib/supabase'
import { toast } from 'react-toastify'

type Tab = 'uebersicht' | 'investoren' | 'investitionen' | 'chat' | 'updates' | 'dokumente'

const PLAN_SECTIONS = [
  { slug: 'pitch-deck',              label: 'Pitch-Deck' },
  { slug: 'business-plan',           label: 'Business-Plan' },
  { slug: 'finanzplan',              label: 'Finanzplan' },
  { slug: 'sales-funnel-endkunden',  label: 'Sales Funnel Endkunden' },
  { slug: 'sales-funnel-business',   label: 'Sales Funnel Business' },
  { slug: 'persona-endkunde',        label: 'Persona Endkunde' },
  { slug: 'persona-businesspartner', label: 'Persona Businesspartner' },
  { slug: 'finanzanalyse',           label: 'Detaillierte Finanzanalyse' },
  { slug: 'invest-moeglichkeiten',   label: 'Invest & Möglichkeiten' },
  { slug: 'roadmap-kapital',         label: 'Roadmap Kapital' },
  { slug: 'sicherheiten',            label: 'Sicherheiten & Treuhänder' },
]

interface InvestmentRow extends InvestmentIntent {
  investors: { first_name: string; last_name: string } | null
}

interface DocMap { [s: string]: { file_name: string; file_url: string } | null }

const TABS: { key: Tab; label: string }[] = [
  { key: 'uebersicht',   label: 'Übersicht' },
  { key: 'investoren',   label: 'Investoren' },
  { key: 'investitionen', label: 'Investitionen' },
  { key: 'chat',         label: 'Chat' },
  { key: 'updates',      label: 'Updates' },
  { key: 'dokumente',    label: 'Dokumente' },
]

export default function Admin() {
  const [tab, setTab] = useState<Tab>('uebersicht')

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="label-tag px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(212,102,42,0.12)', color: '#D4662A' }}>
          Administrator
        </span>
        <h1 className="text-3xl font-bold text-text">Admin Dashboard</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-surface rounded-[16px] p-1 w-fit shadow-sm2 mb-7 border border-black/5 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition ${
              tab === t.key ? 'text-white shadow-sm2' : 'text-secondary hover:text-text'
            }`}
            style={tab === t.key ? { background: '#063D3E' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'uebersicht'   && <UebersichtTab />}
      {tab === 'investoren'   && <InvestorenTab />}
      {tab === 'investitionen' && <InvestitionenTab />}
      {tab === 'chat'         && <ChatTab />}
      {tab === 'updates'      && <UpdatesTab />}
      {tab === 'dokumente'    && <DokumenteTab />}
    </div>
  )
}

/* ── ÜBERSICHT ── */
function UebersichtTab() {
  const [data, setData] = useState({ investors: 0, volume: 0, messages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('investors').select('*', { count: 'exact', head: true }),
      supabase.from('investment_intents').select('amount'),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
    ]).then(([inv, vol, msg]) => {
      setData({
        investors: inv.count ?? 0,
        volume: (vol.data ?? []).reduce((s, r) => s + r.amount, 0),
        messages: msg.count ?? 0,
      })
      setLoading(false)
    })
  }, [])

  const cards = [
    { icon: '👥', label: 'Registrierte Investoren', value: data.investors.toString() },
    { icon: '💰', label: 'Investitionsvolumen',      value: `€ ${data.volume.toLocaleString('de-DE')}` },
    { icon: '💬', label: 'Nachrichten gesamt',       value: data.messages.toString() },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
      {cards.map(c => (
        <div key={c.label} className={`bg-surface rounded-card shadow-sm2 border border-black/5 p-6 ${loading ? 'animate-pulse' : ''}`}>
          <p className="text-secondary text-xs font-semibold flex items-center gap-2 mb-3">
            <span className="text-xl">{c.icon}</span>
            {c.label}
          </p>
          {loading
            ? <div className="h-7 bg-gray-100 rounded w-1/2" />
            : <p className="text-2xl font-bold text-accent1">{c.value}</p>
          }
        </div>
      ))}
    </div>
  )
}

/* ── INVESTOREN ── */
function InvestorenTab() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('investors').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error('Fehler beim Laden')
        setInvestors(data ?? [])
        setLoading(false)
      })
  }, [])

  const exportCSV = () => {
    const rows = [
      ['Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Datum'],
      ...investors.map(i => [i.first_name, i.last_name, i.email, i.phone ?? '', new Date(i.created_at).toLocaleDateString('de-DE')]),
    ]
    const csv = rows.map(r => r.join(';')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    Object.assign(document.createElement('a'), { href: url, download: 'investoren.csv' }).click()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-secondary">{investors.length} registrierte Investoren</p>
        <button onClick={exportCSV} className="flex items-center gap-2 text-white rounded-btn px-4 py-2 text-sm font-semibold hover:opacity-90 transition" style={{ background: '#063D3E' }}>
          <Download size={14} /> CSV Export
        </button>
      </div>
      <AdminTable
        headers={['Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Datum']}
        loading={loading}
        empty="Noch keine Investoren registriert"
      >
        {investors.map(inv => (
          <tr key={inv.id} className="border-t border-black/5 hover:bg-surface2/50 transition">
            <td className="px-5 py-3.5 font-medium text-text text-sm">{inv.first_name}</td>
            <td className="px-5 py-3.5 text-text text-sm">{inv.last_name}</td>
            <td className="px-5 py-3.5 text-secondary text-sm">{inv.email}</td>
            <td className="px-5 py-3.5 text-secondary text-sm">{inv.phone ?? '–'}</td>
            <td className="px-5 py-3.5 text-secondary text-sm">{new Date(inv.created_at).toLocaleDateString('de-DE')}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  )
}

/* ── INVESTITIONEN ── */
function InvestitionenTab() {
  const [items, setItems] = useState<InvestmentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('investment_intents').select('*, investors(first_name, last_name)').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error('Fehler beim Laden')
        setItems((data ?? []) as InvestmentRow[])
        setLoading(false)
      })
  }, [])

  const total = items.reduce((s, i) => s + i.amount, 0)

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-secondary">
          Gesamtvolumen: <span className="font-bold text-accent1">€ {total.toLocaleString('de-DE')}</span>
        </p>
      </div>
      <AdminTable
        headers={['Investor', 'Betrag', 'Status', 'Datum']}
        loading={loading}
        empty="Noch keine Investitionsabsichten eingegangen"
      >
        {items.map(item => (
          <tr key={item.id} className="border-t border-black/5 hover:bg-surface2/50 transition">
            <td className="px-5 py-3.5 font-medium text-text text-sm">
              {item.investors ? `${item.investors.first_name} ${item.investors.last_name}` : '–'}
            </td>
            <td className="px-5 py-3.5 font-bold text-accent1 text-sm">€ {item.amount.toLocaleString('de-DE')}</td>
            <td className="px-5 py-3.5">
              <span className={`label-tag px-2.5 py-1 rounded-full text-xs ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {item.status === 'pending' ? 'Ausstehend' : item.status}
              </span>
            </td>
            <td className="px-5 py-3.5 text-secondary text-sm">{new Date(item.created_at).toLocaleDateString('de-DE')}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  )
}

/* ── CHAT ── */
function ChatTab() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [selected, setSelected] = useState<Investor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('investors').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setInvestors(data ?? []))
  }, [])

  useEffect(() => {
    if (!selected) return
    supabase.from('messages').select('*').eq('investor_id', selected.id).order('created_at')
      .then(({ data }) => setMessages(data ?? []))

    const ch = supabase.channel(`admin-${selected.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `investor_id=eq.${selected.id}` },
        p => setMessages(prev => [...prev, p.new as Message]))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [selected])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendReply = async () => {
    if (!reply.trim() || !selected) return
    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert({ investor_id: selected.id, content: reply.trim(), from_admin: true })
      if (error) throw error
      setReply('')
    } catch { toast.error('Senden fehlgeschlagen') }
    finally { setSending(false) }
  }

  return (
    <div className="flex gap-4" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
      <div className="w-56 bg-surface rounded-card border border-black/5 shadow-sm2 overflow-y-auto flex flex-col">
        <div className="px-4 py-3 border-b border-black/5">
          <p className="text-xs font-bold text-secondary">Investoren ({investors.length})</p>
        </div>
        {investors.length === 0
          ? <p className="p-4 text-xs text-secondary">Keine Investoren</p>
          : investors.map(inv => (
            <button key={inv.id} onClick={() => setSelected(inv)}
              className={`flex items-center gap-3 p-3.5 text-left border-b border-black/4 hover:bg-surface2 transition ${selected?.id === inv.id ? 'bg-accent1/5' : ''}`}
            >
              <div className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ background: '#063D3E' }}>
                {inv.first_name[0]}{inv.last_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text truncate">{inv.first_name} {inv.last_name}</p>
                <p className="text-xs text-secondary truncate">{inv.email}</p>
              </div>
            </button>
          ))
        }
      </div>

      <div className="flex-1 bg-surface rounded-card border border-black/5 shadow-sm2 flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="px-5 py-3.5 border-b border-black/5">
              <p className="font-semibold text-text text-sm">{selected.first_name} {selected.last_name}</p>
              <p className="text-secondary text-xs">{selected.email}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from_admin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm px-4 py-2.5 rounded-[18px] text-sm ${msg.from_admin ? 'text-white rounded-br-[4px]' : 'bg-surface2 text-text rounded-bl-[4px]'}`}
                    style={msg.from_admin ? { background: '#063D3E' } : {}}>
                    <p>{msg.content}</p>
                    <p className={`text-[11px] mt-1 ${msg.from_admin ? 'text-white/50' : 'text-secondary/60'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef as React.RefObject<HTMLDivElement>} />
            </div>
            <div className="p-4 border-t border-black/5 flex gap-2">
              <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()}
                placeholder="Antwort schreiben…"
                className="flex-1 bg-surface2 rounded-full px-4 py-2.5 text-sm outline-none font-sans text-text" />
              <button onClick={sendReply} disabled={sending || !reply.trim()}
                className="w-10 h-10 rounded-full text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-40"
                style={{ background: '#063D3E' }}>
                <Send size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-secondary text-sm">Investor auswählen</div>
        )}
      </div>
    </div>
  )
}

/* ── UPDATES ── */
function UpdatesTab() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', category: 'general' as Update['category'] })

  const load = () => {
    supabase.from('updates').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUpdates((data ?? []) as Update[]); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    setCreating(true)
    try {
      const { error } = await supabase.from('updates').insert({
        title: form.title.trim(), content: form.content.trim(), category: form.category,
      })
      if (error) throw error
      toast.success('Update veröffentlicht')
      setForm({ title: '', content: '', category: 'general' })
      load()
    } catch { toast.error('Fehler beim Erstellen') }
    finally { setCreating(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('updates').delete().eq('id', id)
      if (error) throw error
      setUpdates(prev => prev.filter(u => u.id !== id))
      toast.success('Update gelöscht')
    } catch { toast.error('Löschen fehlgeschlagen') }
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      {/* Create form */}
      <div className="bg-surface rounded-card border border-black/5 shadow-sm2 p-6">
        <h3 className="font-bold text-text mb-4">Neues Update veröffentlichen</h3>
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Titel</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Update-Titel"
              className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans text-text"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Inhalt</label>
            <textarea
              required
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Beschreibung des Updates…"
              rows={3}
              className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans text-text resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Kategorie</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as Update['category'] }))}
              className="bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans text-text"
            >
              <option value="general">Allgemein</option>
              <option value="milestone">Meilenstein</option>
              <option value="important">Wichtig</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="w-full text-white rounded-btn py-2.5 font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 mt-1"
            style={{ background: '#063D3E' }}
          >
            {creating ? 'Wird veröffentlicht…' : 'Update veröffentlichen'}
          </button>
        </form>
      </div>

      {/* Update list */}
      <div className="flex flex-col gap-3">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-card border border-black/5 p-5 animate-pulse shadow-sm2">
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))
          : updates.length === 0
          ? <p className="text-secondary text-sm text-center py-6">Noch keine Updates</p>
          : updates.map(u => (
            <div key={u.id} className="bg-surface rounded-card border border-black/5 shadow-sm2 p-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-secondary mb-1">
                  {new Date(u.created_at).toLocaleDateString('de-DE')} · <span className="capitalize">{u.category}</span>
                </p>
                <p className="font-semibold text-text text-sm">{u.title}</p>
                <p className="text-secondary text-xs mt-1 leading-relaxed">{u.content}</p>
              </div>
              <button
                onClick={() => handleDelete(u.id)}
                className="shrink-0 text-secondary/50 hover:text-red-500 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

/* ── DOKUMENTE ── */
function DokumenteTab() {
  const [docs, setDocs] = useState<DocMap>({})
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('documents').select('*').then(({ data }) => {
      const map: DocMap = {}
      ;(data ?? []).forEach(d => { map[d.section] = { file_name: d.file_name, file_url: d.file_url } })
      setDocs(map)
    })
  }, [])

  const handleUpload = async (section: string, file: File) => {
    setUploading(section)
    try {
      const fileName = `${section}.pdf`
      const { error: upErr } = await supabase.storage.from('documents').upload(fileName, file, { upsert: true })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
      const { error: dbErr } = await supabase.from('documents').upsert({ section, file_name: file.name, file_url: urlData.publicUrl })
      if (dbErr) throw dbErr
      setDocs(prev => ({ ...prev, [section]: { file_name: file.name, file_url: urlData.publicUrl } }))
      toast.success(`${file.name} erfolgreich hochgeladen`)
    } catch { toast.error('Upload fehlgeschlagen') }
    finally { setUploading(null) }
  }

  return (
    <div className="bg-surface rounded-card border border-black/5 shadow-sm2 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface2 text-secondary text-left">
            <th className="px-5 py-3.5 font-semibold text-xs">Bereich</th>
            <th className="px-5 py-3.5 font-semibold text-xs">Status</th>
            <th className="px-5 py-3.5 font-semibold text-xs">Dateiname</th>
            <th className="px-5 py-3.5 font-semibold text-xs">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {PLAN_SECTIONS.map(s => {
            const doc = docs[s.slug]
            const busy = uploading === s.slug
            return (
              <tr key={s.slug} className="border-t border-black/5 hover:bg-surface2/50 transition">
                <td className="px-5 py-3.5 font-medium text-text text-sm">{s.label}</td>
                <td className="px-5 py-3.5">
                  <span className={`label-tag px-2.5 py-1 rounded-full text-xs ${doc ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {doc ? '✓ Hochgeladen' : 'Ausstehend'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-secondary text-xs">{doc?.file_name ?? '–'}</td>
                <td className="px-5 py-3.5">
                  <label className="cursor-pointer">
                    <input type="file" accept=".pdf" className="hidden" disabled={busy}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(s.slug, f) }} />
                    <span className={`flex items-center gap-1.5 text-xs font-semibold text-accent1 hover:opacity-70 transition ${busy ? 'opacity-50' : ''}`}>
                      <Upload size={13} />
                      {busy ? 'Lädt…' : doc ? 'Ersetzen' : 'Hochladen'}
                    </span>
                  </label>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ── SHARED TABLE ── */
function AdminTable({ headers, loading, empty, children }: {
  headers: string[]; loading: boolean; empty: string; children: React.ReactNode
}) {
  return (
    <div className="bg-surface rounded-card border border-black/5 shadow-sm2 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface2 text-secondary text-left">
            {headers.map(h => <th key={h} className="px-5 py-3.5 font-semibold text-xs">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {headers.map((_, j) => (
                  <td key={j} className="px-5 py-3.5"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
                ))}
              </tr>
            ))
            : children
              ? children
              : <tr><td colSpan={headers.length} className="px-5 py-8 text-center text-secondary">{empty}</td></tr>
          }
        </tbody>
      </table>
    </div>
  )
}

