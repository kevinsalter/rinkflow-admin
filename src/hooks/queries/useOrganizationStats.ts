import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { useOrganization } from '@/contexts/OrganizationContext'

interface OrganizationStats {
  memberCount: number
  coachCount: number
  recentlyJoined: number
  pendingInvites: number
}

async function fetchOrganizationStats(organizationId: string): Promise<OrganizationStats> {
  const supabase = createClient()
  
  // Get total member count (all non-removed members)
  const { data: members, error: memberError } = await supabase
    .from('organization_members')
    .select('id', { count: 'exact' })
    .eq('organization_id', organizationId)
    .is('removed_at', null)

  if (memberError) {
    throw memberError
  }

  // Get coach count (members with role 'coach')
  const { data: coaches, error: coachError } = await supabase
    .from('organization_members')
    .select('id', { count: 'exact' })
    .eq('organization_id', organizationId)
    .eq('role', 'coach')
    .is('removed_at', null)

  if (coachError) {
    throw coachError
  }

  // Get recently joined members (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: recentMembers, error: recentError } = await supabase
    .from('organization_members')
    .select('id', { count: 'exact' })
    .eq('organization_id', organizationId)
    .gte('joined_at', sevenDaysAgo.toISOString())
    .is('removed_at', null)

  if (recentError) {
    throw recentError
  }

  // Get pending invites (invited but not joined)
  const { data: pendingInvites, error: pendingError } = await supabase
    .from('organization_members')
    .select('id', { count: 'exact' })
    .eq('organization_id', organizationId)
    .not('invited_at', 'is', null)
    .is('joined_at', null)
    .is('removed_at', null)

  if (pendingError) {
    throw pendingError
  }

  return {
    memberCount: members?.length || 0,
    coachCount: coaches?.length || 0,
    recentlyJoined: recentMembers?.length || 0,
    pendingInvites: pendingInvites?.length || 0,
  }
}

export function useOrganizationStats() {
  const { organizationId } = useOrganization()

  return useQuery({
    queryKey: ['organization-stats', organizationId],
    queryFn: () => fetchOrganizationStats(organizationId!),
    enabled: !!organizationId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}