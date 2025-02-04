import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')
  const isAuthPage = request.nextUrl.pathname === '/login'

  // Debug logs
  console.log('Current path:', request.nextUrl.pathname)
  console.log('User cookie:', userCookie)
  console.log('Is auth page:', isAuthPage)

  if (!userCookie && !isAuthPage) {
    console.log('Redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (userCookie && isAuthPage) {
    console.log('Redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*',
    '/leads/:path*',
    '/calendar/:path*',
    '/login'
  ],
} 