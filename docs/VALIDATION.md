# SVA LMS Validation Guide

## Critical Validation Steps

This document outlines the mandatory validation steps that must pass before the system is considered production-ready.

## Step 1: Generate Migrations

```bash
npm run db:generate
```

This creates SQL migration files in `db/migrations/`. Review the generated SQL to ensure:
- All tables are created
- Foreign keys are properly defined
- Indexes are created
- Constraints are correct

## Step 2: Apply Migrations

**Option A: Using Drizzle Kit (Development)**
```bash
npm run db:push
```

**Option B: Using Migration Files (Production)**
```bash
npm run db:migrate
```

**Option C: Manual Application**
1. Connect to your PostgreSQL database
2. Run the SQL files in `db/migrations/` in order
3. Run `db/migrations/add_circular_fks.sql` after initial migrations

## Step 3: Seed Database

```bash
npm run db:seed
```

This creates:
- 1 district, 1 school, 1 campus
- 3 pods (language-coded: en, pt-PT, sv)
- Grade bands K1-G12
- Core subjects
- Test users (admin, inspector, teachers, students)
- Sample course with version, units, lessons

## Step 4: Run Validation Script

```bash
npm run validate
```

This tests:
1. ✅ Students exist
2. ✅ Pods exist
3. ✅ Course versions exist
4. ✅ Pod → course version assignment resolves
5. ✅ **MASTER QUERY**: "Which lessons does Student X see today, and why?"

## Master Query Test

The master query must answer:

**"Which lessons does Student X see today, and why?"**

The query must return:
- Lesson ID, title, number
- Unit title and number
- Course title and version
- Subject and grade band
- Pod name and language
- **Why**: Complete explanation of access path

### Expected Output Format

```json
{
  "lessonId": "uuid",
  "lessonTitle": "Introduction to Numbers",
  "unitTitle": "Unit 1: Counting",
  "courseTitle": "Mathematics Grade 2",
  "courseVersion": 1,
  "courseVersionStatus": "approved",
  "subjectName": "Mathematics",
  "gradeBandCode": "G2",
  "podName": "Pod Alpha",
  "podLanguage": "en",
  "why": "Student is in pod Pod Alpha (en), which is assigned course version 1 (approved) of Mathematics Grade 2 (Mathematics, G2)"
}
```

## Acceptance Criteria

All of these must pass:

### 1. Students Exist
- At least one student user exists
- Student has a pod membership
- Student can be queried

### 2. Pods Exist
- At least one pod exists
- Pod has school/campus assignment
- Pod has language code

### 3. Course Versions Exist
- At least one course version exists
- Version has status (draft/approved)
- Version is linked to a course

### 4. Pod → Course Version Assignment Resolves
- At least one pod is assigned a course version
- Assignment can be queried with joins
- Assignment includes metadata (assigned date, etc.)

### 5. Master Query Works
- Query returns lessons for a student
- Query includes complete "why" explanation
- Query handles edge cases (no pod, no assignments, etc.)

## Troubleshooting

### "No students found"
- Run seed script: `npm run db:seed`
- Check database connection
- Verify `users` and `user_memberships` tables exist

### "No pods found"
- Check seed script created pods
- Verify `pods` table exists
- Check foreign keys to `schools` and `campuses`

### "No course versions found"
- Verify seed script creates course versions
- Check `course_versions` table exists
- Verify foreign keys to `courses`

### "Pod → course version assignment fails"
- Check `pod_course_assignments` table
- Verify foreign keys are correct
- Ensure seed script creates assignments

### "Master query returns no results"
- Verify student is in a pod
- Verify pod has course assignments
- Check that course version has units and lessons
- Verify all foreign key relationships

## Next Steps After Validation

Once all validation tests pass:

1. ✅ **RBAC Enforcement** - Test inspector read-only
2. ✅ **Curriculum Pipeline** - Test version selection
3. ✅ **Student Submission Loop** - Test assign → submit → feedback
4. ✅ **Inspector View** - Test read-only access
5. ✅ **Audit Logging** - Verify all actions are logged

## Production Readiness Checklist

- [ ] Migrations generated and reviewed
- [ ] Migrations applied to production database
- [ ] Seed data validated
- [ ] Master query test passes
- [ ] All acceptance criteria met
- [ ] RBAC tested and enforced
- [ ] Inspector read-only verified
- [ ] Audit logging working
- [ ] Performance tested with realistic data

---

**Status**: Validation script ready
**Last Updated**: 2024-12-23

