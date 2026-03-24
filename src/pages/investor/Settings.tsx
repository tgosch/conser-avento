import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function InvestorSettings() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profil' },
    { id: 'appearance', label: 'Erscheinungsbild' },
    { id: 'privacy', label: 'Datenschutz' },
  ]

  return (
    <div className="max-w-2xl animate-fade-up">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Einstellungen</h1>

      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--surface2)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition"
            style={{
              background: activeTab === t.id ? 'var(--surface)' : 'transparent',
              color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === t.id ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Profil-Informationen</h2>
          {user?.investor ? (
            <div className="flex flex-col gap-3">
              {[
                { label: 'Vorname', value: user.investor.first_name },
                { label: 'Nachname', value: user.investor.last_name },
                { label: 'E-Mail', value: user.investor.email },
                { label: 'Telefon', value: user.investor.phone || '–' },
                { label: 'Status', value: user.investor.status },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Keine Profildaten verfügbar</p>
          )}
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="card p-6">
          <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Erscheinungsbild</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Dunkles Erscheinungsbild aktivieren</p>
            </div>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Datenschutz</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Ihre Daten werden gemäß DSGVO verarbeitet. Einwilligung erteilt:{' '}
            {user?.investor?.consent_date ? new Date(user.investor.consent_date).toLocaleDateString('de-DE') : '–'}
          </p>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-sm text-accent hover:underline">Datenschutzerklärung lesen</a>
            <a href="#" className="text-sm text-accent hover:underline">Impressum</a>
            <a href="#" className="text-sm text-red-500 hover:underline">Daten exportieren</a>
            <a href="#" className="text-sm text-red-500 hover:underline">Account löschen</a>
          </div>
        </div>
      )}
    </div>
  )
}
