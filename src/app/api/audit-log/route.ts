import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organizationId')
    const pageSize = parseInt(searchParams.get('pageSize') || '25')
    const cursor = searchParams.get('cursor')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    // Build the query for organization member events
    let query = supabase
      .from('organization_members')
      .select(`
        id,
        email,
        role,
        created_at,
        updated_at,
        invited_at,
        joined_at,
        deleted_at,
        invited_by
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(pageSize)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data: members, error } = await query

    if (error) {
      console.error('Error fetching audit log:', error)
      return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 })
    }

    // Get unique inviter IDs to fetch their emails
    const inviterIds = members ? [...new Set(members.map(m => m.invited_by).filter(Boolean))] : []
    const inviters = new Map()
    
    if (inviterIds.length > 0) {
      const { data: inviterData } = await supabase
        .from('organization_members')
        .select('user_id, email')
        .in('user_id', inviterIds)
        .eq('organization_id', organizationId)
      
      inviterData?.forEach(inviter => {
        if (inviter.user_id) {
          inviters.set(inviter.user_id, inviter.email)
        }
      })
    }

    // Transform member data into audit events
    const events = []
    
    for (const member of members || []) {
      const inviterEmail = member.invited_by ? inviters.get(member.invited_by) : null

      // Member was removed
      if (member.deleted_at) {
        events.push({
          id: `${member.id}-removed`,
          timestamp: member.deleted_at,
          action: 'Member Removed',
          details: `${member.email} was removed from the organization`,
          user_email: inviterEmail || 'System'
        })
      }

      // Member joined (accepted invitation)
      if (member.joined_at && member.joined_at !== member.created_at) {
        events.push({
          id: `${member.id}-joined`,
          timestamp: member.joined_at,
          action: 'Member Joined',
          details: `${member.email} accepted their invitation and joined`,
          user_email: member.email
        })
      }

      // Member was invited (initial creation)
      events.push({
        id: `${member.id}-invited`,
        timestamp: member.created_at,
        action: member.joined_at ? 'Member Added' : 'Member Invited',
        details: member.joined_at 
          ? `${member.email} was added to the organization as ${member.role}`
          : `${member.email} was invited to join as ${member.role}`,
        user_email: inviterEmail || 'System'
      })
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