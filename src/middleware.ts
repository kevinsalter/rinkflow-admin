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
    // Get user's organization membership
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .is('removed_at', null)
      .single()

    // If user is not a member of any organization, redirect to access denied
    if (!membership) {
      url.pathname = '/access-denied'
      return NextResponse.redirect(url)
    }

    // Check if user has admin/owner role for admin-only routes
    const isAdminRoute = url.pathname.startsWith('/billing') || 
                        url.pathname.startsWith('/audit-log') ||
                        url.pathname.startsWith('/organization')
    
    if (isAdminRoute && membership.role !== 'admin' && membership.role !== 'owner') {
      url.pathname = '/access-denied'
      return NextResponse.redirect(url)
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