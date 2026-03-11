import { useState } from 'react'
import type { FormEvent } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Props {
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function RegisterModal({ onClose, onSwitchToLogin }: Props) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('investors')
        .insert([{
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone || null,
        }])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          toast.error('Diese E-Mail ist bereits registriert. Bitte einloggen.')
        } else {
          toast.error('Registrierung fehlgeschlagen: ' + error.message)
        }
        return
      }

      toast.success('Willkommen im Investoren-Portal!')
      login(data, false)
      navigate('/dashboard')
      onClose()
    } catch {
      toast.error('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(6,61,62,0.25)' }}
    >
      <div className="slide-up bg-surface rounded-card shadow-card w-full max-w-md p-8 relative border border-black/5">
        <button onClick={onClose} className="absolute top-5 right-5 text-secondary hover:text-text transition">
          <X size={18} />
        </button>

        <div className="mb-6">
          <p className="label-tag text-accent1 mb-2">Investor-Portal</p>
          <h2 className="text-2xl font-bold text-text">Zugang beantragen</h2>
          <p className="text-secondary text-sm mt-1">Erhalten Sie exklusiven Zugang zu allen Dokumenten</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-text mb-1.5">Vorname</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={set('first_name')}
                placeholder="Max"
                className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent1 focus:bg-white transition font-sans text-text"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-text mb-1.5">Nachname</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={set('last_name')}
                placeholder="Mustermann"
                className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent1 focus:bg-white transition font-sans text-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">E-Mail</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="max@beispiel.de"
              className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent1 focus:bg-white transition font-sans text-text"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">Telefon <span className="text-secondary/60 font-normal">(optional)</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+49 123 456789"
              className="w-full bg-surface2 border border-black/8 rounded-btn px-4 py-2.5 text-sm outline-none focus:border-accent1 focus:bg-white transition font-sans text-text"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full text-white rounded-btn py-3 font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
            style={{ background: '#063D3E' }}
          >
            {loading ? 'Wird registriert…' : 'Zugang beantragen'}
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-5">
          Bereits registriert?{' '}
          <button onClick={onSwitchToLogin} className="text-accent1 font-semibold hover:underline">
            Einloggen
          </button>
        </p>
      </div>
    </div>
  )
}
