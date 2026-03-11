import { useEffect, useState, useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { supabaseAdmin } from '../../lib/supabase'
import type { Document } from '../../lib/supabase'
import {
  Upload, Trash2, Eye, EyeOff, FileText, Image, Presentation,
  ExternalLink, CheckCircle, CloudUpload,
} from 'lucide-react'
import { toast } from 'react-toastify'

/* ─── Constants ─────────────────────────────────────────────────── */
const SECTIONS = [
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
  { value: 'pitch-deck', label: 'Pitch Deck' },
  { value: 'business',   label: 'Business' },
  { value: 'finanzen',   label: 'Finanzen' },
  { value: 'sales',      label: 'Sales' },
  { value: 'persona',    label: 'Personas' },
  { value: 'other',      label: 'Sonstiges' },
]
const TABS = ['Alle', ...CATEGORIES.map(c => c.label)]

// Derive category from section (no DB column needed)
const SECTION_TO_CATEGORY: Record<string, string> = {
  'pitch-deck':              'pitch-deck',
  'business-plan':           'business',
  'finanzplan':              'finanzen',
  'sales-funnel-endkunden':  'sales',
  'sales-funnel-business':   'sales',
  'persona-endkunde':        'persona',
  'persona-businesspartner': 'persona',
  'finanzanalyse':           'finanzen',
  'invest-moeglichkeiten':   'other',
  'roadmap-kapital':         'other',
  'sicherheiten':            'other',
}

/* ─── Helpers ───────────────────────────────────────────────────── */
function fileType(name?: string) {
  const ext = name?.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf')
    return { label: 'PDF', color: '#FF3B30', bg: 'rgba(255,59,48,0.10)', icon: FileText }
  if (['png','jpg','jpeg','gif','webp'].includes(ext))
    return { label: ext.toUpperCase(), color: '#0066FF', bg: 'rgba(0,102,255,0.10)', icon: Image }
  if (['pptx','ppt'].includes(ext))
    return { label: 'PPT', color: '#FF9500', bg: 'rgba(255,149,0,0.10)', icon: Presentation }
  if (['docx','doc'].includes(ext))
    return { label: 'DOC', color: '#34C759', bg: 'rgba(52,199,89,0.10)', icon: FileText }
  if (['xlsx','xls'].includes(ext))
    return { label: 'XLS', color: '#34C759', bg: 'rgba(52,199,89,0.10)', icon: FileText }
  return { label: 'FILE', color: '#8E8E93', bg: 'rgba(142,142,147,0.10)', icon: FileText }
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Gerade eben'
  if (m < 60) return `vor ${m} Min.`
  const h = Math.floor(m / 60)
  if (h < 24) return `vor ${h} Std.`
  const d = Math.floor(h / 24)
  if (d < 7) return `vor ${d} Tag${d === 1 ? '' : 'en'}`
  return new Date(dateStr).toLocaleDateString('de-DE')
}

function storagePath(url: string) {
  const marker = '/documents/'
  const idx = url.indexOf(marker)
  return idx >= 0 ? url.substring(idx + marker.length) : url
}

/* ─── Sub-components ────────────────────────────────────────────── */
function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      {/* Illustration */}
      <div className="relative mb-6">
        <svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Back doc */}
          <rect x="28" y="18" width="64" height="78" rx="8" fill="#E5E7EB" />
          <rect x="38" y="30" width="36" height="4" rx="2" fill="#D1D5DB" />
          <rect x="38" y="40" width="28" height="3" rx="1.5" fill="#E5E7EB" />
          {/* Middle doc */}
          <rect x="20" y="10" width="64" height="78" rx="8" fill="#F3F4F6" />
          <rect x="32" y="24" width="40" height="4" rx="2" fill="#E5E7EB" />
          <rect x="32" y="34" width="30" height="3" rx="1.5" fill="#F3F4F6" />
          {/* Front doc */}
          <rect x="12" y="2" width="64" height="78" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
          <rect x="24" y="18" width="40" height="5" rx="2.5" fill="#0066FF" fillOpacity="0.2" />
          <rect x="24" y="30" width="32" height="3" rx="1.5" fill="#E5E7EB" />
          <rect x="24" y="38" width="24" height="3" rx="1.5" fill="#F3F4F6" />
          {/* Upload arrow */}
          <circle cx="86" cy="72" r="18" fill="#0066FF" fillOpacity="0.08" />
          <circle cx="86" cy="72" r="13" fill="#0066FF" fillOpacity="0.12" />
          <circle cx="86" cy="72" r="9"  fill="#0066FF" />
          <path d="M86 76V68M83 71l3-3 3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-lg font-bold mb-1.5" style={{ color: '#000000' }}>
        Noch keine Dokumente
      </h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: '#666666' }}>
        Fang an, Rechnungen, Pitch-Decks & Bautagebücher zu organisieren
      </p>
      <button
        onClick={onUploadClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
        style={{ background: '#0066FF', boxShadow: '0 4px 12px rgba(0,102,255,0.30)' }}
      >
        <Upload size={16} />
        Erstes Dokument hochladen
      </button>
    </div>
  )
}

