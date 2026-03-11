import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import InvestorSidebar from './InvestorSidebar'
import Topbar from './Topbar'
import AiChatbot from '../chat/AiChatbot'

export default function InvestorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <InvestorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <main
        className="pt-[64px] min-h-screen"
        style={{ paddingLeft: 'var(--content-offset)' }}
      >
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
      <AiChatbot />
    </div>
  )
}
