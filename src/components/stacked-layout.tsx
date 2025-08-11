'use client'

import { Button } from '@/components/button'
import { Logo } from '@/app/logo'
import { Bars2Icon } from '@heroicons/react/16/solid'
import { CloseButton, Dialog, DialogPanel } from '@headlessui/react'
import { useState, type ReactNode } from 'react'
import { Link } from '@/components/link'

export function StackedLayout({
  children,
}: {
  children: ReactNode
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <div className="min-h-dvh bg-white dark:bg-zinc-900">
      {/* Simple Navigation matching home page */}
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
        {children}
      </main>

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