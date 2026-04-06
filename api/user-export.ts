/**
 * Vercel Edge Function — DSGVO Datenexport (Art. 20)
 * Gibt alle persönlichen Daten eines Nutzers als JSON zurück.
 */

export const config = { runtime: 'edge' }

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') ?? ''
  const allowedOrigins = ['https://conser-avento.vercel.app', 'https://conser-avento.de',
    ...(process.env.VERCEL_ENV !== 'production' ? ['http://localhost:5173'] : [])]
  const isAllowed = allowedOrigins.includes(origin)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(isAllowed ? { 'Access-Control-Allow-Origin': origin } : {}),
  }

  if (req.method === 'OPTIONS') {
    if (!isAllowed) return new Response(null, { status: 403 })
    return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': 'Authorization' } })
  }
  if (req.method !== 'GET') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  if (!isAllowed) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers })

  // Auth
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response(JSON.stringify({ error: 'Nicht authentifiziert' }), { status: 401, headers })

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return new Response(JSON.stringify({ error: 'Server-Konfigurationsfehler' }), { status: 500, headers })
  }

  try {
    // Verify token + get user
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
    })
    if (!userRes.ok) return new Response(JSON.stringify({ error: 'Ungültige Sitzung' }), { status: 401, headers })
    const user = await userRes.json()
    const userId = user.id

    // Fetch all user data
    const fetchTable = async (table: string, filter: string) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}=eq.${userId}&select=*`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` },
      })
      return res.ok ? await res.json() : []
    }

    const [investor, partner, messages, consents] = await Promise.all([
      fetchTable('investors', 'id'),
      fetchTable('partners', 'id'),
      fetchTable('messages', 'investor_id'),
      fetchTable('consent_records', 'user_id'),
    ])

    const exportData = {
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        app_metadata: { role: user.app_metadata?.is_admin ? 'admin' : user.app_metadata?.is_partner ? 'partner' : 'investor' },
      },
      investor_profile: investor?.[0] ?? null,
      partner_profile: partner?.[0] ?? null,
      messages: messages ?? [],
      consents: consents ?? [],
    }

    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: { ...headers, 'Content-Disposition': 'attachment; filename="meine-daten.json"' },
    })
  } catch (err) {
    const reqId = Math.random().toString(36).slice(2, 10)
    console.error(`[api/user-export] req=${reqId}:`, err instanceof Error ? err.message : String(err))
    return new Response(JSON.stringify({ error: 'Export fehlgeschlagen', requestId: reqId }), { status: 500, headers })
  }
}
