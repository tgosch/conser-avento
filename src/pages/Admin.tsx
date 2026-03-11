import { useEffect, useState } from 'react'
import { Download, Upload, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Investor, Message, InvestmentIntent } from '../lib/supabase'
import { toast } from 'react-toastify'

type Tab = 'investoren' | 'investitionen' | 'chat' | 'dokumente'

const PLAN_SECTIONS = [
  { slug: 'pitch-deck', label: 'Pitch-Deck' },
  { slug: 'business-plan', label: 'Business-Plan' },
  { slug: 'finanzplan', label: 'Finanzplan' },
  { slug: 'sales-funnel-endkunden', label: 'Sales Funnel Endkunden' },
  { slug: 'sales-funnel-business', label: 'Sales Funnel Business' },
  { slug: 'persona-endkunde', label: 'Persona Endkunde' },
  { slug: 'persona-businesspartner', label: 'Persona Businesspartner' },
  { slug: 'finanzanalyse', label: 'Detaillierte Finanzanalyse' },
  { slug: 'invest-moeglichkeiten', label: 'Invest & Möglichkeiten' },
  { slug: 'roadmap-kapital', label: 'Roadmap Kapital' },
  { slug: 'sicherheiten', label: 'Sicherheiten & Treuhänder' },
]

interface InvestmentWithInvestor extends InvestmentIntent {
  investors: { first_name: string; last_name: string } | null
}

