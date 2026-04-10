import { useEffect, useState } from 'react'
import { supabaseAdmin as supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Calculator, TrendingUp, Wallet, Building2, Plus, Edit3, Trash2,
  AlertTriangle, CheckCircle2, Clock,
} from 'lucide-react'

interface TaxEntry {
  id: string
  quarter: string
  year: number
  type: string
  amount_cents: number
  description: string | null
  status: string
  due_date: string | null
  paid_date: string | null
  created_at: string
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  ust_voranmeldung: { label: 'USt-Voranmeldung', color: '#0EA5E9' },
  koerperschaftsteuer: { label: 'KoerpSt', color: '#E04B3E' },
  gewerbesteuer: { label: 'GewSt', color: '#F59E0B' },
  gf_gehalt: { label: 'GF-Gehalt', color: '#8B5CF6' },
  ruecklage: { label: 'Ruecklage', color: '#34C759' },
  entnahme: { label: 'Entnahme', color: '#C8611A' },
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  geplant: { color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
  faellig: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  bezahlt: { color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
  ueberfaellig: { color: '#E04B3E', bg: 'rgba(224,75,62,0.08)' },
}

export default function TaxOverview() {
  const [entries, setEntries] = useState<TaxEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    quarter: 'Q1', year: new Date().getFullYear(), type: 'ust_voranmeldung',
    amount_cents: 0, description: '', status: 'geplant', due_date: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  // Calculator state
  const [calcRevenue, setCalcRevenue] = useState(5000)
  const [calcExpenses, setCalcExpenses] = useState(2000)
  const [calcGfGehalt, setCalcGfGehalt] = useState(3000)
  const [calcBuffer, setCalcBuffer] = useState(20)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const { data } = await supabase.from('tax_entries').select('*').order('year', { ascending: false }).order('quarter')
      if (data) setEntries(data)
    } catch {
      // Table may not exist yet
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase.from('tax_entries').update({
          ...form, amount_cents: Math.round(form.amount_cents),
          description: form.description || null, due_date: form.due_date || null,
        }).eq('id', editingId)
        if (error) throw error
        toast.success('Aktualisiert')
      } else {
        const { error } = await supabase.from('tax_entries').insert([{
          ...form, amount_cents: Math.round(form.amount_cents),
          description: form.description || null, due_date: form.due_date || null,
        }])
        if (error) throw error
        toast.success('Eintrag erstellt')
      }
      resetForm()
      loadData()
    } catch (e: any) {
      toast.error(`Fehler: ${e.message}`)
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      await supabase.from('tax_entries').delete().eq('id', id)
      setEntries(prev => prev.filter(e => e.id !== id))
      toast.success('Geloescht')
    } catch { toast.error('Fehler') }
  }

  const editEntry = (e: TaxEntry) => {
    setForm({
      quarter: e.quarter, year: e.year, type: e.type,
      amount_cents: e.amount_cents, description: e.description ?? '',
      status: e.status, due_date: e.due_date ?? '',
    })
    setEditingId(e.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ quarter: 'Q1', year: new Date().getFullYear(), type: 'ust_voranmeldung', amount_cents: 0, description: '', status: 'geplant', due_date: '' })
    setEditingId(null)
    setShowForm(false)
  }

  // Calculations
  const fmt = (cents: number) => (cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const totalTax = entries.filter(e => e.type === 'ust_voranmeldung' && e.status !== 'bezahlt').reduce((a, e) => a + e.amount_cents, 0)
  const totalReserves = entries.filter(e => e.type === 'ruecklage').reduce((a, e) => a + e.amount_cents, 0)
  const totalPaid = entries.filter(e => e.status === 'bezahlt').reduce((a, e) => a + e.amount_cents, 0)

  // GF-Gehalt + Entnahme Calculator
  const profit = calcRevenue - calcExpenses - calcGfGehalt
  const koerpSt = profit > 0 ? profit * 0.1579 : 0 // ~15.79%
  const gewSt = profit > 0 ? profit * 0.14 : 0 // ~14%
  const solidaritaet = koerpSt * 0.055
  const totalTaxCalc = koerpSt + gewSt + solidaritaet
  const bufferAmount = calcRevenue * (calcBuffer / 100)
  const availableForWithdrawal = Math.max(0, calcRevenue - calcExpenses - totalTaxCalc - bufferAmount)

  // Quarterly chart
  const quarterlyChart = ['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
    const qEntries = entries.filter(e => e.quarter === q && e.year === new Date().getFullYear())
    return {
      quarter: q,
      ust: qEntries.filter(e => e.type === 'ust_voranmeldung').reduce((a, e) => a + e.amount_cents, 0) / 100,
      sonstige: qEntries.filter(e => e.type !== 'ust_voranmeldung').reduce((a, e) => a + e.amount_cents, 0) / 100,
    }
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
          <h1 className="font-bold text-xl md:text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>Steuer-Uebersicht</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>GmbH Finanzen, USt, Ruecklagen und Gewinnentnahme</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (editingId) resetForm() }} className="btn btn-primary btn-sm flex items-center gap-1">
          <Plus size={12} /> Eintrag
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        {[
          { label: 'USt offen', value: `${fmt(totalTax)} EUR`, color: '#0EA5E9', icon: AlertTriangle },
          { label: 'Ruecklagen', value: `${fmt(totalReserves)} EUR`, color: '#34C759', icon: Wallet },
          { label: 'Bezahlt (gesamt)', value: `${fmt(totalPaid)} EUR`, color: '#8B5CF6', icon: CheckCircle2 },
          { label: 'Eintraege', value: entries.length, color: 'var(--brand)', icon: Building2 },
        ].map(k => (
          <div key={k.label} className="card p-3">
            <k.icon size={14} style={{ color: k.color }} className="mb-1" />
            <p className="text-base font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{k.value}</p>
            <p className="text-[9px] font-semibold uppercase" style={{ color: k.color }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-5 animate-fade-up" style={{ borderLeft: '3px solid #0EA5E9' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{editingId ? 'Bearbeiten' : 'Neuer Eintrag'}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            <select value={form.quarter} onChange={e => setForm(p => ({ ...p, quarter: e.target.value }))} className="input-base text-xs">
              {['Q1', 'Q2', 'Q3', 'Q4'].map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))} className="input-base text-xs" />
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-base text-xs">
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <input type="number" placeholder="Betrag (Cent)" value={form.amount_cents}
              onChange={e => setForm(p => ({ ...p, amount_cents: Number(e.target.value) }))} className="input-base text-xs" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input type="text" placeholder="Beschreibung" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-base text-xs" />
            <input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} className="input-base text-xs" />
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-base text-xs">
              {['geplant', 'faellig', 'bezahlt', 'ueberfaellig'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn btn-primary btn-sm">{editingId ? 'Aktualisieren' : 'Speichern'}</button>
            <button onClick={resetForm} className="btn btn-sm" style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>Abbrechen</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Quarterly Chart */}
        <div className="card p-4">
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Quartals-Uebersicht {new Date().getFullYear()}</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={quarterlyChart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => [`${v.toFixed(2)} EUR`]} />
              <Bar dataKey="ust" fill="#0EA5E9" radius={[3, 3, 0, 0]} stackId="a" name="USt" />
              <Bar dataKey="sonstige" fill="#8B5CF6" radius={[3, 3, 0, 0]} stackId="a" name="Sonstige" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gewinnentnahme-Rechner */}
        <div className="card p-4">
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Gewinnentnahme-Rechner</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-[9px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Umsatz/Monat (EUR)</p>
              <input type="number" value={calcRevenue} onChange={e => setCalcRevenue(Number(e.target.value))} className="input-base text-xs w-full" />
            </div>
            <div>
              <p className="text-[9px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Ausgaben/Monat (EUR)</p>
              <input type="number" value={calcExpenses} onChange={e => setCalcExpenses(Number(e.target.value))} className="input-base text-xs w-full" />
            </div>
            <div>
              <p className="text-[9px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>GF-Gehalt (EUR)</p>
              <input type="number" value={calcGfGehalt} onChange={e => setCalcGfGehalt(Number(e.target.value))} className="input-base text-xs w-full" />
            </div>
            <div>
              <p className="text-[9px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Puffer (%)</p>
              <input type="number" value={calcBuffer} min={0} max={50} onChange={e => setCalcBuffer(Number(e.target.value))} className="input-base text-xs w-full" />
            </div>
          </div>
          <div className="space-y-1.5 p-3 rounded-lg" style={{ background: 'var(--surface2)' }}>
            {[
              { label: 'Gewinn vor Steuer', value: profit, color: 'var(--text-primary)' },
              { label: 'KoerpSt (~15,79%)', value: -koerpSt, color: '#E04B3E' },
              { label: 'GewSt (~14%)', value: -gewSt, color: '#F59E0B' },
              { label: 'SolZ (5,5%)', value: -solidaritaet, color: '#6B7280' },
              { label: 'Puffer', value: -bufferAmount, color: '#0EA5E9' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                <span className="text-[10px] font-bold" style={{ color: r.color, fontFamily: 'var(--font-mono)' }}>
                  {r.value >= 0 ? '' : '-'}{Math.abs(r.value).toFixed(2)} EUR
                </span>
              </div>
            ))}
            <div className="border-t pt-1.5 mt-1.5 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Verfuegbar fuer Entnahme</span>
              <span className="text-sm font-bold" style={{ color: '#34C759', fontFamily: 'var(--font-mono)' }}>
                {availableForWithdrawal.toFixed(2)} EUR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
        Eintraege ({entries.length})
      </p>
      <div className="flex flex-col gap-2">
        {entries.length === 0 ? (
          <div className="card p-8 text-center">
            <Calculator size={20} style={{ color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Keine Steuer-Eintraege</p>
          </div>
        ) : entries.map(e => {
          const typeConf = TYPE_LABELS[e.type] ?? { label: e.type, color: '#6B7280' }
          const statusConf = STATUS_COLORS[e.status] ?? STATUS_COLORS.geplant
          return (
            <div key={e.id} className="card p-3 flex items-center gap-3">
              <div className="w-1 h-8 rounded-full shrink-0" style={{ background: typeConf.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-bold" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{e.quarter} {e.year}</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${typeConf.color}15`, color: typeConf.color }}>{typeConf.label}</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: statusConf.bg, color: statusConf.color }}>{e.status}</span>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{e.description || typeConf.label}</p>
              </div>
              <span className="text-sm font-bold shrink-0" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {fmt(e.amount_cents)} EUR
              </span>
              <button onClick={() => editEntry(e)} className="hover-press"><Edit3 size={12} style={{ color: 'var(--text-tertiary)' }} /></button>
              <button onClick={() => deleteEntry(e.id)} className="hover-press"><Trash2 size={12} style={{ color: '#E04B3E' }} /></button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
