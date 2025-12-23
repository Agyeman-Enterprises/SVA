import { db } from "@/db";
import { users, userMemberships, pods, podCourseAssignments, courseVersions, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import CourseCard from "@/app/components/CourseCard";

export default async function MyCoursesPage() {
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
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            You are not enrolled in a pod. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Courses</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user.displayName}. Continue your learning journey.
        </p>
      </div>

      {assignedCourses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No courses assigned yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your pod hasn&apos;t been assigned any courses. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedCourses.map(({ assignment, courseVersion, course }) => (
            <CourseCard
              key={assignment.id}
              courseId={course.id}
              courseTitle={course.title}
              version={courseVersion.version}
              status={courseVersion.status}
              description={course.description || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

