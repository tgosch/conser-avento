import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { TeamMember } from '../../lib/supabase'
import { Building2, CheckCircle, Clock, Code2, ChevronDown } from 'lucide-react'

const HOLDING = {
  name: 'Bautech Holding GmbH',
  description: 'Muttergesellschaft · Strategische Steuerung',
  color: '#1C1C1E',
}

const COMPANIES = [
  {
    name: 'Conser GmbH',
    description: 'Digitaler Marktplatz für Baustoffe & Handwerk',
    status: 'Gegründet',
    statusColor: '#34C759',
    statusBg: 'rgba(52,199,89,0.12)',
    accent: '#063D3E',
    icon: '🏗️',
  },
  {
    name: 'Avento GmbH',
    description: 'B2B Software-Plattform für die Baubranche',
    status: 'In Gründung',
    statusColor: '#FF9500',
    statusBg: 'rgba(255,149,0,0.12)',
    accent: '#D4662A',
    icon: '💻',
  },
]

export default function InvestorStructure() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('team_members').select('*').eq('visible', true).order('order_index')
      .then(({ data }) => {
        if (data && data.length > 0) setMembers(data as TeamMember[])
        else setMembers([
          { id: '1', name: 'Torben Gosch',    role: 'CEO & Geschäftsführer',       bio: 'Gründer und Geschäftsführer. Strategie, Partnerschaften & Investoren.',                initials: 'TG', color: '#063D3E', type: 'founder',  equity_percent: 60, visible: true, order_index: 1 },
          { id: '2', name: 'Martin Grote',    role: 'CFO & Co-Founder',            bio: 'Co-Founder und Finanzleiter. Finanzen, Controlling & operative Steuerung.',             initials: 'MG', color: '#D4662A', type: 'founder',  equity_percent: 35, visible: true, order_index: 2 },
          { id: '5', name: 'Oscar',           role: 'Full-Stack Entwickler',       bio: 'Full-Stack Entwickler. Baut und betreut die technische Plattform.',                     initials: 'OS', color: '#0EA5E9', type: 'team',     equity_percent: 0,  visible: true, order_index: 3 },
          { id: '6', name: 'Luis',            role: 'Full-Stack Entwickler',       bio: 'Full-Stack Entwickler. Features und technische Integration.',                            initials: 'LU', color: '#8B5CF6', type: 'team',     equity_percent: 0,  visible: true, order_index: 4 },
          { id: '7', name: 'UI/UX Designer',  role: 'UI/UX Designer',             bio: 'Gestaltet Nutzererfahrung, Produktdesign und visuelle Identität.',                       initials: 'UX', color: '#F59E0B', type: 'team',     equity_percent: 0,  visible: true, order_index: 5 },
          { id: '8', name: 'Kundenberaterin', role: 'Kundenberaterin',            bio: 'Beratung und Betreuung von Kunden und Partnern.',                                        initials: 'KB', color: '#EC4899', type: 'team',     equity_percent: 0,  visible: true, order_index: 6 },
          { id: '3', name: 'Code Ara GmbH',   role: 'Entwicklungspartner',        bio: 'Strategischer Technologiepartner. Externe Software-Entwicklung.',                        initials: 'CA', color: '#2d6a4f', type: 'external', equity_percent: 5,  visible: true, order_index: 7 },
        ])
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="max-w-4xl">
      <div className="skeleton h-8 w-56 rounded-xl mb-3" />
      <div className="skeleton h-4 w-72 rounded-lg mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-[18px]" />)}
      </div>
      <div className="skeleton h-64 rounded-[20px] mb-6" />
      <div className="skeleton h-48 rounded-[20px]" />
    </div>
  )

  const founders = members.filter(m => m.type === 'founder')
  const external = members.filter(m => m.type === 'external')

  return (
    <div className="max-w-4xl animate-fade-up">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Unternehmenskonstrukt</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Struktur, Hierarchie & Gesellschaftsform</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Gesellschaftsform', value: 'GmbH' },
          { label: 'Sitz', value: 'Deutschland' },
          { label: 'Gründungsjahr', value: '2025' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Hierarchy Tree */}
      <h2 className="font-bold text-base mb-5" style={{ color: 'var(--text-primary)' }}>Holding-Struktur</h2>
      <div className="flex flex-col items-center">

        <div className="w-full max-w-xs rounded-[18px] p-5 border-2 text-center relative"
          style={{ background: '#1C1C1E', borderColor: '#363636' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <Building2 size={20} color="white" />
          </div>
          <p className="font-bold text-sm text-white">{HOLDING.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{HOLDING.description}</p>
        </div>

        <div className="flex flex-col items-center" style={{ height: '40px', position: 'relative' }}>
          <div className="w-px flex-1" style={{ background: 'var(--border)' }} />
          <div className="flex gap-16 md:gap-48">
            <div className="w-px h-4" style={{ background: 'var(--border)' }} />
            <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{ background: 'var(--border)' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
          {COMPANIES.map(c => (
            <div key={c.name}
              className="card card-interactive p-5"
              onClick={() => setExpanded(expanded === c.name ? null : c.name)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${c.accent}14` }}>{c.icon}</div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{c.description}</p>
                  </div>
                </div>
                <ChevronDown size={16} style={{
                  color: 'var(--text-secondary)',
                  transform: expanded === c.name ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s', flexShrink: 0,
                }} />
              </div>
              <div className="flex items-center gap-2">
                {c.status === 'Gegründet'
                  ? <CheckCircle size={13} style={{ color: c.statusColor }} />
                  : <Clock size={13} style={{ color: c.statusColor }} />}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: c.statusBg, color: c.statusColor }}>{c.status}</span>
              </div>
              {expanded === c.name && (
                <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  <p>Sitz: Deutschland · Rechtsform: GmbH · Gründungsjahr: 2025</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card p-5 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(45,106,79,0.12)' }}>
              <Code2 size={18} style={{ color: '#2d6a4f' }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Code Ara GmbH</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Strategischer Entwicklungspartner · 5% Anteile</p>
            </div>
            <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(45,106,79,0.12)', color: '#2d6a4f' }}>Entwickler</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Code Ara GmbH ist der externe Software-Entwicklungspartner der Bautech Holding. Das Unternehmen verantwortet die technische Umsetzung der Plattform und hält 5% Unternehmensanteile als strategische Beteiligung.
          </p>
        </div>
      </div>

      {/* Organigramm */}
      <h2 className="font-bold text-base mb-5" style={{ color: 'var(--text-primary)' }}>Gründerteam & Beteiligung</h2>
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...founders, ...external].map(m => (
            <div key={m.id} className="flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ background: m.color }}>{m.initials}</div>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.role}</p>
                {m.equity_percent > 0 && (
                  <p className="text-xs font-semibold mt-1" style={{ color: '#063D3E' }}>{m.equity_percent}%</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ERGÄNZUNG — Equity-Tabelle (Cap Table) */}
      <div className="card p-6 animate-fade-up">
        <p className="label-tag mb-2" style={{ color: 'var(--text-tertiary)' }}>KAPITALISIERUNG</p>
        <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Cap Table (Pre-Seed)</h2>
        <div className="overflow-x-auto">
          <table className="table-premium w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Rolle', 'Equity', 'Status'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Torben Gosch',  role: 'CEO & Founder',       equity: '60%', status: 'Gründer' },
                { name: 'Martin Grote',  role: 'CFO & Co-Founder',    equity: '35%', status: 'Gründer' },
                { name: 'Code Ara GmbH', role: 'Entwicklungspartner', equity: '5%',  status: 'Strategisch' },
                { name: 'Investor Pool', role: 'Seed Round (€1,5M)',   equity: 'TBD', status: 'Offen' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{row.name}</td>
                  <td className="py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{row.role}</td>
                  <td className="py-3 font-bold" style={{ color: '#063D3E' }}>{row.equity}</td>
                  <td className="py-3">
                    <span className="tag"
                          style={{
                            background: row.status === 'Offen' ? 'rgba(212,102,42,0.12)' : 'rgba(6,61,62,0.10)',
                            color:      row.status === 'Offen' ? '#D4662A' : '#063D3E',
                          }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>
          Pre-Seed Kapitalisierungstabelle. Investor-Anteile entstehen durch die Seed-Runde (€1,5M).
          Genaue Konditionen im Gespräch mit Torben.
        </p>
      </div>

    </div>
  )
}
