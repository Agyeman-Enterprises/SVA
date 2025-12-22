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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Courses</h2>
          {assignedCourses.length === 0 ? (
            <p className="text-gray-500">No courses assigned to your pod</p>
          ) : (
            <ul className="space-y-2">
              {assignedCourses.map(({ assignment, courseVersion, course }) => (
                <li key={assignment.id}>
                  <Link
                    href={`/student/courses/${course.id}/version/${courseVersion.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {course.title} (v{courseVersion.version})
                  </Link>
                  <span className="ml-2 text-sm text-gray-500">
                    {courseVersion.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Enrollment Status</h2>
          {enrollment ? (
            <div>
              <p className={enrollment.active ? "text-green-600" : "text-gray-500"}>
                {enrollment.active ? "✓ Active" : "Inactive"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Not enrolled</p>
          )}
        </div>
      </div>
    </div>
  );
}
