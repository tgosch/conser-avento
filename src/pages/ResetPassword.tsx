import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
const aventoLogo = '/avento.PNG'
const conserLogo = '/conser.PNG'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { setPasswordRecovery } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { toast.error('Passwort muss mindestens 8 Zeichen haben'); return }
    if (password !== confirm) { toast.error('Passwörter stimmen nicht überein'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setPasswordRecovery(false)
      setDone(true)
      toast.success('Passwort erfolgreich geändert!')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Fehler beim Ändern des Passworts.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex items-center gap-2 justify-center mb-6">
          <img src={aventoLogo} alt="Avento" className="h-8 rounded-lg" />
          <div className="w-px h-5" style={{ background: 'var(--border)' }} />
          <img src={conserLogo} alt="Conser" className="h-8 rounded-lg" />
        </div>

        <div className="card p-6" style={{ boxShadow: 'var(--shadow-xl)' }}>
          {done ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--brand-dim)' }}>
                  <CheckCircle size={24} style={{ color: 'var(--brand)' }} />
                </div>
              </div>
              <h2 className="font-bold text-lg mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
                Passwort geändert
              </h2>
              <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-secondary)' }}>
                Ihr Passwort wurde erfolgreich aktualisiert. Sie können sich jetzt anmelden.
              </p>
              <button onClick={() => navigate('/')} className="btn btn-primary btn-lg w-full">
                Zur Anmeldung <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--brand-dim)' }}>
                  <Lock size={18} style={{ color: 'var(--brand)' }} />
                </div>
                <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  Neues Passwort setzen
                </h2>
              </div>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                Geben Sie Ihr neues Passwort ein. Mindestens 8 Zeichen.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="Neues Passwort *"
                  required
                  minLength={8}
                  autoFocus
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-base"
                />
                <input
                  type="password"
                  placeholder="Passwort bestätigen *"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="input-base"
                />
                {password && confirm && password !== confirm && (
                  <p className="text-xs" style={{ color: 'var(--error, #E53935)' }}>
                    Passwörter stimmen nicht überein
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading || password.length < 8 || password !== confirm}
                  className="btn btn-primary btn-lg w-full mt-2"
                >
                  {loading ? 'Wird gespeichert…' : <>Passwort ändern <ArrowRight size={14} /></>}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-4">
          <button onClick={() => navigate('/')} className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>
            Zurück zur Anmeldung
          </button>
        </div>
      </div>
    </div>
  )
}
