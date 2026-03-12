import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { TeamMember } from '../../lib/supabase'

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

export default function InvestorTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    supabase.from('team_members').select('*').eq('visible', true).order('order_index')
      .then(({ data }) => {
        if (data) setMembers(data as TeamMember[])
        else {
          setMembers([
            { id: '1', name: 'Torben Gosch', role: 'CEO · Chief Executive Officer', bio: 'Gründer und Geschäftsführer. Verantwortet Strategie, Partnerschaften und Investorenbeziehungen.', initials: 'TG', color: '#063D3E', type: 'founder', equity_percent: 0, visible: true, order_index: 1, photo_path: null },
            { id: '2', name: 'Martin Groote', role: 'CTO · Chief Technology Officer', bio: 'Technologieleiter und Mitgründer. Verantwortet Produktentwicklung und technische Innovation.', initials: 'MG', color: '#D4662A', type: 'founder', equity_percent: 0, visible: true, order_index: 2, photo_path: null },
            { id: '4', name: 'Paul Bockting', role: 'CDO · Chief Design Officer', bio: 'UI/UX-Verantwortlicher und Mitgründer. Gestaltet Nutzererfahrung, Produktdesign und visuelle Identität.', initials: 'PB', color: '#5856D6', type: 'founder', equity_percent: 0, visible: true, order_index: 3, photo_path: null },
            { id: '3', name: 'Code Ara GmbH', role: 'Externer Entwicklungspartner', bio: 'Strategischer Technologiepartner. Verantwortet externe Software-Entwicklung.', initials: 'CA', color: '#2d6a4f', type: 'external', equity_percent: 10, visible: true, order_index: 4, photo_path: null },
          ])
        }
      })
  }, [])

  const typeLabel: Record<string, string> = { founder: 'Gründer', external: 'Extern', internal: 'Intern' }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Das Gründerteam</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Die Menschen hinter Avento & Conser</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {members.map(m => (
          <div key={m.id} className="rounded-[20px] p-6 border flex flex-col gap-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-4">
              <MemberAvatar member={m} />
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{m.role}</p>
              </div>
            </div>
            {m.bio && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.bio}</p>}
            <div className="flex gap-2 flex-wrap mt-auto">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: `${m.color}20`, color: m.color }}>
                {typeLabel[m.type] || m.type}
              </span>
              {m.equity_percent > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(110,110,115,0.12)', color: 'var(--text-secondary)' }}>
                  {m.equity_percent}% Anteile
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
