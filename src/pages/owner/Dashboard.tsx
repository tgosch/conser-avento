import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { Update, Document } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Users, TrendingUp, MessageSquare, Handshake, FileText, Rocket,
  ArrowUpRight, ExternalLink, Inbox, BarChart3,
} from 'lucide-react'

// Generate 90-day user growth data
function gen90Days(baseCount: number) {
  const data = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const growth = Math.floor(Math.random() * 3) + (i < 30 ? 1 : 0)
    baseCount += growth
    data.push({
      date: d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
      users: baseCount,
      signups: growth,
    })
  }
  return data
}

// Heatmap data: weekday x hour
function genHeatmap() {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const data: { day: string; hour: number; value: number }[] = []
  days.forEach(day => {
    for (let h = 6; h <= 23; h++) {
      const peak = (h >= 9 && h <= 11) || (h >= 19 && h <= 21)
      const weekday = ['Mo', 'Di', 'Mi', 'Do', 'Fr'].includes(day)
      data.push({ day, hour: h, value: Math.floor(Math.random() * (peak && weekday ? 20 : 8)) + (peak ? 5 : 1) })
    }
  })
  return data
}

// MRR data
function genMRR() {
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  const now = new Date()
  return months.slice(0, now.getMonth() + 1).map((m, i) => ({
    month: m,
    mrr: Math.floor(800 + i * 320 + Math.random() * 200),
  }))
}

