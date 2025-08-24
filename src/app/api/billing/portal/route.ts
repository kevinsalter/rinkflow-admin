import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization ID from request body
    const { organizationId } = await request.json()
    
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    // Verify user is admin of this organization
    const { data: membership, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .is('removed_at', null)
      .single()

    if (memberError || !membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get organization's Stripe customer ID
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', organizationId)
      .single()

    if (orgError || !org || !org.stripe_customer_id) {
      return NextResponse.json({ error: 'No Stripe customer found for this organization' }, { status: 404 })
    }

    // Create Stripe billing portal session
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: org.stripe_customer_id,
        return_url: `${request.headers.get('origin')}/billing`,
      })

      return NextResponse.json({ url: session.url })
    } catch (stripeError: any) {
      console.error('Stripe error creating billing portal session:', stripeError)
      
      // Check if it's a configuration error
      if (stripeError.message?.includes('portal configuration')) {
        return NextResponse.json(
          { error: 'Stripe Customer Portal is not configured. Please configure it in your Stripe Dashboard.' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: stripeError.message || 'Failed to create billing portal session' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error in billing portal route:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}