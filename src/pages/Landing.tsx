import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import NdaModal from '../components/auth/NdaModal'
import PrivacyModal from '../components/auth/PrivacyModal'
import ImpressumModal from '../components/auth/ImpressumModal'
import PasswordStrength from '../components/auth/PasswordStrength'
import aventoLogo from '../assets/avento_kachel.webp'
import conserLogo from '../assets/conser_kachel.webp'

export default function Landing() {
  const { loginAdmin, loginInvestor, loginPartner } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const authCardRef = useRef<HTMLDivElement>(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPwd, setShowLoginPwd] = useState(false)

  const [reg, setReg] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', password2: '' })
  const [consentPrivacy, setConsentPrivacy] = useState(false)
  const [consentNda, setConsentNda] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [showNda, setShowNda] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showImpressum, setShowImpressum] = useState(false)
  const loginAttemptsRef = useRef(0)
  const lockoutUntilRef = useRef(0)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Date.now() < lockoutUntilRef.current) {
      const secs = Math.ceil((lockoutUntilRef.current - Date.now()) / 1000)
      toast.error(`Zu viele Versuche. Bitte ${secs}s warten.`)
      return
    }
    setLoginLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      })
      if (error) throw error
      loginAttemptsRef.current = 0
      const meta = data.user.app_metadata
      if (meta?.is_admin === true) {
        loginAdmin({ isAdmin: true, isPartner: false, email: data.user.email ?? loginEmail.trim() })
        navigate('/owner/dashboard')
      } else if (meta?.is_partner === true) {
        await loginPartner(data.user.id, data.user.email ?? loginEmail.trim())
        navigate('/partner/dashboard')
      } else {
        await loginInvestor(data.user.id, data.user.email ?? loginEmail.trim())
        navigate('/investor/dashboard')
      }
    } catch {
      loginAttemptsRef.current += 1
      if (loginAttemptsRef.current >= 5) {
        lockoutUntilRef.current = Date.now() + 60_000
        loginAttemptsRef.current = 0
        toast.error('Zu viele Fehlversuche. Bitte 60s warten.')
      } else {
        toast.error('Zugangsdaten ungültig.')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const validateRegister = useCallback(() => {
    const nameRe = /^[a-zA-ZäöüßÄÖÜ\s'-]{2,50}$/
    const phoneRe = /^[\d\s+\-()]{7,20}$/
    if (!nameRe.test(reg.first_name)) return 'Vorname ungültig (2–50 Zeichen, nur Buchstaben)'
    if (!nameRe.test(reg.last_name)) return 'Nachname ungültig (2–50 Zeichen, nur Buchstaben)'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email)) return 'E-Mail-Adresse ungültig'
    if (!phoneRe.test(reg.phone)) return 'Telefonnummer ungültig'
    if (reg.password.length < 8) return 'Passwort mind. 8 Zeichen'
    if (reg.password !== reg.password2) return 'Passwörter stimmen nicht überein'
    if (!consentPrivacy) return 'Bitte Datenschutzerklärung akzeptieren'
    if (!consentNda) return 'Bitte NDA akzeptieren'
    return null
  }, [reg, consentPrivacy, consentNda])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateRegister()
    if (err) { toast.error(err); return }
    setRegLoading(true)
    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: reg.email.trim().toLowerCase(),
        password: reg.password,
        options: { data: { first_name: reg.first_name.trim(), last_name: reg.last_name.trim(), phone: reg.phone.trim() } },
      })
      if (authErr) throw authErr
      if (authData.user) {
        await supabase.from('investors').insert([{
          id: authData.user.id,
          first_name: reg.first_name.trim(),
          last_name: reg.last_name.trim(),
          email: reg.email.trim().toLowerCase(),
          phone: reg.phone.trim(),
          consent: true,
          consent_date: new Date().toISOString(),
          nda_accepted: true,
          nda_date: new Date().toISOString(),
        }])
      }
      toast.success(`Willkommen, ${reg.first_name.trim()}! Ihr Zugang wurde eingerichtet.`)
      navigate('/investor/dashboard')
    } catch {
      toast.error('Registrierung fehlgeschlagen')
    } finally {
      setRegLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!loginEmail) { toast.error('Bitte E-Mail eingeben'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail)
    if (error) toast.error(error.message)
    else toast.success('Passwort-Reset E-Mail gesendet')
  }

  const openRegisterTab = () => {
    setTab('register')
    authCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, var(--brand) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* LEFT: Brand (desktop only) */}
        <div className="hidden lg:flex lg:w-[52%] gradient-brand noise-overlay flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <img src={aventoLogo} alt="Avento" className="h-10 rounded-xl" />
            <div className="w-px h-7" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <img src={conserLogo} alt="Conser" className="h-10 rounded-xl" />
          </div>
          <div>
            <p className="label-overline mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Investor Portal</p>
            <h1 className="text-display-2xl text-white mb-6" style={{ maxWidth: 440 }}>
              Die Infrastruktur für die Baubranche
            </h1>
            <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 380 }}>
              Avento ERP + Conser Marktplatz. Das erste vollständig integrierte Ökosystem
              für Handwerksbetriebe in der DACH-Region.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { n: '75.000', l: 'Kunden-Ziel' },
                { n: '€181M',  l: 'Revenue-Ziel' },
                { n: '7',      l: 'Top-Partner' },
              ].map(s => (
                <div key={s.l}>
                  <p className="text-metric-lg text-white mb-0.5">{s.n}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {['DSGVO-konform', 'Made in Germany', 'Seed 2026'].map(b => (
              <span key={b} className="tag tag-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }}>{b}</span>
            ))}
          </div>
        </div>

        {/* RIGHT: Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-sm animate-fade-up" ref={authCardRef}>
            <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
              <img src={aventoLogo} alt="Avento" className="h-8 rounded-lg" />
              <div className="w-px h-5" style={{ background: 'var(--border)' }} />
              <img src={conserLogo} alt="Conser" className="h-8 rounded-lg" />
            </div>

            <div className="card p-6" style={{ boxShadow: 'var(--shadow-xl)' }}>
              <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                {tab === 'login' ? 'Anmelden' : 'Registrieren'}
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                {tab === 'login' ? 'Zugang zum Investor Portal' : 'Kostenlosen Investor-Zugang beantragen'}
              </p>

              <div className="flex gap-1 p-1 rounded-[12px] mb-6" style={{ background: 'var(--surface2)' }}>
                {(['login', 'register'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="flex-1 py-2 rounded-[10px] text-sm font-semibold transition"
                    style={{
                      background: tab === t ? 'var(--surface)' : 'transparent',
                      color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                      boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                    }}>
                    {t === 'login' ? 'Anmelden' : 'Registrieren'}
                  </button>
                ))}
              </div>

              {tab === 'login' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <input type="email" placeholder="E-Mail" required
                    value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    className="input-base" disabled={Date.now() < lockoutUntilRef.current} />
                  <div className="relative">
                    <input type={showLoginPwd ? 'text' : 'password'} placeholder="Passwort" required
                      value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                      className="input-base pr-10" disabled={Date.now() < lockoutUntilRef.current} />
                    <button type="button" onClick={() => setShowLoginPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--text-tertiary)' }}>
                      {showLoginPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <button type="submit" disabled={loginLoading || Date.now() < lockoutUntilRef.current}
                    className="btn btn-primary btn-lg w-full mt-2">
                    {loginLoading ? 'Wird angemeldet…' : 'Anmelden →'}
                  </button>
                  <button type="button" onClick={handleForgotPassword}
                    className="text-xs text-center hover-press" style={{ color: 'var(--text-tertiary)' }}>
                    Passwort vergessen?
                  </button>
                  <div className="border-t pt-3 text-center" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Eigentümer-Zugang über gleiche E-Mail &amp; Passwort
                    </span>
                  </div>
                </form>
              )}

              {tab === 'register' && (
                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                  <input type="text" placeholder="Vorname" required
                    value={reg.first_name} onChange={e => setReg(p => ({ ...p, first_name: e.target.value }))}
                    className="input-base" />
                  <input type="text" placeholder="Nachname" required
                    value={reg.last_name} onChange={e => setReg(p => ({ ...p, last_name: e.target.value }))}
                    className="input-base" />
                  <input type="email" placeholder="E-Mail Adresse" required
                    value={reg.email} onChange={e => setReg(p => ({ ...p, email: e.target.value }))}
                    className="input-base" />
                  <input type="tel" placeholder="Telefonnummer" required
                    value={reg.phone} onChange={e => setReg(p => ({ ...p, phone: e.target.value }))}
                    className="input-base" />
                  <div>
                    <div className="relative">
                      <input type={showRegPwd ? 'text' : 'password'} placeholder="Passwort (min. 8 Zeichen)" required
                        value={reg.password} onChange={e => setReg(p => ({ ...p, password: e.target.value }))}
                        className="input-base pr-10" />
                      <button type="button" onClick={() => setShowRegPwd(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text-secondary)' }}>
                        {showRegPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <PasswordStrength password={reg.password} />
                  </div>
                  <input type="password" placeholder="Passwort wiederholen" required
                    value={reg.password2} onChange={e => setReg(p => ({ ...p, password2: e.target.value }))}
                    className="input-base" />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={consentPrivacy} onChange={e => setConsentPrivacy(e.target.checked)}
                      className="mt-1 w-4 h-4 shrink-0 accent-[#063D3E]" />
                    <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      Ich akzeptiere die{' '}
                      <button type="button" onClick={() => setShowPrivacy(true)} className="text-accent underline font-medium">
                        Datenschutzerklärung
                      </button>{' '}
                      (DSGVO).
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={consentNda} onChange={e => setConsentNda(e.target.checked)}
                      className="mt-1 w-4 h-4 shrink-0 accent-[#063D3E]" />
                    <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      Ich akzeptiere die{' '}
                      <button type="button" onClick={() => setShowNda(true)} className="text-accent underline font-medium">
                        Geheimhaltungsvereinbarung (NDA)
                      </button>.
                    </span>
                  </label>

                  <button type="submit" disabled={regLoading || !consentPrivacy || !consentNda}
                    className="btn btn-primary btn-lg w-full mt-2">
                    {regLoading ? 'Wird registriert…' : 'Zugang beantragen →'}
                  </button>
                  <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Bereits registriert?{' '}
                    <button type="button" onClick={() => setTab('login')} className="font-semibold text-accent">
                      Anmelden →
                    </button>
                  </p>
                </form>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-5">
              <button onClick={() => setShowImpressum(true)} className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>Impressum</button>
              <button onClick={() => setShowPrivacy(true)} className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>Datenschutz</button>
              <button onClick={() => setShowNda(true)} className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>NDA</button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Interesse an einer Beteiligung?{' '}
                <button type="button" onClick={openRegisterTab} className="font-semibold hover-press" style={{ color: 'var(--brand)' }}>
                  Zugang beantragen →
                </button>
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Produktionspartner?{' '}
                <a href="/partner/registrieren" className="font-semibold hover-press" style={{ color: 'var(--brand)' }}>
                  Partner werden →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showNda && <NdaModal onClose={() => setShowNda(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showImpressum && <ImpressumModal onClose={() => setShowImpressum(false)} />}
    </div>
  )
}
