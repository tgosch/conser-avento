import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Document } from '../../lib/supabase'
import { Upload, Trash2, Eye, EyeOff, FileText, Image, Presentation } from 'lucide-react'
import { toast } from 'react-toastify'

const SECTIONS: { value: string; label: string }[] = [
  { value: 'pitch-deck',              label: 'Pitch-Deck' },
  { value: 'business-plan',           label: 'Business-Plan' },
  { value: 'finanzplan',              label: 'Finanzplan' },
  { value: 'sales-funnel-endkunden',  label: 'Sales Funnel Endkunden' },
  { value: 'sales-funnel-business',   label: 'Sales Funnel Business' },
  { value: 'persona-endkunde',        label: 'Persona Endkunde' },
  { value: 'persona-businesspartner', label: 'Persona Businesspartner' },
  { value: 'finanzanalyse',           label: 'Detaillierte Finanzanalyse' },
  { value: 'invest-moeglichkeiten',   label: 'Invest & Möglichkeiten' },
  { value: 'roadmap-kapital',         label: 'Roadmap Kapital' },
  { value: 'sicherheiten',            label: 'Sicherheiten & Treuhänder' },
]

const CATEGORIES = [
  { value: 'pitch-deck',    label: 'Pitch Deck' },
  { value: 'business',      label: 'Business' },
  { value: 'finanzen',      label: 'Finanzen' },
  { value: 'sales',         label: 'Sales' },
  { value: 'persona',       label: 'Personas' },
  { value: 'other',         label: 'Sonstiges' },
]

const TABS = ['Alle', ...CATEGORIES.map(c => c.label)]

function fileIcon(name?: string) {
  if (!name) return <FileText size={16} />
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return <FileText size={16} />
  if (['png', 'jpg', 'jpeg'].includes(ext ?? '')) return <Image size={16} />
  if (['pptx', 'ppt'].includes(ext ?? '')) return <Presentation size={16} />
  return <FileText size={16} />
}

function fileTypeLabel(name?: string) {
  const ext = name?.split('.').pop()?.toUpperCase() ?? 'DOC'
  return ext
}

function storagePath(url: string) {
  // Extract path after /documents/ from public URL
  const marker = '/documents/'
  const idx = url.indexOf(marker)
  return idx >= 0 ? url.substring(idx + marker.length) : url
}

