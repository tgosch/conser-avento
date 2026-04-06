import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Rocket, Handshake, TrendingUp,
  Users, Map, Settings, LogOut, X, Calculator,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  {
    group: 'WILLKOMMEN',
    items: [
      { to: '/partner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/partner/vision',    icon: Rocket,          label: 'Vision & Mission' },
    ]
  },
  {
    group: 'PARTNERSCHAFT',
    items: [
      { to: '/partner/partnership', icon: Handshake,  label: 'Partnermodell' },
      { to: '/partner/revenue',     icon: TrendingUp, label: 'Revenue-Modell' },
      { to: '/partner/calculator',   icon: Calculator, label: 'Revenue Calculator' },
      { to: '/partner/network',     icon: Users,      label: 'Netzwerk' },
      { to: '/partner/roadmap',     icon: Map,        label: 'Roadmap' },
      { to: '/partner/team',        icon: Users,      label: 'Unser Team' },
    ]
  },
  {
    group: 'KONTO',
    items: [
      { to: '/partner/settings', icon: Settings, label: 'Einstellungen' },
    ]
  },
]

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  negotiating: { bg: 'rgba(234,179,8,0.18)',  text: '#EAB308', label: 'Verhandlung' },
  active:      { bg: 'rgba(34,197,94,0.18)',  text: '#22C55E', label: 'Aktiv' },
  beta:        { bg: 'rgba(139,92,246,0.18)', text: '#8B5CF6', label: 'Beta' },
  partner:     { bg: 'rgba(34,197,94,0.18)',  text: '#22C55E', label: 'Partner' },
}

interface Props { open: boolean; onClose: () => void }

export default function PartnerSidebar({ open, onClose }: Props) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/') }
  const partner = user?.partner
  const name = partner?.name ?? (user?.email ?? 'Partner')
  const initials = partner?.initials ?? name.slice(0, 2).toUpperCase()
  const status = partner?.status ?? 'negotiating'
  const statusInfo = STATUS_COLORS[status] ?? STATUS_COLORS.negotiating

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[45] lg:hidden sheet-overlay" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 scrollbar-thin
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          width: 'var(--sidebar-width)',
          background: '#071F20',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button className="absolute top-4 right-4 btn btn-icon text-white/40 hover:text-white lg:hidden"
                onClick={onClose}>
          <X size={16} />
        </button>

        {/* Brand */}
        <div className="px-5 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Partner Portal
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin flex flex-col gap-5" aria-label="Partner Navigation">
          {NAV.map(({ group, items }) => (
            <div key={group}>
              <p className="sidebar-group-label mb-2">{group}</p>
              <div className="flex flex-col gap-0.5">
                {items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to.endsWith('dashboard')}
                    onClick={onClose}
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={15} className="shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                        <span className="flex-1 truncate">{label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: 'rgba(255,255,255,0.5)' }} />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="mb-3 px-3 py-2.5 rounded-md relative overflow-hidden"
               style={{ background: statusInfo.bg, border: `1px solid ${statusInfo.text}40` }}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="label-overline" style={{ color: 'rgba(255,255,255,0.45)' }}>Status</span>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: statusInfo.text }} />
            </div>
            <p className="text-sm font-bold" style={{ color: statusInfo.text, fontFamily: 'var(--font-mono)' }}>
              {statusInfo.label}
            </p>
          </div>
          <div className="flex items-center gap-3 px-1 mb-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs"
                 style={{ background: partner?.color ?? 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{name}</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Produktionspartner</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-nav-item w-full text-[12px]"
                  style={{ color: 'rgba(255,255,255,0.35)' }}>
            <LogOut size={13} /> Abmelden
          </button>
        </div>
      </aside>
    </>
  )
}
