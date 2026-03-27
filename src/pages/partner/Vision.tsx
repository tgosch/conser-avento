import { Zap, TrendingUp, Target, ArrowRight } from 'lucide-react'
import { PhoneMockup, LaptopMockup } from '../../components/showcase/DeviceMockup'

export default function PartnerVision() {
  return (
    <div className="max-w-5xl mx-auto">

      {/* ── HEADER ── */}
      <div className="mb-8 animate-fade-up">
        <p className="label-overline mb-2">Vision & Mission</p>
        <h1 className="text-display-md mb-3" style={{ color: 'var(--text-primary)' }}>
          Warum wir Avento & Conser bauen
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          Die Baubranche ist die letzte große Branche Europas, die noch nicht digitalisiert ist.
        </p>
      </div>

      {/* ── HERO STATEMENT ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-1">
        <div className="relative px-8 py-12 md:px-12 md:py-16 text-center"
          style={{ background: 'linear-gradient(135deg, #041E1F 0%, #063D3E 40%, #0A5C5E 100%)' }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
          <p className="text-display-md text-white mb-4" style={{ maxWidth: 580, margin: '0 auto' }}>
            73% aller Handwerksbetriebe arbeiten noch mit Excel, Papier und Fax.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 440, margin: '0 auto' }}>
            Es gibt kein integriertes System, das Kalkulation, Bestellung und Abrechnung verbindet. Bis jetzt.
          </p>
        </div>
      </div>

      {/* ── THE PROBLEM ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up delay-2">
        <div className="card p-6" style={{ borderLeft: '3px solid var(--danger)' }}>
          <p className="label-tag mb-4" style={{ color: 'var(--danger)' }}>PROBLEM FÜR HANDWERKER</p>
          <ul className="space-y-3">
            {[
              'Medienbrüche zwischen Angebot, Bestellung und Rechnung',
              'Manuelle Bestellungen per Telefon, Fax oder E-Mail',
              'Keine Transparenz bei Preisen und Lieferzeiten',
              'Keine Software, die zu ihrem Alltag passt',
            ].map(t => (
              <li key={t} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                  style={{ background: 'var(--danger-dim)', color: 'var(--danger)' }}>!</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6" style={{ borderLeft: '3px solid var(--warning)' }}>
          <p className="label-tag mb-4" style={{ color: 'var(--warning)' }}>PROBLEM FÜR LIEFERANTEN</p>
          <ul className="space-y-3">
            {[
              'Kein digitaler Kanal zu 95% der Handwerker',
              'Hohe Vertriebskosten für Kundenakquise',
              'Bestellungen per Fax und Telefon — fehleranfällig',
              'Keine Daten über Kundenbedürfnisse und Trends',
            ].map(t => (
              <li key={t} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                  style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>!</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── THE SOLUTION ── */}
      <div className="mb-8 animate-fade-up delay-3">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--brand)' }}>DIE LÖSUNG</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card overflow-hidden">
            <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}>A</span>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Avento ERP</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--brand)' }}>Das Steckenpferd — der Kundenbringer</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Integrierte Betriebssoftware für Handwerker: Controlling, Buchhaltung, Angebote, Team-Steuerung.
                Handwerker nutzen Avento täglich — und bestellen Material direkt aus dem Projekt heraus.
              </p>
            </div>
            <div className="p-6 flex justify-center" style={{ background: 'var(--surface2)' }}>
              <LaptopMockup
                placeholderIcon="📊"
                placeholderText="Avento ERP Dashboard"
                gradient="linear-gradient(145deg, #041E1F 0%, #063D3E 100%)"
              />
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>C</span>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Der Umsatztreiber — der große Revenue</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                B2B-Marktplatz mit 2,3M Produkten, direkt ins ERP integriert. 1-Click-Bestellung,
                automatische Preisvergleiche, Lieferzeiten in Echtzeit. Ihr Katalog, unsere Kunden.
              </p>
            </div>
            <div className="p-6 flex justify-center" style={{ background: 'var(--surface2)' }}>
              <LaptopMockup
                placeholderIcon="🛒"
                placeholderText="Conser Marktplatz"
                gradient="linear-gradient(145deg, #1A0A00 0%, #8B4513 50%, #C8611A 100%)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE EXPERIENCE ── */}
      <div className="card p-6 md:p-8 mb-8 animate-fade-up delay-4">
        <div className="flex items-center gap-2 mb-6">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>DIE MOBILE ERFAHRUNG</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <PhoneMockup
            placeholderIcon="📋"
            placeholderText="Projekt-Übersicht"
            gradient="linear-gradient(145deg, #041E1F 0%, #063D3E 100%)"
            label="Projekte"
            sublabel="Kalkulation & Planung"
          />
          <PhoneMockup
            placeholderIcon="📦"
            placeholderText="Material bestellen"
            gradient="linear-gradient(145deg, #0A2A2B 0%, #0E7A7D 100%)"
            label="Bestellung"
            sublabel="1-Click aus dem Projekt"
          />
          <PhoneMockup
            placeholderIcon="🏪"
            placeholderText="Conser Shop"
            gradient="linear-gradient(145deg, #1A0A00 0%, #C8611A 100%)"
            label="Conser Shop"
            sublabel="2,3M Produkte"
          />
        </div>
        <p className="text-center text-xs mt-6 font-semibold" style={{ color: 'var(--brand)' }}>
          Handwerker bestellen Material direkt von der Baustelle — 1-Click an Sie als Partner.
        </p>
      </div>

      {/* ── ECOSYSTEM FLOW ── */}
      <div className="card p-6 md:p-8 mb-8 animate-fade-up delay-4">
        <div className="flex items-center gap-2 mb-6">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>DER BESTELLFLOW</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: '🔨', title: 'Handwerker', desc: 'Erstellt Projekt in Avento ERP', color: 'var(--brand)' },
            { icon: '📊', title: 'Avento ERP', desc: 'Erkennt Material-Bedarf automatisch', color: 'var(--brand)' },
            { icon: '🏪', title: 'Conser', desc: 'Matched beste Produkte & Preise', color: 'var(--accent)' },
            { icon: '🏭', title: 'Sie', desc: 'Erhalten die Bestellung direkt', color: '#22C55E' },
          ].map((s, i) => (
            <div key={s.title} className="relative">
              <div className="text-center p-5 rounded-xl group hover:translate-y-[-2px] transition-all duration-300"
                style={{ background: 'var(--surface2)', border: `1px solid var(--border)` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl transition-transform group-hover:scale-110"
                  style={{ background: `${s.color}12` }}>
                  {s.icon}
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full items-center justify-center"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <ArrowRight size={10} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MARKET NUMBERS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up delay-4">
        {[
          { icon: Target, value: '1,3 Mio.', label: 'Handwerksbetriebe', sub: 'in der DACH-Region', color: 'var(--brand)' },
          { icon: TrendingUp, value: '€600 Mrd', label: 'Bauvolumen/Jahr', sub: 'Deutschland allein', color: 'var(--accent)' },
          { icon: Zap, value: '<10%', label: 'Digitalisiert', sub: 'Riesiges Potenzial', color: '#22C55E' },
        ].map(({ icon: Icon, value, label, sub, color }) => (
          <div key={label} className="card p-6 text-center group hover:translate-y-[-2px] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: `${color}12` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-metric-lg mb-1 transition-transform duration-300 group-hover:scale-105" style={{ color }}>{value}</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
