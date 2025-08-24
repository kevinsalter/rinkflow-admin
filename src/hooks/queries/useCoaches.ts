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
        query = query.or(`email.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%`)
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
  })
}

export function useAddCoach() {
  const { organization } = useOrganization()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (email: string) => {
      if (!organization?.id) throw new Error('No organization')

      const { data, error } = await supabase
        .from('organization_members')
        .insert({
          email,
          organization_id: organization.id,
          role: 'coach',
          invited_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches', organization?.id] })
    },
  })
}

export function useRemoveCoach() {
  const { organization } = useOrganization()
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (memberId: string) => {
      if (!organization?.id) throw new Error('No organization')

      const { error } = await supabase
        .from('organization_members')
        .update({ removed_at: new Date().toISOString() })
        .eq('id', memberId)
        .eq('organization_id', organization.id)

      if (error) throw error
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