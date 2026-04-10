import HeroSection from '../../components/public/HeroSection'
import VideoSection from '../../components/public/VideoSection'
import FeaturesSection from '../../components/public/FeaturesSection'
import ScreenshotsSection from '../../components/public/ScreenshotsSection'
import ModulesSection from '../../components/public/ModulesSection'
import IntegrationSection from '../../components/public/IntegrationSection'
import ArchitectSection from '../../components/public/ArchitectSection'
import FaqSection from '../../components/public/FaqSection'
import CtaSection from '../../components/public/CtaSection'

export default function PublicHome() {
  return (
    <>
      <HeroSection />
      <VideoSection />
      <FeaturesSection />
      <ScreenshotsSection />

      {/* TRUST STRIP */}
      <section className="py-12" style={{ background: 'var(--surface2)' }}>
        <div className="public-container text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-tertiary)' }}>
            BEREITS LIVE & IN NUTZUNG
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
            {[
              { name: 'Space AI', url: 'https://spaceai-henna.vercel.app' },
              { name: 'BauDoku AI', url: 'https://baudoku-ai.vercel.app' },
              { name: 'BuchBalance', url: '' },
              { name: 'Conser Shop', url: 'https://www.conser-gosch.de' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                     className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {p.name}
                  </a>
                ) : (
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>
            4 Produkte live · 12,8 Mio. Produkte im Marktplatz · 7 Partner im Onboarding
          </p>
        </div>
      </section>

      <ModulesSection />
      <IntegrationSection />
      <ArchitectSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
