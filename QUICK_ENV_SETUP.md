# Quick .env.local Setup (2 minutes)

## Step 1: Get Supabase Connection String

1. Go to: https://supabase.com/dashboard
2. Click your project (or create one)
3. Go to: **Settings** → **Database**
4. Scroll to **Connection string**
5. Click the **URI** tab
6. Copy the connection string

It looks like:
```
postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## Step 2: Update .env.local

Open `.env.local` in your editor and replace:

1. **Find**: `[YOUR-PASSWORD]`
   **Replace with**: The password from your connection string (between `postgres:` and `@`)

2. **Find**: `[PROJECT-REF]`
   **Replace with**: The project reference from your connection string (between `db.` and `.supabase.co`)

### Example:

**Connection string:**
```
postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**In .env.local, change:**
```env
DB_PASSWORD=[YOUR-PASSWORD]
DB_HOST=db.[PROJECT-REF].supabase.co
```

**To:**
```env
DB_PASSWORD=mypassword123
DB_HOST=db.abcdefghijklmnop.supabase.co
```

Also update `DATABASE_URL`:
```env
DATABASE_URL=postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## Step 3: Verify

Run:
```bash
npm run check-env
```

Or tell me "ready" and I'll verify and proceed with migrations.

