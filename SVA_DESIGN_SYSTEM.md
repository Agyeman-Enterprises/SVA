# SVA Learning Management System - Design System & Development Guide

> **IMPORTANT**: This file supplements your existing `.cursorrules`. Reference this for SVA-specific design patterns and feature requirements. Your CANON rules in `.cursorrules` take precedence.

---

## PROJECT CONTEXT

**Scientia Vitae Academy (SVA)** is a K-12 online educational institution using mixed-age "Family Units" for collaborative learning. The LMS serves:
- **Students** (K-12) — Learning, assignments, progress tracking
- **Teachers** — Course creation, grading, student management
- **Administrators** — Platform oversight, reports, user management
- **Parents** — Monitor child progress, communication

---

## BRAND DESIGN SYSTEM

### Color Palette (EXACT VALUES - DO NOT APPROXIMATE)

```css
:root {
  /* Primary - Forest Green (from logo) */
  --sva-green: #4a7c4e;
  --sva-green-dark: #3a6340;
  --sva-green-light: #5d9461;
  --sva-green-subtle: #e8f0e8;
  
  /* Accent - Warm Gold (from logo) */
  --sva-gold: #f5a623;
  --sva-gold-dark: #d4900a;
  --sva-gold-light: #ffc859;
  --sva-gold-subtle: #fef8eb;
  
  /* Neutrals */
  --sva-cream: #fdfbf7;
  --sva-cream-dark: #f5f2ed;
  --sva-white: #ffffff;
  --sva-gray-100: #f7f7f7;
  --sva-gray-200: #e8e8e8;
  --sva-gray-300: #d1d1d1;
  --sva-gray-400: #9a9a9a;
  --sva-gray-500: #6b6b6b;
  --sva-gray-600: #4a4a4a;
  --sva-gray-700: #2d2d2d;
  --sva-gray-800: #1a1a1a;
  
  /* Semantic */
  --sva-success: #22c55e;
  --sva-warning: #f59e0b;
  --sva-error: #ef4444;
  --sva-info: #3b82f6;
}
```

### Typography

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Nunito:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Crimson Pro', Georgia, serif;  /* Headings, titles */
  --font-body: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;  /* Body text */
}
```

**Usage rules:**
- All `h1`, `h2`, `h3` use `--font-display`
- All body text, buttons, labels use `--font-body`
- Never use Inter, Roboto, Arial, or system fonts

### Spacing Scale

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
}
```

### Border Radius

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

### Shadows (green-tinted)

```css
:root {
  --shadow-sm: 0 1px 3px rgba(74, 124, 78, 0.08);
  --shadow-md: 0 4px 12px rgba(74, 124, 78, 0.1);
  --shadow-lg: 0 8px 30px rgba(74, 124, 78, 0.12);
  --shadow-hover: 0 12px 40px rgba(74, 124, 78, 0.15);
}
```

### Transitions

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

---

## COMPONENT PATTERNS

### Buttons

```css
/* Primary Button */
.sva-btn-primary {
  background: var(--sva-green);
  color: var(--sva-white);
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.sva-btn-primary:hover {
  background: var(--sva-green-dark);
  transform: translateY(-1px);
}
.sva-btn-primary:active {
  transform: translateY(1px);
}

/* Secondary Button (outlined) */
.sva-btn-secondary {
  background: transparent;
  color: var(--sva-green);
  border: 2px solid var(--sva-green);
  padding: calc(var(--space-sm) - 2px) calc(var(--space-md) - 2px);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.sva-btn-secondary:hover {
  background: var(--sva-green-subtle);
}

/* Gold Accent Button */
.sva-btn-accent {
  background: var(--sva-gold);
  color: var(--sva-white);
  /* Same structure as primary */
}
.sva-btn-accent:hover {
  background: var(--sva-gold-dark);
}

/* Full Width */
.sva-btn-full { width: 100%; }

/* Large */
.sva-btn-lg {
  padding: var(--space-md) var(--space-lg);
  font-size: 1rem;
}
```

### Form Inputs

```css
.sva-form-group {
  margin-bottom: var(--space-lg);
}

.sva-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--sva-gray-600);
  margin-bottom: var(--space-xs);
}

.sva-input {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--sva-gray-200);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--sva-gray-700);
  background: var(--sva-white);
  transition: all var(--transition-fast);
}
.sva-input:focus {
  outline: none;
  border-color: var(--sva-green);
  box-shadow: 0 0 0 3px var(--sva-green-subtle);
}
.sva-input::placeholder {
  color: var(--sva-gray-400);
}
.sva-input.error {
  border-color: var(--sva-error);
}

.sva-error-text {
  color: var(--sva-error);
  font-size: 0.8rem;
  margin-top: var(--space-xs);
}

/* Select */
.sva-select {
  /* Same as .sva-input plus: */
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* chevron icon */
  background-repeat: no-repeat;
  background-position: right var(--space-md) center;
  padding-right: var(--space-2xl);
}

/* Checkbox/Radio */
.sva-checkbox-group {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.sva-checkbox {
  width: 20px;
  height: 20px;
  accent-color: var(--sva-green);
}
```

### Cards

