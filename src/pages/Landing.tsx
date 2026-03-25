import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, ArrowLeft, Building2, Briefcase } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import NdaModal from '../components/auth/NdaModal'
import PrivacyModal from '../components/auth/PrivacyModal'
import ImpressumModal from '../components/auth/ImpressumModal'
import PasswordStrength from '../components/auth/PasswordStrength'
import aventoLogo from '../assets/avento_kachel.webp'
import conserLogo from '../assets/conser_kachel.webp'

type Role = 'investor' | 'partner'
type InvestorTab = 'login' | 'register'
type PartnerStep = 'form' | 'login' | 'otp'

export default function Landing() {
  const { loginAdmin, loginInvestor, loginPartner } = useAuth()
  const navigate = useNavigate()
  const authCardRef = useRef<HTMLDivElement>(null)

  // Role switch
  const [role, setRole] = useState<Role>('investor')

  // ── INVESTOR STATE ──
  const [investorTab, setInvestorTab] = useState<InvestorTab>('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [reg, setReg] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', password2: '' })
  const [consentPrivacy, setConsentPrivacy] = useState(false)
  const [consentNda, setConsentNda] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [showRegPwd, setShowRegPwd] = useState(false)
  const loginAttemptsRef = useRef(0)
  const lockoutUntilRef = useRef(0)

  // ── PARTNER STATE ──
  const [partnerStep, setPartnerStep] = useState<PartnerStep>('form')
  const [partnerMode, setPartnerMode] = useState<'register' | 'login'>('register')
  const [partnerLoading, setPartnerLoading] = useState(false)
  const [partnerForm, setPartnerForm] = useState({ first_name: '', last_name: '', email: '', phone: '', company: '' })
  const [partnerLoginEmail, setPartnerLoginEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Modals
  const [showNda, setShowNda] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showImpressum, setShowImpressum] = useState(false)

  // ── INVESTOR HANDLERS ──
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
        email: loginEmail.trim(), password: loginPassword,
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
    } finally { setLoginLoading(false) }
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
        email: reg.email.trim().toLowerCase(), password: reg.password,
        options: { data: { first_name: reg.first_name.trim(), last_name: reg.last_name.trim(), phone: reg.phone.trim() } },
      })
      if (authErr) throw authErr
      if (authData.user) {
        await supabase.from('investors').insert([{
          id: authData.user.id, first_name: reg.first_name.trim(), last_name: reg.last_name.trim(),
          email: reg.email.trim().toLowerCase(), phone: reg.phone.trim(),
          consent: true, consent_date: new Date().toISOString(), nda_accepted: true, nda_date: new Date().toISOString(),
        }])
      }
      toast.success(`Willkommen, ${reg.first_name.trim()}! Ihr Zugang wurde eingerichtet.`)
      navigate('/investor/dashboard')
    } catch { toast.error('Registrierung fehlgeschlagen') }
    finally { setRegLoading(false) }
  }

  const handleForgotPassword = async () => {
    if (!loginEmail) { toast.error('Bitte E-Mail eingeben'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail)
    if (error) toast.error(error.message)
    else toast.success('Passwort-Reset E-Mail gesendet')
  }

  // ── PARTNER HANDLERS ──
  const activePartnerEmail = partnerMode === 'login'
    ? partnerLoginEmail.trim().toLowerCase()
    : partnerForm.email.trim().toLowerCase()

  const handlePartnerRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const nameRe = /^[a-zA-ZäöüßÄÖÜ\s'-]{2,50}$/
    if (!nameRe.test(partnerForm.first_name)) { toast.error('Vorname ungültig'); return }
    if (!nameRe.test(partnerForm.last_name)) { toast.error('Nachname ungültig'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerForm.email)) { toast.error('E-Mail ungültig'); return }
    if (!/^[\d\s+\-()]{7,20}$/.test(partnerForm.phone)) { toast.error('Telefonnummer ungültig'); return }
    if (partnerForm.company.trim().length < 2) { toast.error('Bitte Unternehmen angeben'); return }
    setPartnerLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: partnerForm.email.trim().toLowerCase(),
        options: { data: { first_name: partnerForm.first_name.trim(), last_name: partnerForm.last_name.trim(), phone: partnerForm.phone.trim(), company: partnerForm.company.trim() } },
      })
      if (error) throw error
      toast.success('Verifizierungscode wurde per E-Mail gesendet.')
      setPartnerMode('register')
      setPartnerStep('otp')
    } catch { toast.error('Code konnte nicht gesendet werden.') }
    finally { setPartnerLoading(false) }
  }

  const handlePartnerQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerLoginEmail)) { toast.error('E-Mail ungültig'); return }
    setPartnerLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: partnerLoginEmail.trim().toLowerCase() })
      if (error) throw error
      toast.success('Verifizierungscode wurde per E-Mail gesendet.')
      setPartnerMode('login')
      setPartnerStep('otp')
    } catch { toast.error('Code konnte nicht gesendet werden.') }
    finally { setPartnerLoading(false) }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]; next[index] = value.slice(-1); setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
  }
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus() }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Bitte den 6-stelligen Code eingeben.'); return }
    setPartnerLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email: activePartnerEmail, token: code, type: 'email' })
      if (error) throw error
      if (!data.user) throw new Error('Kein Benutzer')
      if (partnerMode === 'register') {
        const initials = `${partnerForm.first_name.trim()[0]}${partnerForm.last_name.trim()[0]}`.toUpperCase()
        await supabase.from('partners').upsert([{
          id: data.user.id, name: partnerForm.company.trim(), type: 'production' as const, category: '',
          description: `Ansprechpartner: ${partnerForm.first_name.trim()} ${partnerForm.last_name.trim()}`,
          status: 'negotiating' as const, logo_path: null, initials, color: '#063D3E', visible: false, order_index: 99,
        }])
      }
      await loginPartner(data.user.id, data.user.email ?? activePartnerEmail)
      toast.success(partnerMode === 'register' ? `Willkommen, ${partnerForm.company.trim()}!` : 'Willkommen zurück!')
      navigate('/partner/dashboard')
    } catch { toast.error('Code ungültig oder abgelaufen.') }
    finally { setPartnerLoading(false) }
  }

  const handleResendOtp = async () => {
    setPartnerLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: activePartnerEmail })
      if (error) throw error
      toast.success('Neuer Code wurde gesendet.')
      setOtp(['', '', '', '', '', '']); otpRefs.current[0]?.focus()
    } catch { toast.error('Code konnte nicht gesendet werden.') }
    finally { setPartnerLoading(false) }
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
            <p className="label-overline mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {role === 'investor' ? 'Investor Portal' : 'Partner Portal'}
            </p>
            <h1 className="text-display-2xl text-white mb-6" style={{ maxWidth: 440 }}>
              {role === 'investor'
                ? 'Die Infrastruktur für die Baubranche'
                : 'Werden Sie Produktionspartner'}
            </h1>
            <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 380 }}>
              {role === 'investor'
                ? 'Avento ERP + Conser Marktplatz. Das erste vollständig integrierte Ökosystem für Handwerksbetriebe in der DACH-Region.'
                : 'Zugang zu 75.000 Handwerksbetrieben. Automatisierte Bestellungen über Avento ERP. Keine Setup-Kosten.'}
            </p>
            <div className="grid grid-cols-3 gap-6">
              {(role === 'investor' ? [
                { n: '75.000', l: 'Kunden-Ziel' }, { n: '€181M', l: 'Revenue-Ziel' }, { n: '7', l: 'Top-Partner' },
              ] : [
                { n: '75.000', l: 'Zielkunden' }, { n: '€0', l: 'Setup-Kosten' }, { n: '2-4 Wo.', l: 'Onboarding' },
              ]).map(s => (
                <div key={s.l}>
                  <p className="text-metric-lg text-white mb-0.5">{s.n}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {['DSGVO-konform', 'Made in Germany', role === 'investor' ? 'Seed 2026' : 'Keine Bindung'].map(b => (
              <span key={b} className="tag tag-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }}>{b}</span>
            ))}
          </div>
        </div>

        {/* RIGHT: Auth */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-sm animate-fade-up" ref={authCardRef}>
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 justify-center mb-6">
              <img src={aventoLogo} alt="Avento" className="h-8 rounded-lg" />
              <div className="w-px h-5" style={{ background: 'var(--border)' }} />
              <img src={conserLogo} alt="Conser" className="h-8 rounded-lg" />
            </div>

            {/* ── ROLE SWITCH ── */}
            <div className="flex gap-2 mb-4">
              {([
                { key: 'investor' as Role, icon: Briefcase, label: 'Interessent' },
                { key: 'partner' as Role, icon: Building2, label: 'Partner' },
              ]).map(r => (
                <button key={r.key} onClick={() => { setRole(r.key); setPartnerStep('form') }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition"
                  style={{
                    background: role === r.key ? 'var(--brand)' : 'var(--surface)',
                    color: role === r.key ? 'white' : 'var(--text-secondary)',
                    border: role === r.key ? 'none' : '1px solid var(--border)',
                  }}>
                  <r.icon size={15} /> {r.label}
                </button>
              ))}
            </div>

            <div className="card p-6" style={{ boxShadow: 'var(--shadow-xl)' }}>

              {/* ════════════════════ INVESTOR FLOW ════════════════════ */}
              {role === 'investor' && (
                <>
                  <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                    {investorTab === 'login' ? 'Anmelden' : 'Registrieren'}
                  </h2>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    {investorTab === 'login' ? 'Zugang zum Investor Portal' : 'Kostenlosen Investor-Zugang beantragen'}
                  </p>

                  <div className="flex gap-1 p-1 rounded-[12px] mb-5" style={{ background: 'var(--surface2)' }}>
                    {(['login', 'register'] as const).map(t => (
                      <button key={t} onClick={() => setInvestorTab(t)}
                        className="flex-1 py-2 rounded-[10px] text-sm font-semibold transition"
                        style={{
                          background: investorTab === t ? 'var(--surface)' : 'transparent',
                          color: investorTab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                          boxShadow: investorTab === t ? 'var(--shadow-sm)' : 'none',
                        }}>
                        {t === 'login' ? 'Anmelden' : 'Registrieren'}
                      </button>
                    ))}
                  </div>

                  {investorTab === 'login' && (
                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
                      <input type="email" placeholder="E-Mail" required value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)} className="input-base"
                        disabled={Date.now() < lockoutUntilRef.current} />
                      <div className="relative">
                        <input type={showLoginPwd ? 'text' : 'password'} placeholder="Passwort" required
                          value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                          className="input-base pr-10" disabled={Date.now() < lockoutUntilRef.current} />
                        <button type="button" onClick={() => setShowLoginPwd(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
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
                    </form>
                  )}

                  {investorTab === 'register' && (
                    <form onSubmit={handleRegister} className="flex flex-col gap-3">
                      <input type="text" placeholder="Vorname" required value={reg.first_name}
                        onChange={e => setReg(p => ({ ...p, first_name: e.target.value }))} className="input-base" />
                      <input type="text" placeholder="Nachname" required value={reg.last_name}
                        onChange={e => setReg(p => ({ ...p, last_name: e.target.value }))} className="input-base" />
                      <input type="email" placeholder="E-Mail Adresse" required value={reg.email}
                        onChange={e => setReg(p => ({ ...p, email: e.target.value }))} className="input-base" />
                      <input type="tel" placeholder="Telefonnummer" required value={reg.phone}
                        onChange={e => setReg(p => ({ ...p, phone: e.target.value }))} className="input-base" />
                      <div>
                        <div className="relative">
                          <input type={showRegPwd ? 'text' : 'password'} placeholder="Passwort (min. 8 Zeichen)" required
                            value={reg.password} onChange={e => setReg(p => ({ ...p, password: e.target.value }))}
                            className="input-base pr-10" />
                          <button type="button" onClick={() => setShowRegPwd(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                            {showRegPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        <PasswordStrength password={reg.password} />
                      </div>
                      <input type="password" placeholder="Passwort wiederholen" required value={reg.password2}
                        onChange={e => setReg(p => ({ ...p, password2: e.target.value }))} className="input-base" />
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={consentPrivacy} onChange={e => setConsentPrivacy(e.target.checked)}
                          className="mt-1 w-4 h-4 shrink-0 accent-[#063D3E]" />
                        <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                          Ich akzeptiere die{' '}
                          <button type="button" onClick={() => setShowPrivacy(true)} className="text-accent underline font-medium">Datenschutzerklärung</button> (DSGVO).
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={consentNda} onChange={e => setConsentNda(e.target.checked)}
                          className="mt-1 w-4 h-4 shrink-0 accent-[#063D3E]" />
                        <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                          Ich akzeptiere die{' '}
                          <button type="button" onClick={() => setShowNda(true)} className="text-accent underline font-medium">Geheimhaltungsvereinbarung (NDA)</button>.
                        </span>
                      </label>
                      <button type="submit" disabled={regLoading || !consentPrivacy || !consentNda}
                        className="btn btn-primary btn-lg w-full mt-2">
                        {regLoading ? 'Wird registriert…' : 'Zugang beantragen →'}
                      </button>
                      <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Bereits registriert?{' '}
                        <button type="button" onClick={() => setInvestorTab('login')} className="font-semibold text-accent">Anmelden →</button>
                      </p>
                    </form>
                  )}
                </>
              )}

              {/* ════════════════════ PARTNER FLOW ════════════════════ */}
              {role === 'partner' && partnerStep === 'form' && (
                <>
                  <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Partner werden</h2>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    Kostenlos registrieren. Kein Passwort nötig — Zugang per E-Mail-Code.
                  </p>

                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--surface3)' }} />
                  </div>

                  <form onSubmit={handlePartnerRegister} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Vorname *" required value={partnerForm.first_name}
                        onChange={e => setPartnerForm(p => ({ ...p, first_name: e.target.value }))} className="input-base" />
                      <input type="text" placeholder="Nachname *" required value={partnerForm.last_name}
                        onChange={e => setPartnerForm(p => ({ ...p, last_name: e.target.value }))} className="input-base" />
                    </div>
                    <input type="text" placeholder="Unternehmen *" required value={partnerForm.company}
                      onChange={e => setPartnerForm(p => ({ ...p, company: e.target.value }))} className="input-base" />
                    <input type="email" placeholder="E-Mail Adresse *" required value={partnerForm.email}
                      onChange={e => setPartnerForm(p => ({ ...p, email: e.target.value }))} className="input-base" />
                    <input type="tel" placeholder="Telefonnummer *" required value={partnerForm.phone}
                      onChange={e => setPartnerForm(p => ({ ...p, phone: e.target.value }))} className="input-base" />
                    <button type="submit" disabled={partnerLoading} className="btn btn-primary btn-lg w-full mt-2">
                      {partnerLoading ? 'Wird gesendet…' : <>Weiter <ArrowRight size={14} /></>}
                    </button>
                  </form>

                  <div className="border-t mt-4 pt-3 text-center" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Bereits registriert?</p>
                    <button onClick={() => setPartnerStep('login')}
                      className="text-sm font-semibold hover-press" style={{ color: 'var(--brand)' }}>
                      Per E-Mail-Code anmelden →
                    </button>
                  </div>
                </>
              )}

              {role === 'partner' && partnerStep === 'login' && (
                <>
                  <button onClick={() => setPartnerStep('form')}
                    className="flex items-center gap-1 text-xs font-semibold mb-4 hover-press"
                    style={{ color: 'var(--text-tertiary)' }}>
                    <ArrowLeft size={12} /> Zurück
                  </button>
                  <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Partner-Login</h2>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    E-Mail eingeben — Sie erhalten einen 6-stelligen Code.
                  </p>
                  <form onSubmit={handlePartnerQuickLogin} className="flex flex-col gap-3">
                    <input type="email" placeholder="E-Mail Adresse" required autoFocus value={partnerLoginEmail}
                      onChange={e => setPartnerLoginEmail(e.target.value)} className="input-base" />
                    <button type="submit" disabled={partnerLoading} className="btn btn-primary btn-lg w-full mt-1">
                      {partnerLoading ? 'Wird gesendet…' : <>Code senden <ArrowRight size={14} /></>}
                    </button>
                  </form>
                </>
              )}

              {role === 'partner' && partnerStep === 'otp' && (
                <>
                  <button onClick={() => setPartnerStep(partnerMode === 'login' ? 'login' : 'form')}
                    className="flex items-center gap-1 text-xs font-semibold mb-4 hover-press"
                    style={{ color: 'var(--text-tertiary)' }}>
                    <ArrowLeft size={12} /> Zurück
                  </button>
                  <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Code eingeben</h2>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>6-stelliger Code gesendet an</p>
                  <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{activePartnerEmail}</p>

                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                  </div>

                  <form onSubmit={handleVerifyOtp}>
                    <div className="flex gap-2 justify-center mb-5" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input key={i} ref={el => { otpRefs.current[i] = el }}
                          type="text" inputMode="numeric" maxLength={1} value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none"
                          style={{
                            background: 'var(--surface2)', color: 'var(--text-primary)',
                            borderColor: digit ? 'var(--brand)' : 'var(--border)', fontFamily: 'var(--font-mono)',
                          }}
                          autoFocus={i === 0} />
                      ))}
                    </div>
                    <button type="submit" disabled={partnerLoading || otp.join('').length !== 6}
                      className="btn btn-primary btn-lg w-full">
                      {partnerLoading ? 'Wird verifiziert…' : 'Verifizieren & Zugang erhalten'}
                    </button>
                  </form>
                  <div className="text-center mt-4">
                    <button onClick={handleResendOtp} disabled={partnerLoading}
                      className="text-xs font-semibold hover-press" style={{ color: 'var(--brand)' }}>
                      Code erneut senden
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Legal Links */}
            <div className="flex justify-center gap-4 mt-5">
              <button onClick={() => setShowImpressum(true)} className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>Impressum</button>
              <button onClick={() => setShowPrivacy(true)} className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>Datenschutz</button>
              <button onClick={() => setShowNda(true)} className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>NDA</button>
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
