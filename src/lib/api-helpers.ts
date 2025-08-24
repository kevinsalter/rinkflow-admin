import { createClient } from '@/lib/supabase-client'
import { createClient as createServerClient, createServiceRoleClient } from '@/lib/supabase-server'

/**
 * Helper to ensure organization_id is included in all queries
 * This should be used for all client-side database queries
 */
export async function getOrganizationId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .is('removed_at', null)
    .single()

  return membership?.organization_id || null
}

/**
 * Helper for server-side organization ID retrieval
 */
export async function getServerOrganizationId(): Promise<string | null> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .is('removed_at', null)
    .single()

  return membership?.organization_id || null
}

/**
 * Verify user has access to organization (for API routes)
 */
export async function verifyOrganizationAccess(organizationId: string): Promise<boolean> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', organizationId)
    .is('removed_at', null)
    .single()

  return !!membership
}

/**
 * Verify user is an admin of the organization
 */
export async function verifyOrganizationAdmin(organizationId: string): Promise<boolean> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', organizationId)
    .is('removed_at', null)
    .single()

  return membership?.role === 'admin' || membership?.role === 'owner'
}

/**
 * Standard API response helper
 */
export function apiResponse<T>(
  data: T | null,
  error: string | null = null,
  status: number = 200
) {
  if (error) {
    return Response.json(
      { error, data: null },
      { status }
    )
  }
  
  return Response.json(
    { data, error: null },
    { status }
  )
}

/**
 * Helper to add organization_id to query parameters
 */
export function withOrganizationId<T extends Record<string, any>>(
  params: T,
  organizationId: string | null
): T & { organization_id: string } {
  if (!organizationId) {
    throw new Error('Organization ID is required')
  }
  
  return {
    ...params,
    organization_id: organizationId
  }
}