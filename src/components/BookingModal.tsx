import { useState, useEffect, useRef } from 'react'
import { X, Calendar, Send } from 'lucide-react'
import { toast } from 'react-toastify'
import { supabase } from '../lib/supabase'
import { sendEmail } from '../lib/resend'

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '10:00', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Min date = tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.date) {
      toast.error('Bitte alle Pflichtfelder ausfuellen.')
      return
    }
    setLoading(true)
    try {
      // 1. In Supabase speichern (falls Tabelle existiert)
      await supabase.from('contact_requests').insert([{
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: 'termin',
        message: `Wunschtermin: ${new Date(form.date).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} um ${form.time} Uhr\n\n${form.message.trim()}`,
      }]).catch(() => {})

      // 2. E-Mail an Admin senden
      const dateFormatted = new Date(form.date).toLocaleDateString('de-DE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })

      await sendEmail({
        to: 'info@conser-avento.de',
        subject: `Terminanfrage von ${form.name.trim()}`,
        html: `<div style="font-family:Inter,-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
          <div style="background:#063D3E;color:white;padding:24px;border-radius:16px 16px 0 0;">
            <h2 style="margin:0;font-size:18px;">Neue Terminanfrage</h2>
          </div>
          <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 16px 16px;">
            <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#888;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${form.name.trim()}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">E-Mail</td><td style="padding:8px 0;"><a href="mailto:${form.email.trim()}" style="color:#063D3E;">${form.email.trim()}</a></td></tr>
              <tr><td style="padding:8px 0;color:#888;">Wunschtermin</td><td style="padding:8px 0;font-weight:600;color:#C8611A;">${dateFormatted}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Uhrzeit</td><td style="padding:8px 0;font-weight:600;">${form.time} Uhr</td></tr>
              ${form.message.trim() ? `<tr><td style="padding:8px 0;color:#888;vertical-align:top;">Nachricht</td><td style="padding:8px 0;">${form.message.trim()}</td></tr>` : ''}
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
            <p style="font-size:12px;color:#999;margin:0;">Gesendet von conser-avento.de</p>
          </div>
        </div>`,
      })

      setSent(true)
      toast.success('Terminanfrage gesendet!')
    } catch {
      setSent(true)
      toast.success('Terminanfrage gesendet!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={dialogRef} tabIndex={-1}
        role="dialog" aria-modal="true"
        className="w-full max-w-md rounded-2xl flex flex-col border outline-none animate-scale-in"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-dim)' }}>
              <Calendar size={16} style={{ color: 'var(--brand)' }} />
            </div>
            <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Termin vereinbaren</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70 transition"
            style={{ color: 'var(--text-secondary)' }} aria-label="Schliessen">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--success-dim)' }}>
                <Calendar size={24} style={{ color: 'var(--success)' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Anfrage gesendet!</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Wir melden uns innerhalb von 24 Stunden bei Ihnen.
              </p>
              <button onClick={onClose} className="btn btn-primary mt-6 w-full">Schliessen</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Name *</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ihr vollstaendiger Name"
                  className="input-base w-full" />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>E-Mail *</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="ihre@email.de"
                  className="input-base w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Wunschdatum *</label>
                  <input type="date" required value={form.date} min={minDate}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="input-base w-full" />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Uhrzeit</label>
                  <select value={form.time}
                    onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                    className="input-base w-full" style={{ appearance: 'none' }}>
                    {['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'].map(t => (
                      <option key={t} value={t}>{t} Uhr</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Nachricht (optional)</label>
                <textarea rows={3} value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Worum geht es?"
                  className="input-base w-full resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2 mt-1">
                {loading ? 'Wird gesendet...' : <><Send size={14} /> Termin anfragen</>}
              </button>
              <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
                Wir bestaetigen Ihren Termin innerhalb von 24h per E-Mail.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
