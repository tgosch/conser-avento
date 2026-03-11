export default function Team() {
  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Gründer & Team</h1>
        <p className="text-secondary text-sm mt-1">Die Menschen hinter Avento & Conser</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Torben Gosch */}
        <div className="bg-surface rounded-card border border-black/5 shadow-sm2 p-7 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4" style={{ background: '#063D3E' }}>
            TG
          </div>
          <span className="label-tag px-3 py-1 rounded-full mb-3 text-xs" style={{ background: 'rgba(6,61,62,0.10)', color: '#063D3E' }}>
            Gründer
          </span>
          <h3 className="font-bold text-text text-lg">Torben Gosch</h3>
          <p className="text-accent1 text-sm font-semibold mt-0.5">CEO · Chief Executive Officer</p>
          <p className="text-secondary text-sm mt-3 leading-relaxed">
            Gründer und Geschäftsführer. Verantwortet Strategie, Partnerschaften und Investorenbeziehungen.
          </p>
        </div>

        {/* Martin Groote */}
        <div className="bg-surface rounded-card border border-black/5 shadow-sm2 p-7 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4" style={{ background: '#D4662A' }}>
            MG
          </div>
          <span className="label-tag px-3 py-1 rounded-full mb-3 text-xs" style={{ background: 'rgba(212,102,42,0.12)', color: '#D4662A' }}>
            Mitgründer
          </span>
          <h3 className="font-bold text-text text-lg">Martin Groote</h3>
          <p className="text-accent1 text-sm font-semibold mt-0.5">CTO · Chief Technology Officer</p>
          <p className="text-secondary text-sm mt-3 leading-relaxed">
            Technologieleiter und Mitgründer. Verantwortet Produktentwicklung und technische Innovation.
          </p>
        </div>

        {/* Code Ara GmbH */}
        <div className="bg-surface rounded-card border border-black/5 shadow-sm2 p-7 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4" style={{ background: '#2d6a4f' }}>
            CA
          </div>
          <span className="label-tag px-3 py-1 rounded-full mb-3 text-xs" style={{ background: 'rgba(212,102,42,0.12)', color: '#D4662A' }}>
            10% Anteile · Extern
          </span>
          <h3 className="font-bold text-text text-lg">Code Ara GmbH</h3>
          <p className="text-accent1 text-sm font-semibold mt-0.5">Externer Entwicklungspartner</p>
          <p className="text-secondary text-sm mt-3 leading-relaxed">
            Strategischer Technologiepartner mit 10% Unternehmensanteilen.
          </p>
        </div>
      </div>

      {/* Internal employees */}
      <div className="bg-surface rounded-card border border-black/5 shadow-sm2 p-7">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[16px] bg-surface2 flex items-center justify-center text-2xl shrink-0">
            👷
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="font-bold text-text text-lg">Interne Mitarbeiter</h3>
              <span className="label-tag px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(6,61,62,0.10)', color: '#063D3E' }}>
                Intern
              </span>
            </div>
            <p className="text-secondary text-sm font-medium">3 weitere interne Teammitglieder</p>
            <p className="text-secondary text-sm mt-1 leading-relaxed">
              Engagiertes Kernteam für operatives Wachstum und Vertrieb in den Bereichen Marketing, Vertrieb und Kundenbetreuung.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
