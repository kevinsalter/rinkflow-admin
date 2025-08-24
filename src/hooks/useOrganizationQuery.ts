import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { useOrganization } from '@/contexts/OrganizationContext'

/**
 * Custom hook that automatically includes organization_id in queries
 */
export function useOrganizationQuery<TData = unknown, TError = unknown>(
  queryKey: unknown[],
  queryFn: (organizationId: string) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  const { organizationId, isMember } = useOrganization()

  return useQuery<TData, TError>({
    queryKey: [...queryKey, organizationId],
    queryFn: async () => {
      if (!organizationId) {
        throw new Error('No organization ID available')
      }
      return queryFn(organizationId)
    },
    enabled: !!organizationId && isMember && (options?.enabled !== false),
    ...options,
  })
}

/**
 * Custom hook for mutations that require organization context
 */
export function useOrganizationMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
>(
  mutationFn: (variables: TVariables & { organizationId: string }) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  const { organizationId } = useOrganization()

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      if (!organizationId) {
        throw new Error('No organization ID available')
      }
      return mutationFn({ ...variables, organizationId })
    },
    ...options,
  })
}