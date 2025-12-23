import { db } from "@/db";
import {
  users,
  userMemberships,
  enrollments,
  pods,
  podCourseAssignments,
  courseVersions,
  courses,
  progressEvents,
  submissions,
} from "@/db/schema";
import { subjects } from "@/db/schema/academic";
import { eq, and, count, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import SVAHeader from "@/app/components/SVAHeader";
import StatCard from "@/app/components/StatCard";
import CourseCard from "@/app/components/CourseCard";

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || payload.role !== "student") {
    return <div>Unauthorized</div>;
  }

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (!user) {
    return <div>User not found</div>;
  }

  // Get student's membership (pod-scoped)
  const [membership] = await db
    .select()
    .from(userMemberships)
    .where(and(eq(userMemberships.userId, payload.userId), eq(userMemberships.role, "student")))
    .limit(1);

  if (!membership || !membership.podId) {
    return <div>Student not enrolled in a pod</div>;
  }

  // Get pod
  const [pod] = await db.select().from(pods).where(eq(pods.id, membership.podId)).limit(1);

  // Get assigned courses for this pod with subject information
  const assignedCourses = await db
    .select({
      assignment: podCourseAssignments,
      courseVersion: courseVersions,
      course: courses,
      subject: subjects,
    })
    .from(podCourseAssignments)
    .innerJoin(courseVersions, eq(podCourseAssignments.courseVersionId, courseVersions.id))
    .innerJoin(courses, eq(courseVersions.courseId, courses.id))
    .innerJoin(subjects, eq(courses.subjectId, subjects.id))
    .where(eq(podCourseAssignments.podId, membership.podId));

  // Get stats
  const [completedLessons] = await db
    .select({ count: count() })
    .from(progressEvents)
    .where(
      and(
        eq(progressEvents.studentUserId, payload.userId),
        eq(progressEvents.eventType, "lesson_completed" as any)
      )
    );

  const [pendingSubmissions] = await db
    .select({ count: count() })
    .from(submissions)
    .where(
      and(
        eq(submissions.studentUserId, payload.userId),
        eq(submissions.status, "submitted" as any)
      )
    );

  // Calculate progress for each course (simplified - would need proper calculation)
  const coursesWithProgress = await Promise.all(
    assignedCourses.map(async ({ course, courseVersion, subject }) => {
      // Get lesson count and completed count for this course version
      // This is simplified - in production, you'd calculate actual progress
      return {
        course,
        courseVersion,
        subject,
        progress: Math.floor(Math.random() * 80) + 10, // Placeholder
      };
    })
  );

  const firstName = user.displayName.split(" ")[0] || user.displayName;

  return (
    <>
      <SVAHeader userName={firstName} userRole={payload.role} />

      {/* Stats */}
      <section className="sva-stats">
        <StatCard
          value="12"
          label="Day Streak"
          variant="streak"
          decoration="🔥"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          }
        />
        <StatCard
          value="2,450"
          label="Knowledge Points"
          variant="points"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        />
        <StatCard
          value={assignedCourses.length}
          label="Active Courses"
          variant="courses"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          }
        />
        <StatCard
          value={pendingSubmissions.count}
          label="Pending Tasks"
          variant="assignments"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          }
        />
      </section>

      {/* Main Grid */}
      <div className="sva-content-grid">
        {/* Courses Section */}
        <section className="sva-section sva-courses-section">
          <div className="sva-section-header">
            <h2>Continue Learning</h2>
            <Link href="/student/courses" className="sva-link">
              View All Courses →
            </Link>
          </div>

          {assignedCourses.length === 0 ? (
            <div className="sva-card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📚</div>
              <p style={{ color: 'var(--sva-gray-500)' }}>No courses assigned to your pod</p>
            </div>
          ) : (
            <div className="sva-courses-grid">
              {coursesWithProgress.slice(0, 4).map(({ course, courseVersion, subject, progress }) => (
                <CourseCard
                  key={courseVersion.id}
                  courseId={course.id}
                  courseTitle={course.title}
                  version={courseVersion.version}
                  status={courseVersion.status}
                  description={course.description || undefined}
                  progress={progress}
                  category={subject?.name?.toUpperCase() || subject?.code || undefined}
                  nextLesson="Next Lesson"
                />
              ))}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="sva-sidebar-content">
          {/* Announcements */}
          <section className="sva-announcements">
            <div className="sva-section-header">
              <h2>Announcements</h2>
            </div>
            <div className="sva-announcement-list">
              <div className="sva-announcement-item">
                <div className="sva-announcement-icon">📅</div>
                <div className="sva-announcement-content">
                  <p className="sva-announcement-title">Family Unit Showcase This Friday!</p>
                  <span className="sva-announcement-time">2 hours ago</span>
                </div>
              </div>
              <div className="sva-announcement-item">
                <div className="sva-announcement-icon">ℹ️</div>
                <div className="sva-announcement-content">
                  <p className="sva-announcement-title">New Mentorship Pairings Posted</p>
                  <span className="sva-announcement-time">1 day ago</span>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Due */}
          <section className="sva-upcoming">
            <div className="sva-section-header">
              <h2>Upcoming Due</h2>
            </div>
            <div className="sva-assignment-list">
              <div className="sva-assignment-item">
                <div className="sva-assignment-priority high"></div>
                <div className="sva-assignment-content">
                  <p className="sva-assignment-title">Ecosystem Journal Entry</p>
                  <span className="sva-assignment-course">Environmental Stewardship</span>
                </div>
                <span className="sva-assignment-due">2 days</span>
              </div>
              <div className="sva-assignment-item">
                <div className="sva-assignment-priority medium"></div>
                <div className="sva-assignment-content">
                  <p className="sva-assignment-title">Short Story Draft</p>
                  <span className="sva-assignment-course">Creative Writing</span>
                </div>
                <span className="sva-assignment-due">5 days</span>
              </div>
              <div className="sva-assignment-item">
                <div className="sva-assignment-priority low"></div>
                <div className="sva-assignment-content">
                  <p className="sva-assignment-title">Business Plan Outline</p>
                  <span className="sva-assignment-course">Entrepreneurship</span>
                </div>
                <span className="sva-assignment-due">1 week</span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="sva-quick-actions">
            <div className="sva-section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="sva-actions-grid">
              <button className="sva-action-btn">
                <span className="sva-action-icon">📝</span>
                <span>Start Quiz</span>
              </button>
              <button className="sva-action-btn">
                <span className="sva-action-icon">📚</span>
                <span>Resources</span>
              </button>
              <button className="sva-action-btn">
                <span className="sva-action-icon">👥</span>
                <span>Study Group</span>
              </button>
              <button className="sva-action-btn">
                <span className="sva-action-icon">🎯</span>
                <span>Goals</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

