## Relevant Files

### Core Configuration
- `/src/app/layout.tsx` - Root layout that needs authentication provider integration
- `/src/middleware.ts` - Middleware for route protection and admin verification
- `/src/lib/supabase.ts` - Supabase client configuration and initialization
- `/src/lib/auth.ts` - Authentication helpers and admin email whitelist
- `/src/contexts/AuthContext.tsx` - React Context for authentication state management
- `.env.local` - Environment variables for Supabase and Stripe configuration
- `.env.example` - Example environment variables for documentation

### Authentication Pages
- `/src/app/page.tsx` - Root page that redirects to login or dashboard
- `/src/app/(auth)/layout.tsx` - Auth layout without sidebar
- `/src/app/(auth)/login/page.tsx` - Login page with Supabase authentication
- `/src/app/(auth)/forgot-password/page.tsx` - Forgot password page (public)
- `/src/components/LoginForm.tsx` - Login form component using Catalyst UI

### Admin Portal Pages
- `/src/app/(app)/layout.tsx` - App layout with sidebar and protection
- `/src/app/(app)/dashboard/page.tsx` - Dashboard with organization metrics
- `/src/app/(app)/coaches/page.tsx` - Coaches management with CSV operations
- `/src/app/(app)/organization-settings/page.tsx` - Organization configuration
- `/src/app/(app)/billing/page.tsx` - Subscription and billing management
- `/src/app/(app)/analytics/page.tsx` - Usage statistics and reports
- `/src/app/(app)/settings/page.tsx` - Admin profile and preferences

### API Routes
- `/src/app/api/organizations/route.ts` - Organization CRUD operations
- `/src/app/api/coaches/route.ts` - Coach management endpoints
- `/src/app/api/coaches/import/route.ts` - CSV import handler
- `/src/app/api/coaches/export/route.ts` - CSV export handler
- `/src/app/api/billing/route.ts` - Stripe integration endpoints
- `/src/app/api/stripe/webhook/route.ts` - Stripe webhook handler

### React Query Hooks
- `/src/hooks/queries/useOrganization.ts` - Organization data fetching
- `/src/hooks/queries/useCoaches.ts` - Coaches list and mutations
- `/src/hooks/queries/useBilling.ts` - Subscription and invoice queries
- `/src/hooks/queries/useAnalytics.ts` - Analytics data fetching

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory)
- Use `bun test` or configured test runner to run tests
- Keep the `/src/app/(auth)/*` and `/src/app/(app)/*` route groups for logical separation and layout management
- The main Rinkflow codebase already has database migrations applied for organizations and organization_members tables
- Server-side functions exist in the main codebase that can be referenced: `organizations-server.ts`, `invoices-server.ts`
- Service Role Key must only be used server-side for admin operations, never exposed in client code
- Use Catalyst UI components wherever possible to maintain consistency

## Tasks

- [x] 1.0 Environment Setup & Core Configuration
  - [x] 1.1 Create `.env.local` with Supabase URL, anon key, service role key, and Stripe keys
  - [x] 1.2 Create `.env.example` with placeholder values for documentation
  - [x] 1.3 Install core dependencies: `@supabase/supabase-js`, `@tanstack/react-query`, `stripe`
  - [x] 1.4 Install utility dependencies: `react-hook-form`, `papaparse`, `date-fns`
  - [x] 1.5 Copy database types from main Rinkflow codebase `src/types/database.types.ts`
  - [x] 1.6 Create Supabase client for client-side operations in `/src/lib/supabase-client.ts` making sure you follow the official guide https://supabase.com/docs/guides/auth/server-side/nextjs
  - [x] 1.7 Create Supabase client for server-side operations in `/src/lib/supabase-server.ts`  making sure you follow the official guide https://supabase.com/docs/guides/auth/server-side/nextjs
  - [x] 1.8 Configure Stripe client in `/src/lib/stripe.ts` for server-side use only
  - [x] 1.9 Set up React Query provider in `/src/app/providers.tsx`
  - [x] 1.10 Configure error boundaries for data fetching failures
  - [x] 1.11 Create organization context provider that uses fetchUserOrganization
  - [x] 1.12 Add organization_id to all API calls and queries

- [ ] 2.0 Authentication System Implementation
  - [ ] 2.1 Create AuthContext in `/src/contexts/AuthContext.tsx` for auth state management
  - [ ] 2.2 Implement middleware in `/src/middleware.ts` for route protection
  - [ ] 2.3 Create admin email whitelist in `/src/lib/auth.ts`
  - [ ] 2.4 Update root page `/src/app/page.tsx` to redirect based on auth status
  - [ ] 2.5 Implement login page `/src/app/(auth)/login/page.tsx` with email/password
  - [ ] 2.6 Implement forgot password page `/src/app/(auth)/forgot-password/page.tsx`
  - [ ] 2.7 Add logout functionality to app layout
  - [ ] 2.8 Configure 7-day session persistence with refresh
  - [ ] 2.9 Test all auth flows (login, forgot password, logout)

