import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center px-6">
        <p className="text-6xl md:text-8xl font-bold mb-4" style={{ color: 'var(--brand)', fontFamily: 'var(--font-mono)', opacity: 0.15 }}>
          404
        </p>
        <h1 className="text-xl md:text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Seite nicht gefunden
        </h1>
        <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90"
          style={{ background: 'var(--brand)', color: 'white' }}>
          <ArrowLeft size={14} /> Zur Startseite
        </Link>
      </div>
    </div>
  )
}
