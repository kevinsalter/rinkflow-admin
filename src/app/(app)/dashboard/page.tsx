'use client'

import { Heading } from '@/components/heading'
import { Badge } from '@/components/badge'
import { InfoTooltip } from '@/components/info-tooltip'
import { Skeleton } from '@/components/skeleton'
import { useOrganization } from '@/contexts/OrganizationContext'
import { useOrganizationStats } from '@/hooks/queries/useOrganizationStats'
import { useOrganizationStatistics } from '@/hooks/queries/useOrganizationStatistics'

export default function Dashboard() {
  const { organization, isLoading, error } = useOrganization()
  const { data: stats, isLoading: statsLoading } = useOrganizationStats()
  const { data: orgStats, isLoading: orgStatsLoading } = useOrganizationStatistics()

  console.log('[Dashboard] Render state:', { isLoading, hasOrg: !!organization, statsLoading, orgStatsLoading })

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <Heading>Dashboard</Heading>
          <div className="mt-6 flex items-center justify-between">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        
        {/* Metrics Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Coaches Skeleton */}
          <div className="rounded-lg border border-zinc-950/5 dark:border-white/5 p-4">
            <Skeleton className="h-4 w-24" />
            <div className="mt-2 flex items-baseline gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          {/* Seat Usage Skeleton */}
          <div className="rounded-lg border border-zinc-950/5 dark:border-white/5 p-4">
            <Skeleton className="h-4 w-20" />
            <div className="mt-2 flex items-baseline gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="mt-3">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="mt-1 h-3 w-20" />
            </div>
          </div>

          {/* Active Members Skeleton */}
          <div className="rounded-lg border border-zinc-950/5 dark:border-white/5 p-4">
            <Skeleton className="h-4 w-28" />
            <div className="mt-2 flex items-baseline gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Platform Usage Skeleton */}
        <div className="mt-8">
          <Skeleton className="h-6 w-32" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-4">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-7 w-12" />
                </div>
                <Skeleton className="mt-1 h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Heading>Dashboard</Heading>
        <div className="mt-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading dashboard
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error.message || 'Unable to load organization data. Please try again.'}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/70"
                  >
                    Refresh page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div>
        <Heading>Dashboard</Heading>
        <div className="mt-8">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  No organization found
                </h3>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>Unable to load organization data. This may be a configuration issue.</p>
                </div>
                <div className="mt-3">
                  <a
                    href="mailto:support@rinkflow.com?subject=Admin%20Dashboard%20-%20No%20Organization%20Found"
                    className="text-sm font-medium text-zinc-900 underline hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
                  >
                    Contact support →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Heading>Dashboard</Heading>
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            {organization.name}
          </h2>
          <Badge 
            className="px-2 py-1"
            color={
              organization.subscription_status === 'active' ? 'lime' : 
              organization.subscription_status === 'trialing' ? 'sky' :
              organization.subscription_status === 'past_due' ? 'amber' :
              organization.subscription_status === 'canceled' ? 'rose' : 'zinc'
            }
          >
            {organization.subscription_status ? 
              organization.subscription_status.charAt(0).toUpperCase() + 
              organization.subscription_status.slice(1).replace('_', ' ') : 
              'No Subscription'}
          </Badge>
        </div>
      </div>
      
      {/* Metrics Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Coaches */}
            <div className="rounded-lg border border-zinc-950/5 dark:border-white/5 p-4">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Total Coaches
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-zinc-950 dark:text-white">
                  {statsLoading ? '—' : stats?.coachCount || 0}
                </span>
                <span className="text-sm text-zinc-500">coaches</span>
              </div>
            </div>

            {/* Seat Usage */}
            <div className="rounded-lg border border-zinc-950/5 dark:border-white/5 p-4">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Seat Usage
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-zinc-950 dark:text-white">
                  {statsLoading ? '—' : stats?.memberCount || 0}
                </span>
                <span className="text-sm text-zinc-500">
                  / {organization.seat_limit || '∞'} seats
                </span>
              </div>
              {organization.seat_limit && (
                <div className="mt-3">
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
                  <p className="mt-1 text-xs text-zinc-500">
                    {statsLoading ? 'Loading...' : 
                      `${Math.round(((stats?.memberCount || 0) / organization.seat_limit) * 100)}% utilized`}
                  </p>
                </div>
              )}
            </div>

            {/* Active Members */}
            <div className="rounded-lg border border-zinc-950/5 dark:border-white/5 p-4">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Active Members
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-zinc-950 dark:text-white">
                  {statsLoading ? '—' : stats?.memberCount || 0}
                </span>
                <span className="text-sm text-zinc-500">members</span>
              </div>
            </div>
      </div>

      {/* Platform Usage Section */}
      <div className="mt-8">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
          Platform Usage
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Active Members */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Active Members
              </span>
              <InfoTooltip content="Members who have accepted their invitation and logged in at least once" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-zinc-950 dark:text-white">
                {orgStatsLoading ? '—' : orgStats?.activeMembersCount || 0}
              </span>
              <span className="text-sm text-zinc-500">
                / {stats?.memberCount || 0} total
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {stats?.memberCount && stats.memberCount > 0 
                ? `${Math.round((orgStats?.activeMembersCount || 0) / stats.memberCount * 100)}% engagement`
                : 'No members yet'}
            </p>
          </div>

          {/* Onboarded Members */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Onboarded Members
              </span>
              <InfoTooltip content="Members who have completed their profile setup" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
              {orgStatsLoading ? '—' : orgStats?.onboardedMembersCount || 0}
            </div>
            <p className="mt-1 text-xs text-zinc-500">completed setup</p>
          </div>

          {/* Total Drills */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Total Drills
              </span>
              <InfoTooltip content="Total number of drills created by members in this organization" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
              {orgStatsLoading ? '—' : orgStats?.totalDrills || 0}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {orgStatsLoading ? '' : orgStats?.activeMembersCount ? `avg ${orgStats.avgDrillsPerActiveMember?.toFixed(0)} per user` : 'total drills'}
            </p>
          </div>

          {/* Practice Plans */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Practice Plans
              </span>
              <InfoTooltip content="Total number of practice plans created by members in this organization" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
              {orgStatsLoading ? '—' : orgStats?.totalPracticePlans || 0}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {orgStatsLoading ? '' : orgStats?.activeMembersCount ? `avg ${orgStats.avgPlansPerActiveMember?.toFixed(0)} per user` : 'total plans'}
            </p>
          </div>

          {/* Coaching Groups */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Coaching Groups
              </span>
              <InfoTooltip content="Number of coaching groups or teams created within the organization" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
              {orgStatsLoading ? '—' : orgStats?.totalCoachingGroups || 0}
            </div>
            <p className="mt-1 text-xs text-zinc-500">organizational units</p>
          </div>

          {/* Pending Invites */}
          <div className="rounded-lg border border-zinc-950/10 dark:border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Pending Invites
              </div>
              {(stats?.pendingInvites || 0) > 0 && (
                <Badge color="amber" className="text-xs">
                  Action needed
                </Badge>
              )}
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
              {statsLoading ? '—' : stats?.pendingInvites || 0}
            </div>
            <p className="mt-1 text-xs text-zinc-500">awaiting response</p>
          </div>
        </div>
      </div>
    </div>
  )
}