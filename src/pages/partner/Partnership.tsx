import { useState } from 'react'
import { Users, ShoppingCart, Eye, BarChart3, Megaphone, Link2, ArrowRight, Shield, CheckCircle, Clock, Server, MapPin, PartyPopper, Handshake, Calendar } from 'lucide-react'
import { LaptopMockup } from '../../components/showcase/DeviceMockup'
import BookingModal from '../../components/BookingModal'
import conserShopImg from '../../assets/conser-shop.webp'

// ── 8-Schritte Onboarding ────────────────────────────────────────
const ONBOARDING = [
  { step: 1, title: 'Kennenlernen', desc: 'Persönlicher Termin zum gegenseitigen Kennenlernen. Wir verstehen Ihr Geschäft, Sie verstehen unsere Vision.', duration: 'Tag 1', icon: '🤝', color: 'var(--brand)' },
  { step: 2, title: 'Partnerzeit', desc: 'Ausführliches Gespräch zu Konditionen, Produktkatalog, Kapazitäten und gemeinsamen Zielen.', duration: 'Woche 1', icon: '💬', color: 'var(--info)' },
  { step: 3, title: 'Verträge & Ablauf', desc: 'Detaillierte Erklärung aller Vertragsbestandteile, Ablaufpläne und gegenseitige Erwartungen.', duration: 'Woche 1–2', icon: '📋', color: 'var(--accent)' },
  { step: 4, title: 'Vertragsrücksendung', desc: 'Partner sendet unterschriebenen Content-Vertrag und Rahmenbedingungen zurück. Verbindlicher Start.', duration: 'Woche 2', icon: '✍️', color: '#8B5CF6' },
  { step: 5, title: 'IT-Abstimmung', desc: 'Unser IT-Spezialist setzt sich mit einem Experten Ihres Unternehmens zusammen. Technische Anforderungen klären.', duration: 'Woche 2–3', icon: '👨‍💻', color: '#0066FF' },
  { step: 6, title: 'Datenaustausch', desc: 'Integration per OCI, API, CSV oder anderen Optionen — je nach Ihrem bestehenden System. Produkte, Preise, Verfügbarkeit.', duration: 'Woche 3–5', icon: '🔄', color: '#EC4899' },
  { step: 7, title: 'Produktintegration', desc: 'Unser IT-Spezialist integriert alle Produkte vollständig. Bei Vollendung erhalten Sie Bescheid — alles getestet und bereit.', duration: 'Woche 5–7', icon: '⚙️', color: '#F59E0B' },
  { step: 8, title: 'Go Live!', desc: 'Ab dem nächsten Tag geht es los. Ihre Produkte sind live auf dem Conser Marktplatz — sichtbar für alle Avento-Nutzer.', duration: 'Woche 8', icon: '🚀', color: '#22C55E' },
]

const BENEFITS = [
  { icon: Users, title: 'Zugang zu 75.000 Zielkunden', desc: 'Netzwerk von rund 75.000 Handwerksbetrieben in den nächsten 6 Jahren — ohne eigenen Vertrieb.', accent: 'var(--brand)' },
  { icon: ShoppingCart, title: 'Automatisierte Bestellungen', desc: 'Direkt aus dem ERP der Handwerker in Ihr System. Kein manueller Aufwand, keine Medienbrüche.', accent: 'var(--accent)' },
  { icon: Eye, title: 'Favorit-Listing (erste 10)', desc: 'Als einer der ersten 10 Partner werden Sie als Favorit gelistet und in der Suche priorisiert. Immense Reichweite.', accent: '#22C55E' },
  { icon: Link2, title: 'Millionen-Umsätze ohne Werbekosten', desc: 'Jährlich wiederkehrende Umsätze ohne dass Sie Geld für Vertrieb und Werbung bezahlen müssen.', accent: 'var(--info)' },
  { icon: BarChart3, title: 'Daten & Analytics', desc: 'Bestellvolumen, Trends, Kundenfeedback in Echtzeit. Datengetriebene Sortimentsoptimierung.', accent: '#8B5CF6' },
  { icon: Megaphone, title: 'Zugang zu Events', desc: 'Exklusive Partner-Events, Co-Branded Aktionen, Featured Partner Programme und gemeinsame Öffentlichkeitsarbeit.', accent: '#EC4899' },
]

