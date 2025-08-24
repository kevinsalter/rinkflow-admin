'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Successful login - middleware will handle redirect
        router.push('/dashboard')
      }
    } catch {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-zinc-900">
      {/* Background image with extremely subtle visibility */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/hockey-players-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
          opacity: '0.03'
        }}
      />

      {/* Navigation bar */}
      <header className="relative z-10 px-6 py-4 border-b border-zinc-800">
        <nav className="mx-auto max-w-7xl flex items-center">
          <span
            className="font-black text-3xl text-white"
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '-0.03em'
            }}
          >
            Rinkflow Admin
          </span>
        </nav>
      </header>

      {/* Login form centered */}
      <div className="relative z-10 flex min-h-full flex-col justify-center px-4" style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className="mx-auto w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-tight text-white">Sign in</h1>
              <p className="mt-3 text-base text-zinc-400">Access your dashboard and organization settings</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-md bg-red-900/50 border border-red-800 p-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Form fields with minimal design */}
            <div className="space-y-5">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  aria-label="Email address"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-4 text-white placeholder-zinc-500 focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  aria-label="Password"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-4 text-white placeholder-zinc-500 focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Sign in button"
              className="w-full rounded-lg bg-blue-600 py-3.5 text-[15px] font-medium text-white cursor-pointer transition-all duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