```css
.sva-card {
  background: var(--sva-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--sva-gray-200);
  overflow: hidden;
  transition: all var(--transition-base);
}
.sva-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--sva-green-subtle);
}

.sva-card-image {
  height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.sva-card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4));
}

.sva-card-badge {
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
  background: var(--sva-white);
  color: var(--sva-green);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  z-index: 1;
}

.sva-card-content {
  padding: var(--space-lg);
}

.sva-card-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--sva-gray-800);
  margin-bottom: var(--space-xs);
  line-height: 1.3;
}

.sva-card-subtitle {
  font-size: 0.85rem;
  color: var(--sva-gray-500);
  margin-bottom: var(--space-md);
}
```

### Progress Bar

```css
.sva-progress-bar {
  height: 6px;
  background: var(--sva-gray-200);
  border-radius: 3px;
  overflow: hidden;
}
.sva-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sva-green), var(--sva-green-light));
  border-radius: 3px;
  transition: width var(--transition-slow);
}
.sva-progress-text {
  font-size: 0.75rem;
  color: var(--sva-gray-500);
  margin-top: var(--space-xs);
}

/* Larger variant for course pages */
.sva-progress-bar-lg {
  height: 10px;
  border-radius: 5px;
}
```

### Data Tables (Admin)

```css
.sva-data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--sva-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--sva-gray-200);
}

.sva-data-table thead {
  background: var(--sva-cream);
}

.sva-data-table th {
  text-align: left;
  padding: var(--space-md) var(--space-lg);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--sva-gray-600);
  border-bottom: 1px solid var(--sva-gray-200);
}

.sva-data-table td {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--sva-gray-100);
  font-size: 0.9rem;
  color: var(--sva-gray-700);
}

.sva-data-table tr:hover {
  background: var(--sva-cream);
}

.sva-data-table tr:last-child td {
  border-bottom: none;
}
```

### Status Badges

```css
.sva-status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.sva-status-badge.active {
  background: var(--sva-green-subtle);
  color: var(--sva-green);
}
.sva-status-badge.pending {
  background: var(--sva-gold-subtle);
  color: var(--sva-gold-dark);
}
.sva-status-badge.completed {
  background: #dcfce7;
  color: #16a34a;
}
.sva-status-badge.draft {
  background: var(--sva-gray-100);
  color: var(--sva-gray-500);
}
.sva-status-badge.overdue {
  background: #fef2f2;
  color: var(--sva-error);
}
```

---

## PAGE SPECIFICATIONS

### 1. COURSE CATALOG PAGE

**Route**: `/courses` or `/catalog`

**Layout**: Sidebar (same as Dashboard) + main content area

**Components needed**:
- `CatalogHeader` — Page title, search bar, view toggle (grid/list)
- `CatalogFilters` — Category chips, grade level dropdown, sort dropdown
- `CatalogGrid` — CSS Grid container for cards
- `CatalogCard` — Different from dashboard card (no progress, shows enroll button)
- `Pagination` — Page numbers or load more button

**CatalogCard structure**:
```jsx
<article className="sva-catalog-card">
  <div className="sva-catalog-image" style={{ backgroundImage: `url(${thumbnailUrl})` }}>
    <span className="sva-card-badge">{category}</span>
    {gradeLevel && <span className="sva-grade-badge">{gradeLevel}</span>}
  </div>
  <div className="sva-catalog-content">
    <h3 className="sva-card-title">{title}</h3>
    <p className="sva-instructor">
      <img src={instructor.avatar} alt="" className="sva-instructor-avatar" />
      {instructor.name}
    </p>
    <p className="sva-description">{shortDescription}</p>
    <div className="sva-catalog-meta">
      <span><BookIcon /> {lessonCount} lessons</span>
      <span><ClockIcon /> {duration}</span>
      <span><UsersIcon /> {enrolledCount} enrolled</span>
    </div>
    <div className="sva-catalog-actions">
      {isEnrolled ? (
        <button className="sva-btn-primary">Continue Learning</button>
      ) : (
        <button className="sva-btn-primary">Enroll Now</button>
      )}
      <button className="sva-btn-secondary">Preview</button>
    </div>
  </div>
</article>
```

**Filter state shape**:
```typescript
interface CatalogFilters {
  search: string;
  category: string | null;  // 'Science', 'Math', 'Language Arts', etc.
  gradeLevel: string | null;  // 'K-2', '3-5', '6-8', '9-12'
  sortBy: 'newest' | 'popular' | 'alphabetical';
  page: number;
  perPage: number;
}
```

**API**: `GET /api/courses?search=&category=&grade=&sort=&page=&perPage=`

---

### 2. INDIVIDUAL COURSE VIEW

**Route**: `/courses/:courseId` or `/courses/:slug`

**Layout**: Full-width header banner + tabbed content + lesson sidebar

**Components needed**:
- `CourseHeader` — Banner image, title, instructor, enroll button, progress (if enrolled)
- `CourseTabs` — Overview, Curriculum, Resources, Discussion
- `CourseOverview` — Description, objectives, prerequisites, instructor bio
- `CourseCurriculum` — Module accordion with lesson list
- `CourseResources` — Downloadable files, links
- `CourseDiscussion` — Forum-style discussion (future)
- `LessonSidebar` — Collapsible lesson navigation (shows on lesson pages)

