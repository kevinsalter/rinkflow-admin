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
  console.log('[OrganizationContext] Fetching organization via API')

  const start = Date.now()
  const response = await fetch('/api/organization', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  console.log(`[OrganizationContext] API request completed in ${Date.now() - start}ms`)

  if (!response.ok) {
    throw new Error(`Failed to fetch organization: ${response.status}`)
  }

  const data = await response.json()
  console.log('[OrganizationContext] API response data:', data)
  return data
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    retryDelay: 1000,
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

  console.log('[OrganizationContext] Context value:', {
    hasOrganization: !!data?.organization,
    organizationId: data?.organizationId,
    isLoading,
    userId,
    queryLoading,
    role: data?.role
  })

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}
