# Verify Connection String

## Current Issue

Authentication is failing with error: "password authentication failed for user 'postgres'"

But we're using username: `postgres.dptubonksvipfnywalev`

This suggests the connection string format might be incorrect.

## Steps to Verify

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select project: `dptubonksvipfnywalev`

2. **Get Connection String**
   - Settings → Database
   - Scroll to "Connection string"
   - **Copy the EXACT string** from the **URI** tab (not Pooler)

3. **Check Format**
   - Pooler format should be: `postgresql://postgres.dptubonksvipfnywalev:C0z1Kn0w{Sh!t]@intR#Al!
@aws-1-us-west-1.pooler.supabase.com:5432/postgres`
   - Direct format should be: `postgresql://postgres:C0z1Kn0w{Sh!t]@intR#Al!
@db.dptubonksvipfnywalev.supabase.co:5432/postgres`

4. **Update .env.local**
   - Replace the entire `DATABASE_URL` line with the exact string from Supabase
   - Make sure there are no extra spaces or characters

5. **Verify Password**
   - The password in the connection string should match your Supabase database password
   - If you're unsure, you can reset it: Settings → Database → Reset database password

## Alternative: Use Direct Connection String

If the pooler isn't working, try the direct connection string:
- Get it from: Settings → Database → Connection string → URI tab
- It should look like: `postgresql://postgres:[PASSWORD]@db.dptubonksvipfnywalev.supabase.co:5432/postgres`
- Update `.env.local` with this exact string

**Note:** Direct connection might have DNS issues on Windows, but authentication should work if DNS resolves.

## After Updating

Run: `npm run db:seed`

If it still fails, the password might need to be verified or reset in Supabase Dashboard.

