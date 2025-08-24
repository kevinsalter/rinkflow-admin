'use client'

import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from './ErrorBoundary'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { ReactNode } from 'react'

interface QueryErrorBoundaryProps {
  children: ReactNode
}

export function QueryErrorBoundary({ children }: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={
            <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <svg
                  className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Heading level={2} className="mb-2">
                Failed to load data
              </Heading>
              <Text className="mb-6 max-w-md text-zinc-600 dark:text-zinc-400">
                We couldn't fetch the data you requested. This might be a temporary issue. Please
                check your connection and try again.
              </Text>
              <div className="flex gap-3">
                <Button onClick={reset}>Retry</Button>
                <Button href="/" plain>
                  Go to dashboard
                </Button>
              </div>
            </div>
          }
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}