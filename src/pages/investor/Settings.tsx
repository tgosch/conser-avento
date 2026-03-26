import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Moon, Sun, Lock, Trash2, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'

export default function InvestorSettings() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')

  // Password change
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profil' },
    { id: 'security', label: 'Sicherheit' },
    { id: 'appearance', label: 'Erscheinungsbild' },
    { id: 'privacy', label: 'Datenschutz' },
  ]

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pw.newPw.length < 8) { toast.error('Mindestens 8 Zeichen'); return }
    if (!/[A-Z]/.test(pw.newPw)) { toast.error('Mindestens ein Großbuchstabe'); return }
    if (!/[0-9]/.test(pw.newPw)) { toast.error('Mindestens eine Zahl'); return }
    if (pw.newPw !== pw.confirm) { toast.error('Passwörter stimmen nicht überein'); return }
    setPwLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: pw.newPw })
      if (error) throw error
      toast.success('Passwort erfolgreich geändert')
      setPw({ current: '', newPw: '', confirm: '' })
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler beim Ändern')
    } finally { setPwLoading(false) }
  }

  const handleExportData = async () => {
    if (!user?.investor) return
    const data = JSON.stringify(user.investor, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conser-avento-daten-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Daten exportiert')
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      if (user?.investor?.id) {
        await supabase.from('investors').delete().eq('id', user.investor.id)
      }
      await logout()
      toast.success('Account wurde gelöscht')
    } catch {
      toast.error('Fehler beim Löschen. Bitte kontaktieren Sie uns.')
    } finally { setDeleteLoading(false) }
  }

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

      {activeTab === 'security' && (
        <div className="card p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Lock size={18} style={{ color: 'var(--brand)' }} />
            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Passwort ändern</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
            <input type="password" placeholder="Neues Passwort (min. 8, Großbuchstabe + Zahl)"
              required minLength={8} value={pw.newPw}
              onChange={e => setPw(p => ({ ...p, newPw: e.target.value }))}
              className="input-base" />
            <input type="password" placeholder="Passwort bestätigen"
              required minLength={8} value={pw.confirm}
              onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
              className="input-base" />
            {pw.newPw && pw.confirm && pw.newPw !== pw.confirm && (
              <p className="text-xs" style={{ color: 'var(--error, #E53935)' }}>Passwörter stimmen nicht überein</p>
            )}
            <button type="submit" disabled={pwLoading || pw.newPw.length < 8 || pw.newPw !== pw.confirm}
              className="btn btn-primary w-full">
              {pwLoading ? 'Wird gespeichert…' : 'Passwort ändern'}
            </button>
          </form>
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
            <button onClick={toggleTheme} className="btn btn-secondary">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="card p-6 flex flex-col gap-5">
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Datenschutz</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Ihre Daten werden gemäß DSGVO verarbeitet. Einwilligung erteilt:{' '}
            {user?.investor?.consent_date ? new Date(user.investor.consent_date).toLocaleDateString('de-DE') : '–'}
          </p>

          <div className="flex flex-col gap-3">
            <button onClick={handleExportData} className="btn btn-secondary w-full justify-center">
              <Download size={14} /> Meine Daten exportieren (JSON)
            </button>

            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="btn w-full justify-center text-sm font-medium"
                style={{ background: 'rgba(229,57,53,0.08)', color: '#E53935', border: '1px solid rgba(229,57,53,0.2)' }}>
                <Trash2 size={14} /> Account löschen
              </button>
            ) : (
              <div className="p-4 rounded-xl" style={{ background: 'rgba(229,57,53,0.06)', border: '1px solid rgba(229,57,53,0.2)' }}>
                <p className="text-sm font-medium mb-3" style={{ color: '#E53935' }}>
                  Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <div className="flex gap-2">
                  <button onClick={handleDeleteAccount} disabled={deleteLoading}
                    className="btn flex-1 justify-center text-sm font-semibold"
                    style={{ background: '#E53935', color: 'white' }}>
                    {deleteLoading ? 'Wird gelöscht…' : 'Endgültig löschen'}
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary flex-1 justify-center">
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
