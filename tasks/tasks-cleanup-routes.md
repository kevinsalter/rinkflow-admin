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

- [ ] 1.0 Consolidate login to root route
  - [ ] 1.1 Copy any useful login form code from `/src/app/(auth)/login/page.tsx` to `/src/app/page.tsx`
  - [ ] 1.2 Update root page to show only login form (remove landing page content)
  - [ ] 1.3 Remove the "Get Started", "Features", "About", "Contact" navigation links
  - [ ] 1.4 Keep Rinkflow branding but simplify to just logo and login form

- [ ] 2.0 Remove unnecessary auth pages
  - [ ] 2.1 Delete `/src/app/(auth)/register` directory
  - [ ] 2.2 Delete `/src/app/(auth)/forgot-password` directory  
  - [ ] 2.3 Delete `/src/app/(auth)/contact` directory
  - [ ] 2.4 Delete `/src/app/(auth)/invitations` directory
  - [ ] 2.5 Delete `/src/app/(auth)/organizations` directory
  - [ ] 2.6 Delete `/src/app/(auth)/login` directory (after moving code to root)

- [ ] 3.0 Clean up auth layout and components
  - [ ] 3.1 Remove `/src/app/(auth)/layout.tsx` if it exists
  - [ ] 3.2 Delete `/src/components/stacked-layout.tsx` if no longer needed
  - [ ] 3.3 Remove any auth-specific layout wrappers

- [ ] 4.0 Update navigation and routing
  - [ ] 4.1 Remove all links to deleted auth pages from navigation
  - [ ] 4.2 Update any redirects that point to `/login` to point to `/`
  - [ ] 4.3 Ensure mobile menu only shows login-related actions

- [ ] 5.0 Verify the cleanup
  - [ ] 5.1 Confirm "/" shows the login form
  - [ ] 5.2 Verify no broken links to removed pages
  - [ ] 5.3 Check that protected routes (under app) still work
  - [ ] 5.4 Ensure the build completes without errors
  - [ ] 5.5 Test that only "/" is accessible without authentication