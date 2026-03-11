import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, Activity, MoreHorizontal } from 'lucide-react'

const mainNav = [
  { to: '/investor/dashboard', icon: LayoutDashboard, label: 'Home', exact: true },
  { to: '/investor/plans',     icon: FileText,         label: 'Pläne' },
  { to: '/investor/chat',      icon: MessageSquare,    label: 'Chat' },
  { to: '/investor/status',    icon: Activity,         label: 'Stand' },
]

interface Props { onMoreClick: () => void }

function NavItem({ to, icon: Icon, label, exact }: {
  to: string; icon: React.ElementType; label: string; exact?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={exact}
      className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0 py-2"
    >
      {({ isActive }) => (
        <>
          <span
            className="flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200"
            style={{ background: isActive ? 'rgba(6,61,62,0.12)' : 'transparent' }}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={{ color: isActive ? '#063D3E' : 'var(--text-secondary)' }}
            />
          </span>
          <span
            className="text-[10px] font-semibold leading-none"
            style={{ color: isActive ? '#063D3E' : 'var(--text-secondary)' }}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function InvestorBottomNav({ onMoreClick }: Props) {
  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-30 lg:hidden flex items-stretch border-t"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: '0 -1px 0 var(--border), 0 -4px 20px rgba(0,0,0,0.06)',
        height: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {mainNav.map(item => <NavItem key={item.to} {...item} />)}
      <button
        onClick={onMoreClick}
        className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0 py-2"
      >
        <span className="flex items-center justify-center w-12 h-7 rounded-full">
          <MoreHorizontal size={20} strokeWidth={1.8} style={{ color: 'var(--text-secondary)' }} />
        </span>
        <span className="text-[10px] font-semibold leading-none" style={{ color: 'var(--text-secondary)' }}>
          Mehr
        </span>
      </button>
    </nav>
  )
}
