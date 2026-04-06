import { Zap, TrendingUp, Target, ArrowRight } from 'lucide-react'
import { PhoneMockup, LaptopMockup } from '../../components/showcase/DeviceMockup'
import spaceAiLogo from '../../assets/SpaceAI.png'
import bauDokuLogo from '../../assets/BauDokuAI.png'
const conserLogo = '/conser.PNG'
import conserShopImg from '../../assets/conser-shop.webp'

export default function PartnerVision() {
  return (
    <div className="max-w-5xl mx-auto">

      {/* ── HEADER ── */}
      <div className="mb-8 animate-fade-up">
        <p className="label-overline mb-2">Vision & Mission</p>
        <h1 className="text-display-md mb-3" style={{ color: 'var(--text-primary)' }}>
          Warum wir Avento & Conser bauen
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
          Die Baubranche ist die letzte große Branche Europas, die noch nicht digitalisiert ist.
        </p>
      </div>

      {/* ── HERO STATEMENT ── */}
      <div className="card overflow-hidden mb-8 animate-fade-up delay-1">
        <div className="relative px-5 py-8 md:px-12 md:py-16 text-center"
          style={{ background: 'linear-gradient(135deg, #041E1F 0%, #063D3E 40%, #0A5C5E 100%)' }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
          <p className="text-display-md text-white mb-4" style={{ maxWidth: 580, margin: '0 auto' }}>
            73% aller Handwerksbetriebe arbeiten noch mit Excel, Papier und Fax.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 440, margin: '0 auto' }}>
            Es gibt kein integriertes System, das Kalkulation, Bestellung und Abrechnung verbindet. Bis jetzt.
          </p>
        </div>
      </div>

      {/* ── THE PROBLEM ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up delay-2">
        <div className="card p-6 border-left-danger">
          <p className="label-tag mb-4" style={{ color: 'var(--danger)' }}>PROBLEM FÜR HANDWERKER</p>
          <ul className="space-y-3">
            {[
              'Medienbrüche zwischen Angebot, Bestellung und Rechnung',
              'Manuelle Bestellungen per Telefon, Fax oder E-Mail',
              'Keine Transparenz bei Preisen und Lieferzeiten',
              'Keine Software, die zu ihrem Alltag passt',
            ].map(t => (
              <li key={t} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                  style={{ background: 'var(--danger-dim)', color: 'var(--danger)' }}>!</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6" style={{ borderLeft: '3px solid var(--warning)' }}>
          <p className="label-tag mb-4" style={{ color: 'var(--warning)' }}>PROBLEM FÜR LIEFERANTEN</p>
          <ul className="space-y-3">
            {[
              'Kein digitaler Kanal zu 95% der Handwerker',
              'Hohe Vertriebskosten für Kundenakquise',
              'Bestellungen per Fax und Telefon — fehleranfällig',
              'Keine Daten über Kundenbedürfnisse und Trends',
            ].map(t => (
              <li key={t} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                  style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>!</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── THE SOLUTION ── */}
      <div className="mb-8 animate-fade-up delay-3">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--brand)' }}>DIE LÖSUNG</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card overflow-hidden">
            <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}>A</span>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Avento ERP</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--brand)' }}>Das Steckenpferd — der Kundenbringer</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Integrierte Betriebssoftware für Handwerker: Controlling, Buchhaltung, Angebote, Team-Steuerung.
                Handwerker nutzen Avento täglich — und bestellen Material direkt aus dem Projekt heraus.
              </p>
            </div>
            <div className="p-4 md:p-6 flex justify-center" style={{ background: 'var(--surface2)' }}>
              <LaptopMockup
                placeholderIcon="📊"
                placeholderText="Avento ERP Dashboard"
                gradient="linear-gradient(145deg, #041E1F 0%, #063D3E 100%)"
              />
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>C</span>
                <div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Der Umsatztreiber — der große Revenue</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                B2B-Marktplatz mit 12,8M Produkten, direkt ins ERP integriert. 1-Click-Bestellung,
                automatische Preisvergleiche, Lieferzeiten in Echtzeit. Ihr Katalog, unsere Kunden.
              </p>
            </div>
            <div className="p-4 md:p-6 flex justify-center" style={{ background: 'var(--surface2)' }}>
              <LaptopMockup
                src={conserShopImg}
                alt="Conser Marktplatz"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── KI-MODULE ── */}
      <div className="mb-8 animate-fade-up delay-3">
        <div className="flex items-center gap-2 mb-4">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>BEREITS FERTIGE KI-MODULE</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="https://spaceai-henna.vercel.app" target="_blank" rel="noopener noreferrer"
            className="card p-6 group hover:translate-y-[-2px] transition-all duration-300 no-underline"
            style={{ borderLeft: '3px solid #8B5CF6' }}>
            <img src={spaceAiLogo} alt="Space AI" className="w-14 h-14 rounded-2xl object-cover mb-3" loading="lazy" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }} />
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Space AI</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              KI-Assistent, der automatisch Angebote erstellt, Materialmengen kalkuliert und Projekte plant.
              Ihre Produkte fließen direkt in die KI-Empfehlungen ein — mehr Bestellungen für Sie.
            </p>
          </a>
          <a href="https://baudoku-ai.vercel.app" target="_blank" rel="noopener noreferrer"
            className="card p-6 group hover:translate-y-[-2px] transition-all duration-300 no-underline"
            style={{ borderLeft: '3px solid #0EA5E9' }}>
            <img src={bauDokuLogo} alt="BauDoku AI" className="w-14 h-14 rounded-2xl object-cover mb-3" loading="lazy" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }} />
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>BauDoku AI</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Digitales Bautagebuch mit KI. Jeder Materialverbrauch wird automatisch dokumentiert —
              das optimiert Nachbestellungen und generiert wiederkehrende Orders bei Ihnen.
            </p>
          </a>
          <div className="card p-6 group hover:translate-y-[-2px] transition-all duration-300"
            style={{ borderLeft: '3px solid #1D5EA8' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 text-white text-2xl font-bold"
                 style={{ background: '#1D5EA8', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>B</div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>BuchBalance</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Angebundene Buchhaltung für Handwerker. Rechnungen, DATEV-Export, USt-Voranmeldung — nahtlos integriert in Avento ERP.
            </p>
          </div>
          <a href="https://www.conser-gosch.de" target="_blank" rel="noopener noreferrer"
            className="card p-6 group hover:translate-y-[-2px] transition-all duration-300 no-underline"
            style={{ borderLeft: '3px solid #C8611A' }}>
            <img src={conserLogo} alt="Conser Marktplatz" className="w-14 h-14 rounded-2xl object-cover mb-3" loading="lazy" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }} />
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              12,8 Mio. Bauprodukte. Direkt integriert in Avento ERP. Faire Großhandelspreise von 7 Premium-Herstellern.
            </p>
          </a>
        </div>
      </div>

      {/* ── MOBILE EXPERIENCE ── */}
      <div className="card p-4 md:p-8 mb-8 animate-fade-up delay-4">
        <div className="flex items-center gap-2 mb-6">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>DIE MOBILE ERFAHRUNG</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <PhoneMockup
            placeholderIcon="📋"
            placeholderText="Projekt-Übersicht"
            gradient="linear-gradient(145deg, #041E1F 0%, #063D3E 100%)"
            label="Projekte"
            sublabel="Kalkulation & Planung"
          />
          <PhoneMockup
            placeholderIcon="📦"
            placeholderText="Material bestellen"
            gradient="linear-gradient(145deg, #0A2A2B 0%, #0E7A7D 100%)"
            label="Bestellung"
            sublabel="1-Click aus dem Projekt"
          />
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="relative w-[140px] h-[287px] sm:w-[200px] sm:h-[410px]">
              <div className="absolute inset-0 rounded-2xl sm:rounded-[36px]"
                style={{ background: '#1A1A1A', boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' }} />
              <div className="absolute -right-[2px] top-[90px] w-[3px] h-[30px] rounded-r-sm" style={{ background: '#2A2A2A' }} />
              <div className="absolute -left-[2px] top-[80px] w-[3px] h-[20px] rounded-l-sm" style={{ background: '#2A2A2A' }} />
              <div className="absolute -left-[2px] top-[110px] w-[3px] h-[35px] rounded-l-sm" style={{ background: '#2A2A2A' }} />
              <div className="absolute -left-[2px] top-[155px] w-[3px] h-[35px] rounded-l-sm" style={{ background: '#2A2A2A' }} />
              <div className="absolute inset-[3px] sm:inset-[4px] rounded-[21px] sm:rounded-[32px] overflow-hidden" style={{ background: '#000' }}>
                <div className="absolute top-[7px] sm:top-[10px] left-1/2 -translate-x-1/2 w-[64px] sm:w-[90px] h-[20px] sm:h-[28px] rounded-full z-10" style={{ background: '#000' }} />
                {/* Conser Shop Mobile UI */}
                <div className="w-full h-full flex flex-col" style={{ background: '#F7F6F3' }}>
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-3 pt-[30px] sm:pt-[40px] pb-1.5"
                    style={{ background: '#063D3E' }}>
                    <span className="text-[6px] sm:text-[8px] font-bold text-white/90">conser.shop</span>
                    <span className="text-[6px] sm:text-[8px] text-white/50">🛒 3</span>
                  </div>
                  {/* Search */}
                  <div className="mx-1.5 sm:mx-2 mt-1.5 sm:mt-2 px-2 py-1 sm:py-1.5 rounded-md"
                    style={{ background: '#EBEBEA', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span className="text-[5px] sm:text-[7px]" style={{ color: '#8A8A85' }}>🔍 Produkt suchen...</span>
                  </div>
                  {/* Products */}
                  <div className="flex-1 px-1.5 sm:px-2 pt-1.5 sm:pt-2 flex flex-col gap-1 sm:gap-1.5 overflow-hidden">
                    {[
                      { name: 'Kupferrohr 15mm', price: '€12,49', color: '#063D3E' },
                      { name: 'Flex-Schlauch DN20', price: '€8,90', color: '#D4662A' },
                      { name: 'Fitting T-Stück 3/4"', price: '€3,20', color: '#063D3E' },
                      { name: 'Dichtungsring Set', price: '€5,60', color: '#D4662A' },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-md"
                        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-sm shrink-0 flex items-center justify-center"
                          style={{ background: `${p.color}10` }}>
                          <span className="text-[6px] sm:text-[8px]">📦</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[5px] sm:text-[7px] font-semibold truncate" style={{ color: '#111' }}>{p.name}</p>
                          <p className="text-[5px] sm:text-[6px] font-bold" style={{ color: '#063D3E' }}>{p.price}</p>
                        </div>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: '#C8611A' }}>
                          <span className="text-[4px] sm:text-[5px] text-white font-bold">+</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Bottom bar */}
                  <div className="px-1.5 sm:px-2 py-1.5 sm:py-2 flex items-center justify-between"
                    style={{ background: '#063D3E' }}>
                    <span className="text-[5px] sm:text-[7px] text-white/70">3 Artikel</span>
                    <span className="text-[6px] sm:text-[8px] font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ background: '#C8611A' }}>Bestellen →</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[6px] sm:bottom-[8px] left-1/2 -translate-x-1/2 w-[70px] sm:w-[100px] h-[3px] sm:h-[4px] rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Conser Shop</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>12,8M Produkte</p>
            </div>
          </div>
          <PhoneMockup
            placeholderIcon="📊"
            placeholderText="Bautagebuch"
            gradient="linear-gradient(145deg, #0A1628 0%, #0EA5E9 100%)"
            label="BauDoku AI"
            sublabel="Automatische Doku"
          />
          <PhoneMockup
            placeholderIcon="🤖"
            placeholderText="KI-Assistent"
            gradient="linear-gradient(145deg, #1A0A2E 0%, #8B5CF6 100%)"
            label="Space AI"
            sublabel="Angebote & Kalkulation"
          />
        </div>
        <p className="text-center text-xs mt-6 font-semibold" style={{ color: 'var(--brand)' }}>
          5 Module, 1 App — Handwerker bestellen Material direkt von der Baustelle. 1-Click an Sie als Partner.
        </p>
      </div>

      {/* ── ECOSYSTEM FLOW ── */}
      <div className="card p-4 md:p-8 mb-8 animate-fade-up delay-4">
        <div className="flex items-center gap-2 mb-6">
          <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>DER BESTELLFLOW</p>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: '🔨', title: 'Handwerker', desc: 'Erstellt Projekt in Avento ERP', color: 'var(--brand)' },
            { icon: '📊', title: 'Avento ERP', desc: 'Erkennt Material-Bedarf automatisch', color: 'var(--brand)' },
            { icon: '🏪', title: 'Conser', desc: 'Matched beste Produkte & Preise', color: 'var(--accent)' },
            { icon: '🏭', title: 'Sie', desc: 'Erhalten die Bestellung direkt', color: '#22C55E' },
          ].map((s, i) => (
            <div key={s.title} className="relative">
              <div className="text-center p-5 rounded-xl group hover:translate-y-[-2px] transition-all duration-300"
                style={{ background: 'var(--surface2)', border: `1px solid var(--border)` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl transition-transform group-hover:scale-110"
                  style={{ background: `${s.color}12` }}>
                  {s.icon}
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full items-center justify-center"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <ArrowRight size={10} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MARKET NUMBERS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up delay-4">
        {[
          { icon: Target, value: '1 Mio.+', label: 'Handwerksbetriebe', sub: 'DACH-Region (ZDH 2024)', color: 'var(--brand)' },
          { icon: TrendingUp, value: '€770 Mrd.', label: 'Umsatz Handwerk', sub: 'Deutschland 2024 (ZDH)', color: 'var(--accent)' },
          { icon: Zap, value: '<10%', label: 'Digitalisiert', sub: 'Riesiges Potenzial', color: '#22C55E' },
        ].map(({ icon: Icon, value, label, sub, color }) => (
          <div key={label} className="card p-6 text-center group hover:translate-y-[-2px] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: `${color}12` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-metric-lg mb-1 transition-transform duration-300 group-hover:scale-105" style={{ color }}>{value}</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
