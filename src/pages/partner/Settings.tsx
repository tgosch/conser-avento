import { useState } from 'react'
import { Sun, Moon, Lock, Trash2, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'

const STATUS_LABELS: Record<string, string> = {
  negotiating: 'Verhandlung', active: 'Aktiv', beta: 'Beta', partner: 'Partner',
}

export default function PartnerSettings() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [tab, setTab] = useState<'profile' | 'security' | 'appearance' | 'privacy'>('profile')
  const partner = user?.partner

  // Password change
  const [pw, setPw] = useState({ newPw: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

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
      setPw({ newPw: '', confirm: '' })
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler beim Ändern')
    } finally { setPwLoading(false) }
  }

  const handleExportData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) { toast.error('Bitte erneut anmelden'); return }
      const res = await fetch('/api/user-export', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })
      if (!res.ok) throw new Error()
      const data = await res.text()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `conser-avento-partner-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Daten exportiert')
    } catch {
      toast.error('Export fehlgeschlagen')
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) { toast.error('Bitte erneut anmelden'); return }
      const res = await fetch('/api/user-delete', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      })
      if (!res.ok) throw new Error()
      await supabase.auth.signOut()
      await logout()
      toast.success('Account und alle Daten wurden gelöscht')
    } catch {
      toast.error('Fehler beim Löschen. Bitte kontaktieren Sie uns.')
    } finally { setDeleteLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <h1 className="font-bold text-2xl mb-6" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
        Einstellungen
      </h1>

      <div className="flex gap-1 p-1 rounded-md mb-6" style={{ background: 'var(--surface2)' }}>
        {([
          { key: 'profile', label: 'Profil' },
          { key: 'security', label: 'Sicherheit' },
          { key: 'appearance', label: 'Design' },
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

      {tab === 'security' && (
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

      {tab === 'appearance' && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Design</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {theme === 'dark' ? 'Dunkles Design aktiv' : 'Helles Design aktiv'}
              </p>
            </div>
            <button onClick={toggleTheme} className="btn btn-ghost flex items-center gap-2">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Hell' : 'Dunkel'}
            </button>
          </div>
        </div>
      )}

      {tab === 'privacy' && (
        <div className="card p-6 flex flex-col gap-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Ihre Daten werden gemäß der DSGVO verarbeitet. Bei Fragen:{' '}
            <a href="mailto:torben@conser-avento.de" className="text-accent underline">torben@conser-avento.de</a>
          </p>

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
      )}
    </div>
  )
}
