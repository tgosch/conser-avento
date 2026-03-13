import { useEffect, useState, useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { supabase } from '../../lib/supabase'
import type { Document } from '../../lib/supabase'
import {
  Upload, Trash2, FileText, Image, Presentation,
  ExternalLink, CheckCircle, CloudUpload, AlertCircle,
} from 'lucide-react'
import { toast } from 'react-toastify'

/* ─── Constants ─────────────────────────────────────────────────── */
const SECTIONS = [
  { value: 'pitch-deck',              label: 'Pitch-Deck',                    category: 'pitch-deck' },
  { value: 'business-plan',           label: 'Business-Plan',                 category: 'business' },
  { value: 'finanzplan',              label: 'Finanzplan',                    category: 'finanzen' },
  { value: 'sales-funnel-endkunden',  label: 'Sales Funnel Endkunden',        category: 'sales' },
  { value: 'sales-funnel-business',   label: 'Sales Funnel Business',         category: 'sales' },
  { value: 'persona-endkunde',        label: 'Persona Endkunde',              category: 'persona' },
  { value: 'persona-businesspartner', label: 'Persona Businesspartner',       category: 'persona' },
  { value: 'finanzanalyse',           label: 'Detaillierte Finanzanalyse',    category: 'finanzen' },
  { value: 'invest-moeglichkeiten',   label: 'Invest & Möglichkeiten',        category: 'business' },
  { value: 'roadmap-kapital',         label: 'Roadmap Kapital',               category: 'business' },
  { value: 'sicherheiten',            label: 'Sicherheiten & Treuhänder',     category: 'business' },
]

const CATEGORIES = [
  { value: 'pitch-deck', label: 'Pitch Deck' },
  { value: 'business',   label: 'Business' },
  { value: 'finanzen',   label: 'Finanzen' },
  { value: 'sales',      label: 'Sales' },
  { value: 'persona',    label: 'Personas' },
]
const TABS = ['Alle', ...CATEGORIES.map(c => c.label)]

/* ─── Helpers ───────────────────────────────────────────────────── */
function getFileStyle(name?: string) {
  const ext = name?.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf')
    return { label: 'PDF', color: '#FF3B30', bg: 'rgba(255,59,48,0.10)', Icon: FileText }
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext))
    return { label: ext.toUpperCase(), color: '#0066FF', bg: 'rgba(0,102,255,0.10)', Icon: Image }
  if (['pptx', 'ppt'].includes(ext))
    return { label: 'PPT', color: '#FF9500', bg: 'rgba(255,149,0,0.10)', Icon: Presentation }
  return { label: 'FILE', color: '#8E8E93', bg: 'rgba(142,142,147,0.10)', Icon: FileText }
}

function getPublicUrl(filePath: string) {
  const { data } = supabase.storage.from('documents').getPublicUrl(filePath)
  return data.publicUrl
}

/* ─── Empty state ───────────────────────────────────────────────── */
function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <svg width="120" height="96" viewBox="0 0 120 96" fill="none" className="mb-6">
        <rect x="28" y="18" width="64" height="78" rx="8" fill="#E5E7EB" />
        <rect x="20" y="10" width="64" height="78" rx="8" fill="#F3F4F6" />
        <rect x="12" y="2" width="64" height="78" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="24" y="18" width="40" height="5" rx="2.5" fill="#0066FF" fillOpacity="0.2" />
        <rect x="24" y="30" width="32" height="3" rx="1.5" fill="#E5E7EB" />
        <circle cx="86" cy="72" r="18" fill="#0066FF" fillOpacity="0.08" />
        <circle cx="86" cy="72" r="9" fill="#0066FF" />
        <path d="M86 76V68M83 71l3-3 3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="text-lg font-bold mb-1.5" style={{ color: '#000000' }}>Noch keine Dokumente</h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: '#666666' }}>
        Lade Pitch-Decks, Finanzpläne & Co. für deine Investoren hoch
      </p>
      <button
        onClick={onUploadClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
        style={{ background: '#0066FF', boxShadow: '0 4px 12px rgba(0,102,255,0.30)' }}
      >
        <Upload size={16} /> Erstes Dokument hochladen
      </button>
    </div>
  )
}

