// Einheitlicher Section-Header für alle Seiten
// label-tag + optionaler Action-Link

import { type ReactNode } from 'react'

interface Props {
  label: string           // ALL CAPS Label über der Überschrift
  title?: string          // Große Überschrift (optional)
  sub?: string            // Subtitel
  action?: ReactNode      // Rechts: z.B. <Link>Alle →</Link>
  className?: string
}

export function SectionHeader({ label, title, sub, action, className = '' }: Props) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <p className="label-tag mb-1" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
        {title && (
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            {title}
          </h2>
        )}
        {sub && <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
