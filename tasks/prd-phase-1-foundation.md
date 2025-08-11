# Product Requirements Document: Phase 1 - Foundation

## Introduction/Overview

Phase 1 establishes the foundational infrastructure for the Rinkflow Admin Portal, focusing specifically on authentication and access control. This phase transforms the existing Next.js codebase to integrate with Supabase authentication, implements a login page at the root route, and sets up admin role verification middleware. The goal is to create a secure, authenticated environment that allows only organization administrators to access the portal while non-admin users receive a clear error message.

## Goals

1. Replace all Catalyst demo content with Rinkflow branding and messaging
2. Integrate Supabase authentication with username/password and Google OAuth
3. Implement login page at root route (/) that redirects to /dashboard when authenticated
4. Set up admin role verification middleware using temporary email whitelist
5. Configure protected routes requiring admin authentication
6. Set up environment configuration for both local (Docker) and production deployment

## User Stories

1. **As an organization admin**, I want to log in using my existing Rinkflow credentials so that I can access the admin portal without creating a new account.

2. **As an organization admin**, I want to successfully access the protected admin area after logging in so that I know the authentication is working.

3. **As a regular coach**, I should see a clear error message when trying to log in so that I understand this portal is for administrators only.

4. **As an organization admin**, I want the portal to remember my login session for a reasonable time so that I don't have to log in repeatedly during my work week.

5. **As an organization admin**, I want to see proper navigation structure once logged in so that future features can be easily added.

## Functional Requirements

### Authentication & Authorization (FR1-FR8)

1. **FR1**: The system must integrate with the existing Supabase authentication instance used by the mobile app
2. **FR2**: The system must support username/password login through Supabase
3. **FR3**: The system must support Google OAuth login through Supabase
4. **FR4**: The system must check if a logged-in user has admin role privileges using a temporary hardcoded email whitelist (admin@rinkflow.com, test@rinkflow.com, and development team emails)
5. **FR5**: The system must show non-admin users an error message: "Access Denied: This portal is for organization administrators only. Coaches should use the Rinkflow mobile app."
6. **FR6**: The system must maintain user sessions for 7 days with activity-based refresh (session extends on each visit)
7. **FR7**: The system must handle all authentication errors with user-friendly messages following application best practices
8. **FR8**: The system must clear sessions properly on logout and redirect to the login page

### Root Page Behavior (FR9-FR11)

9. **FR9**: The system must implement a login page at the root route (/) that:
   - Shows login form when not authenticated
   - Redirects to /dashboard immediately if already authenticated as admin
   - Shows error message if authenticated user is not an admin
10. **FR10**: The root page must display Rinkflow branding and login functionality
11. **FR11**: The root page must be the only publicly accessible page

### Protected Routes (FR12-FR15)

12. **FR12**: The system must protect all routes except the root, requiring admin authentication
13. **FR13**: The system must redirect unauthenticated users to the root page when accessing protected routes  
14. **FR14**: The system must redirect authenticated admins from root to /dashboard automatically
15. **FR15**: The system must set up the protected route structure for future feature development (/dashboard, /coaches, /billing, etc.)

### Branding & UI (FR16-FR20)

16. **FR16**: The system must replace all Catalyst demo content with Rinkflow branding
17. **FR17**: The system must use the existing Catalyst UI components and theme without custom color overrides
18. **FR18**: The system must display the Rinkflow logo consistently across all pages
19. **FR19**: The system must implement responsive design with desktop-first optimization
20. **FR20**: The system must support dark mode if provided by Catalyst theme

### Environment Configuration (FR21-FR25)

21. **FR21**: The system must support environment variables for Supabase URL and anonymous key
22. **FR22**: The system must support switching between local (Docker-based) and production Supabase instances
23. **FR23**: The system must securely store service role keys in environment variables
24. **FR24**: The system must not expose sensitive keys in client-side code
25. **FR25**: The system must use the existing local Docker Supabase instance for development and remote Supabase dashboard for production

## Non-Goals (Out of Scope)

1. **No dashboard implementation**: Dashboard with metrics comes in Phase 2
2. **No coach management**: Coach add/remove functionality comes in Phase 2
3. **No billing features**: Stripe and billing integration deferred to Phase 2
4. **No analytics pages**: Usage statistics come in Phase 2
5. **No settings pages**: Organization settings come in Phase 2
6. **No organization signup flow**: No public signup in Phase 1
7. **No separate login page**: Login is integrated into the root landing page
8. **No real data integration**: Phase 1 focuses on authentication setup only
9. **No email notifications**: No email system implementation in Phase 1
10. **No API development**: All backend API work happens in the main Rinkflow codebase

