# Product Requirements Document: Phase 1 - Complete Admin Portal MVP

## Introduction/Overview

Phase 1 delivers a fully functional admin portal for the Rinkflow platform, enabling organization administrators to manage coaches, handle billing, view analytics, and configure settings. This phase transforms the existing Next.js Catalyst template into a production-ready admin dashboard integrated with Supabase authentication, Stripe billing, and comprehensive organization management features. The goal is to provide administrators with all essential tools to manage their organizations effectively from day one.

## Goals

1. Deliver a complete admin portal with all core functionality
2. Integrate Supabase authentication with email/password and Google OAuth
3. Implement comprehensive coach management with CSV import/export
4. Integrate Stripe for subscription and billing management
5. Provide analytics and usage insights for organizations
6. Enable organization settings and configuration management
7. Establish scalable architecture with React Query for data operations
8. Deploy production-ready solution with proper security and performance

## User Stories

1. **As an organization admin**, I want to log in using email/password or Google OAuth so that I can access the admin portal securely.

2. **As an organization admin**, I want to view a dashboard with key metrics so that I can quickly understand my organization's status.

3. **As an organization admin**, I want to add and remove coaches from my organization so that I can manage team access.

4. **As an organization admin**, I want to bulk import coaches via CSV so that I can efficiently onboard multiple team members.

5. **As an organization admin**, I want to manage my subscription and billing so that I can upgrade, downgrade, or cancel as needed.

6. **As an organization admin**, I want to view analytics about coach activity and content creation so that I can track platform usage.

7. **As an organization admin**, I want to configure organization settings so that I can customize how my team uses the platform.

8. **As a regular coach**, I should see a clear error message when trying to log in so that I understand this portal is for administrators only.

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

9. **FR9**: The system must handle the root route (/) as follows:
   - Redirects to /login when not authenticated
   - Redirects to /dashboard immediately if already authenticated as admin
   - Shows error message if authenticated user is not an admin
10. **FR10**: The login page must display Rinkflow branding and authentication functionality
11. **FR11**: The (auth) route group pages (/login, /forgot-password) must be the only publicly accessible pages

### Protected Routes (FR12-FR15)

12. **FR12**: The system must protect all (app) routes, requiring admin authentication
13. **FR13**: The system must redirect unauthenticated users to /login when accessing protected routes  
14. **FR14**: The system must redirect authenticated admins from root and /login to /dashboard automatically
15. **FR15**: The system must implement all navigation routes: /dashboard, /coaches, /organization-settings, /billing, /analytics, /settings

### Branding & UI (FR16-FR20)

16. **FR16**: The system must replace all Catalyst demo content with Rinkflow branding
17. **FR17**: The system must use the existing Catalyst UI components and theme without custom color overrides
18. **FR18**: The system must display the Rinkflow logo consistently across all pages
19. **FR19**: The system must implement responsive design with desktop-first optimization
20. **FR20**: The system must support dark mode if provided by Catalyst theme

### Dashboard Page (FR21-FR25)

21. **FR21**: The dashboard must display organization overview metrics (total coaches, subscription status)
22. **FR22**: The dashboard must show recent activity and events
23. **FR23**: The dashboard must provide quick action cards for common tasks
24. **FR24**: The dashboard must refresh data using React Query
25. **FR25**: The dashboard must load within 2 seconds

### Coaches Management (FR26-FR33)

26. **FR26**: The coaches page must display all organization coaches in a paginated table
27. **FR27**: The system must support adding individual coaches by email
28. **FR28**: The system must support bulk coach import via CSV file upload
29. **FR29**: The system must validate seat limits before adding coaches
30. **FR30**: The system must support removing coaches with confirmation
31. **FR31**: The system must provide search and filter capabilities for coaches
32. **FR32**: The system must support role assignment (admin/member)
33. **FR33**: The system must export coach lists to CSV format

### Organization Settings (FR34-FR38)

34. **FR34**: The settings page must display organization name and details
35. **FR35**: The system must allow editing organization information
36. **FR36**: The system must display member count vs seat limit
37. **FR37**: The system must show current subscription status
38. **FR38**: The system must allow managing organization administrators

### Billing Management (FR39-FR45)

39. **FR39**: The billing page must display current subscription plan
40. **FR40**: The system must show seat usage with visual indicators
41. **FR41**: The system must provide upgrade/downgrade plan options
42. **FR42**: The system must display billing history and invoices
43. **FR43**: The system must integrate with Stripe billing portal
44. **FR44**: The system must support subscription cancellation
45. **FR45**: The system must handle failed payment notifications

### Analytics & Reporting (FR46-FR50)

