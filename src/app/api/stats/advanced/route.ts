import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceRoleClient } from '@/lib/supabase-server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Check if user is authenticated using regular client
    const authClient = await createClient()
    const { data: { user }, error: authError } = await authClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use service role client to bypass RLS for fast queries
    const supabase = await createServiceRoleClient()

    // Try to fetch from the materialized view first
    const { data: mvData, error: mvError } = await supabase
      .from('organization_statistics_mv')
      .select('active_members,onboarded_members,total_drills,total_practice_plans,total_coaching_groups,drills_per_active_member,last_refreshed')
      .eq('organization_id', organizationId)
      .maybeSingle()

    // If materialized view has data, use it
    if (!mvError && mvData) {
      const activeMembers = mvData.active_members || 0
      const totalPlans = mvData.total_practice_plans || 0
      const avgPlans = activeMembers > 0 ? totalPlans / activeMembers : 0

      return NextResponse.json({
        activeMembersCount: activeMembers,
        onboardedMembersCount: mvData.onboarded_members || 0,
        totalDrills: mvData.total_drills || 0,
        totalPracticePlans: totalPlans,
        totalCoachingGroups: mvData.total_coaching_groups || 0,
        avgDrillsPerActiveMember: mvData.drills_per_active_member || 0,
        avgPlansPerActiveMember: avgPlans,
        lastRefreshed: mvData.last_refreshed,
      })
    }

    // Fallback: Query the data directly from tables
    const { count: activeMembers } = await supabase
      .from('organization_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .not('user_id', 'is', null)
      .is('deleted_at', null)

    const { count: onboardedMembers } = await supabase
      .from('organization_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .not('user_id', 'is', null)

    const { count: totalDrills } = await supabase
      .from('drills')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null)

    const { count: totalPlans } = await supabase
      .from('practice_plans')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null)

    const { count: totalGroups } = await supabase
      .from('coaching_groups')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('deleted_at', null)

    const activeMemberCount = activeMembers || 0
    const avgDrills = activeMemberCount > 0 ? (totalDrills || 0) / activeMemberCount : 0
    const avgPlans = activeMemberCount > 0 ? (totalPlans || 0) / activeMemberCount : 0

    return NextResponse.json({
      activeMembersCount: activeMemberCount,
      onboardedMembersCount: onboardedMembers || 0,
      totalDrills: totalDrills || 0,
      totalPracticePlans: totalPlans || 0,
      totalCoachingGroups: totalGroups || 0,
      avgDrillsPerActiveMember: avgDrills,
      avgPlansPerActiveMember: avgPlans,
      lastRefreshed: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[API /stats/advanced] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
