import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight, ExternalLink, ShoppingCart, Users, Eye, CheckCircle, Circle, Calendar, Shield, Building2, Landmark, CreditCard } from 'lucide-react'
import BookingModal from '../../components/BookingModal'
import spaceAiLogo from '../../assets/SpaceAI.png'
import bauDokuLogo from '../../assets/BauDokuAI.png'
const conserLogo = '/conser.PNG'
const aventoLogo = '/avento.PNG'
import conserShopImg from '../../assets/conser-checkout-desktop.png'

const STEPS = [
  { key: 1, label: 'Kennenlernen',        desc: 'Persönlicher Termin' },
  { key: 2, label: 'Konditionen',         desc: 'Partnervertrag & Katalog' },
  { key: 3, label: 'Vertragsabschluss',   desc: 'Vertragsdetails klären' },
  { key: 4, label: 'Vertragsrücksendung', desc: 'Signierter Vertrag' },
  { key: 5, label: 'IT-Abstimmung',       desc: 'Technische Anforderungen' },
  { key: 6, label: 'Datenaustausch',      desc: 'OCI / API / CSV' },
  { key: 7, label: 'Produktintegration',  desc: 'Produkte live auf Conser' },
  { key: 8, label: 'Go Live',             desc: 'Sichtbar für alle Nutzer' },
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

export default function PartnerDashboard() {
  const { user } = useAuth()
  const [showBooking, setShowBooking] = useState(false)
  const partner = user?.partner
  const status = partner?.status ?? 'negotiating'
  const currentStep = mapStatusToStep(status) - 1

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── HERO — kompakt ── */}
      <div className="relative rounded-2xl overflow-hidden mb-6 animate-fade-up"
        style={{ background: '#063D3E' }}>
        <div className="relative z-10 px-5 py-6 md:px-8 md:py-8">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
            Partner Portal
          </p>
          <h1 className="text-xl md:text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            {greeting}, {partner?.name ?? 'Partner'}
          </h1>
          <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 440 }}>
            Zugang zu 75.000 Handwerksbetrieben — automatisierte Bestellungen direkt aus dem ERP.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/partner/partnership"
              className="px-5 py-2 rounded-full text-xs font-semibold"
              style={{ background: 'white', color: '#063D3E' }}>
              Partnermodell ansehen
            </Link>
            <button onClick={() => setShowBooking(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)' }}>
              <Calendar size={11} /> Termin
            </button>
          </div>
        </div>
      </div>

      {/* EARNINGS TEASER */}
      <div className="card p-4 mb-8 animate-fade-up delay-1 flex items-center gap-4 border-left-accent">
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Ihr Umsatzpotenzial</p>
          <p className="text-lg font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            Berechnen Sie Ihre Kommission
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            75.000 Handwerker · 12,8 Mio. Produkte · individuelle Kommission
          </p>
        </div>
        <Link to="/partner/calculator"
          className="px-4 py-2 rounded-full text-xs font-semibold shrink-0"
          style={{ background: 'var(--accent)', color: 'white' }}>
          Calculator öffnen
        </Link>
      </div>

      {/* ── ONBOARDING FORTSCHRITT — kompakt ── */}
      <div className="card p-5 mb-6 animate-fade-up delay-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Ihr Onboarding</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--brand-dim)', color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>
            {currentStep + 1}/8
          </span>
        </div>
        {/* Progress Bar */}
        <div className="flex gap-1 mb-4">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-all" style={{
              background: i < currentStep ? '#22C55E' : i === currentStep ? 'var(--brand)' : 'var(--surface3)',
            }} />
          ))}
        </div>
        {/* Steps — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible">
          {STEPS.map((s, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <div key={s.key} className="min-w-[140px] md:min-w-0 snap-start p-2.5 rounded-xl flex-shrink-0"
                style={{
                  background: active ? 'var(--brand-dim)' : 'var(--surface2)',
                  border: active ? '1px solid var(--brand)' : '1px solid transparent',
                  opacity: !done && !active ? 0.45 : 1,
                }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  {done ? <CheckCircle size={10} style={{ color: '#22C55E' }} /> : <Circle size={10} style={{ color: active ? 'var(--brand)' : 'var(--text-tertiary)' }} />}
                  <span className="text-[8px] font-bold" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                </div>
                <p className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                <p className="text-[9px] hidden md:block" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── TOOLS & PRODUKTE ── */}
      <div className="mb-8 animate-fade-up delay-2">
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Das Ökosystem</h2>

        {/* Conser Marktplatz — prominent */}
        <a href="https://www.conser-gosch.de" target="_blank" rel="noopener noreferrer"
          className="card p-6 md:p-8 mb-4 flex flex-col md:flex-row gap-6 items-start no-underline group hover:translate-y-[-2px] transition-all">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <img src={conserLogo} alt="Conser" className="w-10 h-10 rounded-xl" loading="lazy" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</h3>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>Live</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>B2B-Baustoff-Plattform · conser-gosch.de</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              12,8 Mio. Bauprodukte von 7 Premium-Herstellern. Hier werden Ihre Produkte gelistet und direkt aus dem Avento ERP bestellt. Zugangsdaten erhalten Sie auf Anfrage.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Shop besuchen <ExternalLink size={11} />
            </div>
          </div>
          <div className="w-full md:w-64 shrink-0 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <img src={conserShopImg} alt="Conser Shop" className="w-full block" loading="lazy" />
          </div>
        </a>

        {/* Avento + Module */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Avento ERP */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={aventoLogo} alt="Avento" className="w-9 h-9 rounded-lg" loading="lazy" />
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Avento ERP</h3>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>In Entwicklung</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Das Betriebssystem für Handwerker. Bestellt automatisch über Conser — Ihre Produkte werden direkt empfohlen.
            </p>
          </div>

          {/* SpaceAI */}
          <a href="https://spaceai-henna.vercel.app" target="_blank" rel="noopener noreferrer"
            className="card p-5 no-underline group hover:translate-y-[-2px] transition-all">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={spaceAiLogo} alt="SpaceAI" className="w-9 h-9 rounded-lg object-cover" loading="lazy" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>SpaceAI</h3>
                  <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>Live</span>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Avento-Modul · auf Anfrage</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              KI-Gartengestaltung. Demo verfügbar — Zugangsdaten auf Anfrage.
            </p>
          </a>

          {/* BauDoku AI */}
          <a href="https://baudoku-ai.vercel.app" target="_blank" rel="noopener noreferrer"
            className="card p-5 no-underline group hover:translate-y-[-2px] transition-all">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={bauDokuLogo} alt="BauDoku AI" className="w-9 h-9 rounded-lg object-cover" loading="lazy" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>BauDoku AI</h3>
                  <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>Live</span>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Avento-Modul · auf Anfrage</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Automatische Baudokumentation. Demo verfügbar — Zugangsdaten auf Anfrage.
            </p>
          </a>

          {/* BuchBalance */}
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                   style={{ background: '#1D5EA8' }}>B</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>BuchBalance</h3>
                  <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>Live</span>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Avento-Modul · auf Anfrage</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Angebundene Buchhaltung. Rechnungen, DATEV-Export, USt-Voranmeldung.
            </p>
          </div>
        </div>
      </div>

      {/* ── VERTRAUEN & PARTNER ── */}
      <div className="card p-6 md:p-8 mb-8 animate-fade-up delay-3">
        <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Vertrauen & Infrastruktur</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Landmark, title: 'Bankpartner', desc: 'Namhafte deutsche Großbank', color: 'var(--brand)' },
            { icon: Shield, title: 'DSGVO-konform', desc: 'Alle Daten in der EU', color: 'var(--brand)' },
            { icon: Building2, title: 'HRB 22177', desc: 'Conser GmbH', color: 'var(--accent)' },
            { icon: CreditCard, title: 'Payment', desc: 'PCI-DSS Level 1 zertifiziert', color: 'var(--accent)' },
          ].map(t => (
            <div key={t.title} className="p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <t.icon size={16} className="mb-2" style={{ color: t.color }} />
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── VORTEILE ── */}
      <div className="mb-8 animate-fade-up delay-3">
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Ihre Vorteile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShoppingCart, title: 'Automatisierte Bestellungen', desc: 'Bestellungen fließen direkt aus dem Avento ERP in Ihr System. Kein manueller Aufwand.' },
            { icon: Users, title: '75.000 Zielkunden', desc: 'Zugang zum gesamten DACH-Handwerkermarkt über eine einzige Integration.' },
            { icon: Eye, title: 'Volle Sichtbarkeit', desc: 'Ihre Produkte prominent auf dem Conser Marktplatz mit KI-gestützten Empfehlungen.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5">
              <Icon size={16} className="mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── NÄCHSTE SCHRITTE ── */}
      <div className="card overflow-hidden animate-fade-up delay-4">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Nächste Schritte</h2>
        </div>
        {[
          { to: '/partner/partnership', label: 'Onboarding & Partnermodell', sub: '8 Schritte, 4–8 Wochen' },
          { to: '/partner/calculator',  label: 'Revenue Calculator', sub: 'Ihr Umsatzpotenzial berechnen' },
          { to: '/partner/revenue',     label: 'Revenue-Modell', sub: 'Provisionen & Zahlungsfluss' },
          { to: '/partner/vision',      label: 'Vision & Mission', sub: 'Warum wir das bauen' },
        ].map((item, i) => (
          <Link key={item.to} to={item.to}
            className={`flex items-center gap-4 px-6 py-4 transition-all hover:bg-[var(--surface2)] group ${i < 3 ? 'border-b' : ''}`}
            style={{ borderColor: 'var(--border)' }}>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.sub}</p>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} className="shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
    </div>
  )
}
