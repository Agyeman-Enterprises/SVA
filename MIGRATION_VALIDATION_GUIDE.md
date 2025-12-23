# Migration + Seed Validation Guide

## ✅ STEP 1: Migrations Generated

**Status**: ✅ COMPLETE

Migrations have been generated:
- `db/migrations/0000_concerned_gideon.sql` - Main schema migration (54 tables)
- `db/migrations/add_circular_fks.sql` - Circular FK resolution

## 📋 STEP 2: Database Setup Required

Before proceeding, you need a PostgreSQL database. Options:

### Option A: Local PostgreSQL

1. Install PostgreSQL (if not installed)
2. Create database:
   ```sql
   CREATE DATABASE sva_lms;
   ```
3. Create `.env.local` file:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/sva_lms
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=sva_lms
   DB_SSL=false
   JWT_SECRET=your-32-character-secret-here-minimum
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Option B: Supabase (Recommended for Testing)

1. Create account at https://supabase.com
2. Create new project
3. Get connection string from Project Settings → Database
4. Create `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres
   DB_HOST=[YOUR-PROJECT].supabase.co
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=[YOUR-PASSWORD]
   DB_NAME=postgres
   DB_SSL=true
   JWT_SECRET=your-32-character-secret-here-minimum
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 🔧 STEP 3: Apply Migrations

Once database is configured:

```bash
# Option A: Push schema directly (development)
npm run db:push

# Option B: Apply migration files (production)
npm run db:migrate
```

**Then apply circular FK migration:**
```bash
# Connect to your database and run:
psql -d sva_lms -f db/migrations/add_circular_fks.sql
```

Or manually execute the SQL in `db/migrations/add_circular_fks.sql`.

## 🌱 STEP 4: Seed Database

```bash
npm run db:seed
```

This creates:
- 1 district, 1 school, 1 campus
- 3 pods (Alpha: en, Beta: pt-PT, Gamma: sv)
- Grade bands K1-G12
- Core subjects (MATH, ELA, SCI, CIVICS, HIST)
- Test users:
  - `district.admin@sva.edu` / `password123`
  - `school.admin@sva.edu` / `password123`
  - `inspector@sva.edu` / `password123`
  - `teacher.tier0@sva.edu` / `password123`
  - `teacher.tier4@sva.edu` / `password123`
  - `student1@sva.edu` through `student6@sva.edu` / `password123`
- Sample course with version, units, lessons

## ✅ STEP 5: Run Validation

```bash
npm run validate
```

This tests:
1. ✅ Students exist
2. ✅ Pods exist
3. ✅ Course versions exist
4. ✅ Pod → course version assignment resolves
5. ✅ **MASTER QUERY**: "Which lessons does Student X see today, and why?"

## 🎯 Expected Validation Output

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
✅ Student student1@sva.edu sees 5 lesson(s)

📚 Sample lesson access:
   Lesson: Introduction to Numbers
   Why: Student is in pod Pod Alpha (en), which is assigned course version 1 (approved) of Mathematics Grade 2 (Mathematics, G2)

============================================================
📊 VALIDATION SUMMARY
============================================================
✅ Students exist: ✅ Found 6 student(s)
✅ Pods exist: ✅ Found 3 pod(s)
✅ Course versions exist: ✅ Found 1 course version(s)
✅ Pod → course version assignment resolves: ✅ Found 1 pod-course assignment(s)
✅ Master Query: ✅ Student student1@sva.edu sees 5 lesson(s)

============================================================
Results: 5/5 tests passed
🎉 ALL VALIDATION TESTS PASSED!
```

## 🚨 Troubleshooting

### "Database not initialized"
- Create `.env.local` with `DATABASE_URL`
- Verify database exists and is accessible
- Check connection credentials

### "Migration fails"
- Check PostgreSQL version (12+ required)
- Verify user has CREATE/ALTER permissions
- Review error message for specific table/constraint issues

### "Seed fails"
- Ensure migrations are applied first
- Check for foreign key constraint violations
- Verify all required tables exist

### "Validation fails - no students"
- Run seed script: `npm run db:seed`
- Check `users` and `user_memberships` tables
- Verify seed script completed without errors

## 📝 Next Steps After Validation Passes

Once all 5 tests pass:

1. ✅ **RBAC Enforcement** - Test inspector read-only
2. ✅ **Curriculum Pipeline** - Test version selection
3. ✅ **Student Submission Loop** - Test assign → submit → feedback
4. ✅ **Inspector View** - Test read-only access
5. ✅ **Audit Logging** - Verify all actions are logged

---

**Current Status**: Migrations generated, awaiting database setup
**Next Action**: Configure database connection and apply migrations

