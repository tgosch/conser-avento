import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--surface2)' }}>
        {icon}
      </div>
      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
      {description && (
        <p className="text-xs max-w-xs" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      )}
      {action && (
        <button onClick={action.onClick} className="btn btn-primary btn-sm mt-4">
          {action.label}
        </button>
      )}
    </div>
  )
}
