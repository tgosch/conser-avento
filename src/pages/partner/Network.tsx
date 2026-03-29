import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Partner } from '../../lib/supabase'
import { ArrowRight, Quote, Calendar } from 'lucide-react'

const FALLBACK_PRODUCTION: Partner[] = [
  { id: 'p1', name: 'Richter+Frenzel', type: 'production', category: 'Sanitär & Heizung', description: 'Marktführer für Sanitär, Heizung und Klima', status: 'partner', logo_path: null, initials: 'RF', color: '#0055A4', visible: true, order_index: 1, created_at: '' },
  { id: 'p2', name: 'BayWa', type: 'production', category: 'Baustoffe', description: 'Internationaler Baustoffhändler', status: 'active', logo_path: null, initials: 'BW', color: '#008C45', visible: true, order_index: 2, created_at: '' },
  { id: 'p3', name: 'FEGA & Schmitt', type: 'production', category: 'Elektro', description: 'Elektro-Großhandel', status: 'active', logo_path: null, initials: 'FS', color: '#E30613', visible: true, order_index: 3, created_at: '' },
  { id: 'p4', name: 'Sonepar', type: 'production', category: 'Elektro', description: 'Weltweit größter Elektro-Distributor', status: 'negotiating', logo_path: null, initials: 'SO', color: '#003DA5', visible: true, order_index: 4, created_at: '' },
  { id: 'p5', name: 'Würth', type: 'production', category: 'Befestigungstechnik', description: 'Weltmarktführer Befestigungstechnik', status: 'negotiating', logo_path: null, initials: 'WÜ', color: '#CC0000', visible: true, order_index: 5, created_at: '' },
]

const FALLBACK_CUSTOMERS: Partner[] = [
  { id: 'c1', name: 'P+E Schmitt', type: 'customer', category: 'SHK-Fachbetrieb', description: 'Pilotkunde für Sanitär & Heizung', status: 'beta', logo_path: null, initials: 'PS', color: '#2563EB', visible: true, order_index: 1, created_at: '' },
  { id: 'c2', name: 'In Concept', type: 'customer', category: 'Elektro-Fachbetrieb', description: 'Pilotpartner für Elektro-Integration', status: 'beta', logo_path: null, initials: 'IC', color: '#7C3AED', visible: true, order_index: 2, created_at: '' },
  { id: 'c3', name: 'IKEA Bau', type: 'customer', category: 'Generalunternehmer', description: 'Pilotprojekt Modulares Bauen', status: 'active', logo_path: null, initials: 'IB', color: '#0051BA', visible: true, order_index: 3, created_at: '' },
]

const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  negotiating: { bg: 'rgba(234,179,8,0.10)',  text: '#EAB308', label: 'Verhandlung' },
  active:      { bg: 'rgba(59,130,246,0.10)', text: '#3B82F6', label: 'Aktiv' },
  beta:        { bg: 'rgba(139,92,246,0.10)', text: '#8B5CF6', label: 'Beta' },
  partner:     { bg: 'rgba(34,197,94,0.10)',  text: '#22C55E', label: 'Partner' },
}

export default function PartnerNetwork() {
  const [production, setProduction] = useState<Partner[]>(FALLBACK_PRODUCTION)
  const [customers, setCustomers] = useState<Partner[]>(FALLBACK_CUSTOMERS)

  useEffect(() => {
    supabase.from('partners').select('*').eq('visible', true).order('order_index').then(({ data }) => {
      if (data && data.length > 0) {
        setProduction(data.filter(p => p.type === 'production'))
        setCustomers(data.filter(p => p.type === 'customer'))
      }
    })
  }, [])

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
          { value: String(production.length), label: 'Produktionspartner', icon: '🏭' },
          { value: String(customers.length), label: 'Pilotkunden', icon: '🔨' },
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

      {/* ── PARTNER-STIMMEN (Coming Soon) ── */}
      <div className="mb-8 animate-fade-up delay-1">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>PARTNER-STIMMEN</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { initials: 'RF', color: '#0055A4', company: 'Richter+Frenzel', role: 'Produktionspartner' },
            { initials: 'BW', color: '#008C45', company: 'BayWa', role: 'Produktionspartner' },
            { initials: 'FS', color: '#E30613', company: 'FEGA & Schmitt', role: 'Produktionspartner' },
          ].map((t, i) => (
            <div key={i} className="card p-5 relative overflow-hidden">
              <div className="absolute inset-0 z-10 flex items-center justify-center"
                   style={{ background: 'color-mix(in srgb, var(--bg) 75%, transparent)', backdropFilter: 'blur(4px)' }}>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: 'var(--surface)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
                  Bald verfügbar
                </span>
              </div>
              <Quote size={22} style={{ color: 'var(--brand)', opacity: 0.15 }} className="mb-3" />
              <p className="text-sm italic mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                "Platzhalter für ein echtes Testimonial dieses Partners..."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                     style={{ background: t.color }}>{t.initials}</div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{t.company}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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

      {/* ── PILOT CUSTOMERS ── */}
      <div className="mb-8 animate-fade-up delay-3">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>PILOTKUNDEN</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {customers.map(p => <PartnerCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="card overflow-hidden animate-fade-up delay-4">
        <div className="relative px-8 py-10 md:py-12 text-center"
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
