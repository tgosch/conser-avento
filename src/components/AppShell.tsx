import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import AiChatbot from './AiChatbot'
import { useAuth } from '../context/AuthContext'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-60">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-[68px] min-h-screen">
          <Outlet />
        </main>
      </div>
      {/* Floating AI Chatbot – only shown when logged in as investor */}
      {user && !user.isAdmin && <AiChatbot />}
    </div>
  )
}
