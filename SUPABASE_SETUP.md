# Supabase Migration Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Name**: SVA LMS (or your choice)
   - **Database Password**: Save this! You'll need it.
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine for development

5. Wait 2-3 minutes for project to provision

## Step 2: Get Connection String

1. In Supabase dashboard, go to **Project Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** connection string (not the Pooler)
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`
4. Replace `[YOUR-PASSWORD]` with your actual database password

## Step 3: Create `.env.local`

Create `.env.local` in project root:

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
DB_HOST=[PROJECT-REF].supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_NAME=postgres
DB_SSL=true

# JWT Secret (generate a strong random string)
JWT_SECRET=your-32-character-secret-minimum-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Apply Migrations

### Option A: Using Drizzle Push (Recommended for first setup)

```bash
npm run db:push
```

This will create all tables directly in Supabase.

### Option B: Using Migration Files

1. Get Supabase connection details
2. Run migration SQL manually:
   - Go to Supabase Dashboard → **SQL Editor**
   - Copy contents of `db/migrations/0000_concerned_gideon.sql`
   - Paste and run
   - Then run `db/migrations/add_circular_fks.sql`

## Step 5: Seed Database

```bash
npm run db:seed
```

This creates test data in your Supabase database.

## Step 6: Validate

```bash
npm run validate
```

All 5 tests should pass.

## Troubleshooting

### Connection Errors

- Verify password is correct (no special characters need encoding)
- Check project is fully provisioned (wait 2-3 minutes)
- Verify `DB_SSL=true` is set
- Try using connection pooler URL if direct connection fails

### Migration Errors

- Check Supabase project is active
- Verify database user has CREATE/ALTER permissions (should by default)
- Review error message for specific table/constraint issues
- Check Supabase logs in dashboard

### Seed Errors

- Ensure migrations are applied first
- Check foreign key constraints
- Verify all required tables exist
- Check Supabase logs for detailed errors

## Next Steps

Once validation passes:
1. Test RBAC enforcement
2. Test curriculum pipeline
3. Test student submission loop
4. Test inspector view

---

**Ready to proceed?** Follow steps 1-6 above.

