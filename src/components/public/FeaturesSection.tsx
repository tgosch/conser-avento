import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'

const erp = [
  { title: 'Kalkulation & Angebote', desc: 'Professionelle Angebote in Minuten. Automatische Materialberechnung, branchenspezifische Vorlagen, digitale Signatur — direkt auf der Baustelle.' },
  { title: 'Zeiterfassung', desc: 'GPS-Stempeluhr für die Baustelle, Tagesberichte per Foto, automatische Projektzuordnung. Funktioniert komplett offline.' },
  { title: 'Rechnungen & Buchhaltung', desc: 'Auto-Rechnungen aus Angeboten. Mahnwesen mit Eskalationsstufen, DATEV-Export, ZUGFeRD-konform. Alles für den Steuerberater.' },
  { title: 'Controlling & Reporting', desc: 'Echtzeit-Dashboards für Deckungsbeiträge, Liquiditätsplanung und Kostenstellenrechnung. Wissen, wo jeder Euro bleibt.' },
  { title: 'Team & Aufgabenplanung', desc: 'Mitarbeiterverwaltung, Urlaubskalender, Aufgabenverteilung. Rollenbasierte Rechte für Meister, Gesellen und Büro.' },
  { title: 'Mobile App', desc: 'Native iOS & Android. Offline-fähig auf jeder Baustelle. Foto-Upload, Push-Benachrichtigungen, Touch-optimiert.' },
]

const shop = [
  { title: '12,8 Mio. Produkte', desc: 'Das größte B2B-Sortiment für Baustoffe in der DACH-Region. Rohre, Kabel, Fliesen, Dämmstoffe, Werkzeuge — alles an einem Ort.' },
  { title: '7 Premium-Hersteller', desc: 'Aktuell 7 führende Großhändler, Ziel: 25 bis Ende 2027. Faire Großhandelspreise, direkt verhandelt.' },
  { title: '24h Baustellen-Lieferung', desc: 'DPD/DHL Integration. Direkt auf die Baustelle, an den Lagerplatz oder ins Büro. Express-Option für dringende Fälle.' },
  { title: 'Flexible Zahlungswege', desc: 'Rechnung mit 30 Tagen Zahlungsziel, SEPA-Lastschrift, Kreditkarte. Monatliche Sammelrechnung für Stammkunden.' },
  { title: 'KI-gestützte Suche', desc: 'Findet exakt was du brauchst — auch bei Tippfehlern, Teilnummern oder umgangssprachlichen Begriffen. Artikelvergleich inklusive.' },
  { title: 'Nahtlose ERP-Integration', desc: '1-Click-Bestellung direkt aus Avento. Material wird automatisch dem richtigen Projekt und der richtigen Kostenstelle zugeordnet.' },
]

type Tab = 'erp' | 'shop'

export default function FeaturesSection() {
  const [tab, setTab] = useState<Tab>('erp')
  const features = tab === 'erp' ? erp : shop

  return (
    <section className="py-28 md:py-36" style={{ background: 'var(--bg)' }}>
      <div className="public-container">
        <ScrollReveal className="text-center mb-6">
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
          }}>
            Zwei Produkte. Ein Ökosystem.
          </h2>
        </ScrollReveal>
        <ScrollReveal className="text-center mb-14">
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Avento ERP für den Betrieb. Conser Marktplatz für das Material. Perfekt aufeinander abgestimmt — ein Login, eine Datenbasis, null Doppeleingaben.
          </p>
        </ScrollReveal>

        {/* Tabs */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex gap-1 p-1 rounded-full" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {([
              { key: 'erp' as Tab, label: 'Avento ERP', c: 'var(--brand)' },
              { key: 'shop' as Tab, label: 'Conser Marktplatz', c: 'var(--accent)' },
            ]).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-all"
                style={{
                  color: tab === t.key ? 'white' : 'var(--text-secondary)',
                  background: tab === t.key ? t.c : 'transparent',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-start">
              {/* Left: Product Card */}
              <div className="hidden lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="sticky top-24"
                  >
                    <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <img
                        src={tab === 'erp' ? aventoLogo : conserLogo}
                        alt={tab === 'erp' ? 'Avento' : 'Conser'}
                        className="w-16 h-16 rounded-2xl mx-auto mb-5 object-cover"
                        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                      />
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {tab === 'erp' ? 'Avento ERP' : 'Conser Marktplatz'}
                      </p>
                      <p className="text-xs mb-6" style={{ color: 'var(--text-tertiary)' }}>
                        {tab === 'erp' ? 'Handwerker-Betriebssystem' : 'B2B-Baustoff-Plattform'}
                      </p>
                      <div className="space-y-2">
                        {(tab === 'erp'
                          ? ['Kalkulation', 'Zeiterfassung', 'Rechnungen', 'Buchhaltung', 'Controlling', 'Team', 'Mobile']
                          : ['12,8M Produkte', '7 / 25 Hersteller', '24h Lieferung', 'KI-Suche', 'ERP-Integration', 'Zahlung']
                        ).map((f) => (
                          <div key={f} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left"
                            style={{ background: 'var(--bg)' }}>
                            <div className="w-1.5 h-1.5 rounded-full"
                              style={{ background: tab === 'erp' ? 'var(--brand)' : 'var(--accent)' }} />
                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: Feature Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                {features.map((f) => (
                  <div key={f.title}>
                    <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
