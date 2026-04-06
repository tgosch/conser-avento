import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Player } from '@remotion/player'
import { OrbitalSystem } from '../../remotion/animations'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'
import conserShop from '../../assets/conser-shop.webp'

const ease = [0.25, 1, 0.5, 1] as [number, number, number, number]

export default function HeroSection() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const imgY = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  return (
    <section className="relative overflow-hidden" style={{ background: '#063D3E' }}>
      {/* Remotion orbital background */}
      <div className="absolute inset-0 opacity-30 hidden md:block">
        <Player
          component={OrbitalSystem}
          compositionWidth={1920}
          compositionHeight={1080}
          durationInFrames={600}
          fps={30}
          loop
          autoPlay
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          controls={false}
        />
      </div>

      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(6,61,62,0.4) 0%, rgba(6,61,62,0.85) 100%)' }} />

      <motion.div style={{ opacity }} className="relative z-10">
        <div className="public-container pt-24 pb-10 md:pt-44 md:pb-20 text-center">
          {/* Logos — hidden on mobile (navbar already shows them) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="hidden sm:flex items-center justify-center gap-3 mb-8"
          >
            <img src={aventoLogo} alt="Avento" className="h-9 rounded-lg" />
            <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <img src={conserLogo} alt="Conser" className="h-9 rounded-lg" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="mx-auto mb-6 px-4"
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 4.75rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              maxWidth: 720,
            }}
          >
            Das Ökosystem für die Baubranche.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="text-base md:text-lg mx-auto mb-5 px-4"
            style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 500, lineHeight: 1.65 }}
          >
            Von der Kalkulation bis zur Materialbestellung. Von der Zeiterfassung bis zur Rechnung. Für Handwerker, Architekten und alle, die bauen.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="text-xs md:text-sm mb-10"
            style={{ color: 'var(--accent)', opacity: 0.9 }}
          >
            Gewerkübergreifend · 2,3 Mio. Produkte · DSGVO-konform · Made in Germany
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/kontakt"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
              style={{ background: 'white', color: 'var(--brand)' }}>
              Testzugang anfragen
            </Link>
            <Link to="/produkte"
              className="flex items-center justify-center gap-2 text-sm font-medium transition-all hover:gap-3"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              Mehr erfahren <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Product image — Marktplatz */}
      <motion.div className="relative z-10 public-container pb-0 mt-6 md:mt-0" style={{ y: imgY }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease }}
      >
        <div className="max-w-5xl mx-auto rounded-t-xl md:rounded-t-2xl overflow-hidden"
          style={{ boxShadow: '0 -20px 80px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}>
          <div className="flex items-center gap-1.5 px-3 md:px-4 py-2" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: '#FF5F57' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#FFBD2E' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: '#27C93F' }} />
            <span className="ml-3 text-[10px] font-mono hidden sm:inline" style={{ color: 'rgba(255,255,255,0.3)' }}>
              conser.shop — Marktplatz für den professionellen Bau
            </span>
          </div>
          <img src={conserShop} alt="Conser Marktplatz — B2B Baustoff-Plattform" className="w-full block" />
        </div>
      </motion.div>

      <div className="h-20 md:h-24 relative z-20" style={{ background: 'linear-gradient(to bottom, #063D3E, var(--bg))' }} />
    </section>
  )
}
