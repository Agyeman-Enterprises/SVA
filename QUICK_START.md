# SVA LMS - Quick Start Validation

## 🚀 Fast Track to Validation

### Prerequisites
- PostgreSQL database (local or Supabase)
- Node.js 18+

### Steps

1. **Create `.env.local`** (see `MIGRATION_VALIDATION_GUIDE.md` for details)
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   JWT_SECRET=your-32-character-secret-minimum
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Apply Migrations**
   ```bash
   npm run db:push
   # Then manually run: db/migrations/add_circular_fks.sql
   ```

3. **Seed Database**
   ```bash
   npm run db:seed
   ```

4. **Validate**
   ```bash
   npm run validate
   ```

## ✅ Success Criteria

All 5 tests must pass:
- ✅ Students exist
- ✅ Pods exist  
- ✅ Course versions exist
- ✅ Pod → course version assignment resolves
- ✅ **Master Query works**

## 📊 Master Query Test

The validation script tests this critical query:

**"Which lessons does Student X see today, and why?"**

If this query fails, the schema is broken. Fix it before proceeding.

## 🎯 Next Steps After Validation

Once validation passes:
1. Test RBAC (inspector read-only)
2. Test curriculum pipeline
3. Test student submission loop
4. Test inspector view

---

**Status**: Ready for database setup
**Migrations**: Generated ✅
**Validation Script**: Ready ✅

