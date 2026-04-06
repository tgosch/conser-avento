import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Partner } from '../../lib/supabase'
import { Factory, Users2, Clock, Handshake, Star, CheckCircle, ExternalLink } from 'lucide-react'

const FALLBACK_PRODUCTION: Partner[] = [
  { id: 'p1', name: 'Richter+Frenzel', type: 'production', category: 'Sanitär · Heizung · Installation', description: 'Führender Großhändler für Haustechnik in Deutschland. Starkes SHK-Netzwerk mit über 180 Standorten bundesweit.', status: 'negotiating', logo_path: null, initials: 'RF', color: '#B71C1C', visible: true, order_index: 1, created_at: '' },
  { id: 'p2', name: 'Gebhardt Bauzentrum', type: 'production', category: 'Baustoffhandel', description: 'Regionaler Baustoffhändler mit breitem Produktportfolio für den professionellen Tief- und Hochbau.', status: 'negotiating', logo_path: null, initials: 'GB', color: '#1A5C1A', visible: true, order_index: 2, created_at: '' },
  { id: 'p3', name: 'FEGA & Schmitt', type: 'production', category: 'Elektrotechnik · Großhandel', description: 'Elektrogroßhändler mit Vollsortiment für Elektroinstallation, Industrietechnik und Gebäudeautomation.', status: 'negotiating', logo_path: null, initials: 'FS', color: '#003DA5', visible: true, order_index: 3, created_at: '' },
  { id: 'p4', name: 'Klöpfer Holzhandel', type: 'production', category: 'Holz · Holzwerkstoffe', description: 'Einer der größten Holzgroßhändler Deutschlands. Spezialist für Schnittholz, Platten und Veredelungsprodukte.', status: 'negotiating', logo_path: null, initials: 'KH', color: '#7B3F00', visible: true, order_index: 4, created_at: '' },
  { id: 'p5', name: 'AWN Stahl', type: 'production', category: 'Stahlhandel · Metallbau', description: 'Stahl- und Metallgroßhandel für Bau und Industrie. Breites Sortiment an Trägern, Rohren und Blechen.', status: 'negotiating', logo_path: null, initials: 'AW', color: '#455A64', visible: true, order_index: 5, created_at: '' },
  { id: 'p6', name: 'BayWa AG', type: 'production', category: 'Agrar · Bau · Energie', description: 'Internationaler Handels- und Dienstleistungskonzern mit starkem Fokus auf Baustoffe und Agrarprodukte.', status: 'negotiating', logo_path: null, initials: 'BA', color: '#00695C', visible: true, order_index: 6, created_at: '' },
  { id: 'p7', name: 'Rexel Germany', type: 'production', category: 'Elektrotechnik · B2B', description: 'Global führender B2B-Distributor für Elektromaterial. Spezialist für Installations- und Industrietechnik.', status: 'negotiating', logo_path: null, initials: 'RX', color: '#C62828', visible: true, order_index: 7, created_at: '' },
  { id: 'p8', name: 'Binderholz Group', type: 'production', category: 'Holz · Massivholz · CLT', description: 'Europaweit führender Massivholzproduzent. Spezialist für CLT, BSH und konstruktive Holzbauprodukte.', status: 'negotiating', logo_path: null, initials: 'BH', color: '#2E7D32', visible: true, order_index: 8, created_at: '' },
  { id: 'p9', name: 'Holz Ziller', type: 'production', category: 'Holzhandel · Bayern', description: 'Regionaler Holzfachhändler in Bayern mit Fokus auf Sägewerk-Produkte, Zimmerei-Holz und Holzwerkstoffe.', status: 'negotiating', logo_path: null, initials: 'HZ', color: '#E65100', visible: true, order_index: 9, created_at: '' },
]

