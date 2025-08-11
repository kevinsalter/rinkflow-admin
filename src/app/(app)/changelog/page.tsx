import { Heading, Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { Badge } from '@/components/badge'

export default function ChangelogPage() {
  const changelogEntries = [
    {
      version: 'v1.0.0',
      date: 'January 11, 2025',
      badge: 'New',
      title: 'Initial Release',
      description: 'Welcome to Rinkflow Admin! This is our first release of the admin portal.',
      changes: [
        'Authentication system with Supabase integration',
        'Dashboard with key metrics overview',
        'Organization settings management',
        'Coach management interface',
        'Billing and subscription management',
        'Analytics and reporting tools'
      ]
    },
    {
      version: 'v0.9.0',
      date: 'December 20, 2024',
      badge: 'Beta',
      title: 'Beta Release',
      description: 'Beta testing phase with core functionality.',
      changes: [
        'Basic authentication flow',
        'Dashboard mockups',
        'Initial UI components'
      ]
    }
  ]

  return (
    <div className="max-lg:hidden">
      <div className="flex items-center justify-between mb-8">
        <Heading>Changelog</Heading>
      </div>
      
      <div className="space-y-8">
        {changelogEntries.map((entry) => (
          <div key={entry.version} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Subheading>{entry.version}</Subheading>
              <Badge color="blue">{entry.badge}</Badge>
              <Text className="text-sm text-zinc-500">{entry.date}</Text>
            </div>
            
            <Heading level={3} className="mb-2">{entry.title}</Heading>
            <Text className="mb-4 text-zinc-600 dark:text-zinc-400">{entry.description}</Text>
            
            <div className="space-y-2">
              {entry.changes.map((change, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <Text className="text-sm text-zinc-600 dark:text-zinc-400">{change}</Text>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}