46. **FR46**: The analytics page must show organization usage metrics
47. **FR47**: The system must display coach activity statistics
48. **FR48**: The system must track content creation (drills, practice plans)
49. **FR49**: The system must provide revenue and billing trends
50. **FR50**: The system must export analytics data to CSV

### Settings & Configuration (FR51-FR55)

51. **FR51**: The settings page must allow admin profile management
52. **FR52**: The system must provide app preference configuration
53. **FR53**: The system must manage notification settings
54. **FR54**: The system must display audit logs for admin actions
55. **FR55**: The system must securely handle all environment variables

## Non-Goals (Out of Scope)

1. **No public organization signup**: Organizations are created through other channels
2. **No mobile app integration**: This is a web-only admin portal
3. **No coach-facing features**: Coaches use the mobile app exclusively
4. **No email notifications**: Email system deferred to Phase 2
5. **No real-time collaboration**: Single admin user at a time
6. **No API development**: Backend work happens in main Rinkflow codebase
7. **No custom reporting**: Only predefined analytics views
8. **No white-label customization**: Standard Rinkflow branding only
9. **No webhook integrations**: Third-party integrations deferred
10. **No advanced permissions**: Simple admin/non-admin distinction

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
   
   # For future phases (reference only)
   # STRIPE_SECRET_KEY=sk_...
   # STRIPE_WEBHOOK_SECRET=whsec_...
   # STRIPE_PUBLISHABLE_KEY=pk_...
   ```
6. **Admin Check Logic**: Implement temporary email whitelist check against hardcoded admin emails until organization_members table is ready
7. **TypeScript Types**: Copy database types from main Rinkflow codebase `src/types/database.types.ts` for consistency
8. **Local Development**: Use existing Docker-based local Supabase instance for development
9. **Error Handling**: Implement comprehensive error catching and user-friendly error messages throughout
10. **Service Role Key Usage**: Use service role key only for server-side operations, never expose in client-side code
11. **Available Backend Resources**: The following resources from the main Rinkflow codebase can be referenced for Phase 2:
    - Server-side functions in `src/lib/supabase/organizations-server.ts`
    - Invoice management in `src/lib/supabase/invoices-server.ts`
    - Database migrations already applied (organizations, organization_members tables exist)
12. **Dependencies to Install**: 
    - `@supabase/supabase-js` - Required for Phase 1
    - `@tanstack/react-query` - Required for data fetching and caching

## Success Metrics

1. **Authentication**: 100% of admin emails can log in via email or Google OAuth
2. **Access Control**: Non-admin users cannot access any protected routes
3. **Page Load Performance**: All pages load in under 2 seconds
4. **Data Operations**: CSV import/export handles 1000+ coaches without errors
5. **Billing Integration**: Stripe operations complete within 3 seconds
6. **Search Performance**: Coach search returns results in under 500ms
7. **Session Management**: Sessions persist for 7 days with proper refresh
8. **Error Handling**: All errors show user-friendly messages
9. **Mobile Responsiveness**: All pages usable on tablet devices
10. **Production Deployment**: Zero critical bugs in first week

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
- `/src/app/page.tsx` - Implement login page at root (redirects to (auth)/login)
- `/src/app/(auth)/layout.tsx` - Keep auth layout (no sidebar)
- `/src/app/(auth)/login/page.tsx` - Update login page with Supabase
- `/src/app/(auth)/forgot-password/page.tsx` - Keep forgot password page
- `/src/app/(app)/layout.tsx` - Keep app layout with sidebar
- `/src/app/(app)/dashboard/page.tsx` - Create dashboard placeholder
- `/src/middleware.ts` - Add route protection and admin check
- `/src/lib/supabase.ts` - Create Supabase client configuration
- `/src/lib/auth.ts` - Admin email whitelist and auth helpers
- `.env.local` - Add environment variables

### Testing Checklist:

#### Authentication
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] Forgot password flow sends reset email
- [ ] Non-admin users see appropriate error
- [ ] Sessions persist for 7 days
- [ ] Logout clears session properly

#### Dashboard
- [ ] Displays organization metrics
- [ ] Shows recent activity
- [ ] Quick actions work
- [ ] Data refreshes properly

#### Coaches Management
- [ ] List displays with pagination
- [ ] Add single coach works
- [ ] CSV import handles 100+ coaches
- [ ] Remove coach with confirmation
- [ ] Search and filters work
- [ ] CSV export generates valid file

#### Billing
- [ ] Displays current subscription
- [ ] Stripe portal link works
- [ ] Shows billing history
- [ ] Upgrade/downgrade flows work

#### Analytics
- [ ] Shows usage metrics
- [ ] Displays coach activity
- [ ] Exports data to CSV

#### Performance
- [ ] All pages load < 2 seconds
- [ ] Search returns < 500ms
- [ ] CSV operations handle 1000+ rows