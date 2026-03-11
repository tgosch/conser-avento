import { useState } from 'react'
import type { FormEvent } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Props {
  onClose: () => void
  onSwitchToRegister: () => void
}

export default function LoginModal({ onClose, onSwitchToRegister }: Props) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

      if (email === adminEmail) {
        if (password !== adminPassword) {
          toast.error('Falsches Passwort.')
          return
        }
        login(null, true)
        toast.success('Willkommen, Admin!')
        navigate('/admin')
        onClose()
        return
      }

      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !data) {
        toast.error('E-Mail nicht gefunden. Bitte zuerst registrieren.')
        return
      }

      login(data, false)
      toast.success(`Willkommen zurück, ${data.first_name}!`)
      navigate('/dashboard')
      onClose()
    } catch {
      toast.error('Ein Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(6,61,62,0.25)' }}
    >
      <div className="slide-up bg-surface rounded-card shadow-card w-full max-w-sm p-8 relative border border-black/5">
        <button onClick={onClose} className="absolute top-5 right-5 text-secondary hover:text-text transition">
          <X size={18} />
        </button>

        <div className="mb-6">
          <p className="label-tag text-accent1 mb-2">Investor-Portal</p>
          <h2 className="text-2xl font-bold text-text">Anmelden</h2>
          <p className="text-secondary text-sm mt-1">Zugang zu Ihren exklusiven Unterlagen</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ihre@email.de"
              className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent1 focus:bg-white transition font-sans text-text"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Passwort</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 pr-10 text-sm outline-none focus:border-accent1 focus:bg-white transition font-sans text-text"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-xs text-secondary/70 mt-1">Investoren benötigen kein Passwort</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full text-white rounded-btn py-3 font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            style={{ background: '#063D3E' }}
          >
            {loading ? 'Wird angemeldet…' : 'Einloggen'}
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-5">
          Noch kein Konto?{' '}
          <button onClick={onSwitchToRegister} className="text-accent1 font-semibold hover:underline">
            Zugang beantragen
          </button>
        </p>
      </div>
    </div>
  )
}