- [ ] 3.0 Navigation Structure & Branding
  - [ ] 3.1 Update `/src/app/(app)/layout.tsx` with sidebar navigation menu
  - [ ] 3.2 Create all page route files (can be placeholders initially)
  - [ ] 3.3 Replace Catalyst logo with Rinkflow logo in all locations
  - [ ] 3.4 Update favicon and app icons
  - [ ] 3.5 Update page titles and metadata to reference Rinkflow
  - [ ] 3.6 Remove all demo data from existing pages
  - [ ] 3.7 Clean up unused Catalyst demo components
  - [ ] 3.8 Configure navigation items (Dashboard, Coaches, Settings, etc.)

- [ ] 4.0 Dashboard Page Implementation
  - [ ] 4.1 Create dashboard page `/src/app/(app)/dashboard/page.tsx`
  - [ ] 4.2 Implement organization overview cards (total coaches, subscription status)
  - [ ] 4.3 Create `useOrganization` hook for fetching org data
  - [ ] 4.4 Add recent activity feed component (if activity data available)
  - [ ] 4.5 Create quick action cards linking to common tasks
  - [ ] 4.6 Implement auto-refresh with React Query
  - [ ] 4.7 Add loading skeletons for all data sections
  - [ ] 4.8 Implement error states with retry options
  - [ ] 4.9 Make responsive for tablet screens
  - [ ] 4.10 Test page load performance (< 2 seconds)

- [ ] 5.0 Organization Settings Page (Read-Only)
  - [ ] 5.1 Create organization settings page `/src/app/(app)/organization-settings/page.tsx`
  - [ ] 5.2 Display organization name and details
  - [ ] 5.3 Show member count vs seat limit with progress indicator
  - [ ] 5.4 Display current subscription plan and status
  - [ ] 5.5 List all organization administrators
  - [ ] 5.6 Add placeholder for future edit functionality
  - [ ] 5.7 Implement loading and error states

- [ ] 6.0 Analytics Page
  - [ ] 6.0a Use proper JOIN queries to avoid N+1 issues (reference fixed queries from backend)
  - [ ] 6.1 Create analytics page `/src/app/(app)/analytics/page.tsx`
  - [ ] 6.2 Implement usage metrics cards (total drills, practice plans)
  - [ ] 6.3 Add coach activity chart using Tremor components
  - [ ] 6.4 Display content creation trends over time
  - [ ] 6.5 Create date range selector component
  - [ ] 6.6 Implement `useAnalytics` hook for data fetching
  - [ ] 6.7 Add CSV export button (implementation in later phase)
  - [ ] 6.8 Test with various data ranges

- [ ] 7.0 Billing Page (Mostly Read-Only)
  - [ ] 7.1 Create billing page `/src/app/(app)/billing/page.tsx`
  - [ ] 7.2 Display current subscription plan details
  - [ ] 7.3 Create seat usage visualization (used vs available)
  - [ ] 7.4 Implement `useBilling` hook for Stripe data
  - [ ] 7.5 Display recent invoices in a table
  - [ ] 7.6 Add Stripe billing portal redirect button
  - [ ] 7.7 Show current payment method (last 4 digits)
  - [ ] 7.8 Add placeholder for plan upgrade/downgrade

- [ ] 8.0 Coaches Management Page
  - [ ] 8.0a Implement race condition handling for concurrent member additions
  - [ ] 8.1 Create coaches page `/src/app/(app)/coaches/page.tsx`
  - [ ] 8.2 Implement coaches list with Catalyst table component
  - [ ] 8.3 Add pagination (50 coaches per page)
  - [ ] 8.4 Create search input for name/email filtering
  - [ ] 8.5 Add role filter dropdown (all/admin/member)
  - [ ] 8.6 Implement `useCoaches` hook with React Query
  - [ ] 8.7 Create add coach modal with email input
  - [ ] 8.8 Implement remove coach with confirmation dialog
  - [ ] 8.9 Add seat limit validation before adding
  - [ ] 8.10 Create role change functionality (promote/demote)
  - [ ] 8.11 Implement optimistic updates for better UX
  - [ ] 8.12 Add loading states and error handling

