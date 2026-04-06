import { motion } from 'framer-motion'
import { Player } from '@remotion/player'
import { OrbitalSystem } from '../../remotion/animations'
import { ArrowUpRight, Sparkles, Camera, ShoppingCart, Wrench } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import spaceAI from '../../assets/SpaceAI.png'
import bauDoku from '../../assets/BauDokuAI.png'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'

const modules = [
  {
    name: 'SpaceAI',
    subtitle: 'KI-Gartengestaltung',
    desc: 'Lade ein Foto deines Gartens hoch und erhalte fotorealistische Umgestaltungsvorschläge in Sekunden. KI-Analyse, Grundriss-Editor, Inpainting, 3D-Vorschau und PDF-Export — alles in einer App.',
    image: spaceAI,
    color: '#8B5CF6',
    url: 'https://spaceai-henna.vercel.app',
    status: 'Live — Testbar',
    tags: ['KI-Analyse', 'Foto-Upload', '3D-Vorschau', 'PDF-Export'],
    icon: Sparkles,
  },
  {
    name: 'BauDoku AI',
    subtitle: 'Automatische Baudokumentation',
    desc: 'Fotografiere die Baustelle und BauDoku AI erstellt automatisch Berichte, Protokolle und Dokumentationen. Rechtssicher, lückenlos und zeitsparend — für Handwerker und Architekten.',
    image: bauDoku,
    color: '#0EA5E9',
    url: 'https://baudoku-ai.vercel.app',
    status: 'Live — Testbar',
    tags: ['Foto-Protokolle', 'Auto-Berichte', 'Rechtssicher', 'Offline'],
    icon: Camera,
  },
  {
    name: 'Conser Marktplatz',
    subtitle: 'B2B-Baustoff-Plattform',
    desc: '2,3 Mio. Bauprodukte von 7 Premium-Herstellern. Faire Großhandelspreise, 24h Lieferung direkt auf die Baustelle. Nahtlos integriert in Avento ERP — 1-Click-Bestellung aus jedem Projekt.',
    image: null,
    logo: conserLogo,
    color: '#C8611A',
    url: 'https://www.conser-gosch.de',
    status: 'Live',
    tags: ['2,3M Produkte', '7 Hersteller', '24h Lieferung', 'ERP-Link'],
    icon: ShoppingCart,
  },
  {
    name: 'Avento ERP',
    subtitle: 'Handwerker-Betriebssystem',
    desc: 'Kalkulation, Zeiterfassung, Rechnungen, Controlling, Team-Steuerung und Mobile App. Das komplette Betriebssystem für jeden Handwerksbetrieb — gewerkübergreifend und offline-fähig.',
    image: null,
    logo: aventoLogo,
    color: '#063D3E',
    url: null,
    status: 'In Entwicklung',
    tags: ['Kalkulation', 'Zeiterfassung', 'Rechnungen', 'Mobile'],
    icon: Wrench,
  },
]

export default function ModulesSection() {
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
            Das Ökosystem.
          </h2>
        </ScrollReveal>
        <ScrollReveal className="text-center mb-16">
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Vier Module, die zusammenarbeiten. Jedes einzeln stark — zusammen unschlagbar. Einige kannst du schon heute testen.
          </p>
        </ScrollReveal>

        {/* Remotion Orbital — Desktop */}
        <ScrollReveal className="mb-16 hidden md:block">
          <div className="max-w-md mx-auto rounded-2xl overflow-hidden" style={{ aspectRatio: '1', background: '#fafaf9' }}>
            <Player
              component={OrbitalSystem}
              compositionWidth={600}
              compositionHeight={600}
              durationInFrames={600}
              fps={30}
              loop
              autoPlay
              style={{ width: '100%', height: '100%' }}
              controls={false}
            />
          </div>
        </ScrollReveal>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {modules.map((m, i) => (
            <ScrollReveal key={m.name} delay={i * 0.08}>
              <motion.div
                className="relative p-6 md:p-8 rounded-2xl h-full"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-6 right-6 h-px" style={{ background: m.color }} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-12 h-12 rounded-xl object-cover"
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    ) : m.logo ? (
                      <img src={m.logo} alt={m.name} className="w-12 h-12 rounded-xl"
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: m.color }}>
                        <m.icon size={20} color="white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{m.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      background: m.status.includes('Live') ? 'rgba(52,199,89,0.1)' : 'rgba(0,0,0,0.04)',
                      color: m.status.includes('Live') ? '#34C759' : 'var(--text-tertiary)',
                    }}>
                    {m.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {m.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-1 rounded-md font-medium"
                      style={{ background: `${m.color}10`, color: m.color }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Link */}
                {m.url && (
                  <a href={m.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium transition-all hover:gap-2.5"
                    style={{ color: m.color }}>
                    Jetzt testen <ArrowUpRight size={12} />
                  </a>
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