**CourseHeader structure**:
```jsx
<header className="sva-course-header">
  <div className="sva-course-banner" style={{ backgroundImage: `url(${bannerUrl})` }}>
    <div className="sva-course-banner-overlay">
      <span className="sva-card-badge">{category}</span>
      <h1 className="sva-course-title">{title}</h1>
      <div className="sva-course-meta">
        <span><BookIcon /> {lessonCount} lessons</span>
        <span><ClockIcon /> {totalDuration}</span>
        <span><StarIcon /> {rating} ({reviewCount} reviews)</span>
      </div>
      <div className="sva-course-instructor-preview">
        <img src={instructor.avatar} alt={instructor.name} />
        <span>Taught by {instructor.name}</span>
      </div>
    </div>
  </div>
  <div className="sva-course-actions">
    {isEnrolled ? (
      <>
        <div className="sva-enrolled-progress">
          <span>{progressPercent}% Complete</span>
          <ProgressBar value={progressPercent} />
        </div>
        <button className="sva-btn-primary sva-btn-lg">Continue Learning</button>
      </>
    ) : (
      <button className="sva-btn-primary sva-btn-lg">Enroll in Course</button>
    )}
  </div>
</header>
```

**Module Accordion structure**:
```jsx
<div className="sva-module-accordion">
  {modules.map(module => (
    <div key={module.id} className="sva-module">
      <button 
        className="sva-module-header"
        onClick={() => toggleModule(module.id)}
      >
        <div className="sva-module-info">
          <ChevronIcon className={isOpen ? 'rotated' : ''} />
          <h3>{module.title}</h3>
          <span className="sva-module-meta">
            {module.lessons.length} lessons • {module.duration}
          </span>
        </div>
        <div className="sva-module-progress">
          <span>{module.completedLessons}/{module.lessons.length}</span>
        </div>
      </button>
      {isOpen && (
        <ul className="sva-lesson-list">
          {module.lessons.map(lesson => (
            <li key={lesson.id} className="sva-lesson-item">
              <LessonTypeIcon type={lesson.type} />
              <span className="sva-lesson-title">{lesson.title}</span>
              <span className="sva-lesson-duration">{lesson.duration}</span>
              {lesson.isCompleted && <CheckIcon className="completed" />}
              {lesson.isLocked && <LockIcon />}
            </li>
          ))}
        </ul>
      )}
    </div>
  ))}
</div>
```

---

### 3. LESSON VIEW

**Route**: `/courses/:courseId/lessons/:lessonId`

**Layout**: Main content area (70%) + Lesson sidebar (30%)

**Components needed**:
- `LessonContent` — Renders based on lesson type
- `VideoPlayer` — For video lessons (use react-player or similar)
- `ReadingContent` — Rich text renderer
- `QuizComponent` — Interactive quiz
- `AssignmentSubmit` — File upload + text submission
- `LessonNav` — Previous/Next buttons, Mark Complete
- `LessonSidebar` — Course progress, module/lesson navigation

**Lesson types**:
```typescript
type LessonType = 'video' | 'reading' | 'quiz' | 'assignment' | 'discussion';
```

**LessonContent structure**:
```jsx
<main className="sva-lesson-main">
  <div className="sva-lesson-header">
    <span className="sva-lesson-breadcrumb">
      {course.title} / {module.title}
    </span>
    <h1 className="sva-lesson-title">{lesson.title}</h1>
    <div className="sva-lesson-meta">
      <LessonTypeIcon type={lesson.type} />
      <span>{lesson.type}</span>
      <span>•</span>
      <span>{lesson.duration}</span>
    </div>
  </div>

  <div className="sva-lesson-content">
    {lesson.type === 'video' && (
      <VideoPlayer 
        url={lesson.videoUrl}
        onProgress={handleProgress}
        onComplete={handleComplete}
      />
    )}
    
    {lesson.type === 'reading' && (
      <div className="sva-reading-content">
        {/* Render rich text/markdown */}
        <RichTextRenderer content={lesson.content} />
      </div>
    )}
    
    {lesson.type === 'quiz' && (
      <QuizComponent 
        quiz={lesson.quiz}
        onSubmit={handleQuizSubmit}
      />
    )}
    
    {lesson.type === 'assignment' && (
      <AssignmentSubmit 
        assignment={lesson.assignment}
        onSubmit={handleAssignmentSubmit}
      />
    )}
  </div>

  <div className="sva-lesson-nav">
    <button 
      className="sva-btn-secondary"
      onClick={goToPrevious}
      disabled={!previousLesson}
    >
      ← Previous Lesson
    </button>
    
    {!lesson.isCompleted && (
      <button 
        className="sva-btn-accent"
        onClick={markComplete}
      >
        Mark as Complete
      </button>
    )}
    
    <button 
      className="sva-btn-primary"
      onClick={goToNext}
      disabled={!nextLesson}
    >
      Next Lesson →
    </button>
  </div>
</main>
```

