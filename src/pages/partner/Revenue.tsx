import { ArrowRight, Shield, TrendingUp } from 'lucide-react'

const PROJECTIONS = [
  { year: 'Jahr 1', users: '1.000', orders: '~500/Monat', highlight: false },
  { year: 'Jahr 2', users: '5.000', orders: '~5.000/Monat', highlight: false },
  { year: 'Jahr 3', users: '25.000', orders: '~50.000/Monat', highlight: true },
]

export default function PartnerRevenue() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-up">

      <div className="mb-6">
        <p className="label-overline mb-1">Revenue-Modell</p>
        <h1 className="font-bold text-2xl md:text-3xl mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          So verdienen wir gemeinsam
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Transparentes Modell. Provision nur bei erfolgreicher Bestellung.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="card overflow-hidden mb-6">
        <div className="px-6 py-8 md:px-8 text-center"
          style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}>
          <p className="text-lg md:text-xl font-bold text-white mb-2">
            Avento liefert die Kunden. Conser liefert die Bestellungen.
          </p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 440, margin: '0 auto' }}>
            Avento ist das Steckenpferd — die tägliche Software der Handwerker.
            Conser ist der Umsatztreiber — der Marktplatz, über den die Bestellungen an Sie fließen.
          </p>
        </div>
      </div>

      {/* How Money Flows */}
      <div className="card p-5 md:p-6 mb-6 animate-fade-up delay-1">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>SO FLIESST DAS GELD</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Handwerker nutzt Avento', desc: 'Erstellt ein Projekt, sieht automatisch den Material-Bedarf. Kalkulation und Bedarfsplanung in einem.', color: 'var(--brand)' },
            { step: '2', title: 'Conser matched Produkte', desc: 'Automatischer Abgleich mit Ihrem Katalog. Beste Preise, kürzeste Lieferzeiten, Ihre Produkte bevorzugt.', color: 'var(--accent)' },
            { step: '3', title: 'Bestellung an Sie', desc: 'Payment via Escrow-System. Sie liefern, das Geld wird freigegeben. Automatische Rechnungsstellung.', color: '#22C55E' },
          ].map((s, i) => (
            <div key={s.step} className="relative p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: s.color }}>{s.step}</span>
                {i < 2 && <ArrowRight size={12} className="absolute right-2 top-4 hidden md:block" style={{ color: 'var(--text-tertiary)' }} />}
              </div>
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue for Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-up delay-2">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} style={{ color: 'var(--brand)' }} />
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Für Sie als Partner</p>
          </div>
          <ul className="space-y-2">
            {[
              'Neue Kunden ohne Vertriebskosten',
              'Höheres Bestellvolumen durch ERP-Integration',
              'Planbare, wiederkehrende Bestellungen',
              'Datengetriebene Sortimentsoptimierung',
              'Zugang zum DACH-weiten Handwerkermarkt',
            ].map(t => (
              <li key={t} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-green-500 shrink-0 mt-0.5">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} style={{ color: 'var(--brand)' }} />
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Transparente Provision</p>
          </div>
          <ul className="space-y-2">
            {[
              'Provision nur bei erfolgreicher Bestellung',
              'Marktgerechte Kommission (individuell verhandelbar)',
              'Keine versteckten Gebühren',
              'Monatliche Abrechnung mit detailliertem Report',
              'Volumenrabatte ab bestimmter Schwelle',
            ].map(t => (
              <li key={t} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-green-500 shrink-0 mt-0.5">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Projections */}
      <div className="card p-5 md:p-6 mb-6 animate-fade-up delay-3">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>PROJEKTIONEN</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROJECTIONS.map(p => (
            <div key={p.year} className="p-4 rounded-xl text-center"
              style={{
                background: p.highlight ? 'var(--brand-dim)' : 'var(--surface2)',
                border: p.highlight ? '1px solid var(--brand)' : '1px solid transparent',
              }}>
              <p className="text-xs font-bold mb-2" style={{ color: p.highlight ? 'var(--brand)' : 'var(--text-tertiary)' }}>{p.year}</p>
              <p className="text-metric-md mb-0.5" style={{ color: 'var(--text-primary)' }}>{p.users}</p>
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>aktive Handwerker</p>
              <p className="text-sm font-bold" style={{ color: p.highlight ? 'var(--brand)' : 'var(--text-primary)' }}>{p.orders}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Bestellungen</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm mt-4 font-semibold" style={{ color: 'var(--brand)' }}>
          Stellen Sie sich vor: 25.000 Handwerker bestellen 1-Click bei Ihnen.
        </p>
      </div>

      {/* Payment & Trust */}
      <div className="card p-5 animate-fade-up delay-4">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>PAYMENT & SICHERHEIT</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Escrow-System', desc: 'Sicheres Payment' },
            { label: 'Auto-Rechnungen', desc: 'Automatisiert' },
            { label: 'DSGVO-konform', desc: 'Made in Germany' },
            { label: 'Echtzeit-Reports', desc: 'Volle Transparenz' },
          ].map(item => (
            <div key={item.label} className="text-center p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
