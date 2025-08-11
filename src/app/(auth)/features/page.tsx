import { Heading, Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { Button } from '@/components/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - RinkFlow',
  description: 'Comprehensive features for managing your hockey organization.',
}

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="text-center py-16 lg:py-24">
        <Heading className="text-4xl lg:text-5xl mb-4">
          Powerful Features for Hockey Organizations
        </Heading>
        <Text className="text-lg lg:text-xl max-w-3xl mx-auto mb-8">
          Everything you need to manage teams, schedules, communications, and more.
        </Text>
        
        {/* Placeholder for feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature) => (
            <div key={feature.title} className="text-left">
              <Subheading className="text-xl mb-2">{feature.title}</Subheading>
              <Text className="text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </Text>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Button href="/organizations/new" className="px-8 py-3">
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: 'Team Rosters',
    description: 'Manage player information, positions, jersey numbers, and contact details.',
  },
  {
    title: 'Practice Planning',
    description: 'Create and share practice plans with drills, objectives, and notes.',
  },
  {
    title: 'Game Scheduling',
    description: 'Schedule games, tournaments, and scrimmages with automatic notifications.',
  },
  {
    title: 'Communication Tools',
    description: 'Send messages to teams, parents, and staff through email and in-app messaging.',
  },
  {
    title: 'Attendance Tracking',
    description: 'Track player and staff attendance for practices and games.',
  },
  {
    title: 'Document Management',
    description: 'Store and share important documents like waivers, medical forms, and policies.',
  },
]