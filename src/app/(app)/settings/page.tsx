'use client'

import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { useAuditLog } from '@/hooks/queries/useAuditLog'
import { useOrganization } from '@/contexts/OrganizationContext'
import { formatDistanceToNow } from 'date-fns'

export default function SettingsPage() {
  const { organization } = useOrganization()
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useAuditLog({
    pageSize: 25
  })

  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'member added':
        return 'green'
      case 'member removed':
        return 'red'
      case 'member invited':
        return 'blue'
      case 'member joined':
        return 'purple'
      default:
        return 'zinc'
    }
  }

  // Show skeleton when organization is loading OR when audit log is loading
  const showSkeleton = !organization || isLoading

  return (
    <div>
      <Heading>Settings</Heading>

      <div className="mt-8">
        <div className="mb-6">
          <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
            Audit Log
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Recent organizational activities and changes
          </p>
        </div>

        {showSkeleton ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="w-[15%]">Timestamp</TableHeader>
                <TableHeader className="w-[15%]">Action</TableHeader>
                <TableHeader className="w-[60%]">Details</TableHeader>
                <TableHeader className="w-[10%]">User</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 12 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="w-[15%] text-zinc-500 text-sm">
                    <div className="h-4 w-14 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="w-[60%] font-medium">
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="w-[10%] text-zinc-500">
                    <div className="h-4 w-10 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : error ? (
          <div className="text-red-600">Error loading audit log: {(error as Error).message}</div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="w-[15%]">Timestamp</TableHeader>
                <TableHeader className="w-[15%]">Action</TableHeader>
                <TableHeader className="w-[60%]">Details</TableHeader>
                <TableHeader className="w-[10%]">User</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.pages.flatMap((page: any) => page.events).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-zinc-500">
                    No audit events found
                  </TableCell>
                </TableRow>
              ) : (
                data?.pages.flatMap((page: any) => page.events).map((event: any) => (
                  <TableRow key={event.id}>
                    <TableCell className="text-zinc-500 text-sm">
                      {formatRelativeTime(event.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge color={getActionBadgeColor(event.action)}>
                        {event.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {event.details}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {event.user_email || 'System'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {!showSkeleton && hasNextPage && (
          <div className="mt-6 flex justify-center">
            <Button
              outline
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
