import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'View recent updates and version history',
}

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}