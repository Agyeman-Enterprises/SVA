# 🚀 Supabase Migration - Quick Start

## What You Need

1. **Supabase Account** (free at https://supabase.com)
2. **5 minutes**

## Steps

### 1️⃣ Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `SVA LMS`
   - **Database Password**: ⚠️ **SAVE THIS** (you'll need it)
   - **Region**: Choose closest
5. Wait 2-3 minutes for provisioning

### 2️⃣ Get Connection String

1. In Supabase dashboard: **Project Settings** (gear icon) → **Database**
2. Scroll to **Connection string** section
3. Find **URI** (not Pooler)
4. Copy the string - looks like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
   
   **OR** the direct connection:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 3️⃣ Update `.env.local`

1. Copy `.env.local.template` to `.env.local` (if not exists)
2. Edit `.env.local` and replace:
   - `[YOUR-PASSWORD]` → Your Supabase database password
   - `[PROJECT-REF]` → Your project reference (from connection string)

**Example:**
```env
DATABASE_URL=postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
DB_HOST=db.abcdefghijklmnop.supabase.co
DB_PASSWORD=mypassword123
```

### 4️⃣ Apply Migrations

```bash
npm run db:push
```

This creates all 54 tables in Supabase.

**Then apply circular FKs:**
1. Go to Supabase Dashboard → **SQL Editor**
2. Copy contents of `db/migrations/add_circular_fks.sql`
3. Paste and click **Run**

### 5️⃣ Seed Database

```bash
npm run db:seed
```

Creates test users, pods, courses, etc.

### 6️⃣ Validate

```bash
npm run validate
```

**Expected output:**
```
✅ Students exist: Found 6 student(s)
✅ Pods exist: Found 3 pod(s)
✅ Course versions exist: Found 1 course version(s)
✅ Pod → course version assignment resolves: Found 1 pod-course assignment(s)
✅ Master Query: Student student1@sva.edu sees X lesson(s)

🎉 ALL VALIDATION TESTS PASSED!
```

## ✅ Success!

Once validation passes, you're ready to proceed with:
- RBAC enforcement testing
- Curriculum pipeline testing
- Student submission loop
- Inspector view

## 🆘 Troubleshooting

### "Database not initialized"
- Check `.env.local` exists and has correct values
- Verify password is correct (no special character encoding issues)
- Try using direct connection string (not pooler)

### "Connection refused"
- Wait 2-3 minutes after creating project
- Verify project is active in Supabase dashboard
- Check `DB_SSL=true` is set

### "Migration fails"
- Check Supabase project is fully provisioned
- Verify user has permissions (should by default)
- Review error in Supabase SQL Editor logs

### "Seed fails"
- Ensure migrations are applied first
- Check foreign key constraints
- Review Supabase logs for detailed errors

---

**Ready?** Follow steps 1-6 above!

