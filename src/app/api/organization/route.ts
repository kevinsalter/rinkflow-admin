import { NextResponse } from 'next/server'
import { createClient, createServiceRoleClient } from '@/lib/supabase-server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Authenticate with regular client
    const authClient = await createClient()
    const { data: { user }, error: authError } = await authClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { organization: null, role: null, organizationId: null },
        { status: 200 }
      )
    }

    // Use service role to bypass RLS for fast queries
    const supabase = await createServiceRoleClient()

    const { data: membership } = await supabase
      .from('organization_member_analytics')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle()

    if (!membership?.organization_id) {
      return NextResponse.json({
        organization: null,
        role: null,
        organizationId: null
      })
    }

    const { data: organization } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', membership.organization_id)
      .maybeSingle()

    if (!organization) {
      return NextResponse.json({
        organization: null,
        role: null,
        organizationId: null
      })
    }

    return NextResponse.json({
      organization,
      role: membership.role,
      organizationId: organization.id
    })
  } catch (error) {
    console.error('[API /organization] Error:', error)
    return NextResponse.json(
      { organization: null, role: null, organizationId: null },
      { status: 200 }
    )
  }
}
