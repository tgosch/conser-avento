import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

export default function VideoSection() {
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    setPlaying(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => setError(true))
    }
  }

  // Don't render section if video fails
  if (error) return null

  return (
    <section id="video" className="py-28 md:py-36" style={{ background: 'var(--bg)' }}>
      <div className="public-container">
        <ScrollReveal className="text-center mb-14">
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
          }}>
            Sehen, wie es funktioniert.
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>

              <video
                ref={videoRef}
                muted
                playsInline
                loop
                preload="metadata"
                onError={() => setError(true)}
                className="w-full block"
                style={{ aspectRatio: '16/9', objectFit: 'cover' }}
              >
                <source src="/Haupt.video.mp4" type="video/mp4" />
              </video>

              {/* Play overlay — nur wenn nicht gestartet */}
              {!playing && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                  onClick={handlePlay}
                  whileHover={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                    whileHover={{ scale: 1.08 }}
                  >
                    <Play size={24} style={{ color: 'white', marginLeft: 3 }} />
                  </motion.div>
                </motion.div>
              )}

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
