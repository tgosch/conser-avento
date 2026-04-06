import { useState } from 'react'

const PHASE_COLORS = [
  { c1: '#185FA5', c2: '#0C447C' },
  { c1: '#BA7517', c2: '#854F0B' },
  { c1: '#0F6E56', c2: '#085041' },
  { c1: '#D85A30', c2: '#993C1D' },
  { c1: '#3B6D11', c2: '#27500A' },
  { c1: '#534AB7', c2: '#3C3489' },
]

const PHASES = [
  {
    num: 0,
    title: 'Gesamtaufsetzung',
    timeline: 'Apr – Jun 2026 · 12 Wochen',
    sections: {
      'Infrastruktur': ['AWS Cloud Setup', 'Auth System (OAuth)', 'Design System', 'CI/CD Pipeline', 'Monitoring', 'RLS & Security'],
      'Team Effort': ['Martin (CFO): 100%', 'Dev 1 (Backend): 100%', 'Dev 2 (Frontend): 100%', 'Dev 3 (Backend): 50%'],
    },
    metrics: [
      { label: 'Kosten', value: '180k€' },
      { label: 'Delivery', value: '30. Jun' },
      { label: 'Status', value: 'Ready' },
      { label: 'Critical', value: 'Foundation' },
    ],
  },
  {
    num: 1,
    title: 'Conser MVP',
    timeline: 'Jul – Aug 2026 · 8 Wochen',
    sections: {
      'Features': ['12,8M Produkte Live', '7 Partner Integration', 'Product Search', 'Shopping Cart', 'Payment & Escrow', 'Order Mgmt'],
      'Team Effort': ['Martin (CFO): 80%', 'Dev 1 (Backend): 100%', 'Dev 2 (Frontend): 100%', 'Dev 3 (Backend): 100%'],
    },
    metrics: [
      { label: 'Kunden', value: '1.000+' },
      { label: 'GMV', value: '5 M€' },
      { label: 'Rating', value: '4,5★' },
      { label: 'Launch', value: '26. Aug' },
    ],
  },
  {
    num: 2,
    title: 'Avento Beta 1',
    timeline: 'Sep 2026 · 8 Wochen',
    sections: {
      'Core ERP': ['Zeiterfassung', 'Kalender', 'Angebote', 'Rechnungen', 'Dashboard', 'Admin Panel'],
      'Team Effort': ['Martin (CFO): 70%', 'Dev 1 (Backend): 100%', 'Dev 2 (Frontend): 100%', 'Dev 3 (Backend): 100%'],
    },
    metrics: [
      { label: 'Kunden', value: '1.000' },
      { label: 'MRR', value: '40k€' },
      { label: 'NPS', value: '50+' },
      { label: 'Retention', value: '95%+' },
    ],
  },
  {
    num: 3,
    title: 'Deep Integration',
    timeline: 'Nov 2026 · 10 Wochen',
    sections: {
      'Advanced Features': ['Conser ↔ Avento Sync', 'KI-Mitarbeiter', 'Baustellen-Doku', 'Analytics', 'Mobile App', 'Smart Recs'],
      'Team Effort': ['Martin (CFO): 60%', 'Dev 1 (Backend): 100%', 'Dev 2 (Frontend): 100%', 'Dev 3 (Backend): 100%'],
    },
    metrics: [
      { label: 'Kunden', value: '5.000' },
      { label: 'MRR', value: '400k€' },
      { label: 'Orders/Mo', value: '1.000+' },
      { label: 'KI Acc.', value: '85%+' },
    ],
  },
  {
    num: 4,
    title: 'Mobile & Advanced',
    timeline: 'Feb – Mär 2027 · 10 Wochen',
    sections: {
      'Apps & Features': ['iOS/Android Apps', 'Controlling', 'Intelligent Offers', 'Lager Mgmt', 'Offline Mode', 'Push Notifs'],
      'Team Effort': ['Martin (CFO): 50%', 'Dev 1 (Backend): 100%', 'Dev 2 (Frontend): 100%', 'Dev 3 (Backend): 100%'],
    },
    metrics: [
      { label: 'Kunden', value: '25.000' },
      { label: 'MRR', value: '2,0 M€' },
      { label: 'App Users', value: '10.000+' },
      { label: 'Status', value: 'B/E+' },
    ],
  },
  {
    num: 5,
    title: 'GA Launch',
    timeline: 'Apr – Mai 2027 · 6 Wochen',
    sections: {
      'Finalization': ['Workflow Engine', 'Full Union', 'UI/UX Polish', 'Code Cleanup', 'Hardening', 'GA Ready'],
      'Team Effort': ['Martin (CFO): 40%', 'Dev 1 (Backend): 100%', 'Dev 2 (Frontend): 100%', 'Dev 3 (Backend): 100%'],
    },
    metrics: [
      { label: 'Kunden', value: '75.000+' },
      { label: 'Revenue', value: '181 M€' },
      { label: 'NPS', value: '60+' },
      { label: 'Status', value: '🎉 GA' },
    ],
  },
]

