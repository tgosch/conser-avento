import { useEffect, useState, useRef, type ChangeEvent } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { Partner } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  Plus, Trash2, Upload, X, Save,
  AlertCircle,
} from 'lucide-react'

// Erlaubte Bildformate für Logos (DSGVO-neutral: nur Firmendaten)
const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const ALLOWED_LOGO_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'svg']
const MAX_LOGO_SIZE_MB = 2
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_MB * 1024 * 1024

const EMPTY_FORM: Omit<Partner, 'id' | 'created_at'> = {
  name: '',
  type: 'production',
  category: '',
  description: '',
  status: 'negotiating',
  logo_path: null,
  initials: '',
  color: '#063D3E',
  visible: true,
  order_index: 0,
}

function validateLogo(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_LOGO_EXTENSIONS.includes(ext))
    return `Dateiformat ".${ext}" nicht erlaubt. Erlaubt: PNG, JPG, WEBP, SVG`
  if (file.type && !ALLOWED_LOGO_TYPES.includes(file.type))
    return `MIME-Typ nicht erlaubt: ${file.type}`
  if (file.size > MAX_LOGO_SIZE_BYTES)
    return `Logo zu groß (${(file.size / 1024 / 1024).toFixed(1)} MB). Max: ${MAX_LOGO_SIZE_MB} MB`
  if (file.size === 0)
    return 'Datei ist leer'
  return null
}

function getLogoUrl(logoPath: string | null): string | null {
  if (!logoPath) return null
  const { data } = supabase.storage.from('partner-logos').getPublicUrl(logoPath)
  return data.publicUrl
}

