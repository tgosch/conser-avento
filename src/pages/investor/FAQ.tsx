import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

// ── FAQ Data ─────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    category: 'Investment',
    color: '#063D3E',
    icon: '💰',
    questions: [
      {
        q: 'Wie ist die aktuelle Bewertung?',
        a: 'Pre-Money Bewertung von €13,5M bei einer Seed-Runde von €1,5M (Post-Money €15M). Basierend auf vergleichbaren B2B SaaS-Unternehmen im Construction-Tech Bereich mit ähnlichem Traction-Level und Marktpotenzial.',
      },
      {
        q: 'Wie wird Verwässerung gehandhabt?',
        a: 'Die Seed-Runde ist auf ca. 10% Verwässerung ausgelegt. Weitere Runden (Series A: Q2 2027, 20–30M€) sind geplant. Frühe Investoren profitieren von Anti-Dilution-Schutzklauseln und der größten Wertsteigerung zwischen Seed und Series A.',
      },
      {
        q: 'Was ist die Exit-Strategie?',
        a: 'Primär: Trade Sale an einen großen Bau-Software-Anbieter (Nemetschek, Procore, Autodesk) oder strategischen Industrieinvestor. Sekundär: IPO ab €500M+ Bewertung. Zeithorizont: 5–7 Jahre. Construction-Tech ist aktuell einer der aktivsten M&A-Sektoren in Europa.',
      },
    ],
  },
  {
    category: 'Produkt',
    color: '#D4662A',
    icon: '⚡',
    questions: [
      {
        q: 'Wie ist der aktuelle MVP-Status?',
        a: 'Zwei KI-Module sind bereits fertig und live: Space AI (KI-Assistent für Angebote und Kalkulation) und BauDoku AI (digitales Bautagebuch). Avento ERP Core und der Conser Marktplatz starten nach Funding in Phase 1 (Q3 2026) mit 9 Produktionspartnern und 2,3M Produkten.',
      },
      {
        q: 'Was ist das Revenue-Modell?',
        a: 'Drei Säulen: (1) Avento SaaS-Subscriptions — €39 bis €199 pro Monat pro Betrieb, je nach Paket. (2) Conser Marktplatz-Provisionen — 3–8% pro Transaktion. (3) Premium-Features und Add-ons. Conser ist der große Umsatztreiber, Avento bringt die Kunden.',
      },
      {
        q: 'Wie steht ihr zum Wettbewerb?',
        a: 'Kein bestehender Anbieter kombiniert ERP + Marktplatz + KI speziell für die Baubranche. Lexoffice ist generisch (keine Bau-Features), Plancraft hat kein Marktplatz-Modell, Excel hat keine Zukunft. Avento + Conser ist der einzige integrierte Ansatz — Details auf der Wettbewerb-Seite.',
      },
    ],
  },
  {
    category: 'Team',
    color: '#0066FF',
    icon: '👥',
    questions: [
      {
        q: 'Wie wird das Team nach dem Funding aufgebaut?',
        a: 'Aktuell: 3 Gründer (CEO, CTO, CDO) + strategischer Entwicklungspartner (Code Ara GmbH, 10% Equity). Nach Funding: 3 Backend-Entwickler, 2 Frontend-Entwickler, 1 DevOps innerhalb von 6 Monaten. 45% des Seed-Kapitals fließen direkt in Engineering und Produktentwicklung.',
      },
      {
        q: 'Ist DSGVO-Konformität sichergestellt?',
        a: 'Ja, vollständig. Alle Server stehen in Deutschland (Frankfurt). ISO 27001-konforme Infrastruktur. Auftragsverarbeitungsverträge mit allen Partnern. Privacy by Design in der gesamten Architektur. Treuhänder-Konten und 3-Fach-Verifizierung bei Transaktionen.',
      },
    ],
  },
  {
    category: 'Zeitplan',
    color: '#34C759',
    icon: '📅',
    questions: [
      {
        q: 'Was sind die nächsten Meilensteine?',
        a: 'Phase 1 (Apr–Jun 2026): Conser MVP mit 2,3M Produkten und 9 Partnern live. Phase 2 (Jul–Sep 2026): Conser Launch, 1.000 Kunden, 5M€ GMV. Phase 3 (Okt 2026–Feb 2027): Avento MVP mit allen Core-Features. Phase 4 (Mär–Jun 2027): Public Beta Launch, 5.000 Kunden, Series A.',
      },
      {
        q: 'Wann wird der Break-Even erreicht?',
        a: 'Geplant für Q2 2027. Conser Marktplatz generiert ab dem ersten Tag Provisionseinnahmen (3–8% auf jede Transaktion). Avento SaaS-Subscriptions kommen ab Phase 2 dazu. Bei 5.000 Kunden und 2,5M€ Revenue ist der Break-Even erreicht.',
      },
    ],
  },
]

export default function InvestorFAQ() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (key: string) => setExpanded(expanded === key ? null : key)

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">

      <div className="mb-8">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>FAQ</p>
        <h1 className="text-display-md mb-2" style={{ color: 'var(--text-primary)' }}>
          Häufig gestellte Fragen
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: 480 }}>
          Die wichtigsten Fragen von Investoren — transparent beantwortet.
          Für alles Weitere: Chat mit Torben.
        </p>
      </div>

      <div className="space-y-8">
        {FAQ_DATA.map((cat, ci) => (
          <div key={cat.category} className={`animate-fade-up delay-${ci + 1}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                   style={{ background: `${cat.color}12` }}>{cat.icon}</div>
              <p className="label-tag" style={{ color: cat.color }}>{cat.category.toUpperCase()}</p>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <div className="space-y-2">
              {cat.questions.map((faq, qi) => {
                const key = `${ci}-${qi}`
                const isOpen = expanded === key
                return (
                  <div key={key} className="card overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-all hover:bg-[var(--surface2)]">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
                      <ChevronDown
                        size={16}
                        className="shrink-0 transition-transform duration-200"
                        style={{
                          color: 'var(--text-tertiary)',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0">
                        <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card p-5 mt-8 animate-fade-up delay-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Noch Fragen?</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Torben antwortet persönlich — meistens innerhalb von 4 Stunden.</p>
          </div>
          <a href="/investor/chat" className="btn btn-primary btn-lg shrink-0">
            Chat mit Torben
          </a>
        </div>
      </div>
    </div>
  )
}
