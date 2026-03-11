import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Investor } from '../lib/supabase'

interface AuthUser {
  investor: Investor | null
  isAdmin: boolean
}

interface AuthContextType {
  user: AuthUser | null
  login: (investor: Investor | null, isAdmin: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }, [user])

  const login = (investor: Investor | null, isAdmin: boolean) => {
    setUser({ investor, isAdmin })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
