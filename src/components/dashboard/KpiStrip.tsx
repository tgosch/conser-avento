interface KpiItem {
  label: string
  value: number | string
  color: string
  icon: string
  isText?: boolean
  urgent?: boolean
}

export default function KpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {items.map((kpi, i) => (
        <div key={kpi.label} className={`card p-4 animate-fade-up delay-${i + 1}`}
          style={kpi.urgent ? { borderColor: 'rgba(196,40,28,0.3)', boxShadow: '0 0 0 2px rgba(196,40,28,0.08)' } : {}}>
          <span className="text-lg block mb-1.5">{kpi.icon}</span>
          <p className="text-metric-md mb-0.5" style={{ color: kpi.color }}>
            {kpi.isText ? kpi.value : (kpi.value as number).toLocaleString('de-DE')}
          </p>
          <p className="label-overline" style={{ color: 'var(--text-tertiary)' }}>{kpi.label}</p>
        </div>
      ))}
    </div>
  )
}