interface DocMap {
  [section: string]: { file_name: string; file_url: string } | null
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('investoren')

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <span className="bg-accent2/10 text-accent2 text-xs font-semibold px-3 py-1 rounded-full">Admin</span>
        <h1 className="text-3xl font-bold text-text mt-2">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Verwaltung aller Investoren, Investitionen und Dokumente</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-card w-fit mb-6">
        {(['investoren', 'investitionen', 'chat', 'dokumente'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${
              activeTab === tab ? 'bg-accent1 text-white' : 'text-gray-500 hover:text-text'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'investoren' && <InvestorenTab />}
      {activeTab === 'investitionen' && <InvestitionenTab />}
      {activeTab === 'chat' && <ChatTab />}
      {activeTab === 'dokumente' && <DokumenteTab />}
    </div>
  )
}

function InvestorenTab() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('investors')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error('Fehler beim Laden der Investoren')
        setInvestors(data ?? [])
        setLoading(false)
      })
  }, [])

  const exportCSV = () => {
    const headers = ['Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Datum']
    const rows = investors.map(i => [
      i.first_name, i.last_name, i.email, i.phone ?? '', new Date(i.created_at).toLocaleDateString('de-DE'),
    ])
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'investoren.csv'; a.click()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-400">{investors.length} registrierte Investoren</p>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-accent1 text-white rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition">
          <Download size={14} /> CSV Export
        </button>
      </div>
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg text-gray-400 text-left">
              <th className="px-6 py-4 font-semibold">Vorname</th>
              <th className="px-6 py-4 font-semibold">Nachname</th>
              <th className="px-6 py-4 font-semibold">E-Mail</th>
              <th className="px-6 py-4 font-semibold">Telefon</th>
              <th className="px-6 py-4 font-semibold">Datum</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
                  ))}
                </tr>
              ))
            ) : investors.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Noch keine Investoren registriert</td></tr>
            ) : (
              investors.map(inv => (
                <tr key={inv.id} className="border-t border-gray-50 hover:bg-bg/50 transition">
                  <td className="px-6 py-4 font-medium text-text">{inv.first_name}</td>
                  <td className="px-6 py-4 text-text">{inv.last_name}</td>
                  <td className="px-6 py-4 text-gray-500">{inv.email}</td>
                  <td className="px-6 py-4 text-gray-500">{inv.phone ?? '–'}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(inv.created_at).toLocaleDateString('de-DE')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InvestitionenTab() {
  const [items, setItems] = useState<InvestmentWithInvestor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('investment_intents')
      .select('*, investors(first_name, last_name)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error('Fehler beim Laden der Investitionen')
        setItems((data ?? []) as InvestmentWithInvestor[])
        setLoading(false)
      })
  }, [])

  const totalVolume = items.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-400">Gesamtvolumen: <span className="font-bold text-accent1">€ {totalVolume.toLocaleString('de-DE')}</span></p>
      </div>
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg text-gray-400 text-left">
              <th className="px-6 py-4 font-semibold">Investor</th>
              <th className="px-6 py-4 font-semibold">Betrag</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Datum</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
                  ))}
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Noch keine Investitionsabsichten eingegangen</td></tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className="border-t border-gray-50 hover:bg-bg/50 transition">
                  <td className="px-6 py-4 font-medium text-text">
                    {item.investors ? `${item.investors.first_name} ${item.investors.last_name}` : '–'}
                  </td>
                  <td className="px-6 py-4 font-bold text-accent1">€ {item.amount.toLocaleString('de-DE')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.status === 'pending' ? 'Ausstehend' : item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(item.created_at).toLocaleDateString('de-DE')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ChatTab() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    supabase.from('investors').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setInvestors(data ?? []))
  }, [])

  useEffect(() => {
    if (!selectedInvestor) return
    supabase
      .from('messages')
      .select('*')
      .eq('investor_id', selectedInvestor.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data ?? []))

    const channel = supabase.channel(`admin-chat-${selectedInvestor.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `investor_id=eq.${selectedInvestor.id}` },
        payload => setMessages(prev => [...prev, payload.new as Message])
      ).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedInvestor])

  const sendReply = async () => {
    if (!replyText.trim() || !selectedInvestor) return
    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert({
        investor_id: selectedInvestor.id,
        content: replyText.trim(),
        from_admin: true,
      })
      if (error) throw error
      setReplyText('')
    } catch {
      toast.error('Antwort konnte nicht gesendet werden')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex gap-4" style={{ height: 'calc(100vh - 260px)', minHeight: '400px' }}>
      {/* Investor list */}
      <div className="w-64 bg-white rounded-card shadow-card overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-text">Investoren</p>
        </div>
        {investors.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">Keine Investoren</p>
        ) : (
          investors.map(inv => (
            <button
              key={inv.id}
              onClick={() => setSelectedInvestor(inv)}
              className={`flex items-center gap-3 p-4 text-left border-b border-gray-50 hover:bg-bg transition ${
                selectedInvestor?.id === inv.id ? 'bg-accent1/5' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-accent1 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {inv.first_name[0]}{inv.last_name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-text">{inv.first_name} {inv.last_name}</p>
                <p className="text-xs text-gray-400 truncate">{inv.email}</p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white rounded-card shadow-card flex flex-col overflow-hidden">
        {selectedInvestor ? (
          <>
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="font-semibold text-text">{selectedInvestor.first_name} {selectedInvestor.last_name}</p>
              <p className="text-xs text-gray-400">{selectedInvestor.email}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from_admin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                    msg.from_admin ? 'bg-accent1 text-white rounded-br-md' : 'bg-bg text-text rounded-bl-md'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.from_admin ? 'text-white/60' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendReply()}
                placeholder="Antwort schreiben..."
                className="flex-1 bg-bg rounded-full px-4 py-2.5 text-sm outline-none font-sans text-text"
              />
              <button
                onClick={sendReply}
                disabled={sending || !replyText.trim()}
                className="w-10 h-10 rounded-full bg-accent1 text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Wählen Sie einen Investor aus
          </div>
        )}
      </div>
    </div>
  )
}

function DokumenteTab() {
  const [docs, setDocs] = useState<DocMap>({})
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('documents').select('*').then(({ data }) => {
      const map: DocMap = {}
      ;(data ?? []).forEach(d => {
        map[d.section] = { file_name: d.file_name, file_url: d.file_url }
      })
      setDocs(map)
    })
  }, [])

  const handleUpload = async (section: string, file: File) => {
    setUploading(section)
    try {
      const fileName = `${section}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)

      const { error: dbError } = await supabase.from('documents').upsert({
        section, file_name: file.name, file_url: urlData.publicUrl,
      })
      if (dbError) throw dbError

      setDocs(prev => ({ ...prev, [section]: { file_name: file.name, file_url: urlData.publicUrl } }))
      toast.success(`${file.name} erfolgreich hochgeladen`)
    } catch (err) {
      toast.error('Upload fehlgeschlagen')
      console.error(err)
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg text-gray-400 text-left">
            <th className="px-6 py-4 font-semibold">Bereich</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Dateiname</th>
            <th className="px-6 py-4 font-semibold">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {PLAN_SECTIONS.map(section => {
            const doc = docs[section.slug]
            const isUploading = uploading === section.slug
            return (
              <tr key={section.slug} className="border-t border-gray-50 hover:bg-bg/50 transition">
                <td className="px-6 py-4 font-medium text-text">{section.label}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    doc ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {doc ? '✓ Hochgeladen' : 'Ausstehend'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">{doc?.file_name ?? '–'}</td>
                <td className="px-6 py-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      disabled={isUploading}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleUpload(section.slug, file)
                      }}
                    />
                    <span className={`flex items-center gap-1.5 text-xs font-semibold text-accent1 hover:opacity-70 transition ${isUploading ? 'opacity-50' : ''}`}>
                      <Upload size={13} />
                      {isUploading ? 'Lädt...' : doc ? 'Ersetzen' : 'Hochladen'}
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
