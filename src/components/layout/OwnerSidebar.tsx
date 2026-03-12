import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, MessageSquare, Bell, Rocket, GitBranch, Settings, X, LogOut, ShieldCheck, Handshake, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import aventoLogo from '../../assets/avento_kachel.png'
import conserLogo from '../../assets/conser_kachel.png'

const nav = [
  { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/owner/docs', icon: FolderOpen, label: 'Pläne' },
  { to: '/owner/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/owner/updates', icon: Bell, label: 'Updates' },
  { to: '/owner/partners', icon: Handshake, label: 'Partner' },
  { to: '/owner/team', icon: Users, label: 'Team' },
  { to: '/owner/future', icon: Rocket, label: 'Zukunft' },
  { to: '/owner/phases', icon: GitBranch, label: 'PhasenPlan' },
  { to: '/owner/settings', icon: Settings, label: 'Einstellungen' },
]

interface Props { open: boolean; onClose: () => void }

export default function OwnerSidebar({ open, onClose }: Props) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: 'var(--sidebar-width)', background: '#1C1C1E' }}
      >
        <button className="absolute top-4 right-4 text-white/50 hover:text-white lg:hidden" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="p-4 pt-6 flex flex-col gap-2 border-b border-white/10">
          <img src={aventoLogo} alt="Avento" className="w-full rounded-xl object-cover" style={{ height: '54px' }} />
          <img src={conserLogo} alt="Conser" className="w-full rounded-xl object-cover" style={{ height: '54px' }} />
        </div>

        <div className="mx-4 mt-3 px-3 py-1.5 rounded-xl flex items-center gap-2" style={{ background: 'rgba(212,102,42,0.25)' }}>
          <ShieldCheck size={13} style={{ color: '#F4956A' }} />
          <p className="text-xs font-semibold" style={{ color: '#F4956A' }}>Owner-Modus aktiv</p>
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
              TG
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">Torben Gosch</p>
              <p className="text-white/40 text-xs">Owner / Admin</p>
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
