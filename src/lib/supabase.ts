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
  phone: string | null
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
  file_name: string | null
  file_url: string | null
  uploaded_at: string
}

export interface Update {
  id: string
  title: string
  content: string
  category: 'general' | 'milestone' | 'important'
  created_at: string
}
