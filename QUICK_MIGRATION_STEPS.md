# Quick Migration Steps (Supabase SQL Editor)

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select project: **dptubonksvipfnywalev**
3. Click **SQL Editor** (left sidebar)
4. Click **New query**

## Step 2: Apply Main Migration

1. Open file: `db/migrations/0000_concerned_gideon.sql`
2. **Select All** (Ctrl+A) and **Copy** (Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Wait ~30 seconds for completion
6. Should see: "Success. No rows returned"

## Step 3: Apply Circular FK Migration

1. Open file: `db/migrations/add_circular_fks.sql`
2. **Select All** (Ctrl+A) and **Copy** (Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Should see: "Success. No rows returned"

## Step 4: Verify Tables Created

Run this query in SQL Editor:

```sql
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

**Expected result:** `54` tables

## Step 5: Tell Me When Done

Once migrations are complete, say **"migrations done"** and I'll:
1. Run `npm run db:seed` (create test data)
2. Run `npm run validate` (verify everything works)

---

**Note:** The DNS issue is a Windows/Node.js network configuration problem. Manual SQL migration bypasses this entirely and is actually faster for initial setup.

