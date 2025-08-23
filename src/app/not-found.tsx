import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-zinc-700">404</h1>
        <h2 className="mt-4 text-3xl font-light text-white">Page not found</h2>
        <Link
          href="/"
          className="mt-16 inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}