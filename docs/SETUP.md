# SVA LMS Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase or self-hosted)
- Git

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and fill in your database credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your database connection string:

```env
DATABASE_URL=postgresql://user:password@host:5432/sva_lms
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=sva_lms
DB_SSL=true  # Set to true for Supabase

JWT_SECRET=your-strong-random-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Generate a strong random string for `JWT_SECRET`. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Generate Database Migrations

Drizzle will analyze your schema files and generate SQL migrations:

```bash
npm run db:generate
```

This creates migration files in `db/migrations/`. Review the generated SQL to ensure it matches your expectations.

### 4. Apply Migrations

Apply the migrations to your database:

```bash
npm run db:migrate
```

Or if using Drizzle Kit push (for development):

```bash
npm run db:push
```

**Note**: `db:push` directly modifies the database schema. Use `db:migrate` for production.

### 5. Seed Test Data

Populate the database with realistic test data:

```bash
npm run db:seed
```

This creates:
- 1 school and campus
- 1 pod (mixed-age G1-G3)
- 5 subjects (Math, Language Arts, Science, Civics, Leadership)
- 1 course (Mathematics Grade 2)
- 1 curriculum version
- 1 unit with lesson and activity
- Test users:
  - Admin: `admin@sva.edu` / `admin123`
  - Teacher: `teacher@sva.edu` / `teacher123`
  - Student: `student@sva.edu` / `student123`
  - Guardian: `guardian@sva.edu` / `guardian123`
  - Inspector: `inspector@sva.edu` / `inspector123`

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

### View Database Schema

Use Drizzle Studio to inspect your database:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` where you can browse tables and data.

### Manual Database Access

Connect to your PostgreSQL database:

```bash
psql $DATABASE_URL
```

Or using Supabase CLI:

```bash
supabase db connect
```

## Project Structure

```
sva-lms/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── student/       # Student views
│   │   ├── teacher/       # Teacher views
│   │   ├── admin/         # Admin views
│   │   └── inspector/     # Inspector views
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── db/
│   ├── schema/            # Drizzle schema definitions
│   │   ├── academic.ts    # Academic structure
│   │   ├── people.ts      # Users, students, teachers
│   │   ├── learning.ts    # Enrollments, progress, mastery
│   │   └── governance.ts  # Curriculum, audit, inspections
│   ├── migrations/        # Generated SQL migrations
│   └── index.ts           # Database connection
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── rbac.ts            # Role-based access control
│   ├── audit.ts           # Audit logging
│   └── curriculum.ts      # Curriculum engine
├── scripts/
│   └── seed.ts            # Database seeding script
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # System architecture
│   ├── RISKS.md           # Risk assessment
│   └── SETUP.md           # This file
└── middleware.ts          # Next.js middleware (RBAC)
```

## Common Tasks

### Create a New Migration

After modifying schema files:

```bash
npm run db:generate
npm run db:migrate
```

### Reset Database (Development Only)

⚠️ **Warning**: This will delete all data!

```bash
# Drop all tables and recreate
npm run db:push -- --force
npm run db:seed
```

### Update Seed Data

Edit `scripts/seed.ts` and run:

```bash
npm run db:seed
```

## Troubleshooting

### Migration Errors

If migrations fail:

1. Check database connection in `.env.local`
2. Verify database user has CREATE/ALTER permissions
3. Review generated SQL in `db/migrations/`
4. Manually fix and re-run if needed

### Authentication Issues

- Verify `JWT_SECRET` is set in `.env.local`
- Clear browser cookies
- Check token expiration (default: 7 days)

### Database Connection Errors

- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- For Supabase: Use connection pooling URL
- Check firewall/network access
- Verify SSL settings (`DB_SSL=true` for Supabase)

### TypeScript Errors

Run type checking:

```bash
npx tsc --noEmit
```

## Production Deployment

### Environment Variables

Set all environment variables in your hosting platform:

- Vercel: Project Settings → Environment Variables
- Supabase: Project Settings → Database → Connection String

### Database Backups

Set up automated backups:

- Supabase: Automatic daily backups
- Self-hosted: Use `pg_dump` with cron

### Security Checklist

- [ ] Strong `JWT_SECRET` (32+ random bytes)
- [ ] HTTPS enabled
- [ ] Database RLS policies configured
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Audit logging verified
- [ ] Retention policies enforced

## Next Steps

1. **Review Schema**: Examine `db/schema/` to understand data model
2. **Test Authentication**: Login with test accounts
3. **Explore Dashboards**: Navigate role-specific views
4. **Read Documentation**: See `docs/ARCHITECTURE.md` and `docs/RISKS.md`
5. **Customize**: Adapt schemas and UI for your specific needs

## Support

For issues or questions:
1. Check `docs/ARCHITECTURE.md` for system design
2. Review `docs/RISKS.md` for known issues
3. Examine schema files for data model details
4. Check Next.js and Drizzle documentation

---

**Last Updated**: Initial setup guide
**Version**: 1.0.0

