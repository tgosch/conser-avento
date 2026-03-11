import { ExternalLink } from 'lucide-react'

const links = [
  { icon: '🌐', label: 'Conser Website',  desc: 'Hauptwebseite für Conser Market',         url: 'https://www.conser-gosch.de',  accent: '#063D3E', span: false },
  { icon: '🌐', label: 'Avento Website',  desc: 'Hauptwebseite für Avento Software',       url: 'https://www.avento-gosch.de', accent: '#063D3E', span: false },
  { icon: '📸', label: 'Instagram',        desc: 'Folgen Sie uns für aktuelle Updates',     url: 'https://www.instagram.com',   accent: '#D4662A', span: false },
  { icon: '🎵', label: 'TikTok',           desc: 'Entdecken Sie unsere TikTok-Inhalte',    url: 'https://www.tiktok.com',      accent: '#D4662A', span: false },
  { icon: '💼', label: 'LinkedIn',         desc: 'Vernetzen Sie sich mit dem Gründerteam', url: 'https://www.linkedin.com',    accent: '#063D3E', span: true  },
]

export default function Links() {
  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Verknüpfungen</h1>
        <p className="text-secondary text-sm mt-1">Alle wichtigen Links und Social-Media-Profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-surface rounded-card border border-black/5 shadow-sm2 p-6 flex items-center gap-5 hover:shadow-card transition-shadow group ${link.span ? 'md:col-span-2' : ''}`}
            style={{ transition: 'all 0.2s' }}
          >
            <div
              className="w-14 h-14 rounded-[16px] flex items-center justify-center text-2xl shrink-0"
              style={{ background: `${link.accent}15` }}
            >
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-text text-base group-hover:text-accent1 transition">{link.label}</h3>
              <p className="text-secondary text-sm mt-0.5">{link.desc}</p>
              <p className="text-secondary/40 text-xs mt-1 truncate">{link.url}</p>
            </div>
            <ExternalLink size={17} className="text-secondary/30 group-hover:text-accent1 transition shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
