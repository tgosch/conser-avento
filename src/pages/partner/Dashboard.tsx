import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCountUp } from '../../hooks/useCountUp'
import { ArrowRight, ShoppingCart, Users, Eye, CheckCircle, Circle } from 'lucide-react'

const STEPS = [
  { key: 'negotiating', label: 'Verhandlung', desc: 'Konditionen & Katalog' },
  { key: 'active',      label: 'Integration',  desc: 'Technische Anbindung' },
  { key: 'beta',        label: 'Beta-Phase',   desc: 'Pilot mit Kunden' },
  { key: 'partner',     label: 'Live Partner',  desc: 'Voller Zugang' },
]

function stepIndex(status: string) {
  const i = STEPS.findIndex(s => s.key === status)
  return i >= 0 ? i : 0
}

export default function PartnerDashboard() {
  const { user } = useAuth()
  const partner = user?.partner
  const status = partner?.status ?? 'negotiating'
  const currentStep = stepIndex(status)

  const kunden = useCountUp(75000, { duration: 2000 })
  const revenue = useCountUp(181, { duration: 1800 })
  const partners = useCountUp(7, { duration: 1200 })

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">

      {/* HERO */}
      <div className="card overflow-hidden mb-6">
        <div className="px-6 py-8 md:px-8 md:py-10"
          style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 50%, #0E7A7D 100%)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Partner Portal
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
            {greeting}, {partner?.name ?? 'Partner'}
          </h1>
          <p className="text-base md:text-lg mb-6" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520 }}>
            Gemeinsam die Baubranche digitalisieren. Zugang zu 75.000 Handwerksbetrieben &mdash; automatisierte Bestellungen über Avento ERP.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/partner/partnership" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
              style={{ background: 'white', color: '#063D3E' }}>
              Partnermodell ansehen <ArrowRight size={14} />
            </Link>
            <a href="mailto:torben@conser-avento.de" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { value: kunden.formatted, label: 'Zielkunden', sub: 'Handwerksbetriebe DACH' },
          { value: `€${revenue.formatted}M`, label: 'Revenue-Ziel', sub: 'Avento + Conser kombiniert' },
          { value: `${partners.formatted}+`, label: 'Partner', sub: 'Produktionspartner an Bord' },
        ].map((kpi, i) => (
          <div key={kpi.label} className={`card p-5 animate-fade-up delay-${i + 1}`}>
            <p className="text-metric-lg mb-1" style={{ color: 'var(--brand)' }}>{kpi.value}</p>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{kpi.label}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* BENEFITS */}
      <div className="mb-6 animate-fade-up delay-2">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>WAS SIE ERWARTET</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShoppingCart, title: 'Automatisierte Bestellungen', desc: 'Bestellungen fließen direkt aus dem Avento ERP der Handwerker in Ihr System. Kein manueller Aufwand.' },
            { icon: Users, title: '75.000 Kunden', desc: 'Zugang zum gesamten DACH-Handwerkermarkt über eine einzige Integration. Ohne eigenen Vertrieb.' },
            { icon: Eye, title: 'Volle Sichtbarkeit', desc: 'Ihre Produkte prominent auf dem Conser Marktplatz mit intelligenten Empfehlungen und Suchpriorisierung.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'var(--brand-dim)' }}>
                <Icon size={18} style={{ color: 'var(--brand)' }} />
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PARTNERSHIP TIMELINE */}
      <div className="card p-5 md:p-6 mb-6 animate-fade-up delay-3">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>IHRE PARTNERSCHAFT</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <div key={step.key} className="relative p-3 rounded-xl transition"
                style={{
                  background: active ? 'var(--brand-dim)' : done ? 'rgba(34,197,94,0.06)' : 'var(--surface2)',
                  border: active ? '1px solid var(--brand)' : '1px solid transparent',
                }}>
                <div className="flex items-center gap-2 mb-2">
                  {done ? (
                    <CheckCircle size={16} style={{ color: '#22C55E' }} />
                  ) : (
                    <Circle size={16} style={{ color: active ? 'var(--brand)' : 'var(--text-tertiary)' }} />
                  )}
                  <span className="text-xs font-bold" style={{ color: active ? 'var(--brand)' : done ? '#22C55E' : 'var(--text-tertiary)' }}>
                    Phase {i + 1}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{step.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                {active && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--brand)' }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* NEXT STEPS */}
      <div className="card overflow-hidden animate-fade-up delay-4">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Nächste Schritte</p>
        </div>
        {[
          { to: '/partner/partnership', label: 'Partnermodell entdecken', sub: 'Prozess, Benefits & Integration' },
          { to: '/partner/revenue',     label: 'Revenue-Modell verstehen', sub: 'Provisionen, Payment & Projektionen' },
          { to: '/partner/network',     label: 'Unser Netzwerk ansehen',   sub: 'Partner & Pilotkunden' },
        ].map((item, i) => (
          <Link key={item.to} to={item.to}
            className={`flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-[var(--surface2)] group ${i < 2 ? 'border-b' : ''}`}
            style={{ borderColor: 'var(--border)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.sub}</p>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  )
}