const TEAM = [
  {
    role: '🚀 CEO & Product Owner',
    name: 'Torben Gosch',
    tasks: ['Strategie & Vision', 'Investor Relations', 'Customer Feedback', 'Product Prioritization'],
    status: 'ACTIVE',
  },
  {
    role: '💰 CFO & Co-Founder',
    name: 'Martin Grote',
    tasks: ['Finanzen & Controlling', 'Operative Steuerung', 'Business Development', 'Team Leadership'],
    status: 'ACTIVE',
  },
  {
    role: '🔧 Backend Developer 1',
    name: 'Dev 1',
    tasks: ['Core Services (Time, Offers)', 'Database Implementation', 'API Development', 'Testing & QA'],
    status: 'ACTIVE',
  },
  {
    role: '🎨 Frontend Developer',
    name: 'Dev 2',
    tasks: ['Design System', 'UI Components', 'All Frontend Modules', 'Mobile Responsive'],
    status: 'ACTIVE',
  },
  {
    role: '🔗 Backend Developer 2',
    name: 'Dev 3',
    tasks: ['Integrations (Conser/Payment)', 'Partner APIs', 'Payment/Escrow System', 'Commission Tracking'],
    status: 'ACTIVE',
  },
  {
    role: '🤖 Backend Developer 3',
    name: 'PLANNED',
    tasks: ['KI-Features (Agent, Automation)', 'Analytics & Reporting', 'Advanced Features', 'Optimization'],
    status: 'NACH FUNDING',
  },
]

const PARTNERS = [
  { name: 'Baustoffe & Agrar', products: '100–200k Produkte' },
  { name: 'Sanitär-Großhandel', products: '30–50k Produkte' },
  { name: 'Elektro-Großhandel', products: '30–50k Produkte' },
  { name: 'Holzhandel', products: '20–30k Produkte' },
  { name: 'Elektrotechnik', products: '15–25k Produkte' },
  { name: 'Holzfachhandel', products: '30–50k Produkte' },
  { name: 'Baustoffhandel', products: 'TBD' },
]

const COSTS = [
  { label: 'Seed-Finanzierung', amount: 'ab 1,2 M€', desc: 'Mindest-Runway 12 Monate · offen nach oben' },
  { label: 'Engineering (24 Mo)', amount: '540k€', desc: '4 Entwickler (intern) + Entwicklungspartner' },
  { label: 'Infra & Tools', amount: '300k€', desc: 'AWS, Services, 3rd-party APIs' },
  { label: 'Total Project', amount: '890k€', desc: '24 Monate Entwicklung bis GA' },
  { label: 'Breakeven Point', amount: 'Mo 6–7', desc: 'Nach Revenue-Launch Post-Seed' },
  { label: 'Konditionen', amount: 'Individuell', desc: 'Equity / Wandeldarlehen / SAFE' },
]

