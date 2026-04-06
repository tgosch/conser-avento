import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Volume2, VolumeX } from 'lucide-react'
import conserShop from '../../assets/conser-shop.webp'

const ease = [0.25, 1, 0.5, 1] as [number, number, number, number]

export default function HeroSection() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const imgY = useTransform(scrollYProgress, [0, 0.5], [0, -50])
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    setMuted(!muted)
    if (videoRef.current) videoRef.current.muted = !muted
  }

  return (
    <section className="relative overflow-hidden" style={{ background: '#063D3E' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(6,61,62,0.4) 0%, rgba(6,61,62,0.85) 100%)' }} />

      <motion.div style={{ opacity }} className="relative z-10">
        <div className="public-container pt-32 pb-10 md:pt-36 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">

            {/* Left: Text — 3 Spalten */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease }}
                style={{
                  fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  color: 'white',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                Das Ökosystem für die Baubranche.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease }}
                className="text-base md:text-lg mt-6 mb-5"
                style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 460, lineHeight: 1.65 }}
              >
                Von der Kalkulation bis zur Materialbestellung. Von der Zeiterfassung bis zur Rechnung. Für Handwerker, Architekten und alle, die bauen.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease }}
                className="text-xs md:text-sm mb-8"
                style={{ color: 'var(--accent)', opacity: 0.9 }}
              >
                Gewerkübergreifend · 2,3 Mio. Produkte · DSGVO-konform · Made in Germany
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
                className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
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

            {/* Right: Video — 2 Spalten, sticky */}
            <motion.div
              className="hidden lg:block lg:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease }}
            >
              <div className="sticky top-24 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden w-56 xl:w-64"
                  style={{
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    opacity: 0.55,
                    filter: 'brightness(0.85)',
                  }}>
                  {/* Clip bottom 12% to crop CapCut watermark */}
                  <div style={{ overflow: 'hidden', aspectRatio: '9/14' }}>
                    <video
                      ref={videoRef}
                      src="/werbevideo1.mov"
                      autoPlay
                      loop
                      muted={muted}
                      playsInline
                      className="w-full block"
                      style={{ aspectRatio: '9/16', objectFit: 'cover' }}
                    />
                  </div>
                  {/* Mute toggle */}
                  <button onClick={toggleMute}
                    className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
                    {muted ? <VolumeX size={12} color="white" /> : <Volume2 size={12} color="white" />}
                  </button>
                  {/* Soft edge fade at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(6,61,62,0.6))' }} />
                </div>
              </div>
            </motion.div>
          </div>
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
