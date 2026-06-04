import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Forward via Resend (or any SMTP) — requires RESEND_API_KEY + CONTACT_EMAIL env vars
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL

  if (!apiKey || !to) {
    // In dev without keys, just log
    console.log('Contact form submission:', { name, email, message })
    return NextResponse.json({ ok: true })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'website@bloemena.com',
      to,
      subject: `Bericht van ${name} via bloemena.com`,
      text: `Van: ${name} <${email}>\n\n${message}`,
    }),
  })

  return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Mail failed' }, { status: 500 })
}
