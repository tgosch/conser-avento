import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, Bell, Settings, X, LogOut,
  Handshake, Users, Rocket, GitBranch, FileText,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'

// NAV groups with unreadCount param
const makeGroups = (unreadCount: number) => [
  { group: 'COCKPIT', items: [
      { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/owner/chat',      icon: MessageSquare,   label: 'Investor-Chat', badge: unreadCount > 0 ? unreadCount : undefined },
      { to: '/owner/updates',   icon: Bell,            label: 'Updates' },
  ]},
  { group: 'INHALTE', items: [
      { to: '/owner/docs',     icon: FileText,  label: 'Dokumente' },
      { to: '/owner/partners', icon: Handshake, label: 'Partner' },
      { to: '/owner/team',     icon: Users,     label: 'Team' },
  ]},
  { group: 'PLANUNG', items: [
      { to: '/owner/phases', icon: GitBranch, label: 'Phasenpläne' },
      { to: '/owner/future', icon: Rocket,    label: 'Zukunft' },
  ]},
  { group: 'SYSTEM', items: [
      { to: '/owner/settings', icon: Settings, label: 'Einstellungen' },
  ]},
]

interface Props { open: boolean; onClose: () => void }

export default function OwnerSidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('from_admin', false)
      .then(({ count }) => { if (count !== null) setUnreadCount(count) })
    const ch = supabase.channel('owner-sidebar-badge')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'from_admin=eq.false' },
        () => setUnreadCount(p => p + 1))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  const handleLogout = async () => { await logout(); navigate('/') }
  const NAV = makeGroups(unreadCount)

  return (
    <>
      {open && <div className="fixed inset-0 z-20 lg:hidden sheet-overlay" onClick={onClose} />}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: 'var(--sidebar-width)', background: '#0A0A0A', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <button className="absolute top-4 right-4 btn btn-icon lg:hidden" style={{ color: 'rgba(255,255,255,0.3)' }} onClick={onClose} aria-label="Sidebar schliessen">
          <X size={15} />
        </button>

        {/* Brand Header */}
        <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex items-center gap-1.5">
              <img src={aventoLogo} alt="Avento" className="h-[28px] w-auto rounded-md object-cover" />
              <img src={conserLogo} alt="Conser" className="h-[28px] w-auto rounded-md object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Conser-Avento</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>Owner Console</p>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin flex flex-col gap-5" aria-label="Owner Navigation">
          {NAV.map(({ group, items }) => (
            <div key={group}>
              <p className="sidebar-group-label mb-2">{group}</p>
              <div className="flex flex-col gap-0.5">
                {items.map(({ to, icon: Icon, label, badge }) => (
                  <NavLink key={to} to={to} end={to.endsWith('dashboard')} onClick={onClose}
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    {({ isActive }) => (
                      <>
                        <Icon size={15} className="shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                        <span className="flex-1 truncate">{label}</span>
                        {badge && badge > 0 ? (
                          <span className="badge-bounce w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ background: '#E04B3E', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            {badge > 9 ? '9+' : badge}
                          </span>
                        ) : isActive ? (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.4)' }} />
                        ) : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: User */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl mb-2" style={{ cursor: 'default' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: 'var(--brand)', fontFamily: 'var(--font-mono)' }}>
              {(user?.email ?? 'AD').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.email ?? 'Admin'}</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Owner</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-nav-item w-full text-[12px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
            <LogOut size={13} /> Abmelden
          </button>
        </div>
      </aside>
    </>
  )
}
