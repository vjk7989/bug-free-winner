import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')
  const isAuthPage = request.nextUrl.pathname === '/login'

  // Debug logs
  console.log('Current path:', request.nextUrl.pathname)
  console.log('User cookie:', userCookie)
  console.log('Is auth page:', isAuthPage)

  // If no user cookie and not on login page, redirect to login
  if (!userCookie && !isAuthPage) {
    console.log('Redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user has cookie and on login page, redirect to dashboard
  if (userCookie && isAuthPage) {
    console.log('Redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check permissions for protected routes
  if (userCookie) {
    const user = JSON.parse(userCookie.value)
    const path = request.nextUrl.pathname
    
    // Map paths to required permissions
    const permissionMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/leads': 'leads',
      '/calendar': 'calendar',
      '/email': 'email',
      '/settings': 'settings',
    }

    // Check if current path requires permission
    const requiredPermission = Object.entries(permissionMap).find(([routePath]) => 
      path.startsWith(routePath)
    )?.[1]

    if (requiredPermission && !user.permissions?.[requiredPermission]) {
      // Redirect to access denied page with return URL
      const returnUrl = encodeURIComponent(request.nextUrl.pathname)
      return NextResponse.redirect(new URL(`/access-denied?returnUrl=${returnUrl}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*',
    '/leads/:path*',
    '/calendar/:path*',
    '/email/:path*',
    '/settings/:path*',
    '/login'
  ],
} 