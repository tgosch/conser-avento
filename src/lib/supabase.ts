import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Owner-Portal Client: nutzt Service-Key wenn gesetzt (bypassed RLS),
// sonst Anon-Key mit geteilter Auth-Session (funktioniert via open storage policies).
const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY
export const supabaseAdmin = serviceKey
  ? createClient(import.meta.env.VITE_SUPABASE_URL, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : supabase

export interface Investor {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  consent: boolean
  consent_date?: string
  status: string
  created_at: string
}

export interface Message {
  id: string
  investor_id: string
  content: string
  from_admin: boolean
  created_at: string
}

export interface InvestmentIntent {
  id: string
  investor_id: string
  amount: number
  status: string
  created_at: string
}

export interface Document {
  id: string
  // New confirmed columns
  name?: string
  file_path?: string
  category?: string
  owner_id?: string
  // Legacy columns (may exist in older rows)
  section?: string
  file_name?: string
  file_url?: string
  visible_to_investors?: boolean
  updated_at?: string
}

export interface Update {
  id: string
  title: string
  content: string
  category: string
  created_at: string
}

export interface FutureContent {
  id: string
  type: string
  title: string
  description?: string
  status: string
  timeframe?: string
  priority: number
  created_at: string
}

export interface Phase {
  id: string
  name: string
  description?: string
  start_date?: string
  end_date?: string
  status: string
  order_index: number
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  initials: string
  color: string
  type: string
  equity_percent: number
  visible: boolean
  order_index: number
  photo_path?: string | null
}

export interface PhaseEntry {
  id: string
  phase_id: string | null
  title: string
  description?: string
  date?: string
  created_at: string
}

export interface Partner {
  id: string
  name: string
  type: 'production' | 'customer'
  category: string
  description: string
  status: 'negotiating' | 'active' | 'beta' | 'partner'
  logo_path: string | null
  initials: string
  color: string
  visible: boolean
  order_index: number
  created_at: string
}
