import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "admin-auth"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const password = process.env.ADMIN_PASSWORD
  if (password && request.cookies.get(COOKIE_NAME)?.value === password) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/admin/login", request.url))
}

export const config = {
  matcher: ["/admin(.*)"],
}
