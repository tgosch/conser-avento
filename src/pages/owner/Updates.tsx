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
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

      if (sendNewsletter) {
        setNewsletterSending(true)
        try {
          const { data: investors } = await supabase
            .from('investors').select('email, first_name').eq('consent', true)
          if (investors && investors.length > 0) {
            const emails = investors.map(i => i.email).filter(Boolean)
            const html = buildNewsletterHtml({ title: form.title, content: form.content, category: form.category })
            const result = await sendEmail({
              to: emails,
              subject: `${form.category === 'milestone' ? '🎉 ' : ''}${form.title} — Avento & Conser Update`,
              html,
            })
            if (result.success) {
              toast.success(`Newsletter an ${emails.length} Interessenten gesendet`)
            } else {
              toast.warn(`Newsletter fehlgeschlagen: ${result.error}`)
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

  // UPGRADE 3 — Inline-Löschbestätigung
  const handleDelete = async (id: string) => {
    if (deletingId !== id) { setDeletingId(id); return }
    const { error } = await supabase.from('updates').delete().eq('id', id)
    if (error) toast.error('Fehler beim Löschen')
    else { toast.success('Update gelöscht'); fetchUpdates() }
    setDeletingId(null)
  }

  const categoryColor: Record<string, string> = { general: '#6E6E73', milestone: '#063D3E', important: '#D4662A' }
  const categoryLabel: Record<string, string> = { general: 'Allgemein', milestone: 'Meilenstein', important: 'Wichtig' }
  const isSubmitting = loading || newsletterSending

  return (
    <div className="max-w-3xl animate-fade-up">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Updates veröffentlichen</h1>

      {/* UPGRADE 2 — 2-Spalten Grid: Formular + Live-Vorschau */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Linke Spalte: Formular */}
        <form onSubmit={handleSubmit} className="card p-6">
          <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Neues Update</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text" placeholder="Titel" required value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-base"
            />
            <textarea
              placeholder="Inhalt" required value={form.content} rows={4}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              className="input-base resize-none"
            />

            {/* UPGRADE 1 — Kategorie als 3 klickbare Karten */}
            <div>
              <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Kategorie</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'general',   label: 'Allgemein',   icon: '📋', color: '#6E6E73' },
                  { value: 'milestone', label: 'Meilenstein', icon: '🎉', color: '#063D3E' },
                  { value: 'important', label: 'Wichtig',     icon: '⚠️', color: '#D4662A' },
                ].map(cat => (
                  <button key={cat.value} type="button"
                    onClick={() => setForm(p => ({ ...p, category: cat.value }))}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-[14px] border transition"
                    style={{
                      background: form.category === cat.value ? `${cat.color}12` : 'var(--surface2)',
                      borderColor: form.category === cat.value ? cat.color : 'var(--border)',
                    }}>
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-xs font-semibold"
                          style={{ color: form.category === cat.value ? cat.color : 'var(--text-secondary)' }}>
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Toggle */}
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-all"
              style={{
                background: sendNewsletter ? 'rgba(6,61,62,0.06)' : 'var(--surface2)',
                borderColor: sendNewsletter ? '#063D3E' : 'var(--border)',
              }}>
              <input type="checkbox" checked={sendNewsletter}
                onChange={e => setSendNewsletter(e.target.checked)}
                className="w-4 h-4 shrink-0 accent-[#063D3E]" />
              <div className="flex items-center gap-2 flex-1">
                {sendNewsletter
                  ? <MailCheck size={15} style={{ color: '#063D3E' }} />
                  : <Mail size={15} style={{ color: 'var(--text-secondary)' }} />}
                <span className="text-sm font-medium" style={{ color: sendNewsletter ? '#063D3E' : 'var(--text-secondary)' }}>
                  Newsletter an alle Interessenten senden
                </span>
              </div>
              {sendNewsletter && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(6,61,62,0.12)', color: '#063D3E' }}>Aktiv</span>
              )}
            </label>

            <button type="submit" disabled={isSubmitting}
              className="btn btn-primary w-full">
              <Send size={14} />
              {newsletterSending ? 'Wird versendet…' : loading ? 'Wird gespeichert…'
                : sendNewsletter ? 'Veröffentlichen & Newsletter senden →' : 'Update veröffentlichen →'}
            </button>
          </div>
        </form>

        {/* Rechte Spalte: Live-Vorschau */}
        <div>
          <p className="label-tag mb-4" style={{ color: 'var(--text-tertiary)' }}>INVESTOR SIEHT SO:</p>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: `${categoryColor[form.category] || '#6E6E73'}20`,
                      color: categoryColor[form.category] || '#6E6E73',
                    }}>
                {categoryLabel[form.category] || 'Allgemein'}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Gerade eben</span>
            </div>
            <h3 className="font-bold text-sm mb-2"
                style={{ color: form.title ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
              {form.title || 'Titel erscheint hier…'}
            </h3>
            <p className="text-xs leading-relaxed"
               style={{ color: form.content ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>
              {form.content || 'Der Inhalt deines Updates erscheint hier…'}
            </p>
          </div>
          <p className="text-xs text-right mt-2"
             style={{ color: form.content.length > 400 ? '#D4662A' : 'var(--text-tertiary)' }}>
            {form.content.length} / 500 Zeichen
          </p>
        </div>
      </div>

      {/* Bisherige Updates */}
      <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Bisherige Updates ({updates.length})</h2>
      <div className="flex flex-col gap-3">
        {updates.map(u => (
          <div key={u.id} className="card p-5 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: `${categoryColor[u.category]}20`, color: categoryColor[u.category] }}>
                  {categoryLabel[u.category]}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {new Date(u.created_at).toLocaleDateString('de-DE')}
                </span>
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{u.title}</h3>
              <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{u.content}</p>
            </div>
            {/* UPGRADE 3 — Inline-Löschen */}
            <button onClick={() => handleDelete(u.id)}
              className={`transition shrink-0 mt-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                deletingId === u.id ? 'text-white' : 'text-red-400 hover:text-red-600'
              }`}
              style={deletingId === u.id ? { background: '#FF3B30' } : {}}>
              {deletingId === u.id ? 'Bestätigen?' : <Trash2 size={15} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
