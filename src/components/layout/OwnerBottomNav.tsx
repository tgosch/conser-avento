import { useEffect, useState } from 'react'
import { LayoutDashboard, MessageSquare, Bell, Handshake, MoreHorizontal } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import NavItem from './NavItem'

const mainNav = [
  { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Home',    exact: true },
  { to: '/owner/chat',      icon: MessageSquare,   label: 'Chat',    badge: true },
  { to: '/owner/updates',   icon: Bell,            label: 'Updates' },
  { to: '/owner/partners',  icon: Handshake,       label: 'Partner' },
]

interface Props { onMoreClick: () => void }

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
    <nav className="bottom-nav lg:hidden" style={{ background: 'var(--surface)' }} aria-label="Owner Mobile Navigation">
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
