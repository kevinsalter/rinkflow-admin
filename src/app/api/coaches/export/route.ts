import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import Papa from 'papaparse'

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

    // Use regular client for database operations (user must have access to the org)
    const supabase = await createClient()

    // Fetch all coaches/members for the organization
    const { data: members, error: fetchError } = await supabase
      .from('organization_members')
      .select('email, role, joined_at, invited_at, created_at')
      .eq('organization_id', organizationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching coaches for export:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch coaches' },
        { status: 500 }
      )
    }

    if (!members || members.length === 0) {
      // Return empty CSV with just headers
      const csvData = Papa.unparse([
        ['Email', 'Role', 'Status', 'Date Added']
      ])
      
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="coaches-export.csv"',
        },
      })
    }

    // Transform data for CSV export
    const csvRows = members.map(member => ({
      Email: member.email || '',
      Role: member.role || 'coach',
      Status: member.joined_at ? 'Active' : 'Invited',
      'Date Added': member.created_at ? new Date(member.created_at).toLocaleDateString('en-US') : ''
    }))

    // Generate CSV using papaparse
    const csvData = Papa.unparse(csvRows, {
      header: true,
      skipEmptyLines: true
    })

    // Return CSV file as download
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="coaches-export-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    })

  } catch (error) {
    console.error('Error in GET /api/coaches/export:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}