import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { TeamMember, Partner } from '../../lib/supabase'
import { Building2, CheckCircle, Clock, Code2, ChevronDown, Users, Handshake, Plus, Pencil, X, Check } from 'lucide-react'
import { toast } from 'react-toastify'

/* ─── Static company data ─────────────────────────────────────── */
const HOLDING = { name: 'Bautech Holding GmbH', description: 'Muttergesellschaft · Strategische Steuerung' }

const COMPANIES = [
  { name: 'Conser GmbH',  description: 'Digitaler Marktplatz für Baustoffe & Handwerk', status: 'Gegründet',    statusColor: '#34C759', statusBg: 'rgba(52,199,89,0.12)',  accent: '#063D3E', icon: '🏗️' },
  { name: 'Avento GmbH',  description: 'B2B Software-Plattform für die Baubranche',      status: 'In Gründung', statusColor: '#FF9500', statusBg: 'rgba(255,149,0,0.12)',  accent: '#D4662A', icon: '💻' },
]

/* ─── Inline editable field ───────────────────────────────────── */
function EditableField({
  value,
  onSave,
  multiline = false,
}: {
  value: string
  onSave: (v: string) => void
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value)

  const commit = () => { onSave(draft.trim() || value); setEditing(false) }

  if (!editing) {
    return (
      <span
        className="cursor-pointer hover:bg-gray-50 px-1 rounded transition group inline-flex items-center gap-1"
        onClick={() => { setDraft(value); setEditing(true) }}
      >
        {value}
        <Pencil size={11} className="opacity-0 group-hover:opacity-60 transition" style={{ color: '#999' }} />
      </span>
    )
  }

  return multiline ? (
    <div className="flex flex-col gap-1">
      <textarea
        autoFocus value={draft} onChange={e => setDraft(e.target.value)} rows={3}
        className="text-sm border rounded-lg px-2 py-1 outline-none resize-none w-full"
        style={{ borderColor: '#0066FF', color: '#000', background: '#FAFFFE' }}
        onKeyDown={e => { if (e.key === 'Escape') setEditing(false) }}
      />
      <div className="flex gap-1">
        <button onClick={commit} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-white" style={{ background: '#34C759' }}>
          <Check size={10} /> Speichern
        </button>
        <button onClick={() => setEditing(false)} className="px-2 py-1 rounded-lg text-xs" style={{ background: '#F3F4F6', color: '#666' }}>
          <X size={10} />
        </button>
      </div>
    </div>
  ) : (
    <input
      autoFocus type="text" value={draft} onChange={e => setDraft(e.target.value)}
      className="text-sm border rounded-lg px-2 py-1 outline-none"
      style={{ borderColor: '#0066FF', color: '#000', background: '#FAFFFE', width: '100%' }}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
      onBlur={commit}
    />
  )
}

