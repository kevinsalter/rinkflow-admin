import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Important: createServerClient and supabase.auth.getUser() must be called
  // to refresh expired Auth tokens and pass them to the client
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthRoute = url.pathname === '/' || url.pathname.startsWith('/auth/')
  const isAppRoute = url.pathname.startsWith('/dashboard') || 
                     url.pathname.startsWith('/coaches') ||
                     url.pathname.startsWith('/billing') ||
                     url.pathname.startsWith('/audit-log') ||
                     url.pathname.startsWith('/organization') ||
                     url.pathname.startsWith('/changelog')

  // If user is not authenticated and trying to access protected routes
  if (!user && isAppRoute) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && isAuthRoute && url.pathname !== '/auth/callback') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Skip organization membership check in middleware - let client-side handle it
  // The middleware was timing out due to RLS queries, blocking page loads
  // Organization membership is now verified client-side via /api/organization

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files with extensions (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}