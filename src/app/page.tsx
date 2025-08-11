'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Authentication logic will go here
    // For now, just simulate a delay
    setTimeout(() => setIsLoading(false), 2000)
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
      
      {/* Login form centered */}
      <div className="relative z-10 flex min-h-full flex-col justify-center px-4" style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className="mx-auto w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-tight text-white">Sign in</h1>
              <p className="mt-2 text-sm text-zinc-400">Access your dashboard and organization settings</p>
            </div>
            
            {/* Form fields with floating design */}
            <div className="space-y-8">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  aria-label="Email address"
                  className="w-full rounded-none border-0 border-b-2 border-zinc-700 bg-transparent px-2 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed autofill:bg-zinc-800 autofill:text-white [&:-webkit-autofill]:[&:-webkit-autofill]:bg-zinc-800 [&:-webkit-autofill]:shadow-[0_0_0_30px_rgb(39,39,42)_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:caret-white"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  aria-label="Password"
                  className="w-full rounded-none border-0 border-b-2 border-zinc-700 bg-transparent px-2 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed autofill:bg-zinc-800 autofill:text-white [&:-webkit-autofill]:[&:-webkit-autofill]:bg-zinc-800 [&:-webkit-autofill]:shadow-[0_0_0_30px_rgb(39,39,42)_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:caret-white"
                />
              </div>
              
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Sign in button"
              className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 relative"
            >
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
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}