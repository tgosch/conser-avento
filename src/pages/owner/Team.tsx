import { useEffect, useRef, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import type { TeamMember } from '../../lib/supabase'
import { Upload, Trash2, X } from 'lucide-react'
import { toast } from 'react-toastify'

const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp']
const MAX_MB = 5

function getPhotoUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null
  return supabase.storage.from('team-photos').getPublicUrl(photoPath).data.publicUrl
}

function MemberPhoto({ member, onUploaded }: { member: TeamMember; onUploaded: () => void }) {
  const [imgError, setImgError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const photoUrl = getPhotoUrl(member.photo_path)

  const handleFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXT.includes(ext)) {
      toast.error('Nur JPG, PNG oder WEBP erlaubt')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Maximal ${MAX_MB} MB`)
      return
    }
    setUploading(true)
    try {
      const path = `${member.id}.${ext}`
      // Altes Foto löschen (falls vorhanden) — dann frisch hochladen ohne upsert
      if (member.photo_path) {
        await supabase.storage.from('team-photos').remove([member.photo_path])
      }
      const { error: upErr } = await supabase.storage
        .from('team-photos')
        .upload(path, file, { contentType: file.type })
      if (upErr) throw upErr
      const { error: dbErr } = await supabase
        .from('team_members')
        .update({ photo_path: path })
        .eq('id', member.id)
      if (dbErr) throw dbErr
      toast.success('Foto hochgeladen')
      onUploaded()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!member.photo_path) return
    setUploading(true)
    try {
      await supabase.storage.from('team-photos').remove([member.photo_path])
      const { error } = await supabase
        .from('team_members')
        .update({ photo_path: null })
        .eq('id', member.id)
      if (error) throw error
      toast.success('Foto entfernt')
      onUploaded()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Fehler beim Entfernen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative group">
      {photoUrl && !imgError ? (
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img src={photoUrl} alt={member.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold"
          style={{ background: member.color }}>
          {member.initials}
        </div>
      )}
      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-6 h-6 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition"
          title="Foto hochladen"
        >
          <Upload size={11} className="text-white" />
        </button>
        {member.photo_path && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="w-6 h-6 bg-red-500/60 hover:bg-red-500 rounded-full flex items-center justify-center transition"
            title="Foto entfernen"
          >
            <X size={11} className="text-white" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {uploading && (
        <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default function OwnerTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', bio: '', initials: '', color: '#063D3E', type: 'founder', equity_percent: '0' })

  const load = () => {
    setLoading(true)
    supabase.from('team_members').select('*').order('order_index')
      .then(({ data }) => {
        const raw = (data as TeamMember[]) ?? []
        const unique = raw.filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
        setMembers(unique)
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim() || !form.initials.trim()) {
      toast.error('Name, Rolle und Kürzel sind Pflichtfelder')
      return
    }
    try {
      const { error } = await supabase.from('team_members').insert([{
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim() || null,
        initials: form.initials.trim().toUpperCase().slice(0, 2),
        color: form.color,
        type: form.type,
        equity_percent: parseFloat(form.equity_percent) || 0,
        visible: true,
        order_index: members.length + 1,
      }])
      if (error) throw error
      toast.success('Teammitglied hinzugefügt')
      setAdding(false)
      setForm({ name: '', role: '', bio: '', initials: '', color: '#063D3E', type: 'founder', equity_percent: '0' })
      load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Fehler')
    }
  }

  const toggleVisible = async (member: TeamMember) => {
    const { error } = await supabase
      .from('team_members')
      .update({ visible: !member.visible })
      .eq('id', member.id)
    if (error) toast.error(error.message)
    else load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Teammitglied wirklich löschen?')) return
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Gelöscht'); load() }
  }

  const typeLabel: Record<string, string> = { founder: 'Gründer', external: 'Extern', internal: 'Intern' }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Team</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Fotos & Informationen verwalten</p>
        </div>
        <button
          onClick={() => setAdding(p => !p)}
          className="px-4 py-2 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
          style={{ background: '#063D3E' }}>
          {adding ? 'Abbrechen' : '+ Mitglied'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="rounded-[20px] p-5 border mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <input placeholder="Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border outline-none text-sm"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input placeholder="Rolle *" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border outline-none text-sm"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input placeholder="Kürzel * (z.B. TG)" maxLength={2} value={form.initials} onChange={e => setForm(p => ({ ...p, initials: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border outline-none text-sm"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input placeholder="Anteile %" type="number" min="0" max="100" step="0.1" value={form.equity_percent}
            onChange={e => setForm(p => ({ ...p, equity_percent: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border outline-none text-sm"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
            className="px-4 py-2.5 rounded-xl border outline-none text-sm"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <option value="founder">Gründer</option>
            <option value="internal">Intern</option>
            <option value="external">Extern</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Farbe:</label>
            <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
              className="w-10 h-10 rounded-lg cursor-pointer border-0" />
          </div>
          <textarea placeholder="Kurzbio (optional)" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={2} className="sm:col-span-2 px-4 py-2.5 rounded-xl border outline-none text-sm resize-none"
            style={{ background: 'var(--surface2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button type="submit"
            className="sm:col-span-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
            style={{ background: '#063D3E' }}>
            Hinzufügen
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-[20px] h-28 animate-pulse" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map(m => (
            <div key={m.id} className="rounded-[20px] p-5 border flex items-start gap-4"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', opacity: m.visible ? 1 : 0.5 }}>
              <MemberPhoto member={m} onUploaded={load} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
                <p className="text-xs mt-0.5 mb-1.5" style={{ color: 'var(--text-secondary)' }}>{m.role}</p>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${m.color}20`, color: m.color }}>
                    {typeLabel[m.type] || m.type}
                  </span>
                  {m.equity_percent > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(110,110,115,0.12)', color: 'var(--text-secondary)' }}>
                      {m.equity_percent}%
                    </span>
                  )}
                  {m.photo_path && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759' }}>
                      Foto ✓
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => toggleVisible(m)}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition"
                  style={{ background: m.visible ? 'rgba(52,199,89,0.12)' : 'rgba(110,110,115,0.12)', color: m.visible ? '#34C759' : 'var(--text-secondary)' }}>
                  {m.visible ? 'Sichtbar' : 'Hidden'}
                </button>
                <button onClick={() => handleDelete(m.id)}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium transition hover:bg-red-500/20"
                  style={{ color: '#FF3B30' }}>
                  <Trash2 size={12} className="inline mr-1" />Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs mt-6" style={{ color: 'var(--text-tertiary)' }}>
        Hover über das Profilbild um ein Foto hochzuladen (JPG/PNG/WEBP, max. 5 MB).
      </p>
    </div>
  )
}
