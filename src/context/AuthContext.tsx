import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import type { Investor } from '../lib/supabase'

interface User {
  investor?: Investor
  isAdmin: boolean
  email?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  loginAdmin: (u: User) => void
  loginInvestor: (userId: string, email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAdmin: () => {},
  loginInvestor: async () => {},
  logout: async () => {},
})

async function resolveUser(session: Session): Promise<User> {
  const isAdmin = session.user.app_metadata?.is_admin === true
  if (isAdmin) {
    return { isAdmin: true, email: session.user.email }
  }
  const { data: inv } = await supabase
    .from('investors')
    .select('id, first_name, last_name, email, phone, status, consent, created_at')
    .eq('id', session.user.id)
    .maybeSingle()
  return { investor: inv ?? undefined, isAdmin: false, email: session.user.email }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const resolved = await resolveUser(session)
        setUser(resolved)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const resolved = await resolveUser(session)
        setUser(resolved)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Setzt User direkt nach Login (verhindert Race Condition mit Navigate)
  const loginAdmin = (u: User) => setUser(u)

  const loginInvestor = async (userId: string, email: string) => {
    const { data: inv } = await supabase
      .from('investors')
      .select('id, first_name, last_name, email, phone, status, consent, created_at')
      .eq('id', userId)
      .maybeSingle()
    setUser({ investor: inv ?? undefined, isAdmin: false, email })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, loginInvestor, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
