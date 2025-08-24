import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audit Log',
  description: 'View recent organizational activities and changes',
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}