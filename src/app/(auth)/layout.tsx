import { StackedLayout } from '@/components/stacked-layout'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <StackedLayout>{children}</StackedLayout>
}
