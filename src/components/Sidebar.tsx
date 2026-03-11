import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageCircle, Link2, Users, X } from 'lucide-react'
import aventoLogo from '../assets/avento_kachel.svg'
import conserLogo from '../assets/conser_kachel.svg'

interface Props {
  open: boolean
  onClose: () => void
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/dashboard/plans', icon: FileText, label: 'Pläne' },
  { to: '/dashboard/chat', icon: MessageCircle, label: 'Chat & Invest' },
  { to: '/dashboard/links', icon: Link2, label: 'Verknüpfungen' },
  { to: '/dashboard/team', icon: Users, label: 'Gründer' },
]

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-accent1 z-30 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 text-white/60 hover:text-white md:hidden"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Logo area */}
        <div className="p-5 pt-7 flex flex-col gap-2 border-b border-white/10">
          <img
            src={aventoLogo}
            alt="Avento Software"
            className="w-full rounded-xl object-cover h-14"
          />
          <img
            src={conserLogo}
            alt="Conser Market"
            className="w-full rounded-xl object-cover h-14"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1 mt-2">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-white/16 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-white/10">
          <p className="text-white/40 text-xs">Investor-Portal v1.0</p>
        </div>
      </aside>
    </>
  )
}
