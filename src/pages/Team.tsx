export default function Team() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Gründer & Team</h1>
        <p className="text-gray-400 mt-1 text-sm">Das Team hinter Avento & Conser</p>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Torben Gosch */}
        <div className="bg-white rounded-card shadow-card p-7 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-accent1 flex items-center justify-center text-white font-bold text-xl mb-4">
            TG
          </div>
          <span className="bg-accent1/10 text-accent1 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Gründer
          </span>
          <h3 className="font-bold text-text text-lg">Torben Gosch</h3>
          <p className="text-accent1 text-sm font-medium mt-0.5">CEO · Chief Executive Officer</p>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Gründer und Geschäftsführer. Verantwortet Strategie, Partnerschaften und Investorenbeziehungen.
          </p>
        </div>

        {/* Martin Groote */}
        <div className="bg-white rounded-card shadow-card p-7 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4" style={{ background: '#E5844E' }}>
            MG
          </div>
          <span className="bg-accent2/10 text-accent2 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Mitgründer
          </span>
          <h3 className="font-bold text-text text-lg">Martin Groote</h3>
          <p className="text-accent1 text-sm font-medium mt-0.5">CTO · Chief Technology Officer</p>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Technologieleiter und Mitgründer. Verantwortet Produktentwicklung und technische Innovation.
          </p>
        </div>

        {/* Code Ara GmbH */}
        <div className="bg-white rounded-card shadow-card p-7 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4" style={{ background: '#2d6a4f' }}>
            CA
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(229,132,78,0.12)', color: '#E5844E' }}>
            10% Anteile · Extern
          </span>
          <h3 className="font-bold text-text text-lg">Code Ara GmbH</h3>
          <p className="text-accent1 text-sm font-medium mt-0.5">Externer Entwicklungspartner</p>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Strategischer Technologiepartner mit 10% Unternehmensanteilen. Experten für skalierbare Softwarelösungen.
          </p>
        </div>
      </div>

      {/* Full width – Internal employees */}
      <div className="bg-white rounded-card shadow-card p-7">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-bg flex items-center justify-center text-3xl shrink-0">
            👷
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-text text-lg">Interne Mitarbeiter</h3>
              <span className="bg-accent1/10 text-accent1 text-xs font-semibold px-3 py-1 rounded-full">
                Intern
              </span>
            </div>
            <p className="text-gray-400 text-sm font-medium">3 weitere interne Teammitglieder</p>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Engagiertes Kernteam für operatives Wachstum und Vertrieb. Dedizierte Spezialisten in den Bereichen Marketing, Vertrieb und Kundenbetreuung.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
