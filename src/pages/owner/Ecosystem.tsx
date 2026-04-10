import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  ExternalLink, Users, UserPlus, UserMinus,
  Key, Copy, LogIn,
} from 'lucide-react'

interface ProductStats {
  name: string
  color: string
  href: string | null
  totalUsers: number
  newThisMonth: number
  churnedThisMonth: number
  status: 'live' | 'beta' | 'dev'
  demoEmail?: string
  demoPassword?: string
}

const PRODUCTS: ProductStats[] = [
  { name: 'BauDoku AI', color: '#0EA5E9', href: 'https://baudoku-ai.vercel.app', totalUsers: 0, newThisMonth: 0, churnedThisMonth: 0, status: 'live', demoEmail: 'demo@baudoku.de', demoPassword: 'Demo2026!' },
  { name: 'SpaceAI', color: '#8B5CF6', href: 'https://spaceai-henna.vercel.app', totalUsers: 0, newThisMonth: 0, churnedThisMonth: 0, status: 'live', demoEmail: 'test@spaceai.de', demoPassword: 'Spaceai2026' },
  { name: 'BuchBalance', color: '#1D5EA8', href: null, totalUsers: 0, newThisMonth: 0, churnedThisMonth: 0, status: 'live' },
  { name: 'Conser Marktplatz', color: '#C8611A', href: 'https://www.conser-gosch.de', totalUsers: 0, newThisMonth: 0, churnedThisMonth: 0, status: 'live' },
  { name: 'Avento ERP', color: '#063D3E', href: 'https://avento-eta.vercel.app', totalUsers: 0, newThisMonth: 0, churnedThisMonth: 0, status: 'live' },
]


export default function Ecosystem() {
  const [products, setProducts] = useState<ProductStats[]>(PRODUCTS)
  const [investorCount, setInvestorCount] = useState(0)
  const [partnerCount, setPartnerCount] = useState(0)
  const [totalContacts, setTotalContacts] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [inv, part, contacts] = await Promise.all([
          supabase.from('investors').select('id', { count: 'exact', head: true }),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
          supabase.from('contact_requests').select('id', { count: 'exact', head: true }),
        ])
        setInvestorCount(inv.count ?? 0)
        setPartnerCount(part.count ?? 0)
        setTotalContacts(contacts.count ?? 0)
      } catch {
        toast.error('Daten konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const totalPlatformUsers = investorCount + partnerCount + totalContacts

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h1 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Oekosystem-Zentrale
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Cross-Product Metriken, User-Tracking und Produkt-Status
        </p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Plattform-User', value: totalPlatformUsers, icon: Users, color: 'var(--brand)' },
          { label: 'Investoren', value: investorCount, icon: TrendingUp, color: '#34C759' },
          { label: 'Partner', value: partnerCount, icon: Activity, color: '#8B5CF6' },
          { label: 'Kontaktanfragen', value: totalContacts, icon: UserPlus, color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${k.color}15` }}>
                <k.icon size={14} style={{ color: k.color }} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{k.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Product Cards */}
      <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Produkte im Oekosystem
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {products.map(p => (
          <div key={p.name} className="card p-5 hover:translate-y-[-2px] transition-all" style={{ borderLeft: `3px solid ${p.color}` }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{
                    background: p.status === 'live' ? 'rgba(52,199,89,0.1)' : p.status === 'beta' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)',
                    color: p.status === 'live' ? '#34C759' : p.status === 'beta' ? '#F59E0B' : '#6B7280',
                  }}>
                  {p.status}
                </span>
                {p.href && (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="hover-press">
                    <ExternalLink size={12} style={{ color: 'var(--text-tertiary)' }} />
                  </a>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg" style={{ background: 'var(--surface2)' }}>
                <div className="flex items-center gap-1 mb-1">
                  <Users size={10} style={{ color: 'var(--text-tertiary)' }} />
                  <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Gesamt</p>
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{p.totalUsers}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'var(--surface2)' }}>
                <div className="flex items-center gap-1 mb-1">
                  <UserPlus size={10} style={{ color: '#34C759' }} />
                  <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Neu</p>
                </div>
                <p className="text-sm font-bold" style={{ color: '#34C759', fontFamily: 'var(--font-mono)' }}>+{p.newThisMonth}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'var(--surface2)' }}>
                <div className="flex items-center gap-1 mb-1">
                  <UserMinus size={10} style={{ color: '#E04B3E' }} />
                  <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Abgang</p>
                </div>
                <p className="text-sm font-bold" style={{ color: p.churnedThisMonth > 0 ? '#E04B3E' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {p.churnedThisMonth > 0 ? `-${p.churnedThisMonth}` : '0'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Infrastructure Status */}
      <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Infrastruktur
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { title: 'Bankpartner', desc: 'Deutsche Grossbank · NDA', status: 'aktiv' },
          { title: 'Payment', desc: 'PCI-DSS Level 1', status: 'aktiv' },
          { title: 'Hosting', desc: 'EU-Server · Frankfurt', status: 'aktiv' },
          { title: 'Rechtsform', desc: 'GmbH · HRB 22177', status: 'aktiv' },
        ].map(t => (
          <div key={t.title} className="card p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#34C759' }} />
            </div>
            <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Demo-Zugaenge / Quick Login */}
      <p className="text-xs font-medium uppercase tracking-widest mb-3 mt-6" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Demo-Zugaenge · Schnellzugriff
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {products.filter(p => p.demoEmail && p.href).map(p => (
          <div key={`demo-${p.name}`} className="card p-4" style={{ borderLeft: `3px solid ${p.color}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key size={13} style={{ color: p.color }} />
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{p.name} — Demo</p>
              </div>
              <a href={p.href!} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 no-underline px-2.5 py-1 rounded-lg text-[10px] font-semibold transition hover:opacity-90"
                style={{ background: p.color, color: 'white' }}>
                <LogIn size={11} /> Oeffnen
              </a>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--surface2)' }}>
                <span className="text-[9px] font-semibold w-12 shrink-0" style={{ color: 'var(--text-tertiary)' }}>E-Mail</span>
                <span className="text-[10px] flex-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{p.demoEmail}</span>
                <button onClick={() => { navigator.clipboard.writeText(p.demoEmail!); toast.success('E-Mail kopiert') }} className="hover-press shrink-0">
                  <Copy size={10} style={{ color: 'var(--text-tertiary)' }} />
                </button>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--surface2)' }}>
                <span className="text-[9px] font-semibold w-12 shrink-0" style={{ color: 'var(--text-tertiary)' }}>Passwort</span>
                <span className="text-[10px] flex-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{p.demoPassword}</span>
                <button onClick={() => { navigator.clipboard.writeText(p.demoPassword!); toast.success('Passwort kopiert') }} className="hover-press shrink-0">
                  <Copy size={10} style={{ color: 'var(--text-tertiary)' }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
