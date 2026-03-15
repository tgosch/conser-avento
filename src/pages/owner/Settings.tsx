import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { Investor } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import { Moon, Sun, Download } from 'lucide-react'
import { toast } from 'react-toastify'

interface Proposal {
  id: string
  content: string
  created_at: string
  investor_id: string
  investor?: { first_name: string; last_name: string; email: string }
}

export default function OwnerSettings() {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('design')
  const [investors, setInvestors] = useState<Investor[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])

  useEffect(() => {
    if (activeTab === 'investors') {
      supabase.from('investors').select('id, first_name, last_name, email, phone, status, created_at').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setInvestors(data as Investor[]) })
    }
    if (activeTab === 'investments') {
      // Vorschläge aus Chat-Nachrichten laden (markiert mit [Investitionsvorschlag])
      supabase
        .from('messages')
        .select('id, content, created_at, investor_id, investors(first_name, last_name, email)')
        .ilike('content', '[Investitionsvorschlag]%')
        .order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setProposals(data as unknown as Proposal[]) })
    }
  }, [activeTab])

  const exportCSV = () => {
    const esc = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const rows = [
      ['Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Status', 'Registriert'].map(esc),
      ...investors.map(i => [i.first_name, i.last_name, i.email, i.phone || '', i.status, new Date(i.created_at).toLocaleDateString('de-DE')].map(esc)),
    ]
    const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\r\n') // BOM for Excel UTF-8
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'investoren.csv'; a.click()
    toast.success('CSV exportiert')
  }

  const tabs = [
    { id: 'design', label: 'Design' },
    { id: 'investors', label: 'Interessenten' },
    { id: 'investments', label: 'Vorschläge' },
  ]

  const statusColor: Record<string, string> = { new: '#063D3E', contacted: '#D4662A', negotiating: '#7c3aed' }
  const statusLabel: Record<string, string> = { new: 'Neu', contacted: 'In Kontakt', negotiating: 'Verhandelt', pending: 'Offen' }

  return (
    <div className="max-w-4xl animate-fade-up">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Einstellungen</h1>

      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--surface2)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition"
            style={{
              background: activeTab === t.id ? 'var(--surface)' : 'transparent',
              color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === t.id ? 'var(--shadow-sm)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'design' && (
        <div className="card p-6">
          <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Design & Erscheinungsbild</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Dunkles Erscheinungsbild für alle Nutzer</p>
            </div>
            <button onClick={toggleTheme}
              className="btn btn-secondary btn-sm">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'investors' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Alle Interessenten ({investors.length})</h2>
            <button onClick={exportCSV}
              className="btn btn-primary btn-sm">
              <Download size={13} /> CSV Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid var(--border)` }}>
                  {['Name', 'E-Mail', 'Telefon', 'Status', 'Registriert'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investors.map(inv => (
                  <tr key={inv.id} className="hover:bg-surface2 transition" style={{ borderBottom: `1px solid var(--border)` }}>
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{inv.first_name} {inv.last_name}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{inv.email}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{inv.phone || '–'}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${statusColor[inv.status] || '#6E6E73'}20`, color: statusColor[inv.status] || 'var(--text-secondary)' }}>
                        {statusLabel[inv.status] || inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(inv.created_at).toLocaleDateString('de-DE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'investments' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Investitionsvorschläge ({proposals.length})
            </h2>
          </div>
          {proposals.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-2xl mb-2">📬</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Noch keine Vorschläge eingegangen
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Vorschläge werden über den Investor-Chat eingereicht
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
              {proposals.map(p => (
                <div key={p.id} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: '#063D3E' }}>
                        {p.investor?.first_name?.[0]}{p.investor?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {p.investor?.first_name} {p.investor?.last_name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.investor?.email}</p>
                      </div>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(p.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="ml-10 px-4 py-3 rounded-xl text-sm leading-relaxed"
                    style={{ background: 'var(--surface2)', color: 'var(--text-primary)' }}>
                    {p.content.replace('[Investitionsvorschlag] ', '')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
