import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your organization metrics and recent activity',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}