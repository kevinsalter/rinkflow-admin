'use client'

import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { Text } from '@/components/text'
import { CheckIcon, Bars2Icon } from '@heroicons/react/16/solid'
import { Logo } from '@/app/logo'
import { Link } from '@/components/link'
import { CloseButton, Dialog, DialogPanel } from '@headlessui/react'
import { useState } from 'react'

export default function LandingPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-900">
      {/* Simple Navigation */}
      <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <nav className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button plain aria-label="Open navigation" onClick={() => setShowMobileMenu(true)} className="lg:hidden">
              <Bars2Icon />
            </Button>
            <Link href="/" aria-label="Home">
              <Logo className="h-6 text-zinc-950 dark:text-white" />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hidden lg:inline-block">
              Pricing
            </Link>
            <Link href="/features" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hidden lg:inline-block">
              Features
            </Link>
            <Link href="/about" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hidden lg:inline-block">
              About
            </Link>
            <Button outline href="/login" className="hidden lg:inline-flex">
              Sign in
            </Button>
            <Button href="/organizations/new" className="hidden lg:inline-flex">
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
            Rinkflow simplifies team management, scheduling, and communication for hockey organizations of all sizes.
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
              From scheduling practices to managing tournaments, Rinkflow has you covered.
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
            Join hundreds of hockey organizations already using Rinkflow to streamline their operations.
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

      {/* Mobile Menu */}
      <Dialog open={showMobileMenu} onClose={setShowMobileMenu} className="lg:hidden">
        <DialogPanel className="fixed inset-0 z-50 flex h-full w-full flex-col bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between px-4 py-2.5">
            <Link href="/" aria-label="Home">
              <Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
            </Link>
            <CloseButton aria-label="Close navigation">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </CloseButton>
          </div>
          <nav className="flex flex-1 flex-col p-6">
            <div className="flex flex-col gap-4">
              <Link href="/pricing" className="text-base font-medium text-zinc-900 dark:text-white py-2">
                Pricing
              </Link>
              <Link href="/features" className="text-base font-medium text-zinc-900 dark:text-white py-2">
                Features
              </Link>
              <Link href="/about" className="text-base font-medium text-zinc-900 dark:text-white py-2">
                About
              </Link>
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <Button outline href="/login" className="w-full">Sign in</Button>
              <Button href="/organizations/new" className="w-full">Get Started</Button>
            </div>
          </nav>
        </DialogPanel>
      </Dialog>
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