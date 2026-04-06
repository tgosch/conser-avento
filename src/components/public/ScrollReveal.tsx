import { motion, type Variant } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  className?: string
  once?: boolean
}

const offsets: Record<string, { x?: number; y?: number }> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.7,
  className = '',
  once = true,
}: Props) {
  const offset = offsets[direction]

  const hidden: Variant = { opacity: 0, ...offset }
  const visible: Variant = { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      initial={hidden}
      whileInView={visible}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
