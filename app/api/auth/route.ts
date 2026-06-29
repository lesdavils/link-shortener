import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('dashboard_token', password, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  })

  return response
}
