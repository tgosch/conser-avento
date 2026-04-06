import { useState } from 'react'
import { Link } from 'react-router-dom'
const aventoLogo = '/avento.PNG'
const conserLogo = '/conser.PNG'
import ImpressumModal from '../auth/ImpressumModal'
import PrivacyModal from '../auth/PrivacyModal'
import NdaModal from '../auth/NdaModal'

export default function PublicFooter() {
  const [showImpressum, setShowImpressum] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showNda, setShowNda] = useState(false)

  return (
    <>
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="public-container py-8">
          {/* Mobile: stacked, Desktop: row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Logo + Copyright */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <img src={aventoLogo} alt="Avento" className="h-5 rounded" />
                <img src={conserLogo} alt="Conser" className="h-5 rounded" />
              </div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                &copy; {new Date().getFullYear()} Conser GmbH
              </p>
            </div>

            {/* Links — wrap on mobile */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link to="/produkte" className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Produkte</Link>
              <Link to="/ueber-uns" className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Über uns</Link>
              <Link to="/kontakt" className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Kontakt</Link>
              <button onClick={() => setShowImpressum(true)} className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Impressum</button>
              <button onClick={() => setShowPrivacy(true)} className="text-sm py-1" style={{ color: 'var(--text-tertiary)' }}>Datenschutz</button>
            </div>
          </div>
        </div>
      </footer>

      {showImpressum && <ImpressumModal onClose={() => setShowImpressum(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showNda && <NdaModal onClose={() => setShowNda(false)} />}
    </>
  )
}
