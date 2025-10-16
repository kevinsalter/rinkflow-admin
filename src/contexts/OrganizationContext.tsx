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

async function fetchUserOrganization(userId: string, userEmail?: string) {
  const supabase = createClient()

  console.log('[OrganizationContext] Fetching organization for user:', userId)

  // Query organization_member_analytics view which has better performance
  // Add timeout monitoring to track if queries are taking too long
  const membershipQueryStart = Date.now()
  const timeoutWarning = setTimeout(() => {
    console.error('[OrganizationContext] Membership query timeout after 5 seconds')
  }, 5000)

  const { data: membershipByUserId, error: memberError } = await supabase
    .from('organization_member_analytics')
    .select('organization_id, role')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .single()

  clearTimeout(timeoutWarning)
  const membershipQueryDuration = Date.now() - membershipQueryStart
  console.log(`[OrganizationContext] Membership query completed in ${membershipQueryDuration}ms`)

  if (memberError) {
    console.log('[OrganizationContext] Membership query error:', memberError)
  }

  let membership = membershipByUserId

  // If not found by user_id, try by email (for invited users who haven't joined yet)
  if ((memberError || !membership) && userEmail) {
    const emailQueryStart = Date.now()
    const emailTimeout = setTimeout(() => {
      console.error('[OrganizationContext] Email membership query timeout after 5 seconds')
    }, 5000)

    const { data: emailMembership, error: emailError } = await supabase
      .from('organization_member_analytics')
      .select('organization_id, role')
      .eq('email', userEmail)
      .is('deleted_at', null)
      .single()

    clearTimeout(emailTimeout)
    console.log(`[OrganizationContext] Email membership query completed in ${Date.now() - emailQueryStart}ms`)

    if (!emailError && emailMembership) {
      membership = emailMembership

      // Update the membership record with user_id and joined_at if found by email
      // Note: This would need service role permissions, but for now we'll skip the update
      // The user will still be able to access the organization based on their email match
      if (emailMembership.organization_id) {
        try {
          await supabase
            .from('organization_members')
            .update({
              user_id: userId,
              joined_at: new Date().toISOString()
            })
            .eq('email', userEmail)
            .eq('organization_id', emailMembership.organization_id)
            .is('deleted_at', null)
        } catch {
          // If update fails, we still have membership data, so continue
          console.log('Could not update membership record, but user can still access organization')
        }
      }
    }
  }

  if (!membership || !membership.organization_id) {
    // User might not be part of any organization yet
    return { organization: null, role: null, organizationId: null }
  }

  // Get organization details
  const orgQueryStart = Date.now()
  const orgTimeout = setTimeout(() => {
    console.error('[OrganizationContext] Organization query timeout after 5 seconds')
  }, 5000)

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', membership.organization_id)
    .single()

  clearTimeout(orgTimeout)
  console.log(`[OrganizationContext] Organization query completed in ${Date.now() - orgQueryStart}ms`)

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
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined)
  const supabase = createClient()

  // Get initial user and listen for auth changes
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      setUserEmail(user?.email)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null)
      setUserEmail(session?.user?.email)
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
    queryFn: async () => {
      if (!userId) throw new Error('No user ID')
      return fetchUserOrganization(userId, userEmail)
    },
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

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}
