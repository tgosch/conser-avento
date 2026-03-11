import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Upload, ChevronRight, ChevronLeft, Maximize2, Minimize2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Document } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const planOrder = [
  'pitch-deck', 'business-plan', 'sales-funnel-endkunden', 'sales-funnel-business',
  'persona-endkunde', 'persona-businesspartner', 'finanzanalyse',
  'finanzplan', 'invest-moeglichkeiten', 'roadmap-kapital', 'sicherheiten',
]

const planMeta: Record<string, { label: string; desc: string; icon: string }> = {
  'pitch-deck':              { label: 'Pitch-Deck',               desc: 'Vollständige Investorenpräsentation',     icon: '📊' },
  'business-plan':           { label: 'Business-Plan',            desc: 'Strategische Planung und Märkte',          icon: '📋' },
  'finanzplan':              { label: 'Finanzplan',               desc: 'Finanzierungsübersicht und Prognosen',     icon: '💹' },
  'sales-funnel-endkunden':  { label: 'Sales Funnel Endkunden',   desc: 'Verkaufsstrategie für Endkunden',          icon: '📈' },
  'sales-funnel-business':   { label: 'Sales Funnel Business',    desc: 'B2B Verkaufsstrategie',                    icon: '🏢' },
  'persona-endkunde':        { label: 'Persona Endkunde',         desc: 'Zielgruppen-Profil Endkunden',             icon: '👤' },
  'persona-businesspartner': { label: 'Persona Businesspartner',  desc: 'Zielgruppen-Profil B2B',                   icon: '🤝' },
  'finanzanalyse':           { label: 'Detaillierte Finanzanalyse', desc: 'Tiefgehende Finanzauswertung',           icon: '📉' },
  'invest-moeglichkeiten':   { label: 'Invest & Möglichkeiten',   desc: 'Investitionsoptionen und Rendite',         icon: '💵' },
  'roadmap-kapital':         { label: 'Roadmap Kapital',          desc: 'Kapitalbedarf-Planung',                    icon: '🗓️' },
  'sicherheiten':            { label: 'Sicherheiten & Treuhänder', desc: 'Rechtliche Absicherung für Investoren',   icon: '🔐' },
}

export default function InvestorPlanDetail() {
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
      const { error: upErr } = await supabase.storage.from('documents').upload(fileName, file, { upsert: true })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
      const { data: docData, error: dbErr } = await supabase
        .from('documents').upsert({ section, file_name: file.name, file_url: urlData.publicUrl }).select().single()
      if (dbErr) throw dbErr
      setDoc(docData)
      toast.success('PDF erfolgreich hochgeladen')
    } catch { toast.error('Upload fehlgeschlagen') }
    finally { setUploading(false); e.target.value = '' }
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
    <div className="max-w-5xl">
      <nav className="flex items-center gap-1.5 text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
        <Link to="/investor/dashboard" className="hover:text-accent1 transition">Dashboard</Link>
        <ChevronRight size={12} />
        <Link to="/investor/plans" className="hover:text-accent1 transition">Pläne</Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)' }} className="font-medium">{meta.label}</span>
      </nav>

      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-3xl shrink-0" style={{ background: 'rgba(6,61,62,0.10)' }}>
            {meta.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{meta.label}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{meta.desc}</p>
          </div>
        </div>

        {user?.isAdmin && (
          <label className="shrink-0 cursor-pointer">
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
            <span className={`flex items-center gap-2 text-white rounded-[12px] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition ${uploading ? 'opacity-60' : ''}`}
              style={{ background: '#063D3E' }}>
              <Upload size={14} /> {uploading ? 'Lädt…' : 'PDF hochladen'}
            </span>
          </label>
        )}
      </div>

      <div
        ref={viewerRef}
        className="rounded-[20px] overflow-hidden mb-4 relative border"
        style={{ aspectRatio: '16/9', boxShadow: 'var(--shadow-md)', borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <button onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-lg flex items-center justify-center transition">
          {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>

        {loading ? (
          <div className="w-full h-full animate-pulse flex items-center justify-center" style={{ background: 'var(--surface2)' }}>
            <div className="w-16 h-16 rounded-2xl animate-pulse bg-gray-200" />
          </div>
        ) : doc?.file_url ? (
          <iframe src={doc.file_url} title={meta.label} className="w-full h-full border-0" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            <div className="text-6xl mb-4">{meta.icon}</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Inhalt wird bald hinzugefügt</h3>
            <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>Dieses Dokument wird in Kürze für Sie bereitgestellt.</p>
            {user?.isAdmin && <p className="mt-3 text-sm font-medium text-accent1">Als Admin können Sie oben rechts eine PDF hochladen.</p>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {prevSection ? (
          <button onClick={() => navigate(`/investor/plans/${prevSection}`)}
            className="flex items-center gap-2 text-sm font-semibold hover:text-accent1 transition" style={{ color: 'var(--text-secondary)' }}>
            <ChevronLeft size={16} /> {planMeta[prevSection]?.label}
          </button>
        ) : <div />}
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{currentIndex + 1} / {planOrder.length}</span>
        {nextSection ? (
          <button onClick={() => navigate(`/investor/plans/${nextSection}`)}
            className="flex items-center gap-2 text-sm font-semibold hover:text-accent1 transition" style={{ color: 'var(--text-secondary)' }}>
            {planMeta[nextSection]?.label} <ChevronRight size={16} />
          </button>
        ) : <div />}
      </div>
    </div>
  )
}
