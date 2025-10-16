import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { useOrganization } from '@/contexts/OrganizationContext'
import { Database } from '@/types/database.types'

type OrganizationMember = Database['public']['Views']['organization_member_analytics']['Row']

interface UseCoachesOptions {
  searchTerm?: string
  page?: number
  pageSize?: number
}

interface CoachesData {
  members: OrganizationMember[]
  totalCount: number
  totalPages: number
}

export function useCoaches({ searchTerm = '', page = 1, pageSize = 50 }: UseCoachesOptions = {}) {
  const { organization } = useOrganization()

  return useQuery<CoachesData>({
    queryKey: ['coaches', organization?.id, page, searchTerm, pageSize],
    queryFn: async () => {
      if (!organization?.id) throw new Error('No organization')

      console.log('[useCoaches] Fetching coaches via API for org:', organization.id)

      const params = new URLSearchParams({
        organizationId: organization.id,
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const start = Date.now()
      const response = await fetch(`/api/coaches?${params.toString()}`)
      console.log(`[useCoaches] API request completed in ${Date.now() - start}ms, status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[useCoaches] API error:', errorText)
        throw new Error('Failed to fetch coaches')
      }

      const data = await response.json()
      console.log('[useCoaches] Coaches data:', data)
      return data
    },
    enabled: !!organization?.id,
    placeholderData: (previousData) => previousData,
  })
}

export function useAddCoach() {
  const { organization } = useOrganization()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (email: string) => {
      if (!organization?.id) throw new Error('No organization')

      const response = await fetch('/api/coaches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          organizationId: organization.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add coach')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches', organization?.id] })
      queryClient.invalidateQueries({ queryKey: ['memberCount', organization?.id] })
    },
  })
}

export function useRemoveCoach() {
  const { organization } = useOrganization()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memberId: string) => {
      if (!organization?.id) throw new Error('No organization')

      const response = await fetch(`/api/coaches?memberId=${memberId}&organizationId=${organization.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove coach')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches', organization?.id] })
      queryClient.invalidateQueries({ queryKey: ['memberCount', organization?.id] })
    },
  })
}

export function useBulkAddCoaches() {
  const { organization } = useOrganization()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (emails: string[]) => {
      if (!organization?.id) throw new Error('No organization')

      // Use the bulk add function from the database
      const { data, error } = await supabase
        .rpc('bulk_add_organization_members_with_rate_limit', {
          p_emails: emails,
          p_organization_id: organization.id,
          p_role: 'coach'
        })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches', organization?.id] })
      queryClient.invalidateQueries({ queryKey: ['memberCount', organization?.id] })
    },
  })
}

export function useMemberCount() {
  const { organization } = useOrganization()

  return useQuery({
    queryKey: ['memberCount', organization?.id],
    queryFn: async () => {
      if (!organization?.id) throw new Error('No organization')

      const response = await fetch(`/api/coaches?organizationId=${organization.id}&page=1&pageSize=1`)

      if (!response.ok) {
        throw new Error('Failed to fetch member count')
      }

      const data = await response.json()
      return data.totalCount || 0
    },
    enabled: !!organization?.id,
  })
}