**QuizComponent structure**:
```jsx
<div className="sva-quiz">
  <div className="sva-quiz-header">
    <h2>{quiz.title}</h2>
    <div className="sva-quiz-progress">
      Question {currentIndex + 1} of {quiz.questions.length}
    </div>
    {quiz.timeLimit && <Timer initialTime={quiz.timeLimit * 60} />}
  </div>

  <div className="sva-quiz-question">
    <p className="sva-question-text">{currentQuestion.questionText}</p>
    
    {currentQuestion.type === 'multiple_choice' && (
      <div className="sva-options">
        {currentQuestion.options.map((option, idx) => (
          <label key={idx} className="sva-option">
            <input 
              type="radio" 
              name={`q-${currentQuestion.id}`}
              value={option}
              checked={answers[currentQuestion.id] === option}
              onChange={() => selectAnswer(currentQuestion.id, option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    )}
    
    {currentQuestion.type === 'true_false' && (
      <div className="sva-options sva-true-false">
        <label className="sva-option">
          <input type="radio" name={`q-${currentQuestion.id}`} value="true" />
          <span>True</span>
        </label>
        <label className="sva-option">
          <input type="radio" name={`q-${currentQuestion.id}`} value="false" />
          <span>False</span>
        </label>
      </div>
    )}
    
    {currentQuestion.type === 'short_answer' && (
      <textarea 
        className="sva-input"
        placeholder="Type your answer..."
        value={answers[currentQuestion.id] || ''}
        onChange={(e) => selectAnswer(currentQuestion.id, e.target.value)}
      />
    )}
  </div>

  <div className="sva-quiz-nav">
    <button onClick={goToPrevQuestion} disabled={currentIndex === 0}>
      Previous
    </button>
    {currentIndex < quiz.questions.length - 1 ? (
      <button onClick={goToNextQuestion}>Next</button>
    ) : (
      <button className="sva-btn-primary" onClick={submitQuiz}>
        Submit Quiz
      </button>
    )}
  </div>
</div>
```

---

### 4. LOGIN & REGISTRATION PAGES

**Routes**: `/login`, `/register`, `/forgot-password`

**Layout**: Centered card on gradient background (NO sidebar)

**Auth page background**:
```css
.sva-auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--sva-green-subtle) 0%, var(--sva-cream) 50%, var(--sva-gold-subtle) 100%);
  padding: var(--space-xl);
}

.sva-auth-container {
  background: var(--sva-white);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-lg);
}
```

**Login form fields**:
- Email (required)
- Password (required)
- "Remember me" checkbox
- "Forgot password?" link
- Submit button
- Divider with "or continue with"
- Google OAuth button (optional)
- "Don't have an account? Sign up" link

**Registration form fields**:
- First Name (required)
- Last Name (required)
- Email (required)
- Password (required, min 8 chars, show requirements)
- Confirm Password (required, must match)
- Role selector: Student / Parent / Teacher (radio or dropdown)
- Grade Level (required if Student, dropdown K-12)
- Terms acceptance checkbox (required)
- Submit button
- "Already have an account? Sign in" link

**Form validation**:
- Real-time validation on blur
- Show error messages below fields
- Disable submit until valid
- Show loading state on submit

---

### 5. ADMIN DASHBOARD

**Route**: `/admin` or `/admin/dashboard`

**Layout**: Admin sidebar (different from student sidebar) + main content

**Admin Sidebar Navigation**:
```jsx
const adminNavItems = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/admin' },
  { icon: BookIcon, label: 'Courses', path: '/admin/courses' },
  { icon: UsersIcon, label: 'Students', path: '/admin/students' },
  { icon: GroupIcon, label: 'Family Units', path: '/admin/family-units' },
  { icon: ClipboardIcon, label: 'Assignments', path: '/admin/assignments' },
  { icon: GraduationIcon, label: 'Teacher Training', path: '/admin/training' },
  { icon: ChartIcon, label: 'Reports', path: '/admin/reports' },
  { icon: SettingsIcon, label: 'Settings', path: '/admin/settings' },
];
```

**Admin Overview Stats**:
```jsx
<section className="sva-admin-stats">
  <StatCard 
    title="Total Students" 
    value={stats.studentCount} 
    icon={UsersIcon}
    trend={stats.studentTrend}
    trendLabel="vs last month"
  />
  <StatCard 
    title="Active Courses" 
    value={stats.courseCount} 
    icon={BookIcon}
  />
  <StatCard 
    title="Pending Submissions" 
    value={stats.pendingSubmissions} 
    icon={ClipboardIcon}
    alert={stats.pendingSubmissions > 10}
  />
  <StatCard 
    title="Avg Completion Rate" 
    value={`${stats.avgCompletion}%`} 
    icon={ChartIcon}
    trend={stats.completionTrend}
  />
  <StatCard 
    title="Active Teachers" 
    value={stats.teacherCount} 
    icon={GraduationIcon}
  />
  <StatCard 
    title="Training Completion" 
    value={`${stats.trainingCompletion}%`} 
    icon={AwardIcon}
  />
</section>
```

**Admin Dashboard widgets**:
- Recent enrollments list
- Pending submissions requiring grading
- Upcoming assignment due dates
- Recent announcements
- Quick actions (Add Course, Add Student, Create Announcement)

---

### 6. TEACHER TRAINING DASHBOARD

