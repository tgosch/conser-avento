import type { Partner } from '../../lib/supabase'
import { Calendar, Landmark, Shield, CreditCard, Server } from 'lucide-react'

const FALLBACK_PRODUCTION: Partner[] = [
  { id: 'p1', name: 'Sanitär & Heizung', type: 'production', category: 'Sanitär & Heizung', description: 'Führender Großhändler für Sanitär, Heizung und Klima', status: 'partner', logo_path: null, initials: 'SH', color: '#0055A4', visible: true, order_index: 1, created_at: '' },
  { id: 'p2', name: 'Baustoffe', type: 'production', category: 'Baustoffe', description: 'Internationaler Baustoffhändler', status: 'active', logo_path: null, initials: 'BS', color: '#008C45', visible: true, order_index: 2, created_at: '' },
  { id: 'p3', name: 'Elektro', type: 'production', category: 'Elektro', description: 'Elektro-Großhandel für Fachbetriebe', status: 'active', logo_path: null, initials: 'EL', color: '#E30613', visible: true, order_index: 3, created_at: '' },
  { id: 'p4', name: 'Befestigungstechnik', type: 'production', category: 'Befestigungstechnik', description: 'Spezialist für Befestigungs- und Montagetechnik', status: 'active', logo_path: null, initials: 'BF', color: '#CC0000', visible: true, order_index: 4, created_at: '' },
  { id: 'p5', name: 'Dach & Fassade', type: 'production', category: 'Dach & Fassade', description: 'Dachbaustoffe und Fassadensysteme', status: 'partner', logo_path: null, initials: 'DF', color: '#7C3AED', visible: true, order_index: 5, created_at: '' },
  { id: 'p6', name: 'Werkzeuge & Maschinen', type: 'production', category: 'Werkzeuge & Maschinen', description: 'Profi-Werkzeuge und Baumaschinen', status: 'active', logo_path: null, initials: 'WM', color: '#003DA5', visible: true, order_index: 6, created_at: '' },
  { id: 'p7', name: 'Haustechnik', type: 'production', category: 'Haustechnik', description: 'Lüftung, Klima und Gebäudetechnik', status: 'negotiating', logo_path: null, initials: 'HT', color: '#0EA5E9', visible: true, order_index: 7, created_at: '' },
]

const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  negotiating: { bg: 'rgba(234,179,8,0.10)',  text: '#EAB308', label: 'Verhandlung' },
  active:      { bg: 'rgba(59,130,246,0.10)', text: '#3B82F6', label: 'Aktiv' },
  beta:        { bg: 'rgba(139,92,246,0.10)', text: '#8B5CF6', label: 'Beta' },
  partner:     { bg: 'rgba(34,197,94,0.10)',  text: '#22C55E', label: 'Partner' },
}

export default function PartnerNetwork() {
  const production = FALLBACK_PRODUCTION

  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-8 animate-fade-up">
        <h1 className="text-xl md:text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
          Netzwerk & Partner
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: 480 }}>
          Sie sind in guter Gesellschaft. Führende Unternehmen der Baubranche und namhafte Finanzpartner.
        </p>
      </div>

      {/* ── STRATEGISCHE PARTNER ── */}
      <div className="mb-8 animate-fade-up delay-1">
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          Strategische Partner
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Landmark, name: 'Bankpartner', sub: 'Deutsche Großbank', desc: 'Finanzinfrastruktur · NDA', color: 'var(--brand)' },
            { icon: CreditCard, name: 'Payment', sub: 'PCI-DSS Level 1', desc: 'Zahlungsabwicklung', color: 'var(--accent)' },
            { icon: Server, name: 'Cloud & Hosting', sub: 'EU Frankfurt', desc: 'Infrastruktur & CDN', color: 'var(--brand)' },
            { icon: Shield, name: 'Datenbank & Auth', sub: 'PostgreSQL · EU', desc: 'Backend & Sicherheit', color: 'var(--accent)' },
          ].map(p => (
            <div key={p.name} className="card p-4">
              <p.icon size={16} className="mb-2.5" style={{ color: p.color }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
              <p className="text-[10px] font-medium mb-1" style={{ color: p.color }}>{p.sub}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUKTIONSPARTNER ── */}
      <div className="mb-8 animate-fade-up delay-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            Produktionspartner · 7 Branchen
          </p>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}>
            2,3 Mio. Produkte
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {production.map(p => {
            const s = STATUS_MAP[p.status] ?? STATUS_MAP.negotiating
            return (
              <div key={p.id} className="card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ background: p.color }}>
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{p.description}</p>
                </div>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: s.bg, color: s.text }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── COMPLIANCE ── */}
      <div className="card p-6 mb-8 animate-fade-up delay-3">
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          Compliance & Sicherheit
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'DSGVO-konform', desc: 'Alle personenbezogenen Daten werden ausschließlich in der EU verarbeitet und gespeichert. Vollständige Datenschutzerklärung und Löschfunktion.' },
            { title: 'Server-Standort', desc: 'Unsere Infrastruktur läuft ausschließlich auf EU-Servern in Frankfurt und Fürth. Kein Datentransfer in Drittländer.' },
            { title: 'Zahlungssicherheit', desc: 'PCI-DSS Level 1 zertifiziert. Escrow-System für Transaktionssicherheit. Automatische Rechnungsstellung.' },
          ].map(c => (
            <div key={c.title}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="rounded-2xl overflow-hidden animate-fade-up delay-4"
        style={{ background: '#063D3E' }}>
        <div className="px-6 py-10 md:px-10 md:py-12 text-center">
          <p className="text-lg md:text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Werden Sie Teil des Netzwerks
          </p>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 360, margin: '0 auto' }}>
            Schließen Sie sich führenden Unternehmen der Baubranche an.
          </p>
          <a href="https://calendly.com/torben-gosch" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium"
            style={{ background: 'white', color: '#063D3E' }}>
            <Calendar size={14} /> Termin vereinbaren
          </a>
        </div>
      </div>
    </div>
  )
}
