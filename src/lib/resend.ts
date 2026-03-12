/**
 * Resend Email Integration
 * API-Key muss in .env gesetzt sein: VITE_RESEND_API_KEY
 *
 * TODO: Resend sollte idealerweise server-seitig (Edge Function / Supabase Function)
 * aufgerufen werden, um den API-Key nicht im Frontend zu exponieren.
 * Für MVP wird der Key via VITE_ Prefix geladen — für Production eine
 * Supabase Edge Function einsetzen.
 */

export interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'noreply@conser-avento.de' // TODO: Domain verifizieren bei Resend

/**
 * Sendet eine E-Mail via Resend API.
 * SICHERHEIT: API-Key MUSS in .env als VITE_RESEND_API_KEY gesetzt sein.
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Resend] VITE_RESEND_API_KEY nicht gesetzt. E-Mail wird nicht gesendet.')
    return { success: false, error: 'API-Key nicht konfiguriert' }
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: payload.from ?? FROM_EMAIL,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Resend] Fehler:', err)
      return { success: false, error: err }
    }

    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Resend] Netzwerkfehler:', msg)
    return { success: false, error: msg }
  }
}

/**
 * Newsletter-Template für neue Updates/Phasen.
 * Wird beim Veröffentlichen eines Updates mit Kategorie 'milestone' ausgelöst.
 */
export function buildNewsletterHtml(params: {
  title: string
  content: string
  category: string
  phase?: string
}): string {
  const categoryLabel = params.category === 'milestone' ? 'Meilenstein erreicht 🎉'
    : params.category === 'important' ? 'Wichtige Information ⚡'
    : 'Neuigkeit 📢'

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.title}</title>
  <style>
    body { margin: 0; padding: 0; background: #F2F2F7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .container { max-width: 560px; margin: 32px auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #063D3E 0%, #0A5C5E 100%); padding: 32px 32px 24px; }
    .header h1 { color: white; font-size: 22px; font-weight: 700; margin: 0 0 4px; }
    .header p { color: rgba(255,255,255,0.65); font-size: 13px; margin: 0; }
    .badge { display: inline-block; background: rgba(255,255,255,0.15); color: white; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
    .body { padding: 28px 32px; }
    .tag { display: inline-block; background: rgba(6,61,62,0.10); color: #063D3E; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; }
    .title { font-size: 20px; font-weight: 700; color: #1C1C1E; margin: 0 0 12px; }
    .content { font-size: 14px; color: #6E6E73; line-height: 1.7; margin: 0 0 24px; }
    .cta { display: inline-block; background: #063D3E; color: white; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 12px; text-decoration: none; }
    .footer { padding: 20px 32px; border-top: 1px solid #F2F2F7; }
    .footer p { font-size: 11px; color: #AEAEB2; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Investoren-Update</div>
      <h1>Avento &amp; Conser</h1>
      <p>Neuigkeiten vom Gründerteam</p>
    </div>
    <div class="body">
      <div class="tag">${categoryLabel}</div>
      <h2 class="title">${params.title}</h2>
      <p class="content">${params.content.replace(/\n/g, '<br>')}</p>
      <a href="https://www.conser-avento.de" class="cta">Portal öffnen →</a>
    </div>
    <div class="footer">
      <p>Sie erhalten diese E-Mail, weil Sie sich im Investor-Portal registriert haben.<br>
      © 2025 Avento &amp; Conser · <a href="https://www.conser-avento.de" style="color: #AEAEB2;">www.conser-avento.de</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
