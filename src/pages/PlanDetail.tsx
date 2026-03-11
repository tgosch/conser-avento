import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Upload, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Document } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const planMeta: Record<string, { label: string; desc: string; icon: string }> = {
  'pitch-deck': { label: 'Pitch-Deck', desc: 'Vollständige Unternehmenspräsentation von Avento & Conser', icon: '📊' },
  'business-plan': { label: 'Business-Plan', desc: 'Strategische Planung, Märkte und Wachstumsstrategie', icon: '📋' },
  'finanzplan': { label: 'Finanzplan', desc: 'Finanzierungsübersicht und Prognosen', icon: '💹' },
  'sales-funnel-endkunden': { label: 'Sales Funnel Endkunden', desc: 'Verkaufsstrategie und Konversionsoptimierung für Endkunden', icon: '📈' },
  'sales-funnel-business': { label: 'Sales Funnel Business', desc: 'B2B Verkaufsstrategie und Partnerakquise', icon: '🏢' },
  'persona-endkunde': { label: 'Persona Endkunde', desc: 'Detailliertes Zielgruppen-Profil für Endkunden', icon: '👤' },
  'persona-businesspartner': { label: 'Persona Businesspartner', desc: 'Zielgruppen-Profil für B2B-Partner', icon: '🤝' },
  'finanzanalyse': { label: 'Detaillierte Finanzanalyse', desc: 'Tiefgehende Analyse der Finanzkennzahlen', icon: '📊' },
  'invest-moeglichkeiten': { label: 'Invest & Möglichkeiten', desc: 'Investitionsoptionen und Renditeperspektiven', icon: '💵' },
  'roadmap-kapital': { label: 'Roadmap – Kapitalbedarf', desc: 'Meilensteinplanung und Kapitalbedarfsübersicht', icon: '🗓️' },
  'sicherheiten': { label: 'Sicherheiten & Treuhänder', desc: 'Rechtliche Absicherung für Investoren', icon: '🔐' },
}

export default function PlanDetail() {
  const { section } = useParams<{ section: string }>()
  const { user } = useAuth()
  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const meta = section ? planMeta[section] : null

  useEffect(() => {
    if (!section) return
    const fetchDoc = async () => {
      try {
        const { data } = await supabase
          .from('documents')
          .select('*')
          .eq('section', section)
          .single()
        setDoc(data)
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [section])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !section) return
    setUploading(true)
    try {
      const fileName = `${section}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)

      const { data: docData, error: dbError } = await supabase
        .from('documents')
        .upsert({ section, file_name: file.name, file_url: urlData.publicUrl })
        .select()
        .single()

      if (dbError) throw dbError

      setDoc(docData)
      toast.success('Dokument erfolgreich hochgeladen')
    } catch (err) {
      toast.error('Upload fehlgeschlagen')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  if (!meta) {
    return (
      <div className="p-8 text-center text-gray-400">
        Bereich nicht gefunden.
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/dashboard" className="hover:text-accent1 transition">Dashboard</Link>
        <ChevronRight size={14} />
        <Link to="/dashboard/plans" className="hover:text-accent1 transition">Pläne</Link>
        <ChevronRight size={14} />
        <span className="text-text font-medium">{meta.label}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent1/10 flex items-center justify-center text-3xl">
            {meta.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{meta.label}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{meta.desc}</p>
          </div>
        </div>

        {/* Admin upload button */}
        {user?.isAdmin && (
          <label className="cursor-pointer">
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
            <span className={`flex items-center gap-2 bg-accent1 text-white rounded-full px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <Upload size={15} />
              {uploading ? 'Wird hochgeladen...' : 'PDF hochladen'}
            </span>
          </label>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-card shadow-card p-6 min-h-[500px] flex flex-col">
        {loading ? (
          <div className="flex-1 animate-pulse">
            <div className="h-full bg-gray-100 rounded-2xl" />
          </div>
        ) : doc?.file_url ? (
          <iframe
            src={doc.file_url}
            title={meta.label}
            className="w-full flex-1 rounded-xl border-0"
            style={{ minHeight: '600px' }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-text mb-2">Inhalt wird bald hinzugefügt</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Dieses Dokument wird in Kürze für Sie bereitgestellt. Bitte schauen Sie später nochmal vorbei.
            </p>
            {user?.isAdmin && (
              <p className="mt-4 text-sm text-accent1 font-medium">
                Als Admin können Sie oben rechts eine PDF hochladen.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
