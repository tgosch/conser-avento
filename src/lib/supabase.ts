import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

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
  section: string
  category: string
  file_name?: string
  file_url?: string
  visible_to_investors: boolean
  updated_at: string
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
}
