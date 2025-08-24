'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useOrganization } from '@/contexts/OrganizationContext'

interface AuditEvent {
  id: string
  timestamp: string
  action: string
  details: string
  user_email: string | null
}

interface AuditLogPage {
  events: AuditEvent[]
  nextCursor: string | null
  hasMore: boolean
}

interface UseAuditLogOptions {
  pageSize?: number
}

export function useAuditLog(options: UseAuditLogOptions = {}) {
  const { organization } = useOrganization()
  const pageSize = options.pageSize || 25

  return useInfiniteQuery({
    queryKey: ['auditLog', organization?.id, pageSize],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      if (!organization?.id) {
        throw new Error('Organization not found')
      }

      const params = new URLSearchParams({
        organizationId: organization.id,
        pageSize: pageSize.toString()
      })
      
      if (pageParam) {
        params.append('cursor', pageParam)
      }

      const response = await fetch(`/api/audit-log?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit log')
      }

      return response.json() as Promise<AuditLogPage>
    },
    enabled: !!organization?.id,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60, // Refetch every minute to get new events
  })
}