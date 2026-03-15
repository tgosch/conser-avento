// Wiederverwendbare KPI-Karte mit optionalem Trend-Pfeil + CountUp
// Verwendung in Dashboard, Future, Roadmap etc.

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp'

interface Props {
  label: string
  value: string | number        // String: direkt anzeigen. Number: CountUp
  sub?: string                  // Kleine Zeile darunter
  icon?: string                 // Emoji
  trend?: 'up' | 'down' | 'neutral'
  accentColor?: string          // Default: #063D3E
  className?: string
}

export function StatCard({ label, value, sub, icon, trend, accentColor = '#063D3E', className = '' }: Props) {
  const isNumber = typeof value === 'number'
  const { formatted } = useCountUp(isNumber ? (value as number) : 0)
  const display = isNumber ? formatted : value

  const trendColor = trend === 'up' ? '#34C759' : trend === 'down' ? '#FF3B30' : 'var(--text-tertiary)'

  return (
    <div
      className={`rounded-[20px] p-5 border hover-card card-enter ${className}`}
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {icon && <span className="text-2xl block mb-3">{icon}</span>}
      <div className="flex items-end justify-between gap-2">
        <span
          className="metric-number num-pop"
          style={{ color: accentColor }}
        >
          {display}
        </span>
        {trend && (
          <span style={{ color: trendColor, marginBottom: 2 }}>
            {trend === 'up'      && <TrendingUp  size={16} />}
            {trend === 'down'    && <TrendingDown size={16} />}
            {trend === 'neutral' && <Minus        size={14} />}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold mt-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>}
    </div>
  )
}
