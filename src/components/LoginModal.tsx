import { useState } from 'react'
import type { FormEvent } from 'react'
import { X } from 'lucide-react'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      if (email === adminEmail) {
        // Admin login – just check email match, no password validation for demo
        login(null, true)
        toast.success('Willkommen, Admin!')
        navigate('/admin')
        onClose()
        return
      }

      // Investor login by email
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !data) {
        toast.error('E-Mail-Adresse nicht gefunden. Bitte registrieren.')
        return
      }

      login(data, false)
      toast.success(`Willkommen zurück, ${data.first_name}!`)
      navigate('/dashboard')
      onClose()
    } catch {
      toast.error('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-card shadow-card w-full max-w-sm p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-text transition">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-text mb-1">Anmelden</h2>
        <p className="text-sm text-gray-500 mb-6">Zugang zum Investoren-Portal</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-text mb-1">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans"
              placeholder="max@beispiel.de"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-400 mt-1">Investoren: Kein Passwort erforderlich</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-accent1 text-white rounded-full py-3 font-semibold text-sm hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Wird angemeldet...' : 'Einloggen'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Noch kein Konto?{' '}
          <button onClick={onSwitchToRegister} className="text-accent1 font-semibold hover:underline">
            Registrieren
          </button>
        </p>
      </div>
    </div>
  )
}
