import { Link } from 'react-router-dom'
import { MessageSquare, Bell, Handshake, ChevronRight } from 'lucide-react'
import type { Update } from '../../lib/supabase'

interface Props {
  unreadMessages: number
  updates: Update[]
  partnerCount: number
}

export default function PriorityQueue({ unreadMessages, updates, partnerCount }: Props) {
  return (
    <div className="mb-6 animate-fade-up delay-2">
      <p className="label-tag mb-3" style={{ color: 'var(--text-tertiary)' }}>HEUTE WICHTIG</p>
      <div className="card overflow-hidden">
        {unreadMessages > 0 && (
          <Link to="/owner/chat"
            className="flex items-center gap-4 p-4 transition group strip-danger border-b"
            style={{ borderColor: 'var(--border)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--danger-dim)' }}>
              <MessageSquare size={16} style={{ color: 'var(--danger)' }} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {unreadMessages} Investor-Nachricht{unreadMessages > 1 ? 'en' : ''} ungelesen
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Investoren warten auf eine Antwort</p>
            </div>
            <span className="btn btn-danger btn-sm shrink-0">Jetzt →</span>
          </Link>
        )}
        <Link to="/owner/updates"
          className="flex items-center gap-4 p-4 transition group strip-info border-b"
          style={{ borderColor: 'var(--border)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--info-dim)' }}>
            <Bell size={16} style={{ color: 'var(--info)' }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Update für Investoren verfassen</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Letztes: {updates[0]
                ? new Date(updates[0].created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
                : 'Noch keines'}
            </p>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link to="/owner/partners"
          className="flex items-center gap-4 p-4 transition group strip-neutral">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--brand-dim)' }}>
            <Handshake size={16} style={{ color: 'var(--brand)' }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Partner-Pipeline: {partnerCount} / 30 Mindest-Ziel
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface3)' }}>
                <div style={{ width: `${Math.min((partnerCount / 30) * 100, 100)}%`, height: '100%', background: 'var(--brand)', borderRadius: 'inherit', transition: 'width 0.6s ease' }} />
              </div>
              <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {Math.round((partnerCount / 30) * 100)}%
              </span>
            </div>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