**Route**: `/admin/training` (admin view) and `/teacher/training` (teacher view)

**Purpose**: Onboard and certify teachers through required training modules

#### Admin View — Training Management

**Components**:
- `TrainingOverview` — Stats on teacher completion rates
- `TrainingModuleList` — CRUD for training modules
- `TeacherProgressTable` — See all teachers and their progress
- `CertificationManager` — Issue/revoke certifications

**Training Admin Stats**:
```jsx
<section className="sva-training-stats">
  <StatCard title="Teachers in Training" value={12} />
  <StatCard title="Fully Certified" value={45} />
  <StatCard title="Avg Completion Time" value="2.3 weeks" />
  <StatCard title="Modules" value={8} />
</section>
```

**Training Module Manager**:
```jsx
<div className="sva-training-modules">
  <div className="sva-section-header">
    <h2>Training Modules</h2>
    <button className="sva-btn-primary" onClick={openCreateModal}>
      + Add Module
    </button>
  </div>
  
  <div className="sva-module-list">
    {trainingModules.map((module, index) => (
      <div key={module.id} className="sva-training-module-card">
        <div className="sva-module-order">
          <button onClick={() => moveUp(index)} disabled={index === 0}>↑</button>
          <span>{index + 1}</span>
          <button onClick={() => moveDown(index)} disabled={index === last}>↓</button>
        </div>
        <div className="sva-module-info">
          <h3>{module.title}</h3>
          <p>{module.description}</p>
          <div className="sva-module-meta">
            <span>{module.lessonCount} lessons</span>
            <span>{module.duration}</span>
            <span>{module.completionCount} completed</span>
          </div>
        </div>
        <div className="sva-module-actions">
          <button onClick={() => editModule(module.id)}>Edit</button>
          <button onClick={() => viewAnalytics(module.id)}>Analytics</button>
          <button className="danger" onClick={() => deleteModule(module.id)}>Delete</button>
        </div>
      </div>
    ))}
  </div>
</div>
```

**Teacher Progress Table**:
```jsx
<table className="sva-data-table">
  <thead>
    <tr>
      <th>Teacher</th>
      <th>Started</th>
      <th>Progress</th>
      <th>Modules Completed</th>
      <th>Certification</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {teachers.map(teacher => (
      <tr key={teacher.id}>
        <td>
          <div className="sva-user-cell">
            <img src={teacher.avatar} alt="" />
            <div>
              <span className="name">{teacher.name}</span>
              <span className="email">{teacher.email}</span>
            </div>
          </div>
        </td>
        <td>{formatDate(teacher.trainingStarted)}</td>
        <td>
          <div className="sva-mini-progress">
            <ProgressBar value={teacher.progressPercent} />
            <span>{teacher.progressPercent}%</span>
          </div>
        </td>
        <td>{teacher.completedModules} / {totalModules}</td>
        <td>
          <StatusBadge status={teacher.certificationStatus} />
        </td>
        <td>
          <button onClick={() => viewDetails(teacher.id)}>View</button>
          {teacher.progressPercent === 100 && !teacher.isCertified && (
            <button className="sva-btn-accent" onClick={() => certify(teacher.id)}>
              Certify
            </button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

#### Teacher View — Training Portal

**Route**: `/teacher/training`

**Components**:
- `TrainingProgress` — Overall progress banner
- `TrainingModuleList` — List of modules with status
- `TrainingLesson` — Individual lesson view (reuse LessonView component)
- `CertificationBadge` — Display earned certifications

**Teacher Training Dashboard**:
```jsx
<div className="sva-teacher-training">
  {/* Progress Banner */}
  <div className="sva-training-banner">
    <div className="sva-training-banner-content">
      <h1>Teacher Training Program</h1>
      <p>Complete all modules to become a certified SVA instructor</p>
      <div className="sva-training-progress-large">
        <div className="sva-progress-circle">
          <svg viewBox="0 0 100 100">
            <circle className="bg" cx="50" cy="50" r="45" />
            <circle 
              className="progress" 
              cx="50" cy="50" r="45"
              strokeDasharray={`${progressPercent * 2.83} 283`}
            />
          </svg>
          <span className="percent">{progressPercent}%</span>
        </div>
        <div className="sva-progress-details">
          <span>{completedModules} of {totalModules} modules completed</span>
          <span>{completedLessons} lessons • {totalHours} hours</span>
        </div>
      </div>
    </div>
    {isCertified && (
      <div className="sva-certification-badge">
        <AwardIcon />
        <span>Certified Instructor</span>
        <span className="date">Since {certificationDate}</span>
      </div>
    )}
  </div>

  {/* Module List */}
  <section className="sva-training-modules">
    <h2>Training Modules</h2>
    <div className="sva-training-module-grid">
      {modules.map((module, index) => (
        <article 
          key={module.id} 
          className={`sva-training-module-card ${module.isLocked ? 'locked' : ''} ${module.isCompleted ? 'completed' : ''}`}
        >
          <div className="sva-module-number">{index + 1}</div>
          <div className="sva-module-content">
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <div className="sva-module-meta">
              <span>{module.lessonCount} lessons</span>
              <span>{module.duration}</span>
            </div>
            {module.isCompleted ? (
              <div className="sva-module-complete">
                <CheckCircleIcon />
                <span>Completed</span>
              </div>
            ) : module.isLocked ? (
              <div className="sva-module-locked">
                <LockIcon />
                <span>Complete previous module to unlock</span>
              </div>
            ) : (
              <div className="sva-module-progress">
                <ProgressBar value={module.progressPercent} />
                <span>{module.progressPercent}% complete</span>
              </div>
            )}
          </div>
          <button 
            className="sva-btn-primary"
            disabled={module.isLocked}
            onClick={() => startModule(module.id)}
          >
            {module.isCompleted ? 'Review' : module.progressPercent > 0 ? 'Continue' : 'Start'}
          </button>
        </article>
      ))}
    </div>
  </section>

  {/* Required Certifications */}
  <section className="sva-certifications">
    <h2>Certifications</h2>
    <div className="sva-cert-grid">
      <CertificationCard 
        title="Core Teaching Methodology"
        status={certs.coreTeaching}
        requiredModules={['Module 1', 'Module 2', 'Module 3']}
      />
      <CertificationCard 
        title="Mixed-Age Instruction"
        status={certs.mixedAge}
        requiredModules={['Module 4', 'Module 5']}
      />
      <CertificationCard 
        title="SVA Technology Platform"
        status={certs.technology}
        requiredModules={['Module 6', 'Module 7']}
      />
      <CertificationCard 
        title="Assessment & Evaluation"
        status={certs.assessment}
        requiredModules={['Module 8']}
      />
    </div>
  </section>
