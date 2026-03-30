import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Clock, Check } from 'lucide-react'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'

interface Doc {
  icon: string; label: string; slug: string; available: boolean; desc: string
}

const businessDocs: Doc[] = [
  { icon: '📊', label: 'Pitch-Deck',              slug: 'pitch-deck',              available: true,
    desc: '20 Folien · Investment Case, Markt, Team, Financials' },
  { icon: '📋', label: 'Business-Plan',            slug: 'business-plan',           available: true,
    desc: 'Vollständige Strategie · Wettbewerb · Go-to-Market' },
  { icon: '📈', label: 'Sales Funnel Endkunden',   slug: 'sales-funnel-endkunden',  available: true,
    desc: 'Wie wir Handwerksbetriebe gewinnen und langfristig halten' },
  { icon: '🏢', label: 'Sales Funnel Business',    slug: 'sales-funnel-business',   available: true,
    desc: 'B2B Partner-Vertriebsstrategie für Großhändler & Distributoren' },
  { icon: '👤', label: 'Persona Endkunde',         slug: 'persona-endkunde',        available: true,
    desc: 'ICP-Analyse · Wer ist unser idealer Handwerkskunde' },
  { icon: '🤝', label: 'Persona Businesspartner', slug: 'persona-businesspartner',  available: false,
    desc: 'Profil des idealen Distributions- und Integrationspartners' },
]

const finanzDocs: Doc[] = [
  { icon: '💰', label: 'Finanzplan',                 slug: 'finanzplan',            available: true,
    desc: '5-Jahres-Projektion · Konservativ + Base Case + Bull Case' },
  { icon: '📉', label: 'Detaillierte Finanzanalyse', slug: 'finanzanalyse',         available: false,
    desc: 'Unit Economics · CAC · LTV · Payback-Period (ab Seed verfügbar)' },
  { icon: '💵', label: 'Invest & Möglichkeiten',     slug: 'invest-moeglichkeiten', available: true,
    desc: 'Beteiligungsoptionen · Konditionen · Investor-Return-Szenarien' },
  { icon: '🗓️', label: 'Roadmap Kapital',            slug: 'roadmap-kapital',       available: false,
    desc: 'Seed → Series A Trigger → Series A Close · Kapitalplanung' },
  { icon: '🔐', label: 'Sicherheiten & Treuhänder',  slug: 'sicherheiten',          available: false,
    desc: 'Rechtliche Absicherung · Treuhänder-Modell · NDA-Framework' },
]

function DocItem({ icon, label, slug, available, desc }: {
  icon: string; label: string; slug: string; available: boolean; desc: string
}) {
  const content = (
    <div className={`flex items-start gap-3 px-3 py-3 rounded-[12px] transition group ${available ? 'card-interactive' : 'opacity-50'}`}>
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
          {available
            ? <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
                <Check size={10} strokeWidth={3} />
              </span>
            : <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--surface2)' }}>
                <Clock size={9} style={{ color: 'var(--text-tertiary)' }} />
              </span>
          }
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
    </div>
  )
  return available ? <Link to={`/investor/plans/${slug}`} style={{ textDecoration: 'none' }}>{content}</Link> : <div>{content}</div>
}

interface MobileAccordionFolderProps {
  title: string; subtitle: string; accentColor: string; docs: Doc[]
  isOpen: boolean; onToggle: () => void
}
function MobileAccordionFolder({ title, subtitle, accentColor, docs, isOpen, onToggle }: MobileAccordionFolderProps) {
  return (
    <div className="card overflow-hidden mb-4">
      <button onClick={onToggle} aria-expanded={isOpen}
        className="w-full flex items-center justify-between transition"
        style={{ borderBottom: isOpen ? '1px solid var(--border)' : 'none' }}>
        <div className="px-5 py-4 flex items-center gap-3 flex-1">
          <span className="text-2xl">📁</span>
          <div className="text-left">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {subtitle} · {docs.filter(d => d.available).length}/{docs.length} verfügbar
            </p>
          </div>
        </div>
        <div className="w-2 self-stretch shrink-0" style={{ background: accentColor, borderRadius: '0 20px 20px 0' }} />
        <ChevronDown size={20} className="mx-4 shrink-0"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--text-secondary)' }} />
      </button>
      {isOpen && (
        <div className="p-2 accordion-content">
          {docs.map(d => <DocItem key={d.slug} {...d} />)}
        </div>
      )}
    </div>
  )
}

