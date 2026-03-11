import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Investor } from '../lib/supabase'

interface User {
  investor?: Investor
  isAdmin: boolean
  email?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  loginAdmin: (user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAdmin: () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Admin-Session aus localStorage wiederherstellen
    const adminStored = localStorage.getItem('admin_user')
    if (adminStored) {
      try { setUser(JSON.parse(adminStored)) } catch {}
    }

    // Supabase-Session prüfen
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: inv } = await supabase
          .from('investors')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser({ investor: inv ?? undefined, isAdmin: false, email: session.user.email })
      }
      setLoading(false)
    })

    // Auth-State-Änderungen hören
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: inv } = await supabase
          .from('investors')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser({ investor: inv ?? undefined, isAdmin: false, email: session.user.email })
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('admin_user')
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loginAdmin = (u: User) => {
    setUser(u)
    localStorage.setItem('admin_user', JSON.stringify(u))
  }

  const logout = async () => {
    localStorage.removeItem('admin_user')
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