</div>
```

**Training Module Topics** (suggested content):
1. **SVA Philosophy & Mission** — Understanding mixed-age education
2. **Family Unit Dynamics** — Managing multi-grade classrooms
3. **Mentorship Models** — Older students mentoring younger
4. **Curriculum Design** — Creating adaptive lesson plans
5. **Technology Training** — Using the LMS effectively
6. **Assessment Strategies** — Evaluating diverse learners
7. **Parent Communication** — Engaging families
8. **Compliance & Safety** — Child protection, FERPA, etc.

---

## DRIZZLE ORM SCHEMA

```typescript
// src/db/schema.ts

import { pgTable, text, timestamp, integer, boolean, uuid, pgEnum, jsonb } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin', 'parent']);
export const lessonTypeEnum = pgEnum('lesson_type', ['video', 'reading', 'quiz', 'assignment', 'discussion']);
export const submissionStatusEnum = pgEnum('submission_status', ['pending', 'submitted', 'graded', 'returned']);
export const certificationStatusEnum = pgEnum('certification_status', ['not_started', 'in_progress', 'completed', 'certified']);

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: userRoleEnum('role').notNull().default('student'),
  avatarUrl: text('avatar_url'),
  gradeLevel: text('grade_level'),
  familyUnitId: uuid('family_unit_id').references(() => familyUnits.id),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Family Units
export const familyUnits = pgTable('family_units', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  leadTeacherId: uuid('lead_teacher_id').references(() => users.id),
  maxCapacity: integer('max_capacity').default(20),
  createdAt: timestamp('created_at').defaultNow(),
});

// Courses
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  shortDescription: text('short_description'),
  thumbnailUrl: text('thumbnail_url'),
  bannerUrl: text('banner_url'),
  category: text('category').notNull(),
  gradeLevel: text('grade_level'),
  instructorId: uuid('instructor_id').references(() => users.id),
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Modules
export const modules = pgTable('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Lessons
export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id').references(() => modules.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  type: lessonTypeEnum('type').notNull(),
  content: text('content'),
  videoUrl: text('video_url'),
  duration: integer('duration'),
  orderIndex: integer('order_index').notNull(),
  isPreviewable: boolean('is_previewable').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Enrollments
export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
});

// Lesson Progress
export const lessonProgress = pgTable('lesson_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  isCompleted: boolean('is_completed').default(false),
  progressData: jsonb('progress_data'), // For video position, etc.
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
});

// Assignments
export const assignments = pgTable('assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  instructions: text('instructions'),
  dueDate: timestamp('due_date'),
  maxScore: integer('max_score').default(100),
  allowLateSubmission: boolean('allow_late_submission').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Submissions
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id').references(() => assignments.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content'),
  fileUrls: jsonb('file_urls'), // Array of file URLs
  status: submissionStatusEnum('status').default('pending'),
  score: integer('score'),
  feedback: text('feedback'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  gradedAt: timestamp('graded_at'),
  gradedById: uuid('graded_by_id').references(() => users.id),
});

// Quizzes
export const quizzes = pgTable('quizzes', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  passingScore: integer('passing_score').default(70),
  timeLimit: integer('time_limit'),
  allowRetry: boolean('allow_retry').default(true),
  maxAttempts: integer('max_attempts'),
  shuffleQuestions: boolean('shuffle_questions').default(false),
});

// Quiz Questions
export const quizQuestions = pgTable('quiz_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  quizId: uuid('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  questionText: text('question_text').notNull(),
  questionType: text('question_type').notNull(),
  options: jsonb('options'),
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  points: integer('points').default(1),
  orderIndex: integer('order_index').notNull(),
});