export default function OwnerPartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [uploadingLogoFor, setUploadingLogoFor] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'production' | 'customer'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activePartnerId = useRef<string | null>(null)

  const fetchPartners = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('type')
      .order('order_index')
    if (error) {
      toast.error(`Fehler beim Laden: ${error.message}`)
    } else {
      setPartners((data ?? []) as Partner[])
    }
    setLoading(false)
  }

  useEffect(() => { fetchPartners() }, [])

  // Auto-Kürzel generieren
  const autoInitials = (name: string) =>
    name.split(/[\s+&]+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 3)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name ist Pflichtfeld'); return }
    if (!form.initials.trim()) { toast.error('Kürzel ist Pflichtfeld'); return }
    setSaving(true)
    try {
      const { error } = await supabase.from('partners').insert([{
        name: form.name.trim(),
        type: form.type,
        category: form.category.trim(),
        description: form.description.trim(),
        status: form.status,
        initials: form.initials.trim().toUpperCase(),
        color: form.color,
        visible: form.visible,
        order_index: form.order_index,
        logo_path: null,
      }])
      if (error) throw error
      toast.success('Partner hinzugefügt')
      setForm({ ...EMPTY_FORM })
      setShowForm(false)
      fetchPartners()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>, partnerId: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validErr = validateLogo(file)
    if (validErr) { toast.error(`Logo abgelehnt: ${validErr}`); return }

    setUploadingLogoFor(partnerId)
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${partnerId}/${Date.now()}-${safeName}`

      // Delete old logo if exists
      const existing = partners.find(p => p.id === partnerId)
      if (existing?.logo_path) {
        await supabase.storage.from('partner-logos').remove([existing.logo_path])
      }

      const { error: storageErr } = await supabase.storage
        .from('partner-logos')
        .upload(filePath, file, { contentType: file.type || `image/${ext}` })
      if (storageErr) throw new Error(`Storage: ${storageErr.message}`)

      const { error: dbErr } = await supabase
        .from('partners')
        .update({ logo_path: filePath })
        .eq('id', partnerId)
      if (dbErr) {
        await supabase.storage.from('partner-logos').remove([filePath])
        throw new Error(`DB: ${dbErr.message}`)
      }

      toast.success('Logo hochgeladen')
      fetchPartners()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload fehlgeschlagen')
    } finally {
      setUploadingLogoFor(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      activePartnerId.current = null
    }
  }

  const handleDelete = async (partner: Partner) => {
    if (!confirm(`"${partner.name}" wirklich löschen?`)) return
    if (partner.logo_path) {
      await supabase.storage.from('partner-logos').remove([partner.logo_path])
    }
    const { error } = await supabase.from('partners').delete().eq('id', partner.id)
    if (error) toast.error(error.message)
    else { toast.success('Partner gelöscht'); fetchPartners() }
  }

  const handleToggleVisible = async (partner: Partner) => {
    const { error } = await supabase
      .from('partners')
      .update({ visible: !partner.visible })
      .eq('id', partner.id)
    if (error) toast.error(error.message)
    else fetchPartners()
  }

  const statusLabel: Record<string, string> = {
    negotiating: 'In Verhandlungen',
    active: 'Aktiv',
    partner: 'Partner',
    beta: 'Beta',
  }
  const statusColor: Record<string, string> = {
    negotiating: '#FF9500',
    active: '#34C759',
    partner: '#34C759',
    beta: '#5856D6',
  }

  const filtered = filter === 'all' ? partners : partners.filter(p => p.type === filter)

  const inp = {
    background: 'var(--surface2)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Partner verwalten</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Logos hochladen, Partner hinzufügen & verwalten</p>
        </div>
        <button
          onClick={() => setShowForm(p => !p)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
          style={{ background: '#063D3E' }}
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Abbrechen' : 'Partner hinzufügen'}
        </button>
      </div>

      {/* ── Hinzufügen-Formular ── */}
      {showForm && (
        <form onSubmit={handleSave} className="rounded-[20px] p-6 border mb-6 slide-up"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>Neuer Partner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Name *</label>
              <input
                type="text" required placeholder="z.B. Richter+Frenzel"
                value={form.name}
                onChange={e => setForm(p => ({
                  ...p,
                  name: e.target.value,
                  initials: p.initials || autoInitials(e.target.value),
                }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={inp}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Typ *</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as Partner['type'] }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={inp}>
                <option value="production">Produktionspartner</option>
                <option value="customer">Endkunde</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Kategorie</label>
              <input type="text" placeholder="z.B. Baustoffhandel"
                value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={inp}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Partner['status'] }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={inp}>
                <option value="negotiating">In Verhandlungen</option>
                <option value="active">Aktiv</option>
                <option value="partner">Partner</option>
                <option value="beta">Beta</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Kürzel (2–3 Buchstaben) *</label>
              <input type="text" required placeholder="z.B. RF" maxLength={3}
                value={form.initials} onChange={e => setForm(p => ({ ...p, initials: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border" style={inp}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Farbe (Hex)</label>
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  className="w-10 h-10 rounded-lg border cursor-pointer" style={{ padding: '2px', borderColor: 'var(--border)' }} />
                <input type="text" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none border font-mono" style={inp} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-secondary)' }}>Beschreibung</label>
              <textarea placeholder="Kurzbeschreibung des Partners..." rows={2}
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border resize-none" style={inp}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
              style={{ background: '#063D3E' }}>
              <Save size={14} />
              {saving ? 'Wird gespeichert…' : 'Speichern'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {/* ── Hidden logo file input ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.svg"
        className="hidden"
        onChange={e => activePartnerId.current ? handleLogoUpload(e, activePartnerId.current) : undefined}
      />

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 mb-5">
        {([
          { key: 'all', label: `Alle (${partners.length})` },
          { key: 'production', label: `Produktion (${partners.filter(p => p.type === 'production').length})` },
          { key: 'customer', label: `Endkunden (${partners.filter(p => p.type === 'customer').length})` },
        ] as const).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
            style={{
              background: filter === f.key ? '#063D3E' : 'var(--surface)',
              color: filter === f.key ? 'white' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: filter === f.key ? '#063D3E' : 'var(--border)',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Partner-Liste ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--border)', borderTopColor: '#063D3E' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[20px] p-12 border text-center"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <AlertCircle size={32} className="mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Noch keine Partner</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Partner über "Partner hinzufügen" anlegen oder SQL-Migration ausführen.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(p => {
            const logoUrl = getLogoUrl(p.logo_path)
            const isUploading = uploadingLogoFor === p.id
            return (
              <div key={p.id} className="rounded-[20px] p-4 border flex items-center gap-4"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  opacity: p.visible ? 1 : 0.5,
                }}>
                {/* Logo preview */}
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center overflow-hidden shrink-0 relative"
                  style={{ background: `${p.color}14`, border: `1.5px solid ${p.color}30` }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt={p.name} className="w-full h-full object-contain p-1.5" />
                  ) : (
                    <span className="text-sm font-bold" style={{ color: p.color }}>{p.initials}</span>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-[14px]"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <div className="w-4 h-4 rounded-full border-2 animate-spin border-white border-t-transparent" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${statusColor[p.status]}18`, color: statusColor[p.status] }}>
                      {statusLabel[p.status]}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
                      {p.type === 'production' ? '🏭 Produktion' : '👤 Endkunde'}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{p.category}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { activePartnerId.current = p.id; fileInputRef.current?.click() }}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition hover:opacity-80 disabled:opacity-40"
                    style={{ background: 'rgba(0,102,255,0.10)', color: '#0066FF' }}
                    title="Logo hochladen"
                  >
                    <Upload size={13} />
                    <span className="hidden sm:inline">Logo</span>
                  </button>
                  <button
                    onClick={() => handleToggleVisible(p)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold transition hover:opacity-80"
                    style={{
                      background: p.visible ? 'rgba(52,199,89,0.10)' : 'rgba(110,110,115,0.10)',
                      color: p.visible ? '#34C759' : 'var(--text-secondary)',
                    }}
                    title={p.visible ? 'Sichtbar (klicken zum Ausblenden)' : 'Ausgeblendet (klicken zum Einblenden)'}
                  >
                    {p.visible ? '👁 Sichtbar' : '🙈 Verborgen'}
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:opacity-80"
                    style={{ background: 'rgba(255,59,48,0.10)', color: '#FF3B30' }}
                    title="Löschen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Sicherheitshinweis ── */}
      <div className="mt-8 rounded-[16px] p-4 border text-xs leading-relaxed"
        style={{ background: 'rgba(6,61,62,0.04)', borderColor: 'rgba(6,61,62,0.15)', color: 'var(--text-secondary)' }}>
        <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Datenschutz-Hinweis (DSGVO)</p>
        <p>Diese Seite verarbeitet ausschließlich Firmendaten (keine personenbezogenen Daten gem. Art. 4 DSGVO). Logo-Uploads werden in einem geschützten Supabase-Storage-Bucket gespeichert. Nur authentifizierte Nutzer mit Service-Role-Key können Logos hochladen. Investoren sehen nur die öffentliche URL.</p>
      </div>
    </div>
  )
}