export default function InvestorPlans() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ business: true, finanzen: true })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggle = (key: string) => setOpenFolders(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="max-w-4xl">

      {/* Hero */}
      <div className="mb-6 animate-fade-up">
        <p className="label-tag mb-2" style={{ color: 'var(--text-tertiary)' }}>DUE DILIGENCE</p>
        <h1 className="text-display-md mb-1" style={{ color: 'var(--text-primary)' }}>Alle Investoren-Unterlagen</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Vom Pitch-Deck bis zur Finanzanalyse — vollständige DD-Dokumentation an einem Ort</p>
      </div>

      {/* Empfehlungs-Banner */}
      <div className="card p-4 mb-6 flex items-center gap-4 animate-fade-up"
           style={{ background: 'rgba(6,61,62,0.07)', border: '1px solid rgba(6,61,62,0.15)' }}>
        <span className="text-2xl shrink-0">💡</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
            Neu hier? Starte mit dem Pitch-Deck
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            20 Seiten · gibt dir den vollständigen Investment Case in 10 Minuten
          </p>
        </div>
        <Link to="/investor/plans/pitch-deck"
          className="btn btn-primary shrink-0">
          Öffnen <ChevronRight size={14} />
        </Link>
      </div>

      {/* Dokument-Ordner */}
      <div className="animate-fade-up mb-8">
        {isMobile ? (
          <>
            <MobileAccordionFolder title="Business" subtitle="Strategie & Markt" accentColor="#063D3E"
              docs={businessDocs} isOpen={openFolders.business} onToggle={() => toggle('business')} />
            <MobileAccordionFolder title="Finanzen" subtitle="Zahlen & Investitionen" accentColor="#D4662A"
              docs={finanzDocs} isOpen={openFolders.finanzen} onToggle={() => toggle('finanzen')} />
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#063D3E' }}>
                <span className="text-2xl">📁</span>
                <div>
                  <h2 className="font-bold text-white text-sm">Business</h2>
                  <p className="text-white/55 text-xs">Strategie · Markt · Sales</p>
                </div>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  {businessDocs.filter(d => d.available).length}/{businessDocs.length} verfügbar
                </span>
              </div>
              <div className="p-2">{businessDocs.map(d => <DocItem key={d.slug} {...d} />)}</div>
            </div>
            <div className="card overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#D4662A' }}>
                <span className="text-2xl">📁</span>
                <div>
                  <h2 className="font-bold text-white text-sm">Finanzen</h2>
                  <p className="text-white/55 text-xs">Zahlen · Investitionen · ROI</p>
                </div>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  {finanzDocs.filter(d => d.available).length}/{finanzDocs.length} verfügbar
                </span>
              </div>
              <div className="p-2">{finanzDocs.map(d => <DocItem key={d.slug} {...d} />)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Über die Unternehmen */}
      <div className="card p-5 mb-6 animate-fade-up">
        <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Über die Unternehmen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <img src={aventoLogo} alt="Avento" className="rounded-xl object-cover shrink-0" style={{ height: '56px', width: '100px' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Avento Software</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>ERP-Komplettsystem für Handwerksbetriebe — Controlling, Buchhaltung, Team</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src={conserLogo} alt="Conser" className="rounded-xl object-cover shrink-0" style={{ height: '56px', width: '100px' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>B2B-Marktplatz für Baustoffe & Handwerk — 2,3M Produkte, 7 Partner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kontakt-Footer */}
      <div className="card p-4 flex items-center justify-between gap-4 animate-fade-up">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Dokument nicht gefunden oder Fragen zur Due Diligence?
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Torben antwortet persönlich — typisch innerhalb 4 Stunden
          </p>
        </div>
        <Link to="/investor/chat"
          className="btn btn-primary shrink-0">
          Chat öffnen <ChevronRight size={14} />
        </Link>
      </div>

    </div>
  )
}
