import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'

/* ═══════════════════════════════════════════════════════════════
   REMOTION COMPOSITIONS — Premium Inline Visuals
═══════════════════════════════════════════════════════════════ */

// ── Orbital Ring System (Hero) ────────────────────────────────
export function OrbitalSystem() {
  const frame = useCurrentFrame()

  const rings = [
    { r: 120, speed: 0.008, dots: 6, color: '#063D3E' },
    { r: 180, speed: -0.005, dots: 8, color: '#C8611A' },
    { r: 240, speed: 0.003, dots: 4, color: '#063D3E' },
  ]

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
      {/* Center node */}
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: 'linear-gradient(135deg, #063D3E, #0A5557)',
        boxShadow: '0 0 40px rgba(6,61,62,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${spring({ frame, fps: 30, config: { damping: 15 } })})`,
      }}>
        <span style={{ color: 'white', fontSize: 20, fontWeight: 700, fontFamily: 'Geist, sans-serif' }}>A</span>
      </div>

      {/* Rings */}
      {rings.map((ring, ri) => {
        const opacity = interpolate(frame, [ri * 10, ri * 10 + 20], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
        return (
          <div key={ri} style={{
            position: 'absolute', width: ring.r * 2, height: ring.r * 2,
            border: `1px solid rgba(${ring.color === '#063D3E' ? '6,61,62' : '200,97,26'},${0.12})`,
            borderRadius: '50%', opacity,
          }}>
            {Array.from({ length: ring.dots }).map((_, di) => {
              const angle = (di / ring.dots) * Math.PI * 2 + frame * ring.speed
              const x = Math.cos(angle) * ring.r + ring.r
              const y = Math.sin(angle) * ring.r + ring.r
              const dotSize = di === 0 ? 8 : 4
              return (
                <div key={di} style={{
                  position: 'absolute', left: x - dotSize / 2, top: y - dotSize / 2,
                  width: dotSize, height: dotSize, borderRadius: '50%',
                  background: ring.color,
                  boxShadow: `0 0 ${dotSize * 2}px ${ring.color}60`,
                  opacity: 0.7 + Math.sin(frame * 0.05 + di) * 0.3,
                }} />
              )
            })}
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

// ── Data Flow Visualization ───────────────────────────────────
export function DataFlow() {
  const frame = useCurrentFrame()

  const lanes = [
    { y: 25, label: 'Kalkulation', color: '#063D3E' },
    { y: 40, label: 'Material', color: '#C8611A' },
    { y: 55, label: 'Rechnung', color: '#063D3E' },
    { y: 70, label: 'Lieferung', color: '#C8611A' },
  ]

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {lanes.map((lane, li) => {
        const delay = li * 12
        const lineProgress = interpolate(frame, [delay, delay + 40], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.cubic) })
        const labelOpacity = interpolate(frame, [delay + 15, delay + 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })

        return (
          <div key={li}>
            {/* Lane line */}
            <div style={{
              position: 'absolute', left: '8%', top: `${lane.y}%`,
              width: `${lineProgress * 0.84}%`, height: 1,
              background: `linear-gradient(90deg, ${lane.color}40, ${lane.color})`,
            }} />
            {/* Pulse dot */}
            {lineProgress > 50 && (
              <div style={{
                position: 'absolute',
                left: `${8 + lineProgress * 0.84 * ((frame - delay) % 60) / 60}%`,
                top: `${lane.y}%`,
                width: 6, height: 6, borderRadius: '50%',
                background: lane.color,
                boxShadow: `0 0 10px ${lane.color}`,
                transform: 'translate(-50%, -50%)',
              }} />
            )}
            {/* Label */}
            <div style={{
              position: 'absolute', left: '8%', top: `${lane.y - 5}%`,
              opacity: labelOpacity,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 600, color: lane.color,
                fontFamily: 'Geist, sans-serif', letterSpacing: 1, textTransform: 'uppercase',
              }}>
                {lane.label}
              </span>
            </div>
            {/* End node */}
            <div style={{
              position: 'absolute', right: '6%', top: `${lane.y}%`,
              width: 10, height: 10, borderRadius: '50%',
              border: `2px solid ${lane.color}`,
              background: lineProgress > 90 ? lane.color : 'transparent',
              transform: 'translate(50%, -50%)',
              transition: 'background 0.3s',
              opacity: labelOpacity,
            }} />
          </div>
        )
      })}
      {/* Left node */}
      <div style={{
        position: 'absolute', left: '2%', top: '47.5%', transform: 'translateY(-50%)',
        padding: '6px 14px', borderRadius: 8,
        background: '#063D3E', color: 'white',
        fontSize: 10, fontWeight: 700, fontFamily: 'Geist, sans-serif',
        opacity: spring({ frame, fps: 30, config: { damping: 14 } }),
      }}>
        Avento
      </div>
      {/* Right node */}
      <div style={{
        position: 'absolute', right: '1%', top: '47.5%', transform: 'translateY(-50%)',
        padding: '6px 14px', borderRadius: 8,
        background: '#C8611A', color: 'white',
        fontSize: 10, fontWeight: 700, fontFamily: 'Geist, sans-serif',
        opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
      }}>
        Conser
      </div>
    </AbsoluteFill>
  )
}

// ── Metric Rings ──────────────────────────────────────────────
export function MetricRing({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const frame = useCurrentFrame()
  const progress = interpolate(frame, [0, 70], [0, value / max], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  const currentVal = Math.round(value * Math.min(1, interpolate(frame, [0, 70], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })))
  const r = 90
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - progress)

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
      <svg width={220} height={220} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={110} cy={110} r={r} fill="none" stroke={`${color}15`} strokeWidth={6} />
        <circle cx={110} cy={110} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{
          fontSize: 36, fontWeight: 700, color,
          fontFamily: "'Geist Mono', monospace",
        }}>
          {currentVal.toLocaleString('de-DE')}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 500, color: '#8A8A85',
          fontFamily: 'Geist, sans-serif', marginTop: 2,
        }}>
          {label}
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ── Gewerke Wheel ─────────────────────────────────────────────
export function GewerkeWheel({ items }: { items: string[] }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
      {/* Center */}
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: 'linear-gradient(135deg, #063D3E, #0A5557)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 30px rgba(6,61,62,0.2)',
        zIndex: 10,
        transform: `scale(${spring({ frame, fps, config: { damping: 12 } })})`,
      }}>
        <span style={{ color: 'white', fontSize: 10, fontWeight: 700, fontFamily: 'Geist, sans-serif' }}>14+</span>
      </div>

      {items.map((item, i) => {
        const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.002
        const r = 130
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        const delay = i * 3
        const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 100 } })

        return (
          <div key={i} style={{
            position: 'absolute',
            transform: `translate(${x}px, ${y}px) scale(${s})`,
          }}>
            <div style={{
              padding: '5px 12px', borderRadius: 20,
              background: i % 2 === 0 ? '#063D3E' : '#C8611A',
              color: 'white', fontSize: 9, fontWeight: 600,
              fontFamily: 'Geist, sans-serif', whiteSpace: 'nowrap',
              boxShadow: `0 2px 8px ${i % 2 === 0 ? 'rgba(6,61,62,0.3)' : 'rgba(200,97,26,0.3)'}`,
            }}>
              {item}
            </div>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

// ── Feature Grid Animation ────────────────────────────────────
export function FeatureGrid({ features, accentColor }: { features: string[]; accentColor: string }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const cols = 2
  const cellW = 160
  const cellH = 44
  const gap = 8

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap, width: cols * cellW + gap, justifyContent: 'center' }}>
        {features.map((f, i) => {
          const delay = i * 5
          const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 120 } })
          const active = (Math.floor(frame / 40) % features.length) === i

          return (
            <div key={i} style={{
              width: cellW, height: cellH,
              borderRadius: 10,
              background: active ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${active ? accentColor + '40' : 'rgba(255,255,255,0.06)'}`,
              display: 'flex', alignItems: 'center', paddingLeft: 14,
              transform: `scale(${s})`,
              transition: 'background 0.3s, border-color 0.3s',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: active ? accentColor : 'rgba(255,255,255,0.15)',
                marginRight: 10,
                boxShadow: active ? `0 0 8px ${accentColor}` : 'none',
              }} />
              <span style={{
                fontSize: 10, fontWeight: 600, color: active ? accentColor : 'rgba(255,255,255,0.4)',
                fontFamily: 'Geist, sans-serif',
              }}>
                {f}
              </span>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
