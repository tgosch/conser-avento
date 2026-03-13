import { useState } from 'react'
import { LogOut, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import aventoLogo from '../../assets/avento_kachel.png'
import conserLogo from '../../assets/conser_kachel.png'

interface Props { onMenuClick: () => void }

export default function Topbar({ onMenuClick: _onMenuClick }: Props) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const initials = user?.investor
    ? `${user.investor.first_name?.[0] ?? ''}${user.investor.last_name?.[0] ?? ''}`.toUpperCase() || 'IN'
    : 'TG'

  const settingsPath = user?.isAdmin ? '/owner/settings' : '/investor/settings'
  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-10"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--surface)',
        boxShadow: '0 1px 0 var(--border)',
      }}
    >
      {/* ── Mobile Layout ── */}
      <div className="flex lg:hidden items-center h-full px-4">
        {/* Left spacer (same width as right controls for centering) */}
        <div className="w-[76px] shrink-0" />

        {/* Center: logos */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <img src={aventoLogo} alt="Avento" className="rounded-lg object-cover" style={{ height: '26px', width: 'auto' }} />
          <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          <img src={conserLogo} alt="Conser" className="rounded-lg object-cover" style={{ height: '26px', width: 'auto' }} />
        </div>

        {/* Right: theme + avatar */}
        <div className="flex items-center gap-1 shrink-0 w-[76px] justify-end">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition"
            style={{ color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center transition"
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
                  <button
                    onClick={() => { setDropdownOpen(false); navigate(settingsPath) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Settings size={15} style={{ color: '#063D3E' }} /> Einstellungen
                  </button>
                  <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition"
                    style={{ color: '#FF3B30' }}
                  >
                    <LogOut size={15} /> Abmelden
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop Layout ── */}
      <div
        className="hidden lg:flex items-center h-full relative"
        style={{ paddingLeft: 'var(--topbar-pl)', paddingRight: '24px' }}
      >
        <div className="flex items-center gap-2.5 shrink-0">
          <img src={aventoLogo} alt="Avento" className="rounded-lg object-cover" style={{ height: '28px', width: 'auto' }} />
          <div className="w-px h-5 bg-black/10" />
          <img src={conserLogo} alt="Conser" className="rounded-lg object-cover" style={{ height: '28px', width: 'auto' }} />
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
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
                  <button
                    onClick={() => { setDropdownOpen(false); navigate(settingsPath) }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition hover:bg-surface2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Settings size={15} style={{ color: '#063D3E' }} /> Einstellungen
                  </button>
                  <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition hover:bg-red-50"
                    style={{ color: '#FF3B30' }}
                  >
                    <LogOut size={15} /> Abmelden
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
