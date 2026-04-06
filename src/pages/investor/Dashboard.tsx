import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Update } from '../../lib/supabase'
import { ArrowRight, ChevronRight, Play } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp'
import spaceAiLogo from '../../assets/SpaceAI.png'
import bauDokuLogo from '../../assets/BauDokuAI.png'
import conserLogo from '../../assets/conser_kachel.webp'

const categoryColor: Record<string, string> = {
  general: '#6E6E73', milestone: '#063D3E', important: '#C8611A',
}
const categoryLabel: Record<string, string> = {
  general: 'Allgemein', milestone: 'Meilenstein', important: 'Wichtig',
}

const monthNames = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const currentMonth = `${monthNames[new Date().getMonth()]} ${new Date().getFullYear()}`

export default function InvestorDashboard() {
  const [updates, setUpdates] = useState<Update[]>([])

  useEffect(() => {
    supabase.from('updates').select('id,title,content,category,created_at')
      .order('created_at', { ascending: false }).limit(4)
      .then(({ data }) => { if (data) setUpdates(data as Update[]) })
  }, [])

  const { value: c75k } = useCountUp(75000, { duration: 1600 })
  const { value: c181 } = useCountUp(181, { duration: 1600 })
  const { value: c49 }  = useCountUp(49, { duration: 1600 })

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">

      {/* HERO */}
      <div className="relative rounded-[28px] overflow-hidden mb-8 noise-overlay"
           style={{
             background: 'linear-gradient(135deg, #071F20 0%, #0A3436 45%, #0D4547 70%, #082628 100%)',
             minHeight: 220,
           }}>
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full opacity-[0.06]"
             style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 70%)' }} />
        <div className="absolute -left-16 bottom-0 w-64 h-64 rounded-full opacity-[0.04]"
             style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />

        <div className="relative z-10 p-5 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                 style={{ background: 'rgba(200,97,26,0.2)', border: '1px solid rgba(200,97,26,0.35)' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
              <span className="text-xs font-bold tracking-wide uppercase" style={{ color: 'var(--accent)' }}>
                Seed Round offen
              </span>
            </div>
            <h1 className="text-display-lg text-white mb-3" style={{ maxWidth: 440 }}>
              Die Infrastruktur für die deutsche Baubranche
            </h1>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)', maxWidth: 400 }}>
              Avento ERP + Conser Marktplatz — das erste vollständig integrierte
              Ökosystem für Handwerksbetriebe. DACH-first, Europe later.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/investor/plans"
                className="btn btn-accent btn-lg pulse-ring">
                Pitch-Deck ansehen <ArrowRight size={15} />
              </Link>
              <Link to="/investor/chat"
                className="btn btn-lg"
                style={{ background: 'rgba(255,255,255,0.10)', color: 'white',
                         border: '1px solid rgba(255,255,255,0.15)' }}>
                Chat mit Torben
              </Link>
            </div>
          </div>

          <div className="flex md:flex-col gap-5 md:gap-0 md:justify-center shrink-0">
            {[
              { label: 'Kunden-Ziel',  mono: '75.000', sub: 'bis 2031' },
              { label: 'Revenue-Ziel', mono: '€181M',  sub: 'Jährlich (2032)' },
              { label: 'EBITDA-Ziel',  mono: '49%',    sub: 'Zielmarge' },
            ].map((stat, i) => (
              <div key={stat.label}
                   className={`md:py-4 ${i > 0 ? 'md:border-t' : ''}`}
                   style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
                <p className="text-metric-md text-white mb-0.5">{stat.mono}</p>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>{stat.label}</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WO WIR STEHEN — Aktueller Status */}
      <div className="card p-5 md:p-8 mb-8 animate-fade-up delay-1">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            Wo wir stehen — Stand {currentMonth}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Phase', value: 'Pre-Revenue', sub: 'Seed-Runde offen' },
            { label: 'Team', value: '6', sub: '2 Gründer + 4 Mitarbeiter' },
            { label: 'Gespräche', value: '100+', sub: 'Handwerksbetriebe' },
            { label: 'Partner', value: '7', sub: 'In Verhandlung' },
            { label: 'Produkte', value: '12,8M', sub: 'Im Onboarding' },
            { label: 'Investiert', value: 'EK', sub: 'Eigenkapital' },
          ].map(s => (
            <div key={s.label} className="text-center md:text-left">
              <p className="text-lg font-bold mb-0.5" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{s.value}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VERTRAUEN & INFRASTRUKTUR */}
      <div className="card p-5 md:p-8 mb-8 animate-fade-up delay-1">
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          Infrastruktur & Partner
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Bankpartner', desc: 'Namhafte deutsche Großbank · unter Verschluss', color: 'var(--brand)' },
            { title: 'Payment', desc: 'PCI-DSS Level 1 zertifiziert', color: 'var(--accent)' },
            { title: 'Hosting', desc: 'EU-Server · Frankfurt', color: 'var(--brand)' },
            { title: 'Rechtsform', desc: 'GmbH · HRB 22177', color: 'var(--accent)' },
          ].map(t => (
            <div key={t.title} className="p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* VIDEO PITCH */}
      <div className="relative rounded-[28px] overflow-hidden mb-8 animate-fade-up delay-1 group cursor-pointer hover-lift aspect-[4/3] md:aspect-video"
           style={{
             background: 'linear-gradient(135deg, #071F20 0%, #0A3436 45%, #0D4547 70%, #082628 100%)',
           }}>
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-[0.06]"
             style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 70%)' }} />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full opacity-[0.04]"
             style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
               style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
            <Play size={24} fill="white" color="white" style={{ marginLeft: 2 }} />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">90 Sekunden mit Torben</h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Pitch-Video · Demnächst hier</p>
        </div>
      </div>

      {/* INVESTMENT SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 delay-1 animate-fade-up">
        {[
          {
            icon: '💰', title: 'Was wir suchen', accent: 'var(--brand)',
            items: [['Mindest-Runway','12 Monate (~€1,2M)'],['Form','Individuell verhandelbar'],['Beteiligung','Nach Vereinbarung'],['Status','Seed-Runde offen']],
          },
          {
            icon: '⚡', title: 'Warum Jetzt', accent: 'var(--accent)',
            items: [['Regulierung','EU Digital Construction 2027'],['Lücke','73% auf Excel/Papier'],['First Mover','Kein integrierter Anbieter'],['Timing','Frühste Phase = größtes Potenzial']],
          },
          {
            icon: '🎯', title: 'Was du bekommst', accent: 'var(--info)',
            items: [['Reporting','Quartalsberichte'],['Portal','24/7 Investor-Portal'],['Zugang','Direktzugang zum Gründerteam'],['Konditionen','Individuell im Gespräch']],
          },
        ].map(col => (
          <div key={col.title} className="card card-interactive p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                   style={{ background: `${col.accent}14` }}>{col.icon}</div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{col.title}</h3>
            </div>
            <dl className="flex flex-col gap-2.5">
              {col.items.map(([key, val]) => (
                <div key={key} className="flex items-baseline justify-between gap-3">
                  <dt className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)' }}>{key}</dt>
                  <dd className="text-xs font-semibold text-right" style={{ color: 'var(--text-primary)' }}>{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* PROOF OF CONCEPT — GRÜNDER TRACK RECORD */}
      <div className="mb-8 delay-2 animate-fade-up">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>PROOF OF CONCEPT</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative rounded-[24px] overflow-hidden p-5 md:p-7 noise-overlay"
               style={{ background: 'linear-gradient(145deg, #071F20 0%, #0A3436 100%)', minHeight: 200 }}>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"
                 style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                     style={{ background: '#063D3E', border: '2px solid rgba(255,255,255,0.15)' }}>TG</div>
                <div>
                  <p className="font-bold text-sm text-white">Torben Gosch</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>CEO & Geschäftsführer</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Healthness', desc: 'Aufgebautes Unternehmen im Health-Bereich' },
                  { label: 'BuchBalance', desc: 'Eigenentwickelte Buchhaltungs-App — App Store Ready' },
                  { label: 'Zentari', desc: 'KI-Business-OS — Pre-Launch, 11.000+ Zeilen Code' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--accent)' }} />
                    <div>
                      <span className="text-xs font-semibold text-white">{item.label}</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-semibold mt-4 px-2.5 py-1 rounded-full inline-flex"
                 style={{ background: 'rgba(200,97,26,0.2)', color: 'var(--accent)' }}>
                Nachgewiesene Execution — digital & physisch
              </p>
            </div>
          </div>
          <div className="relative rounded-[24px] overflow-hidden p-5 md:p-7 noise-overlay"
               style={{ background: 'linear-gradient(145deg, #3D1A08 0%, #6B2D0C 100%)', minHeight: 200 }}>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"
                 style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                     style={{ background: '#D4662A', border: '2px solid rgba(255,255,255,0.15)' }}>MG</div>
                <div>
                  <p className="font-bold text-sm text-white">Martin Grote</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>CFO & Co-Founder</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Software-Exits', desc: 'Eigene Software gebaut und mehrfach verkauft' },
                  { label: 'Steuerbranche', desc: 'Tiefes Verständnis für Finanz-Compliance & Recht' },
                  { label: 'ERP-Profi', desc: 'Langjährige Enterprise-Software-Erfahrung' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'rgba(255,255,255,0.4)' }} />
                    <div>
                      <span className="text-xs font-semibold text-white">{item.label}</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-semibold mt-4 px-2.5 py-1 rounded-full inline-flex"
                 style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
                Bewährter Tech-Unternehmer mit Finance-Expertise
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '430.000', label: 'Handwerksbetriebe', sub: 'DACH-Region' },
              { value: '73%', label: 'Noch auf Papier', sub: 'Digitalisierungslücke' },
              { value: '€42 Mrd.', label: 'Baumarkt DACH', sub: 'Gesamtpotenzial' },
              { value: '2027', label: 'EU-Richtlinie', sub: 'Digital Construction' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold mb-0.5" style={{ color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>{s.value}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WAS WIR BAUEN */}
      <div className="mb-8 delay-2 animate-fade-up">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>WAS WIR BAUEN</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-[24px] overflow-hidden p-5 md:p-7 noise-overlay hover-lift"
               style={{ background: 'linear-gradient(145deg, #071F20 0%, #0A3436 100%)', minHeight: 180 }}>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"
                 style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="relative z-10">
              <span className="tag mb-4 inline-flex"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                ⚡ ERP & Bausoftware
              </span>
              <h2 className="text-display-md text-white mb-2">Avento</h2>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, maxWidth: 280 }}>
                Komplett-System für alles — Fokus auf Controlling, Buchhaltung, Angebote, Team steuern und vieles mehr.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Controlling','Buchhaltung','Angebote','Team-Steuerung'].map(f => (
                  <span key={f} className="tag tag-sm"
                        style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative rounded-[24px] overflow-hidden p-5 md:p-7 noise-overlay hover-lift"
               style={{ background: 'linear-gradient(145deg, #6B2D0C 0%, #8B3D12 100%)', minHeight: 180 }}>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"
                 style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="relative z-10">
              <span className="tag mb-4 inline-flex"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                🏗️ B2B Marktplatz
              </span>
              <h2 className="text-display-md text-white mb-2">Conser</h2>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, maxWidth: 280 }}>
                12,8 Millionen Produkte, 7 Top-Lieferanten — direkt in Avento integriert. 1-Klick-Bestellung aus dem ERP heraus.
              </p>
              <div className="flex flex-wrap gap-2">
                {['12,8M Produkte','7 Partner','B2B-Checkout','1-Klick-Bestellung'].map(f => (
                  <span key={f} className="tag tag-sm"
                        style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AVENTO MODULE — Space AI & BauDoku AI */}
      <div className="mb-8 delay-2 animate-fade-up">
        <p className="label-tag mb-1" style={{ color: 'var(--text-tertiary)' }}>INTEGRIERTE AVENTO-MODULE</p>
        <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Vollständig in Avento ERP integriert · Live-Demos auf Anfrage verfügbar</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="https://spaceai-henna.vercel.app" target="_blank" rel="noopener noreferrer"
             className="card p-6 group hover:translate-y-[-2px] transition-all duration-300 no-underline"
               style={{ borderLeft: '3px solid #8B5CF6', textDecoration: 'none', display: 'block' }}>
            <img src={spaceAiLogo} alt="Space AI" className="w-14 h-14 rounded-2xl object-cover mb-3" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }} />
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Space AI</h3>
              <span className="tag tag-sm" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Intelligenter KI-Assistent für Handwerksbetriebe. Automatisierte Angebotserstellung,
              Materialkalkulation und Projektplanung — direkt im Avento ERP. Versteht Branchensprache,
              lernt aus jedem Projekt und beschleunigt Arbeitsabläufe um bis zu 60%.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['KI-Angebote','Materialkalkulation','Projektplanung','Branchensprache'].map(t => (
                <span key={t} className="tag tag-sm" style={{ background: 'rgba(139,92,246,0.08)', color: '#8B5CF6' }}>{t}</span>
              ))}
            </div>
          </a>
          <a href="https://baudoku-ai.vercel.app" target="_blank" rel="noopener noreferrer"
             className="card p-6 group hover:translate-y-[-2px] transition-all duration-300 no-underline"
               style={{ borderLeft: '3px solid #0EA5E9', textDecoration: 'none', display: 'block' }}>
            <img src={bauDokuLogo} alt="BauDoku AI" className="w-14 h-14 rounded-2xl object-cover mb-3" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }} />
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>BauDoku AI</h3>
              <span className="tag tag-sm" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Digitales Bautagebuch mit KI-Unterstützung. Fotos, Notizen, Wetter und Fortschritt werden
              automatisch dokumentiert. Rechtssichere Protokolle per Klick — inklusive Signaturen,
              Zeitstempel und automatischer Zuordnung zu Projekten und Gewerken.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Foto-Doku','KI-Protokolle','Signaturen','Rechtssicher'].map(t => (
                <span key={t} className="tag tag-sm" style={{ background: 'rgba(14,165,233,0.08)', color: '#0EA5E9' }}>{t}</span>
              ))}
            </div>
          </a>
          <div className="card p-6 group hover:translate-y-[-2px] transition-all duration-300"
               style={{ borderLeft: '3px solid #1D5EA8' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 text-white text-2xl font-bold"
                 style={{ background: '#1D5EA8', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>B</div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>BuchBalance</h3>
              <span className="tag tag-sm" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
            </div>
            <p className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>Avento-Modul · auf Anfrage</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Angebundene Buchhaltung für Handwerker. Rechnungen, DATEV-Export, Umsatzsteuer —
              nahtlos integriert in Avento ERP.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Rechnungen','DATEV-Export','USt-Voranmeldung','ZUGFeRD'].map(t => (
                <span key={t} className="tag tag-sm" style={{ background: 'rgba(29,94,168,0.08)', color: '#1D5EA8' }}>{t}</span>
              ))}
            </div>
          </div>
          <a href="https://www.conser-gosch.de" target="_blank" rel="noopener noreferrer"
             className="card p-6 group hover:translate-y-[-2px] transition-all duration-300 no-underline"
               style={{ borderLeft: '3px solid #C8611A', textDecoration: 'none', display: 'block' }}>
            <img src={conserLogo} alt="Conser Marktplatz" className="w-14 h-14 rounded-2xl object-cover mb-3" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }} />
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Conser Marktplatz</h3>
              <span className="tag tag-sm" style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>Live</span>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              12,8 Mio. Bauprodukte von 7 Premium-Herstellern. Faire Großhandelspreise, 24h Lieferung.
              Direkt integriert in Avento ERP.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['12,8M Produkte','7 Hersteller','24h Lieferung'].map(t => (
                <span key={t} className="tag tag-sm" style={{ background: 'rgba(200,97,26,0.08)', color: '#C8611A' }}>{t}</span>
              ))}
            </div>
          </a>
        </div>
      </div>

      {/* VISION / COUNTUP */}
      <div className="card p-5 md:p-8 mb-8 delay-3 animate-fade-up">
        <p className="label-tag mb-6" style={{ color: 'var(--text-tertiary)' }}>WO WIR HINWOLLEN</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-10 mb-6">
          {[
            { val: c75k, display: c75k.toLocaleString('de-DE'), label: 'Kunden',       sub: 'bis 2031, DACH-Fokus' },
            { val: c181, display: `€${c181}M`,                  label: 'Jahresumsatz', sub: 'bei Reife (2032)' },
            { val: c49,  display: `${c49}%`,                    label: 'EBITDA',       sub: 'Zielmarge' },
          ].map((v, i) => (
            <div key={v.label} className={i > 0 ? 'sm:border-l sm:pl-6 md:pl-10 border-t sm:border-t-0 pt-4 sm:pt-0' : ''}
                 style={{ borderColor: 'var(--border)' }}>
              <p className="text-metric-xl count-pop mb-1" style={{ color: 'var(--brand)' }}>{v.display}</p>
              <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{v.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{v.sub}</p>
            </div>
          ))}
        </div>
        <div className="pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Unser Ziel ist die vollständige Digitalisierung der Baubranche in der DACH-Region.
            Avento als zentrales ERP · Conser als führender Marktplatz · Gemeinsam ein Ökosystem,
            das es so noch nicht gibt.
          </p>
        </div>
      </div>

      {/* WHY WE WIN */}
      <div className="mb-8 delay-4 animate-fade-up">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>WARUM WIR GEWINNEN</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '🔗', title: 'Integriertes Ökosystem',
              desc: 'ERP + Marktplatz, tief verknüpft. Material direkt aus dem Projekt bestellen. 1 Klick, kein Medienbruch.' },
            { icon: '🤖', title: 'KI-Module bereits fertig',
              desc: 'Space AI (KI-Assistent) und BauDoku AI (digitales Bautagebuch) sind live. Komplett-System für Controlling, Buchhaltung, Angebote und Team — alles integriert.' },
            { icon: '🏗️', title: 'Tiefe Branchenkenntnis',
              desc: '7 Produktionspartner, 15+ Jahre SAP-Erfahrung. Wir kennen die Schmerzen — wir haben die Lösung gebaut.' },
          ].map(usp => (
            <div key={usp.title} className="card card-interactive p-5">
              <span className="text-2xl block mb-3">{usp.icon}</span>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{usp.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {usp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* NEUIGKEITEN */}
      {updates.length > 0 && (
        <div className="mb-8 delay-5 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <p className="label-tag" style={{ color: 'var(--text-tertiary)' }}>NEUIGKEITEN</p>
            <Link to="/investor/status"
              className="flex items-center gap-1 text-xs font-semibold hover-press"
              style={{ color: 'var(--brand)' }}>
              Alle <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {updates.map(u => (
              <div key={u.id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="tag"
                    style={{ background: `${categoryColor[u.category]}14`, color: categoryColor[u.category] }}>
                    {categoryLabel[u.category]}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(u.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{u.title}</h3>
                <p className="text-xs truncate-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {u.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA FOOTER */}
      <div className="card p-5 delay-5 animate-fade-up">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>NÄCHSTE SCHRITTE</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '📊', label: 'Pitch-Deck ansehen', sub: '20 Folien · 10 min',  to: '/investor/plans', primary: true  },
            { icon: '💬', label: 'Chat mit Torben',    sub: 'Antwort <4 Stunden', to: '/investor/chat',  primary: false },
            { icon: '📋', label: 'Alle Dokumente',     sub: 'DD-Unterlagen',       to: '/investor/plans', primary: false },
          ].map(cta => (
            <Link key={cta.label} to={cta.to}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-[14px] transition hover-press ${cta.primary ? 'btn-primary' : ''}`}
              style={cta.primary ? {} : {
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                display: 'flex',
              }}>
              <span className="text-lg">{cta.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{cta.label}</p>
                <p className="text-xs opacity-60">{cta.sub}</p>
              </div>
              <ArrowRight size={14} className="opacity-50" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
