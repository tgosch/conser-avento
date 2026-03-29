import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCountUp } from '../../hooks/useCountUp'
import { ArrowRight, ShoppingCart, Users, Eye, CheckCircle, Circle, Rocket, TrendingUp, Zap, Calendar } from 'lucide-react'
import { LaptopMockup, PhoneMockup } from '../../components/showcase/DeviceMockup'

const STEPS = [
  { key: 1, label: 'Kennenlernen',        desc: 'Persönlicher Termin',       icon: '🤝' },
  { key: 2, label: 'Partnerzeit',         desc: 'Konditionen & Katalog',     icon: '💬' },
  { key: 3, label: 'Verträge & Ablauf',   desc: 'Vertragsdetails klären',    icon: '📋' },
  { key: 4, label: 'Vertragsrücksendung', desc: 'Content-Vertrag signed',    icon: '✍️' },
  { key: 5, label: 'IT-Abstimmung',       desc: 'Technische Anforderungen',  icon: '👨‍💻' },
  { key: 6, label: 'Datenaustausch',      desc: 'OCI / API / CSV',           icon: '🔄' },
  { key: 7, label: 'Produktintegration',  desc: 'Produkte live auf Conser',  icon: '⚙️' },
  { key: 8, label: 'Go Live!',            desc: 'Sichtbar für alle Nutzer',  icon: '🚀' },
]

function mapStatusToStep(status: string): number {
  switch (status) {
    case 'negotiating': return 2
    case 'active': return 5
    case 'beta': return 7
    case 'partner': return 8
    default: return 1
  }
}

function stepIndex(status: string) {
  const i = mapStatusToStep(status) - 1
  return i >= 0 ? i : 0
}

