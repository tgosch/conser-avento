import { X } from 'lucide-react'

/**
 * TODO: Impressum-Texte müssen von einem Rechtsanwalt geprüft und freigegeben werden.
 * Stand 2025: Platzhalter-Angaben — vor Go-Live durch rechtsichere Version ersetzen.
 * Pflichtangaben gem. § 5 TMG für Deutschland.
 */
export default function ImpressumModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-xl rounded-[24px] flex flex-col border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', maxHeight: '80vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Impressum</h2>
          <button onClick={onClose} className="hover:opacity-70 transition" style={{ color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 text-sm leading-relaxed space-y-5" style={{ color: 'var(--text-secondary)' }}>

          {/* TODO-Banner */}
          <div className="px-4 py-3 rounded-xl text-xs font-medium"
            style={{ background: 'rgba(212,102,42,0.10)', color: '#D4662A', border: '1px solid rgba(212,102,42,0.25)' }}>
            ⚠️ TODO: Dieses Impressum ist ein Platzhalter und muss vor dem Live-Betrieb von einem Rechtsanwalt geprüft werden. Alle Angaben gem. § 5 TMG vollständig eintragen.
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Angaben gem. § 5 TMG</p>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Bautech Holding</p>
            <p>vertreten durch: Torben Gosch (CEO)</p>
            <p>Anschrift: [TODO: Straße, PLZ, Ort eintragen]</p>
            <p>Deutschland</p>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Kontakt</p>
            <p>E-Mail: <a href="mailto:torben@conser-avento.de" className="text-accent underline">torben@conser-avento.de</a></p>
            <p>Web: <a href="https://www.conser-avento.de" target="_blank" rel="noopener noreferrer" className="text-accent underline">www.conser-avento.de</a></p>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Gesellschaften</p>
            <div className="space-y-2">
              <div className="px-3 py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Conser GmbH</p>
                <p className="text-xs">Status: Gegründet · Amtsgericht: [TODO] · HRB: [TODO]</p>
              </div>
              <div className="px-3 py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Avento GmbH</p>
                <p className="text-xs">Status: In Gründung · Handelsregisternummer: [TODO nach Gründung]</p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Entwicklung</p>
            <p>Technische Umsetzung: Code Ara GmbH</p>
            <p>Web: <a href="https://codeara.de" target="_blank" rel="noopener noreferrer" className="text-accent underline">codeara.de</a></p>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Haftungsausschluss</p>
            <p className="text-xs">
              Die Inhalte dieses Portals wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Die Nutzung der Inhalte erfolgt auf eigene Gefahr.
            </p>
          </div>

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Urheberrecht</p>
            <p className="text-xs">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors.
            </p>
          </div>

          <p className="text-xs pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
            Stand: 2025 · www.conser-avento.de
          </p>
        </div>

        <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition" style={{ background: '#063D3E' }}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  )
}
