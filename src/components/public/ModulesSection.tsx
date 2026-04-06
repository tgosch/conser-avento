import { ArrowUpRight } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import spaceAI from '../../assets/SpaceAI.png'
import bauDoku from '../../assets/BauDokuAI.png'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'

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
            Zwei Produkte, die zusammenarbeiten. Avento ERP mit integrierten KI-Modulen — und der Conser Marktplatz für das Material.
          </p>
        </ScrollReveal>

        {/* Two main products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
          {/* Avento ERP */}
          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden h-full" style={{ background: '#063D3E' }}>
              <div className="p-5 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <img src={aventoLogo} alt="Avento" className="w-10 h-10 rounded-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Avento ERP</h3>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Handwerker-Betriebssystem</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Kalkulation, Zeiterfassung, Rechnungen, Controlling, Team-Steuerung und Mobile App. Das komplette Betriebssystem für jeden Handwerksbetrieb — gewerkübergreifend und offline-fähig.
                </p>

                {/* Sub-modules: SpaceAI + BauDoku */}
                <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Integrierte KI-Module
                </p>
                <div className="flex flex-col gap-3">
                  <a href="https://spaceai-henna.vercel.app" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <img src={spaceAI} alt="SpaceAI" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">SpaceAI</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80' }}>Live</span>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>KI-Gartengestaltung — Foto hochladen, Umgestaltung erhalten</p>
                    </div>
                    <ArrowUpRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </a>

                  <a href="https://baudoku-ai.vercel.app" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <img src={bauDoku} alt="BauDoku AI" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">BauDoku AI</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80' }}>Live</span>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>Automatische Baudokumentation — Fotos, Berichte, Protokolle</p>
                    </div>
                    <ArrowUpRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </a>

                  <div className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                         style={{ background: '#1D5EA8' }}>B</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">BuchBalance</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80' }}>Live</span>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>Angebundene Buchhaltung — Rechnungen, DATEV, USt</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-6">
                  {['Kalkulation', 'Zeiterfassung', 'Rechnungen', 'Controlling', 'Team', 'Mobile'].map(t => (
                    <span key={t} className="text-[10px] px-2 py-1 rounded-md"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Conser Marktplatz */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl overflow-hidden h-full" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="p-5 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <img src={conserLogo} alt="Conser" className="w-10 h-10 rounded-xl" />
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</h3>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>B2B-Baustoff-Plattform</p>
                  </div>
                  <a href="https://www.conser-gosch.de" target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-[10px] font-medium px-2.5 py-1 rounded-full transition-all hover:opacity-80"
                    style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>
                    Live <ArrowUpRight size={10} className="inline ml-0.5" />
                  </a>
                </div>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                  12,8 Mio. Bauprodukte von 7 Premium-Herstellern. Faire Großhandelspreise, 24h Lieferung direkt auf die Baustelle. Nahtlos integriert in Avento ERP — 1-Click-Bestellung aus jedem Projekt.
                </p>

                {/* Highlights */}
                <div className="space-y-4">
                  {[
                    { label: '12,8 Mio.', sub: 'Produkte im Sortiment' },
                    { label: '7', sub: 'aktuell · Ziel: 25' },
                    { label: '24h', sub: 'Lieferung auf die Baustelle' },
                  ].map(h => (
                    <div key={h.label} className="flex items-baseline gap-3">
                      <span className="text-lg font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{h.label}</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{h.sub}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-6">
                  {['B2B', 'Rechnung', 'SEPA', 'Express', 'KI-Suche', 'ERP-Link'].map(t => (
                    <span key={t} className="text-[10px] px-2 py-1 rounded-md"
                      style={{ background: 'rgba(200,97,26,0.06)', color: 'var(--accent)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Connection line */}
        <ScrollReveal className="flex justify-center">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Nahtlose Integration · Ein Login · Eine Datenbasis
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
