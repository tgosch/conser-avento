import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import aventoLogo from '../assets/avento_kachel.webp'
import conserLogo from '../assets/conser_kachel.webp'

type Step = 'form' | 'otp'

export default function PartnerRegister() {
  const { loginPartner } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)

  // Form state
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', company: '',
  })

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const validateForm = () => {
    const nameRe = /^[a-zA-ZäöüßÄÖÜ\s'-]{2,50}$/
    if (!nameRe.test(form.first_name)) return 'Vorname ungültig'
    if (!nameRe.test(form.last_name)) return 'Nachname ungültig'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'E-Mail ungültig'
    if (!/^[\d\s+\-()]{7,20}$/.test(form.phone)) return 'Telefonnummer ungültig'
    if (form.company.trim().length < 2) return 'Bitte Unternehmen angeben'
    return null
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateForm()
    if (err) { toast.error(err); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: form.email.trim().toLowerCase(),
        options: {
          data: {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            phone: form.phone.trim(),
            company: form.company.trim(),
          },
        },
      })
      if (error) throw error
      toast.success('Verifizierungscode wurde an Ihre E-Mail gesendet.')
      setStep('otp')
    } catch {
      toast.error('Code konnte nicht gesendet werden. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Bitte den 6-stelligen Code eingeben.'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: form.email.trim().toLowerCase(),
        token: code,
        type: 'email',
      })
      if (error) throw error
      if (!data.user) throw new Error('Kein Benutzer')

      // Create partner record
      const initials = `${form.first_name.trim()[0]}${form.last_name.trim()[0]}`.toUpperCase()
      await supabase.from('partners').upsert([{
        id: data.user.id,
        name: form.company.trim(),
        type: 'production' as const,
        category: '',
        description: `Ansprechpartner: ${form.first_name.trim()} ${form.last_name.trim()}`,
        status: 'negotiating' as const,
        logo_path: null,
        initials,
        color: '#063D3E',
        visible: false,
        order_index: 99,
      }])

      await loginPartner(data.user.id, data.user.email ?? form.email.trim())
      toast.success(`Willkommen, ${form.company.trim()}!`)
      navigate('/partner/dashboard')
    } catch {
      toast.error('Code ungültig oder abgelaufen. Bitte erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: form.email.trim().toLowerCase(),
      })
      if (error) throw error
      toast.success('Neuer Code wurde gesendet.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } catch {
      toast.error('Code konnte nicht gesendet werden.')
    } finally {
      setLoading(false)
    }
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
            <p className="label-overline mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Partner Portal</p>
            <h1 className="text-display-2xl text-white mb-6" style={{ maxWidth: 440 }}>
              Werden Sie Produktionspartner
            </h1>
            <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 380 }}>
              Zugang zu 75.000 Handwerksbetrieben. Automatisierte Bestellungen über Avento ERP.
              Keine Setup-Kosten. Provision nur bei Bestellung.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { n: '75.000', l: 'Zielkunden' },
                { n: '€0', l: 'Setup-Kosten' },
                { n: '2-4 Wo.', l: 'Onboarding' },
              ].map(s => (
                <div key={s.l}>
                  <p className="text-metric-lg text-white mb-0.5">{s.n}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {['DSGVO-konform', 'Made in Germany', 'Keine Bindung'].map(b => (
              <span key={b} className="tag tag-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }}>{b}</span>
            ))}
          </div>
        </div>

        {/* RIGHT: Registration */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-sm animate-fade-up">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
              <img src={aventoLogo} alt="Avento" className="h-8 rounded-lg" />
              <div className="w-px h-5" style={{ background: 'var(--border)' }} />
              <img src={conserLogo} alt="Conser" className="h-8 rounded-lg" />
            </div>

            <div className="card p-6" style={{ boxShadow: 'var(--shadow-xl)' }}>

              {/* ── STEP 1: FORM ── */}
              {step === 'form' && (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--brand-dim)' }}>
                      <Building2 size={18} style={{ color: 'var(--brand)' }} />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Partner werden</h2>
                    </div>
                  </div>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    Registrieren Sie sich als Produktionspartner. Kostenlos und unverbindlich.
                  </p>

                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--surface3)' }} />
                  </div>

                  <form onSubmit={handleSubmitForm} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Vorname *" required
                        value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
                        className="input-base" />
                      <input type="text" placeholder="Nachname *" required
                        value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
                        className="input-base" />
                    </div>
                    <input type="text" placeholder="Unternehmen *" required
                      value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                      className="input-base" />
                    <input type="email" placeholder="E-Mail Adresse *" required
                      value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="input-base" />
                    <input type="tel" placeholder="Telefonnummer *" required
                      value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="input-base" />

                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
                      {loading ? 'Wird gesendet…' : <>Weiter <ArrowRight size={14} /></>}
                    </button>
                  </form>

                  <p className="text-center text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>
                    Sie erhalten einen Verifizierungscode per E-Mail.
                  </p>
                </>
              )}

              {/* ── STEP 2: OTP ── */}
              {step === 'otp' && (
                <>
                  <button onClick={() => setStep('form')}
                    className="flex items-center gap-1 text-xs font-semibold mb-4 hover-press"
                    style={{ color: 'var(--text-tertiary)' }}>
                    <ArrowLeft size={12} /> Zurück
                  </button>

                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--brand-dim)' }}>
                      <CheckCircle size={18} style={{ color: 'var(--brand)' }} />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Code eingeben</h2>
                    </div>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Wir haben einen 6-stelligen Code an
                  </p>
                  <p className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
                    {form.email}
                  </p>

                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                  </div>

                  <form onSubmit={handleVerify}>
                    <div className="flex gap-2 justify-center mb-5" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none"
                          style={{
                            background: 'var(--surface2)',
                            borderColor: digit ? 'var(--brand)' : 'var(--border)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-mono)',
                          }}
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>

                    <button type="submit" disabled={loading || otp.join('').length !== 6}
                      className="btn btn-primary btn-lg w-full">
                      {loading ? 'Wird verifiziert…' : 'Verifizieren & Zugang erhalten'}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <button onClick={handleResend} disabled={loading}
                      className="text-xs font-semibold hover-press" style={{ color: 'var(--brand)' }}>
                      Code erneut senden
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-center gap-4 mt-5">
              <Link to="/" className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>
                Investor-Portal
              </Link>
              <span className="text-xs" style={{ color: 'var(--border)' }}>·</span>
              <Link to="/" className="text-xs hover-press" style={{ color: 'var(--text-tertiary)' }}>
                Anmelden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
