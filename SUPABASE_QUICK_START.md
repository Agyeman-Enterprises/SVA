# Supabase Quick Start

## 🚀 Fast Setup (5 minutes)

### 1. Create Supabase Project

1. Go to https://supabase.com → Sign up/Login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `SVA LMS`
   - **Database Password**: ⚠️ **SAVE THIS PASSWORD**
   - **Region**: Choose closest
4. Wait 2-3 minutes for provisioning

### 2. Get Connection String

1. In Supabase dashboard: **Project Settings** → **Database**
2. Scroll to **Connection string** → **URI**
3. Copy the string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
   ```

### 3. Create `.env.local`

Create `.env.local` in project root:

```env
# Supabase Connection (replace [YOUR-PASSWORD] and [PROJECT-REF])
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
DB_HOST=[PROJECT-REF].supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_NAME=postgres
DB_SSL=true

# JWT Secret (use the generated one below)
JWT_SECRET=bf107f3a6a30af6dbca977bc461e93238ada539b5d7f8eb8e9b1d70191f5539c

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Generated JWT_SECRET** (already generated for you):
```
bf107f3a6a30af6dbca977bc461e93238ada539b5d7f8eb8e9b1d70191f5539c
```

### 4. Apply Migrations

```bash
npm run db:push
```

This creates all 54 tables in Supabase.

**Then apply circular FK migration:**
- Go to Supabase Dashboard → **SQL Editor**
- Copy contents of `db/migrations/add_circular_fks.sql`
- Paste and click **Run**

### 5. Seed Database

```bash
npm run db:seed
```

Creates test data (students, pods, courses, etc.)

### 6. Validate

```bash
npm run validate
```

Should see:
```
✅ Students exist: Found 6 student(s)
✅ Pods exist: Found 3 pod(s)
✅ Course versions exist: Found 1 course version(s)
✅ Pod → course version assignment resolves: Found 1 pod-course assignment(s)
✅ Master Query: Student student1@sva.edu sees X lesson(s)

🎉 ALL VALIDATION TESTS PASSED!
```

## ✅ Success!

Once validation passes, you're ready for:
- RBAC testing
- Curriculum pipeline
- Student submissions
- Inspector view

---

**Need help?** See `SUPABASE_SETUP.md` for detailed troubleshooting.

