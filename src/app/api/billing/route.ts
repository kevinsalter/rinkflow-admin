import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization ID from query params
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organizationId')
    
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    // Verify user is admin of this organization
    const { data: membership, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .single()

    if (memberError || !membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get organization's Stripe IDs
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', organizationId)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let subscription: any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let invoices: any[] = []

    // Fetch subscription details from Stripe if available
    if (org.stripe_subscription_id) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          org.stripe_subscription_id,
          {
            expand: ['items.data.price']
          }
        )
        
        subscription = {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          current_period_end: (stripeSubscription as any).current_period_end,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          current_period_start: (stripeSubscription as any).current_period_start,
          items: stripeSubscription.items,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cancel_at_period_end: (stripeSubscription as any).cancel_at_period_end,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          canceled_at: (stripeSubscription as any).canceled_at,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          trial_end: (stripeSubscription as any).trial_end,
        }
      } catch (stripeError) {
        console.error('Error fetching subscription from Stripe:', stripeError)
      }
    }

    // Fetch invoices from Stripe if customer exists
    if (org.stripe_customer_id) {
      try {
        const stripeInvoices = await stripe.invoices.list({
          customer: org.stripe_customer_id,
          limit: 10,
        })
        
        invoices = stripeInvoices.data.map(invoice => ({
          id: invoice.id,
          number: invoice.number,
          status: invoice.status,
          total: invoice.total,
          currency: invoice.currency,
          created: invoice.created,
          period_end: invoice.period_end,
          period_start: invoice.period_start,
          invoice_pdf: invoice.invoice_pdf,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }))
      } catch (stripeError) {
        console.error('Error fetching invoices from Stripe:', stripeError)
      }
    }

    return NextResponse.json({
      subscription,
      invoices,
    })
  } catch (error) {
    console.error('Error in billing API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}