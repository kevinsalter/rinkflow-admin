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

  console.log('[OrganizationContext] Fetching user...')

  // Use getSession() instead of getUser() for client-side
  // getSession() reads from local storage and is much faster
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('[OrganizationContext] Session error:', sessionError)
    throw new Error('User not authenticated')
  }

  const user = session?.user

  if (!session || !user) {
    console.log('[OrganizationContext] No session found')
    throw new Error('User not authenticated')
  }

  console.log('[OrganizationContext] Session found, fetching membership for user:', user.id)

  // Add timeout to membership query
  const membershipTimeout = new Promise<null>((resolve) => {
    setTimeout(() => {
      console.error('[OrganizationContext] Membership query timeout after 5 seconds')
      resolve(null)
    }, 5000)
  })

  // Get user's organization membership - first try by user_id
  const membershipQuery = supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  const result = await Promise.race([membershipQuery, membershipTimeout])

  if (result === null) {
    console.error('[OrganizationContext] Database query timed out - possible RLS or connection issue')
    throw new Error('Database connection timeout - please contact support')
  }

  const { data: membershipByUserId, error: memberError } = result

  if (memberError) {
    console.log('[OrganizationContext] Membership query error:', memberError)
  }

  let membership = membershipByUserId

  // If not found by user_id, try by email (for invited users who haven't joined yet)
  if ((memberError || !membership) && user.email) {
    const { data: emailMembership, error: emailError } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('email', user.email)
      .is('deleted_at', null)
      .single()

    if (!emailError && emailMembership) {
      membership = emailMembership
      
      // Update the membership record with user_id and joined_at if found by email
      // Note: This would need service role permissions, but for now we'll skip the update
      // The user will still be able to access the organization based on their email match
      try {
        await supabase
          .from('organization_members')
          .update({ 
            user_id: user.id,
            joined_at: new Date().toISOString()
          })
          .eq('email', user.email)
          .eq('organization_id', emailMembership.organization_id)
          .is('deleted_at', null)
      } catch {
        // If update fails, we still have membership data, so continue
        console.log('Could not update membership record, but user can still access organization')
      }
    }
  }

  if (!membership) {
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