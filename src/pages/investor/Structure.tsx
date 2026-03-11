import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { TeamMember } from '../../lib/supabase'

export default function InvestorStructure() {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    supabase.from('team_members').select('*').eq('visible', true).order('order_index')
      .then(({ data }) => {
        if (data && data.length > 0) setMembers(data as TeamMember[])
        else setMembers([
          { id: '1', name: 'Torben Gosch', role: 'CEO', bio: '', initials: 'TG', color: '#063D3E', type: 'founder', equity_percent: 45, visible: true, order_index: 1 },
          { id: '2', name: 'Martin Groote', role: 'CTO', bio: '', initials: 'MG', color: '#D4662A', type: 'founder', equity_percent: 45, visible: true, order_index: 2 },
          { id: '3', name: 'Code Ara GmbH', role: 'Technologiepartner', bio: '', initials: 'CA', color: '#2d6a4f', type: 'external', equity_percent: 10, visible: true, order_index: 3 },
        ])
      })
  }, [])

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Unternehmenskonstrukt</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Struktur, Gesellschaftsform und Organigramm</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Gesellschaftsform', value: 'GmbH (in Gründung)' },
          { label: 'Sitz', value: 'Deutschland' },
          { label: 'Gründungsjahr', value: '2025' },
        ].map(s => (
          <div key={s.label} className="rounded-[20px] p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Organigramm</h2>
      <div className="rounded-[20px] p-6 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col items-center gap-6">
          <div className="text-sm font-semibold px-6 py-2 rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--surface2)' }}>
            Avento & Conser GmbH
          </div>
          <div className="w-px h-6" style={{ background: 'var(--border)' }} />
          <div className="flex gap-8 flex-wrap justify-center">
            {members.map(m => (
              <div key={m.id} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold" style={{ background: m.color }}>
                  {m.initials}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.role}</p>
                  {m.equity_percent > 0 && (
                    <p className="text-xs font-medium mt-0.5 text-accent1">{m.equity_percent}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
