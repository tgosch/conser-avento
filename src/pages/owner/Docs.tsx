import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Document } from '../../lib/supabase'
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

const TABS = ['Alle', 'Pitch Deck', 'Business', 'Sales', 'Personas', 'Finanzen', 'Sonstiges']
const CATEGORIES = ['pitch-deck', 'business', 'sales', 'persona', 'finanzen', 'other']

export default function OwnerDocs() {
  const [docs, setDocs] = useState<Document[]>([])
  const [tab, setTab] = useState('Alle')
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'business', section: '' })

  const fetchDocs = () => {
    supabase.from('documents').select('*').order('updated_at', { ascending: false })
      .then(({ data }) => { if (data) setDocs(data as Document[]) })
  }

  useEffect(() => { fetchDocs() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const section = form.section || file.name.replace('.pdf', '').toLowerCase().replace(/\s+/g, '-')
      const fileName = `${section}.pdf`
      const { error: upErr } = await supabase.storage.from('documents').upload(fileName, file, { upsert: true })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
      const { error: dbErr } = await supabase.from('documents').upsert({
        section, file_name: form.name || file.name,
        category: form.category, file_url: urlData.publicUrl, visible_to_investors: true,
      })
      if (dbErr) throw dbErr
      toast.success('Dokument hochgeladen')
      fetchDocs()
    } catch { toast.error('Upload fehlgeschlagen') }
    finally { setUploading(false); e.target.value = '' }
  }

  const toggleVisibility = async (doc: Document) => {
    const { error } = await supabase.from('documents').update({ visible_to_investors: !doc.visible_to_investors }).eq('id', doc.id)
    if (error) toast.error('Fehler')
    else { toast.success('Sichtbarkeit geändert'); fetchDocs() }
  }

  const handleDelete = async (doc: Document) => {
    await supabase.storage.from('documents').remove([`${doc.section}.pdf`])
    const { error } = await supabase.from('documents').delete().eq('id', doc.id)
    if (error) toast.error('Fehler beim Löschen')
    else { toast.success('Dokument gelöscht'); fetchDocs() }
  }

  const tabCategories: Record<string, string> = {
    'Pitch Deck': 'pitch-deck', 'Business': 'business', 'Sales': 'sales',
    'Personas': 'persona', 'Finanzen': 'finanzen', 'Sonstiges': 'other',
  }

  const filtered = tab === 'Alle' ? docs : docs.filter(d => d.category === tabCategories[tab])

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Dokumente verwalten</h1>

      {/* Upload */}
      <div className="rounded-[20px] p-6 border mb-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Dokument hochladen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input type="text" placeholder="Name (optional)" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input type="text" placeholder="Sektion (z.B. pitch-deck)" value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            className="px-4 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <label className="cursor-pointer">
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
          <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-accent1 transition" style={{ borderColor: 'var(--border)' }}>
            <Upload size={24} className="mx-auto mb-2 text-secondary" />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{uploading ? 'Lädt hoch…' : 'PDF hierher ziehen oder klicken'}</p>
          </div>
        </label>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition"
            style={{
              background: tab === t ? '#063D3E' : 'var(--surface2)',
              color: tab === t ? 'white' : 'var(--text-secondary)',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Docs Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[20px] p-8 text-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-3xl mb-2">📄</p>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Keine Dokumente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(d => (
            <div key={d.id} className="rounded-[20px] p-4 border flex items-center gap-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: '#063D3E' }}>
                PDF
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{d.file_name || d.section}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{d.category} · {new Date(d.updated_at).toLocaleDateString('de-DE')}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleVisibility(d)} className="hover:opacity-70 transition" style={{ color: d.visible_to_investors ? '#063D3E' : 'var(--text-secondary)' }}>
                  {d.visible_to_investors ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleDelete(d)} className="text-red-400 hover:text-red-600 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
