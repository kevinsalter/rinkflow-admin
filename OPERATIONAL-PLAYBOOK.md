# Operational Playbook

This document contains step-by-step procedures for common operational tasks, customer support scenarios, and manual interventions required for Rinkflow Admin.

## Table of Contents
1. [Organization Setup](#organization-setup)
2. [User Management](#user-management)
3. [Drill Library Management](#drill-library-management)
4. [Billing & Subscription Management](#billing--subscription-management)
5. [Troubleshooting](#troubleshooting)

---

## Organization Setup

### Creating a New Organization After Sales

**When to use:** After successfully negotiating a contract with a hockey association or organization.

**Prerequisites:**
- Signed agreement with organization
- Organization details (name, admin email, plan type, seat count)
- Access to Supabase database

**Steps:**

1. **Create the organization record in Supabase:**
```sql
-- Step 1: Insert organization
INSERT INTO organizations (
  name, 
  plan_type, 
  seat_limit, 
  status,
  created_at
) VALUES (
  'Mississauga Hockey League',  -- Organization name
  'professional',                -- Plan type: starter/professional/enterprise
  50,                           -- Number of coach seats negotiated
  'pending_payment',            -- Initial status
  NOW()
) RETURNING id;

-- Save the returned organization ID for next steps
```

2. **Create or identify the admin user:**
```sql
-- Check if user already exists
SELECT id FROM auth.users WHERE email = 'admin@mississaugahockey.ca';

-- If user doesn't exist, create via Supabase Auth Admin API
-- (This will be done programmatically, see step 3)
```

3. **Send password reset email (using Supabase JS client):**
```javascript
// In a Node.js script or admin tool:
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'admin@mississaugahockey.ca',
  { 
    redirectTo: 'https://admin.rinkflow.com/setup',
    data: {
      organization_id: '<org_id_from_step_1>'
    }
  }
);
```

4. **Assign admin role to the organization:**
```sql
-- Step 4: Create organization membership with admin role
INSERT INTO organization_members (
  user_id,
  organization_id,
  email,
  role,
  joined_at,
  created_at
)
SELECT
  '<user_id_from_step_2>',
  '<org_id_from_step_1>',
  email,
  'admin',
  NOW(),
  NOW()
FROM user_profiles
WHERE id = '<user_id_from_step_2>';
```

5. **Send welcome email to admin (manual or automated):**
```
Subject: Welcome to Rinkflow Admin - Complete Your Setup

Hi [Admin Name],

Your Rinkflow Admin account has been created for [Organization Name].

Please check your email for a password reset link to set up your account.

Once logged in, you'll need to:
1. Add your payment method to activate your subscription
2. Add your coaches to the platform
3. Share the Rinkflow mobile app download link with your coaches

Your plan includes:
- Plan: [Plan Type]
- Coach Seats: [Number]
- Monthly Price: $[Amount]

If you have any questions, please contact support@rinkflow.com

Best regards,
The Rinkflow Team
```

6. **Track setup completion:**
```sql
-- Monitor if admin has completed setup
SELECT 
  o.name,
  o.status,
  o.stripe_customer_id IS NOT NULL as has_payment_method,
  COUNT(om.id) as total_members
FROM organizations o
LEFT JOIN organization_members om ON o.id = om.organization_id
WHERE o.id = '<org_id>'
GROUP BY o.id;
```

---

## User Management

### Promoting a Coach to Organization Admin

**When to use:** Organization needs additional administrators.

**Steps:**
1. Verify the coach is already a member of the organization
2. Update their role in organization_members table:
```sql
UPDATE organization_members 
SET role = 'admin'
WHERE user_id = '<coach_user_id>' 
  AND organization_id = '<org_id>';
```
3. Notify the user of their new admin privileges

### Removing a User from an Organization

**When to use:** Coach leaves the organization or subscription downsizing.

**Steps:**
1. Identify user and verify organization membership
2. Check for any content ownership that needs transfer
3. Remove from organization:
```sql
DELETE FROM organization_members 
WHERE user_id = '<user_id>' 
  AND organization_id = '<org_id>';
```
4. Notify user of removal and data retention policy

---

## Drill Library Management

### Migrating Personal Drills to Organization

**When to use:** A coach with a personal drill library joins an organization and wants to share their drills.

**Prerequisites:**
- User consent to transfer drills
- Target organization has available storage/limits

**Steps:**

1. **Identify drills to migrate:**
```sql
-- List all personal drills for the user
SELECT id, title, created_at, is_private 
FROM drills 
WHERE user_id = '<user_id>' 
  AND organization_id IS NULL;
```

2. **Create backup of drill ownership:**
```sql
-- Create audit log entry before migration
INSERT INTO drill_migration_log (
  user_id, 
  from_type, 
  to_organization_id, 
  drill_count, 
  migrated_at
) VALUES (
  '<user_id>',
  'personal',
  '<target_org_id>',
  (SELECT COUNT(*) FROM drills WHERE user_id = '<user_id>' AND organization_id IS NULL),
  NOW()
);
```

3. **Migrate drills to organization:**
```sql
-- Update drill ownership
UPDATE drills 
SET organization_id = '<target_org_id>',
    updated_at = NOW()
WHERE user_id = '<user_id>' 
  AND organization_id IS NULL
  AND id IN (
    -- List of specific drill IDs if not migrating all
    'drill_id_1', 'drill_id_2', ...
  );
```

4. **Notify user of successful migration**

### Exporting Organization Drills to Personal Account

**When to use:** A coach leaves an organization but wants to keep copies of drills they created.

**Important:** Check organization's data policy - some orgs may not allow drill exports.

**Steps:**

1. **Identify drills created by the user:**
```sql
-- Find drills user created for the organization
SELECT id, title, created_at 
FROM drills 
WHERE created_by_user_id = '<user_id>' 
  AND organization_id = '<org_id>';
```

2. **Create copies for personal use:**
```sql
-- Duplicate drills to personal library
INSERT INTO drills (
  user_id,
  organization_id,
  title,
  description,
  category,
  difficulty,
  duration,
  content,
  created_at,
  created_by_user_id
)
SELECT 
  '<user_id>' as user_id,
  NULL as organization_id,  -- Personal drill
  CONCAT('Copy of ', title) as title,
  description,
  category,
  difficulty,
  duration,
  content,
  NOW() as created_at,
  '<user_id>' as created_by_user_id
FROM drills
WHERE created_by_user_id = '<user_id>'
  AND organization_id = '<org_id>'
  AND id IN ('drill_1', 'drill_2');  -- Specific drills to copy
```

3. **Log the export for audit purposes:**
```sql
INSERT INTO drill_migration_log (
  user_id,
  from_organization_id,
  to_type,
  drill_count,
  migrated_at
) VALUES (
  '<user_id>',
  '<org_id>',
  'personal',
  <number_of_drills>,
  NOW()
);
```

### Bulk Import Drills from CSV

**When to use:** Organization has existing drill library in spreadsheet format.

**Steps:**
1. Validate CSV format matches expected schema
2. Check organization's drill limits
3. Use import script with error handling
4. Generate import report with successes/failures
5. Notify admin of import completion

---

## Billing & Subscription Management

### Manually Extending Trial Period

**When to use:** Sales negotiation requires extended evaluation period.

**Steps:**
1. Update organization's trial_ends_at date:
```sql
UPDATE organizations 
SET trial_ends_at = NOW() + INTERVAL '30 days'
WHERE id = '<org_id>';
```
2. Notify admin of extension
3. Update CRM with extension reason

### Handling Failed Payment

**When to use:** Stripe webhook indicates payment failure.

**Steps:**
1. Check payment failure reason in Stripe dashboard
2. Update organization status if necessary:
```sql
UPDATE organizations 
SET status = 'payment_failed',
    status_updated_at = NOW()
WHERE id = '<org_id>';
```
3. Send payment failure notification to admin
4. Implement grace period (typically 7 days)
5. If unresolved, downgrade to limited access

### Manual Plan Upgrade/Downgrade

**When to use:** Organization negotiates plan change outside standard flow.

**Steps:**
1. Update organization plan in database:
```sql
UPDATE organizations 
SET plan_type = 'enterprise',
    seat_limit = 100,
    updated_at = NOW()
WHERE id = '<org_id>';
```
2. Update Stripe subscription via API
3. Prorate billing if mid-cycle
4. Notify admin of plan change

---

## Troubleshooting

### Admin Cannot Access Dashboard

**Common causes and solutions:**

1. **Not marked as admin:**
```sql
-- Check admin status
SELECT role FROM organization_members 
WHERE user_id = '<user_id>' AND organization_id = '<org_id>';
```

2. **Organization suspended:**
```sql
-- Check organization status
SELECT status FROM organizations WHERE id = '<org_id>';
```

3. **Email not verified:**
```sql
-- Check email verification status
SELECT email_confirmed_at FROM auth.users WHERE id = '<user_id>';
```

### Duplicate Organization Creation

**When to use:** Accidentally created duplicate organization records.

**Steps:**
1. Identify which record to keep (usually older one with data)
2. Migrate any unique data from duplicate
3. Update all foreign key references
4. Delete duplicate organization
5. Notify affected users if any

### Emergency Access Grant

**When to use:** Admin locked out and needs immediate access.

**Steps:**
1. Verify identity through agreed security process
2. Create temporary admin access:
```sql
-- Create temporary admin user
INSERT INTO auth.users (email, created_at) 
VALUES ('temp.admin@rinkflow.com', NOW());

-- Grant organization access
INSERT INTO organization_members (user_id, organization_id, role)
VALUES ('<temp_user_id>', '<org_id>', 'admin');

-- Set expiration for temp access
UPDATE organization_members 
SET expires_at = NOW() + INTERVAL '24 hours'
WHERE user_id = '<temp_user_id>';
```
3. Send password reset to temporary email
4. Monitor temporary account usage
5. Revoke access after issue resolved

---

## Notes

- Always create audit logs for sensitive operations
- Test SQL queries in development environment first
- Keep customer communication professional and timely
- Escalate to senior team for data deletions or financial adjustments
- Maintain security - never share passwords or bypass authentication
- Document any deviations from standard procedures