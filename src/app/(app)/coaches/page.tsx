'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Badge } from '@/components/badge'
import { UserPlusIcon, MagnifyingGlassIcon, ArrowUpTrayIcon, TrashIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { useOrganization } from '@/contexts/OrganizationContext'
import { useCoaches, useAddCoach, useRemoveCoach, useMemberCount, useBulkAddCoaches } from '@/hooks/queries/useCoaches'
import { Database } from '@/types/database.types'
import { Dialog, DialogTitle, DialogDescription, DialogBody, DialogActions } from '@/components/dialog'
import { Field, Label } from '@/components/fieldset'
import { ErrorMessage } from '@/components/fieldset'
import { InfoTooltip } from '@/components/info-tooltip'

type OrganizationMember = Database['public']['Views']['organization_member_analytics']['Row']

export default function CoachesPage() {
  const { organization } = useOrganization()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCoachEmail, setNewCoachEmail] = useState('')
  const [addCoachError, setAddCoachError] = useState('')
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<OrganizationMember | null>(null)
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false)
  const [bulkEmails, setBulkEmails] = useState('')
  const [bulkAddError, setBulkAddError] = useState('')
  const [bulkAddMode, setBulkAddMode] = useState<'text' | 'csv'>('text')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvParsedData, setCsvParsedData] = useState<string[]>([])
  const [csvValidationResults, setCsvValidationResults] = useState<{
    validEmails: string[]
    invalidEmails: string[]
    duplicatesInFile: string[]
    totalRows: number
  } | null>(null)
  const [showCsvPreview, setShowCsvPreview] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const itemsPerPage = 25

  // Fetch coaches/members using the custom hook
  const { data, isLoading, error } = useCoaches({
    searchTerm,
    page: currentPage,
    pageSize: itemsPerPage
  })

  console.log('[CoachesPage] useCoaches state:', { hasData: !!data, isLoading, hasError: !!error, hasOrg: !!organization })

  // Add coach mutation
  const addCoachMutation = useAddCoach()
  
  // Remove coach mutation
  const removeCoachMutation = useRemoveCoach()

  // Bulk add coaches mutation
  const bulkAddCoachesMutation = useBulkAddCoaches()

  // Member count for seat limit validation
  const { data: memberCount } = useMemberCount()

  // Check if at seat limit
  const isAtSeatLimit = organization?.seat_limit && memberCount ? memberCount >= organization.seat_limit : false

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

  const openBulkAddModal = () => {
    setBulkEmails('')
    setBulkAddError('')
    setBulkAddMode('text')
    setCsvFile(null)
    setCsvParsedData([])
    setCsvValidationResults(null)
    setShowCsvPreview(false)
    setIsDragOver(false)
    setIsBulkAddModalOpen(true)
  }

  const handleBulkAddCoaches = async () => {
    if (!bulkEmails.trim()) {
      setBulkAddError('Please enter at least one email address')
      return
    }

    // Parse emails from textarea (split by newlines, commas, or spaces)
    const emailList = bulkEmails
      .split(/[\n,\s]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0)

    if (emailList.length === 0) {
      setBulkAddError('Please enter at least one valid email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = emailList.filter(email => !emailRegex.test(email))
    
    if (invalidEmails.length > 0) {
      setBulkAddError(`Invalid email addresses: ${invalidEmails.join(', ')}`)
      return
    }

    // Check if bulk add would exceed seat limit
    if (organization?.seat_limit && memberCount) {
      const wouldExceedLimit = (memberCount + emailList.length) > organization.seat_limit
      if (wouldExceedLimit) {
        setBulkAddError(`Adding ${emailList.length} coaches would exceed your seat limit of ${organization.seat_limit}. You can add up to ${organization.seat_limit - memberCount} more coaches.`)
        return
      }
    }

    try {
      setBulkAddError('')
      await bulkAddCoachesMutation.mutateAsync(emailList)
      setBulkEmails('')
      setIsBulkAddModalOpen(false)
    } catch (error) {
      console.error('Error adding coaches:', error)
      setBulkAddError('Unable to add coaches at this time. Please try again later or contact Rinkflow support.')
    }
  }

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setCsvFile(null)
      setCsvParsedData([])
      setCsvValidationResults(null)
      setShowCsvPreview(false)
      setBulkAddError('')
      return
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setBulkAddError('Please select a CSV file')
      setCsvFile(null)
      setCsvParsedData([])
      setCsvValidationResults(null)
      setShowCsvPreview(false)
      return
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setBulkAddError('File size must be less than 1MB')
      setCsvFile(null)
      setCsvParsedData([])
      setCsvValidationResults(null)
      setShowCsvPreview(false)
      return
    }

    setCsvFile(file)
    setBulkAddError('')

    // Parse CSV file
    Papa.parse(file, {
      complete: (results) => {
        const allEmails: string[] = []
        const validEmails: string[] = []
        const invalidEmails: string[] = []
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const seenEmails = new Set<string>()
        const duplicatesInFile: string[] = []

        let totalRows = 0

        // Process each row
        results.data.forEach((row: unknown, index) => {
          if (Array.isArray(row) && row.length > 0) {
            totalRows++
            const email = row[0]?.toString().trim().toLowerCase()
            
            // Skip header row (first row) if it contains common header terms
            if (index === 0 && (email === 'email' || email === 'emails' || email === 'email address' || email === 'e-mail')) {
              return
            }
            
            if (email) {
              allEmails.push(email)
              
              if (emailRegex.test(email)) {
                if (seenEmails.has(email)) {
                  // This is a duplicate - add to duplicates list but don't add to valid emails
                  if (!duplicatesInFile.includes(email)) {
                    duplicatesInFile.push(email)
                  }
                } else {
                  // First occurrence - add to both seen emails and valid emails
                  seenEmails.add(email)
                  validEmails.push(email)
                }
              } else {
                invalidEmails.push(email)
              }
            }
          }
        })

        // validEmails already contains only unique emails (first occurrence of each)
        const uniqueValidEmails = validEmails

        const validationResults = {
          validEmails: uniqueValidEmails,
          invalidEmails,
          duplicatesInFile,
          totalRows
        }

        setCsvValidationResults(validationResults)
        setCsvParsedData(uniqueValidEmails)

        if (uniqueValidEmails.length === 0 && (invalidEmails.length > 0 || duplicatesInFile.length > 0)) {
          setBulkAddError('No valid unique email addresses found in CSV file')
          setShowCsvPreview(false)
        } else if (uniqueValidEmails.length === 0) {
          setBulkAddError('No email addresses found in CSV file')
          setShowCsvPreview(false)
        } else {
          setBulkAddError('')
          setShowCsvPreview(true)
        }
      },
      error: (error) => {
        setBulkAddError(`Error parsing CSV: ${error.message}`)
        setCsvParsedData([])
        setCsvValidationResults(null)
        setShowCsvPreview(false)
      },
      header: false,
      skipEmptyLines: true,
    })
  }

  const handleCsvUpload = async () => {
    if (csvParsedData.length === 0) {
      setBulkAddError('Please select a valid CSV file with email addresses')
      return
    }

    if (!organization?.id) {
      setBulkAddError('Organization not found')
      return
    }

    try {
      setBulkAddError('')
      setIsImporting(true)
      
      const response = await fetch('/api/coaches/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: csvParsedData,
          organizationId: organization.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setBulkAddError(data.error || 'Failed to import coaches')
        return
      }

      // Show success message with details
      if (data.result.success > 0) {
        // Refresh the coaches list
        window.location.reload() // Simple refresh for now
        
        setCsvFile(null)
        setCsvParsedData([])
        setCsvValidationResults(null)
        setShowCsvPreview(false)
        setIsBulkAddModalOpen(false)
        
        // You could show a more detailed success toast here
        console.log('Import successful:', data.message)
      } else {
        setBulkAddError(data.message || 'No coaches were imported')
      }

    } catch (error) {
      console.error('Error importing coaches:', error)
      setBulkAddError('Unable to import coaches at this time. Please try again later or contact Rinkflow support.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleExportCsv = async () => {
    if (!organization?.id) {
      console.error('No organization ID')
      return
    }

    setIsExporting(true)
    
    try {
      const response = await fetch(`/api/coaches/export?organizationId=${organization.id}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to export coaches')
      }

      // Get the CSV data as blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
      link.download = `coaches-export-${timestamp}.csv`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error exporting coaches:', error)
      // You could show an error toast here
    } finally {
      setIsExporting(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      // Create a synthetic event to reuse the existing file change handler
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      
      handleCsvFileChange(syntheticEvent)
    }
  }

  const openRemoveModal = (member: OrganizationMember) => {
    setMemberToRemove(member)
    setIsRemoveModalOpen(true)
  }

  const handleRemoveCoach = async () => {
    if (!memberToRemove || !memberToRemove.id) return

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
        return 'orange'
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

  const showSkeleton = !organization || isLoading

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <Heading>Coaches</Heading>
          {!showSkeleton && organization?.seat_limit && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {memberCount || 0} of {organization.seat_limit} seats used
              {isAtSeatLimit && (
                <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                  • Seat limit reached
                </span>
              )}
            </p>
          )}
          {showSkeleton && (
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            outline 
            disabled={showSkeleton || isExporting} 
            className={showSkeleton ? "pointer-events-none" : ""}
            onClick={showSkeleton ? undefined : handleExportCsv}
          >
            <ArrowUpTrayIcon className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          {!showSkeleton && isAtSeatLimit ? (
            <InfoTooltip content={`Your organization has reached its seat limit of ${organization?.seat_limit} members. Please upgrade your plan to add more coaches.`} position="bottom">
              <Button outline disabled className="cursor-not-allowed opacity-50">
                <UserPlusIcon className="h-4 w-4" />
                Import
              </Button>
            </InfoTooltip>
          ) : (
            <Button 
              outline 
              disabled={showSkeleton} 
              className={showSkeleton ? "pointer-events-none" : ""}
              onClick={showSkeleton ? undefined : openBulkAddModal}
            >
              <UserPlusIcon className="h-4 w-4" />
              Import
            </Button>
          )}
          {!showSkeleton && isAtSeatLimit ? (
            <InfoTooltip content={`Your organization has reached its seat limit of ${organization?.seat_limit} members. Please upgrade your plan to add more coaches.`} position="bottom">
              <Button color="dark/zinc" disabled className="cursor-not-allowed opacity-50">
                <UserPlusIcon className="h-4 w-4" />
                Add Coach
              </Button>
            </InfoTooltip>
          ) : (
            <Button 
              color="dark/zinc" 
              disabled={showSkeleton} 
              onClick={showSkeleton ? undefined : openAddModal}
              className={showSkeleton ? "pointer-events-none" : ""}
            >
              <UserPlusIcon className="h-4 w-4" />
              Add Coach
            </Button>
          )}
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
              className={`pl-10 ${showSkeleton ? "pointer-events-none" : ""}`}
              disabled={showSkeleton}
            />
          </div>
        </div>

        {/* Table */}
        {showSkeleton ? (
          <Table className="[--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
            <TableHead>
              <TableRow>
                <TableHeader className="w-[40%]">Email</TableHeader>
                <TableHeader className="w-[15%]">Role</TableHeader>
                <TableHeader className="w-[15%]">Status</TableHeader>
                <TableHeader className="w-[20%]">Joined</TableHeader>
                <TableHeader className="w-[10%] text-right">Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 12 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : error ? (
          <div className="text-red-600">Error loading coaches: {(error as Error).message}</div>
        ) : (
          <>
            <Table className="[--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
              <TableHead>
                <TableRow>
                  <TableHeader className="w-[40%]">Email</TableHeader>
                  <TableHeader className="w-[15%]">Role</TableHeader>
                  <TableHeader className="w-[15%]">Status</TableHeader>
                  <TableHeader className="w-[20%]">Joined</TableHeader>
                  <TableHeader className="w-[10%] text-right">Actions</TableHeader>
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
                        <Badge color={getRoleBadgeColor(member.role || 'member')}>
                          {member.role || 'member'}
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
                        {(member.role || '') === 'owner' ? (
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
          <Button plain onClick={() => setIsAddModalOpen(false)} className="cursor-pointer">
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
          <Button plain onClick={() => setIsRemoveModalOpen(false)} className="cursor-pointer">
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

      {/* Import Coaches Modal */}
      <Dialog open={isBulkAddModalOpen} onClose={setIsBulkAddModalOpen} size="2xl">
        <DialogTitle>Import coaches to your organization</DialogTitle>
        <DialogBody>
          {/* Mode Selection Tabs */}
          <div className="mb-6 flex space-x-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              onClick={() => setBulkAddMode('text')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                bulkAddMode === 'text'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              Bulk Add (Text)
            </button>
            <button
              onClick={() => setBulkAddMode('csv')}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                bulkAddMode === 'csv'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              CSV Upload
            </button>
          </div>

          {bulkAddMode === 'text' ? (
            <>
              <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/50 dark:bg-sky-950/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-sky-800 dark:text-sky-200">
                      Instructions
                    </h3>
                    <div className="mt-2 text-sm text-sky-700 dark:text-sky-300">
                      <p>Enter multiple email addresses below (one per line, or separated by commas/spaces):</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li>Each coach will be added to your organization</li>
                        <li>No automatic email will be sent - you must contact them directly</li>
                        <li>They&apos;ll need to download the Rinkflow app and sign in</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <Field>
                <Label>Email Addresses</Label>
                <textarea
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  placeholder={`coach1@example.com
coach2@example.com
coach3@example.com`}
                  className="min-h-[120px] w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
                  autoFocus
                />
                {bulkAddError && <ErrorMessage>{bulkAddError}</ErrorMessage>}
              </Field>
            </>
          ) : (
            <>
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      CSV File Format
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>Upload a CSV file with one email address per row:</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li>First column should contain email addresses</li>
                        <li>Headers are optional and will be skipped</li>
                        <li>Invalid emails will be ignored</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Field>
                <Label>CSV File</Label>
                <div className="mt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`cursor-pointer flex justify-center items-center px-6 py-8 border-2 border-dashed rounded-lg transition-colors ${
                      isDragOver
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500'
                    }`}
                  >
                    <div className="text-center">
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-zinc-400" />
                      <div className="mt-4">
                        {csvFile && csvValidationResults ? (
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {csvFile.name}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              {csvValidationResults.validEmails.length} valid emails
                              {csvValidationResults.invalidEmails.length > 0 && (
                                <span className="text-red-500"> • {csvValidationResults.invalidEmails.length} invalid</span>
                              )}
                              {csvValidationResults.duplicatesInFile.length > 0 && (
                                <span className="text-amber-500"> • {csvValidationResults.duplicatesInFile.length} duplicates</span>
                              )}
                            </p>
                          </div>
                        ) : csvFile ? (
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {csvFile.name}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Processing...
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-zinc-900 dark:text-zinc-100">
                              {isDragOver ? 'Drop CSV file here' : 'Click to upload or drag & drop a CSV file'}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Max file size: 1MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {bulkAddError && <ErrorMessage>{bulkAddError}</ErrorMessage>}
                
                {csvFile && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setCsvFile(null)
                        setCsvParsedData([])
                        setCsvValidationResults(null)
                        setShowCsvPreview(false)
                        setBulkAddError('')
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      Clear File
                    </button>
                  </div>
                )}
                
                {showCsvPreview && csvValidationResults && (
                  <div className="mt-4 space-y-4">
                    {/* Validation Summary */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <div className="font-medium text-green-800 dark:text-green-200">Valid Emails</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {csvValidationResults.validEmails.length}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">Ready to import</div>
                      </div>
                      
                      {(csvValidationResults.invalidEmails.length > 0 || csvValidationResults.duplicatesInFile.length > 0) && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                          <div className="font-medium text-amber-800 dark:text-amber-200">Issues Found</div>
                          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {csvValidationResults.invalidEmails.length + csvValidationResults.duplicatesInFile.length}
                          </div>
                          <div className="text-xs text-amber-600 dark:text-amber-400">Will be skipped</div>
                        </div>
                      )}
                    </div>

                    {/* Valid Emails Preview */}
                    {csvValidationResults.validEmails.length > 0 && (
                      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                          Valid Emails Preview ({csvValidationResults.validEmails.length}):
                        </h4>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 max-h-32 overflow-y-auto">
                          {csvValidationResults.validEmails.slice(0, 10).map((email, index) => (
                            <div key={index} className="font-mono">{email}</div>
                          ))}
                          {csvValidationResults.validEmails.length > 10 && (
                            <div className="font-medium">+ {csvValidationResults.validEmails.length - 10} more...</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Invalid Emails */}
                    {csvValidationResults.invalidEmails.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                          Invalid Emails ({csvValidationResults.invalidEmails.length}):
                        </h4>
                        <div className="text-xs text-red-600 dark:text-red-400 space-y-1 max-h-24 overflow-y-auto">
                          {csvValidationResults.invalidEmails.slice(0, 5).map((email, index) => (
                            <div key={index} className="font-mono">{email}</div>
                          ))}
                          {csvValidationResults.invalidEmails.length > 5 && (
                            <div className="font-medium">+ {csvValidationResults.invalidEmails.length - 5} more...</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Duplicate Emails */}
                    {csvValidationResults.duplicatesInFile.length > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                          Duplicate Emails ({csvValidationResults.duplicatesInFile.length}):
                        </h4>
                        <div className="text-xs text-amber-600 dark:text-amber-400 space-y-1 max-h-24 overflow-y-auto">
                          {csvValidationResults.duplicatesInFile.slice(0, 5).map((email, index) => (
                            <div key={index} className="font-mono">{email}</div>
                          ))}
                          {csvValidationResults.duplicatesInFile.length > 5 && (
                            <div className="font-medium">+ {csvValidationResults.duplicatesInFile.length - 5} more...</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Field>
            </>
          )}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsBulkAddModalOpen(false)} className="cursor-pointer">
            Cancel
          </Button>
          {bulkAddMode === 'text' ? (
            <button 
              onClick={handleBulkAddCoaches}
              disabled={bulkAddCoachesMutation.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white cursor-pointer transition-all duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-800"
            >
              {bulkAddCoachesMutation.isPending ? 'Adding Coaches...' : 'Add Coaches'}
            </button>
          ) : (
            <button 
              onClick={handleCsvUpload}
              disabled={isImporting || csvParsedData.length === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white cursor-pointer transition-all duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-zinc-800"
            >
              {isImporting ? 'Importing...' : `Import ${csvParsedData.length} Coaches`}
            </button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}