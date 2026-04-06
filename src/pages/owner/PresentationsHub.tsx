import { useEffect, useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { supabase } from '../../lib/supabase'
import {
  validateFile, getContentType, getCategoryMeta, getFileTypeBadge,
  getSignedUrl, deletePresentationFile, togglePublicFlag, trackDownload,
  PRES_CATEGORIES,
} from '../../lib/presentations'
import type { Presentation } from '../../lib/presentations'
import {
  Upload, CloudUpload, CheckCircle, AlertCircle,
  Trash2, Download, Eye, EyeOff, X, LayoutGrid, List,
  Plus, Search,
} from 'lucide-react'
import { toast } from 'react-toastify'

/* ─── Types ──────────────────────────────────────────────────── */
interface UploadForm {
  title: string
  description: string
  category: Presentation['category']
  tags: string
  isPublic: boolean
}

const EMPTY_FORM: UploadForm = {
  title: '',
  description: '',
  category: 'pitch',
  tags: '',
  isPublic: false,
}

/* ─── File Type Icon ─────────────────────────────────────────── */
function FileTypeBadge({ filePath }: { filePath: string }) {
  const { label, color } = getFileTypeBadge(filePath)
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white shrink-0"
      style={{ background: color }}
    >
      {label}
    </span>
  )
}

