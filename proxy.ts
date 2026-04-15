import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'keystatic-auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/keystatic/login') {
    return NextResponse.next()
  }

  if (request.cookies.get(COOKIE_NAME)?.value === process.env.ADMIN_PASSWORD) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/keystatic/login', request.url))
}

export const config = {
  matcher: ['/keystatic(.*)'],
}
