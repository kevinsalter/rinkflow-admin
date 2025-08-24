import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { useOrganization } from '@/contexts/OrganizationContext'
import { Database } from '@/types/database.types'

type OrganizationMember = Database['public']['Tables']['organization_members']['Row']

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
  const supabase = createClient()

  return useQuery<CoachesData>({
    queryKey: ['coaches', organization?.id, page, searchTerm, pageSize],
    queryFn: async () => {
      if (!organization?.id) throw new Error('No organization')
      
      let query = supabase
        .from('organization_members')
        .select('*', { count: 'exact' })
        .eq('organization_id', organization.id)
        .is('removed_at', null)
        .order('created_at', { ascending: false })

      // Apply search filter
      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%`)
      }

      // Pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        members: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
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
    },
  })
}

export function useMemberCount() {
  const { organization } = useOrganization()
  const supabase = createClient()

  return useQuery({
    queryKey: ['memberCount', organization?.id],
    queryFn: async () => {
      if (!organization?.id) throw new Error('No organization')
      
      const { count } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organization.id)
        .is('removed_at', null)

      return count || 0
    },
    enabled: !!organization?.id,
  })
}