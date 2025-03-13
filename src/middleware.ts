import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/api/auth/callback',
  '/api/auth/csrf',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
]

// Middleware function
export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || 
    nextUrl.pathname.startsWith('/api/auth/') ||
    nextUrl.pathname.startsWith('/_next/') ||
    nextUrl.pathname.startsWith('/static/')


  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

// Configure middleware matching
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api/auth (authentication endpoints)
     * - _next (Next.js internals)
     * - static (static files)
     * - favicon.ico (browser icon)
     * - public (public assets)
     */
    '/((?!api/auth|_next|static|favicon\\.ico).*)',
  ],
}