// ── Bedenken entkräften ──────────────────────────────────────────
const CONCERNS = [
  { icon: CheckCircle, title: 'Ihr Geschäft läuft weiter', desc: 'Bei Ihnen ändert sich nichts am Tagesgeschäft. Alles läuft ganz normal weiter — Conser ist ein zusätzlicher Vertriebskanal.', color: '#22C55E' },
  { icon: Shield, title: 'Treuhänder-Konten & 3-Fach-Verifizierung', desc: 'Maximale Sicherheit durch Escrow-System und dreifache Verifizierung bei jeder Transaktion.', color: 'var(--brand)' },
  { icon: Server, title: 'Server in Deutschland', desc: 'Alle Daten werden ausschließlich auf deutschen Servern gehostet. DSGVO-konform, ISO 27001 Standards.', color: 'var(--info)' },
  { icon: MapPin, title: 'Standort Fürth (Bayern)', desc: 'Kein Ausland, keine Umwege. Unser Firmensitz ist in Fürth, Bayern — persönlicher Kontakt jederzeit möglich.', color: 'var(--accent)' },
  { icon: Handshake, title: 'Professionelle Abwicklung', desc: 'Von der Integration bis zur täglichen Bestellabwicklung — alles professionell, transparent und mit persönlichem Ansprechpartner.', color: '#8B5CF6' },
  { icon: PartyPopper, title: 'Die Baubranche zurück an die Spitze', desc: 'Gemeinsam helfen wir dem Handwerk und der Baubranche in der DACH-Region, wieder an die Spitze zu kommen.', color: '#EC4899' },
]

