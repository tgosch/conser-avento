import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
const aventoLogo = '/avento.PNG'
const conserLogo = '/conser.PNG'

const navLinks = [
  { to: '/', label: 'Startseite' },
  { to: '/produkte', label: 'Produkte' },
  { to: '/ueber-uns', label: 'Über uns' },
  { to: '/kontakt', label: 'Kontakt' },
]

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Background — immer sichtbar */}
        <div className="absolute inset-0"
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        />

        <nav className="relative public-container flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={aventoLogo} alt="Avento" className="h-7 rounded-lg" />
            <div className="w-px h-3.5 opacity-15 bg-current" />
            <img src={conserLogo} alt="Conser" className="h-7 rounded-lg" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(link => {
              const active = location.pathname === link.to
              return (
                <Link key={link.to} to={link.to}
                  className="text-sm py-2 transition-colors"
                  style={{
                    color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    fontWeight: active ? 500 : 400,
                  }}>
                  {link.label}
                </Link>
              )
            })}
            <Link to="/kontakt"
              className="text-sm py-2 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}>
              Testzugang
            </Link>
            <Link to="/login"
              className="text-sm font-medium px-5 py-2 rounded-full transition-all hover:opacity-80"
              style={{ background: 'var(--brand)', color: 'white' }}>
              Einloggen
            </Link>
          </div>

          {/* Mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5" aria-label="Menu"
            style={{ color: 'var(--text-primary)' }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-14 z-40 md:hidden"
            style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}
          >
            <div className="public-container pt-6 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                  className="py-3 text-xl font-semibold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: location.pathname === link.to ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}>
                  {link.label}
                </Link>
              ))}
              <Link to="/kontakt" onClick={() => setMenuOpen(false)}
                className="mt-4 text-center py-3.5 rounded-full text-sm font-medium"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                Testzugang anfragen
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="mt-2 text-center py-3.5 rounded-full text-sm font-medium"
                style={{ background: 'var(--brand)', color: 'white' }}>
                Einloggen
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
