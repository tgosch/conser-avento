import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// ── Phase Data ────────────────────────────────────────────────────
const PHASES = [
  {
    id: 1,
    title: 'Conser Webshop',
    subtitle: 'Foundation Built',
    timeframe: 'Apr – Jun 2026',
    duration: '3 Monate',
    icon: '🛒',
    accentColor: '#063D3E',
    bgColor: 'rgba(6,61,62,0.08)',
    goals: [
      'Conser MVP (Webshop + Produktkatalog)',
      '7 Producer-Partner vollständig integriert',
      '2,3 Mio. Produkte live im System',
      'Payment & Logistik-Infrastruktur ready',
      'Legal & GDPR compliant',
    ],
    keyMetrics: [
      { icon: '📦', label: 'Produkte live', value: '2,3M' },
      { icon: '🤝', label: 'Partner', value: '7' },
      { icon: '💰', label: 'Budget', value: '300k€' },
      { icon: '⏱️', label: 'Dauer', value: '3 Mon.' },
    ],
    team: 'Martin (CTO) · 1 Senior Dev (Backend) · 1 Mid Dev (Frontend) · 1 Designer',
    budgetBreakdown: [
      { label: 'Development', pct: 60, color: '#063D3E' },
      { label: 'Cloud', pct: 13, color: '#0A5C5E' },
      { label: 'Legal', pct: 10, color: '#D4662A' },
      { label: 'Testing', pct: 10, color: '#FF9500' },
      { label: 'Partner APIs', pct: 7, color: '#AEAEB2' },
    ],
    tags: ['Baustoffe 500k', 'SHK 300k', 'Elektro 200k', 'Holz 200k', 'Elektrotechnik 150k', 'Baustoffhandel 300k', 'Holzfachhandel 250k'],
    gate: [
      '2,3M Produkte durchsuchbar & auffindbar',
      'Payment 100% sicher & live',
      'Mobile App stabil (iOS + Android)',
      'Partner-Daten vollständig integriert',
      'GDPR compliant',
    ],
  },
  {
    id: 2,
    title: 'Conser Launch',
    subtitle: 'Go-to-Market',
    timeframe: 'Jul – Sep 2026',
    duration: '3 Monate',
    icon: '🚀',
    accentColor: '#D4662A',
    bgColor: 'rgba(212,102,42,0.08)',
    goals: [
      'Public Launch (Press, Marketing, Social)',
      'Alle 7 Partner activated & trained',
      '1.000 Handwerker-Kunden (organic)',
      '100+ Enterprise-Kunden (via Partner)',
      '5 M€ GMV — Proof of Concept',
    ],
    keyMetrics: [
      { icon: '👥', label: 'Kunden-Ziel', value: '1.000' },
      { icon: '💶', label: 'GMV Ziel', value: '5M€' },
      { icon: '📣', label: 'Event-Reichweite', value: '500+' },
      { icon: '💰', label: 'Budget', value: '250k€' },
    ],
    team: 'Torben (CEO) · 1 Marketing Manager · 1 Sales Dev Rep · 1 CSM · 1 Dev',
    budgetBreakdown: [
      { label: 'Marketing & Launch', pct: 40, color: '#D4662A' },
      { label: 'Partner Enablement', pct: 24, color: '#063D3E' },
      { label: 'Events & PR', pct: 16, color: '#FF9500' },
      { label: 'Product Support', pct: 12, color: '#0066FF' },
      { label: 'Community', pct: 8, color: '#AEAEB2' },
    ],
    tags: ['TechCrunch', 'Construction Dive', 'TikTok 100k+', 'LinkedIn 50k+', 'Virtual Event'],
    gate: [
      'Produkt stabil (keine kritischen Bugs)',
      'Alle 7 Partner trained & aktiviert',
      '1.000 zahlende Kunden akquiriert',
      'Positive Pressecoverage (5+ Artikel)',
      '5 M€ GMV erreicht',
    ],
  },
  {
    id: 3,
    title: 'Avento Build',
    subtitle: 'MVP & Beta Testing',
    timeframe: 'Okt 2026 – Feb 2027',
    duration: '5 Monate',
    icon: '⚙️',
    accentColor: '#0066FF',
    bgColor: 'rgba(0,102,255,0.08)',
    goals: [
      'Avento MVP 100% feature-complete',
      'Mobile App iOS/Android (95%+ fertig)',
      'Komplett-System Alpha — Controlling, Buchhaltung, Team',
      'Closed Beta: 500 User, NPS 60+',
      '10k concurrent users erfolgreich getestet',
    ],
    keyMetrics: [
      { icon: '👷', label: 'Beta User', value: '500' },
      { icon: '⭐', label: 'NPS Ziel', value: '60+' },
      { icon: '🤖', label: 'System-Coverage', value: '95%' },
      { icon: '💰', label: 'Budget', value: '510k€' },
    ],
    team: 'Martin (CTO) · 1 Senior Dev · 1 Mid Dev · 1 Designer · 1 QA · External: AWS + KI-Training',
    budgetBreakdown: [
      { label: 'Development', pct: 55, color: '#0066FF' },
      { label: 'KI/ML Training', pct: 16, color: '#063D3E' },
      { label: 'Cloud Infra', pct: 10, color: '#0A5C5E' },
      { label: 'QA & Testing', pct: 8, color: '#D4662A' },
      { label: 'Design & UX', pct: 8, color: '#FF9500' },
      { label: 'Beta Incentives', pct: 3, color: '#AEAEB2' },
    ],
    tags: ['Space AI ✅', 'BauDoku AI ✅', 'Controlling', 'Buchhaltung', 'Angebote', 'Team-Steuerung', 'Conser Integration'],
    gate: [
      'MVP Features reliabel (keine kritischen Bugs)',
      'iOS + Android Apps stabil (App Store ready)',
      'Komplett-System validiert (Controlling, Angebote, Team)',
      'Closed Beta NPS 60+',
      '10k concurrent users erfolgreich getestet',
    ],
  },
  {
    id: 4,
    title: 'Avento Beta1',
    subtitle: 'Public Launch',
    timeframe: 'Mär – Jun 2027',
    duration: '4 Monate',
    icon: '🎯',
    accentColor: '#34C759',
    bgColor: 'rgba(52,199,89,0.08)',
    goals: [
      'Public Beta Launch — App Store, Google Play, Web',
      '5.000+ Beta-Kunden akquiriert',
      'Revenue: 2,5 M€',
      'Break-Even erreicht (Q2 2027)',
      'Series A abgeschlossen (20–30 M€)',
    ],
    keyMetrics: [
      { icon: '👥', label: 'Kunden Ziel', value: '5.000' },
      { icon: '💶', label: 'Revenue', value: '2,5M€' },
      { icon: '📊', label: 'Series A', value: '20–30M€' },
      { icon: '🔄', label: 'Retention', value: '93%+' },
    ],
    team: 'Torben + Martin · Marketing Manager · SDR · CSM · 2 Devs · 1 Designer',
    budgetBreakdown: [
      { label: 'Marketing & Launch', pct: 35, color: '#34C759' },
      { label: 'Team (Gehälter)', pct: 28, color: '#063D3E' },
      { label: 'Product Support', pct: 19, color: '#0066FF' },
      { label: 'Infrastructure', pct: 14, color: '#D4662A' },
      { label: 'Contingency', pct: 4, color: '#AEAEB2' },
    ],
    tags: ['Beta Pricing -50%', 'Basic 27,50€', 'Pro 40€', 'Premium 60€', 'Conser + Avento Bundle'],
    gate: [
      '5.000 zahlende Kunden akquiriert',
      '93%+ 30-Day Retention',
      'Break-Even in Q2 2027 erreicht',
      'Avento + Conser Integration validiert',
      'Series B Interest: 3+ Term Sheets',
    ],
  },
  {
    id: 5,
    title: 'Beta2 & Scale',
    subtitle: 'Enhancement & Growth',
    timeframe: 'Jul 2027+',
    duration: 'Kontinuierlich',
    icon: '📈',
    accentColor: '#FF9500',
    bgColor: 'rgba(255,149,0,0.08)',
    goals: [
      'Komplett-System Production (alle Module live)',
      'Advanced Features: API, Reporting, RBAC',
      '75k Kunden bis 2031',
      '181 M€ Revenue bis 2032',
      '49% EBITDA Margin — Market Leadership',
    ],
    keyMetrics: [
      { icon: '👥', label: 'Kunden 2031', value: '75k' },
      { icon: '💶', label: 'Revenue 2032', value: '181M€' },
      { icon: '📈', label: 'EBITDA', value: '49%' },
      { icon: '🔄', label: 'Release Cadence', value: '2 Wochen' },
    ],
    team: 'Volles Produktteam · Customer Success · Enterprise Sales · Marketing',
    budgetBreakdown: [
      { label: 'Product & Engineering', pct: 45, color: '#FF9500' },
      { label: 'Sales & Marketing', pct: 30, color: '#D4662A' },
      { label: 'Customer Success', pct: 15, color: '#063D3E' },
      { label: 'Infrastructure', pct: 10, color: '#AEAEB2' },
    ],
    tags: ['Komplett-System', 'API + Webhooks', 'Sevdesk · Lexoffice · DATEV', 'White-Label', 'EU-Expansion'],
    gate: [
      '25.000 Kunden erreicht',
      '95%+ 30-Day Retention',
      'NPS 55+',
      'Advanced Features erfolgreich released',
      'Revenue on Forecast (12M€ annualisiert)',
    ],
  },
]

