import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import Landing from './pages/Landing'
import InvestorLayout from './components/layout/InvestorLayout'
import OwnerLayout from './components/layout/OwnerLayout'

import InvestorDashboard from './pages/investor/Dashboard'
import InvestorPlans from './pages/investor/Plans'
import InvestorPlanDetail from './pages/investor/PlanDetail'
import InvestorChat from './pages/investor/Chat'
import InvestorTeam from './pages/investor/Team'
import InvestorFuture from './pages/investor/Future'
import InvestorStatus from './pages/investor/Status'
import InvestorStructure from './pages/investor/Structure'
import InvestorSettings from './pages/investor/Settings'
import InvestorPartners from './pages/investor/Partners'

import OwnerDashboard from './pages/owner/Dashboard'
import OwnerDocs from './pages/owner/Docs'
import OwnerChat from './pages/owner/Chat'
import OwnerUpdates from './pages/owner/Updates'
import OwnerPartners from './pages/owner/Partners'
import OwnerFuture from './pages/owner/Future'
import OwnerPhasePlan from './pages/owner/PhasePlan'
import OwnerPhasesAndMilestones from './pages/owner/PhasesAndMilestones'
import OwnerStructure from './pages/owner/Structure'
import OwnerSettings from './pages/owner/Settings'
import OwnerTeam from './pages/owner/Team'
import OwnerPresentationsHub from './pages/owner/PresentationsHub'
import InvestorRoadmap from './pages/investor/Roadmap'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#063D3E', borderTopColor: 'transparent' }} />
    </div>
  )
}

function InvestorGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user || user.isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

function OwnerGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  // isAdmin-Flag aus AuthContext reicht — dort wird Expiry bereits geprüft
  if (!user?.isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/investor" element={<InvestorGuard><InvestorLayout /></InvestorGuard>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InvestorDashboard />} />
        <Route path="plans" element={<InvestorPlans />} />
        <Route path="plans/:section" element={<InvestorPlanDetail />} />
        <Route path="chat" element={<InvestorChat />} />
        <Route path="team" element={<InvestorTeam />} />
        <Route path="future" element={<InvestorFuture />} />
        <Route path="status" element={<InvestorStatus />} />
        <Route path="structure" element={<InvestorStructure />} />
        <Route path="partners" element={<InvestorPartners />} />
        <Route path="roadmap" element={<InvestorRoadmap />} />
        <Route path="settings" element={<InvestorSettings />} />
      </Route>

      <Route path="/owner" element={<OwnerGuard><OwnerLayout /></OwnerGuard>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="docs" element={<OwnerDocs />} />
        <Route path="chat" element={<OwnerChat />} />
        <Route path="updates" element={<OwnerUpdates />} />
        <Route path="partners" element={<OwnerPartners />} />
        <Route path="future" element={<OwnerFuture />} />
        <Route path="phases" element={<OwnerPhasePlan />} />
        <Route path="milestones" element={<OwnerPhasesAndMilestones />} />
        <Route path="structure" element={<OwnerStructure />} />
        <Route path="team" element={<OwnerTeam />} />
        <Route path="presentations" element={<OwnerPresentationsHub />} />
        <Route path="settings" element={<OwnerSettings />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/dashboard/*" element={<Navigate to="/investor/dashboard" replace />} />
      <Route path="/admin/*" element={<Navigate to="/owner/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            toastStyle={{ background: 'var(--surface)', color: 'var(--text-primary)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
