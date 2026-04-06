import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

function AnimatedNumber({ target, suffix = '', prefix = '', label, color }: {
  target: number; suffix?: string; prefix?: string; label: string; color: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target])

  return (
    <div ref={ref} className="text-center p-6 md:p-8">
      <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color, fontFamily: 'var(--font-mono)' }}>
        {prefix}{value.toLocaleString('de-DE')}{suffix}
      </p>
      <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
    </div>
  )
}

export default function CtaSection() {
  return (
    <section className="py-28 md:py-36" style={{ background: '#063D3E' }}>
      <div className="public-container">
        {/* Metrics */}
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <AnimatedNumber target={2300000} label="Produkte" color="#C8611A" />
            <AnimatedNumber target={14} label="Gewerke" color="white" />
            <AnimatedNumber target={7} label="Hersteller" color="#C8611A" />
          </div>
        </ScrollReveal>

        <ScrollReveal className="text-center">
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
