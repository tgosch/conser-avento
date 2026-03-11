import { useState } from 'react'
import { Search, Menu, LogOut, User, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import aventoLogo from '../../assets/avento_kachel.png'
import conserLogo from '../../assets/conser_kachel.png'

interface Props { onMenuClick: () => void }

export default function Topbar({ onMenuClick }: Props) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const initials = user?.investor
    ? `${user.investor.first_name[0]}${user.investor.last_name[0]}`
    : 'TG'

  const settingsPath = user?.isAdmin ? '/owner/settings' : '/investor/settings'

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <header
      className="fixed top-0 right-0 z-10 flex items-center gap-4 bg-surface"
      style={{
        left: 0,
        height: 'var(--topbar-height)',
        boxShadow: '0 1px 0 var(--border), 0 2px 12px rgba(6,61,62,0.05)',
        paddingLeft: 'var(--topbar-pl)',
        paddingRight: '24px',
      }}
    >
      <button className="lg:hidden text-accent1 hover:opacity-70 absolute left-4" onClick={onMenuClick}>
        <Menu size={22} />
      </button>

      <div className="hidden lg:flex items-center gap-2.5">
        <img src={aventoLogo} alt="Avento" className="rounded-lg object-cover" style={{ height: '28px', width: 'auto' }} />
        <div className="w-px h-5 bg-black/10" />
        <img src={conserLogo} alt="Conser" className="rounded-lg object-cover" style={{ height: '28px', width: 'auto' }} />
      </div>

      <div className="flex-1 max-w-sm ml-2">
        <div className="flex items-center gap-2 rounded-full px-4 py-2" style={{ background: 'var(--surface2)' }}>
          <Search size={14} className="text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Suchen..."
            className="bg-transparent text-sm outline-none w-full font-sans"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-surface2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
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
              <div
                className="absolute right-0 top-11 z-20 rounded-[16px] p-1.5 w-44 border"
                style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-md)', borderColor: 'var(--border)' }}
              >
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition hover:bg-surface2" style={{ color: 'var(--text-primary)' }}>
                  <User size={15} className="text-accent1" /> Mein Profil
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate(settingsPath) }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition hover:bg-surface2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Settings size={15} className="text-accent1" /> Einstellungen
                </button>
                <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />
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
      </div>
    </header>
  )
}
