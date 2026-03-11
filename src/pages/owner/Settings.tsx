import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Investor, InvestmentIntent } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import { Moon, Sun, Download } from 'lucide-react'
import { toast } from 'react-toastify'

export default function OwnerSettings() {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('design')
  const [investors, setInvestors] = useState<Investor[]>([])
  const [intents, setIntents] = useState<(InvestmentIntent & { investor?: Investor })[]>([])

  useEffect(() => {
    if (activeTab === 'investors') {
      supabase.from('investors').select('*').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setInvestors(data as Investor[]) })
    }
    if (activeTab === 'investments') {
      supabase.from('investment_intents').select('*, investors(*)').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setIntents(data as (InvestmentIntent & { investor?: Investor })[]) })
    }
  }, [activeTab])

  const exportCSV = () => {
    const rows = [
      ['Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Status', 'Registriert'],
      ...investors.map(i => [i.first_name, i.last_name, i.email, i.phone || '', i.status, new Date(i.created_at).toLocaleDateString('de-DE')]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'investoren.csv'; a.click()
    toast.success('CSV exportiert')
  }

  const tabs = [
    { id: 'design', label: 'Design' },
    { id: 'investors', label: 'Interessenten' },
    { id: 'investments', label: 'Investitionen' },
  ]

  const statusColor: Record<string, string> = { new: '#063D3E', contacted: '#D4662A', negotiating: '#7c3aed' }
  const statusLabel: Record<string, string> = { new: 'Neu', contacted: 'In Kontakt', negotiating: 'Verhandelt', pending: 'Offen' }

  return (
    <div className="max-w-4xl">
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
        <div className="rounded-[20px] p-6 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Design & Erscheinungsbild</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Dunkles Erscheinungsbild für alle Nutzer</p>
            </div>
            <button onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition"
              style={{ background: 'var(--surface2)', color: 'var(--text-primary)' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'investors' && (
        <div className="rounded-[20px] border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Alle Interessenten ({investors.length})</h2>
            <button onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 transition"
              style={{ background: '#063D3E' }}>
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
        <div className="rounded-[20px] border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Investitionsabsichten ({intents.length})</h2>
          </div>
          {intents.length === 0 ? (
            <p className="text-xs p-6 text-secondary">Noch keine Investitionsabsichten eingegangen</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid var(--border)` }}>
                    {['Investor', 'Betrag', 'Status', 'Eingegangen'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {intents.map(intent => (
                    <tr key={intent.id} className="hover:bg-surface2 transition" style={{ borderBottom: `1px solid var(--border)` }}>
                      <td className="px-5 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                        {/* @ts-ignore */}
                        {intent.investors?.first_name} {intent.investors?.last_name}
                      </td>
                      <td className="px-5 py-3 font-semibold" style={{ color: '#063D3E' }}>€ {intent.amount.toLocaleString('de-DE')}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-surface2" style={{ color: 'var(--text-secondary)' }}>
                          {statusLabel[intent.status] || intent.status}
                        </span>
                      </td>
                      <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(intent.created_at).toLocaleDateString('de-DE')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
