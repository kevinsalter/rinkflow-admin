import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceRoleClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { email, organizationId } = await request.json()

    if (!email || !organizationId) {
      return NextResponse.json(
        { error: 'Email and organization ID are required' },
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

    // Use service role client to bypass RLS
    const supabase = await createServiceRoleClient()
    
    // Check if member already exists
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('email', email)
      .is('deleted_at', null)
      .single()

    if (existingMember) {
      return NextResponse.json(
        { error: 'This email is already a member of your organization' },
        { status: 400 }
      )
    }

    // Check seat limit
    const { data: org } = await supabase
      .from('organizations')
      .select('seat_limit')
      .eq('id', organizationId)
      .single()

    if (org?.seat_limit) {
      const { count: currentMemberCount } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .is('deleted_at', null)

      if (currentMemberCount && currentMemberCount >= org.seat_limit) {
        return NextResponse.json(
          { error: `Your organization has reached its seat limit of ${org.seat_limit} members. Please upgrade your plan to add more coaches.` },
          { status: 403 }
        )
      }
    }

    // Direct insert with service role (bypasses RLS)
    const { data, error } = await supabase
      .from('organization_members')
      .insert({
        email,
        organization_id: organizationId,
        role: 'coach',
        invited_at: new Date().toISOString(),
        invited_by: user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding coach:', error)
      // Don't expose technical details to the client
      return NextResponse.json(
        { error: 'Unable to add coach. Please try again later.' },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/coaches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '25')
    const searchTerm = searchParams.get('search') || ''

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

    // Use regular client for database operations
    const supabase = await createClient()

    let query = supabase
      .from('organization_members')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    // Apply search filter
    if (searchTerm) {
      query = query.ilike('email', `%${searchTerm}%`)
    }

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching coaches:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      members: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    })
  } catch (error) {
    console.error('Error in GET /api/coaches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const organizationId = searchParams.get('organizationId')

    if (!memberId || !organizationId) {
      return NextResponse.json(
        { error: 'Member ID and organization ID are required' },
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

    // Use service role client to bypass RLS
    const supabase = await createServiceRoleClient()

    // Check if member exists and belongs to this organization
    const { data: member } = await supabase
      .from('organization_members')
      .select('id, role')
      .eq('id', memberId)
      .eq('organization_id', organizationId)
      .single()

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Prevent removing owners
    if (member.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove organization owner' },
        { status: 403 }
      )
    }

    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from('organization_members')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', memberId)
      .eq('organization_id', organizationId)

    if (error) {
      console.error('Error removing coach:', error)
      return NextResponse.json(
        { error: 'Unable to remove coach. Please try again later.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/coaches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}