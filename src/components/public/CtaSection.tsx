import { Link } from 'react-router-dom'
import { Player } from '@remotion/player'
import { MetricRing } from '../../remotion/animations'
import ScrollReveal from './ScrollReveal'

export default function CtaSection() {
  return (
    <section className="py-28 md:py-36" style={{ background: '#063D3E' }}>
      <div className="public-container">
        {/* Metric rings — responsive grid */}
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-sm md:max-w-2xl mx-auto">
            {[
              { value: 2300000, max: 3000000, label: 'Produkte', color: '#C8611A' },
              { value: 14, max: 20, label: 'Gewerke', color: 'white' },
              { value: 7, max: 10, label: 'Hersteller', color: '#C8611A' },
            ].map(m => (
              <div key={m.label} className="rounded-xl md:rounded-2xl overflow-hidden"
                style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.03)' }}>
                <Player
                  component={() => <MetricRing value={m.value} max={m.max} label={m.label} color={m.color} />}
                  compositionWidth={300}
                  compositionHeight={300}
                  durationInFrames={90}
                  fps={30}
                  autoPlay
                  style={{ width: '100%', height: '100%' }}
                  controls={false}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="text-center px-4">
          <h2 className="mx-auto mb-6" style={{
            fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
            fontFamily: 'var(--font-display)',
            color: 'white',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            maxWidth: 550,
          }}>
            Bereit, dein Handwerk zu digitalisieren?
          </h2>
          <p className="text-sm md:text-base mb-10 mx-auto" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 400 }}>
            Kostenloser Testzugang. Persönliches Onboarding. Jederzeit kündbar. Keine Kreditkarte nötig.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/kontakt"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
              style={{ background: 'white', color: '#063D3E' }}>
              Testzugang anfragen
            </Link>
            <Link to="/produkte"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
              Produkte ansehen
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
