import { useState } from 'react'
import { Calculator, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PartnerCalculator() {
  const [customers, setCustomers] = useState(5000)
  const [avgOrder, setAvgOrder] = useState(800)
  const [digitalRate, setDigitalRate] = useState(25)
  const [commission, setCommission] = useState(5)

  const monthlyOrders = Math.round(customers * (digitalRate / 100) * 1.2)
  const monthlyRevenue = monthlyOrders * avgOrder
  const yearlyRevenue = monthlyRevenue * 12
  const monthlyCommission = Math.round(monthlyRevenue * (commission / 100))
  const yearlyCommission = monthlyCommission * 12

  // Year 2 + 3 projections (30% growth)
  const y2Commission = Math.round(yearlyCommission * 1.3)
  const y3Commission = Math.round(yearlyCommission * 1.3 * 1.3)

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calculator size={20} style={{ color: 'var(--accent)' }} />
          <h1 className="text-display-md" style={{ color: 'var(--text-primary)' }}>Revenue Calculator</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Berechnen Sie Ihr erwartetes Umsatzpotenzial als Conser-Partner.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-3 card p-6 md:p-8">
          <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Ihre Annahmen</h2>

          <div className="flex gap-2 mb-6">
            <button onClick={() => { setCustomers(2000); setAvgOrder(500); setDigitalRate(10); setCommission(3) }}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
              style={{ background: 'var(--surface2)', color: 'var(--text-secondary)' }}>
              Konservativ
            </button>
            <button onClick={() => { setCustomers(15000); setAvgOrder(1000); setDigitalRate(40); setCommission(6) }}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
              style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}>
              Optimistisch
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Customers */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Aktueller Kundenstamm (Handwerksbetriebe)
                </label>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {customers.toLocaleString('de-DE')}
                </span>
              </div>
              <input type="range" min={500} max={75000} step={500} value={customers}
                onChange={e => setCustomers(Number(e.target.value))}
                className="w-full accent-[#063D3E]" />
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>500</span>
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>75.000</span>
              </div>
            </div>

            {/* Avg Order */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Durchschnittlicher Bestellwert
                </label>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  €{avgOrder.toLocaleString('de-DE')}
                </span>
              </div>
              <input type="range" min={100} max={3000} step={50} value={avgOrder}
                onChange={e => setAvgOrder(Number(e.target.value))}
                className="w-full accent-[#063D3E]" />
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>€100</span>
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>€3.000</span>
              </div>
            </div>

            {/* Digital Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Erwartete Digitalisierungsquote
                </label>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {digitalRate}%
                </span>
              </div>
              <input type="range" min={5} max={60} step={5} value={digitalRate}
                onChange={e => setDigitalRate(Number(e.target.value))}
                className="w-full accent-[#063D3E]" />
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>5%</span>
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>60%</span>
              </div>
              <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Anteil der Handwerker, die digital über Conser bestellen statt telefonisch/per Fax. Jahr 1 typisch: 10–15%, Jahr 3: 30–50%.
              </p>
            </div>

            {/* Commission */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Kommissionssatz
                </label>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {commission}%
                </span>
              </div>
              <input type="range" min={2} max={10} step={0.5} value={commission}
                onChange={e => setCommission(Number(e.target.value))}
                className="w-full accent-[#C8611A]" />
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>2%</span>
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Monthly */}
          <div className="card p-6" style={{ borderLeft: '3px solid var(--brand)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Monatlich</p>
            <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>
              €{monthlyCommission.toLocaleString('de-DE')}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Kommission aus {monthlyOrders} Bestellungen
            </p>
          </div>

          {/* Yearly */}
          <div className="card p-6" style={{ borderLeft: '3px solid var(--accent)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Jahr 1</p>
            <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              €{yearlyCommission.toLocaleString('de-DE')}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              GMV: €{yearlyRevenue.toLocaleString('de-DE')}
            </p>
          </div>

          {/* Projection */}
          <div className="card p-6">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)' }}>3-Jahres-Projektion</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Jahr 1', value: yearlyCommission },
                { label: 'Jahr 2', value: y2Commission, note: '+30%' },
                { label: 'Jahr 3', value: y3Commission, note: '+30%' },
              ].map(y => (
                <div key={y.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {y.label} {y.note && <span style={{ color: 'var(--success)' }}>{y.note}</span>}
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    €{y.value.toLocaleString('de-DE')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link to="/partner/partnership"
            className="card p-4 flex items-center justify-between hover:translate-y-[-2px] transition-all"
            style={{ background: 'var(--brand)', color: 'white' }}>
            <div>
              <p className="text-sm font-semibold">Überzeugt?</p>
              <p className="text-xs opacity-60">Zum Partnermodell</p>
            </div>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] mt-6 text-center" style={{ color: 'var(--text-tertiary)' }}>
        Alle Zahlen sind Schätzungen basierend auf Ihren Eingaben. Tatsächliche Ergebnisse können abweichen.
        Kommissionssätze werden individuell verhandelt.
      </p>
    </div>
  )
}
