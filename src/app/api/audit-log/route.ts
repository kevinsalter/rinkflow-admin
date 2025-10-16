import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase-server'

interface MemberData {
  id: string | null
  email: string | null
  username: string | null
  user_id: string | null
  role: string | null
  invited_at: string | null
  joined_at: string | null
  deleted_at: string | null
  organization_id: string | null
  created_at?: string
  updated_at?: string
  invited_by?: string | null
}

interface AuditEvent {
  id: string
  timestamp: string
  action: string
  details: string
  user_email: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organizationId')
    const pageSize = parseInt(searchParams.get('pageSize') || '25')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    // Build the query for organization member events using the analytics view
    // This view joins organization_members with user_profiles to get email/username
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('organization_member_analytics')
      .select(`
        id,
        email,
        username,
        user_id,
        role,
        invited_at,
        joined_at,
        deleted_at,
        organization_id
      `)
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: false })
      .limit(pageSize * 3) // Get more records since we'll generate multiple events per member

    if (analyticsError) {
      console.error('Error fetching audit log from analytics:', analyticsError)
      return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 })
    }

    // Now get the created_at timestamps from organization_members for accurate event times
    const memberIds = analyticsData?.map(m => m.id).filter((id): id is string => Boolean(id)) || []
    let members: MemberData[] = []

    if (memberIds.length > 0) {
      const { data: membersData, error: membersError } = await supabase
        .from('organization_members')
        .select('id, created_at, updated_at, invited_by')
        .in('id', memberIds)

      if (membersError) {
        console.error('Error fetching member timestamps:', membersError)
        return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 })
      }

      // Merge analytics data with timestamps
      members = analyticsData?.map(analytics => {
        const memberData = membersData?.find(m => m.id === analytics.id)
        return {
          ...analytics,
          created_at: memberData?.created_at,
          updated_at: memberData?.updated_at,
          invited_by: memberData?.invited_by
        }
      }) || []
    }

    // Get unique inviter IDs to fetch their emails from user_profiles
    const inviterIds = members
      ? [...new Set(members.map(m => m.invited_by).filter((id): id is string => Boolean(id)))]
      : []
    const inviters = new Map<string, string>()

    if (inviterIds.length > 0) {
      const { data: inviterData } = await supabase
        .from('user_profiles')
        .select('id, email, username')
        .in('id', inviterIds)

      inviterData?.forEach(inviter => {
        if (inviter.id) {
          // Use email if available, fallback to username
          inviters.set(inviter.id, inviter.email || inviter.username)
        }
      })
    }

    // Transform member data into audit events
    const events: AuditEvent[] = []

    for (const member of members || []) {
      const inviterName = member.invited_by ? inviters.get(member.invited_by) : null
      // Use email if available, fallback to username
      const memberDisplayName = member.email || member.username || 'Unknown User'

      // Member was removed
      if (member.deleted_at) {
        events.push({
          id: `${member.id}-removed`,
          timestamp: member.deleted_at,
          action: 'Member Removed',
          details: `${memberDisplayName} was removed from the organization`,
          user_email: inviterName || 'System'
        })
      }

      // Member joined (accepted invitation)
      if (member.joined_at && member.joined_at !== member.created_at) {
        events.push({
          id: `${member.id}-joined`,
          timestamp: member.joined_at,
          action: 'Member Joined',
          details: `${memberDisplayName} accepted their invitation and joined`,
          user_email: memberDisplayName
        })
      }

      // Member was invited (initial creation)
      if (member.created_at) {
        events.push({
          id: `${member.id}-invited`,
          timestamp: member.created_at,
          action: member.joined_at ? 'Member Added' : 'Member Invited',
          details: member.joined_at
            ? `${memberDisplayName} was added to the organization as ${member.role}`
            : `${memberDisplayName} was invited to join as ${member.role}`,
          user_email: inviterName || 'System'
        })
      }
    }

    // Sort events by timestamp (most recent first)
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Take only the requested page size after sorting
    const paginatedEvents = events.slice(0, pageSize)

    // Determine if there are more events
    const hasMore = members && members.length === pageSize
    const nextCursor = hasMore && paginatedEvents.length > 0 
      ? paginatedEvents[paginatedEvents.length - 1].timestamp 
      : null

    return NextResponse.json({
      events: paginatedEvents,
      nextCursor,
      hasMore: !!hasMore
    })

  } catch (error) {
    console.error('Audit log API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}