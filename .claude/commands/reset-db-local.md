# Reset Local Database

This command performs a complete reset of your local Supabase database, including schema recreation, test user creation, and seed data loading.

## Quick Command (All-in-One)

```bash
npm run db:reset
```

This runs the complete reset process including:
- Resetting database schema
- Creating 4 test auth users
- Loading all seed data (drills, practice plans, groups, shares)
- Verifying the data was loaded correctly

## Step-by-Step Commands

If you need more control, you can run the steps individually:

### 1. Reset Database Schema Only
```bash
npx supabase db reset --local
```

### 2. Create Test Auth Users
```bash
npm run db:seed:auth
```

### 3. Load Seed Data (without auth users)
```bash
npm run db:seed
```

## Partial Seeding Commands

For testing specific features:

```bash
# Add only practice plans
npm run db:seed:plans

# Add practice plans with extended history (43 total)
./scripts/seed-only-plans.sh local --with-history

# Add only coaching groups
npm run db:seed:groups

# Add only drill shares
npm run db:seed:shares

# Add only drills
./scripts/seed-only-drills.sh local
```

## Clean Database (Remove Data, Keep Schema)

```bash
npm run db:clean
```

## Test User Credentials

After reset, these test users are available:

| User | Email | Password | Description |
|------|-------|----------|-------------|
| Coach Sarah | `coach.sarah@rinkflow.test` | `TestCoach123!` | Primary test user with most data |
| Coach Mike | `coach.mike@rinkflow.test` | `TestCoach123!` | Secondary coach, shares drills |
| Player Alex | `player.alex@rinkflow.test` | `TestPlayer123!` | Player/Assistant coach |
| Admin Test | `admin@rinkflow.test` | `AdminTest123!` | System administrator |

## Verify Reset Success

Check data counts:
```bash
docker exec -i supabase_db_rinkflow psql -U postgres -d postgres -c "
SELECT 'Users:' as type, COUNT(*) FROM auth.users WHERE email LIKE '%@rinkflow.test'
UNION ALL SELECT 'Drills:', COUNT(*) FROM drills
UNION ALL SELECT 'Plans:', COUNT(*) FROM practice_plans
UNION ALL SELECT 'Groups:', COUNT(*) FROM coaching_groups;"
```

Expected counts:
- Auth Users: 4
- Drills: 36
- Practice Plans: 18 base (43 with extended history)
- Coaching Groups: 4

## Access Local Supabase Studio

After reset, access the local Supabase Studio at:
```
http://localhost:54323
```

## Troubleshooting

### Supabase not running
```bash
npx supabase start
```

### Port conflicts
```bash
npx supabase stop
npx supabase start
```

### Force reset (if normal reset fails)
```bash
npx supabase stop --no-backup
npx supabase start
npm run db:reset
```

### Users already exist error
```bash
# Skip auth creation
npm run db:seed
```

## Notes

- All test users have confirmed emails and can log in immediately
- Coach Sarah is the primary test user with the most comprehensive data
- The seed data includes interconnected relationships (groups, shares, favorites)
- Seed helper functions are created with security fixes (SET search_path)