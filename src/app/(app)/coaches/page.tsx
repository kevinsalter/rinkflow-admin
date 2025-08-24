'use client'

import { useState } from 'react'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { UserPlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useOrganization } from '@/contexts/OrganizationContext'
import { useCoaches } from '@/hooks/queries/useCoaches'
import { Database } from '@/types/database.types'

type OrganizationMember = Database['public']['Tables']['organization_members']['Row']

export default function CoachesPage() {
  const { organization } = useOrganization()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Fetch coaches/members using the custom hook
  const { data, isLoading, error } = useCoaches({
    searchTerm,
    page: currentPage,
    pageSize: itemsPerPage
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'purple'
      case 'owner':
        return 'amber'
      case 'coach':
        return 'blue'
      default:
        return 'zinc'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!organization) {
    return (
      <div>
        <Heading>Coaches</Heading>
        <div className="mt-8 text-zinc-500">Loading organization...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Heading>Coaches</Heading>
        <div className="flex gap-2">
          <Button outline>
            <ArrowDownTrayIcon className="h-4 w-4" />
            Import CSV
          </Button>
          <Button outline>
            <ArrowUpTrayIcon className="h-4 w-4" />
            Export CSV
          </Button>
          <Button color="dark/zinc">
            <UserPlusIcon className="h-4 w-4" />
            Add Coach
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {/* Search bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-zinc-500">Loading coaches...</div>
        ) : error ? (
          <div className="text-red-600">Error loading coaches: {(error as Error).message}</div>
        ) : (
          <>
            <Table className="[--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
              <TableHead>
                <TableRow>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Joined</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-500">
                      No coaches found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.members.map((member: OrganizationMember) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.email || 'No email'}
                      </TableCell>
                      <TableCell>
                        <Badge color={getRoleBadgeColor(member.role)}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge color={member.joined_at ? 'green' : 'yellow'}>
                          {member.joined_at ? 'Active' : 'Invited'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-500">
                        {formatDate(member.joined_at || member.invited_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          plain
                          className="text-red-600 hover:text-red-700"
                          disabled={member.role === 'owner'}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-zinc-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, data.totalCount)} of{' '}
                  {data.totalCount} coaches
                </div>
                <div className="flex gap-2">
                  <Button
                    outline
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    outline
                    disabled={currentPage === data.totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}