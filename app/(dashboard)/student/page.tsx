import { db } from "@/db";
import { users, userMemberships, enrollments, pods, podCourseAssignments, courseVersions, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";

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

  // Get enrollment
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.studentUserId, payload.userId), eq(enrollments.podId, membership.podId)))
    .limit(1);

  // Get pod
  const [pod] = await db.select().from(pods).where(eq(pods.id, membership.podId)).limit(1);

  // Get assigned courses for this pod
  const assignedCourses = await db
    .select({
      assignment: podCourseAssignments,
      courseVersion: courseVersions,
      course: courses,
    })
    .from(podCourseAssignments)
    .innerJoin(courseVersions, eq(podCourseAssignments.courseVersionId, courseVersions.id))
    .innerJoin(courses, eq(courseVersions.courseId, courses.id))
    .where(eq(podCourseAssignments.podId, membership.podId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome, {user.displayName}
        </p>
        {pod && (
          <p className="text-sm text-gray-500 mt-1">
            Pod: {pod.name} ({pod.languageCode})
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">My Courses</h2>
          {assignedCourses.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-gray-500 dark:text-gray-400">No courses assigned to your pod</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedCourses.slice(0, 5).map(({ assignment, courseVersion, course }) => (
                <Link
                  key={assignment.id}
                  href={`/student/courses/${course.id}/version/${courseVersion.id}`}
                  className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {course.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Version {courseVersion.version}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
              {assignedCourses.length > 5 && (
                <Link
                  href="/student/courses"
                  className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline pt-2"
                >
                  View all {assignedCourses.length} courses →
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Enrollment Status</h2>
          {enrollment ? (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    enrollment.active
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                <p
                  className={`font-medium ${
                    enrollment.active
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {enrollment.active ? "Active Enrollment" : "Inactive"}
                </p>
              </div>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                </p>
                {pod && (
                  <p>
                    Pod: {pod.name} ({pod.languageCode})
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Not enrolled</p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h2>
          <div className="space-y-2">
            <Link
              href="/student/courses"
              className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📚</span>
                <span className="font-medium text-gray-900 dark:text-white">All Courses</span>
              </div>
            </Link>
            <Link
              href="/student/engineering"
              className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔧</span>
                <span className="font-medium text-gray-900 dark:text-white">Engineering Projects</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