// Quiz Attempts
export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  quizId: uuid('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  score: integer('score'),
  maxScore: integer('max_score'),
  passed: boolean('passed'),
  answers: jsonb('answers'),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// ============================================
// TEACHER TRAINING TABLES
// ============================================

// Training Modules (separate from course modules)
export const trainingModules = pgTable('training_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  orderIndex: integer('order_index').notNull(),
  isRequired: boolean('is_required').default(true),
  estimatedDuration: integer('estimated_duration'), // in minutes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Training Lessons
export const trainingLessons = pgTable('training_lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id').references(() => trainingModules.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  type: lessonTypeEnum('type').notNull(),
  content: text('content'),
  videoUrl: text('video_url'),
  duration: integer('duration'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Training Quizzes
export const trainingQuizzes = pgTable('training_quizzes', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id').references(() => trainingLessons.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  passingScore: integer('passing_score').default(80), // Higher bar for teachers
  timeLimit: integer('time_limit'),
  allowRetry: boolean('allow_retry').default(true),
  maxAttempts: integer('max_attempts').default(3),
});

// Training Quiz Questions
export const trainingQuizQuestions = pgTable('training_quiz_questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  quizId: uuid('quiz_id').references(() => trainingQuizzes.id, { onDelete: 'cascade' }).notNull(),
  questionText: text('question_text').notNull(),
  questionType: text('question_type').notNull(),
  options: jsonb('options'),
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  points: integer('points').default(1),
  orderIndex: integer('order_index').notNull(),
});

// Teacher Training Progress
export const teacherTrainingProgress = pgTable('teacher_training_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  moduleId: uuid('module_id').references(() => trainingModules.id, { onDelete: 'cascade' }).notNull(),
  lessonId: uuid('lesson_id').references(() => trainingLessons.id, { onDelete: 'cascade' }),
  isModuleCompleted: boolean('is_module_completed').default(false),
  isLessonCompleted: boolean('is_lesson_completed').default(false),
  quizScore: integer('quiz_score'),
  quizPassed: boolean('quiz_passed'),
  completedAt: timestamp('completed_at'),
  lastAccessedAt: timestamp('last_accessed_at'),
});

// Teacher Certifications
export const teacherCertifications = pgTable('teacher_certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  certificationType: text('certification_type').notNull(), // 'core', 'mixed_age', 'technology', 'assessment'
  status: certificationStatusEnum('status').default('not_started'),
  requiredModules: jsonb('required_modules'), // Array of module IDs
  completedModules: jsonb('completed_modules'), // Array of completed module IDs
  issuedAt: timestamp('issued_at'),
  expiresAt: timestamp('expires_at'),
  issuedById: uuid('issued_by_id').references(() => users.id),
  certificateUrl: text('certificate_url'), // PDF certificate
});

