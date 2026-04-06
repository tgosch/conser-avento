import { CheckCircle, X as XIcon, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// ── Feature Comparison Data ──────────────────────────────────────
type Level = 'full' | 'partial' | 'none'

interface Feature {
  name: string
  tooltip: string
  avento: Level
  plancraft: Level
  hero: Level
  tooltime: Level
}

const FEATURES: Feature[] = [
  { name: 'Kalkulation',              tooltip: 'Projekt- und Angebotskalkulation',        avento: 'full', plancraft: 'full',    hero: 'full',    tooltime: 'full'    },
  { name: 'Buchhaltung (BuchBalance)', tooltip: 'Rechnungen, DATEV-Export, USt',           avento: 'full', plancraft: 'none',    hero: 'partial', tooltime: 'partial' },
  { name: 'Angebotserstellung',       tooltip: 'Professionelle Angebote erstellen',        avento: 'full', plancraft: 'full',    hero: 'full',    tooltime: 'full'    },
  { name: 'Bautagebuch (BauDoku AI)', tooltip: 'Digitales Bautagebuch mit KI',             avento: 'full', plancraft: 'partial', hero: 'partial', tooltime: 'none'    },
  { name: 'Material-Bestellung',      tooltip: '1-Click Bestellung über Marktplatz',       avento: 'full', plancraft: 'none',    hero: 'none',    tooltime: 'none'    },
  { name: 'Team-Steuerung',           tooltip: 'Mitarbeiter, Zeiterfassung, Plantafel',    avento: 'full', plancraft: 'partial', hero: 'full',    tooltime: 'partial' },
  { name: 'KI-Assistent (Space AI)',  tooltip: 'Intelligente Automatisierung & Kalkulation', avento: 'full', plancraft: 'none', hero: 'partial', tooltime: 'none'    },
  { name: 'Mobile App',               tooltip: 'iOS und Android nativ',                    avento: 'full', plancraft: 'full',    hero: 'full',    tooltime: 'full'    },
  { name: 'Integrierter Marktplatz',  tooltip: 'Conser: 12,8M Produkte direkt im ERP',    avento: 'full', plancraft: 'none',    hero: 'none',    tooltime: 'none'    },
  { name: 'DACH-Fokus Baubranche',    tooltip: 'Spezialisiert auf Handwerk & Bau',         avento: 'full', plancraft: 'full',    hero: 'full',    tooltime: 'full'    },
]

const COMPETITORS = [
  { name: 'Avento + Conser', highlight: true },
  { name: 'Plancraft',       highlight: false },
  { name: 'HERO',            highlight: false },
  { name: 'ToolTime',        highlight: false },
]

function StatusIcon({ level }: { level: Level }) {
  switch (level) {
    case 'full':
      return <CheckCircle size={16} style={{ color: '#22C55E' }} />
    case 'partial':
      return <Minus size={16} style={{ color: '#EAB308' }} />
    case 'none':
      return <XIcon size={16} style={{ color: '#EF4444' }} />
  }
}

// ── Competitor Profile Cards ─────────────────────────────────────
const PROFILES = [
  {
    name: 'Plancraft',
    desc: 'Cloud-Handwerkersoftware aus Hamburg. Fokus auf einfache Kalkulation und Angebote. Note 1,4 (für-gründer.de 2026). Ab 74,90€/Mo. Keine Buchhaltung, keine Materialbestellung.',
    strength: 'Einfache Bedienung, Kalkulation & Aufmaß',
    weakness: 'Keine Buchhaltung, kein Marktplatz, kein KI, keine Lagerverwaltung',
    color: '#FF6B35',
    source: 'Quelle: für-gründer.de, trusted.de (2026)',
  },
  {
    name: 'HERO Software',
    desc: 'Testsieger bei trusted (Note 1,0 Usability). Umfangreiche Handwerkersoftware ab 69€/Mo. Starke Plantafel und App — aber kein eigener Marktplatz, keine KI-Module.',
    strength: 'Plantafel, Auftragsabwicklung, Mobile App',
    weakness: 'Kein integrierter Marktplatz, keine KI, keine Buchhaltung',
    color: '#1A73E8',
    source: 'Quelle: trusted.de, hero-software.de (2026)',
  },
  {
    name: 'ToolTime',
    desc: 'Cloudbasierte Lösung für kleine Betriebe. Note 1,7 (für-gründer.de 2026). Ab 35€/Mo. Einfach, aber eingeschränkter Funktionsumfang.',
    strength: 'Günstig, einfache Bedienung, Cloud-first',
    weakness: 'Begrenzter Scope, kein Marktplatz, kein KI, keine Bautagebuch-Funktion',
    color: '#00B8D4',
    source: 'Quelle: für-gründer.de, clockin.de (2026)',
  },
]

export default function InvestorCompetition() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="mb-8">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>WETTBEWERB</p>
        <h1 className="text-display-md mb-2" style={{ color: 'var(--text-primary)' }}>
          Warum Avento gewinnt
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          Kein bestehender Anbieter kombiniert ERP, Marktplatz und KI für die Baubranche.
          Avento + Conser ist der einzige integrierte Ansatz.
        </p>
      </div>

      {/* ── FEATURE COMPARISON TABLE ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-1">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>FEATURE-VERGLEICH</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--text-tertiary)' }}>Feature</th>
                {COMPETITORS.map(c => (
                  <th key={c.name}
                      className="px-2 py-3 md:px-4 md:py-4 text-center text-xs font-semibold uppercase tracking-wide"
                      style={{
                        color: c.highlight ? 'var(--brand)' : 'var(--text-tertiary)',
                        background: c.highlight ? 'var(--brand-dim)' : 'transparent',
                      }}>
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={f.name} style={{ borderBottom: i < FEATURES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td className="px-3 py-2.5 md:px-6 md:py-3.5">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{f.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{f.tooltip}</p>
                  </td>
                  {(['avento', 'plancraft', 'hero', 'tooltime'] as const).map(key => (
                    <td key={key} className="px-2 py-2.5 md:px-4 md:py-3.5 text-center"
                        style={{ background: key === 'avento' ? 'var(--brand-dim)' : 'transparent' }}>
                      <div className="flex justify-center">
                        <StatusIcon level={f[key]} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 flex items-center gap-6 flex-wrap" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <CheckCircle size={13} style={{ color: '#22C55E' }} /> Vollständig
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Minus size={13} style={{ color: '#EAB308' }} /> Teilweise
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <XIcon size={13} style={{ color: '#EF4444' }} /> Nicht vorhanden
          </div>
        </div>
      </div>

      {/* ── COMPETITOR PROFILES ── */}
      <div className="mb-8 animate-fade-up delay-2">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>WETTBEWERBER IM DETAIL</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROFILES.map(p => (
            <div key={p.name} className="card p-5" style={{ borderTop: `3px solid ${p.color}` }}>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{p.desc}</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={12} className="shrink-0 mt-0.5" style={{ color: '#22C55E' }} />
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}><span className="font-semibold">Stärke:</span> {p.strength}</p>
                </div>
                <div className="flex items-start gap-2">
                  <XIcon size={12} className="shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}><span className="font-semibold">Schwäche:</span> {p.weakness}</p>
                </div>
              </div>
              {p.source && (
                <p className="text-[9px] mt-3 pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>{p.source}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── AVENTO ADVANTAGE ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-3">
        <div className="relative px-5 py-8 md:px-12 md:py-14 text-center"
             style={{ background: 'linear-gradient(135deg, #071F20 0%, #0A3436 40%, #0D4547 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #C8611A 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
          <p className="text-xs font-bold tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>UNSER UNFAIRER VORTEIL</p>
          <h2 className="text-display-md text-white mb-6" style={{ maxWidth: 480, margin: '0 auto' }}>
            ERP + Marktplatz + KI<br />in einem System
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
            {[
              { value: '10/10', label: 'Features abgedeckt' },
              { value: '0', label: 'Wettbewerber mit gleichem Scope' },
              { value: '2', label: 'KI-Module bereits live' },
              { value: '7 / 25', label: 'Partner-Integrationen' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-metric-md text-white mb-1">{s.value}</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MARKTPOSITIONIERUNG ── */}
      <div className="mb-8 animate-fade-up delay-4">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>MARKTPOSITIONIERUNG</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'TAM', value: '€42 Mrd.', desc: 'Gesamter Baumarkt DACH — Digitalisierungspotenzial', color: 'var(--brand)' },
            { label: 'SAM', value: '€8,4 Mrd.', desc: 'Adressierbarer Markt — Software + Marktplatz für Handwerk', color: 'var(--accent)' },
            { label: 'SOM', value: '€181M', desc: 'Unser Ziel bei Reife (2032) — 75.000 Kunden, 49% EBITDA', color: '#22C55E' },
          ].map(m => (
            <div key={m.label} className="card p-6 text-center group hover:translate-y-[-2px] transition-all duration-300">
              <p className="text-[10px] font-bold tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>{m.label}</p>
              <p className="text-metric-xl mb-2 transition-transform duration-300 group-hover:scale-105" style={{ color: m.color }}>{m.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="card p-5 animate-fade-up delay-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Überzeugt?</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Das Pitch-Deck hat alle Details zum Investment Case.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/investor/plans" className="btn btn-primary btn-lg">
              Pitch-Deck ansehen <ArrowRight size={14} />
            </Link>
            <Link to="/investor/chat" className="btn btn-lg"
                  style={{ background: 'var(--surface2)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
              Chat mit Torben
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
