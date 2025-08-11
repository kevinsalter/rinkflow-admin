import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Forgot Password - Rinkflow Admin',
}

export default function ForgotPassword() {
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
          opacity: '0.02'
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
      
      {/* Reset password form centered */}
      <div className="relative z-10 flex min-h-full flex-col justify-center px-4" style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className="mx-auto w-full max-w-md">
          <form action="" method="POST" className="space-y-8">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-light tracking-tight text-white">Reset your password</h1>
              <p className="mt-2 text-sm text-zinc-400">Enter your email and we&apos;ll send you a reset link</p>
            </div>
            
            {/* Form fields */}
            <div className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full rounded-none border-0 border-b border-zinc-700 bg-transparent px-0 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors text-base"
                />
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Send reset link
            </button>
            
            {/* Back to login link */}
            <div className="text-center">
              <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}