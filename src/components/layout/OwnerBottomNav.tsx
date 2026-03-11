import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, MessageSquare, Bell, MoreHorizontal } from 'lucide-react'

const mainNav = [
  { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Home',    exact: true },
  { to: '/owner/docs',      icon: FolderOpen,      label: 'Pläne' },
  { to: '/owner/chat',      icon: MessageSquare,   label: 'Chat' },
  { to: '/owner/updates',   icon: Bell,            label: 'Updates' },
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
            style={{ background: isActive ? 'rgba(212,102,42,0.18)' : 'transparent' }}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={{ color: isActive ? '#D4662A' : 'rgba(255,255,255,0.5)' }}
            />
          </span>
          <span
            className="text-[10px] font-semibold leading-none"
            style={{ color: isActive ? '#D4662A' : 'rgba(255,255,255,0.45)' }}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function OwnerBottomNav({ onMoreClick }: Props) {
  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-30 lg:hidden flex items-stretch border-t"
      style={{
        background: '#1C1C1E',
        borderColor: 'rgba(255,255,255,0.08)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
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
          <MoreHorizontal size={20} strokeWidth={1.8} style={{ color: 'rgba(255,255,255,0.45)' }} />
        </span>
        <span className="text-[10px] font-semibold leading-none" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Mehr
        </span>
      </button>
    </nav>
  )
}
