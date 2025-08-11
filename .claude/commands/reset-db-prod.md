# Reset Database - Production

⚠️ **WARNING**: These commands will completely reset the PRODUCTION database. Use with extreme caution!

## Prerequisites

- Supabase CLI installed (`brew install supabase/tap/supabase`)
- Access to production Supabase project
- Production database credentials

## Quick Commands

```bash
# ⚠️ DANGER: Reset production database (requires confirmation)
npx supabase db reset --linked

# Apply all migrations to production
npx supabase db push --linked

# Seed production with minimal data (if applicable)
npx supabase db seed --linked
```

## Step-by-Step Production Reset

### 1. Backup Current Production Data (CRITICAL)

```bash
# Create a backup of production data
npx supabase db dump --linked > supabase/backups/production_backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -la supabase/backups/production_backup_*.sql
```

### 2. Link to Production Project (if not already linked)

```bash
# Link to production project
npx supabase link --project-ref your-production-project-ref

# Verify link
npx supabase projects list
```

### 3. Reset Production Database

```bash
# ⚠️ This will DELETE ALL PRODUCTION DATA
# You will be prompted to confirm
npx supabase db reset --linked

# Alternative: Reset with specific confirmation
SUPABASE_EXPERIMENTAL=1 npx supabase db reset --linked --force
```

### 4. Apply Migrations

```bash
# Push all migrations to production
npx supabase db push --linked

# Verify migrations were applied
npx supabase migration list --linked
```

### 5. Seed Production Data (Optional)

Production usually shouldn't be seeded with test data. Only run if you have production-specific seed data:

```bash
# Only if you have production-safe seed data
npx supabase db seed --linked
```

## Production-Safe Seed Data

If you need minimal production data, create a separate seed file:

```sql
-- supabase/seed-production.sql
-- Only essential data for production

-- Example: Default categories, system users, etc.
INSERT INTO categories (name, slug) VALUES 
  ('General', 'general'),
  ('System', 'system')
ON CONFLICT (slug) DO NOTHING;
```

## Verification Commands

```bash
# Check migration status
npx supabase migration list --linked

# View production logs
npx supabase logs --linked

# Check database status
npx supabase status --linked
```

## Emergency Rollback

If something goes wrong:

```bash
# Restore from backup
psql postgres://[user]:[password]@[host]:[port]/postgres < supabase/backups/production_backup_YYYYMMDD_HHMMSS.sql

# Or use Supabase dashboard point-in-time recovery
# Go to: Dashboard > Database > Backups > Point-in-time Recovery
```

## Important Notes

1. **Always backup before reset**: Production data is irreplaceable
2. **Coordinate with team**: Ensure no active users during reset
3. **Test in staging first**: Never test procedures on production
4. **Monitor after reset**: Check logs and metrics after any production changes
5. **Document the reset**: Keep records of when and why production was reset

## Alternative: Soft Reset

For less destructive options:

```bash
# Truncate specific tables instead of full reset
psql $DATABASE_URL -c "TRUNCATE TABLE table_name CASCADE;"

# Run specific migrations
npx supabase migration up 20250708175659 --linked

# Repair/reapply migrations
npx supabase migration repair --linked
```

## Production Connection String

```bash
# Get production database URL
npx supabase status --linked

# Or set manually
export DATABASE_URL="postgres://postgres:[password]@[host]:[port]/postgres"
```

## Safety Checklist

- [ ] Backup created and verified
- [ ] Team notified of maintenance window
- [ ] Staging environment tested with same procedure
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented
- [ ] Post-reset verification plan ready

⚠️ **FINAL WARNING**: Production resets should be extremely rare. Consider all alternatives before proceeding.