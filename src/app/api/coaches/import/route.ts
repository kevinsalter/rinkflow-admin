import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceRoleClient } from '@/lib/supabase-server'

interface ImportResult {
  success: number
  failed: number
  errors: string[]
  duplicates: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { emails, organizationId } = await request.json()

    if (!Array.isArray(emails) || emails.length === 0 || !organizationId) {
      return NextResponse.json(
        { error: 'Emails array and organization ID are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmails = emails.filter(email => 
      typeof email === 'string' && emailRegex.test(email.trim())
    ).map(email => email.trim().toLowerCase())

    if (validEmails.length === 0) {
      return NextResponse.json(
        { error: 'No valid email addresses provided' },
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
    
    // Check organization and seat limit
    const { data: org } = await supabase
      .from('organizations')
      .select('seat_limit')
      .eq('id', organizationId)
      .single()

    if (!org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Get current member count
    const { count: currentMemberCount } = await supabase
      .from('organization_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .is('removed_at', null)

    const currentCount = currentMemberCount || 0

    // Check if import would exceed seat limit
    if (org.seat_limit) {
      if (currentCount + validEmails.length > org.seat_limit) {
        return NextResponse.json(
          { 
            error: `Adding ${validEmails.length} coaches would exceed your seat limit of ${org.seat_limit}. You can add up to ${org.seat_limit - currentCount} more coaches.`,
            availableSeats: org.seat_limit - currentCount
          },
          { status: 403 }
        )
      }
    }

    // Check for existing members
    const { data: existingMembers } = await supabase
      .from('organization_members')
      .select('email')
      .eq('organization_id', organizationId)
      .is('removed_at', null)
      .in('email', validEmails)

    const existingEmails = new Set(existingMembers?.map(m => m.email) || [])
    const newEmails = validEmails.filter(email => !existingEmails.has(email))
    const duplicateEmails = validEmails.filter(email => existingEmails.has(email))

    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      duplicates: duplicateEmails
    }

    // If no new emails to add, return early
    if (newEmails.length === 0) {
      return NextResponse.json({
        result,
        message: duplicateEmails.length > 0 
          ? 'All provided emails are already members of your organization'
          : 'No new emails to add'
      })
    }

    // Batch insert new members
    try {
      const membersToInsert = newEmails.map(email => ({
        email,
        organization_id: organizationId,
        role: 'coach',
        invited_at: new Date().toISOString(),
        invited_by: user.id
      }))

      const { data: insertedMembers, error: insertError } = await supabase
        .from('organization_members')
        .insert(membersToInsert)
        .select('email')

      if (insertError) {
        console.error('Error inserting members:', insertError)
        result.failed = newEmails.length
        result.errors.push('Failed to add coaches to database')
      } else {
        result.success = insertedMembers?.length || 0
        result.failed = newEmails.length - result.success
        
        if (result.failed > 0) {
          result.errors.push(`${result.failed} coaches could not be added`)
        }
      }

    } catch (error) {
      console.error('Error in bulk insert:', error)
      result.failed = newEmails.length
      result.errors.push('Database error occurred during import')
    }

    // Generate summary message
    let message = ''
    if (result.success > 0) {
      message += `Successfully imported ${result.success} coaches. `
    }
    if (result.duplicates.length > 0) {
      message += `${result.duplicates.length} emails were already members. `
    }
    if (result.failed > 0) {
      message += `${result.failed} emails failed to import. `
    }

    const statusCode = result.success > 0 ? 200 : (result.failed > 0 ? 400 : 200)

    return NextResponse.json({
      result,
      message: message.trim(),
      totalProcessed: validEmails.length
    }, { status: statusCode })

  } catch (error) {
    console.error('Error in POST /api/coaches/import:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}