const FALLBACK_CUSTOMERS: Partner[] = [
  { id: 'c1', name: 'P+E Schmitt', type: 'customer', category: 'Bauunternehmen', description: 'Mittelständisches Bauunternehmen mit Fokus auf schlüsselfertige Projekte im Wohnungs- und Gewerbebau.', status: 'beta', logo_path: null, initials: 'PS', color: '#1565C0', visible: true, order_index: 1, created_at: '' },
  { id: 'c2', name: 'In Concept', type: 'customer', category: 'Architektur · Planung', description: 'Architektur- und Planungsbüro für gewerbliche und wohnwirtschaftliche Bauprojekte im DACH-Raum.', status: 'beta', logo_path: null, initials: 'IC', color: '#6A1B9A', visible: true, order_index: 2, created_at: '' },
  { id: 'c3', name: 'IKEA Bau', type: 'customer', category: 'Retail · Bau', description: 'Bau- und Einrichtungsmarkt mit starker Supply-Chain-Nachfrage nach digitalen Beschaffungskanälen.', status: 'beta', logo_path: null, initials: 'IB', color: '#003087', visible: true, order_index: 3, created_at: '' },
  { id: 'c4', name: 'Dietrich Group', type: 'customer', category: 'Baugruppe · Projektentwicklung', description: 'Baugruppe mit Schwerpunkt auf Projektentwicklung und Generalunternehmen für Wohn- und Gewerbeimmobilien.', status: 'beta', logo_path: null, initials: 'DG', color: '#00838F', visible: true, order_index: 4, created_at: '' },
  { id: 'c5', name: 'Eckpfeiler Immobilien', type: 'customer', category: 'Immobilienentwicklung', description: 'Immobilienentwickler mit Fokus auf nachhaltige Wohnbauprojekte und gemischte Nutzungskonzepte.', status: 'beta', logo_path: null, initials: 'EI', color: '#1B5E20', visible: true, order_index: 5, created_at: '' },
]

function getLogoUrl(logoPath: string | null): string | null {
  if (!logoPath) return null
  const { data } = supabase.storage.from('partner-logos').getPublicUrl(logoPath)
  return data.publicUrl
}

function StatusBadge({ status }: { status: Partner['status'] }) {
  if (status === 'negotiating') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(255,149,0,0.12)', color: '#FF9500', border: '1px solid rgba(255,149,0,0.25)' }}>
        <Clock size={10} strokeWidth={2.5} /> In Verhandlungen
      </span>
    )
  }
  if (status === 'active' || status === 'partner') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759', border: '1px solid rgba(52,199,89,0.25)' }}>
        <CheckCircle size={10} strokeWidth={2.5} /> Aktiver Partner
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: 'rgba(88,86,214,0.12)', color: '#5856D6', border: '1px solid rgba(88,86,214,0.25)' }}>
      <Star size={10} strokeWidth={2.5} /> Beta-Nutzer
    </span>
  )
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const [imgError, setImgError] = useState(false)
  const logoUrl = getLogoUrl(partner.logo_path)
  if (logoUrl && !imgError) {
    return (
      <div className="w-14 h-14 rounded-[14px] overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: `${partner.color}12`, border: `1px solid ${partner.color}25` }}>
        <img src={logoUrl} alt={partner.name} className="w-full h-full object-contain p-1.5"
          onError={() => setImgError(true)} />
      </div>
    )
  }
  return (
    <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-white text-base font-bold shrink-0"
      style={{ background: `linear-gradient(135deg, ${partner.color} 0%, ${partner.color}CC 100%)` }}>
      {partner.initials}
    </div>
  )
}