export default function OwnerDocs() {
  const [docs, setDocs] = useState<Document[]>([])
  const [tab, setTab] = useState('Alle')
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    section: 'pitch-deck',
    category: 'pitch-deck',
    visible: true,
  })

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
      const ext = file.name.split('.').pop() ?? 'pdf'
      const fileName = `${form.section}.${ext}`
      const storageName = `${form.category}/${fileName}`

      const { error: upErr } = await supabase.storage
        .from('documents')
        .upload(storageName, file, { upsert: true })
      if (upErr) throw upErr

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(storageName)

      // Remove existing record for this section, then insert fresh
      await supabase.from('documents').delete().eq('section', form.section)

      const { error: dbErr } = await supabase.from('documents').insert({
        section: form.section,
        category: form.category,
        file_name: file.name,
        file_url: urlData.publicUrl,
        visible_to_investors: form.visible,
        updated_at: new Date().toISOString(),
      })
      if (dbErr) throw dbErr

      toast.success('Dokument erfolgreich hochgeladen')
      fetchDocs()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
      toast.error(`Upload fehlgeschlagen: ${msg}`)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const toggleVisibility = async (doc: Document) => {
    const { error } = await supabase
      .from('documents')
      .update({ visible_to_investors: !doc.visible_to_investors })
      .eq('id', doc.id)
    if (error) toast.error('Fehler beim Ändern der Sichtbarkeit')
    else { toast.success('Sichtbarkeit aktualisiert'); fetchDocs() }
  }

  const handleDelete = async (doc: Document) => {
    if (!confirm(`"${doc.file_name || doc.section}" wirklich löschen?`)) return
    if (doc.file_url) {
      const path = storagePath(doc.file_url)
      await supabase.storage.from('documents').remove([path])
    }
    const { error } = await supabase.from('documents').delete().eq('id', doc.id)
    if (error) toast.error('Fehler beim Löschen')
    else { toast.success('Dokument gelöscht'); fetchDocs() }
  }

  const catValueByLabel: Record<string, string> = Object.fromEntries(
    CATEGORIES.map(c => [c.label, c.value])
  )
  const filtered = tab === 'Alle' ? docs : docs.filter(d => d.category === catValueByLabel[tab])

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Dokumente verwalten
      </h1>

      {/* Upload Card */}
      <div className="rounded-[20px] p-6 border mb-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
          Dokument hochladen
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Section */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Bereich
            </label>
            <select
              value={form.section}
              onChange={e => setForm(p => ({ ...p, section: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Kategorie
            </label>
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border"
              style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Sichtbar für Investoren
            </label>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, visible: !p.visible }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm border flex items-center gap-2 transition"
              style={{
                background: form.visible ? 'rgba(6,61,62,0.08)' : 'var(--surface2)',
                borderColor: form.visible ? '#063D3E' : 'var(--border)',
                color: form.visible ? '#063D3E' : 'var(--text-secondary)',
              }}
            >
              {form.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              {form.visible ? 'Ja — sichtbar' : 'Nein — versteckt'}
            </button>
          </div>
        </div>

        {/* Drop zone */}
        <label className="cursor-pointer block">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.pptx"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center transition hover:border-accent1"
            style={{ borderColor: uploading ? '#063D3E' : 'var(--border)' }}
          >
            <Upload size={28} className="mx-auto mb-2" style={{ color: uploading ? '#063D3E' : 'var(--text-secondary)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {uploading ? 'Wird hochgeladen…' : 'PDF, PNG, JPG oder PPTX hierher ziehen oder klicken'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Max. 50 MB · Bestehende Datei für diesen Bereich wird ersetzt
            </p>
          </div>
        </label>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition"
            style={{
              background: tab === t ? '#063D3E' : 'var(--surface2)',
              color: tab === t ? 'white' : 'var(--text-secondary)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      {filtered.length === 0 ? (
        <div className="rounded-[20px] p-10 text-center border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-3xl mb-2">📄</p>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Keine Dokumente vorhanden</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Lade oben ein Dokument hoch</p>
        </div>
      ) : (
        <div className="rounded-[20px] border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Datei', 'Bereich', 'Kategorie', 'Sichtbarkeit', 'Datum', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr
                  key={d.id}
                  className="border-b last:border-0 hover:bg-surface2 transition"
                  style={{ borderColor: 'var(--border)', background: i % 2 === 0 ? undefined : 'rgba(0,0,0,0.01)' }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 text-[10px] font-bold"
                        style={{ background: '#063D3E' }}>
                        {fileIcon(d.file_name)}
                      </span>
                      <div>
                        <p className="font-medium text-xs truncate max-w-[160px]" style={{ color: 'var(--text-primary)' }}>
                          {d.file_name || d.section}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          {fileTypeLabel(d.file_name)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-primary)' }}>
                    {SECTIONS.find(s => s.value === d.section)?.label ?? d.section}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {CATEGORIES.find(c => c.value === d.category)?.label ?? d.category}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleVisibility(d)}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition"
                      style={{
                        background: d.visible_to_investors ? 'rgba(6,61,62,0.10)' : 'var(--surface2)',
                        color: d.visible_to_investors ? '#063D3E' : 'var(--text-secondary)',
                      }}
                    >
                      {d.visible_to_investors ? <Eye size={12} /> : <EyeOff size={12} />}
                      {d.visible_to_investors ? 'Sichtbar' : 'Versteckt'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(d.updated_at).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {d.file_url && (
                        <a
                          href={d.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1 rounded-lg hover:opacity-80 transition"
                          style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}
                        >
                          Öffnen
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(d)}
                        className="text-red-400 hover:text-red-600 transition p-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}
