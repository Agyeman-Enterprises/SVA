import { db } from "@/db";
import { courses, courseVersions, units, lessons, pods, podCourseAssignments, userMemberships } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

/**
 * Curriculum Read Path
 * 
 * Key principle: course_version assignment to pod determines visible content
 * Students can only see courses assigned to their pod via podCourseAssignments
 */
export default async function CourseVersionPage({
  params,
}: {
  params: { courseId: string; versionId: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || payload.role !== "student") {
    return <div>Unauthorized</div>;
  }

  // Get student's membership to find their pod
  const [membership] = await db
    .select()
    .from(userMemberships)
    .where(and(eq(userMemberships.userId, payload.userId), eq(userMemberships.role, "student")))
    .limit(1);

  if (!membership || !membership.podId) {
    return <div>Student not enrolled in a pod</div>;
  }

  // Verify this course version is assigned to the student's pod
  const [assignment] = await db
    .select()
    .from(podCourseAssignments)
    .where(
      and(
        eq(podCourseAssignments.podId, membership.podId),
        eq(podCourseAssignments.courseVersionId, params.versionId)
      )
    )
    .limit(1);

  if (!assignment) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">
          This course version is not assigned to your pod.
        </p>
      </div>
    );
  }

  // Get course version
  const [courseVersion] = await db
    .select()
    .from(courseVersions)
    .where(eq(courseVersions.id, params.versionId))
    .limit(1);

  if (!courseVersion) {
    notFound();
  }

  // Verify course version matches course
  if (courseVersion.courseId !== params.courseId) {
    notFound();
  }

  // Get course
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, params.courseId))
    .limit(1);

  if (!course) {
    notFound();
  }

  // Get units for this course version
  const courseUnits = await db
    .select()
    .from(units)
    .where(eq(units.courseVersionId, courseVersion.id))
    .orderBy(units.unitNumber);

  // Get lessons for each unit
  const unitsWithLessons = await Promise.all(
    courseUnits.map(async (unit) => {
      const unitLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.unitId, unit.id))
        .orderBy(lessons.lessonNumber);
      return { unit, lessons: unitLessons };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{course.description}</p>
        <div className="mt-2 text-sm text-gray-500">
          <span>Version {courseVersion.version}</span>
          {courseVersion.isImmutable && (
            <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
              Approved
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {unitsWithLessons.map(({ unit, lessons }) => (
          <div key={unit.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Unit {unit.unitNumber}: {unit.title}
            </h2>
            {unit.overview && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{unit.overview}</p>
            )}
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/student/lessons/${lesson.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Lesson {lesson.lessonNumber}: {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

