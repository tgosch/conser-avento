import { useState } from 'react'
import { ArrowRight, Shield, TrendingUp, Users } from 'lucide-react'
import RegisterModal from '../components/auth/RegisterModal'
import LoginModal from '../components/auth/LoginModal'
import aventoLogo from '../assets/avento_kachel.png'
import conserLogo from '../assets/conser_kachel.png'

export default function Landing() {
  const [modal, setModal] = useState<'register' | 'login' | null>(null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, #063D3E 0%, transparent 65%)', transform: 'translate(40%, -40%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #D4662A 0%, transparent 65%)', transform: 'translate(-35%, 35%)' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
        <div className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <span className="w-2 h-2 rounded-full bg-accent1 animate-pulse" />
          <span className="label-tag text-accent1">Exklusives Investoren-Portal</span>
        </div>

        <div className="fade-up fade-up-1 flex gap-4 mb-8">
          <div className="overflow-hidden hover:-translate-y-1 transition-transform duration-200" style={{ borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <img src={aventoLogo} alt="Avento Software" className="object-cover" style={{ height: '80px', width: 'auto', minWidth: '140px' }} />
          </div>
          <div className="overflow-hidden hover:-translate-y-1 transition-transform duration-200" style={{ borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <img src={conserLogo} alt="Conser Market" className="object-cover" style={{ height: '80px', width: 'auto', minWidth: '140px' }} />
          </div>
        </div>

        <h1 className="fade-up fade-up-2 text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
          Conser & Avento<br />
          <span style={{ color: '#063D3E' }}>heißen dich willkommen</span>
        </h1>

        <p className="fade-up fade-up-3 text-lg md:text-xl leading-relaxed max-w-lg mb-10" style={{ color: 'var(--text-secondary)' }}>
          Exklusiver Investoren-Zugang zu Pitch-Deck,<br />
          Businessplänen und direktem Gründer-Kontakt
        </p>

        <div className="fade-up fade-up-3 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-8">
          <div className="rounded-[20px] p-5 text-left border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-md)' }}>
            <img src={aventoLogo} alt="Avento" className="rounded-xl mb-3" style={{ height: '44px', width: 'auto' }} />
            <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Avento Software</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              B2B Software-Plattform für moderne Unternehmensabläufe. Skalierbar, sicher, zukunftsorientiert.
            </p>
          </div>
          <div className="rounded-[20px] p-5 text-left border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-md)' }}>
            <img src={conserLogo} alt="Conser" className="rounded-xl mb-3" style={{ height: '44px', width: 'auto' }} />
            <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Conser Market</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Digitaler Marktplatz für professionelle Dienstleistungen. Wachstumsmarkt mit nachhaltigem Potenzial.
            </p>
          </div>
        </div>

        <div className="fade-up fade-up-4 flex flex-col sm:flex-row gap-3 mb-12">
          <button
            onClick={() => setModal('register')}
            className="flex items-center gap-2 justify-center text-white rounded-[12px] px-7 py-3.5 font-semibold text-sm hover:opacity-90 transition"
            style={{ background: '#063D3E', boxShadow: 'var(--shadow-sm)' }}
          >
            Für Interessenten <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setModal('login')}
            className="flex items-center gap-2 justify-center rounded-[12px] px-7 py-3.5 font-semibold text-sm hover:opacity-80 transition border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' }}
          >
            Für Eigentümer →
          </button>
        </div>

        <div className="fade-up fade-up-5 grid grid-cols-3 gap-4 w-full max-w-lg">
          {[
            { icon: Shield, label: 'DSGVO-konform', sub: 'SSL-verschlüsselt' },
            { icon: TrendingUp, label: '€5K – €50K+', sub: 'Investitionsvolumen' },
            { icon: Users, label: 'Exklusiv', sub: 'Nur auf Einladung' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-card p-4 border text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <Icon size={20} className="text-accent1 mx-auto mb-2" />
              <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {modal === 'register' && <RegisterModal onClose={() => setModal(null)} onSwitchToLogin={() => setModal('login')} />}
      {modal === 'login' && <LoginModal onClose={() => setModal(null)} onSwitchToRegister={() => setModal('register')} />}
    </div>
  )
}
