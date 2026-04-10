import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import { sendEmail } from '../../lib/resend'
import {
  Megaphone, Target, TrendingUp, Users, Send, Plus, Edit3, Trash2,
  ExternalLink, Calendar, Eye,
} from 'lucide-react'

interface Campaign {
  id: string
  title: string
  description: string
  target: 'investoren' | 'partner' | 'alle'
  status: 'entwurf' | 'aktiv' | 'abgeschlossen'
  created_at: string
}

interface ProductPromo {
  name: string
  tagline: string
  color: string
  href: string | null
  features: string[]
}

const PRODUCT_PROMOS: ProductPromo[] = [
  { name: 'BauDoku AI', tagline: 'KI-Baudokumentation in Sekunden', color: '#0EA5E9', href: 'https://baudoku-ai.vercel.app', features: ['Foto-Upload', 'KI-Bericht', 'PDF-Export'] },
  { name: 'SpaceAI', tagline: 'Gartengestaltung mit KI', color: '#8B5CF6', href: 'https://spaceai-henna.vercel.app', features: ['Upload', 'KI-Analyse', 'Inpainting'] },
  { name: 'BuchBalance', tagline: 'Buchhaltung fuer Handwerker', color: '#1D5EA8', href: null, features: ['Beleg-Scan', 'USt-Voranmeldung', 'DATEV'] },
  { name: 'Avento ERP', tagline: 'ERP fuer Handwerksbetriebe', color: '#063D3E', href: 'https://avento-eta.vercel.app', features: ['Projekte', 'Kunden', 'Rechnungen'] },
  { name: 'Conser Marktplatz', tagline: 'B2B-Marktplatz Baubranche', color: '#C8611A', href: 'https://www.conser-gosch.de', features: ['Bestellungen', 'Lieferanten', 'Preisvergleich'] },
]

