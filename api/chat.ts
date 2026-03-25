/**
 * Vercel Edge Function — Anthropic AI Proxy
 *
 * Warum Edge Function?
 * Der ANTHROPIC_API_KEY darf NIEMALS im Browser-Bundle landen (VITE_ Prefix würde
 * ihn in das JS-Bundle einbetten). Stattdessen ruft der Browser /api/chat auf,
 * diese Funktion läuft server-seitig auf Vercel und hält den Key geheim.
 *
 * Sicherheit:
 * - ANTHROPIC_API_KEY als Vercel Environment Variable (server-only, kein VITE_ Prefix)
 * - Input-Validierung (Längen-Limits, Schema-Check)
 * - Rate-Limiting via Anthropic-seitigem API-Limit
 * - CORS: nur gleiche Origin erlaubt
 */

export const config = { runtime: 'edge' }

const MAX_MESSAGES = 40
const MAX_CONTENT_LENGTH = 3000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  messages: AnthropicMessage[]
  system?: string
}

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
  }

  // Nur POST erlaubt
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    })
  }

  // ── Rate Limiting (IP-basiert) ────────────────────────────────────
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  const rl = rateLimitMap.get(clientIp)
  if (rl && now < rl.resetAt) {
    rl.count++
    if (rl.count > RATE_LIMIT_MAX) {
      return new Response(JSON.stringify({ error: 'Zu viele Anfragen. Bitte warten.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Retry-After': String(Math.ceil((rl.resetAt - now) / 1000)) },
      })
    }
  } else {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
  }
  // Cleanup stale entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key)
    }
  }

  // ── JWT-Authentifizierung (Supabase) ──────────────────────────────
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return new Response(JSON.stringify({ error: 'Nicht authentifiziert' }), {
      status: 401,
      headers: corsHeaders,
    })
  }
  // Token gegen Supabase verifizieren
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
  if (supabaseUrl && supabaseKey) {
    try {
      const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { 'Authorization': `Bearer ${token}`, 'apikey': supabaseKey },
      })
      if (!authRes.ok) {
        return new Response(JSON.stringify({ error: 'Ungültige Sitzung' }), {
          status: 401,
          headers: corsHeaders,
        })
      }
    } catch {
      return new Response(JSON.stringify({ error: 'Authentifizierung fehlgeschlagen' }), {
        status: 401,
        headers: corsHeaders,
      })
    }
  }

  // API-Key prüfen (server-side, nie im Browser sichtbar)
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('[api/chat] ANTHROPIC_API_KEY nicht gesetzt')
    return new Response(JSON.stringify({ error: 'Serverkonfigurationsfehler' }), {
      status: 500,
      headers: corsHeaders,
    })
  }

  // Body parsen + validieren
  let body: RequestBody
  try {
    body = await req.json() as RequestBody
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültige Anfrage' }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'messages erforderlich' }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  // Input-Limits: Anzahl + Länge
  const messages = body.messages.slice(-MAX_MESSAGES).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content).slice(0, MAX_CONTENT_LENGTH),
  }))

  // Upstream-Call zu Anthropic
  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: body.system ? String(body.system).slice(0, 2000) : undefined,
        messages,
      }),
    })

    const data = await upstream.json()
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: corsHeaders,
    })
  } catch (err) {
    console.error('[api/chat] Upstream-Fehler:', err)
    return new Response(JSON.stringify({ error: 'KI-Service nicht erreichbar' }), {
      status: 502,
      headers: corsHeaders,
    })
  }
}
