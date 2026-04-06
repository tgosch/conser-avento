import { Link } from 'react-router-dom'
import {
  ArrowRight, Calculator, Clock, FileText, BarChart3, Users, Smartphone,
  ShoppingCart, Package, Truck, CreditCard, Search, ArrowLeftRight,
} from 'lucide-react'
import ScrollReveal from '../../components/public/ScrollReveal'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'
import conserShop from '../../assets/conser-shop.webp'

const aventoModules = [
  { icon: Calculator, title: 'Kalkulation & Angebote', desc: 'Automatische Materialberechnung, Vorlagen, digitale Signatur.' },
  { icon: Clock, title: 'Zeiterfassung', desc: 'GPS-Stempeluhr, Tagesberichte, Projektzuordnung. Offline-fähig.' },
  { icon: FileText, title: 'Rechnungen', desc: 'Auto-Rechnungen, Mahnwesen, DATEV-Export. ZUGFeRD.' },
  { icon: BarChart3, title: 'Controlling', desc: 'Echtzeit-Dashboards, Deckungsbeiträge, Liquidität.' },
  { icon: Users, title: 'Team', desc: 'Mitarbeiterverwaltung, Aufgaben, Urlaubskalender.' },
  { icon: Smartphone, title: 'Mobile', desc: 'iOS & Android, offline, Foto-Upload, Push.' },
]

const conserHighlights = [
  { icon: ShoppingCart, title: '2,3 Mio. Produkte', desc: 'Größtes B2B-Sortiment der DACH-Region.' },
  { icon: Package, title: '7 Hersteller', desc: 'Aktuell 7, Ziel: 25 führende Großhändler der DACH-Region.' },
  { icon: Truck, title: '24h Lieferung', desc: 'DPD/DHL. Baustelle oder Lager.' },
  { icon: CreditCard, title: 'Zahlung', desc: 'Rechnung, SEPA, Kreditkarte. Sammelrechnung.' },
  { icon: Search, title: 'KI-Suche', desc: 'Findet alles — auch bei Tippfehlern.' },
  { icon: ArrowLeftRight, title: 'ERP-Link', desc: '1-Click aus Avento. Automatische Zuordnung.' },
]

export default function PublicProducts() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Hero */}
      <section className="public-container pb-20 md:pb-28">
        <ScrollReveal>
          <p className="label-overline mb-4" style={{ color: 'var(--brand)' }}>Produkte</p>
          <h1 className="mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 400, maxWidth: 500 }}>
            Alles für dein Handwerk. Ein Ökosystem.
          </h1>
          <p className="text-base max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Avento ERP für den Betrieb. Conser Marktplatz für das Material.
          </p>
        </ScrollReveal>
      </section>

      {/* Avento */}
      <section className="py-20 md:py-28" style={{ background: 'var(--surface)' }}>
        <div className="public-container max-w-4xl">
          <ScrollReveal className="flex items-center gap-3 mb-10">
            <img src={aventoLogo} alt="Avento" className="h-10 rounded-xl" />
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Avento ERP</h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Handwerker-Betriebssystem</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--border)' }}>
            {aventoModules.map((m, i) => (
              <ScrollReveal key={m.title} delay={i * 0.04}>
                <div className="p-7 h-full"
                  style={{ background: 'var(--bg)', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', borderRight: (i % 3 !== 2) ? '1px solid var(--border)' : 'none' }}>
                  <m.icon size={18} className="mb-3" style={{ color: 'var(--text-tertiary)' }} />
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{m.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Conser */}
      <section className="py-20 md:py-28" style={{ background: 'var(--bg)' }}>
        <div className="public-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <ScrollReveal direction="left">
              <div className="rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: '#1A1A1A' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: '#FF5F57' }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: '#FFBD2E' }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: '#27C93F' }} />
                </div>
                <img src={conserShop} alt="Conser Marktplatz" className="w-full block" />
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal className="flex items-center gap-3 mb-8">
                <img src={conserLogo} alt="Conser" className="h-10 rounded-xl" />
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</h2>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>B2B-Baustoff-Plattform</p>
                </div>
              </ScrollReveal>

              <div className="flex flex-col gap-4">
                {conserHighlights.map((h, i) => (
                  <ScrollReveal key={h.title} delay={i * 0.04}>
                    <div className="flex items-start gap-3">
                      <h.icon size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                      <div>
                        <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{h.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{h.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal className="mt-6">
                <a href="https://www.conser-gosch.de" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
                  style={{ color: 'var(--accent)' }}>
                  Shop besuchen <ArrowRight size={14} />
                </a>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" style={{ background: 'var(--surface)' }}>
        <div className="public-container text-center">
          <ScrollReveal>
            <h2 className="mb-6"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 400 }}>
              Bereit es auszuprobieren?
            </h2>
            <p className="text-sm max-w-sm mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
              Kostenloser Testzugang. Persönliches Onboarding inklusive.
            </p>
            <Link to="/kontakt"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--brand)', color: 'white' }}>
              Testzugang anfragen <ArrowRight size={15} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
