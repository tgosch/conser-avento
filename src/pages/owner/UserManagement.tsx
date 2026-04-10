import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  Users, Search, UserCircle, Mail, Phone, Calendar, Shield,
  Gift, Copy, Plus, Trash2, ChevronDown, ChevronUp,
  Clock, CreditCard, HardDrive, Ban, CheckCircle2,
} from 'lucide-react'

interface UserRow {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  consent: boolean
  nda_accepted: boolean
  created_at: string
  updated_at?: string
  // Computed
  type: 'investor' | 'partner'
  plan?: string
  company?: string
}

interface Coupon {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  max_uses: number
  used_count: number
  valid_until: string | null
  product: string
  active: boolean
  created_at: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tab, setTab] = useState<'users' | 'coupons'>('users')
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [couponForm, setCouponForm] = useState({
    code: '', type: 'percent' as 'percent' | 'fixed', value: 10, max_uses: 1,
    valid_until: '', product: 'all',
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [invRes, partRes, couponRes] = await Promise.all([
        supabase.from('investors').select('*').order('created_at', { ascending: false }),
        supabase.from('partners').select('*').order('created_at', { ascending: false }),
        supabase.from('coupon_codes').select('*').order('created_at', { ascending: false }),
      ])
      const investors: UserRow[] = (invRes.data ?? []).map((i: any) => ({
        ...i, type: 'investor' as const, plan: 'Seed-Investor',
      }))
      const partners: UserRow[] = (partRes.data ?? []).map((p: any) => ({
        id: p.id, first_name: p.name, last_name: '', email: '', phone: '',
        status: p.status, consent: true, nda_accepted: false,
        created_at: p.created_at, type: 'partner' as const,
        plan: p.status, company: p.name,
      }))
      setUsers([...investors, ...partners])
      if (couponRes.data) setCoupons(couponRes.data)
    } catch {
      // Tables may not exist yet
    } finally {
      setLoading(false)
    }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = 'CA-'
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
    setCouponForm(p => ({ ...p, code }))
  }

  const createCoupon = async () => {
    if (!couponForm.code.trim()) { toast.error('Code erforderlich'); return }
    try {
      const { error } = await supabase.from('coupon_codes').insert([{
        code: couponForm.code.trim().toUpperCase(),
        type: couponForm.type,
        value: couponForm.value,
        max_uses: couponForm.max_uses,
        valid_until: couponForm.valid_until || null,
        product: couponForm.product,
      }])
      if (error) throw error
      toast.success('Gutschein erstellt')
      setCouponForm({ code: '', type: 'percent', value: 10, max_uses: 1, valid_until: '', product: 'all' })
      setShowCouponForm(false)
      loadData()
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`)
    }
  }

  const deleteCoupon = async (id: string) => {
    try {
      await supabase.from('coupon_codes').delete().eq('id', id)
      setCoupons(prev => prev.filter(c => c.id !== id))
      toast.success('Gutschein geloescht')
    } catch {
      toast.error('Loeschen fehlgeschlagen')
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Code kopiert')
  }

  const filtered = users.filter(u => {
    const name = `${u.first_name} ${u.last_name}`.toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || u.email?.toLowerCase().includes(q) || u.id.includes(q)
  })

  const daysSince = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    return Math.floor(diff / 86400000)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-bold text-xl md:text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>User-Management</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Nutzer verwalten, Gutscheine erstellen</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Investoren', value: users.filter(u => u.type === 'investor').length, color: '#34C759' },
          { label: 'Partner', value: users.filter(u => u.type === 'partner').length, color: '#8B5CF6' },
          { label: 'Aktive Gutscheine', value: coupons.filter(c => c.active).length, color: '#F59E0B' },
          { label: 'Gesamt', value: users.length, color: 'var(--brand)' },
        ].map(k => (
          <div key={k.label} className="card p-3">
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
            <p className="text-[9px] font-semibold uppercase" style={{ color: k.color }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('users')} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          style={{ background: tab === 'users' ? 'var(--brand)' : 'var(--surface2)', color: tab === 'users' ? 'white' : 'var(--text-secondary)' }}>
          Nutzer ({users.length})
        </button>
        <button onClick={() => setTab('coupons')} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          style={{ background: tab === 'coupons' ? 'var(--brand)' : 'var(--surface2)', color: tab === 'coupons' ? 'white' : 'var(--text-secondary)' }}>
          Gutscheine ({coupons.length})
        </button>
      </div>

      {tab === 'users' && (
        <>
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Name, E-Mail oder User-ID..." value={search}
              onChange={e => setSearch(e.target.value)} className="input-base text-xs pl-8 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="card p-8 text-center">
                <Users size={20} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Keine Nutzer gefunden</p>
              </div>
            ) : filtered.map(u => {
              const expanded = expandedId === u.id
              return (
                <div key={u.id} className="card overflow-hidden">
                  <button className="w-full p-3 text-left flex items-center gap-2" onClick={() => setExpandedId(expanded ? null : u.id)}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ background: u.type === 'investor' ? '#34C759' : '#8B5CF6' }}>
                      {(u.first_name?.[0] ?? '') + (u.last_name?.[0] ?? '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{u.first_name} {u.last_name}</p>
                      <p className="text-[9px] truncate" style={{ color: 'var(--text-tertiary)' }}>{u.email || u.company || '—'}</p>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: u.type === 'investor' ? 'rgba(52,199,89,0.08)' : 'rgba(139,92,246,0.08)', color: u.type === 'investor' ? '#34C759' : '#8B5CF6' }}>
                      {u.type === 'investor' ? 'Investor' : 'Partner'}
                    </span>
                    <span className="text-[9px] shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {daysSince(u.created_at)}d
                    </span>
                    {expanded ? <ChevronUp size={12} style={{ color: 'var(--text-tertiary)' }} /> : <ChevronDown size={12} style={{ color: 'var(--text-tertiary)' }} />}
                  </button>
                  {expanded && (
                    <div className="px-3 pb-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {[
                          { icon: Calendar, label: 'Dabei seit', value: new Date(u.created_at).toLocaleDateString('de-DE') },
                          { icon: Clock, label: 'Account-Alter', value: `${daysSince(u.created_at)} Tage` },
                          { icon: Shield, label: 'NDA', value: u.nda_accepted ? 'Akzeptiert' : 'Ausstehend' },
                          { icon: Mail, label: 'E-Mail', value: u.email || '—' },
                        ].map(d => (
                          <div key={d.label} className="p-2 rounded-lg" style={{ background: 'var(--surface2)' }}>
                            <div className="flex items-center gap-1 mb-0.5">
                              <d.icon size={10} style={{ color: 'var(--text-tertiary)' }} />
                              <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{d.label}</p>
                            </div>
                            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] mb-1" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        ID: {u.id}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === 'coupons' && (
        <>
          <div className="flex justify-end mb-3">
            <button onClick={() => { setShowCouponForm(!showCouponForm); generateCode() }}
              className="btn btn-primary btn-sm flex items-center gap-1">
              <Gift size={12} /> Neuer Gutschein
            </button>
          </div>
          {showCouponForm && (
            <div className="card p-4 mb-4 animate-fade-up" style={{ borderLeft: '3px solid #F59E0B' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Gutschein erstellen</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <div className="flex gap-1">
                  <input type="text" placeholder="Code" value={couponForm.code}
                    onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    className="input-base text-xs flex-1" style={{ fontFamily: 'var(--font-mono)' }} />
                  <button onClick={generateCode} className="btn btn-sm" style={{ background: 'var(--surface2)' }} title="Generieren">
                    <Plus size={12} />
                  </button>
                </div>
                <div className="flex gap-1">
                  <select value={couponForm.type} onChange={e => setCouponForm(p => ({ ...p, type: e.target.value as any }))}
                    className="input-base text-xs flex-1">
                    <option value="percent">Prozent (%)</option>
                    <option value="fixed">Fester Betrag (EUR)</option>
                  </select>
                  <input type="number" placeholder="Wert" value={couponForm.value} min={1}
                    onChange={e => setCouponForm(p => ({ ...p, value: Number(e.target.value) }))}
                    className="input-base text-xs w-20" />
                </div>
                <div className="flex gap-1">
                  <input type="number" placeholder="Max. Nutzungen" value={couponForm.max_uses} min={1}
                    onChange={e => setCouponForm(p => ({ ...p, max_uses: Number(e.target.value) }))}
                    className="input-base text-xs flex-1" />
                  <input type="date" value={couponForm.valid_until}
                    onChange={e => setCouponForm(p => ({ ...p, valid_until: e.target.value }))}
                    className="input-base text-xs flex-1" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {['all', 'buchbalance', 'avento', 'spaceai', 'baudoku'].map(p => (
                  <button key={p} onClick={() => setCouponForm(prev => ({ ...prev, product: p }))}
                    className="px-2 py-0.5 rounded-md text-[9px] font-semibold transition"
                    style={{ background: couponForm.product === p ? 'var(--brand)' : 'var(--surface2)', color: couponForm.product === p ? 'white' : 'var(--text-tertiary)' }}>
                    {p === 'all' ? 'Alle Produkte' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={createCoupon} className="btn btn-primary btn-sm">Erstellen</button>
                <button onClick={() => setShowCouponForm(false)} className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>Abbrechen</button>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {coupons.length === 0 ? (
              <div className="card p-8 text-center">
                <Gift size={20} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Keine Gutscheine</p>
              </div>
            ) : coupons.map(c => (
              <div key={c.id} className="card p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.active ? 'rgba(245,158,11,0.08)' : 'rgba(107,114,128,0.08)' }}>
                  <Gift size={14} style={{ color: c.active ? '#F59E0B' : '#6B7280' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{c.code}</span>
                    <button onClick={() => copyCode(c.code)} className="hover-press"><Copy size={10} style={{ color: 'var(--text-tertiary)' }} /></button>
                  </div>
                  <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
                    {c.type === 'percent' ? `${c.value}%` : `${c.value} EUR`} · {c.used_count}/{c.max_uses} genutzt · {c.product}
                    {c.valid_until && ` · bis ${new Date(c.valid_until).toLocaleDateString('de-DE')}`}
                  </p>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{
                  background: c.active ? 'rgba(52,199,89,0.08)' : 'rgba(107,114,128,0.08)',
                  color: c.active ? '#34C759' : '#6B7280',
                }}>{c.active ? 'Aktiv' : 'Inaktiv'}</span>
                <button onClick={() => deleteCoupon(c.id)} className="hover-press"><Trash2 size={12} style={{ color: '#E04B3E' }} /></button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
