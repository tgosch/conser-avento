import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import NdaModal from '../components/auth/NdaModal'
import PrivacyModal from '../components/auth/PrivacyModal'
import ImpressumModal from '../components/auth/ImpressumModal'
import aventoLogo from '../assets/avento_kachel.png'
import conserLogo from '../assets/conser_kachel.png'


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
  const { loginAdmin, loginInvestor } = useAuth()
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
  // Modals
  const [showNda, setShowNda] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showImpressum, setShowImpressum] = useState(false)
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

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase()
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

    // ── Admin-Login: lokale Prüfung gegen .env ──
    if (
      adminEmail &&
      adminPassword &&
      loginEmail.trim().toLowerCase() === adminEmail &&
      loginPassword === adminPassword
    ) {
      loginAdmin({ isAdmin: true, email: loginEmail.trim() })
      navigate('/owner/dashboard')
      setLoginLoading(false)
      return
    }

    // ── Investor-Login: via Supabase Auth ──
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })
      if (error) throw error
      loginAttemptsRef.current = 0
      await loginInvestor(data.user.id, data.user.email ?? loginEmail)
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

  const openRegisterTab = () => {
    setTab('register')
    authCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const inp = {
    background: 'var(--surface2)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Background blobs – hidden on mobile for perf */}
      <div className="hidden md:block fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #063D3E 0%, transparent 65%)', transform: 'translate(40%,-40%)' }} />
      <div className="hidden md:block fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, #D4662A 0%, transparent 65%)', transform: 'translate(-35%,35%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-16" style={{ paddingTop: '32px' }}>

        {/* ── HERO ── */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="flex gap-3 mb-4">
            <img src={aventoLogo} alt="Avento"
              style={{ height: '56px', width: 'auto', borderRadius: '13px', boxShadow: '0 4px 14px rgba(0,0,0,0.14)' }} />
            <img src={conserLogo} alt="Conser"
              style={{ height: '56px', width: 'auto', borderRadius: '13px', boxShadow: '0 4px 14px rgba(0,0,0,0.14)' }} />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Avento &amp; Conser
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Exklusives Investoren-Portal · Vertraulich &amp; Sicher
          </p>
        </div>

        {/* ── AUTH CARD ── */}
        <div ref={authCardRef} className="mx-auto mb-10 rounded-[20px] border overflow-hidden"
          style={{ maxWidth: '460px', background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>

          {/* Tabs */}
          <div className="grid grid-cols-2 border-b" style={{ borderColor: 'var(--border)' }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="py-4 font-semibold transition-all"
                style={{
                  fontSize: '15px',
                  color: tab === t ? '#063D3E' : 'var(--text-secondary)',
                  borderBottom: tab === t ? '2px solid #063D3E' : '2px solid transparent',
                  background: 'transparent',
                }}>
                {t === 'login' ? 'Anmelden' : 'Registrieren'}
              </button>
            ))}
          </div>

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="p-5 flex flex-col gap-3">
              <input
                type="email" placeholder="E-Mail Adresse" required
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none border"
                style={inp}
              />
              <div className="relative">
                <input
                  type={showLoginPwd ? 'text' : 'password'} placeholder="Passwort" required
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none border pr-12"
                  style={inp}
                />
                <button type="button" onClick={() => setShowLoginPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'var(--text-secondary)' }}>
                  {showLoginPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="button" onClick={handleForgotPassword}
                className="text-sm text-right" style={{ color: 'var(--text-secondary)' }}>
                Passwort vergessen?
              </button>
              <button type="submit" disabled={loginLoading}
                className="w-full py-3.5 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
                style={{ background: '#063D3E', fontSize: '15px' }}>
                {loginLoading ? 'Anmelden…' : 'Anmelden →'}
              </button>
              <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                Noch kein Konto?{' '}
                <button type="button" onClick={() => setTab('register')} className="font-semibold text-accent1">
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

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="p-5 flex flex-col gap-3">
                  {/* Name fields – each full width on mobile */}
              <input
                type="text" placeholder="Vorname" required
                value={reg.first_name} onChange={e => setReg(p => ({ ...p, first_name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl outline-none border"
                style={inp}
              />
              <input
                type="text" placeholder="Nachname" required
                value={reg.last_name} onChange={e => setReg(p => ({ ...p, last_name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl outline-none border"
                style={inp}
              />
              <input
                type="email" placeholder="E-Mail Adresse" required
                value={reg.email} onChange={e => setReg(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl outline-none border"
                style={inp}
              />
              <input
                type="tel" placeholder="Telefonnummer" required
                value={reg.phone} onChange={e => setReg(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl outline-none border"
                style={inp}
              />
              <div>
                <div className="relative">
                  <input
                    type={showRegPwd ? 'text' : 'password'} placeholder="Passwort (min. 8 Zeichen)" required
                    value={reg.password} onChange={e => setReg(p => ({ ...p, password: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl outline-none border pr-12"
                    style={inp}
                  />
                  <button type="button" onClick={() => setShowRegPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: 'var(--text-secondary)' }}>
                    {showRegPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <PasswordStrength password={reg.password} />
              </div>
              <input
                type="password" placeholder="Passwort wiederholen" required
                value={reg.password2} onChange={e => setReg(p => ({ ...p, password2: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl outline-none border"
                style={inp}
              />

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consentPrivacy} onChange={e => setConsentPrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 shrink-0 accent-[#063D3E]" />
                <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                  Ich akzeptiere die{' '}
                  <button type="button" onClick={() => setShowPrivacy(true)} className="text-accent1 underline font-medium">
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
                  <button type="button" onClick={() => setShowNda(true)} className="text-accent1 underline font-medium">
                    Geheimhaltungsvereinbarung (NDA)
                  </button>.
                </span>
              </label>

              <button type="submit" disabled={regLoading || !consentPrivacy || !consentNda}
                className="w-full py-3.5 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-50 transition mt-1"
                style={{ background: '#063D3E', fontSize: '15px' }}>
                {regLoading ? 'Wird registriert…' : 'Registrieren & Zugang erhalten →'}
              </button>
              <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                Bereits registriert?{' '}
                <button type="button" onClick={() => setTab('login')} className="font-semibold text-accent1">
                  Anmelden →
                </button>
              </p>
            </form>
          )}
        </div>

        {/* ── VISION & STRATEGIE ── */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3"
              style={{ background: 'rgba(6,61,62,0.10)', color: '#063D3E' }}>
              VISION & STRATEGIE
            </span>
            <h2 className="text-xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Die erste vollständig integrierte<br className="hidden sm:block" /> digitale Infrastruktur für den Bau
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Bau der ersten vollständig integrierten digitalen Infrastruktur für die europäische Bauindustrie
            </p>
          </div>

          {/* Mission cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: '🏗️', title: 'Avento · ERP', desc: 'Angebote, Kalkulation, GPS-Zeiterfassung, KI-Aufmaß, DATEV/GAEB-Integration. Das Betriebssystem für Handwerksbetriebe.' },
              { icon: '🔗', title: 'Der AHA-Moment', desc: 'Digitales Aufmaß → automatischer Warenkorb → 1-Klick-Bestellung. Avento und Conser greifen nahtlos ineinander.' },
              { icon: '🛒', title: 'Conser · Marketplace', desc: '2,3 Mio. Produkte, 7 Großhändler, Echtzeit-Preisvergleich. Der B2B-Marktplatz für Baumaterial in DACH.' },
            ].map(c => (
              <div key={c.title} className="rounded-[18px] p-5 border"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="text-3xl mb-3">{c.icon}</div>
                <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Markt strip */}
          <div className="rounded-[18px] p-5 border mb-6"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text-tertiary)' }}>Markt-Fokus DACH</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: '1,7 Mio.', label: 'Bauunternehmen & Handwerksbetriebe' },
                { value: '147 Mrd. €', label: 'Materialeinkauf pro Jahr' },
                { value: '< 3%', label: 'Digitalisierungsgrad heute' },
                { value: '€ 15 Mrd.+', label: 'Adressierbarer Markt (SaaS + GMV)' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold" style={{ color: '#063D3E' }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Produkt-Spezifikationen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-[18px] p-5 border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: 'rgba(6,61,62,0.10)' }}>🏗️</div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Avento · Features</p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {['Angebots- & Kalkulationssoftware', 'GPS-Zeiterfassung für Mitarbeiter', 'KI-gestütztes Aufmaß', 'DATEV & GAEB Integration', 'Automatische Warenkorb-Erzeugung', 'Projekt- & Ressourcenplanung'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: '#063D3E' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[18px] p-5 border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: 'rgba(212,102,42,0.10)' }}>🛒</div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Conser · Features</p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {['2,3 Mio. Produkte im Katalog', '7 Großhändler angebunden', 'Echtzeit-Preisvergleich', 'Digitale Bestellabwicklung', 'Lieferstatus-Tracking', 'B2B-Kundenverwaltung'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: '#D4662A' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Markt & Wettbewerb */}
          <div className="rounded-[18px] p-5 border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-tertiary)' }}>Markt & Wettbewerb</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              Bestehende Lösungen (Soranus, Tapio, Würth) lösen entweder ERP <em>oder</em> Beschaffung — nie beides. Avento + Conser ist die einzige vollständig integrierte Plattform.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Soranus / Streit', note: 'Nur ERP, kein Marketplace' },
                { name: 'Tapio (Homag)', note: 'Holz-Nische, kein SHK/Bau' },
                { name: 'Würth Orsy', note: 'Nur Eigenprodukte, kein Vergleich' },
                { name: 'Avento + Conser', note: 'Full-Stack · Einzige Lösung', highlight: true },
              ].map(c => (
                <div key={c.name} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg"
                  style={{ background: c.highlight ? 'rgba(6,61,62,0.08)' : 'var(--surface2)' }}>
                  <span className="font-semibold" style={{ color: c.highlight ? '#063D3E' : 'var(--text-primary)' }}>{c.name}</span>
                  <span style={{ color: c.highlight ? '#063D3E' : 'var(--text-secondary)' }}>{c.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA: Zugang beantragen */}
          <div className="rounded-[18px] p-5 border flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(6,61,62,0.05) 0%, rgba(6,61,62,0.10) 100%)', borderColor: 'rgba(6,61,62,0.15)' }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#063D3E' }}>Investoren-Zugang</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Sie interessieren sich für eine Beteiligung? Registrieren Sie sich für Zugang zum vertraulichen Investoren-Portal und nehmen Sie Kontakt auf.
              </p>
            </div>
            <button
              onClick={openRegisterTab}
              className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 transition"
              style={{ background: '#063D3E', fontSize: '14px' }}
            >
              Zugang beantragen →
            </button>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t text-sm"
          style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
          <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
            <button onClick={() => setShowPrivacy(true)} className="hover:text-accent1 transition">Datenschutz</button>
            <span>·</span>
            <button onClick={() => setShowNda(true)} className="hover:text-accent1 transition">NDA</button>
            <span>·</span>
            <button onClick={() => setShowImpressum(true)} className="hover:text-accent1 transition">Impressum</button>
          </div>
          <span>© 2025 Bautech Holding · Avento &amp; Conser</span>
        </div>
      </div>

      {showNda && <NdaModal onClose={() => setShowNda(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showImpressum && <ImpressumModal onClose={() => setShowImpressum(false)} />}
    </div>
  )
}
