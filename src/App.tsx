import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import Landing from './pages/Landing'
import InvestorLayout from './components/layout/InvestorLayout'
import OwnerLayout from './components/layout/OwnerLayout'

// Lazy-loaded pages for code splitting
const InvestorDashboard = React.lazy(() => import('./pages/investor/Dashboard'))
const InvestorPlans = React.lazy(() => import('./pages/investor/Plans'))
const InvestorPlanDetail = React.lazy(() => import('./pages/investor/PlanDetail'))
const InvestorChat = React.lazy(() => import('./pages/investor/Chat'))
const InvestorTeam = React.lazy(() => import('./pages/investor/Team'))
const InvestorFuture = React.lazy(() => import('./pages/investor/Future'))
const InvestorStatus = React.lazy(() => import('./pages/investor/Status'))
const InvestorStructure = React.lazy(() => import('./pages/investor/Structure'))
const InvestorSettings = React.lazy(() => import('./pages/investor/Settings'))
const InvestorPartners = React.lazy(() => import('./pages/investor/Partners'))
const InvestorRoadmap = React.lazy(() => import('./pages/investor/Roadmap'))

const OwnerDashboard = React.lazy(() => import('./pages/owner/Dashboard'))
const OwnerDocs = React.lazy(() => import('./pages/owner/Docs'))
const OwnerChat = React.lazy(() => import('./pages/owner/Chat'))
const OwnerUpdates = React.lazy(() => import('./pages/owner/Updates'))
const OwnerPartners = React.lazy(() => import('./pages/owner/Partners'))
const OwnerFuture = React.lazy(() => import('./pages/owner/Future'))
const OwnerPhasePlan = React.lazy(() => import('./pages/owner/PhasePlan'))
const OwnerPhasesAndMilestones = React.lazy(() => import('./pages/owner/PhasesAndMilestones'))
const OwnerStructure = React.lazy(() => import('./pages/owner/Structure'))
const OwnerSettings = React.lazy(() => import('./pages/owner/Settings'))
const OwnerTeam = React.lazy(() => import('./pages/owner/Team'))
const OwnerPresentationsHub = React.lazy(() => import('./pages/owner/PresentationsHub'))

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 32, background: 'var(--bg)', color: 'var(--text-primary)' }}>
          <p style={{ fontSize: 32 }}>⚠️</p>
          <h2 style={{ fontWeight: 700, fontSize: 18 }}>Etwas ist schiefgelaufen</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Bitte Seite neu laden.</p>
          <button onClick={() => window.location.reload()}
            style={{ marginTop: 8, padding: '10px 24px', background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Neu laden
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#063D3E', borderTopColor: 'transparent' }} />
    </div>
  )
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
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
  if (!user?.isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}
