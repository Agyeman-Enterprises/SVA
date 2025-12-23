# Supabase Setup Checklist

## ✅ Step-by-Step Guide

### 1. Create Supabase Project (5 minutes)

1. Go to **https://supabase.com**
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `SVA LMS`
   - **Database Password**: ⚠️ **SAVE THIS** (you'll need it)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning

**✅ Checkpoint**: Project appears in dashboard

---

### 2. Get Connection String (2 minutes)

1. In Supabase dashboard, click **Settings** (gear icon) → **Database**
2. Scroll to **Connection string** section
3. Find **URI** tab (not "Pooler")
4. Copy the connection string

**Format looks like:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**OR** the direct connection:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**✅ Checkpoint**: Connection string copied

---

### 3. Create `.env.local` (2 minutes)

1. Copy `.env.local.template` to `.env.local` (if it doesn't exist)
2. Edit `.env.local` and replace:
   - `[YOUR-PASSWORD]` → Your Supabase database password
   - `[PROJECT-REF]` → Your project reference (from connection string)

**Example:**
```env
DATABASE_URL=postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
DB_HOST=db.abcdefghijklmnop.supabase.co
DB_PASSWORD=mypassword123
```

**JWT_SECRET** (already generated):
```
bf107f3a6a30af6dbca977bc461e93238ada539b5d7f8eb8e9b1d70191f5539c
```

**✅ Checkpoint**: `.env.local` configured

---

### 4. Test Connection (1 minute)

```bash
npm run db:push
```

**Expected**: Should connect and show table creation progress

**If error**: Check connection string, password, and SSL settings

**✅ Checkpoint**: Connection successful

---

### 5. Apply Migrations (5 minutes)

**Option A: Using Drizzle Push (Recommended)**
```bash
npm run db:push
```

**Option B: Manual SQL**
1. Go to Supabase Dashboard → **SQL Editor**
2. Copy contents of `db/migrations/0000_concerned_gideon.sql`
3. Paste and click **Run**
4. Then run `db/migrations/add_circular_fks.sql`

**✅ Checkpoint**: All 54 tables created

---

### 6. Apply Circular FK Migration (2 minutes)

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy contents of `db/migrations/add_circular_fks.sql`
3. Paste and click **Run**

**✅ Checkpoint**: Foreign keys added

---

### 7. Seed Database (2 minutes)

```bash
npm run db:seed
```

**Expected output:**
```
🌱 Seeding SVA LMS database...
✅ Created district: Scientia Vitae Academy District
✅ Created school: SVA Main School
✅ Created campus: Lisbon Campus
✅ Created 15 grade bands
✅ Created 3 pods
✅ Created 5 subjects
...
✅ Seeding complete!
```

**✅ Checkpoint**: Seed data created

---

### 8. Validate (1 minute)

```bash
npm run validate
```

**Expected output:**
```
🔍 SVA LMS VALIDATION - Testing Critical Requirements
============================================================

📋 TEST 1: Students exist
✅ Found 6 student(s)

📋 TEST 2: Pods exist
✅ Found 3 pod(s)

📋 TEST 3: Course versions exist
✅ Found 1 course version(s)

📋 TEST 4: Pod → course version assignment resolves
✅ Found 1 pod-course assignment(s)

📋 TEST 5: MASTER QUERY
✅ Student student1@sva.edu sees X lesson(s)

🎉 ALL VALIDATION TESTS PASSED!
```

**✅ Checkpoint**: All tests pass

---

## 🎉 Success!

Once validation passes, you're ready for:
- ✅ RBAC testing
- ✅ Curriculum pipeline testing
- ✅ Student submission testing
- ✅ Inspector view testing

---

## 🆘 Troubleshooting

### "Database not initialized"
- Check `.env.local` exists and has correct values
- Verify password is correct
- Try direct connection string (not pooler)

### "Connection refused"
- Wait 2-3 minutes after creating project
- Verify project is active in dashboard
- Check `DB_SSL=true` is set

### "Migration fails"
- Check project is fully provisioned
- Verify user has permissions
- Review error in Supabase SQL Editor logs

### "Seed fails"
- Ensure migrations are applied first
- Check foreign key constraints
- Review Supabase logs

---

**Ready?** Start with Step 1!

