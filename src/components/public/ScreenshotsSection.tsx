import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import conserScreen from '../../assets/conser-checkout-desktop.png'
import conserShop from '../../assets/conser-shop.webp'
import spaceAI from '../../assets/SpaceAI.png'
import bauDoku from '../../assets/BauDokuAI.png'

const items = [
  { id: 'checkout', title: 'Conser Checkout', desc: 'Nahtloser B2B-Checkout mit Rechnungskauf und Sammelrechnung.', image: conserScreen },
  { id: 'shop', title: 'Marktplatz', desc: '12,8 Mio. Bauprodukte — das größte Sortiment der DACH-Region.', image: conserShop },
  { id: 'spaceai', title: 'SpaceAI', desc: 'KI-gestützte Gartengestaltung — eines unserer Innovation-Tools.', image: spaceAI },
  { id: 'baudoku', title: 'BauDoku AI', desc: 'Automatische Baudokumentation mit KI — Fotos, Berichte, Protokolle.', image: bauDoku },
]

export default function ScreenshotsSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-28 md:py-36" style={{ background: 'var(--surface)' }}>
      <div className="public-container">
        <ScrollReveal className="text-center mb-6">
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
          }}>
            Echte Software. Keine Mockups.
          </h2>
        </ScrollReveal>
        <ScrollReveal className="text-center mb-14">
          <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Das ist die Software, die du nutzen wirst. Weitere Tools auf Anfrage testbar.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-5xl mx-auto">
            {/* Tabs — scrollable on mobile */}
            <div className="flex gap-2 md:gap-4 md:justify-center mb-8 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0">
              {items.map((s, i) => (
                <button key={s.id} onClick={() => setActive(i)}
                  className="text-xs md:text-sm font-medium transition-all pb-2 whitespace-nowrap shrink-0"
                  style={{
                    color: active === i ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    borderBottom: active === i ? '2px solid #063D3E' : '2px solid transparent',
                  }}>
                  {s.title}
                </button>
              ))}
            </div>

            {/* Image */}
            <div className="rounded-xl md:rounded-2xl overflow-hidden" style={{ background: '#f0f0f0' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={items[active].image}
                  alt={items[active].title}
                  className="w-full block"
                  loading="lazy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
            </div>

            {/* Caption */}
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                className="text-center text-sm mt-5"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {items[active].desc}
              </motion.p>
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
