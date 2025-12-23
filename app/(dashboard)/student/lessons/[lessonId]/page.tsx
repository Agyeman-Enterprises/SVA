import { db } from "@/db";
import { lessons, activities, units, courses, courseVersions, lessonAssets, userMemberships, pods, podCourseAssignments, lessonAssignments, progressEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import { logAuditEvent } from "@/lib/audit";
import Link from "next/link";

export default async function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || payload.role !== "student") {
    return <div>Unauthorized</div>;
  }

  // Get lesson
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, params.lessonId))
    .limit(1);

  if (!lesson) {
    notFound();
  }

  // Get unit
  const [unit] = await db
    .select()
    .from(units)
    .where(eq(units.id, lesson.unitId))
    .limit(1);

  if (!unit) {
    notFound();
  }

  // Get course version
  const [courseVersion] = await db
    .select()
    .from(courseVersions)
    .where(eq(courseVersions.id, unit.courseVersionId))
    .limit(1);

  if (!courseVersion) {
    notFound();
  }

  // Get course
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseVersion.courseId))
    .limit(1);

  if (!course) {
    notFound();
  }

  // Get student's pod membership
  const [membership] = await db
    .select()
    .from(userMemberships)
    .where(and(eq(userMemberships.userId, payload.userId), eq(userMemberships.role, "student")))
    .limit(1);

  if (!membership || !membership.podId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            You are not enrolled in a pod. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  // Verify this course version is assigned to the student's pod
  const [assignment] = await db
    .select()
    .from(podCourseAssignments)
    .where(
      and(
        eq(podCourseAssignments.podId, membership.podId),
        eq(podCourseAssignments.courseVersionId, courseVersion.id)
      )
    )
    .limit(1);

  if (!assignment) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-2">
            Access Denied
          </h2>
          <p className="text-red-800 dark:text-red-300">
            This course is not assigned to your pod.
          </p>
        </div>
      </div>
    );
  }

  // Get activities for this lesson
  const lessonActivities = await db
    .select()
    .from(activities)
    .where(eq(activities.lessonId, lesson.id));

  // Get lesson assets
  const assets = await db
    .select()
    .from(lessonAssets)
    .where(eq(lessonAssets.lessonId, lesson.id));

  // Log progress event
  await db.insert(progressEvents).values({
    studentUserId: payload.userId,
    podId: membership.podId,
    lessonId: lesson.id,
    eventType: "lesson_accessed",
    eventData: {},
  });

  // Log access
  await logAuditEvent({
    userId: payload.userId,
    userRole: payload.role,
    action: "read",
    resourceType: "lesson",
    resourceId: lesson.id,
    requestId: crypto.randomUUID(),
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-center space-x-2">
        <Link href="/student" className="hover:text-blue-600 dark:hover:text-blue-400">
          Dashboard
        </Link>
        <span>/</span>
        <Link
          href={`/student/courses/${course.id}/version/${courseVersion.id}`}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">Lesson {lesson.lessonNumber}</span>
      </nav>

      {/* Lesson Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold">
                {lesson.lessonNumber}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {lesson.title}
                </h1>
                {lesson.estimatedMinutes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ⏱️ {lesson.estimatedMinutes} minutes
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Objectives */}
        {lesson.objectives && Array.isArray(lesson.objectives) && lesson.objectives.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {lesson.objectives.map((objective: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {lesson.tags && Array.isArray(lesson.tags) && lesson.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {lesson.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Lesson Content
        </h2>
        <div className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400">
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {lesson.canonicalText}
          </div>
        </div>
      </div>

      {/* Lesson Assets */}
      {assets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset) => (
              <a
                key={asset.id}
                href={asset.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <div className="flex-shrink-0 text-2xl">
                  {asset.kind === "video" && "🎥"}
                  {asset.kind === "audio" && "🎵"}
                  {asset.kind === "pdf" && "📄"}
                  {asset.kind === "image" && "🖼️"}
                  {asset.kind === "link" && "🔗"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {asset.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {asset.kind}
                    {asset.durationSeconds && ` • ${Math.floor(asset.durationSeconds / 60)} min`}
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {lessonActivities.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Activities
          </h2>
          <div className="space-y-4">
            {lessonActivities.map((activity) => (
              <div
                key={activity.id}
                className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase">
                    {activity.activityType}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{activity.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Link
          href={`/student/courses/${course.id}/version/${courseVersion.id}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          ← Back to Course
        </Link>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Lesson {lesson.lessonNumber} of Unit {unit.unitNumber}
        </div>
      </div>
    </div>
  );
}
