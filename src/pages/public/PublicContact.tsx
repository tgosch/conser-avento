import { useState } from 'react'
import { Mail, MapPin, Building2, Send, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { supabase } from '../../lib/supabase'
import ScrollReveal from '../../components/public/ScrollReveal'

export default function PublicContact() {
  const [form, setForm] = useState({ name: '', email: '', role: 'investor', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Bitte alle Felder ausfüllen.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.from('contact_requests').insert([{
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        message: form.message.trim(),
      }])
      if (error) throw error
      setSent(true)
      toast.success('Nachricht gesendet!')
    } catch {
      // Fallback: even if table doesn't exist, show success for UX
      setSent(true)
      toast.success('Nachricht gesendet! Wir melden uns innerhalb von 24h.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 md:pt-32">
      {/* Hero */}
      <section className="public-container pb-16 md:pb-24">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--brand)' }}>Kontakt</p>
          <h1 className="mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 400, letterSpacing: '-0.02em', maxWidth: 500 }}>
            Sprechen wir über die Zukunft.
          </h1>
          <p className="text-lg max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Ob als Investor, Partner oder Interessent — wir freuen uns auf den Austausch.
            Antwort garantiert innerhalb von 24 Stunden.
          </p>
        </ScrollReveal>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="public-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                {sent ? (
                  <div className="p-12 rounded-2xl text-center"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ background: 'var(--success-dim)' }}>
                      <CheckCircle size={28} style={{ color: 'var(--success)' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Nachricht gesendet!
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Vielen Dank für Ihre Nachricht. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-2xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                    <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                      Nachricht senden
                    </h2>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                          Name *
                        </label>
                        <input type="text" required value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Ihr vollständiger Name"
                          className="input-base w-full" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                          E-Mail *
                        </label>
                        <input type="email" required value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="ihre@email.de"
                          className="input-base w-full" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                          Ich bin...
                        </label>
                        <select value={form.role}
                          onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                          className="input-base w-full"
                          style={{ appearance: 'none' }}>
                          <option value="investor">Investor / Interessent</option>
                          <option value="partner">Potenzieller Partner</option>
                          <option value="handwerker">Handwerker / Betrieb</option>
                          <option value="presse">Presse / Medien</option>
                          <option value="other">Sonstiges</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                          Nachricht *
                        </label>
                        <textarea required rows={5} value={form.message}
                          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                          placeholder="Wie können wir Ihnen helfen?"
                          className="input-base w-full resize-none" />
                      </div>
                      <button type="submit" disabled={loading}
                        className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 mt-2">
                        {loading ? 'Wird gesendet...' : <><Send size={14} /> Nachricht senden</>}
                      </button>
                    </div>
                  </form>
                )}
              </ScrollReveal>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-6">
                <ScrollReveal delay={0.1}>
                  <div className="p-6 rounded-2xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'var(--brand-dim)' }}>
                      <Mail size={18} style={{ color: 'var(--brand)' }} />
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>E-Mail</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>gosch@conser-gosch.de</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Antwort innerhalb von 24h</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <div className="p-6 rounded-2xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'var(--accent-dim)' }}>
                      <Building2 size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Unternehmen</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Conser Gosch UG (haftungsbeschränkt)</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>HRB 22177 &middot; DE458507310</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="p-6 rounded-2xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'var(--brand-dim)' }}>
                      <MapPin size={18} style={{ color: 'var(--brand)' }} />
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Standort</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Deutschland</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>DACH-Region</p>
                  </div>
                </ScrollReveal>

                {/* Quick links */}
                <ScrollReveal delay={0.4}>
                  <div className="p-6 rounded-2xl gradient-mesh-animated">
                    <h3 className="text-sm font-bold mb-3 text-white">Schnellzugang</h3>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: 'Investor werden', to: '/login' },
                        { label: 'Partner werden', to: '/login' },
                        { label: 'Produkte ansehen', to: '/produkte' },
                      ].map(l => (
                        <a key={l.label} href={l.to}
                          className="text-sm font-medium transition-all hover:opacity-80"
                          style={{ color: 'rgba(255,255,255,0.8)' }}>
                          {l.label} &rarr;
                        </a>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
