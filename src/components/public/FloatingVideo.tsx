import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'

export default function FloatingVideo() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [muted, setMuted] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Show after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [dismissed])

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
    if (videoRef.current) videoRef.current.pause()
  }

  const toggleMute = () => {
    setMuted(!muted)
    if (videoRef.current) videoRef.current.muted = !muted
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="fixed z-50"
          style={{
            bottom: expanded ? '50%' : 24,
            right: expanded ? '50%' : 24,
            transform: expanded ? 'translate(50%, 50%)' : undefined,
            width: expanded ? 'min(90vw, 640px)' : 'min(320px, calc(100vw - 48px))',
          }}
        >
          {/* Backdrop for expanded */}
          {expanded && (
            <div className="fixed inset-0 bg-black/60 -z-10" onClick={toggleExpand} />
          )}

          <div className="rounded-2xl overflow-hidden relative"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
            {/* Video */}
            <video
              ref={videoRef}
              src="/werbe.video.1.MOV"
              autoPlay
              loop
              muted={muted}
              playsInline
              className="w-full block"
              style={{ aspectRatio: '9/16', maxHeight: expanded ? '80vh' : '400px', objectFit: 'cover' }}
            />

            {/* Controls overlay */}
            <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}>
              <p className="text-[10px] font-medium text-white/70">Conser & Avento</p>
              <div className="flex items-center gap-1.5">
                <button onClick={toggleMute}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  {muted ? <VolumeX size={12} color="white" /> : <Volume2 size={12} color="white" />}
                </button>
                <button onClick={toggleExpand}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/20 hidden sm:flex"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  {expanded ? <Minimize2 size={12} color="white" /> : <Maximize2 size={12} color="white" />}
                </button>
                <button onClick={handleDismiss}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/20"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <X size={12} color="white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
