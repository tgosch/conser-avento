import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Upload, ChevronRight, ChevronLeft, ChevronRight as NextIcon, Maximize2, Minimize2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Document } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const planOrder = [
  'pitch-deck', 'business-plan', 'sales-funnel-endkunden', 'sales-funnel-business',
  'persona-endkunde', 'persona-businesspartner', 'finanzanalyse',
  'finanzplan', 'invest-moeglichkeiten', 'roadmap-kapital', 'sicherheiten',
]

const planMeta: Record<string, { label: string; desc: string; icon: string }> = {
  'pitch-deck':               { label: 'Pitch-Deck',                  desc: 'Vollständige Investorenpräsentation',            icon: '📊' },
  'business-plan':            { label: 'Business-Plan',               desc: 'Strategische Planung und Märkte',                icon: '📋' },
  'finanzplan':               { label: 'Finanzplan',                  desc: 'Finanzierungsübersicht und Prognosen',           icon: '💹' },
  'sales-funnel-endkunden':   { label: 'Sales Funnel Endkunden',      desc: 'Verkaufsstrategie für Endkunden',               icon: '📈' },
  'sales-funnel-business':    { label: 'Sales Funnel Business',       desc: 'B2B Verkaufsstrategie',                         icon: '🏢' },
  'persona-endkunde':         { label: 'Persona Endkunde',            desc: 'Zielgruppen-Profil Endkunden',                  icon: '👤' },
  'persona-businesspartner':  { label: 'Persona Businesspartner',     desc: 'Zielgruppen-Profil B2B',                        icon: '🤝' },
  'finanzanalyse':            { label: 'Detaillierte Finanzanalyse',  desc: 'Tiefgehende Finanzauswertung',                  icon: '📉' },
  'invest-moeglichkeiten':    { label: 'Invest & Möglichkeiten',      desc: 'Investitionsoptionen und Rendite',              icon: '💵' },
  'roadmap-kapital':          { label: 'Roadmap Kapital',             desc: 'Kapitalbedarf-Planung',                         icon: '🗓️' },
  'sicherheiten':             { label: 'Sicherheiten & Treuhänder',   desc: 'Rechtliche Absicherung für Investoren',         icon: '🔐' },
}

export default function PlanDetail() {
  const { section } = useParams<{ section: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const viewerRef = useRef<HTMLDivElement>(null)
  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const meta = section ? planMeta[section] : null
  const currentIndex = planOrder.indexOf(section ?? '')
  const prevSection = currentIndex > 0 ? planOrder[currentIndex - 1] : null
  const nextSection = currentIndex < planOrder.length - 1 ? planOrder[currentIndex + 1] : null

  useEffect(() => {
    if (!section) return
    setLoading(true)
    supabase.from('documents').select('*').eq('section', section).single()
      .then(({ data }) => { setDoc(data); setLoading(false) })
      .then(undefined, () => setLoading(false))
  }, [section])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !section) return
    setUploading(true)
    try {
      const fileName = `${section}.pdf`
      const { error: upErr } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true })
      if (upErr) throw upErr

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)

      const { data: docData, error: dbErr } = await supabase
        .from('documents')
        .upsert({ section, file_name: file.name, file_url: urlData.publicUrl })
        .select().single()
      if (dbErr) throw dbErr

      setDoc(docData)
      toast.success('PDF erfolgreich hochgeladen')
    } catch {
      toast.error('Upload fehlgeschlagen')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const toggleFullscreen = () => {
    if (!viewerRef.current) return
    if (!fullscreen) {
      viewerRef.current.requestFullscreen?.().then(() => setFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen?.().then(() => setFullscreen(false)).catch(() => {})
    }
  }

  if (!meta) return <div className="p-8 text-center text-secondary">Bereich nicht gefunden.</div>

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-secondary mb-6">
        <Link to="/dashboard" className="hover:text-accent1 transition">Dashboard</Link>
        <ChevronRight size={12} />
        <Link to="/dashboard/plans" className="hover:text-accent1 transition">Pläne</Link>
        <ChevronRight size={12} />
        <span className="text-text font-medium">{meta.label}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[16px] bg-accent1/10 flex items-center justify-center text-3xl shrink-0">
            {meta.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{meta.label}</h1>
            <p className="text-secondary text-sm mt-0.5">{meta.desc}</p>
          </div>
        </div>

        {user?.isAdmin && (
          <label className="shrink-0 cursor-pointer">
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
            <span className={`flex items-center gap-2 text-white rounded-btn px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`} style={{ background: '#063D3E' }}>
              <Upload size={14} />
              {uploading ? 'Lädt…' : 'PDF hochladen'}
            </span>
          </label>
        )}
      </div>

      {/* Viewer */}
      <div
        ref={viewerRef}
        className="bg-surface rounded-card border border-black/5 overflow-hidden mb-4 relative"
        style={{ aspectRatio: '16/9', boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' }}
      >
        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-lg flex items-center justify-center transition"
        >
          {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>

        {loading ? (
          <div className="w-full h-full bg-surface2 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 animate-pulse" />
          </div>
        ) : doc?.file_url ? (
          <iframe
            src={doc.file_url}
            title={meta.label}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            <div className="text-6xl mb-4">{meta.icon}</div>
            <h3 className="text-xl font-semibold text-text mb-2">Inhalt wird bald hinzugefügt</h3>
            <p className="text-secondary text-sm max-w-sm">
              Dieses Dokument wird in Kürze für Sie bereitgestellt.
            </p>
            {user?.isAdmin && (
              <p className="mt-3 text-sm text-accent1 font-medium">
                Als Admin können Sie oben rechts eine PDF hochladen.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {prevSection ? (
          <button
            onClick={() => navigate(`/dashboard/plans/${prevSection}`)}
            className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-accent1 transition"
          >
            <ChevronLeft size={16} /> {planMeta[prevSection]?.label}
          </button>
        ) : <div />}

        <span className="text-xs text-secondary/50">
          {currentIndex + 1} / {planOrder.length}
        </span>

        {nextSection ? (
          <button
            onClick={() => navigate(`/dashboard/plans/${nextSection}`)}
            className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-accent1 transition"
          >
            {planMeta[nextSection]?.label} <NextIcon size={16} />
          </button>
        ) : <div />}
      </div>
    </div>
  )
}
