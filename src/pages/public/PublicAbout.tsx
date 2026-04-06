import { Link } from 'react-router-dom'
import { ArrowRight, Target, Lightbulb, Shield, TrendingUp, Globe, Award } from 'lucide-react'
import ScrollReveal from '../../components/public/ScrollReveal'

const values = [
  { icon: Target, title: 'Mission', desc: 'Die Baubranche vollständig digitalisieren — angefangen bei den Handwerkern, die sie tragen.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'KI-gestützte Prozesse, automatisierte Workflows und intelligente Materialbestellung.' },
  { icon: Shield, title: 'Vertrauen', desc: 'DSGVO-konform, Made in Germany, höchste Sicherheitsstandards. Daten bleiben in der EU.' },
  { icon: TrendingUp, title: 'Wachstum', desc: 'Skalierbare Architektur, bewährtes Geschäftsmodell. Gebaut für die DACH-Region.' },
  { icon: Globe, title: 'DACH-Fokus', desc: '1,3 Millionen Handwerksbetriebe in Deutschland, Österreich und der Schweiz.' },
  { icon: Award, title: 'Qualität', desc: 'Jede Zeile Code wird auditiert. Jedes Feature mit echten Handwerkern getestet.' },
]

export default function PublicAbout() {
  return (
    <div className="pt-28 md:pt-36">
      {/* Hero */}
      <section className="public-container pb-20 md:pb-28">
        <ScrollReveal>
          <p className="label-overline mb-4" style={{ color: 'var(--brand)' }}>Über uns</p>
          <h1 className="mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 400, maxWidth: 500 }}>
            Wir bauen die Zukunft der Baubranche.
          </h1>
          <p className="text-base max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Ein Team aus Technologen, Designern und Branchenexperten mit einer
            gemeinsamen Vision: Handwerkern die Werkzeuge geben, die sie verdienen.
          </p>
        </ScrollReveal>
      </section>

      {/* Vision */}
      <section className="py-20 md:py-28" style={{ background: 'var(--surface)' }}>
        <div className="public-container">
          <ScrollReveal className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="mb-6"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 400, lineHeight: 1.3 }}>
              &ldquo;Die Baubranche braucht keine weitere App — sie braucht ein Ökosystem.&rdquo;
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Handwerker kämpfen täglich mit dutzenden Insellösungen. Wir ändern
              das — mit Avento ERP und Conser Marktplatz als integriertem Ökosystem.
            </p>
          </ScrollReveal>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px max-w-4xl mx-auto rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--border)' }}>
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.05}>
                <div className="p-7 h-full"
                  style={{ background: 'var(--bg)', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', borderRight: (i % 3 !== 2) ? '1px solid var(--border)' : 'none' }}>
                  <v.icon size={18} className="mb-3" style={{ color: 'var(--text-tertiary)' }} />
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="py-20 md:py-28" style={{ background: 'var(--bg)' }}>
        <div className="public-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
            {[
              { label: 'Firmensitz', value: 'Deutschland', sub: 'Conser Gosch UG (haftungsbeschränkt)' },
              { label: 'Handelsregister', value: 'HRB 22177', sub: 'USt-IdNr. DE458507310' },
              { label: 'Gründung', value: '2025', sub: 'Seed-Runde Mai 2026' },
            ].map((info, i) => (
              <ScrollReveal key={info.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--text-tertiary)' }}>{info.label}</p>
                  <p className="text-lg font-semibold mb-1"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{info.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{info.sub}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28" style={{ background: 'var(--surface)' }}>
        <div className="public-container text-center">
          <ScrollReveal>
            <h2 className="mb-6"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 400 }}>
              Wollen Sie Teil der Geschichte sein?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/kontakt"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--brand)', color: 'white' }}>
                Kontakt aufnehmen <ArrowRight size={15} />
              </Link>
              <Link to="/produkte"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                Produkte ansehen
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
