# SVA Learning Management System

**Scientia Vitae Academy - District-grade, internationally portable LMS**

Production educational infrastructure built with Next.js, TypeScript, Drizzle ORM, and PostgreSQL.

## Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: PostgreSQL (Supabase-hosted or self-hosted)
- **ORM**: Drizzle ORM (SQL-first, explicit schemas)
- **Auth**: JWT-based with RBAC
- **Hosting**: Vercel (frontend), Supabase (database)

## Domain Models

### Academic Structure
- Schools → Campuses → Pods
- Subjects → Courses → Units → Lessons → Activities
- Assessments (formative, summative, diagnostic, mastery checks)

### People
- Students, Teachers, Guardians, Inspectors, Admins
- Role-based access control (RBAC)

### Learning Records
- Enrollments, Progress, Mastery Records (Singapore-style concept-based)
- Submissions, Feedback, Assessment Attempts

### Governance
- Curriculum Versions (immutable once approved)
- Approval Records, Audit Logs
- Inspection Reports, Retention Policies

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.local.example .env.local
# Edit .env.local with your database credentials
```

3. **Generate migrations**:
```bash
npm run db:generate
```

4. **Apply migrations**:
```bash
npm run db:migrate
```

5. **Seed database** (optional):
```bash
npm run db:seed
```

6. **Run development server**:
```bash
npm run dev
```

## Database Schema

All schemas are defined in `db/schema/`:
- `academic.ts` - Academic structure (schools, courses, lessons, etc.)
- `people.ts` - Users, students, teachers, inspectors, admins
- `learning.ts` - Enrollments, progress, mastery, submissions
- `governance.ts` - Curriculum versions, approvals, audit logs, inspections

## RBAC Roles

- **Student**: View courses, submit work, view own mastery
- **Teacher**: Assign lessons, grade submissions, update mastery
- **Pod Lead**: Manage pod students and teachers
- **School Admin**: Full school management
- **District Admin**: Cross-school management
- **Inspector**: Read-only, fully audited access

## Pedagogical Model

- **Tier-4 Authoring**: All curriculum authored at highest abstraction level
- **Tier-0 Delivery**: Scaffolding applied at delivery time, not in content
- **Immutable Curriculum**: Once approved, curriculum versions cannot be modified
- **Concept-Based Mastery**: Singapore-style mastery tracking, not GPA

## Data Safety

- No surveillance dashboards
- Event-based logging only
- Sensitive student text access-gated and audited
- Human escalation, not automated punishment
- Retention policies enforced (raw text 60 days, derived metrics 3 years)

## Development Status

✅ **Completed**:
- Project initialization
- Complete Drizzle schema definitions
- RBAC permission matrix
- Audit logging infrastructure

🚧 **In Progress**:
- SQL migrations generation
- Seed data scripts
- Core UI dashboards

📋 **Planned**:
- Curriculum engine
- Inspector read-only guarantees
- Risk documentation

## License

Proprietary - Scientia Vitae Academy

