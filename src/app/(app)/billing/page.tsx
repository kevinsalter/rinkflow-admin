'use client'

import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'
import { DescriptionList, DescriptionDetails, DescriptionTerm } from '@/components/description-list'
import { Skeleton } from '@/components/skeleton'
import { useOrganization } from '@/contexts/OrganizationContext'
import { useOrganizationStats } from '@/hooks/queries/useOrganizationStats'
import { useBilling } from '@/hooks/queries/useBilling'

export default function BillingPage() {
  const { organization, isLoading: orgLoading } = useOrganization()
  const { data: stats, isLoading: statsLoading } = useOrganizationStats()
  const { data: billingData, isLoading: billingLoading } = useBilling()


  const getStatusColor = (status: string | null) => {
    switch(status) {
      case 'active': return 'lime'
      case 'trialing': return 'sky'
      case 'past_due': return 'amber'
      case 'canceled': return 'rose'
      default: return 'zinc'
    }
  }

  const formatStatus = (status: string | null) => {
    if (!status) return 'No Subscription'
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
  }

  if (orgLoading || statsLoading) {
    return (
      <>
        <Heading>Billing</Heading>
        
        <div className="mt-8 space-y-6">
          {/* Seat Usage Skeleton */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <Skeleton className="h-4 w-28" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>

          {/* Subscription Plan Skeleton */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices Skeleton */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-6">
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Heading>Billing</Heading>
      
      <div className="mt-8 space-y-6">
        {/* Seat Usage Card */}
        <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Seat Usage
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Active Members
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-zinc-950 dark:text-white">
                  {statsLoading ? '—' : stats?.memberCount || 0}
                </span>
                <span className="text-sm text-zinc-500">
                  / {orgLoading ? '—' : (organization?.seat_limit || '∞')} seats
                </span>
              </div>
            </div>

            {!orgLoading && organization?.seat_limit && (
              <>
                <div className="w-full">
                  <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        ((stats?.memberCount || 0) / organization.seat_limit) > 0.9 
                          ? 'bg-amber-600' 
                          : ((stats?.memberCount || 0) / organization.seat_limit) > 0.75 
                          ? 'bg-yellow-600' 
                          : 'bg-blue-600'
                      }`}
                      style={{ 
                        width: statsLoading ? '0%' : 
                          `${Math.min(100, ((stats?.memberCount || 0) / organization.seat_limit) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-zinc-500">
                    <span>
                      {statsLoading ? 'Loading...' : 
                        `${Math.round(((stats?.memberCount || 0) / organization.seat_limit) * 100)}% utilized`}
                    </span>
                    <span>
                      {organization.seat_limit - (stats?.memberCount || 0)} seats available
                    </span>
                  </div>
                </div>

                {((stats?.memberCount || 0) / organization.seat_limit) > 0.9 && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-3">
                    <div className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-medium">Approaching seat limit</p>
                        <p className="mt-1">You're using {Math.round(((stats?.memberCount || 0) / organization.seat_limit) * 100)}% of your available seats. Consider upgrading your plan to add more seats.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {!orgLoading && !organization?.seat_limit && (
              <Text className="text-sm">
                Your plan includes unlimited seats.
              </Text>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Subscription Plan
            </h2>
            <Badge color={getStatusColor(organization?.subscription_status || null)}>
              {formatStatus(organization?.subscription_status || null)}
            </Badge>
          </div>
          
          <DescriptionList>
            {billingData?.subscription && (
              <>
                <DescriptionTerm>Plan</DescriptionTerm>
                <DescriptionDetails>
                  {billingData.subscription.items.data[0]?.price.nickname || 'Custom Plan'}
                </DescriptionDetails>

                <DescriptionTerm>Billing Period</DescriptionTerm>
                <DescriptionDetails>
                  {billingData.subscription.items.data[0]?.price.recurring?.interval === 'month' ? 'Monthly' :
                   billingData.subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'Yearly' :
                   'Custom'}
                </DescriptionDetails>

                <DescriptionTerm>Next Billing Date</DescriptionTerm>
                <DescriptionDetails>
                  {billingData.subscription.current_period_end ? 
                    new Date(billingData.subscription.current_period_end * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not set'}
                </DescriptionDetails>

                {billingData.subscription.trial_end && (
                  <>
                    <DescriptionTerm>Trial Ends</DescriptionTerm>
                    <DescriptionDetails>
                      {new Date(billingData.subscription.trial_end * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </DescriptionDetails>
                  </>
                )}
              </>
            )}
          </DescriptionList>
        </div>

        <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Recent Invoices
          </h2>
          <Text className="mt-2">
            View and download your billing history
          </Text>
        </div>
      </div>
    </>
  )
}