function FileCard({
  doc,
  onDelete,
  onToggleVisibility,
  isDeleting,
}: {
  doc: Document
  onDelete: (d: Document) => void
  onToggleVisibility: (d: Document) => void
  isDeleting: boolean
}) {
  const ft = fileType(doc.file_name)
  const Icon = ft.icon

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border hover-lift ${isDeleting ? 'card-exit' : 'card-enter'}`}
      style={{
        background: '#FFFFFF',
        borderColor: '#E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="h-28 flex items-center justify-center relative"
        style={{ background: ft.bg }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: ft.color, boxShadow: `0 4px 12px ${ft.color}40` }}
        >
          <Icon size={26} color="white" />
        </div>
        <span
          className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: ft.color }}
        >
          {ft.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="font-semibold text-sm truncate mb-1" style={{ color: '#000000' }}>
          {doc.file_name || doc.section}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: '#999999' }}>
            {relativeTime(doc.updated_at)}
          </p>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{
              background: doc.visible_to_investors ? 'rgba(52,199,89,0.10)' : 'rgba(142,142,147,0.10)',
              color: doc.visible_to_investors ? '#34C759' : '#8E8E93',
            }}
          >
            {doc.visible_to_investors ? '● Sichtbar' : '○ Versteckt'}
          </span>
        </div>
      </div>

      {/* Hover action overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      >
        {doc.file_url && (
          <a
            href={doc.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
            title="Öffnen"
          >
            <ExternalLink size={16} style={{ color: '#0066FF' }} />
          </a>
        )}
        <button
          onClick={() => onToggleVisibility(doc)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
          title={doc.visible_to_investors ? 'Verstecken' : 'Sichtbar machen'}
        >
          {doc.visible_to_investors
            ? <EyeOff size={16} style={{ color: '#FF9500' }} />
            : <Eye size={16} style={{ color: '#34C759' }} />}
        </button>
        <button
          onClick={() => onDelete(doc)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
          title="Löschen"
        >
          <Trash2 size={16} style={{ color: '#FF3B30' }} />
        </button>
      </div>
    </div>
  )
}

/* Explicit columns avoids schema-cache issues with optional columns */
const DOC_COLUMNS = 'id, section, category, file_name, file_url, visible_to_investors, updated_at'

/* ─── Main Component ────────────────────────────────────────────── */
export default function OwnerDocs() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [tab, setTab] = useState('Alle')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [diagLog, setDiagLog] = useState<string[]>([])
  const [form, setForm] = useState({ section: 'pitch-deck', visible: true })

  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchDocs = async () => {
    setLoading(true)
    setFetchError(null)
    // Use supabaseAdmin to bypass RLS; explicit columns to avoid schema-cache mismatch
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select(DOC_COLUMNS)
      .order('updated_at', { ascending: false })
    if (error) {
      setFetchError(error.message)
    } else {
      setDocs((data ?? []) as Document[])
    }
    setLoading(false)
  }

  useEffect(() => { fetchDocs() }, [])

  /* Progress simulation */
  const startProgress = () => {
    setUploadProgress(5)
    progressTimer.current = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 88) { clearInterval(progressTimer.current!); return p }
        return p + (88 - p) * 0.12
      })
    }, 80)
  }
  const finishProgress = (success: boolean) => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    setUploadProgress(100)
    if (success) {
      setUploadSuccess(true)
      setTimeout(() => { setUploadSuccess(false); setUploadProgress(0) }, 1400)
    } else {
      setTimeout(() => setUploadProgress(0), 600)
    }
  }

  /* Core upload logic */
  const uploadFile = async (file: File) => {
    setUploading(true)
    startProgress()
    try {
      const ext = file.name.split('.').pop() ?? 'pdf'
      const category = SECTION_TO_CATEGORY[form.section] ?? 'other'
      const storageName = `${category}/${form.section}.${ext}`

      const { data: buckets } = await supabaseAdmin.storage.listBuckets()
      if (!buckets?.find(b => b.name === 'documents'))
        await supabaseAdmin.storage.createBucket('documents', { public: true, fileSizeLimit: 52428800 })

      const { error: upErr } = await supabaseAdmin.storage
        .from('documents').upload(storageName, file, { upsert: true })
      if (upErr) throw new Error(`Storage: ${upErr.message}`)

      const { data: urlData } = supabaseAdmin.storage.from('documents').getPublicUrl(storageName)
      await supabaseAdmin.from('documents').delete().eq('section', form.section)

      const { error: dbErr } = await supabaseAdmin.from('documents').insert({
        section: form.section,
        category,                          // column now exists (nullable)
        file_name: file.name,
        file_url: urlData.publicUrl,
        visible_to_investors: form.visible,
        updated_at: new Date().toISOString(),
      })
      if (dbErr) throw new Error(`DB Insert: ${dbErr.message}`)

      finishProgress(true)
      toast.success('Dokument erfolgreich hochgeladen')
      setDiagLog([])
      fetchDocs()
    } catch (err: unknown) {
      finishProgress(false)
      const msg = err instanceof Error ? err.message : String(err)
      toast.error(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  /* Drag & drop */
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); dragCounter.current++; setIsDragging(true)
  }
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault() }
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); dragCounter.current = 0; setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const toggleVisibility = async (doc: Document) => {
    const { error } = await supabaseAdmin
      .from('documents').update({ visible_to_investors: !doc.visible_to_investors }).eq('id', doc.id)
    if (error) toast.error('Fehler beim Ändern der Sichtbarkeit')
    else { toast.success('Sichtbarkeit aktualisiert'); fetchDocs() }
  }

  const handleDelete = async (doc: Document) => {
    if (!confirm(`"${doc.file_name || doc.section}" wirklich löschen?`)) return
    setDeletingId(doc.id)
    await new Promise(r => setTimeout(r, 280)) // wait for exit animation
    if (doc.file_url) await supabaseAdmin.storage.from('documents').remove([storagePath(doc.file_url)])
    const { error } = await supabaseAdmin.from('documents').delete().eq('id', doc.id)
    if (error) toast.error('Fehler beim Löschen')
    else { toast.success('Dokument gelöscht'); fetchDocs() }
    setDeletingId(null)
  }

  const runDiag = async () => {
    const log: string[] = []
    const add = (msg: string) => { log.push(msg); setDiagLog([...log]) }
    add('🔍 Starte Diagnose...')
    const svcKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY
    add(svcKey ? `✅ Service Key geladen (${svcKey.slice(0, 20)}...)` : '❌ Service Key FEHLT in .env!')
    const { data: buckets, error: bErr } = await supabaseAdmin.storage.listBuckets()
    if (bErr) { add(`❌ Buckets: ${bErr.message}`) }
    else {
      add(`✅ Buckets: ${buckets.map(b => b.name).join(', ') || '(keine)'}`)
      if (!buckets.find(b => b.name === 'documents')) {
        add('⚠️ Bucket fehlt – erstelle...')
        const { error: cErr } = await supabaseAdmin.storage.createBucket('documents', { public: true, fileSizeLimit: 52428800 })
        add(cErr ? `❌ ${cErr.message}` : '✅ Bucket erstellt!')
      }
    }
    const { error: dbErr } = await supabaseAdmin.from('documents').select('id').limit(1)
    add(dbErr ? `❌ DB: ${dbErr.message}` : '✅ DB Zugriff OK')
    add('✅ Diagnose abgeschlossen')
  }

  const catValueByLabel: Record<string, string> = Object.fromEntries(CATEGORIES.map(c => [c.label, c.value]))
  const filtered = tab === 'Alle'
    ? docs
    : docs.filter(d => SECTION_TO_CATEGORY[d.section] === catValueByLabel[tab])

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Dokumente</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666666' }}>Verwalte deine Investoren-Dokumente</p>
        </div>
        <button
          onClick={runDiag}
          className="text-xs px-3 py-1.5 rounded-lg border transition hover:opacity-80"
          style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          🔍 Diagnose
        </button>
      </div>

      {/* Diag Log */}
      {diagLog.length > 0 && (
        <div className="rounded-xl p-4 mb-4 font-mono text-xs space-y-1 border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
          {diagLog.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}

      {/* Upload card */}
      <div
        className="rounded-[20px] p-5 border mb-6"
        style={{ background: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        {/* Form controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Section */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#000000' }}>
              Bereich
            </label>
            <select
              value={form.section}
              onChange={e => setForm(p => ({ ...p, section: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors"
              style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#333333' }}
              onFocus={e => { e.target.style.borderColor = '#0066FF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,102,255,0.10)' }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
            >
              {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#000000' }}>
              Sichtbar für Investoren
            </label>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, visible: !p.visible }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm border flex items-center gap-2 transition-all duration-200"
              style={{
                background: form.visible ? 'rgba(52,199,89,0.08)' : '#F9FAFB',
                borderColor: form.visible ? '#34C759' : '#E5E7EB',
                color: form.visible ? '#34C759' : '#666666',
              }}
            >
              {form.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              {form.visible ? 'Ja — sichtbar' : 'Nein — versteckt'}
            </button>
          </div>
        </div>

        {/* Drop zone */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.pptx,.docx,.xlsx"
          className="hidden"
          onChange={handleFileInput}
          disabled={uploading}
        />
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          style={{ minHeight: 300, border: `2px dashed ${isDragging ? '#0066FF' : uploading ? '#0066FF' : '#D1D5DB'}` }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {/* Gradient background */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: isDragging
                ? 'linear-gradient(135deg, rgba(0,102,255,0.05) 0%, rgba(0,102,255,0.10) 100%)'
                : 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 100%)',
            }}
          />

          {/* Idle / drag state */}
          {!uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <div
                className="w-20 h-20 rounded-[22px] flex items-center justify-center transition-all duration-300"
                style={{
                  background: isDragging ? '#0066FF' : 'rgba(0,102,255,0.10)',
                  transform: isDragging ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isDragging ? '0 8px 24px rgba(0,102,255,0.30)' : 'none',
                  animation: isDragging ? 'upload-pulse 1.2s ease-in-out infinite' : 'none',
                }}
              >
                <CloudUpload
                  size={36}
                  style={{ color: isDragging ? '#FFFFFF' : '#0066FF' }}
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-base" style={{ color: '#000000' }}>
                  {isDragging ? 'Loslassen zum Hochladen' : 'Dokumente hierher ziehen oder klicken'}
                </p>
                <p className="text-sm mt-1" style={{ color: '#999999' }}>
                  PDF, Bilder, Word, Excel · Max. 50 MB
                </p>
              </div>
              {!isDragging && (
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ background: '#0066FF', boxShadow: '0 4px 12px rgba(0,102,255,0.28)' }}
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
                >
                  <Upload size={15} />
                  Datei auswählen
                </button>
              )}
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
              <div className="w-full max-w-sm">
                {/* Success icon */}
                {uploadSuccess && (
                  <div className="flex justify-center mb-4 check-bounce">
                    <CheckCircle size={48} style={{ color: '#34C759' }} />
                  </div>
                )}
                {!uploadSuccess && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold" style={{ color: '#000000' }}>
                        Wird hochgeladen…
                      </p>
                      <p className="text-sm font-bold" style={{ color: '#0066FF' }}>
                        {Math.round(uploadProgress)}%
                      </p>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                      <div
                        className="h-full rounded-full relative overflow-hidden transition-all duration-300"
                        style={{
                          width: `${uploadProgress}%`,
                          background: 'linear-gradient(90deg, #0066FF, #3385FF)',
                        }}
                      >
                        {/* Shimmer */}
                        <div
                          className="absolute inset-y-0 w-1/3"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                            animation: 'progress-stripe 1.2s ease-in-out infinite',
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs mt-2 text-center" style={{ color: '#999999' }}>
                      Bitte warten…
                    </p>
                  </>
                )}
                {uploadSuccess && (
                  <p className="text-center text-sm font-semibold" style={{ color: '#34C759' }}>
                    Erfolgreich hochgeladen!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200"
            style={{
              background: tab === t ? '#0066FF' : 'var(--surface2)',
              color: tab === t ? '#FFFFFF' : 'var(--text-secondary)',
              boxShadow: tab === t ? '0 2px 8px rgba(0,102,255,0.25)' : 'none',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* File grid / Loading / Error / Empty */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#E5E7EB', borderTopColor: '#0066FF' }} />
            <p className="text-sm" style={{ color: '#999999' }}>Dokumente laden…</p>
          </div>
        </div>
      ) : fetchError ? (
        <div
          className="rounded-[20px] border p-8 text-center"
          style={{ background: '#FFF5F5', borderColor: '#FED7D7' }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: '#FF3B30' }}>Fehler beim Laden</p>
          <p className="text-xs mb-3" style={{ color: '#666666' }}>{fetchError}</p>
          <button
            onClick={fetchDocs}
            className="text-xs px-4 py-2 rounded-lg text-white font-semibold"
            style={{ background: '#FF3B30' }}
          >
            Erneut versuchen
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-[20px] border"
          style={{ background: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <EmptyState onUploadClick={() => fileInputRef.current?.click()} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(doc => (
            <FileCard
              key={doc.id}
              doc={doc}
              onDelete={handleDelete}
              onToggleVisibility={toggleVisibility}
              isDeleting={deletingId === doc.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
