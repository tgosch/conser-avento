import { Outlet } from 'react-router-dom'
import PartnerSidebar from './PartnerSidebar'
import PartnerBottomNav from './PartnerBottomNav'
import Topbar from './Topbar'
export default function PartnerLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <PartnerSidebar open={false} onClose={() => {}} />
      <Topbar />
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
      <PartnerBottomNav />
    </div>
  )
}