// Announcements
export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  courseId: uuid('course_id').references(() => courses.id),
  familyUnitId: uuid('family_unit_id').references(() => familyUnits.id),
  targetRole: userRoleEnum('target_role'), // null = all roles
  isPinned: boolean('is_pinned').default(false),
  publishAt: timestamp('publish_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

## API ENDPOINTS

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

### Courses
```
GET    /api/courses                    # List (with filters)
GET    /api/courses/:id                # Single course
POST   /api/courses                    # Create (admin/teacher)
PUT    /api/courses/:id                # Update (admin/teacher)
DELETE /api/courses/:id                # Delete (admin)
GET    /api/courses/:id/curriculum     # Full module/lesson structure
```

### Enrollments
```
POST   /api/enrollments                # Enroll in course
DELETE /api/enrollments/:id            # Unenroll
GET    /api/enrollments/my-courses     # User's enrolled courses
```

### Lessons & Progress
```
GET    /api/lessons/:id                # Lesson content
POST   /api/progress/complete          # Mark lesson complete
GET    /api/progress/:courseId         # User's course progress
GET    /api/progress/dashboard         # Dashboard stats
```

### Assignments & Submissions
```
GET    /api/assignments/:id            # Assignment details
POST   /api/submissions                # Submit assignment
GET    /api/submissions/:assignmentId  # View submissions (teacher)
PUT    /api/submissions/:id/grade      # Grade submission (teacher)
```

### Quizzes
```
GET    /api/quizzes/:id                # Quiz with questions
POST   /api/quizzes/:id/attempt        # Start attempt
PUT    /api/quizzes/:id/attempt/:attemptId  # Submit answers
GET    /api/quizzes/:id/results        # User's quiz results
```

### Admin
```
GET    /api/admin/stats                # Dashboard statistics
GET    /api/admin/students             # Student list
GET    /api/admin/teachers             # Teacher list
GET    /api/admin/submissions/pending  # Pending submissions
POST   /api/admin/announcements        # Create announcement
```

### Teacher Training
```
GET    /api/training/modules           # List training modules
GET    /api/training/modules/:id       # Module with lessons
GET    /api/training/progress          # Teacher's training progress
POST   /api/training/progress/complete # Mark training lesson complete
GET    /api/training/certifications    # Teacher's certifications
POST   /api/admin/training/modules     # Create training module (admin)
PUT    /api/admin/training/modules/:id # Update training module (admin)
POST   /api/admin/certifications/issue # Issue certification (admin)
GET    /api/admin/training/stats       # Training completion stats (admin)
GET    /api/admin/training/teachers    # All teachers' training status (admin)
```

---

## FILE STRUCTURE

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Modal.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Badge.jsx
│   │   ├── Avatar.jsx
│   │   ├── DataTable.jsx
│   │   ├── Pagination.jsx
│   │   ├── Tabs.jsx
│   │   ├── Accordion.jsx
│   │   └── Loading.jsx
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── Header.jsx
│   │   ├── AuthLayout.jsx
│   │   └── MainLayout.jsx
│   ├── dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── StatCard.jsx
│   │   ├── CourseCard.jsx
│   │   └── AnnouncementList.jsx
│   ├── catalog/
│   │   ├── CourseCatalog.jsx
│   │   ├── CatalogFilters.jsx
│   │   └── CatalogCard.jsx
│   ├── course/
│   │   ├── CourseView.jsx
│   │   ├── CourseHeader.jsx
│   │   ├── CourseTabs.jsx
│   │   ├── CourseOverview.jsx
│   │   ├── CourseCurriculum.jsx
│   │   ├── ModuleAccordion.jsx
│   │   ├── LessonView.jsx
│   │   ├── LessonSidebar.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── QuizComponent.jsx
│   │   └── AssignmentSubmit.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── CourseManager.jsx
│   │   ├── CourseEditor.jsx
│   │   ├── StudentManager.jsx
│   │   ├── TeacherManager.jsx
│   │   ├── GradingInterface.jsx
│   │   └── ReportsView.jsx
│   ├── training/
│   │   ├── TeacherTrainingDashboard.jsx
│   │   ├── TrainingModuleCard.jsx
│   │   ├── TrainingLessonView.jsx
│   │   ├── TrainingProgress.jsx
│   │   ├── CertificationCard.jsx
│   │   ├── admin/
│   │   │   ├── TrainingAdmin.jsx
│   │   │   ├── TrainingModuleManager.jsx
│   │   │   ├── TeacherProgressTable.jsx
│   │   │   └── CertificationManager.jsx
│   └── auth/
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       └── ForgotPassword.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useCourses.js
│   ├── useProgress.js
│   └── useTraining.js
├── context/
│   ├── AuthContext.jsx
│   └── AppContext.jsx
├── api/
│   ├── auth.js
│   ├── courses.js
│   ├── progress.js
│   ├── admin.js
│   └── training.js
├── db/
│   ├── schema.ts
│   ├── index.ts
│   └── migrations/
├── styles/
│   ├── variables.css
│   ├── global.css
│   └── components/
└── utils/
    ├── formatters.js
    └── validators.js
```

---

## CURSOR PROMPT EXAMPLES

Use these prompts with Cursor to generate each feature:

### Login/Register
```
Create LoginPage.jsx and RegisterPage.jsx following the SVA design system in SVA_DESIGN_SYSTEM.md. Use the auth page layout with centered card on gradient background. Include form validation, error handling, and loading states. Connect to /api/auth endpoints.
```

### Course Catalog
```
Create CourseCatalog.jsx with CatalogFilters.jsx and CatalogCard.jsx following SVA_DESIGN_SYSTEM.md. Include search with debounce, category filter chips, grade level dropdown, sort dropdown, and pagination. Use the CatalogCard structure from the design system.
```

### Course View
```
Create CourseView.jsx with CourseHeader, CourseTabs (Overview, Curriculum, Resources), and ModuleAccordion components following SVA_DESIGN_SYSTEM.md. Show enrollment status, progress for enrolled users, and expandable module/lesson list.
```

### Lesson View
```
Create LessonView.jsx with VideoPlayer, QuizComponent, and AssignmentSubmit components following SVA_DESIGN_SYSTEM.md. Include lesson sidebar navigation, previous/next buttons, mark complete functionality, and progress tracking.
```

### Admin Dashboard
```
Create AdminDashboard.jsx with AdminSidebar following SVA_DESIGN_SYSTEM.md. Include stat cards for students, courses, pending submissions, completion rate, teachers, and training completion. Add recent activity widgets and quick action buttons.
```

### Teacher Training (Teacher View)
```
Create TeacherTrainingDashboard.jsx following SVA_DESIGN_SYSTEM.md. Include large progress banner with circular progress indicator, training module grid with lock/complete states, and certifications section. Use the TrainingModuleCard and CertificationCard components.
```

### Teacher Training (Admin View)
```
Create TrainingAdmin.jsx with TrainingModuleManager, TeacherProgressTable, and CertificationManager components following SVA_DESIGN_SYSTEM.md. Include CRUD for training modules with drag-drop reordering, teacher progress data table with certification actions, and certification issuance workflow.
```

---

## REMEMBER

1. This file supplements your existing `.cursorrules` - CANON rules take precedence
2. Always use the exact brand colors - never approximate
3. Use Crimson Pro for headings, Nunito for body
4. NO Tailwind - use the CSS variables defined here
5. Implement complete, working code - no placeholders
6. Include loading states, error handling, and responsive design
7. Follow the established component patterns
8. Reference Dashboard.jsx and Dashboard.css as the source of truth for styling