export default function PartnerPartnership() {
  const [showBooking, setShowBooking] = useState(false)
  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-8 animate-fade-up">
        <p className="label-overline mb-2">Partnermodell</p>
        <h1 className="text-display-md mb-3" style={{ color: 'var(--text-primary)' }}>
          So funktioniert die Partnerschaft
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)', maxWidth: 560 }}>
          Von der ersten Kontaktaufnahme bis zum Live-Partner in 4–8 Wochen.
          Für die ersten 10 Partner ist das komplette Onboarding kostenlos.
        </p>
      </div>

      {/* ── 8-SCHRITTE ONBOARDING TIMELINE ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-1">
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>ONBOARDING — 8 SCHRITTE</p>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}>
            4–8 Wochen Laufzeit
          </span>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-0">
            {ONBOARDING.map((p, i) => (
              <div key={p.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-lg relative"
                    style={{ background: `${p.color}12` }}>
                    {p.icon}
                    <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: p.color }}>{p.step}</span>
                  </div>
                  {i < ONBOARDING.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: 'var(--border)' }} />
                  )}
                </div>
                <div className="pb-5 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {p.title}
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

      {/* ── KOSTEN ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up delay-2">
        <div className="card p-6 relative overflow-hidden group hover:translate-y-[-2px] transition-all duration-300"
          style={{ borderTop: '3px solid #22C55E' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #22C55E 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 inline-block tracking-wide"
            style={{ background: 'rgba(52,199,89,0.12)', color: '#22C55E' }}>ERSTE 10 PARTNER</span>
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Gratis</h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Komplettes Onboarding inklusive IT-Integration, Datenaustausch und Go-Live — ohne Kosten.
            Wir übernehmen Hosting und Live-Übertragung dauerhaft.
          </p>
          <ul className="space-y-1.5">
            {['Onboarding komplett gratis', 'Hosting inklusive', 'Live-Übertragung inklusive', 'Favorit-Listing & Priorisierung'].map(t => (
              <li key={t} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <CheckCircle size={12} style={{ color: '#22C55E' }} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6 group hover:translate-y-[-2px] transition-all duration-300"
          style={{ borderTop: '3px solid var(--text-tertiary)' }}>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 inline-block tracking-wide"
            style={{ background: 'var(--surface2)', color: 'var(--text-tertiary)' }}>AB PARTNER 11</span>
          <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>25.000 €</h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Einmalige Onboarding-Gebühr für alle Partner nach den ersten 10. Hosting und
            laufende Kosten werden weiterhin von uns übernommen.
          </p>
          <ul className="space-y-1.5">
            {['Einmaliger Betrag', 'Hosting weiterhin inklusive', 'Live-Übertragung inklusive', 'Voller Marktzugang'].map(t => (
              <li key={t} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={12} style={{ color: 'var(--text-tertiary)' }} /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── ORDER FLOW VISUALIZATION ── */}
      <div className="card p-4 md:p-8 mb-8 animate-fade-up delay-2">
        <div className="flex items-center gap-2 mb-6">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>SO SIEHT EINE BESTELLUNG AUS</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="flex justify-center">
          <LaptopMockup
            src={conserShopImg}
            alt="Conser Marktplatz — Bestellprozess"
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

      {/* ── BEDENKEN ENTKRÄFTEN ── */}
      <div className="mb-8 animate-fade-up delay-3">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>IHRE BEDENKEN — UNSERE ANTWORTEN</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONCERNS.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card p-5 group hover:translate-y-[-2px] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${color}12` }}>
                <Icon size={18} style={{ color }} />
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
          <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>OCI / API-Integration</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Vollautomatisch per OCI-Schnittstelle oder RESTful API. Echtzeit-Sync von Produkten, Preisen und Bestellungen.
            Unser IT-Spezialist übernimmt die Einrichtung gemeinsam mit Ihrem Team.
          </p>
        </div>
        <div className="card p-6 group hover:translate-y-[-2px] transition-all duration-300"
          style={{ borderTop: '3px solid var(--text-tertiary)' }}>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 inline-block tracking-wide"
            style={{ background: 'var(--surface2)', color: 'var(--text-tertiary)' }}>ALTERNATIVE</span>
          <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>CSV / Feed-Upload</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Manuell oder periodisch. Perfekt als Einstieg, bevor die vollständige OCI/API-Anbindung eingerichtet wird.
          </p>
        </div>
      </div>

      {/* ── KONDITIONEN ÜBERSICHT ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-4">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>KONDITIONEN AUF EINEN BLICK</p>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Onboarding-Dauer', value: '4–8 Wochen', icon: '⏱️' },
            { label: 'Setup (erste 10)', value: 'Gratis', icon: '💶' },
            { label: 'Hosting & Live', value: 'Wir übernehmen', icon: '🖥️' },
            { label: 'Laufende Kosten', value: '0 € für Sie', icon: '✅' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <span className="text-xl block mb-2">{item.icon}</span>
              <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--brand)' }}>{item.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 text-center" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
          <button onClick={() => setShowBooking(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold hover-press" style={{ color: 'var(--brand)' }}>
            <Calendar size={14} /> Termin vereinbaren <ArrowRight size={14} />
          </button>
        </div>
      </div>
      {/* NACH GO-LIVE */}
      <div className="card p-6 md:p-8 mb-8 animate-fade-up">
        <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Nach Go-Live — Ihr laufender Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🤝', title: 'Persönlicher Ansprechpartner', desc: 'Ein dedizierter Account Manager begleitet Ihre Partnerschaft — von der Integration bis zur Optimierung.' },
            { icon: '📊', title: 'Monatliches Reporting', desc: 'Detaillierte Berichte zu Bestellungen, Umsatz und Kundenfeedback. Transparenz auf beiden Seiten.' },
            { icon: '🔧', title: 'Technischer Support', desc: 'Unser Entwicklerteam steht für API-Fragen, Katalog-Updates und Integrationsthemen zur Verfügung.' },
          ].map(s => (
            <div key={s.title} className="p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xl block mb-2">{s.icon}</span>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
    </div>
  )
}
