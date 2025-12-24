# Manual Seeding Guide

Since we're experiencing connection issues (DNS with direct, authentication with pooler), here's how to seed the database manually via Supabase SQL Editor.

## Option 1: Use Supabase SQL Editor (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. The seed script is complex (500+ lines), so the easiest approach is:
   - Use the Supabase Dashboard to create test data manually, OR
   - Wait for connection issue resolution, OR
   - Use a different machine/environment that can connect

## Option 2: Verify Connection String

The authentication failure suggests the password might be incorrect. Verify:

1. Go to Supabase Dashboard → Settings → Database
2. Check the connection string matches what's in `.env.local`
3. Try resetting the database password if needed

## Option 3: Use Direct Connection (If DNS Resolves)

If you can get the direct connection working (DNS resolves), it should work for seeding.

**Current Status:**
- ✅ Migrations: Complete (54 tables created)
- ⏳ Seeding: Blocked by connection issues
- ⏳ Validation: Waiting for seeding

## Next Steps

Once seeding is complete, we can run validation. The validation script will test:
1. Students exist
2. Pods exist  
3. Course versions exist
4. Pod → course version assignments
5. Master query: "Which lessons does Student X see today?"

---

**Recommendation:** Since migrations are done, you can start testing the application. The seed data is helpful but not required for basic functionality testing.