// ── Chart Data ────────────────────────────────────────────────────
const GROWTH_DATA = [
  { period: 'Q2 2027', kunden: 5, revenue: 2.5 },
  { period: 'Q4 2027', kunden: 15, revenue: 12 },
  { period: 'Q2 2028', kunden: 25, revenue: 24 },
  { period: 'Q4 2028', kunden: 50, revenue: 40 },
  { period: '2029', kunden: 65, revenue: 80 },
  { period: '2030', kunden: 75, revenue: 130 },
  { period: '2031+', kunden: 75, revenue: 181 },
]

// ── Investment Milestones ─────────────────────────────────────────
const MILESTONES = [
  { id: 1, label: 'Seed Close', period: 'Mai 2026', amount: '1,5 M€', desc: 'MVP-Finanzierung', icon: '🌱', color: '#063D3E' },
  { id: 2, label: 'Series A Trigger', period: 'Q1 2027', amount: '5k Kunden', desc: '12M€ Revenue Ziel', icon: '📊', color: '#0066FF' },
  { id: 3, label: 'Series A Close', period: 'Q2 2027', amount: '20–30 M€', desc: 'Scale-Finanzierung', icon: '💼', color: '#D4662A' },
  { id: 4, label: 'Series B Trigger', period: 'Q3 2028', amount: '15k Kunden', desc: '40M€ Revenue Ziel', icon: '🚀', color: '#34C759' },
]

