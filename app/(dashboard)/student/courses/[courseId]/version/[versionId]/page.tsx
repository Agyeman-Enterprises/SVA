import { db } from "@/db";
import { courses, courseVersions, units, lessons, pods, podCourseAssignments, userMemberships, progressEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProgressIndicator from "@/app/components/ProgressIndicator";

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

  // Get lessons for each unit and progress
  const unitsWithLessons = await Promise.all(
    courseUnits.map(async (unit) => {
      const unitLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.unitId, unit.id))
        .orderBy(lessons.lessonNumber);
      
      // Get progress for each lesson
      const lessonsWithProgress = await Promise.all(
        unitLessons.map(async (lesson) => {
          const progress = await db
            .select()
            .from(progressEvents)
            .where(
              and(
                eq(progressEvents.studentUserId, payload.userId),
                eq(progressEvents.lessonId, lesson.id),
                eq(progressEvents.eventType, "lesson_completed" as any)
              )
            )
            .limit(1);
          return {
            ...lesson,
            completed: progress.length > 0,
          };
        })
      );
      
      return { unit, lessons: lessonsWithProgress };
    })
  );

  // Calculate overall progress
  const totalLessons = unitsWithLessons.reduce((acc, { lessons }) => acc + lessons.length, 0);
  const completedLessons = unitsWithLessons.reduce(
    (acc, { lessons }) => acc + lessons.filter((l: any) => l.completed).length,
    0
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Course Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {course.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              v{courseVersion.version}
            </span>
            {courseVersion.isImmutable && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                ✓ Approved
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>📚 {courseUnits.length} Units</span>
          <span>📖 {totalLessons} Lessons</span>
        </div>
        <div className="mt-4">
          <ProgressIndicator
            current={completedLessons}
            total={totalLessons}
            label="Course Progress"
            showPercentage={true}
            size="md"
          />
        </div>
      </div>

      {/* Units and Lessons */}
      <div className="space-y-4">
        {unitsWithLessons.map(({ unit, lessons }, unitIndex) => (
          <div
            key={unit.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold">
                  {unit.unitNumber}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {unit.title}
                  </h2>
                  {unit.overview && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {unit.overview}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/student/lessons/${lesson.id}`}
                    className="group flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                      (lesson as any).completed
                        ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-800 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}>
                      {(lesson as any).completed ? "✓" : lesson.lessonNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {lesson.title}
                      </p>
                      {lesson.objectives && Array.isArray(lesson.objectives) && lesson.objectives.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {lesson.objectives[0]}
                        </p>
                      )}
                    </div>
                    {(lesson as any).completed && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</span>
                    )}
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
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
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

