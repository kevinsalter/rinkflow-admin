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
- `/src/app/page.tsx` - Root page with login form and auth redirect logic
- `/src/app/(auth)/login/page.tsx` - Login page that redirects to root for consistency
- `/src/app/not-found.tsx` - 404 page with link back to home

### Admin Portal Pages
- `/src/app/(app)/layout.tsx` - App layout with sidebar and protection
- `/src/app/(app)/dashboard/page.tsx` - Dashboard with organization metrics and info
- `/src/app/(app)/coaches/page.tsx` - Coaches management with CSV operations
- `/src/app/(app)/billing/page.tsx` - Subscription and billing management
- `/src/app/(app)/settings/page.tsx` - Audit log display

### API Routes
- `/src/app/api/organizations/route.ts` - Organization CRUD operations
- `/src/app/api/coaches/route.ts` - Coach management endpoints
- `/src/app/api/coaches/import/route.ts` - CSV import handler
- `/src/app/api/coaches/export/route.ts` - CSV export handler
- `/src/app/api/billing/route.ts` - Stripe integration endpoints
- `/src/app/api/stripe/webhook/route.ts` - Stripe webhook handler

### React Query Hooks
- `/src/hooks/queries/useOrganizationStats.ts` - Organization member and coach counts
- `/src/hooks/queries/useOrganizationStatistics.ts` - Platform usage stats from materialized view
- `/src/hooks/queries/useCoaches.ts` - Coaches list and mutations
- `/src/hooks/queries/useBilling.ts` - Subscription and invoice queries

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory)
- Use `bun test` or configured test runner to run tests
- Keep the `/src/app/(auth)/*` and `/src/app/(app)/*` route groups for logical separation and layout management
- The main Rinkflow codebase already has database migrations applied for organizations and organization_members tables
- Server-side functions exist in the main codebase that can be referenced: `organizations-server.ts`, `invoices-server.ts`
- Service Role Key must only be used server-side for admin operations, never exposed in client code
- Use Catalyst UI components wherever possible to maintain consistency

### Phase 2 Considerations

- **Materialized View Refresh Strategy**: The `organization_statistics_mv` materialized view needs a refresh strategy. Options:
  - Set up pg_cron for scheduled refreshes (hourly/daily)
  - Trigger refresh after significant data changes (member additions, content creation)
  - Add manual refresh button in admin UI
  - Current implementation has fallback to direct queries, so this is not blocking

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

- [ ] 2.0 Authentication System Implementation (read the docs first https://supabase.com/docs/guides/auth/server-side/nextjs)
  - [x] 2.1 Create AuthContext in `/src/contexts/AuthContext.tsx` for auth state management
  - [x] 2.2 Implement middleware in `/src/middleware.ts` for route protection (using actual organization roles instead of whitelist)
  - [x] 2.3 make sure the "Rinkflow Admin" title in the top navbar is clickable, and redirects to /
  - [x] 2.4 Update root page `/src/app/page.tsx` to redirect based on auth status
  - [x] 2.5 Implement login page `/src/app/(auth)/login/page.tsx` with email/password
  - [x] 2.6 make sure the bottom left user avatar uses the user's avatar or falls back to a placeholder image, and make sure it's the logged in user's email that displays
  - [x] 2.7 Add logout functionality to app layout
  - [x] 2.8 Configure 7-day session persistence with refresh
  - [x] 2.9 Test all auth flows (login, logout) - Testing checklist created

- [x] 3.0 Navigation Structure & Branding (this should mostly be done from the work in @tasks/completed/tasks-cleanup-routes.md, but double check)
  - [x] 3.1 Update `/src/app/(app)/layout.tsx` with sidebar navigation menu
  - [x] 3.2 Create all page route files (can be placeholders initially)
  - [x] 3.3 Replace Catalyst logo with Rinkflow logo in all locations
  - [x] 3.4 Update page titles and metadata to reference Rinkflow
  - [x] 3.5 Remove all demo data from existing pages
  - [x] 3.6 Clean up unused Catalyst demo components
  - [x] 3.7 Configure navigation items (Dashboard, Coaches, Settings, etc.)

- [x] 4.0 Dashboard Page (includes Organization Info)
  - [x] 4.0a read the Catalyst docs https://catalyst.tailwindui.com/docs
  - [x] 4.1 Create dashboard page `/src/app/(app)/dashboard/page.tsx`
  - [x] 4.2 Display organization name and subscription status
  - [x] 4.3 Show member count vs seat limit with progress indicator
  - [x] 4.4 Implement simple metric cards (total coaches, seat usage)
  - [x] 4.5 Add basic usage stats if available
  - [x] 4.6 Implement auto-refresh with React Query
  - [x] 4.7 Add loading skeletons and error states
  - [ ] 4.8 Implement dashboard design review suggestions

- [ ] 5.0 Billing Page (Read-Only)
  - [ ] 5.1 Create billing page `/src/app/(app)/billing/page.tsx`
  - [ ] 5.2 Display current subscription plan details
  - [ ] 5.3 Show seat usage (used vs available)
  - [ ] 5.4 Implement `useBilling` hook for Stripe data
  - [ ] 5.5 Display recent invoices in a table
  - [ ] 5.6 Add Stripe billing portal redirect button

- [ ] 6.0 Coaches Management Page (Simplified)
  - [ ] 6.1 Create coaches page `/src/app/(app)/coaches/page.tsx`
  - [ ] 6.2 Implement coaches list with Catalyst table component
  - [ ] 6.3 Add pagination (50 coaches per page)
  - [ ] 6.4 Create search input for name/email filtering
  - [ ] 6.5 Implement `useCoaches` hook with React Query
  - [ ] 6.6 Create add coach modal with email input
  - [ ] 6.7 Implement remove coach with confirmation dialog
  - [ ] 6.8 Add seat limit validation before adding
  - [ ] 6.9 Add loading states and error handling

- [ ] 7.0 CSV Operations for Coaches
  - [ ] 7.1 Create bulk add modal with textarea for multiple emails
  - [ ] 7.2 Implement CSV upload using papaparse library
  - [ ] 7.3 Create `/src/app/api/coaches/import/route.ts` endpoint
  - [ ] 7.4 Add CSV validation and preview before import
  - [ ] 7.5 Create CSV export functionality
  - [ ] 7.6 Implement `/src/app/api/coaches/export/route.ts` endpoint
  - [ ] 7.7 Test with large imports

- [ ] 8.0 Audit Log Page (Read-Only)
  - [ ] 8.1 Create settings page `/src/app/(app)/settings/page.tsx`
  - [ ] 8.2 Implement simple audit log display showing recent actions
  - [ ] 8.3 Add pagination for audit entries
  - [ ] 8.4 Include timestamp, user, and action type
  - [ ] 8.5 Add loading and error states

- [ ] 9.0 Testing & Quality Assurance (MVP Focus)
  - [ ] 9.1 Test authentication flows (login, logout)
  - [ ] 9.2 Test coach add/remove operations
  - [ ] 9.3 Test CSV import/export
  - [ ] 9.4 Test billing portal redirect
  - [ ] 9.5 Performance test dashboard (< 2s load)
  - [ ] 9.6 Test seat limit validation
  - [ ] 9.7 Basic mobile responsiveness check

- [ ] 10.0 Deployment
  - [ ] 10.1 Configure production environment variables
  - [ ] 10.2 Deploy to Vercel
  - [ ] 10.3 Test production deployment
  - [ ] 10.4 Monitor for first 24 hours
