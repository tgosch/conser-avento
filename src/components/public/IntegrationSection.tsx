import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Player } from '@remotion/player'
import { DataFlow } from '../../remotion/animations'
import ScrollReveal from './ScrollReveal'

const steps = [
  { num: '01', title: 'Ein Login, alles drin', desc: 'Avento ERP und Conser Marktplatz mit einem Account. Keine doppelte Datenpflege, keine getrennten Systeme.' },
  { num: '02', title: 'Automatisch verbunden', desc: 'Bestellst du Material im Conser Shop, wird es automatisch dem richtigen Projekt in Avento zugeordnet.' },
  { num: '03', title: 'Echtzeit-Synchronisation', desc: 'Preise, Lagerbestände und Lieferzeiten sind immer aktuell. Keine veralteten Kataloge.' },
  { num: '04', title: 'Eine Datenbasis', desc: 'Kunden, Projekte, Material, Rechnungen — alles an einem Ort. Export in DATEV, Lexoffice oder Sevdesk.' },
  { num: '05', title: 'Cloud-Native Architektur', desc: 'Arbeite von überall — Büro, Baustelle, unterwegs. 99,9% Uptime, automatische Backups.' },
  { num: '06', title: 'Enterprise-Sicherheit', desc: 'Ende-zu-Ende Verschlüsselung, DSGVO-konform, alle Daten in der EU. Rollenbasierte Zugriffsrechte.' },
]

const tools = [
  'DATEV', 'Lexoffice', 'Sevdesk', 'Stripe', 'PayPal', 'SEPA',
  'DPD', 'DHL', 'EasyPost', 'Google Calendar', 'Slack', 'Dropbox',
]

export default function IntegrationSection() {
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
            Alles verbunden. Automatisch.
          </h2>
        </ScrollReveal>
        <ScrollReveal className="text-center mb-14 md:mb-20">
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Kein Copy-Paste zwischen Tools. Kein manueller Abgleich. Ein Ökosystem, das zusammenarbeitet.
          </p>
        </ScrollReveal>

        {/* DataFlow — hidden on small mobile, visible on tablet+ */}
        <ScrollReveal className="mb-16 md:mb-20 hidden sm:block">
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden" style={{ aspectRatio: '21/9', background: '#0a0a0a' }}>
            <Player
              component={DataFlow}
              compositionWidth={1050}
              compositionHeight={450}
              durationInFrames={180}
              fps={30}
              loop
              autoPlay
              style={{ width: '100%', height: '100%' }}
              controls={false}
            />
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20">
          {steps.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 0.04}>
              <div className="flex gap-4 md:gap-8 py-6 md:py-7" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-medium shrink-0 pt-0.5"
                  style={{ color: i % 2 === 0 ? '#063D3E' : '#C8611A', fontFamily: 'var(--font-mono)', minWidth: 24 }}>
                  {s.num}
                </span>
                <div>
                  <h3 className="text-sm md:text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {s.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Integrations */}
        <ScrollReveal className="text-center">
          <p className="text-xs uppercase tracking-widest mb-5"
            style={{ color: '#063D3E', fontFamily: 'var(--font-mono)' }}>
            Integrationen
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto mb-10">
            {tools.map(t => (
              <span key={t} className="text-xs px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                {t}
              </span>
            ))}
          </div>
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
            style={{ color: '#063D3E' }}>
            Testzugang anfragen <ArrowRight size={14} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
