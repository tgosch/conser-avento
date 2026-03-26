import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function PrivacyModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={dialogRef} tabIndex={-1}
        role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title"
        className="w-full max-w-xl rounded-[24px] flex flex-col border outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', maxHeight: '80vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <h2 id="privacy-modal-title" className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Datenschutzerklaerung</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70 transition" style={{ color: 'var(--text-secondary)' }} aria-label="Schließen"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto p-6 text-sm leading-relaxed space-y-4" style={{ color: 'var(--text-secondary)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>gemaess DSGVO (Art. 13, 14 DSGVO)</p>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Verantwortlicher</p>
            <p>Avento Software &amp; Conser Market<br />Vertreten durch: Torben Gosch (CEO)<br />E-Mail: torben@avento-conser.de</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Erhobene Daten</p>
            <ul className="space-y-0.5 pl-4">
              <li>• Name, E-Mail, Telefonnummer</li>
              <li>• Zeitpunkt der Registrierung und Einwilligung</li>
              <li>• IP-Adresse (fuer Sicherheitszwecke)</li>
              <li>• Kommunikationsinhalte (Chat-Nachrichten)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Zweck der Verarbeitung</p>
            <ul className="space-y-0.5 pl-4">
              <li>• Zugang zum Investoren-Portal</li>
              <li>• Kommunikation bezueglich Investitionsmoeglichkeiten</li>
              <li>• Einhaltung rechtlicher Verpflichtungen</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Rechtsgrundlage</p>
            <p>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Speicherdauer</p>
            <p>Daten werden fuer die Dauer des Investorenprozesses gespeichert, mindestens jedoch 3 Jahre aus steuerrechtlichen Gruenden.</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Ihre Rechte (Art. 15–22 DSGVO)</p>
            <ul className="space-y-0.5 pl-4">
              <li>• Auskunft ueber gespeicherte Daten</li>
              <li>• Berichtigung unrichtiger Daten</li>
              <li>• Loeschung („Recht auf Vergessenwerden")</li>
              <li>• Einschraenkung der Verarbeitung</li>
              <li>• Datenuebertragbarkeit</li>
              <li>• Widerspruch gegen die Verarbeitung</li>
            </ul>
          </div>
          <p className="text-xs pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
            Kontakt fuer Datenschutzanfragen: torben@avento-conser.de
          </p>
        </div>
        <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition" style={{ background: 'var(--brand)' }}>
            Verstanden
          </button>
        </div>
      </div>
    </div>
  )
}
