'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function AccessDeniedPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
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

      {/* Content centered */}
      <div className="relative z-10 flex min-h-full flex-col justify-center px-4" style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className="mx-auto w-full max-w-md">
          <div className="space-y-10">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-tight text-white">Access Denied</h1>
              <p className="mt-3 text-base text-zinc-400">You don&apos;t have permission to access this resource.</p>
            </div>

            {/* Reason box */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
              <p className="text-sm text-zinc-400 text-center">This may be because:</p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="flex items-start">
                  <span className="mr-2 text-zinc-600">•</span>
                  <span>You&apos;re not a member of an organization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-zinc-600">•</span>
                  <span>You don&apos;t have the required role for this page</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-zinc-600">•</span>
                  <span>Your access has been revoked</span>
                </li>
              </ul>
            </div>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg bg-blue-600 py-3.5 text-[15px] font-medium text-white text-center cursor-pointer transition-all duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Sign Out and Return to Login
            </button>

            {/* Contact admin */}
            <p className="text-center text-sm text-zinc-500">
              If you believe this is an error, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}