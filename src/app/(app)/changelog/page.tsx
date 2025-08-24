import { Heading } from '@/components/heading'
import { Badge } from '@/components/badge'

export default function ChangelogPage() {
  return (
    <div>
      <Heading>Changelog</Heading>
      <div className="mt-8 space-y-8">

        {/* Version 0.1.0 */}
        <div className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Version 0.1.0
            </h2>
            <Badge color="amber">MVP</Badge>
            <span className="text-sm text-zinc-500">August 24, 2025</span>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            First release - MVP admin dashboard with essential organization management features.
          </p>

          <div className="grid gap-6">

            {/* New Features */}
            <div>
              <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                New Features
              </h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 ml-4">
                <li>• <strong>Organization Dashboard</strong> - Real-time metrics, seat usage, and subscription status</li>
                <li>• <strong>Coach Management</strong> - Add, remove, and manage organization members with role-based access</li>
                <li>• <strong>CSV Operations</strong> - Bulk import/export coaches with validation and error handling</li>
                <li>• <strong>Billing Integration</strong> - Stripe billing portal integration with invoice history</li>
                <li>• <strong>Audit Log</strong> - Complete activity tracking for organizational changes</li>
                <li>• <strong>Authentication System</strong> - Secure login with 7-day session persistence</li>
              </ul>
            </div>

            {/* Technical Implementation */}
            <div>
              <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Technical Implementation
              </h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 ml-4">
                <li>• Built with Next.js 15.4.6 and React 19 using App Router</li>
                <li>• Supabase integration for authentication and data management</li>
                <li>• React Query for efficient data fetching with caching</li>
                <li>• Tailwind CSS v4 with Catalyst UI components</li>
                <li>• TypeScript throughout for type safety</li>
                <li>• Responsive design with mobile support</li>
              </ul>
            </div>

            {/* Security & Performance */}
            <div>
              <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Security & Performance
              </h3>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 ml-4">
                <li>• Row-level security policies for data protection</li>
                <li>• Service role isolation for admin operations</li>
                <li>• Rate limiting on member operations</li>
                <li>• Optimistic UI updates for better user experience</li>
                <li>• Loading skeletons and error boundaries</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
