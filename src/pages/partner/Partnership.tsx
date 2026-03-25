import { CheckCircle, Circle, Users, ShoppingCart, Eye, BarChart3, Megaphone, Link2 } from 'lucide-react'

const PROCESS = [
  { step: 1, title: 'Verhandlung', desc: 'Konditionen festlegen, Produktkatalog prüfen, API-Anbindung planen', duration: '1-2 Wochen' },
  { step: 2, title: 'Technische Integration', desc: 'Produkt-Feed einrichten, Preise & Verfügbarkeit synchronisieren, Bestellschnittstelle live schalten', duration: '2-3 Wochen' },
  { step: 3, title: 'Beta-Phase', desc: '5-10 Pilot-Handwerker testen Ihre Produkte, Feedback-Loop, gemeinsame Optimierung', duration: '4-6 Wochen' },
  { step: 4, title: 'Live Partner', desc: 'Voller Zugang zu allen Avento-Nutzern, automatisierte Bestellungen, Marketing-Features freigeschaltet', duration: 'Dauerhaft' },
]

const BENEFITS = [
  { icon: Users, title: 'Zugang zu 75.000 Zielkunden', desc: 'Ohne eigenen Vertrieb, über Warm-Referrals direkt aus dem ERP der Handwerker.' },
  { icon: ShoppingCart, title: 'Automatisierte Bestellungen', desc: 'Direkt aus dem ERP der Handwerker in Ihr System. Kein manueller Aufwand.' },
  { icon: Eye, title: 'Volle Sichtbarkeit', desc: 'Produkte auf dem Conser Marktplatz mit intelligenten Empfehlungen und Suchpriorisierung.' },
  { icon: Link2, title: 'Kein Medienbruch', desc: 'Bestellung, Lieferung, Rechnung — alles digital, von Anfang bis Ende.' },
  { icon: BarChart3, title: 'Daten & Analytics', desc: 'Bestellvolumen, Trends, Kundenfeedback in Echtzeit. Datengetriebene Entscheidungen.' },
  { icon: Megaphone, title: 'Gemeinsames Marketing', desc: 'Co-Branded Aktionen, Featured Partner Programme, Newsletter-Platzierungen.' },
]

export default function PartnerPartnership() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-up">

      <div className="mb-6">
        <p className="label-overline mb-1">Partnermodell</p>
        <h1 className="font-bold text-2xl md:text-3xl mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          So funktioniert die Integration
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Von der ersten Kontaktaufnahme bis zum Live-Partner in 8-12 Wochen.
        </p>
      </div>

      {/* Process Timeline */}
      <div className="card p-5 md:p-6 mb-6 animate-fade-up delay-1">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>DER PROZESS</p>
        <div className="flex flex-col gap-4">
          {PROCESS.map((p, i) => (
            <div key={p.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: i === 0 ? 'var(--brand)' : 'var(--surface3)' }}>
                  {i === 0 ? (
                    <Circle size={14} className="text-white" fill="white" />
                  ) : (
                    <CheckCircle size={14} style={{ color: 'var(--text-tertiary)' }} />
                  )}
                </div>
                {i < PROCESS.length - 1 && (
                  <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)' }} />
                )}
              </div>
              <div className="pb-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Phase {p.step}: {p.title}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface2)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {p.duration}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-6 animate-fade-up delay-2">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>WAS SIE BEKOMMEN</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'var(--brand-dim)' }}>
                <Icon size={18} style={{ color: 'var(--brand)' }} />
              </div>
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-up delay-3">
        <div className="card p-5" style={{ borderTop: '3px solid var(--brand)' }}>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-3 inline-block"
            style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}>Empfohlen</span>
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>API-Integration</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Vollautomatisch, Echtzeit-Sync von Produkten, Preisen und Bestellungen. RESTful API mit umfangreicher Dokumentation.
          </p>
        </div>
        <div className="card p-5" style={{ borderTop: '3px solid var(--text-tertiary)' }}>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-3 inline-block"
            style={{ background: 'var(--surface2)', color: 'var(--text-tertiary)' }}>Einstieg</span>
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>CSV / Feed-Upload</h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Manuell oder periodisch. Perfekt für den Start, bevor die vollständige API-Anbindung live geht.
          </p>
        </div>
      </div>

      {/* SLA */}
      <div className="card p-5 animate-fade-up delay-4">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>KONDITIONEN</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Onboarding', value: '2-4 Wochen' },
            { label: 'Setup-Gebühren', value: 'Keine' },
            { label: 'Tech-Support', value: 'Inklusive' },
            { label: 'Provision', value: 'Nur bei Bestellung' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--brand)' }}>{item.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
