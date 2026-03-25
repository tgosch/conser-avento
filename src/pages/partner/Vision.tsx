import { Zap, TrendingUp, Target } from 'lucide-react'

export default function PartnerVision() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-up">

      <div className="mb-6">
        <p className="label-overline mb-1">Vision & Mission</p>
        <h1 className="font-bold text-2xl md:text-3xl mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Warum wir Avento & Conser bauen
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Die Baubranche ist die letzte große Branche Europas, die noch nicht digitalisiert ist.
        </p>
      </div>

      {/* Hero Statement */}
      <div className="card overflow-hidden mb-6">
        <div className="px-6 py-8 md:px-8 md:py-10 text-center"
          style={{ background: 'linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%)' }}>
          <p className="text-xl md:text-2xl font-bold text-white mb-3" style={{ maxWidth: 500, margin: '0 auto' }}>
            73% aller Handwerksbetriebe arbeiten noch mit Excel, Papier und Fax.
          </p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 440, margin: '0 auto' }}>
            Es gibt kein integriertes System, das Kalkulation, Bestellung und Abrechnung verbindet. Bis jetzt.
          </p>
        </div>
      </div>

      {/* Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-up delay-1">
        <div className="card p-5">
          <p className="label-tag mb-3" style={{ color: 'var(--danger)' }}>PROBLEM FÜR HANDWERKER</p>
          <ul className="space-y-2.5">
            {[
              'Medienbrüche zwischen Angebot, Bestellung und Rechnung',
              'Manuelle Bestellungen per Telefon, Fax oder E-Mail',
              'Keine Transparenz bei Preisen und Lieferzeiten',
              'Keine Software, die zu ihrem Alltag passt',
            ].map(t => (
              <li key={t} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-red-400 shrink-0 mt-0.5">✕</span> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <p className="label-tag mb-3" style={{ color: 'var(--warning)' }}>PROBLEM FÜR LIEFERANTEN</p>
          <ul className="space-y-2.5">
            {[
              'Kein digitaler Kanal zu 95% der Handwerker',
              'Hohe Vertriebskosten für Kundenakquise',
              'Bestellungen per Fax und Telefon',
              'Keine Daten über Kundenbedürfnisse',
            ].map(t => (
              <li key={t} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-amber-400 shrink-0 mt-0.5">!</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Solution */}
      <div className="mb-6 animate-fade-up delay-2">
        <p className="label-tag mb-3" style={{ color: 'var(--brand)' }}>DIE LÖSUNG</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5" style={{ borderLeft: '3px solid var(--brand)' }}>
            <p className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Avento ERP</p>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--brand)' }}>Das Steckenpferd — der Kundenbringer</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Integrierte Betriebssoftware für Handwerker: Kalkulation, Zeiterfassung, Aufmaß, Fakturierung.
              Handwerker nutzen Avento täglich — und bestellen Material direkt aus dem Projekt heraus.
            </p>
          </div>
          <div className="card p-5" style={{ borderLeft: '3px solid var(--accent)' }}>
            <p className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</p>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--accent)' }}>Der Umsatztreiber — der große Revenue</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              B2B-Marktplatz mit 2,3M Produkten, direkt ins ERP integriert. 1-Click-Bestellung,
              automatische Preisvergleiche, Lieferzeiten in Echtzeit. Ihr Katalog, unsere Kunden.
            </p>
          </div>
        </div>
      </div>

      {/* Ecosystem Flow */}
      <div className="card p-5 md:p-6 mb-6 animate-fade-up delay-3">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>DAS ÖKOSYSTEM</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { icon: '🔨', title: 'Handwerker', desc: 'Erstellt Projekt in Avento ERP' },
            { icon: '📦', title: 'Avento ERP',  desc: 'Erkennt Material-Bedarf automatisch' },
            { icon: '🏪', title: 'Conser Marktplatz', desc: 'Matched beste Produkte & Preise' },
            { icon: '🏭', title: 'Sie als Partner', desc: 'Erhalten die Bestellung direkt' },
          ].map((s, i) => (
            <div key={s.title} className="text-center p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-2xl block mb-2">{s.icon}</span>
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              {i < 3 && (
                <p className="text-lg mt-2 hidden md:block" style={{ color: 'var(--text-tertiary)' }}>→</p>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-4 font-semibold" style={{ color: 'var(--brand)' }}>
          1-Click-Bestellung aus dem Projekt heraus. Kein Medienbruch. Kein Fax.
        </p>
      </div>

      {/* Market */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up delay-4">
        {[
          { icon: Target, value: '390.000', label: 'Handwerksbetriebe', sub: 'in der DACH-Region' },
          { icon: TrendingUp, value: '€600 Mrd', label: 'Bauvolumen/Jahr', sub: 'Deutschland allein' },
          { icon: Zap, value: '<10%', label: 'Digitalisiert', sub: 'Riesiges Potenzial' },
        ].map(({ icon: Icon, value, label, sub }) => (
          <div key={label} className="card p-5 text-center">
            <Icon size={20} className="mx-auto mb-3" style={{ color: 'var(--brand)' }} />
            <p className="text-metric-lg mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
