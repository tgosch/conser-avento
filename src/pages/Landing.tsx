import { useState } from 'react'
import RegisterModal from '../components/RegisterModal'
import LoginModal from '../components/LoginModal'
import aventoLogo from '../assets/avento_kachel.svg'
import conserLogo from '../assets/conser_kachel.svg'

export default function Landing() {
  const [modal, setModal] = useState<'register' | 'login' | null>(null)

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative gradients */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(9,72,73,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,132,78,0.10) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}
      />

      <div className="flex flex-col items-center text-center max-w-xl w-full relative z-10">
        {/* Logo Kacheln */}
        <div className="flex gap-4 mb-8 fade-up fade-up-1">
          <div
            className="overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
            style={{ borderRadius: '20px', boxShadow: '6px 6px 18px rgba(9,72,73,0.10)' }}
          >
            <img src={aventoLogo} alt="Avento Software" className="h-[72px] object-cover w-auto" />
          </div>
          <div
            className="overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
            style={{ borderRadius: '20px', boxShadow: '6px 6px 18px rgba(9,72,73,0.10)' }}
          >
            <img src={conserLogo} alt="Conser Market" className="h-[72px] object-cover w-auto" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight mb-4 fade-up fade-up-2">
          Das Investoren-Portal für{' '}
          <span className="text-accent1">Avento & Conser</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 text-lg mb-8 max-w-md fade-up fade-up-3">
          Exklusiver Zugang zu Pitch-Deck, Businessplänen und Finanzanalysen
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 fade-up fade-up-4">
          <button
            onClick={() => setModal('register')}
            className="bg-accent1 text-white rounded-full px-7 py-3.5 font-semibold text-sm hover:opacity-90 transition shadow-md"
          >
            Als Interessent registrieren
          </button>
          <button
            onClick={() => setModal('login')}
            className="border-2 border-accent1 text-accent1 rounded-full px-7 py-3.5 font-semibold text-sm hover:bg-accent1 hover:text-white transition"
          >
            Login
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex gap-6 text-xs text-gray-400 fade-up fade-up-5">
          <span>🔒 SSL-verschlüsselt</span>
          <span>🇩🇪 DSGVO-konform</span>
          <span>✅ Exklusiver Zugang</span>
        </div>
      </div>

      {/* Modals */}
      {modal === 'register' && (
        <RegisterModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToRegister={() => setModal('register')}
        />
      )}
    </div>
  )
}