export default function Marketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [investorCount, setInvestorCount] = useState(0)
  const [partnerCount, setPartnerCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', target: 'alle' as Campaign['target'] })
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastBody, setBroadcastBody] = useState('')
  const [broadcastTarget, setBroadcastTarget] = useState<'investoren' | 'partner' | 'alle'>('alle')
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [sendingBroadcast, setSendingBroadcast] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [inv, part] = await Promise.all([
          supabase.from('investors').select('id', { count: 'exact', head: true }),
          supabase.from('partners').select('id', { count: 'exact', head: true }),
        ])
        setInvestorCount(inv.count ?? 0)
        setPartnerCount(part.count ?? 0)
      } catch {
        toast.error('Daten laden fehlgeschlagen')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const addCampaign = () => {
    if (!newCampaign.title.trim()) return
    const c: Campaign = {
      id: crypto.randomUUID(),
      title: newCampaign.title.trim(),
      description: newCampaign.description.trim(),
      target: newCampaign.target,
      status: 'entwurf',
      created_at: new Date().toISOString(),
    }
    setCampaigns(prev => [c, ...prev])
    setNewCampaign({ title: '', description: '', target: 'alle' })
    setShowNewCampaign(false)
    toast.success('Kampagne erstellt')
  }

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id))
    toast.success('Kampagne geloescht')
  }

  const handleBroadcast = async () => {
    if (!broadcastSubject.trim() || !broadcastBody.trim()) { toast.error('Betreff und Text erforderlich'); return }
    setSendingBroadcast(true)
    try {
      // Collect target emails
      let emails: string[] = []
      if (broadcastTarget === 'investoren' || broadcastTarget === 'alle') {
        const { data } = await supabase.from('investors').select('email')
        if (data) emails.push(...data.map(d => d.email).filter(Boolean))
      }
      if (broadcastTarget === 'partner' || broadcastTarget === 'alle') {
        // Partners don't have email in the partners table directly,
        // but we can get it from auth — for now use a placeholder
      }

      if (emails.length === 0) {
        toast.info('Keine Empfaenger gefunden')
        setSendingBroadcast(false)
        return
      }

      const result = await sendEmail({
        to: emails,
        subject: broadcastSubject,
        html: `<div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
          <div style="text-align:center;margin-bottom:24px;">
            <img src="https://conser-avento.de/avento.PNG" alt="Avento" style="height:32px;border-radius:8px;display:inline-block;" />
          </div>
          <div style="color:#333;font-size:14px;line-height:1.7;">${broadcastBody.replace(/\n/g, '<br/>')}</div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:11px;text-align:center;">Conser & Avento — Das Oekosystem fuer die Baubranche</p>
        </div>`,
      })

      if (result.success) {
        toast.success(`Broadcast an ${emails.length} Empfaenger gesendet`)
        setBroadcastSubject('')
        setBroadcastBody('')
        setShowBroadcast(false)
      } else {
        toast.error(`Fehler: ${result.error}`)
      }
    } catch {
      toast.error('Broadcast fehlgeschlagen')
    } finally {
      setSendingBroadcast(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Marketing Hub
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Produkte bewerben, Kampagnen verwalten, Broadcasts senden
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBroadcast(!showBroadcast)} className="btn btn-sm flex items-center gap-1.5" style={{ background: 'var(--surface2)', color: 'var(--text-primary)' }}>
            <Send size={13} /> Broadcast
          </button>
          <button onClick={() => setShowNewCampaign(!showNewCampaign)} className="btn btn-primary btn-sm flex items-center gap-1.5">
            <Plus size={13} /> Kampagne
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Reichweite', value: investorCount + partnerCount, icon: Users, color: 'var(--brand)' },
          { label: 'Investoren', value: investorCount, icon: Target, color: '#34C759' },
          { label: 'Partner', value: partnerCount, icon: TrendingUp, color: '#8B5CF6' },
          { label: 'Kampagnen', value: campaigns.length, icon: Megaphone, color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <k.icon size={14} style={{ color: k.color }} />
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{k.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Broadcast Panel */}
      {showBroadcast && (
        <div className="card p-5 mb-6 animate-fade-up" style={{ borderLeft: '3px solid var(--brand)' }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Broadcast senden</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              {(['investoren', 'partner', 'alle'] as const).map(t => (
                <button key={t} onClick={() => setBroadcastTarget(t)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition"
                  style={{ background: broadcastTarget === t ? 'var(--brand)' : 'var(--surface2)', color: broadcastTarget === t ? 'white' : 'var(--text-secondary)' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Betreff..." value={broadcastSubject} onChange={e => setBroadcastSubject(e.target.value)}
              className="input-base text-sm w-full" />
            <textarea placeholder="Nachricht..." value={broadcastBody} onChange={e => setBroadcastBody(e.target.value)}
              rows={4} className="input-base text-sm w-full resize-none" />
            <div className="flex gap-2">
              <button onClick={handleBroadcast} disabled={sendingBroadcast} className="btn btn-primary btn-sm flex items-center gap-1.5">
                <Send size={12} /> {sendingBroadcast ? 'Sende...' : 'Broadcast senden'}
              </button>
              <button onClick={() => setShowBroadcast(false)} className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Campaign */}
      {showNewCampaign && (
        <div className="card p-5 mb-6 animate-fade-up" style={{ borderLeft: '3px solid #F59E0B' }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Neue Kampagne</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Kampagnen-Titel..." value={newCampaign.title} onChange={e => setNewCampaign(p => ({ ...p, title: e.target.value }))}
              className="input-base text-sm w-full" />
            <textarea placeholder="Beschreibung..." value={newCampaign.description} onChange={e => setNewCampaign(p => ({ ...p, description: e.target.value }))}
              rows={2} className="input-base text-sm w-full resize-none" />
            <div className="flex gap-2">
              {(['investoren', 'partner', 'alle'] as const).map(t => (
                <button key={t} onClick={() => setNewCampaign(p => ({ ...p, target: t }))}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition"
                  style={{ background: newCampaign.target === t ? 'var(--brand)' : 'var(--surface2)', color: newCampaign.target === t ? 'white' : 'var(--text-secondary)' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={addCampaign} className="btn btn-primary btn-sm">Erstellen</button>
              <button onClick={() => setShowNewCampaign(false)} className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      {campaigns.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            Kampagnen
          </p>
          <div className="flex flex-col gap-3">
            {campaigns.map(c => (
              <div key={c.id} className="card p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
                  <Megaphone size={14} style={{ color: '#F59E0B' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Ziel: {c.target} · {new Date(c.created_at).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{
                  background: c.status === 'aktiv' ? 'rgba(52,199,89,0.1)' : c.status === 'abgeschlossen' ? 'rgba(107,114,128,0.1)' : 'rgba(245,158,11,0.1)',
                  color: c.status === 'aktiv' ? '#34C759' : c.status === 'abgeschlossen' ? '#6B7280' : '#F59E0B',
                }}>{c.status}</span>
                <button onClick={() => deleteCampaign(c.id)} className="hover-press" style={{ color: 'var(--text-tertiary)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Promos */}
      <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Produkte bewerben
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCT_PROMOS.map(p => (
          <div key={p.name} className="card p-5 hover:translate-y-[-2px] transition-all" style={{ borderTop: `3px solid ${p.color}` }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
              {p.href && (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="hover-press">
                  <ExternalLink size={12} style={{ color: 'var(--text-tertiary)' }} />
                </a>
              )}
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{p.tagline}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.features.map(f => (
                <span key={f} className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${p.color}12`, color: p.color }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
