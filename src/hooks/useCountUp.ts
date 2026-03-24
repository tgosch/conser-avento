import { useState, useEffect, useRef, useCallback } from 'react'

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
  const [running, setRunning] = useState(false)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (running) return
    setRunning(true)
    let current = 0
    const steps = Math.ceil(duration / 16)
    const increment = target / steps
    ref.current = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplay(target)
        setRunning(false)
        if (ref.current) clearInterval(ref.current)
      } else {
        setDisplay(parseFloat(current.toFixed(decimals + 1)))
      }
    }, 16)
  }, [target, duration, decimals, running])

  useEffect(() => {
    if (startOnMount) {
      // Defer to next tick to avoid sync setState in effect
      const id = requestAnimationFrame(() => start())
      return () => {
        cancelAnimationFrame(id)
        if (ref.current) clearInterval(ref.current)
      }
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [target, startOnMount, start])

  const formatted = `${prefix}${
    decimals > 0
      ? display.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.floor(display).toLocaleString('de-DE')
  }${suffix}`

  return { value: display, formatted, start }
}
