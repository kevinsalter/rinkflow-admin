# Task List: Phase 1 - Foundation

## Relevant Files

- `/src/app/layout.tsx` - Root layout that needs authentication provider integration
- `/src/app/page.tsx` - Root page to implement login form with Supabase authentication
- `/src/app/dashboard/page.tsx` - Protected dashboard page (placeholder for now)
- `/src/middleware.ts` - Middleware for route protection and admin verification
- `/src/lib/supabase.ts` - Supabase client configuration and initialization
- `/src/lib/auth.ts` - Authentication helpers and admin email whitelist
- `/src/contexts/AuthContext.tsx` - React Context for authentication state management
- `/src/components/LoginForm.tsx` - Login form component using Catalyst UI
- `.env.local` - Environment variables for Supabase configuration
- `.env.example` - Example environment variables for documentation

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- All `/src/app/(auth)/*` and `/src/app/(app)/*` route groups should be removed as part of the cleanup

## Tasks

- [ ] 1.0 Set up Supabase integration and environment configuration
  - [ ] 1.1 Create `.env.local` file with Supabase credentials (URL, anon key, service role key)
  - [ ] 1.2 Create `.env.example` file with placeholder values for documentation
  - [ ] 1.3 Create `/src/lib/supabase.ts` with Supabase client initialization
  - [ ] 1.4 Configure Supabase client for both server and client components
  - [ ] 1.5 Set up TypeScript types for Supabase database schema
  - [ ] 1.6 Test connection to both local Docker and production Supabase instances

- [ ] 2.0 Implement authentication system with login page
  - [ ] 2.1 Create `/src/contexts/AuthContext.tsx` for authentication state management
  - [ ] 2.2 Wrap application with AuthContext provider in `/src/app/layout.tsx`
  - [ ] 2.3 Create `/src/components/LoginForm.tsx` using Catalyst UI components
  - [ ] 2.4 Implement email/password login functionality in LoginForm
  - [ ] 2.5 Implement Google OAuth login button and flow
  - [ ] 2.6 Update `/src/app/page.tsx` to display LoginForm as main content
  - [ ] 2.7 Add loading states during authentication attempts
  - [ ] 2.8 Implement error handling with user-friendly messages
  - [ ] 2.9 Configure 7-day session persistence with activity refresh

- [ ] 3.0 Configure route protection and admin verification  
  - [ ] 3.1 Create `/src/lib/auth.ts` with admin email whitelist array
  - [ ] 3.2 Implement `isAdmin()` helper function to check against whitelist
  - [ ] 3.3 Create `/src/middleware.ts` for route protection
  - [ ] 3.4 Configure middleware to protect all routes except root
  - [ ] 3.5 Implement redirect logic for unauthenticated users
  - [ ] 3.6 Add admin verification check after successful authentication
  - [ ] 3.7 Show error message for non-admin users attempting to log in
  - [ ] 3.8 Create `/src/app/dashboard/page.tsx` as placeholder protected page
  - [ ] 3.9 Implement automatic redirect from root to /dashboard for authenticated admins
  - [ ] 3.10 Add logout functionality that clears session and redirects to root

- [ ] 4.0 Update branding and clean up Catalyst demo content
  - [ ] 4.1 Replace Catalyst logo with Rinkflow logo in all locations
  - [ ] 4.2 Update page titles and metadata to reference Rinkflow
  - [ ] 4.3 Remove demo data and placeholder content from existing pages
  - [ ] 4.4 Update color scheme if needed (keeping Catalyst theme)
  - [ ] 4.5 Ensure consistent branding across all pages
  - [ ] 4.6 Update favicon and other brand assets
  - [ ] 4.7 Clean up any remaining demo components not being used

- [ ] 5.0 Test authentication flow and access control
  - [ ] 5.1 Test login with whitelisted admin email (success case)
  - [ ] 5.2 Test login with non-whitelisted email (error message)
  - [ ] 5.3 Test Google OAuth flow with both admin and non-admin accounts
  - [ ] 5.4 Verify session persists for 7 days
  - [ ] 5.5 Test activity-based session refresh
  - [ ] 5.6 Verify protected routes redirect to root when not authenticated
  - [ ] 5.7 Confirm automatic redirect to /dashboard after admin login
  - [ ] 5.8 Test logout functionality and session clearing
  - [ ] 5.9 Verify no other public pages are accessible
  - [ ] 5.10 Test with both local Docker and production Supabase instances