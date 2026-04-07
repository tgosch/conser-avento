import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Player } from '@remotion/player'
import { GewerkeWheel } from '../../remotion/animations'
import ScrollReveal from './ScrollReveal'

const benefits = [
  { title: 'Projektübersicht über alle Gewerke', desc: 'Alle Kosten, Zeitpläne und Fortschritte auf einen Blick. Ein Dashboard pro Baustelle.' },
  { title: 'Automatische Dokumentation', desc: 'Bautagebuch, Protokolle und Abnahmen — digital, lückenlos und rechtssicher.' },
  { title: 'Angebotsvergleich direkt im System', desc: 'Vergleiche Handwerker-Angebote transparent. Kosten aufgeschlüsselt nach Gewerk und Position.' },
  { title: 'Digitale Aufmaß-Erfassung', desc: 'Automatische Massen-Berechnung, KI-gestützt. Manuelle Korrekturen jederzeit möglich.' },
  { title: 'Multi-Projekt-Management', desc: 'Mehrere Baustellen gleichzeitig. Jedes Projekt hat sein eigenes Dashboard, Budget und Team.' },
  { title: 'Subunternehmer-Management', desc: 'Beauftrage, tracke und rechne Subunternehmer ab. Automatische Dokumentation und Freigabe-Workflows.' },
]

const gewerke = [
  'Sanitär', 'Heizung', 'Elektro', 'Trockenbau', 'Maler',
  'Fliesenleger', 'Dachdecker', 'Zimmerer', 'Estrich', 'Tiefbau',
  'GaLa-Bau', 'Metallbau', 'Schreiner', 'Klempner',
]

export default function ArchitectSection() {
  return (
    <section className="py-28 md:py-36" style={{ background: 'var(--surface)' }}>
      <div className="public-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
          {/* Content */}
          <div>
            <ScrollReveal className="mb-10 md:mb-12">
              <p className="text-xs uppercase tracking-widest mb-5"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                Für Architekten & Planer
              </p>
              <h2 style={{
                fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}>
                Weniger Verwaltung.<br />
                Mehr Gestaltung.
              </h2>
              <p className="text-sm md:text-base mt-5 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                Architekten und Planer verlieren wertvolle Stunden mit Koordination und Dokumentation. Avento automatisiert das.
              </p>
            </ScrollReveal>

            <div className="space-y-5 md:space-y-6">
              {benefits.map((b, i) => (
                <ScrollReveal key={b.title} delay={i * 0.04}>
                  <div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {b.title}
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {b.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="mt-8 md:mt-10">
              <Link to="/kontakt"
                className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
                style={{ color: 'var(--brand)' }}>
                Testzugang anfragen <ArrowRight size={14} />
              </Link>
            </ScrollReveal>
          </div>

          {/* Remotion Gewerke Wheel — hidden on mobile */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '1', background: '#fafaf9' }}>
                <Player
                  component={() => <GewerkeWheel items={gewerke} />}
                  compositionWidth={500}
                  compositionHeight={500}
                  durationInFrames={600}
                  fps={30}
                  loop
                  autoPlay
                  style={{ width: '100%', height: '100%' }}
                  controls={false}
                />
              </div>
              <p className="text-center text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>
                14+ Gewerke — ein System
              </p>
            </div>
          </div>

          {/* Mobile: Gewerke as text */}
          <div className="lg:hidden">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-widest mb-4"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                Gewerkübergreifend
              </p>
              <div className="flex flex-wrap gap-2">
                {gewerke.map(g => (
                  <span key={g} className="text-xs px-3 py-1.5 rounded-full"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    {g}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
