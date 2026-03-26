import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function NdaModal({ onClose }: { onClose: () => void }) {
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
        role="dialog" aria-modal="true" aria-labelledby="nda-modal-title"
        className="w-full max-w-xl rounded-[24px] flex flex-col border outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', maxHeight: '80vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <h2 id="nda-modal-title" className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Geheimhaltungsvereinbarung (NDA)</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70 transition" style={{ color: 'var(--text-secondary)' }} aria-label="Schließen"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto p-6 text-sm leading-relaxed space-y-4" style={{ color: 'var(--text-secondary)' }}>
          <p className="font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
            zwischen<br />
            <span className="text-accent">Avento Software &amp; Conser Market</span> (nachfolgend „Unternehmen")<br />
            und dem registrierten Interessenten (nachfolgend „Empfänger")
          </p>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>§1 Gegenstand</p>
            <p>Diese Vereinbarung regelt den vertraulichen Umgang mit allen Informationen, die dem Empfänger im Rahmen des Investoren-Portals zugänglich gemacht werden. Dies umfasst insbesondere: Pitch-Deck, Business-Plan, Finanzplan, Umsatzprognosen, Kundendaten, technische Konzepte und strategische Planungen.</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>§2 Vertraulichkeitspflicht</p>
            <p>Der Empfänger verpflichtet sich:</p>
            <ul className="mt-1 space-y-1 pl-4">
              <li>a) Alle erhaltenen Informationen streng vertraulich zu behandeln</li>
              <li>b) Diese nicht an Dritte weiterzugeben, zu veröffentlichen oder anderweitig zu verwenden</li>
              <li>c) Die Informationen ausschließlich zur Prüfung einer möglichen Investition zu nutzen</li>
              <li>d) Angemessene Schutzmaßnahmen zum Schutz der Informationen zu ergreifen</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>§3 Ausnahmen</p>
            <p>Die Vertraulichkeitspflicht gilt nicht für Informationen, die:</p>
            <ul className="mt-1 space-y-1 pl-4">
              <li>a) Bereits öffentlich bekannt sind</li>
              <li>b) Dem Empfänger nachweislich bereits vor Erhalt bekannt waren</li>
              <li>c) Aufgrund gesetzlicher Pflichten offenbart werden müssen</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>§4 Laufzeit</p>
            <p>Diese Vereinbarung gilt für einen Zeitraum von 3 Jahren ab Registrierung sowie unbegrenzt für Informationen, die als Geschäftsgeheimnisse eingestuft sind.</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>§5 Vertragsstrafe</p>
            <p>Bei schuldhafter Verletzung dieser Vereinbarung ist der Empfänger verpflichtet, eine Vertragsstrafe in Höhe von <strong>€50.000</strong> je Verstoß zu zahlen, unbeschadet weitergehender Schadensersatzansprüche.</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>§6 Anwendbares Recht</p>
            <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist der Sitz des Unternehmens.</p>
          </div>
          <p className="text-xs pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
            Durch Akzeptanz bei der Registrierung bestätigt der Empfänger, diese Vereinbarung gelesen, verstanden und akzeptiert zu haben. Datum und Zeitstempel der Akzeptanz werden gespeichert.
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