export default function PartnerDashboard() {
  const { user } = useAuth()
  const partner = user?.partner
  const status = partner?.status ?? 'negotiating'
  const currentStep = stepIndex(status)

  const kunden = useCountUp(75000, { duration: 2000 })
  const revenue = useCountUp(181, { duration: 1800 })
  const partners = useCountUp(9, { duration: 1200 })

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── HERO ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up">
        <div className="relative px-6 py-10 md:px-10 md:py-14"
          style={{ background: 'linear-gradient(135deg, #041E1F 0%, #063D3E 30%, #0A5C5E 60%, #0E7A7D 100%)' }}>
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, #C8611A 0%, transparent 70%)', transform: 'translate(-20%, 30%)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
                PARTNER PORTAL
              </span>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#22D3EE' }} />
            </div>

            <h1 className="text-display-lg text-white mb-3">
              {greeting}, {partner?.name ?? 'Partner'}
            </h1>
            <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 520 }}>
              Gemeinsam die Baubranche digitalisieren. Zugang zu 75.000 Handwerksbetrieben &mdash; automatisierte Bestellungen direkt aus dem ERP.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/partner/partnership"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:translate-y-[-1px] hover:shadow-lg"
                style={{ background: 'white', color: '#063D3E' }}>
                Partnermodell ansehen <ArrowRight size={14} />
              </Link>
              <a href="https://calendly.com/torben-gosch" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:translate-y-[-1px]"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                <Calendar size={14} /> Termin vereinbaren
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { value: kunden.formatted, label: 'Zielkunden', sub: 'Handwerksbetriebe DACH', icon: Users, color: 'var(--brand)' },
          { value: `€${revenue.formatted}M`, label: 'Revenue-Ziel', sub: 'Avento + Conser kombiniert', icon: TrendingUp, color: 'var(--accent)' },
          { value: partners.formatted, label: 'Partner', sub: 'Produktionspartner an Bord', icon: Rocket, color: '#22C55E' },
        ].map((kpi, i) => (
          <div key={kpi.label} className={`card p-6 group hover:translate-y-[-2px] transition-all duration-300 animate-fade-up delay-${i + 1}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${kpi.color}12` }}>
                <kpi.icon size={18} style={{ color: kpi.color }} />
              </div>
              <Zap size={12} style={{ color: 'var(--text-tertiary)' }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-metric-lg mb-1" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{kpi.label}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── PRODUCT SHOWCASE ── */}
      <div className="mb-8 animate-fade-up delay-2">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>DAS ÖKOSYSTEM</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Desktop View — Partner-Branded */}
          <div className="card p-6 md:p-8">
            <LaptopMockup
              placeholderIcon="📊"
              placeholderText={`${partner?.name ?? 'Ihr Unternehmen'} im Conser Marktplatz`}
              gradient={`linear-gradient(145deg, #041E1F 0%, ${partner?.color ?? '#063D3E'} 50%, #0A5C5E 100%)`}
              label="Conser Marktplatz"
              sublabel={`Integriert mit ${partner?.name ?? 'Ihrem Katalog'}`}
            />
          </div>
          {/* Mobile Views — Partner-Branded */}
          <div className="card p-6 md:p-8">
            <div className="flex justify-center gap-6">
              <PhoneMockup
                placeholderIcon="🔨"
                placeholderText="Avento Mobile"
                gradient="linear-gradient(145deg, #041E1F 0%, #063D3E 100%)"
                label="Mobile ERP"
                sublabel="Von der Baustelle"
              />
              <PhoneMockup
                placeholderIcon="🛒"
                placeholderText={`${partner?.name ?? 'Partner'} Shop`}
                gradient={`linear-gradient(145deg, #1A0A00 0%, ${partner?.color ?? '#C8611A'} 100%)`}
                label={`${partner?.name ?? 'Partner'} auf Conser`}
                sublabel="1-Click Bestellung"
              />
            </div>
          </div>
        </div>
        {/* Mini-Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { value: '2.300+', label: 'Produkte', icon: '📦' },
            { value: '12', label: 'Kategorien', icon: '🏷️' },
            { value: '75.000', label: 'Reichweite', icon: '👥' },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <span className="text-sm block mb-1">{s.icon}</span>
              <p className="text-sm font-bold" style={{ color: 'var(--brand)' }}>{s.value}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── AVENTO KI-MODULE ── */}
      <div className="mb-8 animate-fade-up delay-2">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>AVENTO KI-MODULE — BEREITS FERTIG</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 group hover:translate-y-[-2px] transition-all duration-300"
            style={{ borderBottom: '2px solid #8B5CF6' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(139,92,246,0.12)' }}>🧠</div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Space AI</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              KI-Assistent für Handwerker: automatisierte Angebote, Materialkalkulation, Projektplanung. Ihre Produkte werden direkt in Empfehlungen einbezogen.
            </p>
          </div>
          <div className="card p-5 group hover:translate-y-[-2px] transition-all duration-300"
            style={{ borderBottom: '2px solid #0EA5E9' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'rgba(14,165,233,0.12)' }}>📋</div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>BauDoku AI</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Digitales Bautagebuch mit KI: Fotos, Protokolle, Signaturen automatisch. Jeder Materialverbrauch wird dokumentiert — optimiert Nachbestellungen bei Ihnen.
            </p>
          </div>
        </div>
      </div>

      {/* ── BENEFITS ── */}
      <div className="mb-8 animate-fade-up delay-3">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>WAS SIE ERWARTET</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShoppingCart, title: 'Automatisierte Bestellungen', desc: 'Bestellungen fließen direkt aus dem Avento ERP in Ihr System. Kein manueller Aufwand, keine Medienbrüche.', accent: 'var(--brand)' },
            { icon: Users, title: '75.000 Zielkunden', desc: 'Zugang zum gesamten DACH-Handwerkermarkt über eine einzige Integration. Ohne eigenen Vertrieb.', accent: 'var(--accent)' },
            { icon: Eye, title: 'Volle Sichtbarkeit', desc: 'Ihre Produkte prominent auf dem Conser Marktplatz mit KI-gestützten Empfehlungen und Suchpriorisierung.', accent: '#22C55E' },
          ].map(({ icon: Icon, title, desc, accent }) => (
            <div key={title} className="card p-6 group hover:translate-y-[-2px] transition-all duration-300"
              style={{ borderBottom: `2px solid ${accent}` }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${accent}15` }}>
                <Icon size={20} style={{ color: accent }} />
              </div>
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ONBOARDING FORTSCHRITT (8 Schritte) ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-4">
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>IHR ONBOARDING</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}>
            Schritt {currentStep + 1} von 8 · {Math.round(((currentStep + 1) / 8) * 100)}%
          </span>
        </div>
        <div className="p-6">
          {/* Progress bar */}
          <div className="relative mb-6">
            <div className="h-1.5 rounded-full" style={{ background: 'var(--surface3)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${((currentStep + 1) / 8) * 100}%`, background: 'linear-gradient(90deg, var(--brand), #0E7A7D)' }} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STEPS.map((s, i) => {
              const done = i < currentStep
              const active = i === currentStep
              return (
                <div key={s.key} className="relative p-3.5 rounded-xl transition-all duration-300"
                  style={{
                    background: active ? 'var(--brand-dim)' : done ? 'rgba(34,197,94,0.04)' : 'var(--surface2)',
                    border: active ? '1.5px solid var(--brand)' : '1.5px solid transparent',
                    boxShadow: active ? '0 4px 20px rgba(6,61,62,0.1)' : 'none',
                    opacity: !done && !active ? 0.6 : 1,
                  }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{s.icon}</span>
                    {done ? (
                      <CheckCircle size={12} style={{ color: '#22C55E' }} />
                    ) : (
                      <Circle size={12} style={{ color: active ? 'var(--brand)' : 'var(--text-tertiary)' }} />
                    )}
                    <span className="text-[9px] font-bold tracking-wide" style={{ color: active ? 'var(--brand)' : done ? '#22C55E' : 'var(--text-tertiary)' }}>
                      {i + 1}/8
                    </span>
                  </div>
                  <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                  {active && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--brand)' }} />
                  )}
                </div>
              )
            })}
          </div>
          {/* Nächster Schritt Highlight */}
          {currentStep < STEPS.length && (
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--brand-dim)', border: '1.5px solid var(--brand)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{STEPS[currentStep].icon}</span>
                <div>
                  <p className="text-[10px] font-bold tracking-wide" style={{ color: 'var(--brand)' }}>AKTUELLER SCHRITT</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{STEPS[currentStep].label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{STEPS[currentStep].desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── NEXT STEPS ── */}
      <div className="card overflow-hidden animate-fade-up delay-4">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Nächste Schritte</p>
        </div>
        {[
          { to: '/partner/vision',       label: 'Vision & Mission entdecken',  sub: 'Warum wir Avento & Conser bauen', icon: '🎯' },
          { to: '/partner/partnership',  label: 'Onboarding & Partnermodell',  sub: '8 Schritte, 4–8 Wochen, Benefits', icon: '🤝' },
          { to: '/partner/revenue',      label: 'Revenue-Modell ansehen',      sub: 'Provisionen, Payment & Projektionen', icon: '💰' },
          { to: '/partner/network',      label: 'Netzwerk erkunden',           sub: 'Partner & Pilotkunden', icon: '🌐' },
        ].map((item, i) => (
          <Link key={item.to} to={item.to}
            className={`flex items-center gap-4 px-6 py-4 transition-all hover:bg-[var(--surface2)] group ${i < 3 ? 'border-b' : ''}`}
            style={{ borderColor: 'var(--border)' }}>
            <span className="text-lg shrink-0">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.sub}</p>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} className="shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  )
}
