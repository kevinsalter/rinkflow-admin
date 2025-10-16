import { createClient, createServiceRoleClient } from '@/lib/supabase-server'
import { ApplicationLayout } from './application-layout'
import { OrganizationProvider } from '@/contexts/OrganizationContext'

async function fetchServerOrganization() {
  try {
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()

    if (!user) {
      console.log('[ServerLayout] No user found')
      return null
    }

    console.log('[ServerLayout] Fetching organization for user:', user.id)

    // Use service role to bypass RLS
    const supabase = await createServiceRoleClient()

    const { data: membership, error: memberError } = await supabase
      .from('organization_member_analytics')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (memberError || !membership?.organization_id) {
      console.log('[ServerLayout] No membership found:', memberError)
      return null
    }

    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', membership.organization_id)
      .single()

    if (orgError || !organization) {
      console.log('[ServerLayout] Organization not found:', orgError)
      return null
    }

    console.log('[ServerLayout] Successfully fetched organization:', organization.id)

    return {
      organization,
      role: membership.role,
      organizationId: organization.id
    }
  } catch (error) {
    console.error('[ServerLayout] Error fetching organization:', error)
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialOrganization = await fetchServerOrganization()

  return (
    <OrganizationProvider initialData={initialOrganization}>
      <ApplicationLayout>{children}</ApplicationLayout>
    </OrganizationProvider>
  )
}
