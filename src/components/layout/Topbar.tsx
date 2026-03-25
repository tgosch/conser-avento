import { useState } from 'react'
import { LogOut, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import aventoLogo from '../../assets/avento_kachel.webp'
import conserLogo from '../../assets/conser_kachel.webp'

interface Props { onMenuClick?: () => void }

export default function Topbar({ onMenuClick }: Props) {
  void onMenuClick
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const initials = user?.investor
    ? `${user.investor.first_name?.[0] ?? ''}${user.investor.last_name?.[0] ?? ''}`.toUpperCase() || 'IN'
    : user?.partner?.initials ?? 'TG'

  const settingsPath = user?.isAdmin ? '/owner/settings' : user?.isPartner ? '/partner/settings' : '/investor/settings'
  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <header className="topbar" style={{ boxShadow: 'none' }}>

      {/* ── Mobile ── */}
      <div className="flex lg:hidden items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <img src={aventoLogo} alt="Avento" className="rounded-lg object-cover h-7 w-auto" />
          <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          <img src={conserLogo} alt="Conser" className="rounded-lg object-cover h-7 w-auto" />
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="btn btn-icon btn-ghost btn-icon-sm focus-ring" aria-label={theme === 'dark' ? 'Helles Design' : 'Dunkles Design'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Benutzermenu"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center transition hover:opacity-85"
              style={{ background: 'var(--brand)', fontFamily: 'var(--font-mono)' }}
            >
              {initials}
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-10 z-20 w-48 card animate-scale-in"
                     style={{ boxShadow: 'var(--shadow-xl)' }}>
                  <div className="p-1.5">
                    <button onClick={() => { setDropdownOpen(false); navigate(settingsPath) }}
                      className="btn btn-ghost w-full justify-start gap-3 text-left">
                      <Settings size={14} /> Einstellungen
                    </button>
                    <div className="divider my-1" />
                    <button onClick={handleLogout}
                      className="btn btn-ghost w-full justify-start gap-3 text-left"
                      style={{ color: 'var(--danger)' }}>
                      <LogOut size={14} /> Abmelden
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden lg:flex items-center justify-between w-full">
        <div className="flex items-center gap-2" style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Conser-Avento</span>
          <span style={{ color: 'var(--border-strong)' }}>/</span>
          <span>{user?.isAdmin ? 'Owner Console' : user?.isPartner ? 'Partner Portal' : 'Investor Portal'}</span>
        </div>
        <div className="flex items-center gap-2">
          {user?.isPartner ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                 style={{ background: 'rgba(6,61,62,0.10)', border: '1px solid rgba(6,61,62,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--brand)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--brand)' }}>
                {user.partner?.name ?? 'Partner'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                 style={{ background: 'var(--accent-dim)', border: '1px solid rgba(200,97,26,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                Seed Round · Q2 2026
              </span>
            </div>
          )}
          <button onClick={toggleTheme} className="btn btn-icon btn-ghost focus-ring" aria-label={theme === 'dark' ? 'Helles Design' : 'Dunkles Design'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Benutzermenu"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              className="w-9 h-9 rounded-full text-white text-sm font-semibold flex items-center justify-center transition hover:opacity-85"
              style={{ background: 'var(--brand)', fontFamily: 'var(--font-mono)' }}
            >
              {initials}
            </button>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-11 z-20 w-52 card animate-scale-in"
                     style={{ boxShadow: 'var(--shadow-xl)', padding: '6px' }}>
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {user?.investor ? `${user.investor.first_name} ${user.investor.last_name}` : user?.partner?.name ?? 'Benutzer'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {user?.investor?.email || user?.email}
                    </p>
                  </div>
                  <div className="divider mb-1" />
                  <button onClick={() => { setDropdownOpen(false); navigate(settingsPath) }}
                    className="btn btn-ghost btn-sm w-full justify-start gap-2.5">
                    <Settings size={14} /> Einstellungen
                  </button>
                  <button onClick={handleLogout}
                    className="btn btn-ghost btn-sm w-full justify-start gap-2.5"
                    style={{ color: 'var(--danger)' }}>
                    <LogOut size={14} /> Abmelden
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
