import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Product updates and release notes',
}

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}