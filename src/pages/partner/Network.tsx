import { useState } from 'react'
import type { Partner } from '../../lib/supabase'
import { ArrowRight, Calendar } from 'lucide-react'

const FALLBACK_PRODUCTION: Partner[] = [
  { id: 'p1', name: 'Sanitär & Heizung', type: 'production', category: 'Sanitär & Heizung', description: 'Führender Großhändler für Sanitär, Heizung und Klima', status: 'partner', logo_path: null, initials: 'SH', color: '#0055A4', visible: true, order_index: 1, created_at: '' },
  { id: 'p2', name: 'Baustoffe', type: 'production', category: 'Baustoffe', description: 'Internationaler Baustoffhändler', status: 'active', logo_path: null, initials: 'BS', color: '#008C45', visible: true, order_index: 2, created_at: '' },
  { id: 'p3', name: 'Elektro', type: 'production', category: 'Elektro', description: 'Elektro-Großhandel für Fachbetriebe', status: 'active', logo_path: null, initials: 'EL', color: '#E30613', visible: true, order_index: 3, created_at: '' },
  { id: 'p4', name: 'Befestigungstechnik', type: 'production', category: 'Befestigungstechnik', description: 'Spezialist für Befestigungs- und Montagetechnik', status: 'active', logo_path: null, initials: 'BF', color: '#CC0000', visible: true, order_index: 4, created_at: '' },
  { id: 'p5', name: 'Dach & Fassade', type: 'production', category: 'Dach & Fassade', description: 'Dachbaustoffe und Fassadensysteme', status: 'partner', logo_path: null, initials: 'DF', color: '#7C3AED', visible: true, order_index: 5, created_at: '' },
  { id: 'p6', name: 'Werkzeuge & Maschinen', type: 'production', category: 'Werkzeuge & Maschinen', description: 'Profi-Werkzeuge und Baumaschinen', status: 'active', logo_path: null, initials: 'WM', color: '#003DA5', visible: true, order_index: 6, created_at: '' },
  { id: 'p7', name: 'Haustechnik', type: 'production', category: 'Haustechnik', description: 'Lüftung, Klima und Gebäudetechnik', status: 'negotiating', logo_path: null, initials: 'HT', color: '#0EA5E9', visible: true, order_index: 7, created_at: '' },
]

const FALLBACK_CUSTOMERS: Partner[] = []

const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  negotiating: { bg: 'rgba(234,179,8,0.10)',  text: '#EAB308', label: 'Verhandlung' },
  active:      { bg: 'rgba(59,130,246,0.10)', text: '#3B82F6', label: 'Aktiv' },
  beta:        { bg: 'rgba(139,92,246,0.10)', text: '#8B5CF6', label: 'Beta' },
  partner:     { bg: 'rgba(34,197,94,0.10)',  text: '#22C55E', label: 'Partner' },
}

export default function PartnerNetwork() {
  // Partner-Portal zeigt nur anonyme Branchen-Kategorien, keine echten Firmennamen
  const production = FALLBACK_PRODUCTION
  const [customers] = useState<Partner[]>(FALLBACK_CUSTOMERS)

  const PartnerCard = ({ p }: { p: Partner }) => {
    const s = STATUS_MAP[p.status] ?? STATUS_MAP.negotiating
    return (
      <div className="card p-4 flex items-center gap-4 group hover:translate-y-[-1px] transition-all duration-300">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white text-sm font-bold transition-transform duration-300 group-hover:scale-105"
          style={{ background: p.color, fontFamily: 'var(--font-mono)', boxShadow: `0 4px 12px ${p.color}30` }}>
          {p.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{p.category || p.description}</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 tracking-wide"
          style={{ background: s.bg, color: s.text }}>{s.label}</span>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-8 animate-fade-up">
        <p className="label-overline mb-2">Netzwerk</p>
        <h1 className="text-display-md mb-3" style={{ color: 'var(--text-primary)' }}>
          Unsere Partner & Pilotkunden
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          Sie sind in guter Gesellschaft. Führende Unternehmen der Branche sind bereits dabei.
        </p>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-up delay-1">
        {[
          { value: '7', label: 'Partner an Bord', icon: '🏭' },
          { value: '7', label: 'Branchen', icon: '🔨' },
          { value: '2,3M', label: 'Produkte', icon: '📦' },
          { value: 'DACH', label: 'Region', icon: '🌍' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center group hover:translate-y-[-1px] transition-all duration-300">
            <span className="text-lg block mb-1 transition-transform duration-300 group-hover:scale-110">{s.icon}</span>
            <p className="text-metric-md mb-0.5" style={{ color: 'var(--brand)' }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>


      {/* ── PRODUCTION PARTNERS ── */}
      <div className="mb-8 animate-fade-up delay-2">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>PRODUKTIONSPARTNER</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {production.map(p => <PartnerCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* Pilotkunden nur anzeigen wenn vorhanden */}
      {customers.length > 0 && (
        <div className="mb-8 animate-fade-up delay-3">
          <div className="flex items-center gap-2 mb-4">
            <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>PILOTKUNDEN</p>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {customers.map(p => <PartnerCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="card overflow-hidden animate-fade-up delay-4">
        <div className="relative px-5 py-8 md:px-8 md:py-12 text-center"
          style={{ background: 'linear-gradient(135deg, #041E1F 0%, #063D3E 40%, #0A5C5E 100%)' }}>
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
          <p className="text-xl md:text-2xl font-bold text-white mb-3">Werden Sie Teil des Netzwerks</p>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 380, margin: '0 auto' }}>
            Schließen Sie sich führenden Unternehmen der Baubranche an.
          </p>
          <a href="https://calendly.com/torben-gosch" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:translate-y-[-1px] hover:shadow-lg"
            style={{ background: 'white', color: '#063D3E' }}>
            <Calendar size={14} /> Termin vereinbaren <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
