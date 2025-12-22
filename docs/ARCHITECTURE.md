# SVA LMS Architecture Documentation

## System Overview

The SVA Learning Management System is a production-grade, district-scale LMS built with modern web technologies. It is designed for sovereign ownership, pedagogical rigor, and long-term inspectability.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: Next.js App Router with role-based route groups

### Backend
- **Database**: PostgreSQL (Supabase-hosted or self-hosted)
- **ORM**: Drizzle ORM (SQL-first, explicit schemas)
- **API**: Next.js API Routes (REST)
- **Authentication**: JWT-based with HTTP-only cookies

### Infrastructure
- **Frontend Hosting**: Vercel
- **Database**: Supabase PostgreSQL or equivalent
- **File Storage**: Supabase Storage (for student submissions)

## Architecture Principles

### 1. SQL-First Design
- All schemas defined explicitly in Drizzle
- No ORM magic or hidden queries
- Full SQL migration control
- Inspectable database structure

### 2. Role-Based Access Control (RBAC)
- Enforced at multiple layers:
  - Middleware (request-level)
  - API routes (endpoint-level)
  - Database RLS (data-level) - *Pending implementation*
- Permission matrix defined in `lib/rbac.ts`
- Inspector role: read-only, fully audited

### 3. Curriculum Versioning
- Immutable curriculum once approved
- Content hash verification for integrity
- Version history and traceability
- Supersession chain for updates

### 4. Pedagogical Model
- **Tier-4 Authoring**: All content authored at highest abstraction
- **Tier-0 Delivery**: Scaffolding applied at delivery time
- **Concept-Based Mastery**: Singapore-style mastery tracking
- **No GPA**: Focus on concept mastery, not grades

### 5. Data Safety & Privacy
- No surveillance dashboards
- Event-based logging only
- Sensitive student text access-gated
- Full audit trail for all access
- Retention policies enforced

## Database Schema Structure

### Academic Structure (`db/schema/academic.ts`)
```
Schools → Campuses → Pods
Subjects → Courses → Units → Lessons → Activities
Assessments (linked to Lessons/Units/Courses)
```

### People (`db/schema/people.ts`)
```
Users (base authentication)
├── Students
├── Teachers (with tier: tier0-tier4)
├── Guardians
├── Inspectors (read-only)
└── Admins (school/district)
```

### Learning Records (`db/schema/learning.ts`)
```
Enrollments (Student × Course)
Progress (Student × Lesson)
MasteryRecords (Student × Concept × Course)
Submissions (Student work)
Feedback (Teacher feedback)
AssessmentAttempts
```

### Governance (`db/schema/governance.ts`)
```
CurriculumVersions (immutable once approved)
ApprovalRecords (workflow tracking)
AuditLogs (all access logged)
InspectionReports
RetentionPolicies
```

## Authentication & Authorization

### Authentication Flow
1. User submits email/password to `/api/auth/login`
2. Server verifies credentials against database
3. JWT token generated with user ID, email, role
4. Token stored in HTTP-only cookie
5. Middleware validates token on protected routes

### Authorization Flow
1. Middleware extracts user role from JWT
2. Permission matrix checked (`lib/rbac.ts`)
3. Resource-level permissions verified
4. Inspector role: all mutations blocked
5. Audit log entry created

## Curriculum Engine

### Versioning
- Curriculum versions are immutable once approved
- Content hash ensures integrity
- Version history maintained for traceability
- Supersession chain for curriculum updates

### Content Delivery
1. Course assigned curriculum version
2. Lessons contain Tier-4 content (JSONB)
3. Activities contain scaffolding for all tiers
4. Delivery engine selects appropriate scaffolding based on teacher tier
5. Content never modified, only delivery method changes

### Scaffolding
- Stored in `activities.content.scaffolding`
- Keys: `tier0`, `tier1`, `tier2`, `tier3`, `tier4`
- Applied at render time, not stored in student records
- Teacher tier determines which scaffolding to use

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Protected Routes (Role-Based)
- Student: `/student/*` - Course access, lesson viewing, submissions
- Teacher: `/teacher/*` - Pod management, grading, mastery updates
- Admin: `/admin/*` - School management, user creation, curriculum approval
- Inspector: `/inspector/*` - Read-only audit views

## Data Flow

### Student Learning Flow
1. Student enrolls in course → `enrollments` record created
2. Student accesses lesson → `progress` record created/updated
3. Student completes activity → `submissions` record created
4. Teacher grades submission → `feedback` record created
5. Mastery assessed → `mastery_records` updated
6. All actions logged → `audit_logs` entry created

### Curriculum Approval Flow
1. Curriculum version created with status "draft"
2. Admin reviews and approves → status "approved"
3. Content hash computed and stored
4. Version locked (immutable)
5. Course assigned to version
6. All changes logged in `approval_records`

## Security Considerations

### Current Implementation
- ✅ JWT-based authentication
- ✅ HTTP-only cookies
- ✅ RBAC middleware
- ✅ Permission matrix
- ✅ Audit logging
- ✅ Inspector read-only enforcement

### Pending Implementation
- ⚠️ Database Row-Level Security (RLS)
- ⚠️ Sensitive data encryption at rest
- ⚠️ Content hash verification on reads
- ⚠️ Rate limiting
- ⚠️ CSRF protection

## Scalability Considerations

### Database
- Indexes defined on foreign keys and frequently queried fields
- Partitioning strategy for `audit_logs` (by date)
- Read replicas for reporting (future)

### Application
- Connection pooling (Postgres client)
- Query optimization (Drizzle)
- Caching layer (future: Redis)

### File Storage
- Object storage for student submissions
- CDN for media resources
- Automatic cleanup of old drafts

## Deployment

### Development
```bash
npm install
npm run db:generate  # Generate migrations
npm run db:migrate    # Apply migrations
npm run db:seed      # Seed test data
npm run dev          # Start dev server
```

### Production
1. Set environment variables
2. Run migrations
3. Deploy to Vercel (frontend)
4. Configure Supabase (database)
5. Set up monitoring and backups

## Monitoring & Observability

### Audit Logs
- All access logged to `audit_logs` table
- Includes: user, action, resource, IP, timestamp
- Queryable for compliance reports

### Error Handling
- Structured error responses
- Error logging (to be integrated with external service)
- User-friendly error messages

## Future Enhancements

1. **Real-time Features**: WebSocket support for live discussions
2. **Mobile App**: React Native or PWA
3. **AI Integration**: Adaptive learning paths (with privacy considerations)
4. **Third-Party Integrations**: Gradebook exports, parent portals
5. **Advanced Analytics**: Anonymized learning analytics for inspectors

## Compliance

### Data Protection
- GDPR compliance (EU)
- COPPA compliance (US, for K-12)
- Jurisdiction-specific requirements (Portugal, Sweden, Ghana)

### Retention Policies
- Raw student text: 60 days
- Derived metrics: 3 years
- Audit logs: 7 years (compliance requirement)

---

**Last Updated**: Initial architecture documentation
**Version**: 1.0.0