/* ─── File card ─────────────────────────────────────────────────── */
function FileCard({ doc, onDelete }: { doc: Document; onDelete: (d: Document) => void }) {
  const { label, color, bg, Icon } = getFileStyle(doc.name)
  const publicUrl = doc.file_path ? getPublicUrl(doc.file_path) : null
  const catLabel = CATEGORIES.find(c => c.value === doc.category)?.label ?? doc.category ?? ''

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border card-enter hover-lift"
      style={{ background: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      {/* Thumbnail */}
      <div className="h-28 flex items-center justify-center relative" style={{ background: bg }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: color, boxShadow: `0 4px 12px ${color}40` }}>
          <Icon size={26} color="white" />
        </div>
        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: color }}>{label}</span>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="font-semibold text-sm truncate mb-1" style={{ color: '#000000' }}>
          {doc.name ?? 'Dokument'}
        </p>
        <p className="text-xs" style={{ color: '#999999' }}>{catLabel}</p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
        {publicUrl && (
          <a href={publicUrl} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
            <ExternalLink size={16} style={{ color: '#0066FF' }} />
          </a>
        )}
        <button onClick={() => onDelete(doc)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
          <Trash2 size={16} style={{ color: '#FF3B30' }} />
        </button>
      </div>
    </div>
  )
}

