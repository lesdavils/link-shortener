import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('dashboard_token')?.value
  const expected = process.env.DASHBOARD_PASSWORD

  if (token !== expected) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard'],
}
