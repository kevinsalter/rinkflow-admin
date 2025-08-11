import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { CheckIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { Logo } from '@/app/logo'
import { Link } from '@/components/link'

export const metadata: Metadata = {
  title: 'RinkFlow - Streamline Your Hockey Organization',
  description: 'The complete platform for managing hockey teams, schedules, and communications.',
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-900">
      {/* Simple Navigation */}
      <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <nav className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <Logo className="h-6 text-zinc-950 dark:text-white" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              Pricing
            </Link>
            <Link href="/features" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              Features
            </Link>
            <Link href="/about" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              About
            </Link>
            <Button outline href="/login" className="ml-4">
              Sign in
            </Button>
            <Button href="/organizations/new">
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6">
        {/* Hero Section */}
        <section className="text-center py-16 lg:py-24">
          <Heading className="text-4xl lg:text-6xl mb-6">
            Manage Your Hockey Organization
            <br />
            <span className="text-zinc-600 dark:text-zinc-400">All in One Place</span>
          </Heading>
          <Text className="text-lg lg:text-xl mb-8 max-w-3xl mx-auto">
            RinkFlow simplifies team management, scheduling, and communication for hockey organizations of all sizes.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/organizations/new" className="px-8 py-3">
              Start Free Trial
            </Button>
            <Button href="/pricing" outline className="px-8 py-3">
              View Pricing
            </Button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24">
          <div className="text-center mb-12">
            <Subheading className="text-3xl lg:text-4xl mb-4">
              Everything Your Organization Needs
            </Subheading>
            <Text className="text-lg max-w-2xl mx-auto">
              From scheduling practices to managing tournaments, RinkFlow has you covered.
            </Text>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="rounded-lg bg-zinc-900 dark:bg-zinc-100 p-2">
                    <CheckIcon className="h-5 w-5 text-white dark:text-zinc-900" />
                  </div>
                </div>
                <div>
                  <Subheading className="text-lg mb-2">{benefit.title}</Subheading>
                  <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                    {benefit.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 text-center border-t border-zinc-200 dark:border-zinc-800">
          <Subheading className="text-3xl lg:text-4xl mb-4">
            Ready to Get Started?
          </Subheading>
          <Text className="text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of hockey organizations already using RinkFlow to streamline their operations.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/organizations/new" className="px-8 py-3">
              Create Your Organization
            </Button>
            <Button href="/login" outline className="px-8 py-3">
              Sign In
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

const benefits = [
  {
    title: 'Team Management',
    description: 'Easily manage rosters, player information, and coaching staff all in one centralized location.',
  },
  {
    title: 'Schedule Coordination',
    description: 'Coordinate practices, games, and tournaments with automated scheduling and notifications.',
  },
  {
    title: 'Communication Hub',
    description: 'Keep everyone informed with team-wide announcements, messaging, and email notifications.',
  },
  {
    title: 'Registration & Payments',
    description: 'Handle player registrations and collect fees online with integrated payment processing.',
  },
  {
    title: 'Tournament Management',
    description: 'Organize and run tournaments with bracket generation, score tracking, and live updates.',
  },
  {
    title: 'Analytics & Reporting',
    description: 'Track team performance, attendance, and generate reports for your organization.',
  },
]