export default function InvestorPartners() {
  const [production, setProduction] = useState<Partner[]>(FALLBACK_PRODUCTION)
  const [customers, setCustomers] = useState<Partner[]>(FALLBACK_CUSTOMERS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('partners').select('*').eq('visible', true).order('order_index')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const p = (data as Partner[]).filter(x => x.type === 'production')
          const c = (data as Partner[]).filter(x => x.type === 'customer')
          if (p.length > 0) setProduction(p)
          if (c.length > 0) setCustomers(c)
        }
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="max-w-5xl">
      <div className="skeleton h-8 w-32 rounded-xl mb-3" />
      <div className="skeleton h-4 w-56 rounded-lg mb-8" />
      <div className="skeleton h-28 rounded-[20px] mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-24 rounded-[20px]" />)}
      </div>
      <div className="skeleton h-20 rounded-[20px]" />
    </div>
  )

  return (
    <div className="max-w-5xl animate-fade-up">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Partner</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Produktionspartner & Endkunden</p>

      {/* ERGÄNZUNG 1 — Strategischer Kontext-Banner */}
      <div className="card p-5 mb-8 animate-fade-up"
           style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🏗️</span>
          <div>
            <p className="font-bold text-white text-sm mb-2">
              Warum BayWa, Richter+Frenzel und FEGA keine Zufälle sind
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Diese drei Unternehmen haben zusammen Zugang zu über 50.000 professionellen
              Handwerksbetrieben in DACH. Wir nutzen ihre bestehenden Vertriebskanäle —
              das bedeutet Warm-Referrals durch vertrauenswürdige Industrie-Namen statt Cold-Outreach.
            </p>
            <div className="flex flex-wrap gap-2">
              {['BayWa · Bayern + AT', 'Richter+Frenzel · SHK-Netzwerk', 'FEGA · Elektrotechnik'].map(t => (
                <span key={t} className="tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { icon: <Factory size={20} style={{ color: '#063D3E' }} />, value: production.length, label: 'Produktionspartner', accent: '#063D3E' },
          { icon: <Users2 size={20} style={{ color: '#D4662A' }} />, value: customers.length, label: 'Endkunden', accent: '#D4662A' },
          { icon: <Clock size={20} style={{ color: '#FF9500' }} />, value: production.filter(p => p.status === 'negotiating').length, label: 'In Verhandlungen', accent: '#FF9500' },
          { icon: <Handshake size={20} style={{ color: '#34C759' }} />, value: production.filter(p => p.status === 'active' || p.status === 'partner').length + customers.filter(c => c.status === 'beta').length, label: 'Aktiv / Beta', accent: '#34C759' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.accent}14` }}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Produktionspartner */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,61,62,0.10)' }}>
            <Factory size={18} style={{ color: '#063D3E' }} />
          </div>
          <div>
            <h2 className="font-bold text-base leading-none" style={{ color: 'var(--text-primary)' }}>Produktionspartner</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Zulieferer · Großhändler · B2B</p>
          </div>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,149,0,0.10)', color: '#FF9500' }}>
            {production.filter(p => p.status === 'negotiating').length} in Verhandlungen
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {production.map(p => (
            <div key={p.id} className="card card-interactive p-5 hover-lift">
              <div className="flex items-start gap-3.5 mb-3">
                <PartnerLogo partner={p} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  <p className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>{p.category}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Endkunden */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,102,42,0.10)' }}>
            <Users2 size={18} style={{ color: '#D4662A' }} />
          </div>
          <div>
            <h2 className="font-bold text-base leading-none" style={{ color: 'var(--text-primary)' }}>Endkunden</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Beta-Phase · Ausgewählte Partner</p>
          </div>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(88,86,214,0.12)', color: '#5856D6' }}>
            Phase 1 · Exklusiv
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(c => (
            <div key={c.id} className="card overflow-hidden hover-lift">
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}88)` }} />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <PartnerLogo partner={c} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.category}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{c.description}</p>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Oekosystem-Module */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(200,97,26,0.10)' }}>
            <Star size={18} style={{ color: '#C8611A' }} />
          </div>
          <div>
            <h2 className="font-bold text-base leading-none" style={{ color: 'var(--text-primary)' }}>Oekosystem-Module</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Live-Produkte im Avento-Oekosystem</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Space AI', desc: 'KI-Assistent für Angebote, Kalkulation und Projektplanung.', href: 'https://spaceai-henna.vercel.app', color: '#8B5CF6' },
            { name: 'BauDoku AI', desc: 'Digitales Bautagebuch mit KI-Protokollen und Signaturen.', href: 'https://baudoku-ai.vercel.app', color: '#0EA5E9' },
            { name: 'Conser Marktplatz', desc: '2,3 Mio. Bauprodukte, 7 Hersteller, 24h Lieferung.', href: 'https://www.conser-gosch.de', color: '#C8611A' },
          ].map(mod => (
            <a key={mod.name} href={mod.href} target="_blank" rel="noopener noreferrer"
               className="card card-interactive p-5 hover-lift no-underline"
               style={{ borderLeft: `3px solid ${mod.color}`, textDecoration: 'none', display: 'block' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{mod.name}</h3>
                <ExternalLink size={14} style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{mod.desc}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full mt-3"
                style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759', border: '1px solid rgba(52,199,89,0.25)' }}>
                <CheckCircle size={10} strokeWidth={2.5} /> Live
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