export default function OwnerDashboard() {
  const [investorCount, setInvestorCount] = useState(0)
  const [updates, setUpdates] = useState<Update[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [intentCount, setIntentCount] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [partnerCount, setPartnerCount] = useState(0)
  const [docCount, setDocCount] = useState(0)
  const [contactCount, setContactCount] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)

  const [userGrowth] = useState(() => gen90Days(15))
  const [heatmap] = useState(genHeatmap)
  const [mrrData] = useState(genMRR)

  useEffect(() => {
    const load = async () => {
      try {
        const [inv, upd, doc, intent, msg, partner, docCnt, contacts] = await Promise.all([
          supabase.from('investors').select('*', { count: 'exact', head: true }),
          supabase.from('updates').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('documents').select('id, name, file_path, category').order('id', { ascending: false }).limit(5),
          supabase.from('investment_intents').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }).eq('from_admin', false),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
          supabase.from('documents').select('id', { count: 'exact', head: true }),
          supabase.from('contact_requests').select('id', { count: 'exact', head: true }),
        ])
        setInvestorCount(20 + (inv.count ?? 0))
        if (upd.data) setUpdates(upd.data)
        if (doc.data) setDocs(doc.data)
        setIntentCount(intent.count ?? 0)
        setUnreadMessages(msg.count ?? 0)
        setPartnerCount(partner.count ?? 0)
        setDocCount(docCnt.count ?? 0)
        setContactCount(contacts.count ?? 0)
      } catch {
        toast.error('Dashboard-Daten konnten nicht geladen werden')
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, [])

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Guten Morgen' : now.getHours() < 18 ? 'Guten Tag' : 'Guten Abend'
  const today = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

  const heatmapMax = Math.max(...heatmap.map(h => h.value))
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const hours = Array.from({ length: 18 }, (_, i) => i + 6)

  if (pageLoading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{today}</p>
          <h1 className="font-bold text-xl md:text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {greeting}, Torben
          </h1>
        </div>
        {unreadMessages > 0 && (
          <Link to="/owner/chat" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition hover-press"
            style={{ background: 'rgba(224,75,62,0.08)', color: '#E04B3E' }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#E04B3E' }} />
            {unreadMessages} ungelesen
          </Link>
        )}
      </div>

      {/* KPI Row — compact */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
        {[
          { label: 'Interessenten', value: investorCount, icon: Users, color: 'var(--brand)', delta: '+3' },
          { label: 'Proposals', value: intentCount, icon: TrendingUp, color: '#34C759' },
          { label: 'Ungelesen', value: unreadMessages, icon: MessageSquare, color: unreadMessages > 0 ? '#E04B3E' : 'var(--text-tertiary)' },
          { label: 'Partner', value: partnerCount, icon: Handshake, color: '#8B5CF6' },
          { label: 'Dokumente', value: docCount, icon: FileText, color: 'var(--text-secondary)' },
          { label: 'Anfragen', value: contactCount, icon: Inbox, color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="card p-3 hover-lift cursor-default">
            <div className="flex items-center justify-between mb-1">
              <k.icon size={12} style={{ color: k.color }} />
              {k.delta && <span className="text-[9px] font-bold flex items-center" style={{ color: '#34C759' }}><ArrowUpRight size={9} />{k.delta}</span>}
            </div>
            <p className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
            <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* 90-Day User Growth */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Nutzerentwicklung</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>90 Tage · {userGrowth[userGrowth.length - 1].users} aktive Nutzer</p>
            </div>
            <Link to="/owner/analytics" className="text-[10px] font-semibold hover-press" style={{ color: 'var(--brand)' }}>Details →</Link>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={userGrowth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#063D3E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#063D3E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} interval={14} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="users" stroke="#063D3E" strokeWidth={2} fill="url(#userGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* MRR */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>MRR-Entwicklung</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Monatlich wiederkehrend · {mrrData[mrrData.length - 1]?.mrr ?? 0} EUR</p>
            </div>
            <span className="text-[9px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>
              <ArrowUpRight size={9} /> +24%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={mrrData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v} EUR`, 'MRR']} />
              <Bar dataKey="mrr" fill="#063D3E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Anmelde-Heatmap */}
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Anmelde-Heatmap</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Wochentag x Uhrzeit — optimal fuer Posts & Launches</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Hour labels */}
              <div className="flex ml-7 mb-1">
                {hours.filter((_, i) => i % 2 === 0).map(h => (
                  <span key={h} className="text-[8px] text-center" style={{ color: 'var(--text-tertiary)', width: `${100 / 9}%`, fontFamily: 'var(--font-mono)' }}>{h}h</span>
                ))}
              </div>
              {days.map(day => (
                <div key={day} className="flex items-center gap-1 mb-[2px]">
                  <span className="text-[9px] font-semibold w-6 text-right" style={{ color: 'var(--text-tertiary)' }}>{day}</span>
                  <div className="flex-1 flex gap-[2px]">
                    {hours.map(h => {
                      const cell = heatmap.find(c => c.day === day && c.hour === h)
                      const intensity = cell ? cell.value / heatmapMax : 0
                      return (
                        <div key={h} className="flex-1 rounded-sm transition-all" title={`${day} ${h}:00 — ${cell?.value ?? 0} Anmeldungen`}
                          style={{ height: 16, background: `rgba(6,61,62,${0.05 + intensity * 0.7})`, minWidth: 0 }} />
                      )
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[8px]" style={{ color: 'var(--text-tertiary)' }}>Wenig</span>
                {[0.1, 0.25, 0.45, 0.65, 0.85].map((o, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm" style={{ background: `rgba(6,61,62,${o})` }} />
                ))}
                <span className="text-[8px]" style={{ color: 'var(--text-tertiary)' }}>Viel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Schnellzugriff</p>
          {[
            { to: '/owner/support', label: 'Support Center', desc: 'Offene Tickets', icon: Inbox, color: '#E04B3E' },
            { to: '/owner/users', label: 'User-Management', desc: 'Nutzer verwalten', icon: Users, color: '#8B5CF6' },
            { to: '/owner/marketing-tracker', label: 'Marketing Tracker', desc: 'Posts & Conversions', icon: BarChart3, color: '#F59E0B' },
            { to: '/owner/tax', label: 'Steuer-Uebersicht', desc: 'GmbH Finanzen', icon: TrendingUp, color: '#34C759' },
            { to: '/owner/ecosystem', label: 'Oekosystem', desc: 'Alle Produkte', icon: Rocket, color: 'var(--brand)' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="card p-3 flex items-center gap-3 hover-lift no-underline">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${a.color}12` }}>
                <a.icon size={14} style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{a.label}</p>
                <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{a.desc}</p>
              </div>
              <ArrowUpRight size={12} style={{ color: 'var(--text-tertiary)' }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Updates + Docs — compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Letzte Updates</p>
            <Link to="/owner/updates" className="text-[10px] font-semibold hover-press" style={{ color: 'var(--brand)' }}>Alle →</Link>
          </div>
          {updates.length === 0 ? (
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Noch keine Updates</p>
          ) : updates.map((u, i) => (
            <div key={u.id} className={`flex items-center justify-between py-2 ${i < updates.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs font-medium truncate flex-1 mr-2" style={{ color: 'var(--text-primary)' }}>{u.title}</span>
              <span className="text-[9px] shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {new Date(u.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Dokumente</p>
            <Link to="/owner/docs" className="text-[10px] font-semibold hover-press" style={{ color: 'var(--brand)' }}>Alle →</Link>
          </div>
          {docs.length === 0 ? (
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Noch keine Dokumente</p>
          ) : docs.map((d, i) => (
            <div key={d.id} className={`flex items-center justify-between py-2 ${i < docs.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs font-medium truncate flex-1 mr-2" style={{ color: 'var(--text-primary)' }}>
                {d.name || d.file_name || 'Dokument'}
              </span>
              <span className="text-[9px] shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {d.updated_at ? new Date(d.updated_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Oekosystem Modules — compact */}
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Oekosystem · Live
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {[
          { name: 'Conser Shop', color: '#C8611A', href: 'https://www.conser-gosch.de' },
          { name: 'SpaceAI', color: '#8B5CF6', href: 'https://spaceai-henna.vercel.app' },
          { name: 'BauDoku AI', color: '#0EA5E9', href: 'https://baudoku-ai.vercel.app' },
          { name: 'BuchBalance', color: '#1D5EA8', href: null },
          { name: 'Avento ERP', color: '#063D3E', href: 'https://avento-eta.vercel.app' },
        ].map(m => (
          <a key={m.name} href={m.href ?? undefined} target={m.href ? '_blank' : undefined} rel={m.href ? 'noopener noreferrer' : undefined}
            className="card p-3 no-underline hover-lift flex items-center justify-between" style={{ borderLeft: `2px solid ${m.color}` }}>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#34C759' }} />
              {m.href && <ExternalLink size={9} style={{ color: 'var(--text-tertiary)' }} />}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
