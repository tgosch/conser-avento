import { Users, ShoppingCart, Eye, BarChart3, Megaphone, Link2, ArrowRight } from 'lucide-react'
import { LaptopMockup } from '../../components/showcase/DeviceMockup'

const PROCESS = [
  { step: 1, title: 'Verhandlung', desc: 'Konditionen festlegen, Produktkatalog prüfen, API-Anbindung planen.', duration: '1-2 Wochen', icon: '🤝', color: 'var(--brand)' },
  { step: 2, title: 'Technische Integration', desc: 'Produkt-Feed einrichten, Preise & Verfügbarkeit synchronisieren, Bestellschnittstelle live schalten.', duration: '2-3 Wochen', icon: '⚙️', color: 'var(--info)' },
  { step: 3, title: 'Beta-Phase', desc: '5-10 Pilot-Handwerker testen Ihre Produkte. Feedback-Loop, gemeinsame Optimierung.', duration: '4-6 Wochen', icon: '🧪', color: 'var(--accent)' },
  { step: 4, title: 'Live Partner', desc: 'Voller Zugang zu allen Avento-Nutzern. Automatisierte Bestellungen, Marketing-Features freigeschaltet.', duration: 'Dauerhaft', icon: '🚀', color: '#22C55E' },
]

const BENEFITS = [
  { icon: Users, title: 'Zugang zu 75.000 Zielkunden', desc: 'Ohne eigenen Vertrieb, über Warm-Referrals direkt aus dem ERP der Handwerker.', accent: 'var(--brand)' },
  { icon: ShoppingCart, title: 'Automatisierte Bestellungen', desc: 'Direkt aus dem ERP der Handwerker in Ihr System. Kein manueller Aufwand.', accent: 'var(--accent)' },
  { icon: Eye, title: 'Volle Sichtbarkeit', desc: 'Produkte auf dem Conser Marktplatz mit KI-gestützten Empfehlungen und Suchpriorisierung.', accent: '#22C55E' },
  { icon: Link2, title: 'Kein Medienbruch', desc: 'Bestellung, Lieferung, Rechnung — alles digital, von Anfang bis Ende.', accent: 'var(--info)' },
  { icon: BarChart3, title: 'Daten & Analytics', desc: 'Bestellvolumen, Trends, Kundenfeedback in Echtzeit. Datengetriebene Entscheidungen.', accent: '#8B5CF6' },
  { icon: Megaphone, title: 'Gemeinsames Marketing', desc: 'Co-Branded Aktionen, Featured Partner Programme, Newsletter-Platzierungen.', accent: '#EC4899' },
]

export default function PartnerPartnership() {
  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-8 animate-fade-up">
        <p className="label-overline mb-2">Partnermodell</p>
        <h1 className="text-display-md mb-3" style={{ color: 'var(--text-primary)' }}>
          So funktioniert die Integration
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          Von der ersten Kontaktaufnahme bis zum Live-Partner in 8-12 Wochen. Keine Setup-Kosten.
        </p>
      </div>

      {/* ── PROCESS TIMELINE ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-1">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>DER PROZESS</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-0">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-lg"
                    style={{ background: `${p.color}12` }}>
                    {p.icon}
                  </div>
                  {i < PROCESS.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: 'var(--border)' }} />
                  )}
                </div>
                <div className="pb-6 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      Phase {p.step}: {p.title}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${p.color}12`, color: p.color, fontFamily: 'var(--font-mono)' }}>
                      {p.duration}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ORDER FLOW VISUALIZATION ── */}
      <div className="card p-6 md:p-8 mb-8 animate-fade-up delay-2">
        <div className="flex items-center gap-2 mb-6">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>SO SIEHT EINE BESTELLUNG AUS</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="flex justify-center">
          <LaptopMockup
            placeholderIcon="📦"
            placeholderText="Bestellflow: Avento → Conser → Partner"
            gradient="linear-gradient(145deg, #0C1222 0%, #162032 40%, #1A3A5C 100%)"
            label="Automatisierter Bestellprozess"
            sublabel="Handwerker bestellt → Conser matched → Sie liefern"
          />
        </div>
      </div>

      {/* ── BENEFITS ── */}
      <div className="mb-8 animate-fade-up delay-3">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>WAS SIE BEKOMMEN</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map(({ icon: Icon, title, desc, accent }) => (
            <div key={title} className="card p-5 group hover:translate-y-[-2px] transition-all duration-300"
              style={{ borderBottom: `2px solid ${accent}` }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${accent}15` }}>
                <Icon size={18} style={{ color: accent }} />
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── INTEGRATION OPTIONS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up delay-4">
        <div className="card p-6 relative overflow-hidden group hover:translate-y-[-2px] transition-all duration-300"
          style={{ borderTop: '3px solid var(--brand)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, var(--brand) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 inline-block tracking-wide"
            style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}>EMPFOHLEN</span>
          <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>API-Integration</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Vollautomatisch, Echtzeit-Sync von Produkten, Preisen und Bestellungen. RESTful API mit umfangreicher Dokumentation.
          </p>
        </div>
        <div className="card p-6 group hover:translate-y-[-2px] transition-all duration-300"
          style={{ borderTop: '3px solid var(--text-tertiary)' }}>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 inline-block tracking-wide"
            style={{ background: 'var(--surface2)', color: 'var(--text-tertiary)' }}>EINSTIEG</span>
          <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>CSV / Feed-Upload</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Manuell oder periodisch. Perfekt für den Start, bevor die vollständige API-Anbindung live geht.
          </p>
        </div>
      </div>

      {/* ── SLA ── */}
      <div className="card overflow-hidden animate-fade-up delay-4">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>KONDITIONEN</p>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Onboarding', value: '2-4 Wochen', icon: '⏱️' },
            { label: 'Setup-Gebühren', value: 'Keine', icon: '💶' },
            { label: 'Tech-Support', value: 'Inklusive', icon: '🛠️' },
            { label: 'Provision', value: 'Nur bei Order', icon: '📊' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <span className="text-xl block mb-2">{item.icon}</span>
              <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--brand)' }}>{item.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 text-center" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
          <a href="mailto:torben@conser-avento.de"
            className="inline-flex items-center gap-2 text-sm font-semibold hover-press" style={{ color: 'var(--brand)' }}>
            Jetzt Gespräch vereinbaren <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
