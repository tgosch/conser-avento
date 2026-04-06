import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Handshake, TrendingUp, Users, MoreHorizontal,
  Rocket, Map, Settings, LogOut, X, Calculator,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import NavItem from './NavItem'

const mainNav = [
  { to: '/partner/dashboard',   icon: LayoutDashboard, label: 'Home',      exact: true },
  { to: '/partner/partnership', icon: Handshake,       label: 'Partner' },
  { to: '/partner/revenue',    icon: TrendingUp,      label: 'Revenue' },
  { to: '/partner/network',    icon: Users,           label: 'Netzwerk' },
]

const moreNav = [
  { to: '/partner/vision',      icon: Rocket,     label: 'Vision' },
  { to: '/partner/calculator',  icon: Calculator, label: 'Calculator' },
  { to: '/partner/roadmap',     icon: Map,        label: 'Roadmap' },
  { to: '/partner/team',        icon: Users,      label: 'Unser Team' },
  { to: '/partner/settings',    icon: Settings,   label: 'Einstellungen' },
]

export default function PartnerBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <>
      <nav className="bottom-nav lg:hidden" style={{ background: 'var(--surface)' }} aria-label="Partner Mobile Navigation">
        {mainNav.map(item => <NavItem key={item.to} {...item} />)}
        <button className="bottom-nav-item" onClick={() => setSheetOpen(true)}>
          <span className="flex items-center justify-center rounded-full" style={{ width: 52, height: 36 }}>
            <MoreHorizontal size={22} strokeWidth={1.7} style={{ color: 'var(--text-tertiary)' }} />
          </span>
          <span className="text-[11px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>Mehr</span>
        </button>
      </nav>

      {/* Bottom Sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-[20px] animate-slide-up"
            style={{ background: 'var(--surface)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Weitere Seiten</p>
              <button onClick={() => setSheetOpen(false)} className="btn btn-icon btn-ghost btn-icon-sm">
                <X size={16} />
              </button>
            </div>
            {/* Nav Items */}
            <div className="px-3 py-2 grid grid-cols-4 gap-1">
              {moreNav.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setSheetOpen(false)}
                  className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-colors"
                  style={({ isActive }) => ({
                    background: isActive ? 'var(--brand-dim)' : 'transparent',
                    color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                  })}
                >
                  <Icon size={20} strokeWidth={1.6} />
                  <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
                </NavLink>
              ))}
            </div>
            {/* Logout */}
            <div className="px-5 pt-2 pb-1" style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={handleLogout}
                className="flex items-center gap-3 w-full py-3 text-sm font-semibold rounded-xl transition-colors"
                style={{ color: 'var(--danger)' }}>
                <LogOut size={16} /> Abmelden
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
