/**
 * Vercel Edge Function — Resend Email Proxy
 *
 * Der RESEND_API_KEY darf NIEMALS im Browser-Bundle landen.
 * Diese Funktion laeuft server-seitig auf Vercel und haelt den Key geheim.
 *
 * Sicherheit:
 * - RESEND_API_KEY als Vercel Environment Variable (server-only, kein VITE_ Prefix)
 * - JWT-Validierung gegen Supabase
 * - Input-Validierung
 */

export const config = { runtime: 'edge' }

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'noreply@conser-avento.de'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  // JWT-Validierung
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const token = authHeader.replace('Bearer ', '')
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY },
    })
    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
    }
    const userData = await userRes.json()
    if (!userData.app_metadata?.is_admin) {
      return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403 })
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Auth failed' }), { status: 401 })
  }

  // Resend API Key pruefen
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), { status: 500 })
  }

  // Input validieren
  let body: { to: string | string[]; subject: string; html: string; from?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  if (!body.to || !body.subject || !body.html) {
    return new Response(JSON.stringify({ error: 'Missing required fields: to, subject, html' }), { status: 400 })
  }

  if (body.subject.length > 200) {
    return new Response(JSON.stringify({ error: 'Subject too long' }), { status: 400 })
  }

  // Email senden
  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: body.from ?? FROM_EMAIL,
        to: Array.isArray(body.to) ? body.to : [body.to],
        subject: body.subject,
        html: body.html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(JSON.stringify({ error: err }), { status: res.status })
    }

    const data = await res.json()
    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 500 })
  }
}
