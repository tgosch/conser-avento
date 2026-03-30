import { Outlet } from 'react-router-dom'
import InvestorSidebar from './InvestorSidebar'
import InvestorBottomNav from './InvestorBottomNav'
import Topbar from './Topbar'
export default function InvestorLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <InvestorSidebar open={false} onClose={() => {}} />
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
      <InvestorBottomNav />
    </div>
  )
}
