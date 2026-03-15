import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Bell, Handshake, MoreHorizontal } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const mainNav = [
  { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Home',    exact: true },
  { to: '/owner/chat',      icon: MessageSquare,   label: 'Chat',    badge: true },
  { to: '/owner/updates',   icon: Bell,            label: 'Updates' },
  { to: '/owner/partners',  icon: Handshake,       label: 'Partner' },
]

interface Props { onMoreClick: () => void }

function NavItem({ to, icon: Icon, label, exact, hasUnread }: {
  to: string; icon: React.ElementType; label: string; exact?: boolean; hasUnread?: boolean
}) {
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

export default function OwnerBottomNav({ onMoreClick }: Props) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('from_admin', false)
      .then(({ count }) => { if (count !== null) setUnreadCount(count) })
    const ch = supabase.channel('owner-bottomnav-badge')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'from_admin=eq.false' },
        () => setUnreadCount(p => p + 1))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  return (
    <nav className="bottom-nav lg:hidden" style={{ background: 'var(--surface)' }}>
      {mainNav.map(item => (
        <NavItem key={item.to} {...item} hasUnread={item.badge ? unreadCount > 0 : false} />
      ))}
      <button className="bottom-nav-item" onClick={onMoreClick}>
        <span className="flex items-center justify-center w-12 h-7">
          <MoreHorizontal size={20} strokeWidth={1.7} style={{ color: 'var(--text-tertiary)' }} />
        </span>
        <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>Mehr</span>
      </button>
    </nav>
  )
}
