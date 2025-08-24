'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import type { Tables } from '@/types/database.types'

interface OrganizationContextType {
  organization: Tables<'organizations'> | null
  organizationId: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
  userRole: string | null
  isAdmin: boolean
  isMember: boolean
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}

interface OrganizationProviderProps {
  children: ReactNode
}

async function fetchUserOrganization() {
  const supabase = createClient()
  
  // First get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // Get user's organization membership
  const { data: membership, error: memberError } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .is('removed_at', null)
    .single()

  if (memberError || !membership) {
    // User might not be part of any organization yet
    return { organization: null, role: null, organizationId: null }
  }

  // Get organization details
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', membership.organization_id)
    .single()

  if (orgError || !organization) {
    throw new Error('Organization not found')
  }

  return {
    organization,
    role: membership.role,
    organizationId: organization.id,
  }
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  // Get initial user and listen for auth changes
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const {
    data,
    isLoading: queryLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['organization', userId],
    queryFn: fetchUserOrganization,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Show loading state while we're fetching user or organization data
  const isLoading = !userId || queryLoading

  const value: OrganizationContextType = {
    organization: data?.organization || null,
    organizationId: data?.organizationId || null,
    isLoading,
    error: error as Error | null,
    refetch: () => { 
      refetch() 
    },
    userRole: data?.role || null,
    isAdmin: data?.role === 'admin' || data?.role === 'owner',
    isMember: !!data?.role,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}