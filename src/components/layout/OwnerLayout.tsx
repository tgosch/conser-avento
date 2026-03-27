import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import OwnerSidebar from './OwnerSidebar'
import OwnerBottomNav from './OwnerBottomNav'
import Topbar from './Topbar'
export default function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <OwnerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
      {!sidebarOpen && <OwnerBottomNav onMoreClick={() => setSidebarOpen(true)} />}
    </div>
  )
}
