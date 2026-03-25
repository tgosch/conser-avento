import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import type { Investor, Partner } from '../lib/supabase'

interface User {
  investor?: Investor
  partner?: Partner
  isAdmin: boolean
  isPartner: boolean
  email?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  loginAdmin: (u: User) => void
  loginInvestor: (userId: string, email: string) => Promise<void>
  loginPartner: (userId: string, email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAdmin: () => {},
  loginInvestor: async () => {},
  loginPartner: async () => {},
  logout: async () => {},
})

async function resolveUser(session: Session): Promise<User> {
  const email = session.user.email

  if (session.user.app_metadata?.is_admin === true) {
    return { isAdmin: true, isPartner: false, email }
  }

  // Check partners table — supports self-registration (no JWT claim needed)
  const { data: partner } = await supabase
    .from('partners')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle()
  if (partner) {
    return { partner, isAdmin: false, isPartner: true, email }
  }

  const { data: inv } = await supabase
    .from('investors')
    .select('id, first_name, last_name, email, phone, status, consent, consent_date, nda_accepted, nda_date, created_at')
    .eq('id', session.user.id)
    .maybeSingle()
  return { investor: inv ?? undefined, isAdmin: false, isPartner: false, email }
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

  const loginAdmin = (u: User) => setUser(u)

  const loginInvestor = async (userId: string, email: string) => {
    const { data: inv } = await supabase
      .from('investors')
      .select('id, first_name, last_name, email, phone, status, consent, consent_date, nda_accepted, nda_date, created_at')
      .eq('id', userId)
      .maybeSingle()
    setUser({ investor: inv ?? undefined, isAdmin: false, isPartner: false, email })
  }

  const loginPartner = async (userId: string, email: string) => {
    const { data: partner } = await supabase
      .from('partners')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setUser({ partner: partner ?? undefined, isAdmin: false, isPartner: true, email })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, loginInvestor, loginPartner, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
