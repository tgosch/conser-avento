import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import PartnerSidebar from './PartnerSidebar'
import PartnerBottomNav from './PartnerBottomNav'
import Topbar from './Topbar'
export default function PartnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <PartnerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
      {!sidebarOpen && <PartnerBottomNav onMoreClick={() => setSidebarOpen(true)} />}
    </div>
  )
}
