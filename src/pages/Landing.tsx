import { useState } from 'react'
import RegisterModal from '../components/RegisterModal'
import LoginModal from '../components/LoginModal'
import { ArrowRight, Shield, TrendingUp, Users } from 'lucide-react'
import aventoLogo from '../assets/avento_kachel.svg'
import conserLogo from '../assets/conser_kachel.svg'

export default function Landing() {
  const [modal, setModal] = useState<'register' | 'login' | null>(null)

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, #063D3E 0%, transparent 65%)', transform: 'translate(40%, -40%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #D4662A 0%, transparent 65%)', transform: 'translate(-35%, 35%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">

        {/* Pill badge */}
        <div className="fade-up fade-up-1 inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-1.5 mb-8 border border-black/8 shadow-sm2">
          <span className="w-2 h-2 rounded-full bg-accent1 animate-pulse" />
          <span className="label-tag text-accent1">Exklusives Investoren-Portal</span>
        </div>

        {/* Logos */}
        <div className="fade-up fade-up-1 flex gap-4 mb-8">
          <div className="overflow-hidden transition-transform hover:-translate-y-1 duration-200" style={{ borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
            <img src={aventoLogo} alt="Avento Software" className="object-cover" style={{ height: '80px', width: 'auto', minWidth: '140px' }} />
          </div>
          <div className="overflow-hidden transition-transform hover:-translate-y-1 duration-200" style={{ borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
            <img src={conserLogo} alt="Conser Market" className="object-cover" style={{ height: '80px', width: 'auto', minWidth: '140px' }} />
          </div>
        </div>

        {/* Headline */}
        <h1 className="fade-up fade-up-2 text-5xl md:text-6xl font-bold text-text leading-[1.1] tracking-tight mb-4">
          Exklusives
          <br />
          <span style={{ color: '#063D3E' }}>Investoren-Portal</span>
        </h1>

        {/* Subline */}
        <p className="fade-up fade-up-3 text-secondary text-lg md:text-xl leading-relaxed max-w-lg mb-10">
          Avento Software & Conser Market –<br />
          Zwei starke Marken, eine Vision
        </p>

        {/* CTAs */}
        <div className="fade-up fade-up-4 flex flex-col sm:flex-row gap-3 mb-14">
          <button
            onClick={() => setModal('register')}
            className="flex items-center gap-2 justify-center text-white rounded-btn px-7 py-3.5 font-semibold text-sm hover:opacity-90 transition shadow-sm2"
            style={{ background: '#063D3E' }}
          >
            Zugang beantragen <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setModal('login')}
            className="flex items-center gap-2 justify-center bg-white border border-black/10 text-text rounded-btn px-7 py-3.5 font-semibold text-sm hover:bg-surface2 transition shadow-sm2"
          >
            Einloggen
          </button>
        </div>

        {/* Trust row */}
        <div className="fade-up fade-up-5 grid grid-cols-3 gap-4 w-full max-w-lg">
          {[
            { icon: Shield, label: 'DSGVO-konform', sub: 'SSL-verschlüsselt' },
            { icon: TrendingUp, label: '€5K – €50K+', sub: 'Investitionsvolumen' },
            { icon: Users, label: 'Exklusiv', sub: 'Nur auf Einladung' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-white/70 rounded-card p-4 border border-black/5 text-center">
              <Icon size={20} className="text-accent1 mx-auto mb-2" />
              <p className="text-text font-semibold text-xs">{label}</p>
              <p className="text-secondary text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {modal === 'register' && (
        <RegisterModal onClose={() => setModal(null)} onSwitchToLogin={() => setModal('login')} />
      )}
      {modal === 'login' && (
        <LoginModal onClose={() => setModal(null)} onSwitchToRegister={() => setModal('register')} />
      )}
    </div>
  )
}
