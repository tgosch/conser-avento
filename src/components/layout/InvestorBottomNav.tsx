import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, Activity, MoreHorizontal } from 'lucide-react'

const mainNav = [
  { to: '/investor/dashboard', icon: LayoutDashboard, label: 'Home',   exact: true },
  { to: '/investor/plans',     icon: FileText,         label: 'Pläne' },
  { to: '/investor/chat',      icon: MessageSquare,    label: 'Chat' },
  { to: '/investor/status',    icon: Activity,         label: 'Status' },
]

interface Props { onMoreClick: () => void }

function NavItem({ to, icon: Icon, label, exact }: {
  to: string; icon: React.ElementType; label: string; exact?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={exact}
      className="flex-1 flex flex-col items-center justify-center gap-[3px] min-w-0 py-2 relative"
    >
      {({ isActive }) => (
        <>
          <Icon
            size={22}
            strokeWidth={isActive ? 2.4 : 1.7}
            style={{ color: isActive ? '#063D3E' : 'var(--text-tertiary)' }}
          />
          <span
            className="text-[10px] leading-none"
            style={{
              color: isActive ? '#063D3E' : 'var(--text-tertiary)',
              fontWeight: isActive ? 700 : 500,
            }}
          >
            {label}
          </span>
          {isActive && (
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] w-8 rounded-full"
              style={{ background: '#063D3E' }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function InvestorBottomNav({ onMoreClick }: Props) {
  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-40 lg:hidden flex items-stretch border-t"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: '0 -1px 0 var(--border), 0 -8px 24px rgba(0,0,0,0.08)',
        height: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {mainNav.map(item => <NavItem key={item.to} {...item} />)}
      <button
        onClick={onMoreClick}
        className="flex-1 flex flex-col items-center justify-center gap-[3px] min-w-0 py-2"
      >
        <MoreHorizontal size={22} strokeWidth={1.7} style={{ color: 'var(--text-tertiary)' }} />
        <span className="text-[10px] font-medium leading-none" style={{ color: 'var(--text-tertiary)' }}>
          Mehr
        </span>
      </button>
    </nav>
  )
}
