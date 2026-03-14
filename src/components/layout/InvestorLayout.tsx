import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import InvestorSidebar from './InvestorSidebar'
import InvestorBottomNav from './InvestorBottomNav'
import Topbar from './Topbar'
import AiChatbot from '../chat/AiChatbot'

export default function InvestorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <InvestorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <main
        className="pt-[var(--topbar-height)] min-h-screen"
        style={{
          paddingLeft: 'var(--content-offset)',
          paddingBottom: 'var(--bottom-nav-total)',
        }}
      >
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
      {!sidebarOpen && <InvestorBottomNav onMoreClick={() => setSidebarOpen(true)} />}
      <AiChatbot />
    </div>
  )
}
