import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Activity, Rocket, Map, FileText,
  Users, Handshake, Building2, MessageSquare, Settings,
  LogOut, X, Swords, HelpCircle, AlertTriangle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'

const NAV = [
  {
    group: 'ÜBERSICHT',
    items: [
      { to: '/investor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/investor/status',    icon: Activity,        label: 'Neuigkeiten' },
    ]
  },
  {
    group: 'INVESTMENT CASE',
    items: [
      { to: '/investor/future',   icon: Rocket,   label: 'Vision & Roadmap' },
      { to: '/investor/roadmap',  icon: Map,      label: 'Enterprise Roadmap' },
      { to: '/investor/plans',       icon: FileText, label: 'Dokumente' },
      { to: '/investor/competition', icon: Swords,   label: 'Wettbewerb' },
      { to: '/investor/risiken',     icon: AlertTriangle, label: 'Risiken' },
    ]
  },
  {
    group: 'UNTERNEHMEN',
    items: [
      { to: '/investor/team',      icon: Users,     label: 'Das Team' },
      { to: '/investor/partners',  icon: Handshake, label: 'Partner' },
      { to: '/investor/structure', icon: Building2, label: 'Struktur' },
    ]
  },
  {
    group: 'DIREKT',
    items: [
      { to: '/investor/faq',      icon: HelpCircle,    label: 'FAQ' },
      { to: '/investor/chat',     icon: MessageSquare, label: 'Chat mit Torben' },
      { to: '/investor/settings', icon: Settings,      label: 'Einstellungen' },
    ]
  },
]

interface Props { open: boolean; onClose: () => void }

export default function InvestorSidebar({ open, onClose }: Props) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/') }
  const firstName = user?.investor?.first_name ?? ''
  const lastName  = user?.investor?.last_name  ?? ''
  const name      = firstName ? `${firstName} ${lastName}`.trim() : (user?.email ?? 'Investor')
  const initials  = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? 'I')

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
          <div className="flex gap-2 mb-1">
            <img src={aventoLogo} alt="Avento" className="rounded-lg object-cover flex-1" style={{ height: 46 }} />
            <img src={conserLogo} alt="Conser" className="rounded-lg object-cover flex-1" style={{ height: 46 }} />
          </div>
          <p className="text-center mt-2"
             style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Investor Portal
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin flex flex-col gap-5" aria-label="Investor Navigation">
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
               style={{ background: 'rgba(200,97,26,0.18)', border: '1px solid rgba(200,97,26,0.25)' }}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="label-overline" style={{ color: 'rgba(255,255,255,0.45)' }}>Seed Round</span>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
            </div>
            <p className="text-sm font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              ab €1,2M · Offen
            </p>
          </div>
          <div className="flex items-center gap-3 px-1 mb-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs"
                 style={{ background: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{name}</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Investor</p>
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
