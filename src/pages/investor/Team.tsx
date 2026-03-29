import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { TeamMember } from '../../lib/supabase'

// ── Fallback-Daten ───────────────────────────────────────────────
const FALLBACK_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Torben Gosch',   role: 'CEO · Chief Executive Officer',  bio: 'Gründer und Geschäftsführer. Verantwortet Strategie, Partnerschaften und Investorenbeziehungen.', initials: 'TG', color: '#063D3E', type: 'founder',  equity_percent: 45, visible: true, order_index: 1, photo_path: null },
  { id: '2', name: 'Martin Groote',  role: 'CTO · Chief Technology Officer', bio: 'Technologieleiter und Mitgründer. Verantwortet Produktentwicklung und technische Innovation.',      initials: 'MG', color: '#D4662A', type: 'founder',  equity_percent: 45, visible: true, order_index: 2, photo_path: null },
  { id: '4', name: 'Paul Bockting',  role: 'CDO · Chief Design Officer',     bio: 'UI/UX-Verantwortlicher und Mitgründer. Gestaltet Nutzererfahrung, Produktdesign und visuelle Identität.', initials: 'PB', color: '#5856D6', type: 'founder',  equity_percent: 0,  visible: true, order_index: 3, photo_path: null },
  { id: '3', name: 'Code Ara GmbH', role: 'Externer Entwicklungspartner',    bio: 'Strategischer Technologiepartner. Verantwortet externe Software-Entwicklung.',                         initials: 'CA', color: '#2d6a4f', type: 'external', equity_percent: 10, visible: true, order_index: 4, photo_path: null },
]

const EXPERTISE: Record<string, string[]> = {
  '1': ['Startup-Strategie', 'Investor Relations', 'Partner-Netzwerk', 'B2B Sales'],
  '2': ['SAP S/4HANA', 'Node.js + PostgreSQL', 'AWS-Architektur', 'Team Leadership'],
  '4': ['UX/UI Systems', 'Design Thinking', 'Produktvision', 'Prototyping'],
  '3': ['Backend-Entwicklung', 'API-Integration', 'Payment Systems', 'Partner-APIs'],
}
const WHY: Record<string, string> = {
  '1': '"Verbindet Baubranche-Netzwerk mit unternehmerischer Execution."',
  '2': '"15+ Jahre SAP bedeutet: er versteht Enterprise-Anforderungen — und baut besser dagegen."',
  '4': '"Baut Produkte die Handwerker wirklich täglich benutzen wollen."',
  '3': '"Macht komplexe Integrations-Architektur unsichtbar einfach."',
}

// ── Avatar ───────────────────────────────────────────────────────
function MemberAvatar({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false)
  const photoUrl = member.photo_path
    ? supabase.storage.from('team-photos').getPublicUrl(member.photo_path).data.publicUrl
    : null

  if (photoUrl && !imgError) {
    return (
      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
        <img
          src={photoUrl}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }
  return (
    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
      style={{ background: member.color }}>
      {member.initials}
    </div>
  )
}

// ── Team Page ────────────────────────────────────────────────────
export default function InvestorTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('team_members').select('*').eq('visible', true).order('order_index')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const deduped = (data as TeamMember[]).filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
          setMembers(deduped)
        } else {
          setMembers(FALLBACK_MEMBERS)
        }
        setLoading(false)
      })
  }, [])

  const founders  = members.filter(m => m.type === 'founder')
  const external  = members.filter(m => m.type === 'external')

  if (loading) return (
    <div className="max-w-5xl">
      <div className="skeleton h-8 w-64 rounded-xl mb-3" />
      <div className="skeleton h-4 w-96 rounded-lg mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[1,2,3].map(i => <div key={i} className="skeleton h-64 rounded-[24px]" />)}
      </div>
      <div className="skeleton h-32 rounded-[20px]" />
    </div>
  )

  return (
    <div className="max-w-5xl animate-fade-up">
      <div className="mb-10">
        <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>DAS TEAM</p>
        <h1 className="text-display-md mb-2" style={{ color: 'var(--text-primary)' }}>
          Branchen-Insider trifft<br/>Tech-Exzellenz
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: 480 }}>
          Gegründet von Menschen die das Problem aus erster Hand kennen —
          mit dem technischen Background es wirklich zu lösen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {founders.map(m => (
          <div key={m.id} className="card overflow-hidden hover-lift animate-fade-up">
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}80)` }} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <MemberAvatar member={m} />
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{m.role}</p>
                </div>
              </div>
              {WHY[m.id] && (
                <blockquote className="rounded-xl p-3.5 mb-5 text-xs italic leading-relaxed"
                            style={{ background: `${m.color}08`, borderLeft: `2px solid ${m.color}30`,
                                     color: 'var(--text-primary)', paddingLeft: 12 }}>
                  {WHY[m.id]}
                </blockquote>
              )}
              {EXPERTISE[m.id] && (
                <div className="mb-4">
                  <p className="label-overline mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXPERTISE[m.id].map(t => (
                      <span key={t} className="tag tag-sm" style={{ background: `${m.color}10`, color: m.color }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {m.bio && (
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{m.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {external.length > 0 && (
        <div className="mb-10">
          <div className="divider-text mb-5">ENTWICKLUNGSPARTNER</div>
          {external.map(m => (
            <div key={m.id} className="card p-5 flex items-start gap-4">
              <MemberAvatar member={m} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                  <span className="tag tag-sm" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>10% Equity</span>
                  <span className="tag tag-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>Strategischer Partner</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>TEAM-EXPANSION POST-SEED</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { role: 'Backend Dev',      date: 'Jun 2026', icon: '🔧' },
            { role: 'Sales Lead',       date: 'Q3 2026',  icon: '📈' },
            { role: 'Customer Success', date: 'Q3 2026',  icon: '🤝' },
            { role: 'Marketing Mgr',    date: 'Q4 2026',  icon: '📣' },
          ].map(h => (
            <div key={h.role} className="card p-4">
              <span className="text-2xl block mb-2">{h.icon}</span>
              <p className="font-semibold text-xs mb-0.5" style={{ color: 'var(--text-primary)' }}>{h.role}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>ab {h.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
