# Organization Audit Log & Activity Tracking

## Overview

**Goal**: Provide organization administrators with comprehensive visibility into all actions performed within their organization, including member management, role changes, and system events.

**Problem**: Currently, there is no persistent server-side audit trail for organization activities. Admins cannot see who added/removed members, changed roles, or made other critical changes to their organization.

**Solution**: Implement a comprehensive audit logging system that tracks all organization-related actions and provides an activity feed for administrators.

## User Stories

### Primary Users
- **Organization Administrators**: Need visibility into team management actions
- **Organization Owners**: Require accountability and security oversight
- **Support Team**: Need audit trails for troubleshooting and security investigations

### Core User Stories

**As an organization administrator, I want to:**
- See who added or removed coaches from my organization
- View when member roles were changed and by whom
- Track organization settings updates (name, seat limits, etc.)
- Monitor subscription and billing changes
- See login/security events for my organization members
- Export audit logs for compliance or investigation purposes

**As a support agent, I want to:**
- Access audit logs to troubleshoot member access issues
- Investigate security incidents or unauthorized changes
- Understand the sequence of events leading to a problem

## Features & Requirements

### 1. Server-Side Audit Logging

#### Database Schema
```sql
-- Organization audit log table
CREATE TABLE organization_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  action_type TEXT NOT NULL,
  actor_user_id UUID REFERENCES auth.users(id),
  actor_email TEXT, -- In case user is deleted later
  target_user_id UUID REFERENCES auth.users(id),
  target_email TEXT,
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  source TEXT DEFAULT 'web_admin', -- 'web_admin', 'mobile_app', 'api', 'system'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_org_audit_log_org_id ON organization_audit_log(organization_id);
CREATE INDEX idx_org_audit_log_created_at ON organization_audit_log(created_at DESC);
CREATE INDEX idx_org_audit_log_actor ON organization_audit_log(actor_user_id);
CREATE INDEX idx_org_audit_log_action_type ON organization_audit_log(action_type);
```

#### Tracked Actions
- `member_invited` - Admin invites new member by email
- `member_joined` - Invited member signs up and joins
- `member_removed` - Member removed from organization
- `member_role_changed` - Member role updated (coach ↔ admin)
- `organization_updated` - Organization name/settings changed
- `seat_limit_changed` - Seat limit increased/decreased
- `subscription_created` - New Stripe subscription
- `subscription_updated` - Subscription plan/quantity changed
- `subscription_cancelled` - Subscription cancelled
- `payment_succeeded` - Successful payment
- `payment_failed` - Failed payment
- `member_login` - Organization member logged in
- `member_last_active` - Track last activity timestamp

### 2. Admin Dashboard Activity Feed

#### Activity Feed UI
- **Location**: Dedicated "Activity" tab in Admin Dashboard
- **Layout**: Chronological list with filtering options
- **Real-time**: Updates via WebSocket/polling for live events

#### Feed Components
- **Activity Item**: Icon, description, timestamp, actor
- **Details Expansion**: Click to see full context (old/new values)
- **Filtering**: By action type, date range, specific members
- **Search**: Find specific events or users
- **Pagination**: Handle large audit logs efficiently

#### Sample Activity Items
```
👤 John Doe added sarah@hockey.com as a coach          2 minutes ago
🔧 Jane Admin changed seat limit from 15 to 20 seats   1 hour ago
💳 Subscription upgraded to Annual plan                 Yesterday
❌ Mike Coach was removed from organization             3 days ago
🔄 tom@coach.com's role changed from Coach to Admin    1 week ago
```

### 3. Audit Log API Endpoints

#### For Admin Dashboard (Next.js)
```typescript
// Get organization activity feed
GET /api/organizations/{orgId}/audit-log
Query params:
- limit: number (default: 50, max: 200)
- offset: number
- action_type: string[] (filter by action types)
- actor_user_id: string (filter by who did the action)
- target_user_id: string (filter by who was affected)
- start_date: ISO date
- end_date: ISO date

// Export audit log as CSV
GET /api/organizations/{orgId}/audit-log/export
Query params: same as above
Returns: CSV file download
```

#### For Mobile App (React Native)
```typescript
// Get recent activity for organization members
GET /api/organizations/{orgId}/recent-activity
Returns: Last 20 activities relevant to current user

// Get activity for specific entity
GET /api/organizations/{orgId}/activity/{entityType}/{entityId}
Examples:
- GET /api/organizations/{orgId}/activity/member/{userId}
- GET /api/organizations/{orgId}/activity/drill/{drillId}
```

### 4. Integration Points

#### Admin Dashboard Integration
- **Member Management**: Log when adding/removing members
- **Role Changes**: Track admin/coach role updates
- **Settings**: Log organization profile updates
- **Billing**: Track subscription changes from Stripe

#### Stripe Webhook Integration
- **Subscription Events**: Log subscription lifecycle events
- **Payment Events**: Track successful/failed payments
- **Invoice Events**: Log invoice creation/payment

#### Mobile App Integration
- **Member Actions**: Log when members perform significant actions
- **Security Events**: Track login attempts, password changes
- **Content Activity**: Major actions like sharing/creating content

### 5. Security & Compliance

#### Data Retention
- **Retention Period**: 2 years for audit logs
- **Automatic Cleanup**: Cron job to remove old logs
- **Export Before Deletion**: Allow export of logs being deleted

#### Privacy Considerations
- **PII Handling**: Minimal personal data in logs
- **GDPR Compliance**: Allow user data deletion from audit logs
- **Data Anonymization**: Replace deleted user data with "[Deleted User]"

#### Access Control
- **Admin Only**: Only organization admins can view full audit logs
- **Member Activity**: Members can see their own activity only
- **Support Access**: Support team can access with proper permissions

