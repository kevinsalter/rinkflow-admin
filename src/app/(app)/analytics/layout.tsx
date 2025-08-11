import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'View usage statistics and generate reports',
}

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}