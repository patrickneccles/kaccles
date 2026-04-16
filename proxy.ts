import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "keystatic-auth"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/keystatic/login") {
    return NextResponse.next()
  }

  const password = process.env.ADMIN_PASSWORD
  if (password && request.cookies.get(COOKIE_NAME)?.value === password) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/keystatic/login", request.url))
}

export const config = {
  matcher: ["/keystatic(.*)-----"],
}
