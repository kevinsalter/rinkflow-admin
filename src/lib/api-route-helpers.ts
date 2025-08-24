import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { apiResponse } from './api-helpers'

interface AuthenticatedRequest extends NextRequest {
  userId?: string
  organizationId?: string
  userRole?: string
}

/**
 * Middleware wrapper for API routes that require authentication and organization access
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<Response>
) {
  return async (req: NextRequest) => {
    try {
      const supabase = await createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return apiResponse(null, 'Unauthorized', 401)
      }

      // Get user's organization
      const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .is('removed_at', null)
        .single()

      if (!membership) {
        return apiResponse(null, 'No organization membership found', 403)
      }

      // Add auth info to request
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.userId = user.id
      authenticatedReq.organizationId = membership.organization_id
      authenticatedReq.userRole = membership.role

      return handler(authenticatedReq)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return apiResponse(null, 'Internal server error', 500)
    }
  }
}

/**
 * Middleware wrapper for API routes that require admin access
 */
export function withAdminAuth(
  handler: (req: AuthenticatedRequest) => Promise<Response>
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (req.userRole !== 'admin' && req.userRole !== 'owner') {
      return apiResponse(null, 'Admin access required', 403)
    }
    return handler(req)
  })
}

/**
 * Helper to extract and validate organization_id from request
 */
export async function getRequestOrganization(req: NextRequest): Promise<{
  organizationId: string | null
  error: string | null
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { organizationId: null, error: 'Unauthorized' }
  }

  // Check if organization_id is in the request body or query params
  const url = new URL(req.url)
  let organizationId = url.searchParams.get('organization_id')

  // If not in query params, check body (for POST/PUT requests)
  if (!organizationId && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
    try {
      const body = await req.json()
      organizationId = body.organization_id
    } catch {
      // Body might not be JSON
    }
  }

  // If still no organization_id, get from user's membership
  if (!organizationId) {
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .is('removed_at', null)
      .single()

    organizationId = membership?.organization_id || null
  }

  if (!organizationId) {
    return { organizationId: null, error: 'Organization ID not found' }
  }

  // Verify user has access to this organization
  const { data: hasAccess } = await supabase
    .from('organization_members')
    .select('id')
    .eq('user_id', user.id)
    .eq('organization_id', organizationId)
    .is('removed_at', null)
    .single()

  if (!hasAccess) {
    return { organizationId: null, error: 'Access denied to this organization' }
  }

  return { organizationId, error: null }
}