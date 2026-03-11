import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Investor } from '../lib/supabase'

interface User {
  investor?: Investor
  isAdmin: boolean
  email?: string
}

interface StoredAdminSession {
  isAdmin: true
  email: string
  expiresAt: number  // Unix ms
}

interface AuthContextType {
  user: User | null
  loading: boolean
  loginAdmin: (user: User) => void
  logout: () => Promise<void>
}

const ADMIN_SESSION_DURATION_MS = 8 * 60 * 60 * 1000 // 8 Stunden
const ADMIN_SESSION_KEY = 'ac_admin_s'

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAdmin: () => {},
  logout: async () => {},
})

function readAdminSession(): User | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!raw) return null
    const parsed: StoredAdminSession = JSON.parse(raw)
    // Session abgelaufen?
    if (!parsed.isAdmin || !parsed.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY)
      return null
    }
    return { isAdmin: true, email: parsed.email }
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Admin-Session (mit Expiry-Check)
    const adminSession = readAdminSession()
    if (adminSession) {
      setUser(adminSession)
      setLoading(false)
      return
    }

    // Supabase Auth Session prüfen
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: inv } = await supabase
          .from('investors')
          .select('id, first_name, last_name, email, phone, status, consent, created_at')
          .eq('id', session.user.id)
          .maybeSingle()
        setUser({ investor: inv ?? undefined, isAdmin: false, email: session.user.email })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (readAdminSession()) return

      if (event === 'SIGNED_IN' && session?.user) {
        const { data: inv } = await supabase
          .from('investors')
          .select('id, first_name, last_name, email, phone, status, consent, created_at')
          .eq('id', session.user.id)
          .maybeSingle()
        setUser({ investor: inv ?? undefined, isAdmin: false, email: session.user.email })
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loginAdmin = (u: User) => {
    const session: StoredAdminSession = {
      isAdmin: true,
      email: u.email ?? '',
      expiresAt: Date.now() + ADMIN_SESSION_DURATION_MS,
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
    setUser(u)
  }

  const logout = async () => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
