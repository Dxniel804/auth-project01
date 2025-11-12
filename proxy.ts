import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/api/debug/session"]

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (PUBLIC_PATHS.some((p) => url.pathname.startsWith(p))) {
    return NextResponse.next()
  }

  try {
    const sessionUrl = new URL("/api/debug/session", request.url)
    const res = await fetch(sessionUrl.toString(), {
      headers: request.headers,
      cache: "no-store",
    })

    if (!res.ok) {
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    const body = await res.json()
    const session = body?.session

    if (!session?.user) {
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (err) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
