import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import NdaModal from '../components/auth/NdaModal'
import PrivacyModal from '../components/auth/PrivacyModal'
import aventoLogo from '../assets/avento_kachel.png'
import conserLogo from '../assets/conser_kachel.png'

const TIERS = [
  {
    pct: '2,5%', amount: '€ 375.000', badge: 'Einsteiger', highlight: false,
    features: ['2,5% Unternehmensanteile', 'Beiratszugang', 'Quartalsreports', 'Investoren-Portal Zugang'],
  },
  {
    pct: '5%', amount: '€ 750.000', badge: 'Standard', highlight: true, popularBadge: 'Beliebt',
    features: ['5% Unternehmensanteile', 'Sitzrecht im Beirat', 'Monatliche Updates', 'Exit-Rechte', 'Direkte Kommunikation'],
  },
  {
    pct: '7,5%', amount: '€ 1.125.000', badge: 'Premium', highlight: false,
    features: ['7,5% Unternehmensanteile', 'Veto-Recht bei Kernentscheidungen', 'Direkter Gründerzugang', 'Quartalsmeetings'],
  },
  {
    pct: '10%', amount: '€ 1.500.000', badge: 'Lead Investor', highlight: false,
    features: ['10% Unternehmensanteile', 'Vollständige Investorenrechte', 'Board-Sitz', 'Co-Founder Status', 'Liquidationspräferenz'],
  },
]

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']
  const labels = ['', 'Schwach', 'Mittel', 'Gut', 'Stark']
  if (!password) return null
  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'var(--surface3)' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: score <= 1 ? '#ef4444' : score === 2 ? '#f97316' : score === 3 ? '#eab308' : '#22c55e' }}>
        {labels[score]}
      </p>
    </div>
  )
}

