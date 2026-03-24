import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Update } from '../../lib/supabase'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp'

const categoryColor: Record<string, string> = {
  general: '#6E6E73', milestone: '#063D3E', important: '#C8611A',
}
const categoryLabel: Record<string, string> = {
  general: 'Allgemein', milestone: 'Meilenstein', important: 'Wichtig',
}

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

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8">
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
              { label: 'Revenue-Ziel', mono: '€181M',  sub: 'Annual (2032)' },
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

      {/* INVESTMENT SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 delay-1 animate-fade-up">
        {[
          {
            icon: '💰', title: 'Die Runde', accent: 'var(--brand)',
            items: [['Raising','€1,5M Seed'],['Form','SAFE / Equity'],['Schließung','Q2 2026'],['Use of Funds','45% Tech · 25% Sales']],
          },
          {
            icon: '⚡', title: 'Warum Jetzt', accent: 'var(--accent)',
            items: [['Regulierung','EU Digital Construction 2027'],['Lücke','73% auf Excel/Papier'],['First Mover','Kein integrierter Anbieter'],['Einstieg','Frühste Phase = beste Terms']],
          },
          {
            icon: '🎯', title: 'Was du bekommst', accent: 'var(--info)',
            items: [['ROI-Projektion','190–280x (Base/Bull)'],['Beirat','ab €75k Advisory-Position'],['Reporting','Quarterly Updates'],['Zugang','24/7 Investor Portal']],
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

      {/* WAS WIR BAUEN */}
      <div className="mb-8 delay-2 animate-fade-up">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>WAS WIR BAUEN</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-[24px] overflow-hidden p-7 noise-overlay hover-lift"
               style={{ background: 'linear-gradient(145deg, #071F20 0%, #0A3436 100%)', minHeight: 210 }}>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"
                 style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="relative z-10">
              <span className="tag mb-4 inline-flex"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                ⚡ ERP & Bausoftware
              </span>
              <h2 className="text-display-md text-white mb-2">Avento</h2>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, maxWidth: 280 }}>
                Das vollständige Betriebssystem für Handwerker. Kalkulation, Zeiterfassung, Fakturierung, KI-Aufmaß — alles in einem.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Kalkulation','Zeiterfassung','Fakturierung','KI-Aufmaß'].map(f => (
                  <span key={f} className="tag tag-sm"
                        style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative rounded-[24px] overflow-hidden p-7 noise-overlay hover-lift"
               style={{ background: 'linear-gradient(145deg, #6B2D0C 0%, #8B3D12 100%)', minHeight: 210 }}>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"
                 style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="relative z-10">
              <span className="tag mb-4 inline-flex"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                🏗️ B2B Marktplatz
              </span>
              <h2 className="text-display-md text-white mb-2">Conser</h2>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, maxWidth: 280 }}>
                2,3 Millionen Produkte, 7 Top-Lieferanten — direkt in Avento integriert. 1-Click-Bestellung aus dem ERP heraus.
              </p>
              <div className="flex flex-wrap gap-2">
                {['2,3M Produkte','7 Partner','B2B-Checkout','1-Click Order'].map(f => (
                  <span key={f} className="tag tag-sm"
                        style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VISION / COUNTUP */}
      <div className="card p-7 md:p-8 mb-8 delay-3 animate-fade-up">
        <p className="label-tag mb-6" style={{ color: 'var(--text-tertiary)' }}>WO WIR HINWOLLEN</p>
        <div className="grid grid-cols-3 gap-6 md:gap-10 mb-6">
          {[
            { val: c75k, display: c75k.toLocaleString('de-DE'), label: 'Kunden',       sub: 'bis 2031, DACH-Fokus' },
            { val: c181, display: `€${c181}M`,                  label: 'Jahresumsatz', sub: 'bei Reife (2032)' },
            { val: c49,  display: `${c49}%`,                    label: 'EBITDA',       sub: 'Zielmarge' },
          ].map((v, i) => (
            <div key={v.label} className={i > 0 ? 'border-l pl-6 md:pl-10' : ''}
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
            { icon: '🤖', title: 'KI-First von Beginn an',
              desc: 'KI-Aufmaß per Foto, intelligente Kalkulation — als Kernfunktion, nicht als Add-on.' },
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
