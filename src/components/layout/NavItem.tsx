import { NavLink } from 'react-router-dom'

interface Props {
  to: string
  icon: React.ElementType
  label: string
  exact?: boolean
  hasUnread?: boolean
}

export default function NavItem({ to, icon: Icon, label, exact, hasUnread }: Props) {
  return (
    <NavLink to={to} end={exact} className="bottom-nav-item">
      {({ isActive }) => (
        <>
          {isActive && <span className="bottom-nav-indicator" />}
          <span className="relative">
            <span className="flex items-center justify-center rounded-full transition-all duration-200"
              style={{ width: 48, height: 28, background: isActive ? 'rgba(6,61,62,0.12)' : 'transparent' }}>
              <Icon size={20} strokeWidth={isActive ? 2.3 : 1.7}
                style={{ color: isActive ? 'var(--brand)' : 'var(--text-tertiary)' }} />
            </span>
            {hasUnread && !isActive && (
              <span className="absolute -top-0.5 right-1 w-2 h-2 rounded-full badge-bounce"
                style={{ background: '#E04B3E', border: '2px solid var(--surface)' }} />
            )}
          </span>
          <span className="text-[10px] font-semibold"
            style={{ color: isActive ? 'var(--brand)' : 'var(--text-tertiary)' }}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}
