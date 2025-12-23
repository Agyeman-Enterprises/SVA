# SVA LMS - Project State

## Last Updated
2024-12-23

## Reference Files
- **SVA_DESIGN_SYSTEM.md** — Brand colors, typography, component patterns, page specs, Drizzle schema
- **Your existing .cursorrules** — CANON rules (takes precedence)

> **IMPORTANT**: SVA_DESIGN_SYSTEM.md supplements your existing .cursorrules. Reference both when prompting Cursor.

## Completed ✅

### Design System
- [x] Brand colors extracted from logo (Green #4a7c4e, Gold #f5a623, Cream #fdfbf7)
- [x] Typography defined (Crimson Pro + Nunito)
- [x] CSS variables established
- [x] Component patterns documented

### Pages/Components
- [x] **Dashboard** (`src/components/Dashboard.jsx` + `Dashboard.css`)
  - Sidebar navigation
  - User greeting header
  - Stats cards (streak, points, courses, assignments)
  - Course cards with progress
  - Announcements widget
  - Upcoming assignments widget
  - Quick actions grid
  - Responsive design

### Documentation
- [x] `SVA_DESIGN_SYSTEM.md` - Comprehensive design system & Cursor instructions
- [x] Drizzle schema design (including teacher training tables)
- [x] API endpoint specifications
- [x] File structure plan
- [x] Teacher training dashboard specs

---

## To Do 📋

### High Priority - Core Pages

#### 1. Course Catalog Page
```
File: src/components/catalog/CourseCatalog.jsx
Features:
- [ ] Search bar with debounce
- [ ] Category filter chips
- [ ] Grade level filter
- [ ] Sort dropdown (Newest, Popular, A-Z)
- [ ] Course grid (3 columns desktop)
- [ ] Catalog card component (no progress, show enroll button)
- [ ] Pagination component
- [ ] Empty state for no results
```

#### 2. Course View Page
```
File: src/components/course/CourseView.jsx
Features:
- [ ] Course header banner
- [ ] Tab navigation (Overview, Curriculum, Resources, Discussion)
- [ ] Overview tab with description, objectives, instructor bio
- [ ] Curriculum tab with module accordion
- [ ] Enroll/Continue button
- [ ] Progress indicator for enrolled users
```

#### 3. Lesson View Page
```
File: src/components/course/LessonView.jsx
Features:
- [ ] Video player component (for video lessons)
- [ ] Rich text renderer (for reading lessons)
- [ ] Quiz component (for quiz lessons)
- [ ] Lesson sidebar with navigation
- [ ] Mark complete button
- [ ] Previous/Next navigation
- [ ] Progress sync with backend
```

#### 4. Login Page
```
File: src/components/auth/LoginPage.jsx
Features:
- [ ] Centered auth card layout
- [ ] Email/password form
- [ ] Form validation
- [ ] Error handling
- [ ] "Forgot password" link
- [ ] "Create account" link
- [ ] Optional: Google OAuth button
```

#### 5. Registration Page
```
File: src/components/auth/RegisterPage.jsx
Features:
- [ ] Multi-field form (name, email, password, confirm)
- [ ] Role selector (Student/Parent/Teacher)
- [ ] Grade level (if student)
- [ ] Terms checkbox
- [ ] Form validation
- [ ] Success redirect to login
```

#### 6. Admin Dashboard
```
File: src/components/admin/AdminDashboard.jsx
Features:
- [ ] Admin sidebar component
- [ ] Overview stats (students, courses, completion rate)
- [ ] Recent activity feed
- [ ] Quick action cards
- [ ] Pending items alerts
```

### Medium Priority - Admin Tools

#### 7. Course Manager
```
File: src/components/admin/CourseManager.jsx
Features:
- [ ] Data table with courses
- [ ] Search/filter
- [ ] Edit/Delete actions
- [ ] Create new course button
- [ ] Course editor modal/page
```

#### 8. Student Manager
```
File: src/components/admin/StudentManager.jsx
Features:
- [ ] Student data table
- [ ] Search by name/email
- [ ] Filter by grade/family unit
- [ ] View student detail modal
- [ ] Assign to family unit
```

#### 9. Grading Interface
```
File: src/components/admin/GradingInterface.jsx
Features:
- [ ] Pending submissions list
- [ ] Submission viewer
- [ ] Grade input + feedback
- [ ] Rubric display
- [ ] Approve/Return actions
```

### Medium Priority - Teacher Training

#### 10. Teacher Training Dashboard (Teacher View)
```
File: src/components/training/TeacherTrainingDashboard.jsx
Features:
- [ ] Large progress banner with circular progress
- [ ] Training module grid
- [ ] Module cards with lock/complete states
- [ ] Certifications section with status
- [ ] Continue/Start/Review buttons per module
```

#### 11. Training Lesson View
```
File: src/components/training/TrainingLessonView.jsx
Features:
- [ ] Reuse LessonView patterns
- [ ] Video player for training videos
- [ ] Quiz component for assessments
- [ ] Higher passing threshold (80%)
- [ ] Module completion tracking
```

#### 12. Training Admin Dashboard
```
File: src/components/training/admin/TrainingAdmin.jsx
Features:
- [ ] Training completion stats
- [ ] Overview of all teachers' progress
- [ ] Quick certification actions
```

#### 13. Training Module Manager (Admin)
```
File: src/components/training/admin/TrainingModuleManager.jsx
Features:
- [ ] CRUD for training modules
- [ ] Drag-drop reordering
- [ ] Add/edit lessons within modules
- [ ] Quiz builder for module assessments
- [ ] Publish/unpublish modules
```

#### 14. Teacher Progress Table (Admin)
```
File: src/components/training/admin/TeacherProgressTable.jsx
Features:
- [ ] Data table of all teachers
- [ ] Training start date, progress %, modules completed
- [ ] Certification status column
- [ ] Certify button for completed teachers
- [ ] View detail modal
```

#### 15. Certification Manager (Admin)
```
File: src/components/training/admin/CertificationManager.jsx
Features:
- [ ] List of certification types
- [ ] Required modules per certification
- [ ] Issue/revoke certifications
- [ ] Certificate PDF generation
- [ ] Expiration management
```

### Low Priority - Enhancements

- [ ] Quiz Builder (admin)
- [ ] Discussion forums
- [ ] Notifications system
- [ ] User settings page
- [ ] Family Unit management
- [ ] Reports/Analytics dashboard
- [ ] Certificate generation
- [ ] Calendar integration

---

## Backend Tasks

### Database
- [ ] Set up PostgreSQL database
- [ ] Configure Drizzle ORM
- [ ] Run initial migrations
- [ ] Seed sample data

### API Routes
```
Auth:
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me

Courses:
- [ ] GET /api/courses (list with filters)
- [ ] GET /api/courses/:id (single course)
- [ ] POST /api/courses (create - admin)
- [ ] PUT /api/courses/:id (update - admin)
- [ ] DELETE /api/courses/:id (delete - admin)

Enrollments:
- [ ] POST /api/enrollments
- [ ] DELETE /api/enrollments/:id
- [ ] GET /api/enrollments/my-courses

Progress:
- [ ] GET /api/progress/:courseId
- [ ] POST /api/progress/complete-lesson
- [ ] GET /api/progress/dashboard-stats

Submissions:
- [ ] POST /api/submissions
- [ ] GET /api/submissions/:assignmentId
- [ ] PUT /api/submissions/:id/grade (admin)

Admin:
- [ ] GET /api/admin/stats
- [ ] GET /api/admin/students
- [ ] GET /api/admin/pending-submissions

Teacher Training:
- [ ] GET /api/training/modules
- [ ] GET /api/training/modules/:id
- [ ] GET /api/training/progress
- [ ] POST /api/training/progress/complete
- [ ] GET /api/training/certifications
- [ ] POST /api/admin/training/modules
- [ ] PUT /api/admin/training/modules/:id
- [ ] DELETE /api/admin/training/modules/:id
- [ ] GET /api/admin/training/stats
- [ ] GET /api/admin/training/teachers
- [ ] POST /api/admin/certifications/issue
- [ ] DELETE /api/admin/certifications/:id
```

---

## Notes for Next Session

1. Start with **Login/Register pages** - they're needed for everything else
2. Then **Course Catalog** - most straightforward after dashboard
3. Then **Course View + Lesson View** - core learning experience
4. Then **Teacher Training Dashboard** - reuses lesson patterns
5. Admin features can wait until student and teacher flows are complete

## Cursor Prompt Order (Recommended)

```
1. "Set up the Drizzle schema from SVA_DESIGN_SYSTEM.md and generate migrations"

2. "Create LoginPage.jsx and RegisterPage.jsx following SVA_DESIGN_SYSTEM.md with the auth layout"

3. "Build CourseCatalog.jsx with CatalogFilters and CatalogCard following SVA_DESIGN_SYSTEM.md"

4. "Create CourseView.jsx with CourseTabs and ModuleAccordion following SVA_DESIGN_SYSTEM.md"

5. "Build LessonView.jsx with VideoPlayer and QuizComponent following SVA_DESIGN_SYSTEM.md"

6. "Create TeacherTrainingDashboard.jsx with progress banner, module grid, and certifications following SVA_DESIGN_SYSTEM.md"

7. "Build TrainingAdmin.jsx with TrainingModuleManager and TeacherProgressTable following SVA_DESIGN_SYSTEM.md"

8. "Create AdminDashboard.jsx with AdminSidebar and data tables following SVA_DESIGN_SYSTEM.md"
```

## Questions to Resolve

- Video hosting solution? (YouTube embeds, Vimeo, self-hosted?)
- Rich text editor for course content? (TipTap, Slate, Quill?)
- File upload for assignments? (S3, Cloudflare R2?)
- Real-time features needed? (WebSockets for discussions?)

---

## Environment Setup Needed

```env
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/sva_lms
JWT_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
