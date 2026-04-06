import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { Update, Document, Phase, PhaseEntry } from '../../lib/supabase'
import { toast } from 'react-toastify'
import KpiStrip from '../../components/dashboard/KpiStrip'
import PriorityQueue from '../../components/dashboard/PriorityQueue'
import IntroTool from '../../components/dashboard/IntroTool'

export default function OwnerDashboard() {
  const [investorCount, setInvestorCount] = useState(0)
  const [updates, setUpdates] = useState<Update[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [intentCount, setIntentCount] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [partnerCount, setPartnerCount] = useState(0)
  const [docCount, setDocCount] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)

  const [phases, setPhases] = useState<Phase[]>([])
  const [entries, setEntries] = useState<PhaseEntry[]>([])
  const [entryForm, setEntryForm] = useState({ title: '', description: '', date: '' })
  const [addingEntry, setAddingEntry] = useState(false)

  const fetchPhases = () => {
    supabase.from('phases').select('*').order('order_index')
      .then(({ data, error }) => {
        if (error) { toast.error('Phasen laden fehlgeschlagen'); return }
        if (data) setPhases(data as Phase[])
      })
  }
  const fetchEntries = () => {
    supabase.from('phase_entries').select('*').order('date', { ascending: false }).limit(10)
      .then(({ data, error }) => {
        if (error) { toast.error('Einträge laden fehlgeschlagen'); return }
        if (data) setEntries(data as PhaseEntry[])
      })
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [inv, upd, doc, intent, msg, partner, docCnt] = await Promise.all([
          supabase.from('investors').select('*', { count: 'exact', head: true }),
          supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('documents').select('id, name, file_path, category').order('id', { ascending: false }).limit(5),
          supabase.from('investment_intents').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }).eq('from_admin', false),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
          supabase.from('documents').select('id', { count: 'exact', head: true }),
        ])
        if (inv.count !== null) setInvestorCount(20 + (inv.count ?? 0))
        if (upd.data) setUpdates(upd.data)
        if (doc.data) setDocs(doc.data)
        if (intent.count) setIntentCount(intent.count)
        if (msg.count !== null) setUnreadMessages(msg.count ?? 0)
        if (partner.count !== null) setPartnerCount(partner.count ?? 0)
        if (docCnt.count !== null) setDocCount(docCnt.count ?? 0)
      } catch {
        toast.error('Dashboard-Daten konnten nicht geladen werden')
      } finally {
        setPageLoading(false)
      }
    }
    load()
    fetchPhases()
    fetchEntries()
  }, [])

  const assignToPhase = (date: string): string | null => {
    if (!date || phases.length === 0) return null
    const entryDate = new Date(date)
    const match = phases.find(p => {
      if (!p.start_date || !p.end_date) return false
      return entryDate >= new Date(p.start_date) && entryDate <= new Date(p.end_date)
    })
    return match?.id ?? null
  }

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entryForm.title.trim()) return
    setAddingEntry(true)
    try {
      const phaseId = assignToPhase(entryForm.date)
      const { error } = await supabase.from('phase_entries').insert([{
        title: entryForm.title.trim(),
        description: entryForm.description.trim() || null,
        date: entryForm.date || null,
        phase_id: phaseId,
      }])
      if (error) throw error
      toast.success(phaseId
        ? `Eintrag wurde Phase "${phases.find(p => p.id === phaseId)?.name}" zugewiesen`
        : 'Eintrag gespeichert (keine passende Phase gefunden)')
      setEntryForm({ title: '', description: '', date: '' })
      fetchEntries()
    } catch { toast.error('Fehler beim Speichern') }
    finally { setAddingEntry(false) }
  }

  const handleDeleteEntry = async (id: string) => {
    const { error } = await supabase.from('phase_entries').delete().eq('id', id)
    if (error) toast.error('Fehler')
    else { fetchEntries() }
  }

  const getPhaseName = (phaseId: string | null) => {
    if (!phaseId) return null
    return phases.find(p => p.id === phaseId)?.name ?? null
  }

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
  const today = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

  if (pageLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const kpiItems = [
    { label: 'Interessenten', value: investorCount,  color: 'var(--brand)',           icon: '👥' },
    { label: 'Vorschläge',    value: intentCount,    color: 'var(--accent)',           icon: '💼' },
    { label: 'Ungelesen',     value: unreadMessages, color: unreadMessages > 0 ? 'var(--danger)' : 'var(--text-tertiary)', icon: '💬', urgent: unreadMessages > 0 },
    { label: 'Partner',       value: partnerCount,   color: 'var(--brand)',            icon: '🤝' },
    { label: 'Dokumente',     value: docCount,       color: 'var(--text-secondary)',   icon: '📄' },
    { label: 'Phase',         value: 'Phase 1',      color: 'var(--info)',             icon: '🚀', isText: true },
  ]

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">

      {/* GREETING */}
      <div className="mb-6">
        <p className="label-overline mb-1">{today}</p>
        <h1 className="font-bold text-2xl md:text-3xl mb-1"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: 'var(--font-body)' }}>
          {greeting}, Torben 👋
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {investorCount} Interessenten · {intentCount} Vorschläge
          </p>
          {unreadMessages > 0 && (
            <Link to="/owner/chat"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition hover-press"
              style={{ background: 'var(--danger-dim)', color: 'var(--danger)' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--danger)' }} />
              {unreadMessages} ungelesen
            </Link>
          )}
        </div>
      </div>

      <KpiStrip items={kpiItems} />
      <PriorityQueue unreadMessages={unreadMessages} updates={updates} partnerCount={partnerCount} />

      {/* 2-COLUMN: Updates + Docs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 animate-fade-up delay-3">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Letzte Updates</h3>
            <Link to="/owner/updates" className="text-xs font-semibold hover-press" style={{ color: 'var(--brand)' }}>Alle →</Link>
          </div>
          {updates.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Noch keine Updates</p>
          ) : (
            <div className="flex flex-col">
              {updates.map((u, i) => (
                <div key={u.id} className={`flex items-center justify-between py-2.5 ${i < updates.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium truncate flex-1 mr-3" style={{ color: 'var(--text-primary)' }}>{u.title}</span>
                  <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(u.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Zuletzt hochgeladen</h3>
            <Link to="/owner/docs" className="text-xs font-semibold hover-press" style={{ color: 'var(--brand)' }}>Alle →</Link>
          </div>
          {docs.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Noch keine Dokumente</p>
          ) : (
            <div className="flex flex-col">
              {docs.map((d, i) => (
                <div key={d.id} className={`flex items-center justify-between py-2.5 ${i < docs.length - 1 ? 'border-b' : ''}`}
                  style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-medium truncate flex-1 mr-3" style={{ color: 'var(--text-primary)' }}>
                    {d.name || d.file_name || d.section || 'Dokument'}
                  </span>
                  <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {d.updated_at ? new Date(d.updated_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <IntroTool
        phases={phases}
        entries={entries}
        entryForm={entryForm}
        setEntryForm={setEntryForm}
        addingEntry={addingEntry}
        onAddEntry={handleAddEntry}
        onDeleteEntry={handleDeleteEntry}
        assignToPhase={assignToPhase}
        getPhaseName={getPhaseName}
      />

      {/* ÖKOSYSTEM-STATUS */}
      <div className="mt-6 animate-fade-up delay-4">
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          Ökosystem · Live-Module
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Conser Shop', status: 'Live', color: '#C8611A', href: 'https://www.conser-gosch.de' },
            { name: 'SpaceAI', status: 'Live', color: '#8B5CF6', href: 'https://spaceai-henna.vercel.app' },
            { name: 'BauDoku AI', status: 'Live', color: '#0EA5E9', href: 'https://baudoku-ai.vercel.app' },
            { name: 'BuchBalance', status: 'Live', color: '#1D5EA8', href: null },
          ].map(m => (
            <a key={m.name} href={m.href ?? undefined} target={m.href ? '_blank' : undefined} rel={m.href ? 'noopener noreferrer' : undefined}
              className="card p-4 no-underline hover:translate-y-[-1px] transition-all"
              style={{ borderLeft: `3px solid ${m.color}` }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>{m.status}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* INFRASTRUKTUR */}
      <div className="mt-4 animate-fade-up delay-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Bankpartner', desc: 'Deutsche Großbank · NDA' },
            { title: 'Payment', desc: 'PCI-DSS Level 1' },
            { title: 'Hosting', desc: 'EU-Server · Frankfurt' },
            { title: 'Rechtsform', desc: 'UG · HRB 22177' },
          ].map(t => (
            <div key={t.title} className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <p className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
              <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