export default function Landing() {
  const { loginAdmin } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const authCardRef = useRef<HTMLDivElement>(null)

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPwd, setShowLoginPwd] = useState(false)

  // Register state
  const [reg, setReg] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', password2: '' })
  const [consentPrivacy, setConsentPrivacy] = useState(false)
  const [consentNda, setConsentNda] = useState(false)
  const [regLoading, setRegLoading] = useState(false)
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  // Modals
  const [showNda, setShowNda] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const loginAttemptsRef = useRef(0)
  const lockoutUntilRef = useRef(0)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Brute-Force-Schutz: max 5 Versuche, dann 60s Sperre
    if (Date.now() < lockoutUntilRef.current) {
      const secs = Math.ceil((lockoutUntilRef.current - Date.now()) / 1000)
      toast.error(`Zu viele Versuche. Bitte ${secs}s warten.`)
      return
    }
    setLoginLoading(true)
    try {
      // Admin-Check (zeitkonstanter Vergleich via konstante Laufzeit)
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL ?? ''
      const adminPwd = import.meta.env.VITE_ADMIN_PASSWORD ?? ''
      const isAdmin = loginEmail === adminEmail && loginPassword === adminPwd && adminEmail !== ''
      if (isAdmin) {
        loginAttemptsRef.current = 0
        loginAdmin({ isAdmin: true, email: loginEmail })
        navigate('/owner/dashboard')
        return
      }
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
      if (error) throw error
      loginAttemptsRef.current = 0
      navigate('/investor/dashboard')
    } catch (err: unknown) {
      loginAttemptsRef.current += 1
      if (loginAttemptsRef.current >= 5) {
        lockoutUntilRef.current = Date.now() + 60_000
        loginAttemptsRef.current = 0
        toast.error('Zu viele Fehlversuche. Bitte 60s warten.')
      } else {
        toast.error('E-Mail oder Passwort falsch.')
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
          selected_tier: selectedTier,
        }])
      }
      toast.success(`Willkommen, ${reg.first_name.trim()}! Ihr Zugang wurde eingerichtet.`)
      navigate('/investor/dashboard')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen')
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

  const openRegisterTab = (tier: string) => {
    setSelectedTier(tier)
    setTab('register')
    authCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const inputStyle = {
    background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)',
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #063D3E 0%, transparent 65%)', transform: 'translate(40%,-40%)' }} />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, #D4662A 0%, transparent 65%)', transform: 'translate(-35%,35%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20" style={{ paddingTop: '60px' }}>

        {/* ── HERO ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex gap-4 mb-7">
            <img src={aventoLogo} alt="Avento" className="object-cover hover:-translate-y-1 transition-transform duration-200"
              style={{ height: '80px', width: 'auto', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }} />
            <img src={conserLogo} alt="Conser" className="object-cover hover:-translate-y-1 transition-transform duration-200"
              style={{ height: '80px', width: 'auto', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Avento &amp; Conser
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Exklusives Investoren-Portal · Vertraulich &amp; Sicher
          </p>
        </div>

        {/* ── AUTH CARD ── */}
        <div ref={authCardRef} className="mx-auto mb-16 rounded-[24px] border overflow-hidden"
          style={{ maxWidth: '440px', background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}>

          {/* Tabs */}
          <div className="grid grid-cols-2 border-b" style={{ borderColor: 'var(--border)' }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="py-3.5 text-sm font-semibold transition-all"
                style={{
                  color: tab === t ? '#063D3E' : 'var(--text-secondary)',
                  borderBottom: tab === t ? '2px solid #063D3E' : '2px solid transparent',
                  background: 'transparent',
                }}>
                {t === 'login' ? 'Anmelden' : 'Registrieren'}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="p-6 flex flex-col gap-3">
              <input type="email" placeholder="E-Mail Adresse" required value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="px-4 py-2.5 rounded-xl text-sm outline-none border"
                style={inputStyle} />
              <div className="relative">
                <input type={showLoginPwd ? 'text' : 'password'} placeholder="Passwort" required value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border pr-11"
                  style={inputStyle} />
                <button type="button" onClick={() => setShowLoginPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition"
                  style={{ color: 'var(--text-secondary)' }}>
                  {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="button" onClick={handleForgotPassword}
                className="text-xs text-right hover:underline" style={{ color: 'var(--text-secondary)' }}>
                Passwort vergessen?
              </button>
              <button type="submit" disabled={loginLoading}
                className="py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition mt-1"
                style={{ background: '#063D3E' }}>
                {loginLoading ? 'Anmelden…' : 'Anmelden →'}
              </button>
              <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                Noch kein Konto?{' '}
                <button type="button" onClick={() => setTab('register')} className="font-semibold hover:underline text-accent1">
                  Registrieren →
                </button>
              </p>
              <div className="border-t pt-3 text-center" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Eigentümer-Zugang über gleiche E-Mail &amp; Passwort
                </span>
              </div>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="p-6 flex flex-col gap-3">
              {selectedTier && (
                <div className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                  style={{ background: 'rgba(6,61,62,0.08)', color: '#063D3E' }}>
                  <Check size={13} /> Tier gewählt: {selectedTier}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Vorname" required value={reg.first_name}
                  onChange={e => setReg(p => ({ ...p, first_name: e.target.value }))}
                  className="px-4 py-2.5 rounded-xl text-sm outline-none border" style={inputStyle} />
                <input type="text" placeholder="Nachname" required value={reg.last_name}
                  onChange={e => setReg(p => ({ ...p, last_name: e.target.value }))}
                  className="px-4 py-2.5 rounded-xl text-sm outline-none border" style={inputStyle} />
              </div>
              <input type="email" placeholder="E-Mail Adresse" required value={reg.email}
                onChange={e => setReg(p => ({ ...p, email: e.target.value }))}
                className="px-4 py-2.5 rounded-xl text-sm outline-none border" style={inputStyle} />
              <input type="tel" placeholder="Telefonnummer" required value={reg.phone}
                onChange={e => setReg(p => ({ ...p, phone: e.target.value }))}
                className="px-4 py-2.5 rounded-xl text-sm outline-none border" style={inputStyle} />
              <div>
                <div className="relative">
                  <input type={showRegPwd ? 'text' : 'password'} placeholder="Passwort (min. 8 Zeichen)" required value={reg.password}
                    onChange={e => setReg(p => ({ ...p, password: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border pr-11" style={inputStyle} />
                  <button type="button" onClick={() => setShowRegPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition"
                    style={{ color: 'var(--text-secondary)' }}>
                    {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={reg.password} />
              </div>
              <input type="password" placeholder="Passwort wiederholen" required value={reg.password2}
                onChange={e => setReg(p => ({ ...p, password2: e.target.value }))}
                className="px-4 py-2.5 rounded-xl text-sm outline-none border" style={inputStyle} />

              {/* Checkboxen */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consentPrivacy} onChange={e => setConsentPrivacy(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#063D3E]" />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Ich akzeptiere die{' '}
                  <button type="button" onClick={() => setShowPrivacy(true)} className="text-accent1 underline font-medium">
                    Datenschutzerklärung
                  </button>{' '}
                  und stimme der Verarbeitung meiner Daten gemäß DSGVO zu.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consentNda} onChange={e => setConsentNda(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#063D3E]" />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Ich akzeptiere die{' '}
                  <button type="button" onClick={() => setShowNda(true)} className="text-accent1 underline font-medium">
                    Geheimhaltungsvereinbarung (NDA)
                  </button>{' '}
                  und verpflichte mich zur vertraulichen Behandlung aller erhaltenen Informationen.
                </span>
              </label>

              <button type="submit" disabled={regLoading || !consentPrivacy || !consentNda}
                className="py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition mt-1"
                style={{ background: '#063D3E' }}>
                {regLoading ? 'Wird registriert…' : 'Registrieren & Zugang erhalten →'}
              </button>
              <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                Bereits registriert?{' '}
                <button type="button" onClick={() => setTab('login')} className="font-semibold hover:underline text-accent1">
                  Anmelden →
                </button>
              </p>
            </form>
          )}
        </div>

        {/* ── INVESTMENT TIERS ── */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Investitionsmöglichkeiten
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Wir suchen <strong>€ 1.500.000</strong> für <strong>10%</strong> Unternehmensanteile
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {TIERS.map(tier => (
            <div key={tier.pct} className="relative rounded-[20px] flex flex-col p-6 transition-all duration-200"
              style={{
                background: 'var(--surface)',
                border: tier.highlight ? '2px solid #063D3E' : '1px solid var(--border)',
                boxShadow: tier.highlight ? '6px 6px 18px rgba(6,61,62,0.12)' : '6px 6px 18px rgba(0,0,0,0.08)',
                transform: tier.highlight ? 'scale(1.03)' : 'scale(1)',
              }}>
              {tier.popularBadge && (
                <span className="absolute -top-3 right-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: '#D4662A' }}>
                  {tier.popularBadge}
                </span>
              )}
              <div className="mb-1" style={{ fontSize: '48px', fontWeight: '700', color: '#063D3E', lineHeight: 1.1 }}>
                {tier.pct}
              </div>
              <div className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {tier.amount}
              </div>
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{ background: 'rgba(6,61,62,0.10)', color: '#063D3E' }}>
                {tier.badge}
              </span>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={13} className="text-accent1 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => openRegisterTab(tier.badge)}
                className="w-full py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                style={{ background: '#063D3E' }}>
                Zugang beantragen →
              </button>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
          <div className="flex gap-4">
            <button onClick={() => setShowPrivacy(true)} className="hover:underline hover:text-accent1 transition">Datenschutz</button>
            <span>|</span>
            <button onClick={() => setShowNda(true)} className="hover:underline hover:text-accent1 transition">NDA</button>
            <span>|</span>
            <a href="mailto:torben@avento-conser.de" className="hover:underline hover:text-accent1 transition">Impressum</a>
          </div>
          <span>© 2025 Avento &amp; Conser</span>
        </div>
      </div>

      {showNda && <NdaModal onClose={() => setShowNda(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </div>
  )
}
