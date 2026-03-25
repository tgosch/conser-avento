import { ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react'

const PROJECTIONS = [
  { year: 'Jahr 1', users: '1.000', orders: '~500/Mo', highlight: false },
  { year: 'Jahr 2', users: '5.000', orders: '~5.000/Mo', highlight: false },
  { year: 'Jahr 3', users: '25.000', orders: '~50.000/Mo', highlight: true },
]

export default function PartnerRevenue() {
  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-8 animate-fade-up">
        <p className="label-overline mb-2">Revenue-Modell</p>
        <h1 className="text-display-md mb-3" style={{ color: 'var(--text-primary)' }}>
          So verdienen wir gemeinsam
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          Transparentes Modell. Provision nur bei erfolgreicher Bestellung. Keine versteckten Kosten.
        </p>
      </div>

      {/* ── HERO ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-1">
        <div className="relative px-8 py-12 md:px-12 md:py-16 text-center"
          style={{ background: 'linear-gradient(135deg, #041E1F 0%, #063D3E 40%, #0A5C5E 100%)' }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #C8611A 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
          <p className="text-display-md text-white mb-4" style={{ maxWidth: 520, margin: '0 auto' }}>
            Avento liefert die Kunden.<br />Conser liefert die Bestellungen.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 440, margin: '0 auto' }}>
            Avento ist das Steckenpferd — die tägliche Software der Handwerker.
            Conser ist der Umsatztreiber — der Marktplatz, über den die Bestellungen an Sie fließen.
          </p>
        </div>
      </div>

      {/* ── MONEY FLOW ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-2">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>SO FLIESST DAS GELD</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Handwerker nutzt Avento', desc: 'Erstellt ein Projekt, sieht automatisch den Material-Bedarf. Kalkulation und Bedarfsplanung in einem.', color: 'var(--brand)', icon: '🔨' },
              { step: '2', title: 'Conser matched Produkte', desc: 'Automatischer Abgleich mit Ihrem Katalog. Beste Preise, kürzeste Lieferzeiten, Ihre Produkte bevorzugt.', color: 'var(--accent)', icon: '🏪' },
              { step: '3', title: 'Bestellung an Sie', desc: 'Payment via Escrow-System. Sie liefern, das Geld wird freigegeben. Automatische Rechnungsstellung.', color: '#22C55E', icon: '💰' },
            ].map((s, i) => (
              <div key={s.step} className="relative p-5 rounded-xl group hover:translate-y-[-2px] transition-all duration-300"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: s.color }}>{s.step}</span>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <p className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full items-center justify-center"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <ArrowRight size={10} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT YOU GET ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up delay-3">
        <div className="card p-6" style={{ borderLeft: '3px solid var(--brand)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: 'var(--brand)' }} />
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Für Sie als Partner</p>
          </div>
          <ul className="space-y-2.5">
            {[
              'Neue Kunden ohne Vertriebskosten',
              'Höheres Bestellvolumen durch ERP-Integration',
              'Planbare, wiederkehrende Bestellungen',
              'Datengetriebene Sortimentsoptimierung',
              'Zugang zum DACH-weiten Handwerkermarkt',
            ].map(t => (
              <li key={t} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Zap size={12} className="shrink-0 mt-1" style={{ color: 'var(--brand)' }} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6" style={{ borderLeft: '3px solid #22C55E' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} style={{ color: '#22C55E' }} />
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Transparente Provision</p>
          </div>
          <ul className="space-y-2.5">
            {[
              'Provision nur bei erfolgreicher Bestellung',
              'Marktgerechte Kommission (individuell verhandelbar)',
              'Keine versteckten Gebühren oder Setup-Kosten',
              'Monatliche Abrechnung mit detailliertem Report',
              'Volumenrabatte ab bestimmter Schwelle',
            ].map(t => (
              <li key={t} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Zap size={12} className="shrink-0 mt-1" style={{ color: '#22C55E' }} /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── PROJECTIONS ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-4">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>PROJEKTIONEN</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROJECTIONS.map(p => (
              <div key={p.year} className="p-5 rounded-xl text-center group hover:translate-y-[-2px] transition-all duration-300"
                style={{
                  background: p.highlight ? 'var(--brand-dim)' : 'var(--surface2)',
                  border: p.highlight ? '1.5px solid var(--brand)' : '1.5px solid var(--border)',
                  boxShadow: p.highlight ? '0 4px 20px rgba(6,61,62,0.08)' : 'none',
                }}>
                <p className="text-[10px] font-bold tracking-wide mb-3"
                  style={{ color: p.highlight ? 'var(--brand)' : 'var(--text-tertiary)' }}>{p.year}</p>
                <p className="text-metric-lg mb-1" style={{ color: 'var(--text-primary)' }}>{p.users}</p>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>aktive Handwerker</p>
                <p className="text-sm font-bold" style={{ color: p.highlight ? 'var(--brand)' : 'var(--text-primary)' }}>{p.orders}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Bestellungen</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-5 font-semibold" style={{ color: 'var(--brand)' }}>
            Stellen Sie sich vor: 25.000 Handwerker bestellen 1-Click bei Ihnen.
          </p>
        </div>
      </div>

      {/* ── PAYMENT & TRUST ── */}
      <div className="card overflow-hidden animate-fade-up delay-4">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>PAYMENT & SICHERHEIT</p>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Escrow-System', desc: 'Sicheres Payment', icon: '🔒' },
            { label: 'Auto-Rechnungen', desc: 'Automatisiert', icon: '📄' },
            { label: 'DSGVO-konform', desc: 'Made in Germany', icon: '🇩🇪' },
            { label: 'Echtzeit-Reports', desc: 'Volle Transparenz', icon: '📊' },
          ].map(item => (
            <div key={item.label} className="text-center p-4 rounded-xl group hover:translate-y-[-1px] transition-all duration-300"
              style={{ background: 'var(--surface2)' }}>
              <span className="text-xl block mb-2 transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
              <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