// ── Custom Tooltip ────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, metric }: {
  active?: boolean; payload?: { value: number }[]; label?: string; metric: 'kunden' | 'revenue'
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[12px] px-3 py-2 text-xs border shadow-md"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
      <p className="font-semibold mb-0.5">{label}</p>
      <p style={{ color: metric === 'kunden' ? '#063D3E' : '#D4662A' }}>
        {metric === 'kunden' ? `${payload[0].value}k Kunden` : `${payload[0].value} M€ Revenue`}
      </p>
    </div>
  )
}

// ── Phase Status (specific per phase) ────────────────────────────
const phaseStatus: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: '🚧 In Planung',   color: '#0066FF',  bg: 'rgba(0,102,255,0.10)' },
  2: { label: '📅 Geplant',      color: '#FF9500',  bg: 'rgba(255,149,0,0.10)' },
  3: { label: '📅 Geplant',      color: '#FF9500',  bg: 'rgba(255,149,0,0.10)' },
  4: { label: '🔭 Langfristig',  color: '#8E8E93',  bg: 'rgba(142,142,147,0.10)' },
  5: { label: '🔭 Langfristig',  color: '#8E8E93',  bg: 'rgba(142,142,147,0.10)' },
}

// ── Main Component ────────────────────────────────────────────────
export default function InvestorFuture() {
  const [selectedPhase, setSelectedPhase] = useState(1)
  const [chartMetric, setChartMetric] = useState<'kunden' | 'revenue'>('kunden')

  const phase = PHASES.find(p => p.id === selectedPhase) ?? PHASES[0]

  return (
    <div className="max-w-5xl fade-up">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Zukunft &amp; Roadmap
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Product Roadmap 2026–2032 · 5 Phasen · Vollständige Digitalisierung der Baubranche
        </p>
      </div>

      {/* ── Warum Jetzt? — 3-card grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 fade-up fade-up-1">
        {[
          {
            icon: '🏗️',
            title: 'Die Baubranche digitalisiert sich jetzt',
            body: '96% der deutschen Bauunternehmen sind KMUs — fast alle noch ohne digitales Bestellsystem. Das Fenster für Marktführerschaft öffnet sich genau jetzt.',
            color: '#063D3E',
          },
          {
            icon: '🤝',
            title: 'Partner-Netzwerk bereits gesichert',
            body: '9 führende Produktionspartner mit 2,3M Produkten verhandelt. Der Marktplatz-Inhalt ist bereit — es fehlt nur die Finanzierung zum Launch.',
            color: '#D4662A',
          },
          {
            icon: '💡',
            title: 'Komplett-System als Alleinstellungsmerkmal',
            body: 'Kein Wettbewerber bietet ein vollintegriertes System für Controlling, Buchhaltung, Angebote und Team-Steuerung. Avento besetzt diesen Slot — alles aus einer Hand.',
            color: '#0066FF',
          },
        ].map(card => (
          <div key={card.title} className="rounded-[20px] p-5 border hover-card"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-xl mb-3"
              style={{ background: `${card.color}12` }}>{card.icon}</div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{card.title}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{card.body}</p>
          </div>
        ))}
      </div>

      {/* ── Vision Stats — 2×2 mobile, 4×1 desktop ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: '🗺️', value: '5', label: 'Phasen', sub: 'Apr 2026 – 2032' },
          { icon: '👥', value: '75k', label: 'Kunden-Ziel', sub: 'bis 2031' },
          { icon: '💶', value: '181M€', label: 'Revenue-Ziel', sub: 'bis 2032' },
          { icon: '📈', value: '49%', label: 'EBITDA Ziel', sub: 'Zielmarge' },
        ].map(stat => (
          <div key={stat.label} className="rounded-[16px] p-4 border flex flex-col"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="text-2xl mb-2">{stat.icon}</span>
            <span className="text-xl md:text-2xl font-bold leading-none mb-1"
              style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{stat.label}</span>
            <span className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* ── Seed-Round Banner ── */}
      <div className="rounded-[20px] p-5 mb-6 flex items-center gap-4 flex-wrap fade-up fade-up-3"
        style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">SEED-RUNDE LÄUFT</p>
          <p className="text-white font-bold text-base leading-tight">Jetzt einsteigen: €1,5M Seed-Runde · ab €25.000</p>
          <p className="text-white/70 text-xs mt-1">
            Finanziert Phase 1 & 2 — Conser Webshop Launch + Marketing. Investor-Anteile entstehen durch diese Runde.
          </p>
        </div>
        <Link to="/investor/chat"
          className="shrink-0 px-5 py-2.5 rounded-[12px] text-sm font-bold transition hover:opacity-90"
          style={{ background: '#D4662A', color: 'white' }}>
          Gespräch starten →
        </Link>
      </div>

      {/* ── Desktop Timeline Stepper ── */}
      <div className="hidden md:block rounded-[20px] border p-6 mb-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-5"
          style={{ color: 'var(--text-secondary)' }}>PHASEN-ÜBERSICHT</p>
        <div className="relative">
          {/* Gradient line through node centers */}
          <div className="absolute left-0 right-0 h-0.5" style={{
            top: '24px',
            background: 'linear-gradient(90deg, #063D3E 0%, #D4662A 25%, #0066FF 50%, #34C759 75%, #FF9500 100%)',
          }} />
          <div className="grid grid-cols-5 gap-2">
            {PHASES.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPhase(p.id)}
                className="flex flex-col items-center text-center transition-all active:scale-95"
              >
                <div
                  className="w-12 h-12 rounded-full border-4 flex items-center justify-center text-xl mb-3 transition-all relative z-10"
                  style={{
                    background: selectedPhase === p.id ? p.accentColor : 'var(--surface)',
                    borderColor: p.accentColor,
                    boxShadow: selectedPhase === p.id ? `0 0 0 5px ${p.accentColor}22` : 'none',
                  }}
                >
                  {selectedPhase === p.id
                    ? <span className="text-white text-sm font-bold">{p.id}</span>
                    : <span>{p.icon}</span>
                  }
                </div>
                <p className="text-xs font-bold leading-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  {p.title}
                </p>
                <p className="text-[10px] leading-tight" style={{ color: 'var(--text-secondary)' }}>
                  {p.timeframe}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile Phase Pills ── */}
      <div className="md:hidden mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-secondary)' }}>PHASE WÄHLEN</p>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {PHASES.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPhase(p.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-[12px] border transition-all text-xs font-semibold"
              style={{
                background: selectedPhase === p.id ? p.accentColor : 'var(--surface)',
                color: selectedPhase === p.id ? 'white' : 'var(--text-secondary)',
                borderColor: selectedPhase === p.id ? p.accentColor : 'var(--border)',
              }}
            >
              <span>{p.icon}</span>
              <span>P{p.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Selected Phase Detail ── */}
      <div
        key={phase.id}
        className="rounded-[20px] border-2 overflow-hidden mb-8"
        style={{ borderColor: phase.accentColor, background: 'var(--surface)' }}
      >
        {/* Phase Header */}
        <div className="p-5 md:p-6" style={{ background: phase.bgColor, borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: phase.accentColor }}
            >
              {phase.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                  style={{ background: phase.accentColor }}>
                  Phase {phase.id}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: phaseStatus[phase.id]?.bg, color: phaseStatus[phase.id]?.color }}>
                  {phaseStatus[phase.id]?.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {phase.duration}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold leading-tight mb-0.5"
                style={{ color: 'var(--text-primary)' }}>
                {phase.title}
                <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-secondary)' }}>
                  — {phase.subtitle}
                </span>
              </h2>
              <p className="text-sm font-medium" style={{ color: phase.accentColor }}>
                {phase.timeframe}
              </p>
            </div>
          </div>
        </div>

        {/* Phase Content — 2-col on desktop */}
        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left column */}
          <div>
            {/* Goals */}
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-secondary)' }}>ZIELE</p>
            <ul className="space-y-2 mb-6">
              {phase.goals.map((g, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: phase.bgColor }}
                  >
                    <span style={{ color: phase.accentColor, fontSize: '10px', fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{g}</span>
                </li>
              ))}
            </ul>

            {/* Team (desktop only) */}
            <div className="hidden md:block mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'var(--text-secondary)' }}>TEAM</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{phase.team}</p>
            </div>

            {/* Tags */}
            {phase.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: 'var(--text-secondary)' }}>
                  {phase.id === 1 ? 'PARTNER (2,3M PRODUKTE)' : phase.id === 2 ? 'LAUNCH-KANÄLE' : phase.id === 3 ? 'MVP FEATURES' : phase.id === 4 ? 'PRICING' : 'FEATURES BETA2'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {phase.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: phase.bgColor, color: phase.accentColor }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div>
            {/* Key Metrics */}
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'var(--text-secondary)' }}>KEY METRICS</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {phase.keyMetrics.map(m => (
                <div key={m.label} className="rounded-[12px] p-3 border"
                  style={{ background: phase.bgColor, borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{m.icon}</span>
                    <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                  </div>
                  <p className="text-base font-bold" style={{ color: phase.accentColor }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Go/No-Go Gate */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: 'var(--text-secondary)' }}>GO / NO-GO GATE</p>
              <ul className="space-y-2">
                {phase.gate.map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Clock size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#D4662A' }} />
                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Budget Bar (full width) */}
        <div className="px-5 md:px-6 pb-5 md:pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: 'var(--text-secondary)' }}>BUDGET-VERTEILUNG</p>
          <div className="flex rounded-full overflow-hidden h-3 mb-2.5">
            {phase.budgetBreakdown.map(b => (
              <div
                key={b.label}
                style={{ width: `${b.pct}%`, background: b.color }}
                title={`${b.label}: ${b.pct}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {phase.budgetBreakdown.map(b => (
              <div key={b.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.color }} />
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                  {b.label} <span style={{ color: 'var(--text-tertiary)' }}>({b.pct}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Customer Growth Chart ── */}
      <div className="rounded-[20px] border p-5 md:p-6 mb-8"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
          <div>
            <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Wachstumskurve
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              5k → 75k Kunden · Q2 2027 – 2031
            </p>
          </div>
          {/* Metric toggle */}
          <div className="flex gap-1 p-1 rounded-[10px]" style={{ background: 'var(--surface2)' }}>
            {(['kunden', 'revenue'] as const).map(m => (
              <button
                key={m}
                onClick={() => setChartMetric(m)}
                className="px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all"
                style={{
                  background: chartMetric === m ? 'var(--surface)' : 'transparent',
                  color: chartMetric === m ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: chartMetric === m ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {m === 'kunden' ? '👥 Kunden' : '💶 Revenue'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"
                    stopColor={chartMetric === 'kunden' ? '#063D3E' : '#D4662A'}
                    stopOpacity={0.22} />
                  <stop offset="95%"
                    stopColor={chartMetric === 'kunden' ? '#063D3E' : '#D4662A'}
                    stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => chartMetric === 'kunden' ? `${v}k` : `${v}M€`}
                width={40}
              />
              <Tooltip content={<CustomTooltip metric={chartMetric} />} />
              <Area
                type="monotone"
                dataKey={chartMetric}
                stroke={chartMetric === 'kunden' ? '#063D3E' : '#D4662A'}
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={{ r: 4, fill: chartMetric === 'kunden' ? '#063D3E' : '#D4662A', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart footnote */}
        <div className="mt-4 flex flex-wrap gap-4 md:gap-6">
          {[
            { period: 'Q4 2027', kunden: '15k', revenue: '12M€', color: '#063D3E' },
            { period: 'Q4 2028', kunden: '50k', revenue: '40M€', color: '#0066FF' },
            { period: '2031', kunden: '75k', revenue: '181M€', color: '#D4662A' },
          ].map(m => (
            <div key={m.period} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {m.period}: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {m.kunden} Kunden · {m.revenue}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Investment Milestones — 2×2 mobile, 4-col desktop ── */}
      <div className="mb-8">
        <h2 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
          Investment Milestones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MILESTONES.map((m, idx) => (
            <div key={m.id} className="rounded-[16px] p-4 border relative overflow-hidden"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              {/* Step number */}
              <div
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: m.color }}
              >
                {idx + 1}
              </div>
              <span className="text-2xl mb-3 block">{m.icon}</span>
              <p className="text-sm font-bold mb-0.5 pr-7" style={{ color: 'var(--text-primary)' }}>{m.label}</p>
              <p className="text-sm font-bold mb-1" style={{ color: m.color }}>{m.amount}</p>
              <p className="text-[11px] mb-3" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
              <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${m.color}18`, color: m.color }}>
                  {m.period}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CAC Evolution (Desktop only, optional detail) ── */}
      <div className="hidden md:block rounded-[20px] border p-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-bold text-base mb-5" style={{ color: 'var(--text-primary)' }}>
          Kunden-Akquisitionskosten (CAC) — Entwicklung
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {[
            { phase: 'Beta1', period: 'Q2 2027', cac: '900€', bar: 100 },
            { phase: 'Beta2', period: 'Q3 2027', cac: '800€', bar: 89 },
            { phase: 'GA Year 1', period: '2028', cac: '700€', bar: 78 },
            { phase: 'Year 2', period: '2029', cac: '600€', bar: 67 },
            { phase: 'Year 3+', period: '2030+', cac: '550€', bar: 61 },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-full rounded-full overflow-hidden h-2 mb-3" style={{ background: 'var(--surface2)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.bar}%`,
                    background: `linear-gradient(90deg, #063D3E, #D4662A)`,
                    opacity: 1 - i * 0.12,
                  }}
                />
              </div>
              <p className="text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.cac}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{item.phase}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{item.period}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>
          CAC sinkt durch wachsendes Brand-Equity, Partner-Leverage und organische Mundpropaganda von 900€ auf 550€ (−39%).
        </p>
      </div>

    </div>
  )
}
