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
  const response = await fetch(`/api/stats?organizationId=${organizationId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch organization stats')
  }

  return response.json()
}

export function useOrganizationStats() {
  const { organizationId } = useOrganization()

  return useQuery({
    queryKey: ['organization-stats', organizationId],
    queryFn: () => fetchOrganizationStats(organizationId!),
    enabled: !!organizationId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}