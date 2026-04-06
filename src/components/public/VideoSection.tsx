import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

export default function VideoSection() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="video" className="py-32 md:py-40" style={{ background: 'var(--bg)' }}>
      <div className="public-container">
        <ScrollReveal className="text-center mb-16">
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
          }}>
            Sehen, wie es funktioniert.
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="relative rounded-3xl overflow-hidden cursor-pointer"
              style={{
                aspectRatio: '16/9',
                background: '#0a0a0a',
              }}
              whileHover={{ scale: 1.003 }}
              transition={{ duration: 0.5 }}
              onClick={() => setPlaying(!playing)}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {!playing ? (
                  <>
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                      whileHover={{ background: 'rgba(255,255,255,0.12)' }}
                    >
                      <Play size={24} style={{ color: 'white', marginLeft: 3 }} />
                    </motion.div>
                    <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      2:30 Min.
                    </p>
                  </>
                ) : (
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Video wird geladen...
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
