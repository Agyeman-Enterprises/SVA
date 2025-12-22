# Schema Migration: Old → New District-Grade Structure

## Overview

The schema has been completely refactored to match the district-grade, scoped-membership architecture specified in the engineering requirements.

## Key Changes

### 1. Organizational Structure
**Old**: `schools → campuses → pods`
**New**: `districts → schools → campuses → pods`

- Added `districts` table
- All schools now belong to a district
- Country code tracking for jurisdiction portability

### 2. User & Role System
**Old**: Separate tables (`students`, `teachers`, `inspectors`, `admins`) with role in `users` table
**New**: Unified `users` table + scoped `userMemberships` table

- Single `users` table for all people
- `userMemberships` allows users to have different roles in different scopes
- Example: User can be a teacher in School A, inspector in School B
- `teacherTier` stored in membership (0-4)

### 3. Curriculum Versioning
**Old**: `curriculumVersions` with content hash
**New**: `courseVersions` with `isImmutable` flag

- Integer version numbers (1, 2, 3...)
- `isImmutable` flag set to `true` when approved
- Status: `draft`, `in_review`, `approved`, `deprecated`
- Immutability enforced at application layer

### 4. Curriculum Structure
**Old**: `courses → units → lessons → activities`
**New**: `courses → courseVersions → units → lessons → lessonAssets → activities`

- Added `lessonAssets` for multimedia (audio/video/pdf/images/links)
- `lessons.canonicalText` stores Tier-4 content
- `assessments` and `assessmentItems` separated
- `podCourseAssignments` links pods to specific course versions

### 5. Learning Records
**Old**: `enrollments`, `progress`, `submissions`, `feedback`, `masteryRecords`
**New**: `enrollments`, `submissions`, `submissionFeedback`, `assessmentAttempts`, `assessmentItemResponses`, `masteryRecords`, `progressEvents`

- `progress` table removed → replaced with event-based `progressEvents`
- `feedback` renamed to `submissionFeedback`
- Added `assessmentItemResponses` for granular assessment tracking
- `masteryRecords` uses `skillKey` (e.g., "K1.MATH.NUMBERS.1-10")

### 6. Governance
**Old**: `curriculumVersions`, `approvalRecords`, `auditLogs`, `inspectionReports`, `retentionPolicies`
**New**: `courseVersions`, `approvalRecords`, `auditLog`, `inspectionReports`, `retentionPolicies`

- `auditLogs` → `auditLog` (singular)
- `auditLog` includes scope (district/school/campus/pod)
- `retentionPolicies` scoped to districts

## Schema Files Structure

```
db/schema/
├── enums.ts          # All pgEnum definitions
├── org.ts            # districts, schools, campuses
├── people.ts         # users, userMemberships
├── academic.ts       # gradeBands, pods, subjects
├── curriculum.ts     # courses, courseVersions, units, lessons, assets, activities, assessments
├── learning.ts       # enrollments, submissions, feedback, attempts, mastery, progressEvents
├── governance.ts    # approvals, inspections, retention, audit
└── index.ts         # Central exports
```

## Circular Reference Resolution

The following foreign keys are defined in a separate migration file (`db/migrations/add_circular_fks.sql`) because they reference tables defined later:

- `userMemberships.podId → pods.id`
- `podCourseAssignments.podId → pods.id`
- `lessonAssignments.podId → pods.id`
- `enrollments.podId → pods.id`
- `progressEvents.podId → pods.id`
- `auditLog.podId → pods.id`
- `assessmentAttempts.assessmentId → assessments.id`
- `assessmentItemResponses.assessmentItemId → assessment_items.id`

**Action Required**: After running `npm run db:generate`, manually apply `db/migrations/add_circular_fks.sql` or integrate it into the migration workflow.

## Code Updates Required

### ✅ Completed
- [x] Schema files restructured
- [x] Enums extracted
- [x] Circular FK migration script created
- [x] `lib/auth.ts` updated for scoped memberships
- [x] `lib/audit.ts` updated for new `auditLog` structure
- [x] `lib/curriculum.ts` updated for `courseVersions`
- [x] `lib/env.ts` added with Zod validation

### ⚠️ Pending
- [ ] Update all app pages to use new schema
- [ ] Update seed script for new structure
- [ ] Update API routes
- [ ] Update middleware for scoped memberships
- [ ] Test authentication flow
- [ ] Test curriculum rendering

## Migration Steps

1. **Backup existing database** (if any)
2. **Generate new migrations**: `npm run db:generate`
3. **Apply migrations**: `npm run db:migrate`
4. **Apply circular FK migration**: Run `db/migrations/add_circular_fks.sql`
5. **Update seed script**: Adapt to new schema
6. **Run seed**: `npm run db:seed`
7. **Test**: Verify all functionality

## Breaking Changes

### Authentication
- `authenticateUser()` now returns scoped membership info
- JWT payload includes `membershipId` and `scope`
- Must check user memberships for authorization

### Curriculum Access
- Pods are assigned specific `courseVersions`, not just courses
- Must check `podCourseAssignments` to see which version a pod uses
- Immutability enforced: approved versions cannot be edited

### Progress Tracking
- `progress` table removed
- Use `progressEvents` for event-based tracking
- Event types: `lesson_viewed`, `asset_played`, `submission_created`, etc.

### Mastery Records
- Now uses `skillKey` format: `"{gradeBand}.{subject}.{domain}.{skill}"`
- Example: `"K1.MATH.NUMBERS.1-10"`
- Evidence stored as JSONB with references to attempts/submissions

## Next Steps

1. Update app pages to use new schema structure
2. Implement scoped membership checks in middleware
3. Update seed script with realistic district-grade data
4. Test end-to-end flows
5. Document API changes

---

**Status**: Schema migration complete, code updates in progress
**Version**: 2.0.0 (district-grade architecture)

