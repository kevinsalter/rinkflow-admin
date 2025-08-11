### Dashboard Page

#### Requirements
- Coach count with seat limit
- Quick activity metrics (active in last 7 days)
- Recent coaches added
- Quick action buttons (Add Coaches, View Billing)
- Simple and scannable layout# Technical Requirements Document: Rinkflow Admin Web Interface

## Overview

Transform the existing Next.js codebase (currently Catalyst demo placeholders) into a functional organization management portal for Rinkflow. This admin portal is exclusively for organization administrators (association leaders, coaching directors) to manage their organization's subscription, coaches, and settings. The codebase already has Catalyst UI components installed and basic structure in place. Coaches will continue using the existing mobile app exclusively for their coaching activities.

## Technical Stack

- **Framework**: Next.js with App Router (existing codebase with Catalyst demo)
- **UI Library**: Tailwind UI Catalyst (already installed and configured)
- **Authentication**: Supabase Auth (needs integration with existing mobile app backend)
- **Database**: Existing Supabase instance from mobile app
- **Payments**: Stripe Elements and Billing Portal (needs integration)
- **Hosting**: Vercel
- **Domain**: admin.rinkflow.com

## Application Structure

Note: The codebase already has Catalyst's demo structure in place. These routes need to be adapted from the existing placeholder pages.

### Public Route
- `/` (root) - Login page (redirects to /dashboard if already authenticated as admin)

### Protected Routes (Admin Only)

All routes require admin role verification via middleware.

#### Core Admin Pages
- `/dashboard` - Overview of key metrics (or could be the root for admins)
- `/coaches` - Add/remove coaches, view activity
- `/analytics` - Detailed usage statistics
- `/billing` - Plan info, invoices, payment methods
- `/settings` - Organization info, logo, preferences

## Core Features

### Organization Signup Flow

#### Requirements
- Multi-step wizard interface using Catalyst components
- Organization information collection
- Admin account creation or existing account linking
- Subscription tier selection (plans presented during signup)
- Stripe payment method collection
- Automatic admin role assignment to signup user
- Success page with instructions to share app with coaches

#### UI Components Needed
- Step progress indicator
- Form validation with inline errors
- Pricing cards with feature comparison
- Stripe Elements integration
- Loading states during payment processing

### Coach Management System

### Coach Management System

#### Add Coaches Interface
- Single and bulk email input (textarea for multiple)
- CSV upload for bulk addition
- Seat availability display with clear limits
- Immediate addition to organization (no invitations)
- Success message with app download instructions to share

#### Member Management Table
- Paginated list of all organization members
- Search and filter capabilities
- Sort by name, role (admin/coach), join date, last active
- Bulk actions (remove multiple, promote to admin)
- Individual member actions dropdown
- Export member list functionality
- Status indicator (account created vs pending)
- Clear labeling of admin vs coach roles

#### Instructions for Admins
- Clear messaging: "Tell coaches to download Rinkflow from App Store"
- Show which coaches have activated accounts
- Display which emails are waiting for account creation

### Billing Dashboard

#### Subscription Overview
- Current plan name and coach limit
- Seats used vs available (e.g., "18 of 30 coaches")
- Next billing date and amount
- Payment method display (last 4 digits)
- Contact support for plan changes (pre-negotiated)

#### Invoice Management
- Invoice history table
- Download individual invoices (PDF)
- Payment status indicators
- Date and amount for each invoice

#### Stripe Portal Access
- Link to Stripe customer portal for payment method updates
- Update billing email address

### Usage Statistics Dashboard

