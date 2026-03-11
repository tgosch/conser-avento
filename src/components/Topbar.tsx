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
    : user?.isAdmin
    ? 'TG'
    : '?'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 md:left-60 h-[68px] bg-white z-10 flex items-center px-4 md:px-6 gap-4"
      style={{ boxShadow: '0 2px 12px rgba(9,72,73,0.07)' }}
    >
      {/* Mobile menu button */}
      <button
        className="md:hidden text-accent1 hover:opacity-70"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>

      {/* Logos (desktop) */}
      <div className="hidden md:flex items-center gap-3">
        <img src={aventoLogo} alt="Avento" className="h-8 rounded-lg object-cover w-auto" />
        <div className="w-px h-6 bg-gray-200" />
        <img src={conserLogo} alt="Conser" className="h-8 rounded-lg object-cover w-auto" />
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto md:mx-0">
        <div className="flex items-center gap-2 bg-bg rounded-full px-4 py-2">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Suchen..."
            className="bg-transparent text-sm outline-none w-full text-text placeholder-gray-400 font-sans"
          />
        </div>
      </div>

      {/* Profile */}
      <div className="relative ml-auto">
        <button
          className="w-9 h-9 rounded-full bg-accent1 text-white text-sm font-semibold flex items-center justify-center hover:opacity-80 transition"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {initials}
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-11 z-20 bg-white rounded-2xl shadow-card p-2 w-48 border border-gray-100">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-bg rounded-xl transition">
                <User size={16} className="text-accent1" />
                Mein Profil
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-bg rounded-xl transition">
                <Settings size={16} className="text-accent1" />
                Einstellungen
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Abmelden
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
