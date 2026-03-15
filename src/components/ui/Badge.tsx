// Einheitliche Status-Badges für Partner, Updates, Chat etc.

interface Props {
  label: string
  color: string       // Text + Border Farbe
  bg?: string         // Background — auto wenn nicht angegeben
  dot?: boolean       // Kleiner Dot links
  size?: 'sm' | 'md'
}

export function Badge({ label, color, bg, dot = false, size = 'sm' }: Props) {
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'
  const fontSize = size === 'sm' ? 'text-[11px]' : 'text-xs'
  const background = bg ?? `${color}18`

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${padding} rounded-full font-semibold ${fontSize} whitespace-nowrap`}
      style={{ background, color }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 pulse-dot"
          style={{ background: color }}
        />
      )}
      {label}
    </span>
  )
}
