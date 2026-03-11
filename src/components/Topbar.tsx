import { useState } from 'react'
import { Search, Menu, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import aventoLogo from '../assets/avento_kachel.svg'
import conserLogo from '../assets/conser_kachel.svg'

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const initials = user?.investor
    ? `${user.investor.first_name[0]}${user.investor.last_name[0]}`
    : 'TG'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 md:left-60 h-[68px] bg-surface z-10 flex items-center px-4 md:px-6 gap-4"
      style={{ boxShadow: '0 1px 0 rgba(6,61,62,0.08), 0 2px 12px rgba(6,61,62,0.05)' }}
    >
      <button className="md:hidden text-accent1 hover:opacity-70" onClick={onMenuClick}>
        <Menu size={22} />
      </button>

      {/* Logos */}
      <div className="hidden md:flex items-center gap-2.5">
        <img src={aventoLogo} alt="Avento" className="h-7 rounded-lg object-cover w-auto" />
        <div className="w-px h-5 bg-black/10" />
        <img src={conserLogo} alt="Conser" className="h-7 rounded-lg object-cover w-auto" />
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm ml-2">
        <div className="flex items-center gap-2 bg-surface2 rounded-full px-4 py-2">
          <Search size={14} className="text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Suchen..."
            className="bg-transparent text-sm outline-none w-full text-text placeholder-secondary/70 font-sans"
          />
        </div>
      </div>

      {/* Profile */}
      <div className="relative ml-auto">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-9 h-9 rounded-full text-white text-sm font-bold flex items-center justify-center hover:opacity-80 transition"
          style={{ background: '#063D3E' }}
        >
          {initials}
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-11 z-20 bg-surface rounded-[16px] shadow-card p-1.5 w-44 border border-black/5">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-surface2 rounded-xl transition">
                <User size={15} className="text-accent1" /> Mein Profil
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-surface2 rounded-xl transition">
                <Settings size={15} className="text-accent1" /> Einstellungen
              </button>
              <div className="my-1 border-t border-black/5" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut size={15} /> Abmelden
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
