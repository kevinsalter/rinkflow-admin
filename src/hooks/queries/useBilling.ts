import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@/contexts/OrganizationContext'

interface SubscriptionData {
  id: string
  status: string
  current_period_end: number
  current_period_start: number
  items: {
    data: Array<{
      price: {
        id: string
        nickname: string | null
        recurring: {
          interval: string
          interval_count: number
        } | null
        unit_amount: number | null
        currency: string
      }
      quantity: number
    }>
  }
  cancel_at_period_end: boolean
  canceled_at: number | null
  trial_end: number | null
}

interface InvoiceData {
  id: string
  number: string | null
  status: string
  total: number
  currency: string
  created: number
  period_end: number
  period_start: number
  invoice_pdf: string | null
  hosted_invoice_url: string | null
}

interface BillingData {
  subscription: SubscriptionData | null
  invoices: InvoiceData[]
}

async function fetchBillingData(organizationId: string): Promise<BillingData> {
  const response = await fetch(`/api/billing?organizationId=${organizationId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch billing data')
  }
  
  return response.json()
}

export function useBilling() {
  const { organizationId } = useOrganization()
  
  return useQuery({
    queryKey: ['billing', organizationId],
    queryFn: () => fetchBillingData(organizationId!),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}