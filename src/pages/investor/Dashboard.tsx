import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Update } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight } from 'lucide-react'

export default function InvestorDashboard() {
  const { user } = useAuth()
  const [updates, setUpdates] = useState<Update[]>([])
  const [investorCount, setInvestorCount] = useState<number>(0)

  const firstName = user?.investor?.first_name
  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  const fetchUpdates = () =>
    supabase.from('updates').select('id, title, content, category, created_at')
      .order('created_at', { ascending: false }).limit(2)
      .then(({ data }) => { if (data) setUpdates(data) })

  useEffect(() => {
    fetchUpdates()
    supabase.from('investors').select('id', { count: 'exact', head: true })
      .then(({ count }) => { if (count !== null) setInvestorCount(20 + count) })

    const channel = supabase.channel('inv-dash-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, fetchUpdates)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const categoryColor: Record<string, string> = {
    general: '#6E6E73', milestone: '#063D3E', important: '#D4662A',
  }
  const categoryLabel: Record<string, string> = {
    general: 'Allgemein', milestone: 'Meilenstein', important: 'Wichtig',
  }

  return (
    <div className="max-w-5xl mx-auto fade-up">

      {/* ── Greeting ── */}
      <div className="mb-8 fade-up fade-up-1">
        <p className="label-tag mb-1.5" style={{ color: 'var(--text-tertiary)' }}>{today}</p>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          {firstName ? `Willkommen, ${firstName}` : 'Willkommen'} 👋
        </h1>
      </div>

      {/* ── Floating Stat Strip ── */}
      <div className="flex items-stretch mb-10 overflow-x-auto fade-up fade-up-2" style={{ gap: 0 }}>
        {[
          { label: 'Interessenten', value: String(investorCount) },
          { label: 'Investitionsphase', value: 'Phase 1' },
          { label: 'Finanzierungsrunde', value: 'Seed' },
        ].map((stat, i) => (
          <div key={stat.label} className="flex items-center shrink-0">
            <div className={`flex flex-col ${i === 0 ? 'pr-6' : i === 2 ? 'px-6' : 'px-6'}`}>
              <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                {stat.value}
              </span>
              <span className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</span>
            </div>
            {i < 2 && <div className="w-px self-stretch" style={{ background: 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {/* ── Was wir bauen ── */}
      <div className="mb-10 fade-up fade-up-2">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>WAS WIR BAUEN</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Avento */}
          <div className="rounded-[20px] p-6 md:p-8 relative overflow-hidden hover-lift"
            style={{ background: 'linear-gradient(145deg, #063D3E 0%, #0A5C5E 100%)', minHeight: '220px' }}>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                ⚡ ERP & Bausoftware
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.4px' }}>Avento</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Das vollständige Betriebssystem für Handwerker. Von der Kalkulation bis zur Rechnung — alles integriert, mobil, KI-gestützt.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Kalkulation', 'Zeiterfassung', 'Fakturierung', 'KI-Aufmaß'].map(f => (
                  <span key={f} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Conser */}
          <div className="rounded-[20px] p-6 md:p-8 relative overflow-hidden hover-lift"
            style={{ background: 'linear-gradient(145deg, #C05A22 0%, #D4662A 100%)', minHeight: '220px' }}>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                🏗️ B2B Marktplatz
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.4px' }}>Conser</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Der führende digitale Marktplatz für Baumaterialien. 2,3 Millionen Produkte, 7 Top-Lieferanten — direkt in Avento integriert.
              </p>
              <div className="flex flex-wrap gap-2">
                {['2,3M Produkte', '7 Partner', 'B2B-Checkout', '1-Click Order'].map(f => (
                  <span key={f} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Vision — Wo wir hinwollen ── */}
      <div className="mb-10 rounded-[20px] p-6 md:p-8 border fade-up fade-up-3"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <p className="label-tag mb-6" style={{ color: 'var(--text-tertiary)' }}>WO WIR HINWOLLEN</p>
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-6">
          {[
            { number: '75.000', label: 'Kunden', sub: 'bis 2031, DACH-Fokus' },
            { number: '€181M', label: 'Jahresumsatz', sub: 'bei Reife (2032)' },
            { number: '49%', label: 'EBITDA', sub: 'Zielmarge' },
          ].map((v, i) => (
            <div key={v.label} className={`flex flex-col ${i > 0 ? 'border-l pl-4 md:pl-8' : ''}`}
              style={{ borderColor: 'var(--border)' }}>
              <span className="text-xl md:text-3xl font-bold mb-1" style={{ color: '#063D3E', letterSpacing: '-0.5px' }}>
                {v.number}
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{v.label}</span>
              <span className="text-xs mt-0.5 hidden md:block" style={{ color: 'var(--text-tertiary)' }}>{v.sub}</span>
            </div>
          ))}
        </div>
        <div className="pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>
            Unser Ziel ist die vollständige Digitalisierung der Baubranche in der DACH-Region.
            Avento wird das zentrale ERP für Handwerksbetriebe — Conser der führende Marktplatz für Baumaterialien.
            Gemeinsam bilden sie ein integriertes Ökosystem, das es so noch nicht gibt.
          </p>
        </div>
      </div>

      {/* ── Warum wir gewinnen (USP) ── */}
      <div className="mb-10 fade-up fade-up-3">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>WARUM WIR GEWINNEN</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              icon: '🔗',
              title: 'Integriertes Ökosystem',
              desc: 'Avento und Conser sind tief miteinander verknüpft. Material direkt aus dem ERP bestellen — 1 Klick, kein Medienbruch, kein Zeitverlust.',
            },
            {
              icon: '🤖',
              title: 'KI-First von Beginn an',
              desc: 'KI-Aufmaß per Foto, intelligente Kalkulation, automatisierte Dokumentenerstellung — nicht als Add-on, sondern als Kern der Plattform.',
            },
            {
              icon: '🏗️',
              title: 'Tiefe Branchenkenntnis',
              desc: 'Gegründet von Brancheninsidern mit direktem Zugang zu 7 Produktionspartnern. Wir kennen die Schmerzen — wir haben die Lösung gebaut.',
            },
          ].map(usp => (
            <div key={usp.title} className="rounded-[16px] p-5 border hover-lift"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <span className="text-2xl block mb-3">{usp.icon}</span>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{usp.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Neuigkeiten ── */}
      {updates.length > 0 && (
        <div className="mb-6 fade-up fade-up-4">
          <div className="flex items-center justify-between mb-4">
            <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>NEUIGKEITEN</p>
            <Link to="/investor/status" className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#063D3E' }}>
              Alle <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {updates.map(u => (
              <div key={u.id} className="rounded-[16px] p-5 border"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                    style={{ background: `${categoryColor[u.category]}15`, color: categoryColor[u.category] }}>
                    {categoryLabel[u.category]}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(u.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{u.title}</h3>
                <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                  {u.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA Footer ── */}
      <div className="rounded-[16px] p-5 flex items-center justify-between border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div>
          <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>Fragen oder Interesse?</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sprechen Sie direkt mit dem Gründerteam.</p>
        </div>
        <Link to="/investor/chat"
          className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-sm font-semibold text-white transition hover:opacity-90 shrink-0 ml-4"
          style={{ background: '#063D3E' }}>
          Chat öffnen <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  )
}
