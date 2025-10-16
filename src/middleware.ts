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

  // For authenticated users accessing app routes, verify organization membership
  if (user && isAppRoute) {
    try {
      // Add timeout to prevent middleware from hanging
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.error('Middleware: Organization membership query timeout')
          resolve(null)
        }, 3000) // 3 second timeout
      })

      const queryPromise = supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .single()

      // Race between query and timeout
      const result = await Promise.race([queryPromise, timeoutPromise])

      const membership = result && 'data' in result ? result.data : null

      // If query timed out or no membership found, let the page load and handle it client-side
      // This prevents the middleware from blocking the entire application
      if (!membership) {
        console.log('Middleware: No membership found or query timeout, allowing page to load')
        // Allow the page to load - the OrganizationContext will handle showing appropriate UI
        return supabaseResponse
      }

      // Check if user has admin/owner role for admin-only routes
      const isAdminRoute = url.pathname.startsWith('/billing') ||
                          url.pathname.startsWith('/audit-log') ||
                          url.pathname.startsWith('/organization')

      if (isAdminRoute && membership.role !== 'admin' && membership.role !== 'owner') {
        url.pathname = '/access-denied'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Middleware error checking membership:', error)
      // On error, allow page to load - client-side code will handle auth
      return supabaseResponse
    }
  }

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