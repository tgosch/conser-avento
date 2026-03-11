import { ExternalLink } from 'lucide-react'

const links = [
  {
    icon: '🌐',
    label: 'Conser Website',
    desc: 'Besuchen Sie unsere Hauptwebseite für Conser Market',
    url: 'https://www.conser-gosch.de',
    color: 'accent1',
    span: false,
  },
  {
    icon: '🌐',
    label: 'Avento Website',
    desc: 'Besuchen Sie unsere Hauptwebseite für Avento Software',
    url: 'https://www.avento-gosch.de',
    color: 'accent1',
    span: false,
  },
  {
    icon: '📸',
    label: 'Instagram',
    desc: 'Folgen Sie uns auf Instagram für aktuelle Updates',
    url: 'https://www.instagram.com',
    color: 'accent2',
    span: false,
  },
  {
    icon: '🎵',
    label: 'TikTok',
    desc: 'Entdecken Sie unsere TikTok-Inhalte',
    url: 'https://www.tiktok.com',
    color: 'accent2',
    span: false,
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    desc: 'Vernetzen Sie sich mit uns auf LinkedIn',
    url: 'https://www.linkedin.com',
    color: 'accent1',
    span: true,
  },
]

export default function Links() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">Verknüpfungen</h1>
        <p className="text-gray-400 mt-1 text-sm">Alle wichtigen Links und Social-Media-Profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-white rounded-card shadow-card p-6 flex items-center gap-5 hover:shadow-lg transition-shadow group ${link.span ? 'md:col-span-2' : ''}`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                link.color === 'accent1' ? 'bg-accent1/10' : 'bg-accent2/10'
              }`}
            >
              {link.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text text-lg group-hover:text-accent1 transition-colors">{link.label}</h3>
              <p className="text-gray-400 text-sm mt-0.5">{link.desc}</p>
              <p className="text-xs text-gray-300 mt-1 truncate">{link.url}</p>
            </div>
            <ExternalLink size={18} className="text-gray-300 group-hover:text-accent1 transition-colors shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
