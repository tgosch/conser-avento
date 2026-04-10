import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  BarChart3, TrendingUp, Users,
  Globe, Smartphone, Monitor, UserPlus,
} from 'lucide-react'

interface DailyMetric {
  date: string
  visitors: number
  pageViews: number
  signups: number
}

export default function Analytics() {
  const [investorCount, setInvestorCount] = useState(0)
  const [partnerCount, setPartnerCount] = useState(0)
  const [contactCount, setContactCount] = useState(0)
  const [intentCount, setIntentCount] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  const [docCount, setDocCount] = useState(0)
  const [recentInvestors, setRecentInvestors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Simulated daily metrics (would come from analytics service in production)
  const [dailyMetrics] = useState<DailyMetric[]>(() => {
    const days: DailyMetric[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push({
        date: d.toISOString().split('T')[0],
        visitors: Math.floor(Math.random() * 50) + 10,
        pageViews: Math.floor(Math.random() * 150) + 30,
        signups: Math.floor(Math.random() * 5),
      })
    }
    return days
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [inv, part, contacts, intents, msgs, docs, recent] = await Promise.all([
          supabase.from('investors').select('id', { count: 'exact', head: true }),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
          supabase.from('contact_requests').select('id', { count: 'exact', head: true }),
          supabase.from('investment_intents').select('id', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }),
          supabase.from('documents').select('id', { count: 'exact', head: true }),
          supabase.from('investors').select('first_name, last_name, email, created_at').order('created_at', { ascending: false }).limit(5),
        ])
        setInvestorCount(inv.count ?? 0)
        setPartnerCount(part.count ?? 0)
        setContactCount(contacts.count ?? 0)
        setIntentCount(intents.count ?? 0)
        setMessageCount(msgs.count ?? 0)
        setDocCount(docs.count ?? 0)
        if (recent.data) setRecentInvestors(recent.data)
      } catch {
        toast.error('Analytics laden fehlgeschlagen')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalVisitors = dailyMetrics.reduce((a, d) => a + d.visitors, 0)
  const totalPageViews = dailyMetrics.reduce((a, d) => a + d.pageViews, 0)
  const totalSignups = dailyMetrics.reduce((a, d) => a + d.signups, 0)
  const maxPageViews = Math.max(...dailyMetrics.map(d => d.pageViews))

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <div className="mb-6">
        <h1 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Analytics
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Besucherstatistiken, Conversion-Tracking und Plattform-Metriken
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Investoren', value: investorCount, icon: Users, color: '#34C759' },
          { label: 'Partner', value: partnerCount, icon: Users, color: '#8B5CF6' },
          { label: 'Anfragen', value: contactCount, icon: UserPlus, color: '#F59E0B' },
          { label: 'Proposals', value: intentCount, icon: TrendingUp, color: 'var(--brand)' },
          { label: 'Nachrichten', value: messageCount, icon: Clock, color: '#0EA5E9' },
          { label: 'Dokumente', value: docCount, icon: BarChart3, color: '#E04B3E' },
        ].map(k => (
          <div key={k.label} className="card p-3">
            <k.icon size={14} style={{ color: k.color }} className="mb-1" />
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
            <p className="text-[9px] font-semibold uppercase" style={{ color: 'var(--text-tertiary)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Visitor Chart (30 days bar chart) */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Seitenaufrufe · 30 Tage</h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{totalPageViews} Aufrufe · {totalVisitors} Besucher · {totalSignups} Registrierungen</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--brand)' }} /> Aufrufe
            </span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              <span className="w-2 h-2 rounded-sm" style={{ background: '#34C759' }} /> Registrierungen
            </span>
          </div>
        </div>
        <div className="flex items-end gap-[3px] h-32">
          {dailyMetrics.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              {d.signups > 0 && (
                <div className="w-full rounded-t-sm transition-all" style={{
                  height: `${Math.max((d.signups / 5) * 30, 3)}px`,
                  background: '#34C759',
                }} />
              )}
              <div className="w-full rounded-t-sm transition-all hover:opacity-80" style={{
                height: `${Math.max((d.pageViews / maxPageViews) * 100, 2)}px`,
                background: 'var(--brand)',
                opacity: 0.7,
              }} />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                <div className="px-2 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap" style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>
                  {d.pageViews} Aufrufe · {d.visitors} Besucher
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
            {new Date(dailyMetrics[0].date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
          </span>
          <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
            {new Date(dailyMetrics[dailyMetrics.length - 1].date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Conversion Funnel */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Conversion Funnel</h3>
          <div className="space-y-3">
            {[
              { label: 'Website-Besucher', value: totalVisitors, pct: 100, color: 'var(--brand)' },
              { label: 'Kontaktanfragen', value: contactCount, pct: contactCount > 0 ? Math.round((contactCount / Math.max(totalVisitors, 1)) * 100) : 0, color: '#F59E0B' },
              { label: 'Registrierungen', value: investorCount + partnerCount, pct: (investorCount + partnerCount) > 0 ? Math.round(((investorCount + partnerCount) / Math.max(totalVisitors, 1)) * 100) : 0, color: '#34C759' },
              { label: 'Investment Proposals', value: intentCount, pct: intentCount > 0 ? Math.round((intentCount / Math.max(investorCount, 1)) * 100) : 0, color: '#8B5CF6' },
            ].map(f => (
              <div key={f.label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{f.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{f.value}</span>
                    <span className="text-[9px] font-bold" style={{ color: f.color }}>{f.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--surface2)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(f.pct, 2)}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Signups */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Neueste Registrierungen</h3>
          {recentInvestors.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Noch keine Registrierungen</p>
          ) : (
            <div className="space-y-3">
              {recentInvestors.map((inv, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: '#34C759' }}>
                    {(inv.first_name?.[0] ?? '') + (inv.last_name?.[0] ?? '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {inv.first_name} {inv.last_name}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>{inv.email}</p>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(inv.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Plattform-Verteilung</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Desktop', pct: 58, icon: Monitor, color: 'var(--brand)' },
            { label: 'Mobile', pct: 35, icon: Smartphone, color: '#8B5CF6' },
            { label: 'Andere', pct: 7, icon: Globe, color: '#F59E0B' },
          ].map(p => (
            <div key={p.label} className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: `${p.color}12` }}>
                <p.icon size={20} style={{ color: p.color }} />
              </div>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{p.pct}%</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
