import { useQuery } from '@tanstack/react-query'
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
  const response = await fetch(`/api/stats/advanced?organizationId=${organizationId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch organization statistics')
  }

  return response.json()
}

export function useOrganizationStatistics() {
  const { organizationId } = useOrganization()

  return useQuery({
    queryKey: ['organization-statistics', organizationId],
    queryFn: () => fetchOrganizationStatistics(organizationId!),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}