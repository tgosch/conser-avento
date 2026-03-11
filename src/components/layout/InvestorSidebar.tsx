import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, Users, Rocket, Activity, Building2, Settings, X, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import aventoLogo from '../../assets/avento_kachel.png'
import conserLogo from '../../assets/conser_kachel.png'

const nav = [
  { to: '/investor/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/investor/plans', icon: FileText, label: 'Pläne' },
  { to: '/investor/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/investor/team', icon: Users, label: 'Gründer' },
  { to: '/investor/future', icon: Rocket, label: 'Zukunft' },
  { to: '/investor/status', icon: Activity, label: 'Stand' },
  { to: '/investor/structure', icon: Building2, label: 'Konstrukt' },
  { to: '/investor/settings', icon: Settings, label: 'Einstellungen' },
]

interface Props { open: boolean; onClose: () => void }

export default function InvestorSidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const name = user?.investor ? `${user.investor.first_name} ${user.investor.last_name}` : 'Investor'
  const initials = user?.investor ? `${user.investor.first_name[0]}${user.investor.last_name[0]}` : 'IN'

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: 'var(--sidebar-width)', background: '#063D3E' }}
      >
        <button className="absolute top-4 right-4 text-white/50 hover:text-white lg:hidden" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="p-4 pt-6 flex flex-col gap-2 border-b border-white/10">
          <img src={aventoLogo} alt="Avento" className="w-full rounded-xl object-cover" style={{ height: '54px' }} />
          <img src={conserLogo} alt="Conser" className="w-full rounded-xl object-cover" style={{ height: '54px' }} />
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5 mt-2 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-150
                ${isActive ? 'bg-white/16 text-white font-semibold' : 'text-white/65 hover:bg-white/10 hover:text-white'}`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{name}</p>
              <p className="text-white/40 text-xs">Investor</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition text-xs font-medium"
          >
            <LogOut size={14} /> Abmelden
          </button>
        </div>
      </aside>
    </>
  )
}
