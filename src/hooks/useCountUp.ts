import { useState, useEffect, useRef } from 'react'

interface Options {
  duration?: number    // ms, default 1400
  decimals?: number    // default 0
  prefix?: string      // z.B. "€"
  suffix?: string      // z.B. "k"
  startOnMount?: boolean
}

export function useCountUp(target: number, options: Options = {}) {
  const {
    duration = 1400,
    decimals = 0,
    prefix = '',
    suffix = '',
    startOnMount = true,
  } = options

  const [display, setDisplay] = useState(startOnMount ? 0 : target)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!startOnMount || target === 0) {
      setDisplay(target)
      return
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target

      if (progress < 1) {
        setDisplay(parseFloat(current.toFixed(decimals + 1)))
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(target)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startTimeRef.current = null
    }
  }, [target, duration, decimals, startOnMount])

  const formatted = `${prefix}${
    decimals > 0
      ? display.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.floor(display).toLocaleString('de-DE')
  }${suffix}`

  return { value: display, formatted }
}
