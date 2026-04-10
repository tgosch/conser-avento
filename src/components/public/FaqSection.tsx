import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ_DATA = [
  {
    q: 'Was ist Avento ERP und für wen ist es geeignet?',
    a: 'Avento ist eine ERP-Software, die speziell für Handwerksbetriebe in Deutschland, Österreich und der Schweiz entwickelt wurde. Sie vereint Kalkulation, Zeiterfassung, Rechnungserstellung, Projektmanagement und Materialbestellung in einer Plattform — ideal für Elektriker, SHK-Betriebe, Maler, Tischler und alle Gewerke im Bau- und Ausbaubereich.',
  },
  {
    q: 'Was ist der Conser Marktplatz?',
    a: 'Der Conser Marktplatz ist ein digitaler B2B-Marktplatz für die Baubranche mit über 2,3 Millionen Bauprodukten. Handwerker können Baustoffe, Werkzeuge und Materialien von verschiedenen Lieferanten vergleichen und direkt bestellen — nahtlos integriert in Avento ERP.',
  },
  {
    q: 'Welche KI-Tools bietet das Ökosystem?',
    a: 'Das Ökosystem umfasst mehrere KI-Module: BauDoku AI erstellt automatisch Baudokumentationen aus Fotos. SpaceAI unterstützt bei der Gartengestaltung mit KI-Visualisierung. BuchBalance automatisiert die Buchhaltung mit KI-Belegerkennung und USt-Voranmeldung. Alle Module sind eigenständig nutzbar und in Avento integrierbar.',
  },
  {
    q: 'Wie unterscheidet sich Avento von anderen ERP-Systemen?',
    a: 'Avento wurde von Grund auf für die Baubranche entwickelt. Die Kernvorteile: Integrierter B2B-Marktplatz mit 2,3 Mio. Produkten, KI-Module für Dokumentation und Buchhaltung, Mobile-First für die Baustelle, DACH-spezifische Steuerlogik, DSGVO-konform mit EU-Hosting in Frankfurt — ein Ökosystem statt zehn Einzellösungen.',
  },
  {
    q: 'Ist Avento DSGVO-konform?',
    a: 'Ja, vollständig. Alle Daten werden auf EU-Servern in Frankfurt gespeichert. Zahlungen laufen über PCI-DSS Level 1 Partner. Die Plattform bietet Datenexport, Account-Löschung und transparente Datenschutzerklärung. Conser GmbH unterliegt deutschem Recht (HRB 22177).',
  },
  {
    q: 'Kann ich Avento auf der Baustelle nutzen?',
    a: 'Ja — Avento ist Mobile-First entwickelt und funktioniert auf jedem Smartphone und Tablet. Zeiterfassung, Fotodokumentation, Materialbestellung und Projektübersicht sind für die mobile Nutzung optimiert, auch bei schlechtem Empfang.',
  },
  {
    q: 'Was kostet Avento für Handwerksbetriebe?',
    a: 'Avento befindet sich in der Seed-Phase mit kostenloser Testphase für Pilotkunden. Das finale Modell wird ein monatliches Abo umfassen. KI-Module können als Add-ons hinzugebucht werden. Registrieren Sie sich als Pilotkunde für frühen Zugang.',
  },
  {
    q: 'Wie funktioniert BauDoku AI?',
    a: 'Fotografieren Sie den Baufortschritt, und die KI erstellt automatisch strukturierte Berichte mit Beschreibungen, Mängelanalyse und PDF-Export. Das spart durchschnittlich 2–3 Stunden pro Woche und erfüllt VOB-Anforderungen.',
  },
  {
    q: 'Welche Integrationen gibt es?',
    a: 'BuchBalance (Buchhaltung), BauDoku AI (Baudokumentation), SpaceAI (Gartenplanung), Conser Marktplatz (Materialbestellung), DATEV, Banken (PSD2) und Kalender-Systeme. Alle Module teilen ein einheitliches Login und Datensystem.',
  },
  {
    q: 'Wer steckt hinter Conser & Avento?',
    a: 'Die Conser GmbH (HRB 22177, Lübeck) mit Torben Gosch (CEO), Martin Groote (CTO) und Paul Bockting (Head of Design). Sitz in Deutschland, entwickelt ausschließlich für den DACH-Markt. Aktuell in der Seed-Phase — offen für Investoren und Produktionspartner.',
  },
]

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--bg)' }}>
      <div className="public-container">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand)' }}>
            Häufige Fragen
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Alles, was Sie wissen müssen
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Von Funktionen über Datenschutz bis zur Preisgestaltung — hier finden Sie Antworten auf die wichtigsten Fragen zu Avento ERP und dem Conser Ökosystem.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {FAQ_DATA.map((faq, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i} className="border-b" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold pr-4" style={{ color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform duration-200"
                    style={{
                      color: 'var(--text-tertiary)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p className="text-sm pb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
