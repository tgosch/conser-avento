import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const STATUS_LABELS: Record<string, string> = {
  negotiating: 'Verhandlung', active: 'Aktiv', beta: 'Beta', partner: 'Partner',
}

export default function PartnerSettings() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [tab, setTab] = useState<'profile' | 'appearance' | 'privacy'>('profile')
  const partner = user?.partner

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <h1 className="font-bold text-2xl mb-6" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
        Einstellungen
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-[12px] mb-6" style={{ background: 'var(--surface2)' }}>
        {([
          { key: 'profile', label: 'Profil' },
          { key: 'appearance', label: 'Erscheinungsbild' },
          { key: 'privacy', label: 'Datenschutz' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 py-2 rounded-[10px] text-sm font-semibold transition"
            style={{
              background: tab === t.key ? 'var(--surface)' : 'transparent',
              color: tab === t.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: tab === t.key ? 'var(--shadow-sm)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-6 space-y-4">
          {[
            { label: 'Firma', value: partner?.name ?? '—' },
            { label: 'Kategorie', value: partner?.category ?? '—' },
            { label: 'Status', value: STATUS_LABELS[partner?.status ?? ''] ?? '—' },
            { label: 'E-Mail', value: user?.email ?? '—' },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
            </div>
          ))}
          <p className="text-xs pt-2" style={{ color: 'var(--text-tertiary)' }}>
            Änderungen am Profil bitte per E-Mail an torben@conser-avento.de
          </p>
        </div>
      )}

      {tab === 'appearance' && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Design</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {theme === 'dark' ? 'Dunkles Design aktiv' : 'Helles Design aktiv'}
              </p>
            </div>
            <button onClick={toggleTheme}
              className="btn btn-ghost flex items-center gap-2">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Hell' : 'Dunkel'}
            </button>
          </div>
        </div>
      )}

      {tab === 'privacy' && (
        <div className="card p-6 space-y-3">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Ihre Daten werden gemäß der DSGVO verarbeitet. Details finden Sie in unserer Datenschutzerklärung.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Bei Fragen zum Datenschutz wenden Sie sich an: <a href="mailto:torben@conser-avento.de" className="text-accent underline">torben@conser-avento.de</a>
          </p>
        </div>
      )}
    </div>
  )
}
