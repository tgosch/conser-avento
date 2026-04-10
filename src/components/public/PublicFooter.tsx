import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
const aventoLogo = '/avento.PNG'
const conserLogo = '/conser.PNG'
import ImpressumModal from '../auth/ImpressumModal'
import PrivacyModal from '../auth/PrivacyModal'
import NdaModal from '../auth/NdaModal'

export default function PublicFooter() {
  const [showImpressum, setShowImpressum] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showNda, setShowNda] = useState(false)

  // Secret Owner Login — 5x click on copyright
  const [showOwnerLogin, setShowOwnerLogin] = useState(false)
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopyrightClick = useCallback(() => {
    clickCountRef.current += 1
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0 }, 2000)
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0
      setShowOwnerLogin(true)
    }
  }, [])

  return (
    <>
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="public-container py-8">
          {/* Mobile: stacked, Desktop: row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Logo + Copyright — secret trigger */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <img src={aventoLogo} alt="Avento" className="h-5 rounded" />
                <img src={conserLogo} alt="Conser" className="h-5 rounded" />
              </div>
              <p className="text-xs select-none cursor-default" style={{ color: 'var(--text-tertiary)' }}
                onClick={handleCopyrightClick}>
                &copy; {new Date().getFullYear()} Conser GmbH
              </p>
            </div>

            {/* Links — wrap on mobile */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link to="/produkte" className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Produkte</Link>
              <Link to="/ueber-uns" className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Über uns</Link>
              <Link to="/kontakt" className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Kontakt</Link>
              <button onClick={() => setShowImpressum(true)} className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Impressum</button>
              <button onClick={() => setShowPrivacy(true)} className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Datenschutz</button>
            </div>
          </div>
        </div>
      </footer>

      {showImpressum && <ImpressumModal onClose={() => setShowImpressum(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showNda && <NdaModal onClose={() => setShowNda(false)} />}
      {showOwnerLogin && <OwnerLoginModal onClose={() => setShowOwnerLogin(false)} />}
    </>
  )
}

/* ── Secret Owner Login Modal ── */
function OwnerLoginModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { loginAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) throw error
      if (data.user.app_metadata?.is_admin !== true) {
        await supabase.auth.signOut()
        toast.error('Kein Zugang.')
        return
      }
      loginAdmin({ isAdmin: true, isPartner: false, email: data.user.email ?? email })
      toast.success('Willkommen, Owner.')
      onClose()
      navigate('/owner/dashboard')
    } catch {
      toast.error('Anmeldung fehlgeschlagen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-xs rounded-2xl border p-6 animate-fade-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--brand)' }}>
            <Lock size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Owner Access</p>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Nur autorisierte Personen</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input type="email" placeholder="E-Mail" required autoFocus value={email}
            onChange={e => setEmail(e.target.value)} className="input-base text-sm" />
          <input type="password" placeholder="Passwort" required value={password}
            onChange={e => setPassword(e.target.value)} className="input-base text-sm" />
          <button type="submit" disabled={loading} className="btn btn-primary w-full text-sm py-2.5">
            {loading ? 'Prüfe...' : <><ArrowRight size={14} /> Einloggen</>}
          </button>
        </form>
        <button onClick={onClose} className="w-full text-center text-xs mt-3 hover-press" style={{ color: 'var(--text-tertiary)' }}>
          Abbrechen
        </button>
      </div>
    </div>
  )
}