- [ ] 9.0 CSV Operations for Coaches
  - [ ] 9.0a Add transaction support for bulk operations to ensure atomicity
  - [ ] 9.1 Create bulk add modal with textarea for multiple emails
  - [ ] 9.2 Implement CSV upload using papaparse library
  - [ ] 9.3 Create `/src/app/api/coaches/import/route.ts` endpoint
  - [ ] 9.4 Add CSV validation and preview before import
  - [ ] 9.5 Implement progress indicator for large imports
  - [ ] 9.6 Create CSV export functionality
  - [ ] 9.7 Implement `/src/app/api/coaches/export/route.ts` endpoint
  - [ ] 9.8 Add bulk selection checkbox column
  - [ ] 9.9 Implement bulk remove with confirmation
  - [ ] 9.10 Test with 1000+ coach imports

- [ ] 10.0 Organization Settings Write Operations
  - [ ] 10.0a Add organization_id filtering to all Supabase queries
  - [ ] 10.0b Handle RLS policy errors gracefully (403 responses)
  - [ ] 10.0c Ensure all API routes verify organization membership before operations
  - [ ] 10.1 Add edit mode to organization settings page
  - [ ] 10.2 Implement form with react-hook-form
  - [ ] 10.3 Create organization name/description edit fields
  - [ ] 10.4 Add admin management section with list
  - [ ] 10.5 Implement admin promotion/demotion functionality
  - [ ] 10.6 Add form validation for required fields
  - [ ] 10.7 Create save button with loading state
  - [ ] 10.8 Implement success/error toast notifications
  - [ ] 10.9 Add unsaved changes warning

- [ ] 11.0 Settings Page
  - [ ] 11.1 Create settings page `/src/app/(app)/settings/page.tsx`
  - [ ] 11.2 Implement admin profile section with email display
  - [ ] 11.3 Add password change form with validation
  - [ ] 11.4 Create notification preferences checkboxes
  - [ ] 11.5 Implement simple audit log display (recent actions)
  - [ ] 11.6 Add data export section (future functionality)
  - [ ] 11.7 Test settings persistence across sessions

- [ ] 12.0 Billing Page Enhancements
  - [ ] 12.1 Create plan comparison table component
  - [ ] 12.2 Add upgrade/downgrade buttons with modals
  - [ ] 12.3 Implement Stripe checkout session creation
  - [ ] 12.4 Create `/src/app/api/billing/route.ts` endpoints
  - [ ] 12.5 Add invoice download functionality
  - [ ] 12.6 Implement subscription cancellation flow
  - [ ] 12.7 Create `/src/app/api/stripe/webhook/route.ts`
    - [ ] 12.7a Implement idempotency key handling using Stripe-Idempotency-Key header
    - [ ] 12.7b Add webhook signature verification with stripe.webhooks.constructEvent
    - [ ] 12.7c Store processed webhook events to prevent duplicate processing
    - [ ] 12.7d Handle subscription lifecycle events (created, updated, deleted, payment_failed)
  - [ ] 12.8 Test Stripe webhook handling
  - [ ] 12.9 Handle failed payment notifications

- [ ] 13.0 Testing & Quality Assurance
  - [ ] 13.1 Test all authentication flows (login, logout)
  - [ ] 13.2 Test coach CRUD operations thoroughly
  - [ ] 13.3 Test CSV import with various file formats
  - [ ] 13.4 Test CSV export and verify data integrity
  - [ ] 13.5 Test Stripe integration end-to-end
  - [ ] 13.6 Performance test all pages (< 2s load time)
  - [ ] 13.7 Test pagination with large datasets
  - [ ] 13.8 Mobile responsive testing on tablets
  - [ ] 13.9 Cross-browser compatibility testing
  - [ ] 13.10 Security audit for API endpoints
  - [ ] 13.11 Test RLS policy violations and proper error messages
  - [ ] 13.12 Test race conditions in member management
  - [ ] 13.13 Test idempotent webhook processing

- [ ] 14.0 Deployment & Launch
  - [ ] 14.1 Configure production environment variables
  - [ ] 14.2 Set up Vercel project (or chosen platform)
  - [ ] 14.3 Configure custom domain if available
  - [ ] 14.4 Run build optimization
  - [ ] 14.5 Deploy to staging environment
  - [ ] 14.6 Conduct user acceptance testing
  - [ ] 14.7 Fix any critical bugs found
  - [ ] 14.8 Deploy to production
  - [ ] 14.9 Configure monitoring and alerts
  - [ ] 14.10 Monitor application for first 24-48 hours

- [ ] 15.0 Super Admin Features
  - [ ] 15.1 Create organization creation flow for super admins
  - [ ] 15.2 Add organization list/search for super admins
  - [ ] 15.3 Implement organization archival/deletion
  - [ ] 15.4 Add ability to transfer organization ownership
