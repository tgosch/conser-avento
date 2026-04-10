import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  FileText, Plus, Edit3, Trash2, Save, Eye, EyeOff, Send,
  Calendar, Tag, Users, Briefcase, Building2, ChevronDown, ChevronUp,
} from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  body: string
  category: 'update' | 'news' | 'milestone' | 'produkt' | 'intern'
  audience: 'investoren' | 'partner' | 'alle' | 'intern'
  published: boolean
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  { key: 'update', label: 'Update', color: 'var(--brand)' },
  { key: 'news', label: 'News', color: '#34C759' },
  { key: 'milestone', label: 'Meilenstein', color: '#8B5CF6' },
  { key: 'produkt', label: 'Produkt', color: '#F59E0B' },
  { key: 'intern', label: 'Intern', color: '#E04B3E' },
] as const

const AUDIENCES = [
  { key: 'investoren', label: 'Investoren', icon: Briefcase },
  { key: 'partner', label: 'Partner', icon: Building2 },
  { key: 'alle', label: 'Alle', icon: Users },
  { key: 'intern', label: 'Nur intern', icon: EyeOff },
] as const

export default function ContentEditor() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'update' as ContentItem['category'],
    audience: 'alle' as ContentItem['audience'],
  })
  const [filter, setFilter] = useState<'alle' | ContentItem['category']>('alle')

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      // Map updates to ContentItem format
      const mapped: ContentItem[] = (data ?? []).map((u: any) => ({
        id: u.id,
        title: u.title ?? '',
        body: u.body ?? u.content ?? '',
        category: u.category ?? 'update',
        audience: u.audience ?? 'alle',
        published: u.published !== false,
        created_at: u.created_at,
        updated_at: u.updated_at ?? u.created_at,
      }))
      setItems(mapped)
    } catch {
      toast.error('Inhalte laden fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Titel erforderlich'); return }
    try {
      if (editingId) {
        const { error } = await supabase.from('updates').update({
          title: form.title.trim(),
          body: form.body.trim(),
          category: form.category,
          audience: form.audience,
          updated_at: new Date().toISOString(),
        }).eq('id', editingId)
        if (error) throw error
        toast.success('Inhalt aktualisiert')
      } else {
        const { error } = await supabase.from('updates').insert([{
          title: form.title.trim(),
          body: form.body.trim(),
          category: form.category,
          audience: form.audience,
          published: false,
        }])
        if (error) throw error
        toast.success('Inhalt erstellt')
      }
      setForm({ title: '', body: '', category: 'update', audience: 'alle' })
      setEditingId(null)
      setShowNew(false)
      loadItems()
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`)
    }
  }

  const handleEdit = (item: ContentItem) => {
    setForm({ title: item.title, body: item.body, category: item.category, audience: item.audience })
    setEditingId(item.id)
    setShowNew(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('updates').delete().eq('id', id)
      if (error) throw error
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success('Inhalt geloescht')
    } catch {
      toast.error('Loeschen fehlgeschlagen')
    }
  }

  const togglePublish = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase.from('updates').update({ published: !published }).eq('id', id)
      if (error) throw error
      setItems(prev => prev.map(i => i.id === id ? { ...i, published: !published } : i))
      toast.success(published ? 'Inhalt zurueckgezogen' : 'Inhalt veroeffentlicht')
    } catch {
      toast.error('Fehler beim Aendern')
    }
  }

  const filteredItems = items.filter(i => filter === 'alle' || i.category === filter)
  const getCat = (key: string) => CATEGORIES.find(c => c.key === key) ?? CATEGORIES[0]

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
            Content-Editor
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Inhalte fuer Investoren und Partner erstellen und verwalten
          </p>
        </div>
        <button onClick={() => { setShowNew(!showNew); setEditingId(null); setForm({ title: '', body: '', category: 'update', audience: 'alle' }) }}
          className="btn btn-primary btn-sm flex items-center gap-1.5">
          <Plus size={13} /> Neuer Inhalt
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Gesamt', value: items.length, color: 'var(--brand)' },
          { label: 'Veroeffentlicht', value: items.filter(i => i.published).length, color: '#34C759' },
          { label: 'Entwuerfe', value: items.filter(i => !i.published).length, color: '#F59E0B' },
          { label: 'Diese Woche', value: items.filter(i => { const d = new Date(i.created_at); const now = new Date(); return (now.getTime() - d.getTime()) < 7 * 86400000 }).length, color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
            <p className="text-[10px] font-semibold uppercase" style={{ color: k.color }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Editor Panel */}
      {showNew && (
        <div className="card p-5 mb-6 animate-fade-up" style={{ borderLeft: `3px solid ${getCat(form.category).color}` }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            {editingId ? 'Inhalt bearbeiten' : 'Neuer Inhalt'}
          </h3>
          <div className="space-y-3">
            <input type="text" placeholder="Titel..." value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-base text-sm w-full font-semibold" />
            <textarea placeholder="Inhalt schreiben... (Markdown unterstuetzt)" value={form.body}
              onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              rows={8} className="input-base text-sm w-full resize-none" style={{ fontFamily: 'var(--font-mono)' }} />
            <div className="flex flex-wrap gap-3">
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>KATEGORIE</p>
                <div className="flex gap-1.5">
                  {CATEGORIES.map(c => (
                    <button key={c.key} onClick={() => setForm(p => ({ ...p, category: c.key }))}
                      className="px-2 py-1 rounded-md text-[10px] font-semibold transition"
                      style={{ background: form.category === c.key ? c.color : 'var(--surface2)', color: form.category === c.key ? 'white' : 'var(--text-tertiary)' }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>ZIELGRUPPE</p>
                <div className="flex gap-1.5">
                  {AUDIENCES.map(a => (
                    <button key={a.key} onClick={() => setForm(p => ({ ...p, audience: a.key }))}
                      className="px-2 py-1 rounded-md text-[10px] font-semibold transition flex items-center gap-1"
                      style={{ background: form.audience === a.key ? 'var(--brand)' : 'var(--surface2)', color: form.audience === a.key ? 'white' : 'var(--text-tertiary)' }}>
                      <a.icon size={10} /> {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} className="btn btn-primary btn-sm flex items-center gap-1.5">
                <Save size={12} /> {editingId ? 'Aktualisieren' : 'Speichern'}
              </button>
              <button onClick={() => { setShowNew(false); setEditingId(null) }}
                className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-1.5 mb-4">
        <button onClick={() => setFilter('alle')}
          className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition"
          style={{ background: filter === 'alle' ? 'var(--brand)' : 'var(--surface2)', color: filter === 'alle' ? 'white' : 'var(--text-tertiary)' }}>
          Alle ({items.length})
        </button>
        {CATEGORIES.map(c => {
          const count = items.filter(i => i.category === c.key).length
          return (
            <button key={c.key} onClick={() => setFilter(c.key)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition"
              style={{ background: filter === c.key ? c.color : 'var(--surface2)', color: filter === c.key ? 'white' : 'var(--text-tertiary)' }}>
              {c.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Content List */}
      <div className="flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <div className="card p-8 text-center">
            <FileText size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Keine Inhalte</p>
          </div>
        ) : filteredItems.map(item => {
          const cat = getCat(item.category)
          return (
            <div key={item.id} className="card p-4 flex items-start gap-4">
              <div className="w-1 h-full min-h-[40px] rounded-full shrink-0" style={{ background: cat.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${cat.color}15`, color: cat.color }}>
                    {cat.label}
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{
                    background: item.published ? 'rgba(52,199,89,0.1)' : 'rgba(245,158,11,0.1)',
                    color: item.published ? '#34C759' : '#F59E0B',
                  }}>
                    {item.published ? 'Live' : 'Entwurf'}
                  </span>
                </div>
                {item.body && (
                  <p className="text-xs line-clamp-2 mb-1" style={{ color: 'var(--text-secondary)' }}>{item.body}</p>
                )}
                <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(item.created_at).toLocaleDateString('de-DE')}</span>
                  <span className="flex items-center gap-1"><Users size={10} /> {item.audience}</span>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => togglePublish(item.id, item.published)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition"
                  style={{ background: 'var(--surface2)' }} title={item.published ? 'Zurueckziehen' : 'Veroeffentlichen'}>
                  {item.published ? <EyeOff size={12} style={{ color: 'var(--text-tertiary)' }} /> : <Eye size={12} style={{ color: '#34C759' }} />}
                </button>
                <button onClick={() => handleEdit(item)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition"
                  style={{ background: 'var(--surface2)' }}>
                  <Edit3 size={12} style={{ color: 'var(--text-tertiary)' }} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition"
                  style={{ background: 'var(--surface2)' }}>
                  <Trash2 size={12} style={{ color: '#E04B3E' }} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