/* ─── Team Member Card ────────────────────────────────────────── */
function TeamCard({
  member,
  onUpdate,
  onDelete,
}: {
  member: TeamMember
  onUpdate: (id: string, field: string, value: string | number) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="rounded-[18px] p-5 border" style={{ background: '#FFF', borderColor: '#E5E7EB' }}>
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0"
          style={{ background: member.color }}
        >
          {member.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: '#000' }}>
            <EditableField value={member.name} onSave={v => onUpdate(member.id, 'name', v)} />
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>
            <EditableField value={member.role} onSave={v => onUpdate(member.id, 'role', v)} />
          </p>
        </div>
        <button
          onClick={() => onDelete(member.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition shrink-0"
        >
          <Trash2Icon />
        </button>
      </div>

      {member.bio && (
        <p className="text-xs leading-relaxed mb-3" style={{ color: '#666' }}>
          <EditableField value={member.bio} onSave={v => onUpdate(member.id, 'bio', v)} multiline />
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${member.color}22`, color: member.color }}
        >
          {member.type === 'founder' ? 'Gründer' : member.type === 'external' ? 'Extern' : 'Team'}
        </span>
        {member.equity_percent > 0 && (
          <span className="text-xs font-bold" style={{ color: '#063D3E' }}>{member.equity_percent}% Anteile</span>
        )}
      </div>
    </div>
  )
}

function Trash2Icon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  )
}

/* ─── Partner Card ────────────────────────────────────────────── */
function PartnerCard({
  partner,
  onDelete,
}: {
  partner: Partner
  onDelete: (id: string) => void
}) {
  const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
    active:        { label: 'Aktiv',         color: '#34C759', bg: 'rgba(52,199,89,0.12)'    },
    beta:          { label: 'Beta',           color: '#007AFF', bg: 'rgba(0,122,255,0.12)'    },
    negotiating:   { label: 'In Verh.',       color: '#FF9500', bg: 'rgba(255,149,0,0.12)'    },
    partner:       { label: 'Partner',        color: '#5856D6', bg: 'rgba(88,86,214,0.12)'    },
  }
  const sm = statusMeta[partner.status] ?? statusMeta.active

  return (
    <div className="rounded-[18px] p-5 border" style={{ background: '#FFF', borderColor: '#E5E7EB' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: partner.color }}
          >
            {partner.initials}
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: '#000' }}>{partner.name}</p>
            <p className="text-xs" style={{ color: '#666' }}>{partner.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sm.bg, color: sm.color }}>
            {sm.label}
          </span>
          <button onClick={() => onDelete(partner.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition ml-1">
            <Trash2Icon />
          </button>
        </div>
      </div>
      {partner.description && (
        <p className="text-xs leading-relaxed" style={{ color: '#666' }}>{partner.description}</p>
      )}
    </div>
  )
}

/* ─── Add Team Member Form ────────────────────────────────────── */
function AddTeamForm({ onAdded }: { onAdded: () => void }) {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', bio: '', initials: '', color: '#063D3E', type: 'team', equity_percent: 0 })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) return
    setSaving(true)
    const { error } = await supabase.from('team_members').insert({
      name: form.name.trim(),
      role: form.role.trim(),
      bio: form.bio.trim() || null,
      initials: form.initials.trim() || form.name.slice(0, 2).toUpperCase(),
      color: form.color,
      type: form.type,
      equity_percent: form.equity_percent,
      visible: true,
      order_index: 99,
    })
    if (error) toast.error(error.message)
    else { toast.success('Hinzugefügt'); setForm({ name: '', role: '', bio: '', initials: '', color: '#063D3E', type: 'team', equity_percent: 0 }); setShow(false); onAdded() }
    setSaving(false)
  }

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition hover:bg-gray-50"
        style={{ borderColor: '#E5E7EB', color: '#0066FF', borderStyle: 'dashed' }}
      >
        <Plus size={14} /> Person hinzufügen
      </button>
    )
  }

  return (
    <div className="rounded-[18px] p-5 border" style={{ background: '#F8FAFF', borderColor: '#0066FF33' }}>
      <p className="font-semibold text-sm mb-3" style={{ color: '#000' }}>Neue Person</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="col-span-2 px-3 py-2 rounded-xl border text-sm outline-none"
          style={{ borderColor: '#E5E7EB', color: '#000', background: '#FFF' }} />
        <input placeholder="Rolle *" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          className="px-3 py-2 rounded-xl border text-sm outline-none"
          style={{ borderColor: '#E5E7EB', color: '#000', background: '#FFF' }} />
        <input placeholder="Kürzel (TG)" value={form.initials} onChange={e => setForm(f => ({ ...f, initials: e.target.value.slice(0, 3).toUpperCase() }))}
          className="px-3 py-2 rounded-xl border text-sm outline-none"
          style={{ borderColor: '#E5E7EB', color: '#000', background: '#FFF' }} />
        <textarea placeholder="Bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={2}
          className="col-span-2 px-3 py-2 rounded-xl border text-sm outline-none resize-none"
          style={{ borderColor: '#E5E7EB', color: '#000', background: '#FFF' }} />
      </div>
      <div className="flex items-center gap-2">
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          className="px-3 py-2 rounded-xl border text-xs outline-none"
          style={{ borderColor: '#E5E7EB', color: '#000', background: '#FFF' }}>
          <option value="founder">Gründer</option>
          <option value="team">Team</option>
          <option value="external">Extern</option>
        </select>
        <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
          className="w-9 h-9 rounded-xl border cursor-pointer"
          style={{ borderColor: '#E5E7EB', padding: 2 }} />
        <div className="flex gap-1.5 ml-auto">
          <button onClick={() => setShow(false)} className="px-3 py-2 rounded-xl text-xs border" style={{ borderColor: '#E5E7EB', color: '#666' }}>
            Abbrechen
          </button>
          <button onClick={handleSave} disabled={saving || !form.name.trim()}
            className="px-4 py-2 rounded-xl text-xs text-white font-semibold disabled:opacity-50"
            style={{ background: '#0066FF' }}>
            {saving ? '…' : 'Hinzufügen'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Tab Bar ─────────────────────────────────────────────────── */
type Tab = 'struktur' | 'team' | 'partner'

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'struktur', label: 'Struktur',  Icon: Building2  },
  { id: 'team',     label: 'Team',      Icon: Users      },
  { id: 'partner',  label: 'Partner',   Icon: Handshake  },
]

/* ─── Main ───────────────────────────────────────────────────── */
export default function OwnerStructure() {
  const [tab, setTab]           = useState<Tab>('struktur')
  const [members, setMembers]   = useState<TeamMember[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchMembers  = () => supabase.from('team_members').select('*').order('order_index').then(({ data }) => { if (data) setMembers(data as TeamMember[]) })
  const fetchPartners = () => supabase.from('partners').select('*').order('order_index').then(({ data }) => { if (data) setPartners(data as Partner[]) })

  useEffect(() => { fetchMembers(); fetchPartners() }, [])

  const updateMember = async (id: string, field: string, value: string | number) => {
    const { error } = await supabase.from('team_members').update({ [field]: value }).eq('id', id)
    if (error) toast.error(error.message)
    else setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const deleteMember = async (id: string) => {
    if (!confirm('Person löschen?')) return
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Gelöscht'); setMembers(prev => prev.filter(m => m.id !== id)) }
  }

  const deletePartner = async (id: string) => {
    if (!confirm('Partner löschen?')) return
    const { error } = await supabase.from('partners').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Gelöscht'); setPartners(prev => prev.filter(p => p.id !== id)) }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#000' }}>Unternehmensstruktur</h1>
      <p className="text-sm mb-6" style={{ color: '#666' }}>Holding-Struktur, Gründerteam & Partner verwalten</p>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 border-b pb-0" style={{ borderColor: '#E5E7EB' }}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all"
            style={{
              borderBottomColor: tab === id ? '#063D3E' : 'transparent',
              color: tab === id ? '#063D3E' : '#999',
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── Struktur Tab ── */}
      {tab === 'struktur' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Gesellschaftsform', value: 'GmbH' },
              { label: 'Sitz',              value: 'Deutschland' },
              { label: 'Gründungsjahr',     value: '2025' },
            ].map(s => (
              <div key={s.label} className="rounded-[16px] p-4 border" style={{ background: '#FFF', borderColor: '#E5E7EB' }}>
                <p className="text-xs mb-1" style={{ color: '#999' }}>{s.label}</p>
                <p className="font-bold text-sm" style={{ color: '#000' }}>{s.value}</p>
              </div>
            ))}
          </div>

          <h2 className="font-bold text-sm mb-4" style={{ color: '#000' }}>Holding-Hierarchie</h2>

          {/* Bautech Holding */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xs rounded-[18px] p-5 border-2 text-center"
              style={{ background: '#1C1C1E', borderColor: '#363636' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: 'rgba(255,255,255,0.12)' }}>
                <Building2 size={20} color="white" />
              </div>
              <p className="font-bold text-sm text-white">{HOLDING.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{HOLDING.description}</p>
            </div>

            {/* Connector */}
            <div className="w-px h-8" style={{ background: '#E5E7EB' }} />

            {/* Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
              {COMPANIES.map(c => (
                <div key={c.name} className="rounded-[18px] p-5 border cursor-pointer transition-all hover:shadow-md"
                  style={{ background: '#FFF', borderColor: '#E5E7EB' }}
                  onClick={() => setExpanded(expanded === c.name ? null : c.name)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${c.accent}18` }}>{c.icon}</div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: '#000' }}>{c.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#666' }}>{c.description}</p>
                      </div>
                    </div>
                    <ChevronDown size={15} style={{
                      color: '#999',
                      transform: expanded === c.name ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }} />
                  </div>
                  <div className="flex items-center gap-2">
                    {c.status === 'Gegründet'
                      ? <CheckCircle size={13} style={{ color: c.statusColor }} />
                      : <Clock size={13} style={{ color: c.statusColor }} />
                    }
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: c.statusBg, color: c.statusColor }}>{c.status}</span>
                  </div>
                  {expanded === c.name && (
                    <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: '#F3F4F6', color: '#666' }}>
                      Sitz: Deutschland · Rechtsform: GmbH · Gründungsjahr: 2025
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Code Ara */}
            <div className="w-full rounded-[18px] p-5 border" style={{ background: '#FFF', borderColor: '#E5E7EB' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(45,106,79,0.12)' }}>
                  <Code2 size={18} style={{ color: '#2d6a4f' }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#000' }}>Code Ara GmbH</p>
                  <p className="text-xs" style={{ color: '#666' }}>Strategischer Entwicklungspartner · 10% Anteile</p>
                </div>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(45,106,79,0.12)', color: '#2d6a4f' }}>Entwickler</span>
              </div>
              <p className="text-xs" style={{ color: '#666' }}>
                Code Ara GmbH verantwortet die technische Umsetzung und hält 10% als strategische Beteiligung.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Team Tab ── */}
      {tab === 'team' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {members.map(m => (
              <TeamCard key={m.id} member={m} onUpdate={updateMember} onDelete={deleteMember} />
            ))}
          </div>
          <AddTeamForm onAdded={fetchMembers} />
        </div>
      )}

      {/* ── Partner Tab ── */}
      {tab === 'partner' && (
        <div>
          {partners.length === 0 ? (
            <div className="rounded-[20px] border p-12 text-center" style={{ background: '#FFF', borderColor: '#E5E7EB' }}>
              <p className="text-2xl mb-3">🤝</p>
              <p className="font-semibold text-sm" style={{ color: '#000' }}>Noch keine Partner</p>
              <p className="text-xs mt-1" style={{ color: '#999' }}>Partner werden in der Supabase `partners`-Tabelle verwaltet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partners.map(p => (
                <PartnerCard key={p.id} partner={p} onDelete={deletePartner} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
