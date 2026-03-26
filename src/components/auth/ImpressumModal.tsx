import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function ImpressumModal({ onClose }: { onClose: () => void }) {
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
        role="dialog" aria-modal="true" aria-labelledby="impressum-modal-title"
        className="w-full max-w-xl rounded-[24px] flex flex-col border outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', maxHeight: '80vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <h2 id="impressum-modal-title" className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Impressum</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70 transition" style={{ color: 'var(--text-secondary)' }} aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 text-sm leading-relaxed space-y-5" style={{ color: 'var(--text-secondary)' }}>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Angaben gem. § 5 TMG</p>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Conser Gosch UG (haftungsbeschraenkt)</p>
            <p>Geschaeftsfuehrer: Torben Gosch</p>
            <p>Amtsgericht Luebeck · HRB 22177</p>
            <p>USt-IdNr.: DE458507310</p>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Kontakt</p>
            <p>E-Mail: <a href="mailto:torben@conser-avento.de" className="text-accent underline">torben@conser-avento.de</a></p>
            <p>Web: <a href="https://www.conser-avento.de" target="_blank" rel="noopener noreferrer" className="text-accent underline">www.conser-avento.de</a></p>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Projekte</p>
            <div className="space-y-2">
              <div className="px-3 py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Conser – Marktplatz fuer Handwerker</p>
                <p className="text-xs">Digitaler B2B-Marktplatz fuer die Baubranche</p>
              </div>
              <div className="px-3 py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Avento – ERP fuer Handwerksbetriebe</p>
                <p className="text-xs">Integrierte Betriebssoftware fuer die DACH-Region</p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Haftungsausschluss</p>
            <p className="text-xs">
              Die Inhalte dieses Portals wurden mit groesstmoeglicher Sorgfalt erstellt. Fuer die Richtigkeit, Vollstaendigkeit und Aktualitaet der Inhalte koennen wir jedoch keine Gewaehr uebernehmen. Die Nutzung der Inhalte erfolgt auf eigene Gefahr.
            </p>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Urheberrecht</p>
            <p className="text-xs">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen der schriftlichen Zustimmung des jeweiligen Autors.
            </p>
          </div>

          <p className="text-xs pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
            Stand: Maerz 2026 · Conser Gosch UG (haftungsbeschraenkt)
          </p>
        </div>

        <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition" style={{ background: 'var(--brand)' }}>
            Schliessen
          </button>
        </div>
      </div>
    </div>
  )
}
