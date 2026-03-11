import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, Link2, Users, X, ShieldCheck, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import aventoLogo from '../assets/avento_kachel.svg'
import conserLogo from '../assets/conser_kachel.svg'

interface Props {
  open: boolean
  onClose: () => void
}

const investorNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/dashboard/plans', icon: FileText, label: 'Pläne' },
  { to: '/dashboard/chat', icon: MessageSquare, label: 'Chat & Invest' },
  { to: '/dashboard/links', icon: Link2, label: 'Verknüpfungen' },
  { to: '/dashboard/team', icon: Users, label: 'Gründer' },
]

const adminNav = [
  { to: '/admin', icon: ShieldCheck, label: 'Admin Dashboard', exact: true },
  { to: '/dashboard/plans', icon: FileText, label: 'Pläne' },
  { to: '/dashboard/links', icon: Link2, label: 'Verknüpfungen' },
  { to: '/dashboard/team', icon: Users, label: 'Gründer' },
]

export default function Sidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = user?.isAdmin ? adminNav : investorNav

  const name = user?.investor
    ? `${user.investor.first_name} ${user.investor.last_name}`
    : 'Administrator'
  const initials = user?.investor
    ? `${user.investor.first_name[0]}${user.investor.last_name[0]}`
    : 'TG'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-60 z-30 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ background: '#063D3E' }}
      >
        <button className="absolute top-4 right-4 text-white/50 hover:text-white md:hidden" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Logos */}
        <div className="p-5 pt-7 flex flex-col gap-2.5 border-b border-white/10">
          <img src={aventoLogo} alt="Avento" className="w-full rounded-xl object-cover h-[54px]" />
          <img src={conserLogo} alt="Conser" className="w-full rounded-xl object-cover h-[54px]" />
        </div>

        {/* Admin badge */}
        {user?.isAdmin && (
          <div className="mx-4 mt-3 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(212,102,42,0.25)' }}>
            <p className="text-xs font-semibold" style={{ color: '#F4956A' }}>Admin-Modus aktiv</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-0.5 mt-2 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-white text-accent1 shadow-sm2'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer: user info + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{name}</p>
              <p className="text-white/40 text-xs">{user?.isAdmin ? 'Administrator' : 'Investor'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition text-xs font-medium"
          >
            <LogOut size={14} />
            Abmelden
          </button>
        </div>
      </aside>
    </>
  )
}
