import { ExternalLink } from 'lucide-react'
const torbenImg = '/Torben.Gosch.PNG'

const TEAM = [
  {
    name: 'Torben Gosch',
    role: 'CEO & Geschäftsführer',
    photo: torbenImg,
    initials: 'TG',
    color: '#063D3E',
    bio: 'Wir wollen die Handwerk- und Baubranche wieder an ihren Peak bringen und setzen alles auf eine neue Expansion. Avento und Conser sind die Werkzeuge dafür — gebaut von Menschen, die die Branche verstehen.',
    link: { label: 'Mehr über Torben Gosch', url: 'https://www.goschgroup.de' },
    featured: true,
  },
  {
    name: 'Co-Founder & CTO',
    role: 'Technologie & Produktentwicklung',
    photo: null,
    initials: 'CTO',
    color: '#D4662A',
    bio: 'Verantwortet die gesamte technische Architektur und Produktentwicklung. Mehrfacher Software-Unternehmer mit Exits — bringt langjährige ERP- und Steuerbranche-Expertise mit.',
    link: null,
    featured: true,
  },
]

const ROLES = [
  { initials: 'DEV', role: 'Full-Stack Entwickler', color: '#0EA5E9', desc: 'Backend & Frontend Entwicklung' },
  { initials: 'DEV', role: 'Full-Stack Entwickler', color: '#8B5CF6', desc: 'Backend & Frontend Entwicklung' },
  { initials: 'UX', role: 'UI/UX Designer', color: '#F59E0B', desc: 'Produktdesign & Nutzererfahrung' },
  { initials: 'KB', role: 'Kundenberaterin', color: '#EC4899', desc: 'Partner-Betreuung & Onboarding' },
]

export default function PartnerTeam() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="mb-10">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>UNSER TEAM</p>
        <h1 className="text-display-md mb-2" style={{ color: 'var(--text-primary)' }}>
          Die Menschen hinter Avento & Conser
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: 480 }}>
          Ein Team aus Unternehmern, Entwicklern und Branchenkennern —
          vereint durch die Mission, die Baubranche zu digitalisieren.
        </p>
      </div>

      {/* Gründer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {TEAM.map(m => (
          <div key={m.name} className="card overflow-hidden animate-fade-up">
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}80)` }} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                {m.photo ? (
                  <img src={m.photo} alt={m.name}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                    style={{ border: `3px solid ${m.color}25` }} />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                    style={{ background: m.color }}>
                    {m.initials}
                  </div>
                )}
                <div>
                  <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{m.role}</p>
                </div>
              </div>

              <blockquote className="rounded-xl p-4 mb-4 text-sm italic leading-relaxed"
                style={{ background: `${m.color}08`, borderLeft: `2px solid ${m.color}30`, color: 'var(--text-primary)', lineHeight: 1.7 }}>
                "{m.bio}"
              </blockquote>

              {m.link && (
                <a href={m.link.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-80"
                  style={{ color: m.color }}>
                  {m.link.label} <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="mb-10">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>DAS TEAM</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ROLES.map((r, i) => (
            <div key={i} className="card p-5 text-center animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3"
                style={{ background: r.color }}>
                {r.initials}
              </div>
              <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{r.role}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Werte */}
      <div className="card p-6 md:p-8 animate-fade-up">
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>UNSERE WERTE</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: 'Execution first', desc: 'Wir liefern Ergebnisse, nicht Slides. 4 Live-Produkte beweisen das.' },
            { icon: '🤝', title: 'Partnerschaft auf Augenhöhe', desc: 'Ihre Expertise in der Branche + unsere Technologie = gemeinsamer Erfolg.' },
            { icon: '🔒', title: 'Vertrauen & Transparenz', desc: 'DSGVO-konform, deutsche Server, offene Kommunikation. Immer.' },
          ].map(v => (
            <div key={v.title} className="p-4 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <span className="text-xl block mb-2">{v.icon}</span>
              <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{v.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
