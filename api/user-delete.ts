/**
 * Vercel Edge Function — DSGVO Recht auf Löschung (Art. 17)
 * Löscht alle persönlichen Daten eines Nutzers.
 */

export const config = { runtime: 'edge' }

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') ?? ''
  const allowedOrigins = ['https://conser-avento.vercel.app', 'https://conser-avento.de', 'http://localhost:5173']
  const isAllowed = allowedOrigins.includes(origin)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(isAllowed ? { 'Access-Control-Allow-Origin': origin } : {}),
  }

  if (req.method === 'OPTIONS') {
    if (!isAllowed) return new Response(null, { status: 403 })
    return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } })
  }
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  if (!isAllowed) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers })

  // Require confirmation in body
  let body: { confirm?: boolean }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültige Anfrage' }), { status: 400, headers })
  }

  if (body.confirm !== true) {
    return new Response(JSON.stringify({ error: 'Bestätigung erforderlich. Senden Sie { "confirm": true }' }), { status: 400, headers })
  }

  // Auth
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return new Response(JSON.stringify({ error: 'Nicht authentifiziert' }), { status: 401, headers })

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return new Response(JSON.stringify({ error: 'Server-Konfigurationsfehler' }), { status: 500, headers })
  }

  try {
    // Verify token
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
    })
    if (!userRes.ok) return new Response(JSON.stringify({ error: 'Ungültige Sitzung' }), { status: 401, headers })
    const user = await userRes.json()
    const userId = user.id

    // Delete user data from all tables (cascade handles messages)
    const deleteFrom = async (table: string, filter: string) => {
      await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}=eq.${userId}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` },
      })
    }

    await Promise.all([
      deleteFrom('investors', 'id'),
      deleteFrom('partners', 'id'),
      deleteFrom('messages', 'investor_id'),
      deleteFrom('contact_requests', 'email'),
    ])

    return new Response(JSON.stringify({
      success: true,
      message: 'Alle persönlichen Daten wurden gelöscht. Ihr Konto wird in Kürze deaktiviert.',
      deleted_at: new Date().toISOString(),
    }), { status: 200, headers })
  } catch {
    return new Response(JSON.stringify({ error: 'Löschung fehlgeschlagen' }), { status: 500, headers })
  }
}