#### Organization Metrics
- Total active coaches (logged in last 30 days)
- Total drills created (all-time and this month)
- Total practice plans created (all-time and this month)
- Average drills per coach
- Adoption rate (% of coaches who've created content)

#### Usage Trends
- Coach activity over time (line chart)
- Content creation over time (drills/plans)
- Weekly active coaches
- Month-over-month growth

#### Coach Activity Table
- Each coach's metrics (drills created, plans created, last active)
- Sort by any column
- Identify power users and inactive coaches
- Export to CSV for board reports

#### Time Controls
- Date range selector (last 7/30/90 days/all time)
- Compare to previous period option

### Organization Settings

#### Basic Settings
- Organization name
- Logo upload and management
- Primary contact email
- Time zone

#### Account Management
- View current plan
- Download coach list (CSV)
- Request account closure (support link)

## User Experience Requirements

### Target Users
- **Primary**: Organization administrators (Technical Directors, Coaching Coordinators)
- **Secondary**: Association presidents and board members
- **Not targeted**: Individual coaches (they use mobile app only)

### Design System
- Consistent use of Catalyst components
- Desktop-first design (admins will use computers)
- Responsive for tablets as secondary priority
- Dark mode support (if Catalyst provides)
- Accessible UI meeting WCAG 2.1 AA

### Navigation
- Persistent sidebar navigation (Catalyst pattern)
- Clear section separation (Coaches, Billing, Analytics, Settings)
- Breadcrumb navigation for deep pages
- Quick actions for common tasks

### Feedback Mechanisms
- Toast notifications for actions (e.g., "15 coaches added successfully")
- Loading states for all async operations
- Error boundaries with helpful messages
- Success confirmations with clear next steps
- Copy-to-clipboard for app download instructions

### Desktop Optimization
- Optimized for desktop browsers (Chrome, Safari, Firefox)
- Data tables with sorting and filtering
- Keyboard shortcuts for power users
- Multi-select operations

## Email Requirements

None for MVP. Organizations will communicate app download instructions directly to their coaches.

## Authentication & Authorization

### Authentication Flow
- Shared Supabase auth with main app
- Magic link and password options
- OAuth providers (Google, possibly others)
- Session management across tabs
- Simple admin check on login (redirect if not admin)

### Authorization Rules
- Only organization admins can access the portal
- Simple check: is user an admin in any organization?
- No granular permissions within portal (admins have full access)
- Organization context enforcement
- API request authentication against Supabase

## Integration Requirements

### Rinkflow Backend API
- Integrate with existing and new organization endpoints
- Leverage existing authentication system
- Use existing user profile structure
- Connect to new organization management endpoints
- Access existing drill/plan data for statistics

### Stripe Integration
- Customer portal embedding
- Payment method collection
- Webhook endpoint configuration
- Subscription lifecycle management

### Supabase Integration
- Shared authentication system
- Real-time subscription updates
- File storage for logos/assets

## Performance Requirements

### Page Load Targets
- Initial load: <3 seconds
- Navigation: <500ms
- API responses: <200ms
- Search results: <1 second

### Optimization Strategies
- Static generation where possible
- API route caching
- Image optimization
- Code splitting by route
- Prefetching critical resources

## Security Requirements

### Data Protection
- HTTPS only with strict transport security
- Content Security Policy headers
- XSS and CSRF protection
- Secure session management

### Compliance
- No mobile app subscription references
- Clear data privacy policy
- GDPR compliance for EU organizations
- Secure payment data handling (PCI)

## Error Handling

### User-Facing Errors
- Friendly error messages
- Recovery suggestions
- Support contact information
- Error reporting mechanism

### System Errors
- Error boundary implementation
- Sentry or similar error tracking
- Graceful degradation
- Offline handling strategies

## Testing Requirements

### Test Coverage
- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical flows
- Visual regression testing

### Critical Test Scenarios
- Login with admin account (success)
- Login with non-admin account (denied)
- Add coaches in bulk (CSV upload)
- Remove coaches from organization
- Check coach activation status
- View and download invoices
- Export usage analytics
- Logo upload and display

## Deployment Requirements

### Infrastructure
- Vercel deployment with preview URLs
- Environment variable management
- CDN configuration
- Domain and SSL setup

### CI/CD Pipeline
- Automated testing on PR
- Preview deployments for branches
- Production deployment protection
- Rollback capabilities

## Monitoring & Analytics

### Application Monitoring
- Uptime monitoring
- Performance metrics
- Error rate tracking
- User analytics (privacy-compliant)

### Business Metrics
- Signup funnel conversion
- Invitation acceptance rate
- Feature usage statistics
- User engagement metrics

## Implementation Priorities

### Phase 1: Foundation (Week 1)
- Replace Catalyst demo content with Rinkflow branding
- Set up Supabase client and authentication
- Configure environment variables
- Implement root page as login (redirects to /dashboard if authenticated)
- Admin role verification middleware (non-admins see error message)
- Protected route setup for admin pages (/dashboard, etc.)

### Phase 2: Core Features (Week 2)
- Dashboard with key metrics
- Coach management (add/remove by email)
- Member management table with status
- Settings page with logo upload
- Basic navigation between pages

### Phase 3: Polish & Launch (Week 3-4)
- Organization settings pages
- Success messaging and coach instructions
- Performance optimization
- Testing and bug fixes

### Post-MVP Features
- Email notifications for coaches
- Drill library management interface
- Practice plan template administration
- Advanced analytics and insights
- Multiple admin management
- Bulk operations improvements
- White-label customization

## Success Criteria

- Root page shows login when not authenticated, redirects to /dashboard when admin
- Non-admin users see clear error message when trying to access
- Admins can add coaches in bulk without friction
- Clear instructions for coaches to download app
- Zero billing-related support tickets after launch
- Page load times meet performance targets
- Passes accessibility audit
- Successfully handles 100 concurrent organizations
