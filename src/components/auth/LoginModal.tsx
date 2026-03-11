import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Investor } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Props {
  onClose: () => void
  onSwitchToRegister: () => void
}

export default function LoginModal({ onClose, onSwitchToRegister }: Props) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      const adminPwd = import.meta.env.VITE_ADMIN_PASSWORD
      if (email === adminEmail && password === adminPwd) {
        login({ isAdmin: true })
        toast.success('Admin-Login erfolgreich')
        onClose()
        navigate('/owner/dashboard')
        return
      }

      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('email', email)
        .single()
      if (error || !data) throw new Error('Investor nicht gefunden')
      login({ investor: data as Investor, isAdmin: false })
      toast.success('Willkommen zurück!')
      onClose()
      navigate('/investor/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login fehlgeschlagen'
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

        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Einloggen</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Investor- oder Owner-Zugang</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email" placeholder="E-Mail Adresse" required
            value={email} onChange={e => setEmail(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border transition"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <input
            type="password" placeholder="Passwort"
            value={password} onChange={e => setPassword(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border transition"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />

          <button
            type="submit" disabled={loading}
            className="mt-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition"
            style={{ background: '#063D3E' }}
          >
            {loading ? 'Einloggen…' : 'Einloggen →'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
          Noch kein Zugang?{' '}
          <button onClick={onSwitchToRegister} className="text-accent1 font-semibold hover:underline">Jetzt registrieren</button>
        </p>
      </div>
    </div>
  )
}
