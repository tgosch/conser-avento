import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/" replace />
  if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
