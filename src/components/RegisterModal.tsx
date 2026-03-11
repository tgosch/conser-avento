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
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })

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
          toast.error('Diese E-Mail-Adresse ist bereits registriert.')
        } else {
          toast.error('Registrierung fehlgeschlagen: ' + error.message)
        }
        return
      }

      toast.success('Willkommen im Portal!')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-card shadow-card w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-text transition">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-text mb-1">Registrieren</h2>
        <p className="text-sm text-gray-500 mb-6">Erhalte exklusiven Zugang zum Investoren-Portal</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-text mb-1">Vorname</label>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans"
                placeholder="Max"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-text mb-1">Nachname</label>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans"
                placeholder="Mustermann"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1">E-Mail</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans"
              placeholder="max@beispiel.de"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1">Telefon (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent1 transition font-sans"
              placeholder="+49 123 456789"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-accent1 text-white rounded-full py-3 font-semibold text-sm hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Wird registriert...' : 'Jetzt registrieren'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Bereits registriert?{' '}
          <button onClick={onSwitchToLogin} className="text-accent1 font-semibold hover:underline">
            Einloggen
          </button>
        </p>
      </div>
    </div>
  )
}
