import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coaches',
  description: 'Manage your organization coaches and their access',
}

export default function CoachesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}