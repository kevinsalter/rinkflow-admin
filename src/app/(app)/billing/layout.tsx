import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your subscription and payment methods',
}

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}