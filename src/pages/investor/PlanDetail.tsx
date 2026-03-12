import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ChevronRight, ChevronLeft, Maximize2, Minimize2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Document } from '../../lib/supabase'

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

// Maps URL section param → DB category value
const SECTION_TO_CATEGORY: Record<string, string> = {
  'pitch-deck':              'pitch-deck',
  'business-plan':           'business',
  'finanzplan':              'finanzen',
  'sales-funnel-endkunden':  'sales',
  'sales-funnel-business':   'sales',
  'persona-endkunde':        'persona',
  'persona-businesspartner': 'persona',
  'finanzanalyse':           'finanzen',
  'invest-moeglichkeiten':   'business',
  'roadmap-kapital':         'business',
  'sicherheiten':            'business',
}

export default function InvestorPlanDetail() {
  const { section } = useParams<{ section: string }>()
  const navigate = useNavigate()
  const viewerRef = useRef<HTMLDivElement>(null)
  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  const meta = section ? planMeta[section] : null
  const currentIndex = planOrder.indexOf(section ?? '')
  const prevSection = currentIndex > 0 ? planOrder[currentIndex - 1] : null
  const nextSection = currentIndex < planOrder.length - 1 ? planOrder[currentIndex + 1] : null

  useEffect(() => {
    if (!section) return
    const category = SECTION_TO_CATEGORY[section]
    if (!category) { setLoading(false); return }
    setLoading(true)
    supabase
      .from('documents')
      .select('id, name, file_path, category')
      .eq('category', category)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('[PlanDetail]', error.message)
        setDoc(data ?? null)
        setLoading(false)
      })
  }, [section])

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
      <nav className="flex items-center flex-wrap gap-1.5 text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
        <Link to="/investor/dashboard" className="hover:text-accent1 transition">Dashboard</Link>
        <ChevronRight size={12} />
        <Link to="/investor/plans" className="hover:text-accent1 transition">Pläne</Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-primary)' }} className="font-medium">{meta.label}</span>
      </nav>

      <div className="flex items-center gap-3 mb-5 min-w-0">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-[12px] md:rounded-[16px] flex items-center justify-center text-2xl md:text-3xl shrink-0" style={{ background: 'rgba(6,61,62,0.10)' }}>
          {meta.icon}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>{meta.label}</h1>
          <p className="text-xs md:text-sm mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{meta.desc}</p>
        </div>
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

        {(() => {
          const url = doc?.file_path
            ? supabase.storage.from('documents').getPublicUrl(doc.file_path).data.publicUrl
            : null
          return loading ? (
            <div className="w-full h-full animate-pulse flex items-center justify-center" style={{ background: 'var(--surface2)' }}>
              <div className="w-16 h-16 rounded-2xl animate-pulse bg-gray-200" />
            </div>
          ) : url && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(url) ? (
            <img src={url} alt={meta.label} className="w-full h-full object-contain" />
          ) : url ? (
            <iframe src={url} title={meta.label} className="w-full h-full border-0" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">{meta.icon}</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Inhalt wird bald hinzugefügt</h3>
              <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>Dieses Dokument wird in Kürze für Sie bereitgestellt.</p>
            </div>
          )
        })()}
      </div>

      <div className="flex items-center justify-between gap-2">
        {prevSection ? (
          <button onClick={() => navigate(`/investor/plans/${prevSection}`)}
            className="flex items-center gap-1.5 text-sm font-semibold hover:text-accent1 transition min-w-0 max-w-[40%]" style={{ color: 'var(--text-secondary)' }}>
            <ChevronLeft size={16} className="shrink-0" /> <span className="truncate">{planMeta[prevSection]?.label}</span>
          </button>
        ) : <div />}
        <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)' }}>{currentIndex + 1} / {planOrder.length}</span>
        {nextSection ? (
          <button onClick={() => navigate(`/investor/plans/${nextSection}`)}
            className="flex items-center gap-1.5 text-sm font-semibold hover:text-accent1 transition min-w-0 max-w-[40%]" style={{ color: 'var(--text-secondary)' }}>
            <span className="truncate">{planMeta[nextSection]?.label}</span> <ChevronRight size={16} className="shrink-0" />
          </button>
        ) : <div />}
      </div>
    </div>
  )
}
