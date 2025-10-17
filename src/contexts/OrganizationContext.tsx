'use client'

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react'
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
  const response = await fetch('/api/organization', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch organization: ${response.status}`)
  }

  const data = await response.json()
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

  const value: OrganizationContextType = useMemo(() => ({
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
  }), [data?.organization, data?.organizationId, data?.role, isLoading, error, refetch])

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}
