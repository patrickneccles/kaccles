import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const COOKIE_NAME = 'keystatic-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/keystatic')) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get(COOKIE_NAME)
  if (authCookie?.value === ADMIN_PASSWORD) {
    return NextResponse.next()
  }

  if (pathname === '/keystatic/login') {
    return NextResponse.next()
  }

  const loginUrl = new URL('/keystatic/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/keystatic/:path*'],
}