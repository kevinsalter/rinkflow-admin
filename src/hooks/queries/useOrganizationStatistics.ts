import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { useOrganization } from '@/contexts/OrganizationContext'

interface OrganizationStatistics {
  activeMembersCount: number
  onboardedMembersCount: number
  totalDrills: number
  totalPracticePlans: number
  totalCoachingGroups: number
  avgDrillsPerActiveMember: number
  avgPlansPerActiveMember: number
  lastRefreshed: string | null
}

async function fetchOrganizationStatistics(organizationId: string): Promise<OrganizationStatistics> {
  const supabase = createClient()
  
  // Try to fetch from the materialized view first
  const { data: mvData, error: mvError } = await supabase
    .from('organization_statistics_mv')
    .select(`
      active_members,
      onboarded_members,
      total_drills,
      total_practice_plans,
      total_coaching_groups,
      avg_drills_per_active_member,
      avg_plans_per_active_member,
      last_refreshed
    `)
    .eq('organization_id', organizationId)
    .single()

  // If materialized view has data, use it
  if (!mvError && mvData) {
    return {
      activeMembersCount: mvData.active_members || 0,
      onboardedMembersCount: mvData.onboarded_members || 0,
      totalDrills: mvData.total_drills || 0,
      totalPracticePlans: mvData.total_practice_plans || 0,
      totalCoachingGroups: mvData.total_coaching_groups || 0,
      avgDrillsPerActiveMember: mvData.avg_drills_per_active_member || 0,
      avgPlansPerActiveMember: mvData.avg_plans_per_active_member || 0,
      lastRefreshed: mvData.last_refreshed,
    }
  }

  // Fallback: Query the data directly from tables
  // Get active members (members who have user_id set, meaning they've logged in)
  const { count: activeMembers } = await supabase
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .not('user_id', 'is', null)
    .is('removed_at', null)

  // Get onboarded members (members with user profiles)
  const { count: onboardedMembers } = await supabase
    .from('organization_members')
    .select(`
      *,
      user_profiles!inner(*)
    `, { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .is('removed_at', null)

  // Get total drills
  const { count: totalDrills } = await supabase
    .from('drills')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  // Get total practice plans
  const { count: totalPlans } = await supabase
    .from('practice_plans')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  // Get total coaching groups
  const { count: totalGroups } = await supabase
    .from('coaching_groups')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .is('deleted_at', null)

  const activeMemberCount = activeMembers || 0
  const avgDrills = activeMemberCount > 0 ? (totalDrills || 0) / activeMemberCount : 0
  const avgPlans = activeMemberCount > 0 ? (totalPlans || 0) / activeMemberCount : 0

  return {
    activeMembersCount: activeMemberCount,
    onboardedMembersCount: onboardedMembers || 0,
    totalDrills: totalDrills || 0,
    totalPracticePlans: totalPlans || 0,
    totalCoachingGroups: totalGroups || 0,
    avgDrillsPerActiveMember: avgDrills,
    avgPlansPerActiveMember: avgPlans,
    lastRefreshed: new Date().toISOString(),
  }
}

export function useOrganizationStatistics() {
  const { organizationId } = useOrganization()

  return useQuery({
    queryKey: ['organization-statistics', organizationId],
    queryFn: () => fetchOrganizationStatistics(organizationId!),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}