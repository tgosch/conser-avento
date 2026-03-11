import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Investor } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Props {
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function RegisterModal({ onClose, onSwitchToLogin }: Props) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' })
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) { toast.error('Bitte stimmen Sie der Datenschutzerklärung zu.'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('investors')
        .insert([{ ...form, consent: true, consent_date: new Date().toISOString() }])
        .select()
        .single()
      if (error) throw error
      login({ investor: data as Investor, isAdmin: false })
      toast.success('Willkommen! Ihr Zugang wurde aktiviert.')
      onClose()
      navigate('/investor/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registrierung fehlgeschlagen'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-md rounded-[24px] p-6 relative slide-up border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 hover:opacity-70 transition" style={{ color: 'var(--text-secondary)' }}>
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Zugang beantragen</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Exklusiver Investor-Zugang zu Avento & Conser</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" placeholder="Vorname" required
              value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border transition"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
            <input
              type="text" placeholder="Nachname" required
              value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border transition"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <input
            type="email" placeholder="E-Mail Adresse" required
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border transition"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <input
            type="tel" placeholder="Telefonnummer (optional)"
            value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border transition"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />

          <label className="flex items-start gap-3 cursor-pointer mt-1">
            <input
              type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-[#063D3E] shrink-0"
            />
            <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
              <a href="#" className="text-accent1 underline">Datenschutzerklärung</a> zu.
              Meine Daten werden ausschließlich für das Investor-Portal verwendet.
            </span>
          </label>

          <button
            type="submit" disabled={loading || !consent}
            className="mt-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition"
            style={{ background: '#063D3E' }}
          >
            {loading ? 'Wird registriert…' : 'Zugang beantragen →'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
          Bereits registriert?{' '}
          <button onClick={onSwitchToLogin} className="text-accent1 font-semibold hover:underline">Einloggen</button>
        </p>
      </div>
    </div>
  )
}
