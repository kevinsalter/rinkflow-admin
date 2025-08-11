import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Organization Settings',
  description: 'Manage your organization profile, teams, and divisions',
}

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}