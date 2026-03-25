import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Partner } from '../../lib/supabase'

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
  negotiating: { bg: 'rgba(234,179,8,0.12)',  text: '#EAB308', label: 'Verhandlung' },
  active:      { bg: 'rgba(59,130,246,0.12)', text: '#3B82F6', label: 'Aktiv' },
  beta:        { bg: 'rgba(139,92,246,0.12)', text: '#8B5CF6', label: 'Beta' },
  partner:     { bg: 'rgba(34,197,94,0.12)',  text: '#22C55E', label: 'Partner' },
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

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">

      <div className="mb-6">
        <p className="label-overline mb-1">Netzwerk</p>
        <h1 className="font-bold text-2xl md:text-3xl mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Unsere Partner & Pilotkunden
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Sie sind in guter Gesellschaft. Führende Unternehmen der Branche sind bereits dabei.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { value: String(production.length), label: 'Produktionspartner' },
          { value: String(customers.length), label: 'Pilotkunden' },
          { value: '2,3M', label: 'Produkte' },
          { value: 'DACH', label: 'Region' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-metric-md mb-0.5" style={{ color: 'var(--brand)' }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Production Partners */}
      <div className="mb-6 animate-fade-up delay-1">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>PRODUKTIONSPARTNER</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {production.map(p => {
            const s = STATUS_MAP[p.status] ?? STATUS_MAP.negotiating
            return (
              <div key={p.id} className="card p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                  style={{ background: p.color, fontFamily: 'var(--font-mono)' }}>
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{p.category}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: s.bg, color: s.text }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pilot Customers */}
      <div className="mb-6 animate-fade-up delay-2">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>PILOTKUNDEN</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {customers.map(p => {
            const s = STATUS_MAP[p.status] ?? STATUS_MAP.negotiating
            return (
              <div key={p.id} className="card p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                  style={{ background: p.color, fontFamily: 'var(--font-mono)' }}>
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{p.description}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: s.bg, color: s.text }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="card overflow-hidden animate-fade-up delay-3">
        <div className="px-6 py-8 text-center"
          style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}>
          <p className="text-lg font-bold text-white mb-2">Werden Sie Teil des Netzwerks</p>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Schließen Sie sich führenden Unternehmen der Baubranche an.
          </p>
          <a href="mailto:torben@conser-avento.de"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
            style={{ background: 'white', color: '#063D3E' }}>
            Kontakt aufnehmen
          </a>
        </div>
      </div>
    </div>
  )
}
