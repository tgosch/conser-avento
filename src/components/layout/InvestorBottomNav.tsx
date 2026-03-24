import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, Rocket, MoreHorizontal } from 'lucide-react'

const mainNav = [
  { to: '/investor/dashboard', icon: LayoutDashboard, label: 'Home',      exact: true },
  { to: '/investor/plans',     icon: FileText,         label: 'Dokumente' },
  { to: '/investor/chat',      icon: MessageSquare,    label: 'Chat' },
  { to: '/investor/future',    icon: Rocket,           label: 'Roadmap' },
]

function NavItem({ to, icon: Icon, label, exact }: {
  to: string; icon: React.ElementType; label: string; exact?: boolean
}) {
  return (
    <NavLink to={to} end={exact} className="bottom-nav-item">
      {({ isActive }) => (
        <>
          {isActive && <span className="bottom-nav-indicator badge-bounce" />}
          <span
            className="flex items-center justify-center rounded-full transition-all duration-200"
            style={{ width: 48, height: 28, background: isActive ? 'var(--brand-dim)' : 'transparent' }}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.3 : 1.7}
              style={{ color: isActive ? 'var(--brand)' : 'var(--text-tertiary)' }}
            />
          </span>
          <span className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? 'var(--brand)' : 'var(--text-tertiary)' }}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function InvestorBottomNav({ onMoreClick }: { onMoreClick: () => void }) {
  return (
    <nav className="bottom-nav lg:hidden" style={{ background: 'var(--surface)' }} aria-label="Investor Mobile Navigation">
      {mainNav.map(item => <NavItem key={item.to} {...item} />)}
      <button className="bottom-nav-item" onClick={onMoreClick}>
        <span className="flex items-center justify-center rounded-full w-12 h-7">
          <MoreHorizontal size={20} strokeWidth={1.7} style={{ color: 'var(--text-tertiary)' }} />
        </span>
        <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>Mehr</span>
      </button>
    </nav>
  )
}
