'use client'

import { useState } from 'react'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { UserPlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useOrganization } from '@/contexts/OrganizationContext'
import { useCoaches, useAddCoach, useRemoveCoach } from '@/hooks/queries/useCoaches'
import { Database } from '@/types/database.types'
import { Dialog, DialogTitle, DialogDescription, DialogBody, DialogActions } from '@/components/dialog'
import { Field, Label } from '@/components/fieldset'
import { ErrorMessage } from '@/components/fieldset'
import { InfoTooltip } from '@/components/info-tooltip'

type OrganizationMember = Database['public']['Tables']['organization_members']['Row']

export default function CoachesPage() {
  const { organization } = useOrganization()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCoachEmail, setNewCoachEmail] = useState('')
  const [addCoachError, setAddCoachError] = useState('')
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<OrganizationMember | null>(null)
  const itemsPerPage = 25

  // Fetch coaches/members using the custom hook
  const { data, isLoading, error } = useCoaches({
    searchTerm,
    page: currentPage,
    pageSize: itemsPerPage
  })

  // Add coach mutation
  const addCoachMutation = useAddCoach()
  
  // Remove coach mutation
  const removeCoachMutation = useRemoveCoach()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setNewCoachEmail(email)
    
    // Clear error when user types a valid email
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(email)) {
        setAddCoachError('')
      }
    }
  }

  const handleEmailBlur = () => {
    if (newCoachEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(newCoachEmail)) {
        setAddCoachError('Please enter a valid email address')
      }
    }
  }

  const handleAddCoach = async () => {
    if (!newCoachEmail.trim()) {
      setAddCoachError('Email is required')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newCoachEmail)) {
      setAddCoachError('Please enter a valid email address')
      return
    }

    try {
      setAddCoachError('')
      await addCoachMutation.mutateAsync(newCoachEmail)
      setNewCoachEmail('')
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding coach:', error)
      // Never show technical errors to users
      setAddCoachError('Unable to add coach at this time. Please try again later or contact Rinkflow support.')
    }
  }

  const openAddModal = () => {
    setNewCoachEmail('')
    setAddCoachError('')
    setIsAddModalOpen(true)
  }

  const openRemoveModal = (member: OrganizationMember) => {
    setMemberToRemove(member)
    setIsRemoveModalOpen(true)
  }

  const handleRemoveCoach = async () => {
    if (!memberToRemove) return

    try {
      await removeCoachMutation.mutateAsync(memberToRemove.id)
      setIsRemoveModalOpen(false)
      setMemberToRemove(null)
    } catch (error) {
      console.error('Error removing coach:', error)
      // Could add error toast here
    }
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
          <Button color="dark/zinc" onClick={openAddModal}>
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
                        {member.role === 'owner' ? (
                          <InfoTooltip content="Owners cannot be removed" position="left">
                            <Button
                              plain
                              className="text-zinc-400 cursor-not-allowed"
                              disabled
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </InfoTooltip>
                        ) : (
                          <Button
                            plain
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                            onClick={() => openRemoveModal(member)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
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

      {/* Add Coach Modal */}
      <Dialog open={isAddModalOpen} onClose={setIsAddModalOpen} size="xl">
        <DialogTitle>Add a new coach to your organization</DialogTitle>
        <DialogBody>
          <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/50 dark:bg-sky-950/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-sky-800 dark:text-sky-200">
                  Next Steps Required
                </h3>
                <div className="mt-2 text-sm text-sky-700 dark:text-sky-300">
                  <p>After adding this coach, you must:</p>
                  <ol className="mt-1 list-decimal list-inside space-y-1">
                    <li>Personally email them (no automatic email will be sent)</li>
                    <li>Ask them to download the Rinkflow app (iOS or Android)</li>
                    <li>Have them sign in with this email address</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <Field>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={newCoachEmail}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="coach@example.com"
              invalid={!!addCoachError}
              autoFocus
            />
            {addCoachError && <ErrorMessage>{addCoachError}</ErrorMessage>}
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <button 
            onClick={handleAddCoach}
            disabled={addCoachMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white cursor-pointer transition-all duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-800"
          >
            {addCoachMutation.isPending ? 'Adding...' : 'Add Coach'}
          </button>
        </DialogActions>
      </Dialog>

      {/* Remove Coach Confirmation Dialog */}
      <Dialog open={isRemoveModalOpen} onClose={setIsRemoveModalOpen}>
        <DialogTitle>Remove Coach</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove <span className="font-semibold text-zinc-900 dark:text-zinc-100">{memberToRemove?.email}</span> from your organization? They will lose access to all organization resources.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setIsRemoveModalOpen(false)}>
            Cancel
          </Button>
          <button 
            onClick={handleRemoveCoach}
            disabled={removeCoachMutation.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white cursor-pointer transition-all duration-150 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-800"
          >
            {removeCoachMutation.isPending ? 'Removing...' : 'Remove Coach'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  )
}