/* ─── Grid Card ──────────────────────────────────────────────── */
function GridCard({
  p,
  onDelete,
  onTogglePublic,
  onDownload,
}: {
  p: Presentation
  onDelete: (p: Presentation) => void
  onTogglePublic: (p: Presentation) => void
  onDownload: (p: Presentation) => void
}) {
  const cat = getCategoryMeta(p.category)
  return (
    <div
      className="group relative rounded-xl overflow-hidden border hover-lift"
      style={{ background: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      {/* Colour header */}
      <div className="h-20 flex items-center justify-center relative" style={{ background: cat.bg }}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: cat.color, boxShadow: `0 4px 12px ${cat.color}40` }}
        >
          <span className="text-xl text-white">📊</span>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <FileTypeBadge filePath={p.file_path} />
        </div>
        <div className="absolute top-2 left-2">
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
            style={{
              background: p.is_public ? 'rgba(52,199,89,0.15)' : 'rgba(142,142,147,0.15)',
              color: p.is_public ? '#34C759' : '#8E8E93',
            }}
          >
            {p.is_public ? '🌐 Public' : '🔒 Privat'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-sm truncate mb-0.5" style={{ color: '#000000' }} title={p.title}>
          {p.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
            style={{ background: cat.bg, color: cat.color }}
          >
            {cat.label}
          </span>
          {p.version > 1 && (
            <span className="text-[10px] text-gray-400">v{p.version}</span>
          )}
          <span className="text-[10px] ml-auto" style={{ color: '#999' }}>
            {p.download_count} ↓
          </span>
        </div>
        {p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {p.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: '#F3F4F6', color: '#666' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(4px)' }}
      >
        <button
          onClick={() => onDownload(p)}
          title="Herunterladen"
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Download size={15} style={{ color: '#063D3E' }} />
        </button>
        <button
          onClick={() => onTogglePublic(p)}
          title={p.is_public ? 'Privat machen' : 'Öffentlich machen'}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
        >
          {p.is_public
            ? <EyeOff size={15} style={{ color: '#FF9500' }} />
            : <Eye size={15} style={{ color: '#34C759' }} />
          }
        </button>
        <button
          onClick={() => onDelete(p)}
          title="Löschen"
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Trash2 size={15} style={{ color: '#FF3B30' }} />
        </button>
      </div>
    </div>
  )
}

/* ─── List Row ───────────────────────────────────────────────── */
function ListRow({
  p,
  onDelete,
  onTogglePublic,
  onDownload,
}: {
  p: Presentation
  onDelete: (p: Presentation) => void
  onTogglePublic: (p: Presentation) => void
  onDownload: (p: Presentation) => void
}) {
  const cat = getCategoryMeta(p.category)
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-[14px] border mb-1.5 hover:bg-gray-50 transition"
      style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: cat.bg }}
      >
        <span className="text-base">📊</span>
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: '#000000' }}>{p.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[10px] font-medium" style={{ color: cat.color }}>{cat.label}</span>
          <FileTypeBadge filePath={p.file_path} />
          {p.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: '#F3F4F6', color: '#666' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <span className="text-xs" style={{ color: '#999' }}>{p.download_count} ↓</span>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: p.is_public ? 'rgba(52,199,89,0.12)' : 'rgba(142,142,147,0.12)',
            color: p.is_public ? '#34C759' : '#8E8E93',
          }}
        >
          {p.is_public ? 'Public' : 'Privat'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onDownload(p)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
          title="Herunterladen"
        >
          <Download size={14} style={{ color: '#666' }} />
        </button>
        <button
          onClick={() => onTogglePublic(p)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
          title={p.is_public ? 'Privat machen' : 'Öffentlich machen'}
        >
          {p.is_public
            ? <EyeOff size={14} style={{ color: '#FF9500' }} />
            : <Eye size={14} style={{ color: '#34C759' }} />
          }
        </button>
        <button
          onClick={() => onDelete(p)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
          title="Löschen"
        >
          <Trash2 size={14} style={{ color: '#FF3B30' }} />
        </button>
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function PresentationsHub() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [tab, setTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showUpload, setShowUpload] = useState(false)

  const [form, setForm] = useState<UploadForm>(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Fetch ─────────────────────────────────────────────────── */
  const fetchPresentations = async () => {
    setLoading(true)
    setFetchError(null)
    const { data, error } = await supabase
      .from('presentations')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setFetchError(error.message)
    } else {
      setPresentations((data ?? []) as Presentation[])
    }
    setLoading(false)
  }

  useEffect(() => { fetchPresentations() }, [])

  /* ── Progress ─────────────────────────────────────────────── */
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

  /* ── File pick ────────────────────────────────────────────── */
  const handleFileSelect = (file: File) => {
    const err = validateFile(file)
    if (err) { toast.error(err); return }
    setSelectedFile(file)
    if (!form.title) {
      const nameWithoutExt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      setForm(f => ({ ...f, title: nameWithoutExt }))
    }
  }

  /* ── Upload ───────────────────────────────────────────────── */
  const handleUpload = async () => {
    if (!selectedFile) { toast.error('Bitte zuerst eine Datei auswählen.'); return }
    if (!form.title.trim()) { toast.error('Titel ist erforderlich.'); return }

    setUploading(true)
    startProgress()

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const ext      = selectedFile.name.split('.').pop()?.toLowerCase() ?? ''
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${form.category}/${Date.now()}-${safeName}`

      const { error: storageErr } = await supabase.storage
        .from('presentations')
        .upload(filePath, selectedFile, { contentType: getContentType(selectedFile) })
      if (storageErr) throw new Error(`Storage: ${storageErr.message}`)

      const sizeMb = parseFloat((selectedFile.size / 1024 / 1024).toFixed(2))
      const tags   = form.tags.split(',').map(t => t.trim()).filter(Boolean)

      const row = {
        title:         form.title.trim(),
        description:   form.description.trim() || null,
        category:      form.category,
        file_path:     filePath,
        file_size_mb:  sizeMb,
        file_type:     ext,
        tags,
        is_public:     form.isPublic,
        uploaded_by:   session?.user?.id ?? null,
      }

      const { error: dbErr } = await supabase.from('presentations').insert(row)
      if (dbErr) {
        await supabase.storage.from('presentations').remove([filePath])
        throw new Error(`DB: ${dbErr.message}`)
      }

      finishProgress(true)
      toast.success('✅ Präsentation hochgeladen')
      setForm(EMPTY_FORM)
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setShowUpload(false)
      fetchPresentations()
    } catch (err: unknown) {
      finishProgress(false)
      toast.error(err instanceof Error ? err.message : String(err))
    } finally {
      setUploading(false)
    }
  }

  /* ── Delete ───────────────────────────────────────────────── */
  const handleDelete = async (p: Presentation) => {
    if (!confirm(`"${p.title}" wirklich löschen?`)) return
    try {
      await deletePresentationFile(p.id, p.file_path)
      toast.success('Gelöscht')
      fetchPresentations()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err))
    }
  }

  /* ── Toggle public ────────────────────────────────────────── */
  const handleTogglePublic = async (p: Presentation) => {
    try {
      await togglePublicFlag(p.id, !p.is_public)
      setPresentations(prev => prev.map(x => x.id === p.id ? { ...x, is_public: !x.is_public } : x))
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err))
    }
  }

  /* ── Download ─────────────────────────────────────────────── */
  const handleDownload = async (p: Presentation) => {
    const url = await getSignedUrl(p.file_path)
    if (!url) { toast.error('Download fehlgeschlagen'); return }
    window.open(url, '_blank', 'noopener')
    await trackDownload(p.id)
    setPresentations(prev => prev.map(x => x.id === p.id ? { ...x, download_count: x.download_count + 1 } : x))
  }

  /* ── Drag & Drop ──────────────────────────────────────────── */
  const handleDragEnter  = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); dragCounter.current++; setIsDragging(true) }
  const handleDragLeave  = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setIsDragging(false) }
  const handleDragOver   = (e: DragEvent<HTMLDivElement>) => e.preventDefault()
  const handleDrop       = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); dragCounter.current = 0; setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileSelect(f)
  }
  const handleFileInput  = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFileSelect(f)
  }

  /* ── Filter ───────────────────────────────────────────────── */
  const filtered = presentations.filter(p => {
    const catMatch    = tab === 'all' || p.category === tab
    const searchMatch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return catMatch && searchMatch
  })

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>Präsentationen</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666' }}>
            {presentations.length} Dateien · {presentations.filter(p => p.is_public).length} öffentlich
          </p>
        </div>
        <button
          onClick={() => setShowUpload(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
          style={{ background: '#063D3E', boxShadow: '0 4px 12px rgba(6,61,62,0.28)' }}
        >
          {showUpload ? <X size={15} /> : <Plus size={15} />}
          {showUpload ? 'Schließen' : 'Neue Präsentation'}
        </button>
      </div>

      {/* Upload Panel */}
      {showUpload && (
        <div
          className="rounded-xl p-5 border mb-6 accordion-content"
          style={{ background: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <h2 className="font-bold text-sm mb-4" style={{ color: '#000' }}>Neue Präsentation hochladen</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Drop Zone */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.pptx,.ppt,.key,.png,.jpg,.jpeg,.gif,.docx,.doc,.xlsx,.xls,.csv,.mp4,.mov,.zip"
                className="hidden"
                onChange={handleFileInput}
                disabled={uploading}
              />
              <div
                className="rounded-2xl cursor-pointer overflow-hidden"
                style={{
                  minHeight: 180,
                  border: `2px dashed ${isDragging ? '#063D3E' : selectedFile ? '#34C759' : '#D1D5DB'}`,
                  background: isDragging ? 'rgba(6,61,62,0.04)' : selectedFile ? 'rgba(52,199,89,0.04)' : '#FAFAFA',
                  position: 'relative',
                }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !uploading && !selectedFile && fileInputRef.current?.click()}
              >
                {!uploading && !selectedFile && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                      style={{ background: isDragging ? '#063D3E' : 'rgba(6,61,62,0.10)' }}
                    >
                      <CloudUpload size={28} style={{ color: isDragging ? '#fff' : '#063D3E' }} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm" style={{ color: '#000' }}>
                        {isDragging ? 'Loslassen zum Hochladen' : 'Datei hierher ziehen'}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#999' }}>PDF, PPT, DOCX, XLSX, IMG, MP4, KEY, ZIP · Max 500 MB</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{ background: '#063D3E' }}
                    >
                      <Upload size={12} /> Datei wählen
                    </button>
                  </div>
                )}

                {selectedFile && !uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                    <CheckCircle size={32} style={{ color: '#34C759' }} />
                    <p className="font-semibold text-sm text-center" style={{ color: '#000' }}>{selectedFile.name}</p>
                    <p className="text-xs" style={{ color: '#999' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedFile(null); setForm(f => ({ ...f, title: '' })); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="text-xs px-3 py-1.5 rounded-lg border"
                      style={{ borderColor: '#E5E7EB', color: '#666' }}
                    >
                      Andere Datei wählen
                    </button>
                  </div>
                )}

                {uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                    {uploadSuccess ? (
                      <>
                        <CheckCircle size={40} style={{ color: '#34C759' }} />
                        <p className="text-sm font-semibold" style={{ color: '#34C759' }}>Hochgeladen!</p>
                      </>
                    ) : (
                      <>
                        <div className="w-full max-w-[200px]">
                          <div className="flex justify-between mb-1.5">
                            <p className="text-xs font-semibold" style={{ color: '#000' }}>Wird hochgeladen…</p>
                            <p className="text-xs font-bold" style={{ color: '#063D3E' }}>{Math.round(uploadProgress)}%</p>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%`, background: '#063D3E' }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#333' }}>Titel *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="z.B. Pitch Deck Q1 2026"
                  className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#000' }}
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#333' }}>Kategorie</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as Presentation['category'] }))}
                  className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#000' }}
                  disabled={uploading}
                >
                  {PRES_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#333' }}>Beschreibung</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Kurze Beschreibung…"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl text-sm border outline-none resize-none"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#000' }}
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: '#333' }}>Tags (Komma-getrennt)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="Avento, Conser, Q1-2026"
                  className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#000' }}
                  disabled={uploading}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => !uploading && setForm(f => ({ ...f, isPublic: !f.isPublic }))}
                    className="w-10 h-6 rounded-full relative transition-colors duration-200"
                    style={{ background: form.isPublic ? '#34C759' : '#D1D5DB' }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                      style={{ left: form.isPublic ? '22px' : '4px' }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#333' }}>
                    {form.isPublic ? 'Öffentlich für Investoren' : 'Privat (nur Owner)'}
                  </span>
                </label>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                style={{ background: '#063D3E', boxShadow: '0 4px 12px rgba(6,61,62,0.25)' }}
              >
                {uploading ? 'Wird hochgeladen…' : 'Präsentation hochladen →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setTab('all')}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
          style={{
            background: tab === 'all' ? '#063D3E' : 'var(--surface2, #F3F4F6)',
            color: tab === 'all' ? '#FFF' : '#666',
          }}
        >
          Alle ({presentations.length})
        </button>
        {PRES_CATEGORIES.map(c => {
          const count = presentations.filter(p => p.category === c.value).length
          if (count === 0) return null
          return (
            <button
              key={c.value}
              onClick={() => setTab(c.value)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: tab === c.value ? c.color : 'var(--surface2, #F3F4F6)',
                color: tab === c.value ? '#FFF' : '#666',
              }}
            >
              {c.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Search + view toggle */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: '#FAFAFA', borderColor: '#E5E7EB' }}>
          <Search size={14} style={{ color: '#999' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Suchen…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#000' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <X size={12} style={{ color: '#999' }} />
            </button>
          )}
        </div>
        <div className="flex items-center rounded-xl border overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
          <button
            onClick={() => setViewMode('grid')}
            className="px-3 py-2 transition"
            style={{ background: viewMode === 'grid' ? '#063D3E' : '#FFF', color: viewMode === 'grid' ? '#FFF' : '#666' }}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="px-3 py-2 transition"
            style={{ background: viewMode === 'list' ? '#063D3E' : '#FFF', color: viewMode === 'list' ? '#FFF' : '#666' }}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#E5E7EB', borderTopColor: '#063D3E' }} />
        </div>
      ) : fetchError ? (
        <div className="rounded-xl border p-8 text-center" style={{ background: '#FFF5F5', borderColor: '#FED7D7' }}>
          <AlertCircle size={32} className="mx-auto mb-3" style={{ color: '#FF3B30' }} />
          <p className="font-semibold text-sm mb-1" style={{ color: '#FF3B30' }}>Fehler beim Laden</p>
          <p className="text-xs mb-4 font-mono" style={{ color: '#666' }}>{fetchError}</p>
          <button onClick={fetchPresentations} className="text-xs px-4 py-2 rounded-lg text-white font-semibold" style={{ background: '#FF3B30' }}>
            Erneut versuchen
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border p-16 text-center" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <p className="text-4xl mb-4">📂</p>
          <p className="font-semibold text-sm mb-1" style={{ color: '#000' }}>
            {searchQuery ? 'Keine Treffer' : 'Noch keine Präsentationen'}
          </p>
          <p className="text-xs" style={{ color: '#999' }}>
            {searchQuery ? `Keine Datei für "${searchQuery}" gefunden` : 'Lade die erste Präsentation hoch'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold mx-auto"
              style={{ background: '#063D3E' }}
            >
              <Plus size={12} /> Hochladen
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(p => (
            <GridCard
              key={p.id}
              p={p}
              onDelete={handleDelete}
              onTogglePublic={handleTogglePublic}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div>
          {filtered.map(p => (
            <ListRow
              key={p.id}
              p={p}
              onDelete={handleDelete}
              onTogglePublic={handleTogglePublic}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  )
}