## Design Considerations

1. **Use existing Catalyst components**: Leverage Catalyst's pre-built components for forms, tables, navigation
2. **Desktop-first design**: Optimize for desktop browsers as primary use case
3. **Simple login page**: Create a clean, professional login page at the root
4. **Loading states**: Show appropriate loading indicators during authentication checks
5. **Error boundaries**: Implement error handling for authentication failures with user-friendly messages
6. **Accessibility**: Ensure WCAG 2.1 AA compliance using Catalyst's accessible components

## Technical Considerations

1. **Supabase Client Setup**: Initialize Supabase client with environment variables in a centralized location
2. **Authentication State Management**: Use React Context or similar for auth state across components
3. **Route Protection**: Implement middleware or layout-level protection for (app) routes
4. **Session Configuration**: Configure Supabase auth for 7-day sessions with activity-based refresh
5. **Environment Variables Structure**:
   ```
   # For local development (Docker-based Supabase)
   # NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   
   # For production
   NEXT_PUBLIC_SUPABASE_URL=https://wsyqoooivsvfwhgpcohm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```
6. **Admin Check Logic**: Implement temporary email whitelist check against hardcoded admin emails until organization_members table is ready
7. **TypeScript Types**: Define interfaces for User, Organization, and Admin contexts
8. **Local Development**: Use existing Docker-based local Supabase instance for development
9. **Error Handling**: Implement comprehensive error catching and user-friendly error messages throughout

## Success Metrics

1. **Authentication Success Rate**: 100% of whitelisted admin emails can successfully log in
2. **Access Control**: 0% of non-admin users can access protected routes
3. **Login Flow**: Root page shows login form and redirects to /dashboard after successful admin authentication
4. **Root Page Performance**: Root page loads in under 2 seconds
5. **Single Public Page**: Only root route (/) is accessible without authentication
6. **Session Persistence**: Sessions remain active for 7 days with activity refresh working
7. **Protected Route Setup**: All non-root routes properly protected and redirect when unauthenticated
8. **Environment Switching**: Development and production environments work without code changes

## Implementation Notes

### Hardcoded Data for Phase 1

#### Admin Email Whitelist
```typescript
// Temporary admin emails until organization_members table is ready
const ADMIN_EMAILS = [
  'admin@rinkflow.com',
  'test@rinkflow.com',
  // Add your development email here for testing
];
```

#### Error Messages
```typescript
const ERROR_MESSAGES = {
  notAdmin: 'Access Denied: This portal is for organization administrators only. Coaches should use the Rinkflow mobile app.',
  authFailed: 'Authentication failed. Please check your credentials and try again.',
  sessionExpired: 'Your session has expired. Please log in again.',
  networkError: 'Unable to connect. Please check your internet connection and try again.',
};
```

### Priority Order for Development:
1. Set up environment variables and Supabase client
2. Replace Catalyst demo content with Rinkflow branding
3. Implement login page at root route with Supabase authentication
4. Add admin role verification middleware with email whitelist
5. Configure protected route setup and /dashboard redirect
6. Configure 7-day session with activity refresh
7. Add error handling and loading states
8. Test authentication flow and access control

### Key Files to Modify:
- `/src/app/layout.tsx` - Add authentication provider
- `/src/app/page.tsx` - Implement login page at root
- `/src/app/dashboard/page.tsx` - Create protected dashboard page (placeholder)
- `/src/middleware.ts` - Add route protection and admin check
- `/src/lib/supabase.ts` - Create Supabase client configuration
- `/src/lib/auth.ts` - Admin email whitelist and auth helpers
- `.env.local` - Add environment variables
- Remove all `/src/app/(auth)/*` and `/src/app/(app)/*` route groups

### Testing Checklist:
- [ ] Root page (/) shows login form when not authenticated
- [ ] Root page (/) automatically redirects to /dashboard if already authenticated as admin
- [ ] Root page is the only public route
- [ ] Admin can log in with username/password (whitelisted email)
- [ ] Admin can log in with Google OAuth (whitelisted email)  
- [ ] Non-admin users see error message when attempting to log in
- [ ] Non-admin users cannot access any protected routes (/dashboard, etc.)
- [ ] Session persists for 7 days
- [ ] Session refreshes on activity
- [ ] Protected routes redirect to root (/) when unauthenticated
- [ ] After successful admin login, automatic redirect to /dashboard
- [ ] Logout clears session and redirects to root (/)
- [ ] No other public pages are accessible
- [ ] Dark mode works correctly (if supported)
- [ ] Local Docker Supabase instance works for development
- [ ] Production Supabase instance works when deployed
- [ ] All error messages are user-friendly and helpful