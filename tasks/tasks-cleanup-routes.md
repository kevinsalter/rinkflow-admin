# Task List: Clean Up Logged Out Routes

## Relevant Files

- `/src/app/(auth)/login/page.tsx` - Move login functionality to root
- `/src/app/(auth)/register/page.tsx` - Remove (not needed for Phase 1)
- `/src/app/(auth)/forgot-password/page.tsx` - Remove (not needed for Phase 1)
- `/src/app/(auth)/contact/page.tsx` - Remove (not needed for Phase 1)
- `/src/app/(auth)/invitations/accept/page.tsx` - Remove (not needed for Phase 1)
- `/src/app/(auth)/organizations/new/page.tsx` - Remove (not needed for Phase 1)
- `/src/app/page.tsx` - Update to be the login page
- `/src/components/stacked-layout.tsx` - Remove if only used for multi-page auth flow
- `/src/app/(auth)/layout.tsx` - Review and potentially remove

### Notes

- The root "/" will be the ONLY unauthenticated route (login page)
- All other routes remain protected under (app) or similar structure
- Keep the route group structure for organizing authenticated vs unauthenticated routes

## Tasks

- [x] 1.0 Consolidate login to root route
  - [x] 1.1 Copy any useful login form code from `/src/app/(auth)/login/page.tsx` to `/src/app/page.tsx`
  - [x] 1.2 Update root page to show only login form (remove landing page content)
  - [x] 1.3 Remove the "Get Started", "Features", "About", "Contact" navigation links
  - [x] 1.4 Add a greyscale bg image to the full page covered by a full screen black overlay with reduced opactiy

- [x] 2.0 Remove unnecessary auth pages
  - [x] 2.1 Delete `/src/app/(auth)/register` directory
  - [x] 2.2 Delete `/src/app/(auth)/forgot-password` directory
  - [x] 2.3 Delete `/src/app/(auth)/contact` directory
  - [x] 2.4 Delete `/src/app/(auth)/invitations` directory
  - [x] 2.5 Delete `/src/app/(auth)/organizations` directory
  - [x] 2.6 Delete `/src/app/(auth)/login` directory (after moving code to root)

- [x] 3.0 Clean up auth layout and components
  - [x] 3.1 Remove `/src/app/(auth)/layout.tsx` if it exists
  - [x] 3.2 Delete `/src/components/stacked-layout.tsx` if no longer needed
  - [x] 3.3 Remove any auth-specific layout wrappers

- [x] 4.0 Update navigation and routing
  - [x] 4.1 Remove all links to deleted auth pages from navigation
  - [x] 4.2 Update any redirects that point to `/login` to point to `/`
  - [x] 4.3 Ensure mobile menu only shows login-related actions

- [x] 5.0 Verify the cleanup
  - [x] 5.1 Confirm "/" shows the login form
  - [x] 5.2 Verify no broken links to removed pages
  - [x] 5.3 Check that protected routes (under app) still work
  - [x] 5.4 Ensure the build completes without errors
