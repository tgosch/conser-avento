import { X } from 'lucide-react'

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

          <div>
            <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Angaben gem. § 5 TMG</p>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Conser Gosch UG (haftungsbeschränkt)</p>
            <p>Geschäftsführer: Torben Gosch</p>
            <p>Amtsgericht Lübeck · HRB 22177</p>
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
                <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Conser – Marktplatz für Handwerker</p>
                <p className="text-xs">Digitaler B2B-Marktplatz für die Baubranche</p>
              </div>
              <div className="px-3 py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Avento – ERP für Handwerksbetriebe</p>
                <p className="text-xs">Integrierte Betriebssoftware für die DACH-Region</p>
              </div>
            </div>
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
            Stand: März 2026 · Conser Gosch UG (haftungsbeschränkt)
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
