import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'

const CONSENT_KEY = 'conser-avento-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, accepted_at: new Date().toISOString() }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
      <div className="max-w-lg mx-auto rounded-2xl p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-xl)' }}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--brand-dim)' }}>
            <Shield size={16} style={{ color: 'var(--brand)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Datenschutz</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Wir verwenden nur technisch notwendige Cookies fuer die Funktionalitaet dieser Seite. Keine Tracking- oder Werbe-Cookies.{' '}
              <a href="mailto:torben@conser-avento.de" className="underline" style={{ color: 'var(--brand)' }}>Mehr erfahren</a>
            </p>
            <button onClick={accept} className="btn btn-primary btn-sm mt-3">
              Verstanden
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