export default function InvestorRoadmap() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="max-w-5xl fade-up">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Operativer Sprint-Plan
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Detaillierte Ausführungsplanung · Sprints, Ressourcen & Meilensteine
        </p>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Timeline', value: '24 Monate' },
          { label: 'Team', value: '6 + 2 geplant' },
          { label: 'Target Customers', value: '75.000+' },
          { label: 'Revenue Y6', value: '181 M€' },
          { label: 'Expansion', value: 'DACH → EU' },
          { label: 'Konditionen', value: 'Individuell' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-[14px] p-3 border text-center"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
              {s.label}
            </p>
            <p className="text-base font-bold" style={{ color: '#185FA5' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Current Team ── */}
      <div
        className="rounded-[20px] border-2 p-5 md:p-6 mb-6"
        style={{ background: 'var(--surface)', borderColor: '#185FA5' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          👥 Aktuelle Team-Struktur
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          {TEAM.map(m => (
            <div
              key={m.name}
              className="rounded-[14px] p-4 border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            >
              <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{m.role}</p>
              <p className="text-xs font-semibold mb-2" style={{ color: '#185FA5' }}>{m.name}</p>
              <ul className="space-y-0.5 mb-3">
                {m.tasks.map(t => (
                  <li key={t} className="text-[11px] flex items-start gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <span>•</span><span>{t}</span>
                  </li>
                ))}
              </ul>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: m.status === 'ACTIVE' ? 'rgba(52,199,89,0.12)' : 'rgba(255,149,0,0.12)',
                  color: m.status === 'ACTIVE' ? '#34C759' : '#FF9500',
                }}
              >
                {m.status}
              </span>
            </div>
          ))}
        </div>

        {/* Team expansion */}
        <div className="rounded-[12px] p-4 border" style={{ borderColor: 'var(--border)', background: 'rgba(24,95,165,0.04)' }}>
          <p className="text-xs font-bold mb-3" style={{ color: '#185FA5' }}>📈 Team-Expansion nach Funding (Apr–Jun 2026)</p>
          <div className="flex flex-wrap gap-2">
            {[
              { date: 'Jun 2026', count: '+2', role: 'Backend Devs' },
              { date: 'Aug 2026', count: '+1', role: 'Frontend Dev' },
              { date: 'Okt 2026', count: '+1', role: 'DevOps/Infra' },
              { date: 'Jan 2027', count: '+2', role: 'Backend Devs' },
              { date: 'Mär 2027', count: '+1', role: 'Frontend Dev' },
            ].map(e => (
              <div
                key={e.date}
                className="rounded-[10px] px-3 py-2 border text-center"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', minWidth: 90 }}
              >
                <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{e.date}</p>
                <p className="text-base font-bold" style={{ color: '#185FA5' }}>{e.count}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{e.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Partner Strategy ── */}
      <div
        className="rounded-[20px] border p-5 md:p-6 mb-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          🌐 Partner-Strategie & Marktexpansion
        </h2>

        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
          AKTIVE PARTNER (PHASE 1 LAUNCH)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
          {PARTNERS.map(p => (
            <div
              key={p.name}
              className="rounded-[12px] p-3 border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            >
              <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{p.products}</p>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block"
                style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}
              >
                LIVE
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
          PARTNER-EXPANSION PLAN
        </p>
        <div className="space-y-2">
          {[
            { timeline: 'Phase 1 (Jul–Aug 2026)', count: '7 (Ziel: 25)', region: 'DACH-Region', desc: '7 führende Großhändler aus SHK, Elektro, Holz und Baustoffen = 12,8M Produkte' },
            { timeline: 'Phase 2–3 (Sep 2026–Feb 2027)', count: '+8–12', region: 'Erweiterte DACH', desc: 'Zusätzliche regionale Partner (Baustoff-Häuser, Großhändler, Spezialisten)' },
            { timeline: 'Phase 4–5 (Mär–Mai 2027)', count: '+10–20', region: 'Europa', desc: 'Internationale Partner in FR, NL, AT, IT, ES, Poland, Czech (30–50 Partner Ziel)' },
          ].map(e => (
            <div
              key={e.timeline}
              className="rounded-[12px] p-3 border flex items-start gap-3"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            >
              <span className="text-xl font-bold flex-shrink-0" style={{ color: '#185FA5', minWidth: 48 }}>{e.count}</span>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{e.timeline}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(24,95,165,0.10)', color: '#185FA5' }}>
                    {e.region}
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Phase Cards ── */}
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        🗺️ Projektphasen (6 Etappen)
      </h2>
      <div className="space-y-3 mb-6">
        {PHASES.map((phase, i) => {
          const { c1, c2 } = PHASE_COLORS[i]
          const isOpen = expanded === phase.num

          return (
            <div
              key={phase.num}
              className="rounded-[16px] border-2 overflow-hidden"
              style={{ borderColor: isOpen ? c1 : 'var(--border)', background: 'var(--surface)' }}
            >
              {/* Header bar */}
              <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
              />

              {/* Clickable header */}
              <button
                className="w-full flex items-center gap-4 p-4 text-left"
                onClick={() => setExpanded(isOpen ? null : phase.num)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                  {phase.num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{phase.title}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{phase.timeline}</p>
                </div>
                {/* Metrics preview */}
                <div className="hidden sm:flex gap-4 mr-2">
                  {phase.metrics.slice(0, 2).map(m => (
                    <div key={m.label} className="text-right">
                      <p className="text-xs font-bold" style={{ color: c1 }}>{m.value}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
                <span className="text-lg" style={{ color: 'var(--text-tertiary)' }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                    {/* Sections */}
                    <div className="space-y-4">
                      {Object.entries(phase.sections).map(([title, items]) => (
                        <div key={title}>
                          <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
                            style={{ color: 'var(--text-secondary)' }}>{title}</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {(items as string[]).map((item: string) => (
                              <div key={item} className="flex items-start gap-1.5">
                                <span style={{ color: c1, fontSize: 14, lineHeight: 1.4 }}>▸</span>
                                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide mb-2"
                        style={{ color: 'var(--text-secondary)' }}>KEY METRICS</p>
                      <div className="grid grid-cols-2 gap-2">
                        {phase.metrics.map(m => (
                          <div
                            key={m.label}
                            className="rounded-[10px] p-3 border"
                            style={{ background: `${c1}0d`, borderColor: 'var(--border)' }}
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-wide mb-1"
                              style={{ color: 'var(--text-tertiary)' }}>{m.label}</p>
                            <p className="text-base font-bold" style={{ color: c1 }}>{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Conser <-> Avento Sync ── */}
      <div
        className="rounded-[20px] border p-5 md:p-6 mb-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          🔄 Conser ↔ Avento Synchronisation
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {[
            { num: 1, title: 'Avento Projekt', desc: 'Handwerker erstellt Projekt mit Material-Bedarf' },
            { num: 2, title: 'Smart Match', desc: 'Conser analysiert & findet beste Angebote' },
            { num: 3, title: '1-Click Order', desc: 'Bestellung, Payment, Tracking, Rechnung' },
          ].map((node, i) => (
            <div key={node.num} className="flex sm:flex-col items-center sm:items-stretch flex-1 gap-2">
              <div
                className="rounded-[14px] p-4 border flex-1"
                style={{ background: 'rgba(24,95,165,0.06)', borderColor: '#185FA5' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs mb-2"
                  style={{ background: '#185FA5' }}
                >
                  {node.num}
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{node.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{node.desc}</p>
              </div>
              {i < 2 && (
                <span className="text-xl font-bold sm:hidden" style={{ color: '#185FA5' }}>→</span>
              )}
              {i < 2 && (
                <span className="hidden sm:block text-center text-2xl font-bold" style={{ color: '#185FA5' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Cost Breakdown ── */}
      <div
        className="rounded-[20px] border p-5 md:p-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          💰 Budget & Investition
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COSTS.map(c => (
            <div
              key={c.label}
              className="rounded-[14px] p-4 border text-center"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                {c.label}
              </p>
              <p className="text-xl font-bold mb-1" style={{ color: '#185FA5' }}>{c.amount}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