/* ─── Main component ────────────────────────────────────────────── */
export default function OwnerDocs() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [tab, setTab] = useState('Alle')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0].value)

  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Fetch ─────────────────────────────────────────────────────── */
  const fetchDocs = async () => {
    setLoading(true)
    setFetchError(null)
    const { data, error } = await supabase
      .from('documents')
      .select('id, name, file_path, category, owner_id')
      .order('id', { ascending: false })
    if (error) {
      console.error('[Docs fetch]', error)
      setFetchError(error.message)
    } else {
      setDocs((data ?? []) as Document[])
    }
    setLoading(false)
  }

  useEffect(() => { fetchDocs() }, [])

  /* ── Progress simulation ────────────────────────────────────────── */
  const startProgress = () => {
    setUploadProgress(5)
    progressTimer.current = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 88) { clearInterval(progressTimer.current!); return p }
        return p + (88 - p) * 0.12
      })
    }, 80)
  }
  const finishProgress = (ok: boolean) => {
    if (progressTimer.current) clearInterval(progressTimer.current)
    setUploadProgress(100)
    if (ok) {
      setUploadSuccess(true)
      setTimeout(() => { setUploadSuccess(false); setUploadProgress(0) }, 1400)
    } else {
      setTimeout(() => setUploadProgress(0), 600)
    }
  }

  /* ── Upload Validation ──────────────────────────────────────────── */
  const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'pptx', 'ppt', 'docx', 'xlsx']
  const MAX_FILE_SIZE_MB = 1024 // 1 GB
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

  const validateFile = (file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Dateityp ".${ext}" ist nicht erlaubt. Erlaubt: ${ALLOWED_EXTENSIONS.join(', ')}`
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Datei ist zu groß (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum: ${MAX_FILE_SIZE_MB} MB`
    }
    if (file.size === 0) {
      return 'Datei ist leer und kann nicht hochgeladen werden.'
    }
    return null
  }

  // Ermittle korrekten MIME-Typ anhand der Dateiendung (Browser-Angabe ist unzuverlässig)
  const getContentType = (file: File): string => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const map: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg', jpeg: 'image/jpeg',
      gif: 'image/gif', webp: 'image/webp',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ppt: 'application/vnd.ms-powerpoint',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    return map[ext] ?? file.type ?? 'application/octet-stream'
  }

  /* ── Upload ─────────────────────────────────────────────────────── */
  const uploadFile = async (file: File) => {
    if (uploading) return

    // Validierung vor Upload
    const validationError = validateFile(file)
    if (validationError) {
      toast.error(`Upload abgelehnt: ${validationError}`)
      return
    }

    setUploading(true)
    startProgress()

    try {
      // 1 — Get owner_id (optional – upload works without it)
      const { data: { session } } = await supabase.auth.getSession()
      const ownerId: string | null = session?.user?.id ?? null

      // 2 — Upload file with unique name (timestamp-originalname)
      const section = SECTIONS.find(s => s.value === selectedSection)!
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${section.category}/${Date.now()}-${safeName}`

      // Versuche Upload mit korrektem Content-Type
      let storageErr = (await supabase.storage
        .from('documents')
        .upload(filePath, file, { upsert: true, contentType: getContentType(file) })).error

      // Fallback: Upload als Blob ohne deklarierten MIME-Type (umgeht Bucket-Restrictions)
      if (storageErr) {
        const buf = await file.arrayBuffer()
        const blob = new Blob([buf])
        const result2 = await supabase.storage
          .from('documents')
          .upload(filePath, blob, { upsert: true, contentType: getContentType(file) })
        storageErr = result2.error
      }

      if (storageErr) throw new Error(`Storage-Fehler: ${storageErr.message} — Bitte führe fix_documents_bucket.sql im Supabase SQL-Editor aus.`)

      // 3 — Insert DB record with confirmed columns
      const insertRow: Record<string, unknown> = {
        name: file.name,
        file_path: filePath,
        category: section.category,
      }
      if (ownerId) insertRow.owner_id = ownerId

      const { error: dbErr } = await supabase
        .from('documents')
        .insert(insertRow)
      if (dbErr) {
        // Storage-Upload rückgängig machen
        await supabase.storage.from('documents').remove([filePath])
        throw new Error(`Datenbank: ${dbErr.message}`)
      }

      // 4 — Done
      finishProgress(true)
      toast.success('✅ Dokument erfolgreich hochgeladen')
      fetchDocs()

    } catch (err: unknown) {
      finishProgress(false)
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[Upload]', msg)
      toast.error(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  /* ── Delete ─────────────────────────────────────────────────────── */
  const handleDelete = async (doc: Document) => {
    if (!confirm(`"${doc.name ?? 'Dokument'}" wirklich löschen?`)) return
    if (doc.file_path) {
      const { error: sErr } = await supabase.storage.from('documents').remove([doc.file_path])
      if (sErr) { toast.error(`Storage: ${sErr.message}`); return }
    }
    const { error: dErr } = await supabase.from('documents').delete().eq('id', doc.id)
    if (dErr) toast.error(`Datenbank: ${dErr.message}`)
    else { toast.success('Gelöscht'); fetchDocs() }
  }

  /* ── Drag & drop ────────────────────────────────────────────────── */
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); dragCounter.current++; setIsDragging(true)
  }
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault()
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); dragCounter.current = 0; setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && !uploading) uploadFile(f)
  }
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f && !uploading) uploadFile(f)
  }

  /* ── Filter ─────────────────────────────────────────────────────── */
  const catByLabel = Object.fromEntries(CATEGORIES.map(c => [c.label, c.value]))
  const filtered = tab === 'Alle' ? docs : docs.filter(d => d.category === catByLabel[tab])

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Dokumente</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666666' }}>Verwalte deine Investoren-Dokumente</p>
        </div>
      </div>

      {/* Upload card */}
      <div className="rounded-[20px] p-5 border mb-6"
        style={{ background: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

        {/* Section selector */}
        <div className="mb-5">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: '#000000' }}>
            Bereich / Kategorie
          </label>
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            disabled={uploading}
            className="w-full sm:w-auto px-3 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#333333', minWidth: 260 }}
            onFocus={e => { e.target.style.borderColor = '#0066FF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,102,255,0.10)' }}
            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
          >
            {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.pptx,.docx,.xlsx"
          className="hidden"
          onChange={handleFileInput}
          disabled={uploading}
        />

        {/* Drop zone */}
        <div
          className="relative rounded-2xl overflow-hidden cursor-pointer"
          style={{
            minHeight: 280,
            border: `2px dashed ${isDragging ? '#0066FF' : uploading ? '#0066FF' : '#D1D5DB'}`,
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {/* Background */}
          <div className="absolute inset-0 transition-all duration-300" style={{
            background: isDragging
              ? 'linear-gradient(135deg, rgba(0,102,255,0.05) 0%, rgba(0,102,255,0.10) 100%)'
              : 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 100%)',
          }} />

          {/* Idle state */}
          {!uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-20 h-20 rounded-[22px] flex items-center justify-center transition-all duration-300"
                style={{
                  background: isDragging ? '#0066FF' : 'rgba(0,102,255,0.10)',
                  transform: isDragging ? 'scale(1.08)' : 'scale(1)',
                  animation: isDragging ? 'upload-pulse 1.2s ease-in-out infinite' : 'none',
                }}>
                <CloudUpload size={36} style={{ color: isDragging ? '#FFFFFF' : '#0066FF' }} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-base" style={{ color: '#000000' }}>
                  {isDragging ? 'Loslassen zum Hochladen' : 'Dokument hierher ziehen oder klicken'}
                </p>
                <p className="text-sm mt-1" style={{ color: '#999999' }}>
                  PDF, Bilder, Word, Excel · Max. 50 MB
                </p>
              </div>
              {!isDragging && (
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                  style={{ background: '#0066FF', boxShadow: '0 4px 12px rgba(0,102,255,0.28)' }}
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
                >
                  <Upload size={15} /> Datei auswählen
                </button>
              )}
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
              <div className="w-full max-w-sm">
                {uploadSuccess ? (
                  <>
                    <div className="flex justify-center mb-4 check-bounce">
                      <CheckCircle size={48} style={{ color: '#34C759' }} />
                    </div>
                    <p className="text-center text-sm font-semibold" style={{ color: '#34C759' }}>
                      Erfolgreich hochgeladen!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold" style={{ color: '#000000' }}>Wird hochgeladen…</p>
                      <p className="text-sm font-bold" style={{ color: '#0066FF' }}>{Math.round(uploadProgress)}%</p>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                      <div className="h-full rounded-full relative overflow-hidden transition-all duration-300"
                        style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg, #0066FF, #3385FF)' }}>
                        <div className="absolute inset-y-0 w-1/3" style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                          animation: 'progress-stripe 1.2s ease-in-out infinite',
                        }} />
                      </div>
                    </div>
                    <p className="text-xs mt-2 text-center" style={{ color: '#999999' }}>Bitte warten…</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200"
            style={{
              background: tab === t ? '#0066FF' : 'var(--surface2)',
              color: tab === t ? '#FFFFFF' : 'var(--text-secondary)',
              boxShadow: tab === t ? '0 2px 8px rgba(0,102,255,0.25)' : 'none',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: '#E5E7EB', borderTopColor: '#0066FF' }} />
            <p className="text-sm" style={{ color: '#999999' }}>Dokumente laden…</p>
          </div>
        </div>
      ) : fetchError ? (
        <div className="rounded-[20px] border p-8 text-center" style={{ background: '#FFF5F5', borderColor: '#FED7D7' }}>
          <AlertCircle size={32} className="mx-auto mb-3" style={{ color: '#FF3B30' }} />
          <p className="font-semibold text-sm mb-1" style={{ color: '#FF3B30' }}>Fehler beim Laden</p>
          <p className="text-xs mb-4 font-mono" style={{ color: '#666666' }}>{fetchError}</p>
          <button onClick={fetchDocs}
            className="text-xs px-4 py-2 rounded-lg text-white font-semibold"
            style={{ background: '#FF3B30' }}>
            Erneut versuchen
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[20px] border"
          style={{ background: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <EmptyState onUploadClick={() => fileInputRef.current?.click()} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(doc => (
            <FileCard key={doc.id} doc={doc} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
