import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  Plus, Trash2, TrendingUp, DollarSign, Users, Target,
  Calendar, ExternalLink,
} from 'lucide-react'

interface MarketingPost {
  id: string
  post_date: string
  platform: string
  post_type: 'organisch' | 'paid'
  description: string
  budget_cents: number
  link: string | null
  signups_day0: number
  signups_day1: number
  signups_day2: number
  signups_day7: number
  notes: string | null
  created_at: string
}

const PLATFORMS = [
  { key: 'tiktok', label: 'TikTok', color: '#000000' },
  { key: 'instagram', label: 'Instagram', color: '#E4405F' },
  { key: 'youtube', label: 'YouTube', color: '#FF0000' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { key: 'twitter', label: 'X/Twitter', color: '#1DA1F2' },
  { key: 'other', label: 'Andere', color: '#6B7280' },
]

export default function MarketingTracker() {
  const [posts, setPosts] = useState<MarketingPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    post_date: new Date().toISOString().split('T')[0],
    platform: 'instagram',
    post_type: 'organisch' as 'organisch' | 'paid',
    description: '',
    budget_cents: 0,
    link: '',
    signups_day0: 0, signups_day1: 0, signups_day2: 0, signups_day7: 0,
    notes: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { loadPosts() }, [])

  const loadPosts = async () => {
    try {
      const { data } = await supabase.from('marketing_posts').select('*').order('post_date', { ascending: false })
      if (data) setPosts(data)
    } catch {
      // Table may not exist yet
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form.description.trim()) { toast.error('Beschreibung erforderlich'); return }
    try {
      if (editingId) {
        const { error } = await supabase.from('marketing_posts').update({ ...form, link: form.link || null, notes: form.notes || null }).eq('id', editingId)
        if (error) throw error
        toast.success('Post aktualisiert')
      } else {
        const { error } = await supabase.from('marketing_posts').insert([{ ...form, link: form.link || null, notes: form.notes || null }])
        if (error) throw error
        toast.success('Post erfasst')
      }
      resetForm()
      loadPosts()
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`)
    }
  }

  const deletePost = async (id: string) => {
    try {
      await supabase.from('marketing_posts').delete().eq('id', id)
      setPosts(prev => prev.filter(p => p.id !== id))
      toast.success('Geloescht')
    } catch {
      toast.error('Fehler')
    }
  }

  const editPost = (p: MarketingPost) => {
    setForm({
      post_date: p.post_date,
      platform: p.platform,
      post_type: p.post_type,
      description: p.description,
      budget_cents: p.budget_cents,
      link: p.link ?? '',
      signups_day0: p.signups_day0,
      signups_day1: p.signups_day1,
      signups_day2: p.signups_day2,
      signups_day7: p.signups_day7,
      notes: p.notes ?? '',
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ post_date: new Date().toISOString().split('T')[0], platform: 'instagram', post_type: 'organisch', description: '', budget_cents: 0, link: '', signups_day0: 0, signups_day1: 0, signups_day2: 0, signups_day7: 0, notes: '' })
    setEditingId(null)
    setShowForm(false)
  }

  // Analytics
  const totalSignups = posts.reduce((a, p) => a + p.signups_day0 + p.signups_day1 + p.signups_day2 + p.signups_day7, 0)
  const totalBudget = posts.reduce((a, p) => a + p.budget_cents, 0) / 100
  const paidPosts = posts.filter(p => p.post_type === 'paid')
  const paidSignups = paidPosts.reduce((a, p) => a + p.signups_day0 + p.signups_day1 + p.signups_day2 + p.signups_day7, 0)
  const costPerCustomer = paidSignups > 0 ? (totalBudget / paidSignups).toFixed(2) : '—'

  // Platform breakdown for pie chart
  const platformData = PLATFORMS.map(pl => {
    const platPosts = posts.filter(p => p.platform === pl.key)
    const signups = platPosts.reduce((a, p) => a + p.signups_day0 + p.signups_day1 + p.signups_day2 + p.signups_day7, 0)
    return { name: pl.label, value: signups, color: pl.color }
  }).filter(d => d.value > 0)

  // Monthly bar chart
  const monthlyData: { month: string; organisch: number; paid: number }[] = []
  posts.forEach(p => {
    const m = new Date(p.post_date).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })
    let entry = monthlyData.find(d => d.month === m)
    if (!entry) { entry = { month: m, organisch: 0, paid: 0 }; monthlyData.push(entry) }
    const signups = p.signups_day0 + p.signups_day1 + p.signups_day2 + p.signups_day7
    if (p.post_type === 'organisch') entry.organisch += signups
    else entry.paid += signups
  })

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-bold text-xl md:text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Marketing Tracker</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Posts erfassen, Conversions tracken, Kanaele vergleichen</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (editingId) resetForm() }} className="btn btn-primary btn-sm flex items-center gap-1">
          <Plus size={12} /> Post erfassen
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-5">
        {[
          { label: 'Posts', value: posts.length, color: 'var(--brand)' },
          { label: 'Signups gesamt', value: totalSignups, color: '#34C759' },
          { label: 'Budget', value: `${totalBudget.toFixed(0)} EUR`, color: '#F59E0B' },
          { label: 'Cost/Customer', value: `${costPerCustomer} EUR`, color: '#E04B3E' },
          { label: 'Organisch', value: posts.filter(p => p.post_type === 'organisch').length, color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="card p-3">
            <p className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
            <p className="text-[9px] font-semibold uppercase" style={{ color: k.color }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-5 animate-fade-up" style={{ borderLeft: '3px solid var(--brand)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{editingId ? 'Post bearbeiten' : 'Neuer Post'}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input type="date" value={form.post_date} onChange={e => setForm(p => ({ ...p, post_date: e.target.value }))} className="input-base text-xs" />
            <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} className="input-base text-xs">
              {PLATFORMS.map(pl => <option key={pl.key} value={pl.key}>{pl.label}</option>)}
            </select>
            <div className="flex gap-1">
              {(['organisch', 'paid'] as const).map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, post_type: t }))}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition"
                  style={{ background: form.post_type === t ? 'var(--brand)' : 'var(--surface2)', color: form.post_type === t ? 'white' : 'var(--text-secondary)' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <textarea placeholder="Was wurde gepostet?..." value={form.description} rows={2}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-base text-xs w-full resize-none mb-2" />
          {form.post_type === 'paid' && (
            <input type="number" placeholder="Budget in Cent" value={form.budget_cents} min={0}
              onChange={e => setForm(p => ({ ...p, budget_cents: Number(e.target.value) }))} className="input-base text-xs w-full mb-2" />
          )}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[
              { key: 'signups_day0', label: 'Tag 0' },
              { key: 'signups_day1', label: '+1 Tag' },
              { key: 'signups_day2', label: '+2 Tage' },
              { key: 'signups_day7', label: '+7 Tage' },
            ].map(s => (
              <div key={s.key}>
                <p className="text-[9px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
                <input type="number" min={0} value={(form as any)[s.key]}
                  onChange={e => setForm(p => ({ ...p, [s.key]: Number(e.target.value) }))} className="input-base text-xs w-full" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn btn-primary btn-sm">{editingId ? 'Aktualisieren' : 'Speichern'}</button>
            <button onClick={resetForm} className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>Abbrechen</button>
          </div>
        </div>
      )}

      {/* Charts */}
      {posts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Monthly Signups */}
          {monthlyData.length > 0 && (
            <div className="card p-4">
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Signups: Organisch vs. Paid</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="organisch" fill="#8B5CF6" radius={[3, 3, 0, 0]} stackId="a" name="Organisch" />
                  <Bar dataKey="paid" fill="#F59E0B" radius={[3, 3, 0, 0]} stackId="a" name="Paid" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* Platform Breakdown */}
          {platformData.length > 0 && (
            <div className="card p-4">
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Bester Kanal (Signups)</p>
              <div className="flex items-center">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={platformData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      innerRadius={35} outerRadius={60} paddingAngle={3}>
                      {platformData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5">
                  {platformData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
                      <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                      <span className="text-[10px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Posts List */}
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Posts ({posts.length})
      </p>
      <div className="flex flex-col gap-2">
        {posts.length === 0 ? (
          <div className="card p-8 text-center">
            <Target size={20} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Noch keine Posts erfasst</p>
          </div>
        ) : posts.map(p => {
          const plat = PLATFORMS.find(pl => pl.key === p.platform)
          const totalS = p.signups_day0 + p.signups_day1 + p.signups_day2 + p.signups_day7
          const cpc = p.post_type === 'paid' && totalS > 0 ? ((p.budget_cents / 100) / totalS).toFixed(2) : null
          return (
            <div key={p.id} className="card p-3 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full shrink-0" style={{ background: plat?.color ?? '#6B7280' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-bold" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(p.post_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${plat?.color ?? '#6B7280'}15`, color: plat?.color ?? '#6B7280' }}>
                    {plat?.label ?? p.platform}
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: p.post_type === 'paid' ? 'rgba(245,158,11,0.08)' : 'rgba(139,92,246,0.08)', color: p.post_type === 'paid' ? '#F59E0B' : '#8B5CF6' }}>
                    {p.post_type}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{p.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: '#34C759', fontFamily: 'var(--font-mono)' }}>+{totalS}</p>
                  <p className="text-[8px]" style={{ color: 'var(--text-tertiary)' }}>Signups</p>
                </div>
                {cpc && (
                  <div className="text-center">
                    <p className="text-[10px] font-bold" style={{ color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>{cpc} EUR</p>
                    <p className="text-[8px]" style={{ color: 'var(--text-tertiary)' }}>CPC</p>
                  </div>
                )}
                <button onClick={() => editPost(p)} className="hover-press text-[10px] font-semibold" style={{ color: 'var(--brand)' }}>Edit</button>
                <button onClick={() => deletePost(p.id)} className="hover-press"><Trash2 size={12} style={{ color: '#E04B3E' }} /></button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
