# Manual Migration Guide (DNS Workaround)

If `npm run db:push` fails with DNS errors, apply migrations manually via Supabase SQL Editor.

## Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

## Step 2: Apply Main Migration

1. Open `db/migrations/0000_concerned_gideon.sql` in your editor
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Wait for completion (should create 54 tables)

## Step 3: Apply Circular FK Migration

1. Open `db/migrations/add_circular_fks.sql` in your editor
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Verify no errors

## Step 4: Verify Tables Created

In Supabase SQL Editor, run:
```sql
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

Should return **54** tables.

## Step 5: Continue with Seeding

Once migrations are applied, run:
```bash
npm run db:seed
```

Then validate:
```bash
npm run validate
```

---

**Note:** The DNS issue is likely a Windows/Node.js network configuration problem. The manual SQL approach bypasses this entirely.

