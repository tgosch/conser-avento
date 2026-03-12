import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { Update } from '../../lib/supabase'
import { toast } from 'react-toastify'
import { Trash2, Send, Mail, MailCheck } from 'lucide-react'
import { sendEmail, buildNewsletterHtml } from '../../lib/resend'

export default function OwnerUpdates() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [form, setForm] = useState({ title: '', content: '', category: 'general' })
  const [loading, setLoading] = useState(false)
  const [sendNewsletter, setSendNewsletter] = useState(false)
  const [newsletterSending, setNewsletterSending] = useState(false)

  const fetchUpdates = () => {
    supabase.from('updates').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setUpdates(data as Update[]) })
  }

  useEffect(() => { fetchUpdates() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) return
    setLoading(true)
    try {
      const { error } = await supabase.from('updates').insert([form])
      if (error) throw error
      toast.success('Update veröffentlicht')

      // Newsletter versenden wenn aktiviert
      if (sendNewsletter) {
        setNewsletterSending(true)
        try {
          // Alle Investoren-Emails laden
          const { data: investors } = await supabase
            .from('investors')
            .select('email, first_name')
            .eq('consent', true)

          if (investors && investors.length > 0) {
            const emails = investors.map(i => i.email).filter(Boolean)
            const html = buildNewsletterHtml({
              title: form.title,
              content: form.content,
              category: form.category,
            })
            const result = await sendEmail({
              to: emails,
              subject: `${form.category === 'milestone' ? '🎉 ' : ''}${form.title} — Avento & Conser Update`,
              html,
            })
            if (result.success) {
              toast.success(`Newsletter an ${emails.length} Interessenten gesendet`)
            } else {
              // VITE_RESEND_API_KEY nicht gesetzt → still fail
              toast.warn('Newsletter: API-Key nicht konfiguriert (VITE_RESEND_API_KEY in .env setzen)')
            }
          } else {
            toast.info('Keine Interessenten mit Einwilligung für Newsletter gefunden')
          }
        } catch (newsletterErr) {
          console.error('[Newsletter]', newsletterErr)
          toast.warn('Update gespeichert, Newsletter-Versand fehlgeschlagen')
        } finally {
          setNewsletterSending(false)
        }
      }

      setForm({ title: '', content: '', category: 'general' })
      setSendNewsletter(false)
      fetchUpdates()
    } catch { toast.error('Fehler beim Speichern') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('updates').delete().eq('id', id)
    if (error) toast.error('Fehler beim Löschen')
    else { toast.success('Update gelöscht'); fetchUpdates() }
  }

  const categoryColor: Record<string, string> = { general: '#6E6E73', milestone: '#063D3E', important: '#D4662A' }
  const categoryLabel: Record<string, string> = { general: 'Allgemein', milestone: 'Meilenstein', important: 'Wichtig' }

  const isSubmitting = loading || newsletterSending

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Updates veröffentlichen</h1>

      <form onSubmit={handleSubmit} className="rounded-[20px] p-6 border mb-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Neues Update</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text" placeholder="Titel" required value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <textarea
            placeholder="Inhalt" required value={form.content} rows={4}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border resize-none"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
          <select
            value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="general">Allgemein</option>
            <option value="milestone">Meilenstein</option>
            <option value="important">Wichtig</option>
          </select>

          {/* Newsletter Toggle */}
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-all"
            style={{
              background: sendNewsletter ? 'rgba(6,61,62,0.06)' : 'var(--surface2)',
              borderColor: sendNewsletter ? '#063D3E' : 'var(--border)',
            }}>
            <input
              type="checkbox"
              checked={sendNewsletter}
              onChange={e => setSendNewsletter(e.target.checked)}
              className="w-4 h-4 shrink-0 accent-[#063D3E]"
            />
            <div className="flex items-center gap-2 flex-1">
              {sendNewsletter ? <MailCheck size={15} style={{ color: '#063D3E' }} /> : <Mail size={15} style={{ color: 'var(--text-secondary)' }} />}
              <span className="text-sm font-medium" style={{ color: sendNewsletter ? '#063D3E' : 'var(--text-secondary)' }}>
                Newsletter an alle Interessenten senden
              </span>
            </div>
            {sendNewsletter && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(6,61,62,0.12)', color: '#063D3E' }}>
                Aktiv
              </span>
            )}
          </label>

          <button
            type="submit" disabled={isSubmitting}
            className="py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            style={{ background: '#063D3E' }}
          >
            <Send size={14} />
            {newsletterSending ? 'Wird versendet…' : loading ? 'Wird gespeichert…' : sendNewsletter ? 'Veröffentlichen & Newsletter senden →' : 'Update veröffentlichen →'}
          </button>
        </div>
      </form>

      <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Bisherige Updates ({updates.length})</h2>
      <div className="flex flex-col gap-3">
        {updates.map(u => (
          <div key={u.id} className="rounded-[20px] p-5 border flex items-start gap-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${categoryColor[u.category]}20`, color: categoryColor[u.category] }}>
                  {categoryLabel[u.category]}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{new Date(u.created_at).toLocaleDateString('de-DE')}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{u.title}</h3>
              <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{u.content}</p>
            </div>
            <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 transition shrink-0 mt-1">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