## Technical Implementation

### Backend Changes (Supabase)

#### Database Migration
```sql
-- Create audit log table with proper indexes
-- Add RLS policies for organization-level access
-- Create helper functions for common audit operations
```

#### Audit Helper Functions
```typescript
// Log organization activity
async function logOrganizationActivity({
  organizationId: string,
  actionType: string,
  actorUserId?: string,
  targetUserId?: string,
  targetEmail?: string,
  oldValues?: any,
  newValues?: any,
  metadata?: any,
  ipAddress?: string,
  userAgent?: string,
  source?: string
})

// Get audit log for organization
async function getOrganizationAuditLog({
  organizationId: string,
  filters?: AuditLogFilters,
  pagination?: PaginationOptions
})
```

#### Integration with Existing Functions
```typescript
// Update existing functions to include audit logging
addOrganizationMember() // -> log 'member_invited'
removeOrganizationMember() // -> log 'member_removed' 
updateMemberRole() // -> log 'member_role_changed'
updateOrganization() // -> log 'organization_updated'
```

### Frontend Changes (Admin Dashboard)

#### New Components
- `<ActivityFeed />` - Main activity list component  
- `<ActivityItem />` - Individual activity entry
- `<ActivityFilters />` - Filter/search controls
- `<AuditExport />` - Export functionality
- `<ActivityDetails />` - Expandable activity details

#### New Pages
- `/organization/activity` - Main activity feed page
- `/organization/activity/export` - Export configuration page

#### State Management
- React Query for activity feed data
- Local state for filters and pagination
- WebSocket integration for real-time updates

### Mobile App Changes (React Native)

#### Enhanced Activity Tracking
```typescript
// Update existing useActivity hook to also log to server
const { addActivity, addServerActivity } = useActivity()

// Log both locally and server-side for important actions
await addServerActivity('member_joined', organizationId, metadata)
```

#### Activity Visibility
- Organization members see relevant activities in their feed
- Personal activity history in profile
- Recent organization activity in home screen widget

## Success Metrics

### Usage Metrics
- **Admin Engagement**: % of admins who view activity feed weekly
- **Activity Volume**: Number of audit events logged per organization
- **Export Usage**: How often admins export audit logs

### Security Metrics  
- **Issue Detection**: Time to identify unauthorized changes
- **Investigation Speed**: Time to resolve member access issues
- **Compliance**: Successful audit log retention and export

### Performance Metrics
- **Page Load Time**: Activity feed loads in <2 seconds
- **API Response**: Audit log API responds in <500ms
- **Real-time Updates**: New activities appear in <5 seconds

## Implementation Timeline

### Phase 1: Core Infrastructure (Week 1-2)
- Database schema and migrations
- Basic audit logging functions
- RLS policies and security

### Phase 2: Admin Dashboard Integration (Week 3-4)
- Activity feed UI components
- API endpoints for admin dashboard
- Basic filtering and pagination

### Phase 3: Enhanced Features (Week 5-6)
- Advanced filtering and search
- Export functionality
- Real-time updates via WebSocket

### Phase 4: Mobile Integration (Week 7-8)
- Enhanced mobile activity tracking
- Server-side logging integration
- Member activity visibility

### Phase 5: Monitoring & Optimization (Week 9-10)
- Performance optimization
- Monitoring and alerting
- Data retention automation

## Risk Mitigation

### Technical Risks
- **Performance Impact**: Index properly and monitor query performance
- **Storage Growth**: Implement automatic cleanup and archiving
- **Real-time Scaling**: Use efficient WebSocket or polling strategies

### Product Risks
- **Over-Logging**: Focus on actionable events, avoid noise
- **Privacy Concerns**: Clear documentation on what's logged and why
- **Admin Overwhelm**: Smart defaults and filtering to surface important events

### Security Risks
- **Audit Log Tampering**: Immutable logs with proper access controls
- **Data Leakage**: Strict RLS policies and minimal PII in logs
- **Compliance Gaps**: Regular review of retention and deletion policies

## Future Enhancements

### Advanced Features
- **Anomaly Detection**: Alert on unusual activity patterns
- **Automated Reporting**: Weekly/monthly activity summaries
- **Integration Webhooks**: Send audit events to external systems
- **Advanced Analytics**: Activity trends and insights
- **Audit Trail Verification**: Cryptographic integrity checking

### Enterprise Features
- **SAML Integration**: Log SSO events and user provisioning
- **Advanced Exports**: Integration with compliance tools
- **Retention Policies**: Configurable retention per organization
- **External Logging**: Send audit events to external SIEM systems

---

## Appendix

### Sample Audit Log Entries

```json
{
  "id": "audit_123",
  "organization_id": "org_456", 
  "action_type": "member_invited",
  "actor_user_id": "user_789",
  "actor_email": "admin@hockey.com",
  "target_email": "newcoach@gmail.com",
  "new_values": {
    "role": "coach",
    "invited_by": "admin@hockey.com"
  },
  "metadata": {
    "source": "admin_dashboard",
    "invitation_sent": true
  },
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "source": "web_admin",
  "created_at": "2025-08-24T10:30:00Z"
}
```

### API Response Format

```json
{
  "activities": [
    {
      "id": "audit_123",
      "action_type": "member_role_changed", 
      "description": "Changed sarah@coach.com role from Coach to Admin",
      "actor": {
        "id": "user_789",
        "name": "John Admin",
        "email": "john@hockey.com"
      },
      "target": {
        "id": "user_456", 
        "name": "Sarah Coach",
        "email": "sarah@coach.com"
      },
      "changes": {
        "role": { "from": "coach", "to": "admin" }
      },
      "timestamp": "2025-08-24T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "offset": 0,
    "limit": 50,
    "has_more": true
  }
}
```