import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Building2, Briefcase } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import NdaModal from '../components/auth/NdaModal'
import PrivacyModal from '../components/auth/PrivacyModal'
import ImpressumModal from '../components/auth/ImpressumModal'
import aventoLogo from '../assets/avento_kachel.webp'
import conserLogo from '../assets/conser_kachel.webp'

type Role = 'investor' | 'partner'
type Step = 'form' | 'login' | 'otp'

export default function Landing() {
  const { user: authUser, loginAdmin, loginInvestor, loginPartner } = useAuth()
  const navigate = useNavigate()
  const authCardRef = useRef<HTMLDivElement>(null)

  const [role, setRole] = useState<Role>('investor')
  const [step, setStep] = useState<Step>('form')
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [loading, setLoading] = useState(false)

  // Auto-redirect when auth state resolves (safety net for OTP race condition)
  useEffect(() => {
    if (!authUser) return
    if (authUser.isAdmin) navigate('/owner/dashboard', { replace: true })
    else if (authUser.isPartner) navigate('/partner/dashboard', { replace: true })
    else navigate('/investor/dashboard', { replace: true })
  }, [authUser, navigate])

  // Investor register
  const [invForm, setInvForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '' })
  const [consentPrivacy, setConsentPrivacy] = useState(false)
  const [consentNda, setConsentNda] = useState(false)

  // Partner register
  const [partnerForm, setPartnerForm] = useState({ first_name: '', last_name: '', email: '', phone: '', company: '', password: '' })

  // Login (shared for both roles)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')

  // OTP
  const OTP_LENGTH = 8
  const [otp, setOtp] = useState(Array(8).fill(''))
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Modals
  const [showNda, setShowNda] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showImpressum, setShowImpressum] = useState(false)

  const activeEmail = mode === 'login'
    ? loginEmail.trim().toLowerCase()
    : role === 'investor'
      ? invForm.email.trim().toLowerCase()
      : partnerForm.email.trim().toLowerCase()

  // ── VALIDATION ──
  const validatePassword = (pw: string) => {
    if (pw.length < 8) return 'Passwort muss mindestens 8 Zeichen haben'
    if (!/[A-Z]/.test(pw)) return 'Passwort muss mindestens einen Großbuchstaben enthalten'
    if (!/[0-9]/.test(pw)) return 'Passwort muss mindestens eine Zahl enthalten'
    return null
  }

  const validateInvestor = useCallback(() => {
    const nameRe = /^[a-zA-ZäöüßÄÖÜ\s'-]{2,50}$/
    const phoneRe = /^[\d\s+\-()]{7,20}$/
    if (!nameRe.test(invForm.first_name)) return 'Vorname ungültig (2–50 Zeichen)'
    if (!nameRe.test(invForm.last_name)) return 'Nachname ungültig (2–50 Zeichen)'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invForm.email)) return 'E-Mail ungültig'
    if (!phoneRe.test(invForm.phone)) return 'Telefonnummer ungültig'
    const pwErr = validatePassword(invForm.password)
    if (pwErr) return pwErr
    if (!consentPrivacy) return 'Bitte Datenschutzerklärung akzeptieren'
    if (!consentNda) return 'Bitte NDA akzeptieren'
    return null
  }, [invForm, consentPrivacy, consentNda])

  const validatePartner = () => {
    const nameRe = /^[a-zA-ZäöüßÄÖÜ\s'-]{2,50}$/
    if (!nameRe.test(partnerForm.first_name)) return 'Vorname ungültig'
    if (!nameRe.test(partnerForm.last_name)) return 'Nachname ungültig'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partnerForm.email)) return 'E-Mail ungültig'
    if (!/^[\d\s+\-()]{7,20}$/.test(partnerForm.phone)) return 'Telefonnummer ungültig'
    if (partnerForm.company.trim().length < 2) return 'Bitte Unternehmen angeben'
    const pwErr = validatePassword(partnerForm.password)
    if (pwErr) return pwErr
    return null
  }

  // ── SUBMIT REGISTRATION ──
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = role === 'investor' ? validateInvestor() : validatePartner()
    if (err) { toast.error(err); return }
    setLoading(true)
    const email = role === 'investor' ? invForm.email.trim().toLowerCase() : partnerForm.email.trim().toLowerCase()
    const password = role === 'investor' ? invForm.password : partnerForm.password
    const metadata = role === 'investor'
      ? { first_name: invForm.first_name.trim(), last_name: invForm.last_name.trim(), phone: invForm.phone.trim() }
      : { first_name: partnerForm.first_name.trim(), last_name: partnerForm.last_name.trim(), phone: partnerForm.phone.trim(), company: partnerForm.company.trim() }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })
      if (error) throw error
      // Supabase sends confirmation email automatically
      // If email confirmation is disabled, user is logged in directly
      if (data.session) {
        // Auto-confirmed — create record and redirect
        const user = data.user!
        if (role === 'investor') {
          await supabase.from('investors').upsert([{
            id: user.id, first_name: invForm.first_name.trim(), last_name: invForm.last_name.trim(),
            email, phone: invForm.phone.trim(), consent: true, consent_date: new Date().toISOString(),
            nda_accepted: true, nda_date: new Date().toISOString(),
          }], { onConflict: 'id' })
          await loginInvestor(user.id, user.email ?? email)
          toast.success(`Willkommen, ${invForm.first_name.trim()}!`)
          navigate('/investor/dashboard')
        } else {
          const initials = `${partnerForm.first_name.trim()[0]}${partnerForm.last_name.trim()[0]}`.toUpperCase()
          await supabase.from('partners').upsert([{
            id: user.id, name: partnerForm.company.trim(), type: 'production' as const, category: '',
            description: `Ansprechpartner: ${partnerForm.first_name.trim()} ${partnerForm.last_name.trim()}`,
            status: 'negotiating' as const, logo_path: null, initials, color: '#063D3E', visible: false, order_index: 99,
          }], { onConflict: 'id' })
          await loginPartner(user.id, user.email ?? email)
          toast.success(`Willkommen, ${partnerForm.company.trim()}!`)
          navigate('/partner/dashboard')
        }
      } else {
        // Email confirmation required — show OTP step
        toast.success('Verifizierungscode wurde per E-Mail gesendet.')
        setMode('register')
        setStep('otp')
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registrierung fehlgeschlagen.'
      if (msg.includes('already registered')) {
        toast.error('Diese E-Mail ist bereits registriert. Bitte melden Sie sich an.')
      } else {
        toast.error(msg)
      }
    }
    finally { setLoading(false) }
  }

  // ── LOGIN WITH PASSWORD ──
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) { toast.error('E-Mail ungültig'); return }
    if (!loginPassword) { toast.error('Bitte Passwort eingeben'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      })
      if (error) throw error
      const user = data.user
      const meta = user.app_metadata
      if (meta?.is_admin === true) {
        loginAdmin({ isAdmin: true, isPartner: false, email: user.email ?? loginEmail })
        navigate('/owner/dashboard')
        return
      }
      const { data: partner } = await supabase.from('partners').select('id').eq('id', user.id).maybeSingle()
      if (partner) {
        await loginPartner(user.id, user.email ?? loginEmail)
        toast.success('Willkommen zurück!')
        navigate('/partner/dashboard')
      } else {
        await loginInvestor(user.id, user.email ?? loginEmail)
        toast.success('Willkommen zurück!')
        navigate('/investor/dashboard')
      }
    } catch { toast.error('E-Mail oder Passwort ungültig.') }
    finally { setLoading(false) }
  }

  // ── FORGOT PASSWORD ──
  const handleForgotPassword = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) { toast.error('Bitte zuerst E-Mail eingeben'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginEmail.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success('Link zum Zurücksetzen wurde per E-Mail gesendet.')
    } catch { toast.error('Fehler beim Senden. Bitte erneut versuchen.') }
    finally { setLoading(false) }
  }

  // ── LOGIN WITH OTP ──
  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) { toast.error('E-Mail ungültig'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: loginEmail.trim().toLowerCase() })
      if (error) throw error
      toast.success('Verifizierungscode wurde per E-Mail gesendet.')
      setMode('login')
      setStep('otp')
    } catch { toast.error('Code konnte nicht gesendet werden.') }
    finally { setLoading(false) }
  }

  // ── OTP INPUT ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]; next[index] = value.slice(-1); setOtp(next)
    if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
  }
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
  }
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) { setOtp(pasted.split('')); otpRefs.current[OTP_LENGTH - 1]?.focus() }
  }

  // ── VERIFY OTP ──
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== OTP_LENGTH) { toast.error(`Bitte den ${OTP_LENGTH}-stelligen Code eingeben.`); return }
    setLoading(true)
    // Safety timeout — if verify hangs for 15s, reset loading state
    const timeout = setTimeout(() => {
      setLoading(false)
      toast.error('Zeitüberschreitung. Bitte erneut versuchen.')
    }, 15_000)
    try {
      // signup-Codes brauchen type 'signup', Login-OTP braucht 'email'
      const otpType = mode === 'register' ? 'signup' : 'email'
      let data, error
      ;({ data, error } = await supabase.auth.verifyOtp({ email: activeEmail, token: code, type: otpType }))

      // Fallback: wenn signup fehlschlägt, versuche 'email' (manche Supabase-Configs)
      if (error && otpType === 'signup') {
        ;({ data, error } = await supabase.auth.verifyOtp({ email: activeEmail, token: code, type: 'email' }))
      }
      if (error) throw error
      if (!data.user) throw new Error('Kein Benutzer')

      const meta = data.user.app_metadata
      if (meta?.is_admin === true) {
        loginAdmin({ isAdmin: true, isPartner: false, email: data.user.email ?? activeEmail })
        navigate('/owner/dashboard')
        return
      }

      if (mode === 'register') {
        if (role === 'investor') {
          await supabase.from('investors').upsert([{
            id: data.user.id,
            first_name: invForm.first_name.trim(),
            last_name: invForm.last_name.trim(),
            email: activeEmail,
            phone: invForm.phone.trim(),
            consent: true,
            consent_date: new Date().toISOString(),
            nda_accepted: true,
            nda_date: new Date().toISOString(),
          }], { onConflict: 'id' })
          await loginInvestor(data.user.id, data.user.email ?? activeEmail)
          toast.success(`Willkommen, ${invForm.first_name.trim()}!`)
          navigate('/investor/dashboard')
        } else {
          const initials = `${partnerForm.first_name.trim()[0]}${partnerForm.last_name.trim()[0]}`.toUpperCase()
          await supabase.from('partners').upsert([{
            id: data.user.id, name: partnerForm.company.trim(), type: 'production' as const, category: '',
            description: `Ansprechpartner: ${partnerForm.first_name.trim()} ${partnerForm.last_name.trim()}`,
            status: 'negotiating' as const, logo_path: null, initials, color: '#063D3E', visible: false, order_index: 99,
          }], { onConflict: 'id' })
          await loginPartner(data.user.id, data.user.email ?? activeEmail)
          toast.success(`Willkommen, ${partnerForm.company.trim()}!`)
          navigate('/partner/dashboard')
        }
      } else {
        // Login — resolve role and navigate directly (don't rely on useEffect alone)
        const userId = data.user.id
        const email = data.user.email ?? activeEmail
        const { data: partner } = await supabase.from('partners').select('id').eq('id', userId).maybeSingle()
        if (partner) {
          await loginPartner(userId, email)
          toast.success('Willkommen zurück!')
          navigate('/partner/dashboard', { replace: true })
        } else {
          await loginInvestor(userId, email)
          toast.success('Willkommen zurück!')
          navigate('/investor/dashboard', { replace: true })
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Code ungültig oder abgelaufen.'
      toast.error(msg)
    }
    finally { clearTimeout(timeout); setLoading(false) }
  }

  const handleResend = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: activeEmail })
      if (error) throw error
      toast.success('Neuer Code gesendet.')
      setOtp(Array(OTP_LENGTH).fill('')); otpRefs.current[0]?.focus()
    } catch { toast.error('Fehler beim Senden.') }
    finally { setLoading(false) }
  }

  const switchRole = (r: Role) => { setRole(r); setStep('form'); setMode('register'); setLoginMethod('password') }

  // OTP input section rendered inline (NOT as a sub-component to avoid remounting)

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, var(--brand) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* LEFT: Brand (desktop) */}
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
              {role === 'investor' ? 'Die Infrastruktur für die Baubranche' : 'Werden Sie Produktionspartner'}
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
            <div className="lg:hidden flex items-center gap-2 justify-center mb-6">
              <img src={aventoLogo} alt="Avento" className="h-8 rounded-lg" />
              <div className="w-px h-5" style={{ background: 'var(--border)' }} />
              <img src={conserLogo} alt="Conser" className="h-8 rounded-lg" />
            </div>

            {/* ROLE SWITCH */}
            <div className="flex gap-2 mb-4" role="tablist" aria-label="Portal auswählen">
              {([
                { key: 'investor' as Role, icon: Briefcase, label: 'Interessent' },
                { key: 'partner' as Role, icon: Building2, label: 'Partner' },
              ]).map(r => (
                <button key={r.key} onClick={() => switchRole(r.key)}
                  role="tab" aria-selected={role === r.key} aria-label={`${r.label} Portal`}
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

              {/* ── OTP SCREEN (shared) ── */}
              {/* ── OTP SCREEN (inline to prevent remounting/focus loss) ── */}
              {step === 'otp' && (
                <>
                  <button onClick={() => setStep(mode === 'login' ? 'login' : 'form')}
                    className="flex items-center gap-1 text-xs font-semibold mb-4 hover-press"
                    style={{ color: 'var(--text-tertiary)' }}>
                    <ArrowLeft size={12} /> Zurück
                  </button>
                  <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Code eingeben</h2>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>8-stelliger Code gesendet an</p>
                  <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{activeEmail}</p>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                  </div>
                  <form onSubmit={handleVerify}>
                    <div className="flex items-center gap-1.5 mb-5" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <span key={i} className="contents">
                          {i === 4 && <span className="text-sm font-bold" style={{ color: 'var(--text-tertiary)', margin: '0 2px' }}>–</span>}
                          <input ref={el => { otpRefs.current[i] = el }}
                            type="text" inputMode="numeric" maxLength={1} value={digit}
                            onChange={e => handleOtpChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className="flex-1 min-w-0 h-11 text-center text-base font-bold rounded-lg border-2 transition-all focus:outline-none"
                            style={{ background: 'var(--surface2)', color: 'var(--text-primary)', borderColor: digit ? 'var(--brand)' : 'var(--border)', fontFamily: 'var(--font-mono)' }} />
                        </span>
                      ))}
                    </div>
                    <button type="submit" disabled={loading || otp.join('').length !== OTP_LENGTH} className="btn btn-primary btn-lg w-full">
                      {loading ? 'Wird verifiziert…' : 'Verifizieren & Zugang erhalten'}
                    </button>
                  </form>
                  <div className="text-center mt-4">
                    <button onClick={handleResend} disabled={loading} className="text-xs font-semibold hover-press" style={{ color: 'var(--brand)' }}>
                      Code erneut senden
                    </button>
                  </div>
                </>
              )}

              {/* ── LOGIN SCREEN (shared) ── */}
              {step === 'login' && (
                <>
                  <button onClick={() => setStep('form')}
                    className="flex items-center gap-1 text-xs font-semibold mb-4 hover-press"
                    style={{ color: 'var(--text-tertiary)' }}>
                    <ArrowLeft size={12} /> Zurück
                  </button>
                  <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Anmelden</h2>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    {loginMethod === 'password' ? 'Mit E-Mail und Passwort anmelden.' : 'E-Mail eingeben — Sie erhalten einen 8-stelligen Code.'}
                  </p>

                  {loginMethod === 'password' ? (
                    <form onSubmit={handlePasswordLogin} className="flex flex-col gap-3">
                      <input type="email" placeholder="E-Mail Adresse" required autoFocus value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)} className="input-base" />
                      <input type="password" placeholder="Passwort" required value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)} className="input-base" />
                      <div className="text-right -mt-1">
                        <button type="button" onClick={handleForgotPassword} disabled={loading}
                          className="text-xs font-medium hover-press" style={{ color: 'var(--text-tertiary)' }}>
                          Passwort vergessen?
                        </button>
                      </div>
                      <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                        {loading ? 'Wird angemeldet…' : <>Anmelden <ArrowRight size={14} /></>}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleOtpLogin} className="flex flex-col gap-3">
                      <input type="email" placeholder="E-Mail Adresse" required autoFocus value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)} className="input-base" />
                      <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-1">
                        {loading ? 'Wird gesendet…' : <>Code senden <ArrowRight size={14} /></>}
                      </button>
                    </form>
                  )}

                  <div className="border-t mt-4 pt-3 text-center" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                      className="text-xs font-semibold hover-press"
                      style={{ color: 'var(--brand)' }}>
                      {loginMethod === 'password' ? 'Stattdessen per E-Mail-Code anmelden →' : 'Stattdessen mit Passwort anmelden →'}
                    </button>
                  </div>
                </>
              )}

              {/* ── INVESTOR REGISTER ── */}
              {step === 'form' && role === 'investor' && (
                <>
                  <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Investor werden</h2>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    Konto erstellen und sofort Zugang erhalten.
                  </p>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--surface3)' }} />
                  </div>
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Vorname *" required value={invForm.first_name}
                        onChange={e => setInvForm(p => ({ ...p, first_name: e.target.value }))} className="input-base" />
                      <input type="text" placeholder="Nachname *" required value={invForm.last_name}
                        onChange={e => setInvForm(p => ({ ...p, last_name: e.target.value }))} className="input-base" />
                    </div>
                    <input type="email" placeholder="E-Mail Adresse *" required value={invForm.email}
                      onChange={e => setInvForm(p => ({ ...p, email: e.target.value }))} className="input-base" />
                    <input type="tel" placeholder="Telefonnummer *" required value={invForm.phone}
                      onChange={e => setInvForm(p => ({ ...p, phone: e.target.value }))} className="input-base" />
                    <input type="password" placeholder="Passwort * (min. 8, Großbuchstabe + Zahl)" required minLength={8} value={invForm.password}
                      onChange={e => setInvForm(p => ({ ...p, password: e.target.value }))} className="input-base" />
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
                    <button type="submit" disabled={loading || !consentPrivacy || !consentNda} className="btn btn-primary btn-lg w-full mt-2">
                      {loading ? 'Wird erstellt…' : <>Konto erstellen <ArrowRight size={14} /></>}
                    </button>
                  </form>
                  <div className="border-t mt-4 pt-3 text-center" style={{ borderColor: 'var(--border)' }}>
                    <button onClick={() => setStep('login')} className="text-sm font-semibold hover-press" style={{ color: 'var(--brand)' }}>
                      Bereits registriert? Anmelden →
                    </button>
                  </div>
                </>
              )}

              {/* ── PARTNER REGISTER ── */}
              {step === 'form' && role === 'partner' && (
                <>
                  <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Partner werden</h2>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    Kostenlos registrieren und sofort Zugang erhalten.
                  </p>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--surface3)' }} />
                  </div>
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
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
                    <input type="password" placeholder="Passwort * (min. 8, Großbuchstabe + Zahl)" required minLength={8} value={partnerForm.password}
                      onChange={e => setPartnerForm(p => ({ ...p, password: e.target.value }))} className="input-base" />
                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
                      {loading ? 'Wird erstellt…' : <>Konto erstellen <ArrowRight size={14} /></>}
                    </button>
                  </form>
                  <div className="border-t mt-4 pt-3 text-center" style={{ borderColor: 'var(--border)' }}>
                    <button onClick={() => setStep('login')} className="text-sm font-semibold hover-press" style={{ color: 'var(--brand)' }}>
                      Bereits registriert? Anmelden →
                    </button>
                  </div>
                </>
              )}
            </div>

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
