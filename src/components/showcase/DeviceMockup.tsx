/**
 * CSS-only Device Mockups — iPhone & Laptop frames
 * Replace placeholder gradients with real screenshots via the `src` prop
 */

interface PhoneProps {
  src?: string
  alt?: string
  label?: string
  sublabel?: string
  gradient?: string
  placeholderIcon?: string
  placeholderText?: string
}

export function PhoneMockup({
  src, alt = 'App Screenshot', label, sublabel,
  gradient = 'linear-gradient(145deg, #063D3E 0%, #0A5C5E 40%, #0E7A7D 100%)',
  placeholderIcon = '📱', placeholderText = 'App Preview',
}: PhoneProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Phone Frame */}
      <div className="relative" style={{ width: 200, height: 410 }}>
        {/* Outer shell */}
        <div className="absolute inset-0 rounded-[36px]"
          style={{ background: '#1A1A1A', boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' }} />
        {/* Side button */}
        <div className="absolute -right-[2px] top-[90px] w-[3px] h-[30px] rounded-r-sm" style={{ background: '#2A2A2A' }} />
        <div className="absolute -left-[2px] top-[80px] w-[3px] h-[20px] rounded-l-sm" style={{ background: '#2A2A2A' }} />
        <div className="absolute -left-[2px] top-[110px] w-[3px] h-[35px] rounded-l-sm" style={{ background: '#2A2A2A' }} />
        <div className="absolute -left-[2px] top-[155px] w-[3px] h-[35px] rounded-l-sm" style={{ background: '#2A2A2A' }} />
        {/* Screen */}
        <div className="absolute inset-[4px] rounded-[32px] overflow-hidden" style={{ background: '#000' }}>
          {/* Dynamic Island */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[28px] rounded-full z-10" style={{ background: '#000' }} />
          {/* Screen content */}
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 pt-8"
              style={{ background: gradient }}>
              <span className="text-3xl">{placeholderIcon}</span>
              <span className="text-xs font-semibold text-white/60">{placeholderText}</span>
            </div>
          )}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
      </div>
      {/* Label */}
      {label && (
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
          {sublabel && <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sublabel}</p>}
        </div>
      )}
    </div>
  )
}

interface LaptopProps {
  src?: string
  alt?: string
  label?: string
  sublabel?: string
  gradient?: string
  placeholderIcon?: string
  placeholderText?: string
}

export function LaptopMockup({
  src, alt = 'Desktop Screenshot', label, sublabel,
  gradient = 'linear-gradient(145deg, #0C1222 0%, #162032 40%, #1E2D48 100%)',
  placeholderIcon = '💻', placeholderText = 'Desktop Preview',
}: LaptopProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Laptop Frame */}
      <div className="relative w-full" style={{ maxWidth: 480 }}>
        {/* Screen bezel */}
        <div className="relative rounded-t-xl overflow-hidden"
          style={{ background: '#1A1A1A', padding: '8px 8px 0', boxShadow: '0 -2px 20px rgba(0,0,0,0.15)' }}>
          {/* Camera dot */}
          <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full" style={{ background: '#333' }} />
          {/* Screen */}
          <div className="rounded-t-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
            {src ? (
              <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ background: gradient }}>
                {/* Fake browser chrome */}
                <div className="absolute top-[12px] left-[12px] right-[12px] flex items-center gap-1.5 px-3 py-1.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex gap-1">
                    <div className="w-[7px] h-[7px] rounded-full" style={{ background: '#FF5F57' }} />
                    <div className="w-[7px] h-[7px] rounded-full" style={{ background: '#FFBD2E' }} />
                    <div className="w-[7px] h-[7px] rounded-full" style={{ background: '#27C93F' }} />
                  </div>
                  <div className="flex-1 h-[14px] rounded-sm mx-6" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
                <span className="text-3xl mt-4">{placeholderIcon}</span>
                <span className="text-xs font-semibold text-white/50">{placeholderText}</span>
              </div>
            )}
          </div>
        </div>
        {/* Keyboard base */}
        <div className="h-[14px] rounded-b-lg mx-[-2px]"
          style={{
            background: 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
          <div className="mx-auto h-[3px] rounded-b-sm" style={{ width: '25%', background: '#333' }} />
        </div>
      </div>
      {/* Label */}
      {label && (
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
          {sublabel && <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sublabel}</p>}
        </div>
      )}
    </div>
  )
}

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  accent?: string
}

export function FeatureCard({ icon, title, description, accent = 'var(--brand)' }: FeatureCardProps) {
  return (
    <div className="card p-5 group hover:translate-y-[-2px] transition-all duration-300"
      style={{ borderBottom: `2px solid ${accent}` }}>
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${accent}12`, fontSize: 20 }}>
        {icon}
      </div>
      <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  )
}

interface StatProps {
  value: string
  label: string
  sublabel?: string
  accent?: string
}

export function StatCard({ value, label, sublabel, accent = 'var(--brand)' }: StatProps) {
  return (
    <div className="card p-5 text-center group hover:translate-y-[-2px] transition-all duration-300">
      <p className="text-metric-lg mb-1 transition-transform duration-300 group-hover:scale-105" style={{ color: accent }}>{value}</p>
      <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {sublabel && <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sublabel}</p>}
    </div>
  )
}
