import { LayoutDashboard, FileText, MessageSquare, Rocket, MoreHorizontal } from 'lucide-react'
import NavItem from './NavItem'

const mainNav = [
  { to: '/investor/dashboard', icon: LayoutDashboard, label: 'Home',      exact: true },
  { to: '/investor/plans',     icon: FileText,         label: 'Dokumente' },
  { to: '/investor/chat',      icon: MessageSquare,    label: 'Chat' },
  { to: '/investor/future',    icon: Rocket,           label: 'Roadmap' },
]

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
