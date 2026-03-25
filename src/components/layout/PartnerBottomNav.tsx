import { LayoutDashboard, Handshake, TrendingUp, Users, MoreHorizontal } from 'lucide-react'
import NavItem from './NavItem'

const mainNav = [
  { to: '/partner/dashboard',   icon: LayoutDashboard, label: 'Home',      exact: true },
  { to: '/partner/partnership', icon: Handshake,       label: 'Partner' },
  { to: '/partner/revenue',    icon: TrendingUp,      label: 'Revenue' },
  { to: '/partner/network',    icon: Users,           label: 'Netzwerk' },
]

export default function PartnerBottomNav({ onMoreClick }: { onMoreClick: () => void }) {
  return (
    <nav className="bottom-nav lg:hidden" style={{ background: 'var(--surface)' }} aria-label="Partner Mobile Navigation">
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
