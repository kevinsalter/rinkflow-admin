import { Heading } from '@/components/heading'
import { Text } from '@/components/text'

export default function CoachesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading>Coaches</Heading>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 py-24">
        <div className="mx-auto max-w-sm text-center">
          <Heading level={2}>Coming Soon</Heading>
          <Text className="mt-2 text-zinc-600 dark:text-zinc-400">
            Coach management features will be available in Phase 2. You&apos;ll be able to add, remove, and manage coach access to your organization.
          </Text>
        </div>
      </div>
    </div>
  )
}