import { db } from "@/db";
import { lessons, activities, units, courses, curriculumVersions, progress, students, enrollments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import { logAuditEvent } from "@/lib/audit";

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

  // Get student record
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, payload.userId))
    .limit(1);

  if (!student) {
    return <div>Student record not found</div>;
  }

  // Get lesson with unit and course
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, params.lessonId))
    .limit(1);

  if (!lesson) {
    notFound();
  }

  // Get unit and course
  const [unit] = await db
    .select()
    .from(units)
    .where(eq(units.id, lesson.unitId))
    .limit(1);

  if (!unit) {
    notFound();
  }

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, unit.courseId))
    .limit(1);

  if (!course) {
    notFound();
  }

  // Check enrollment
  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.studentId, student.id),
        eq(enrollments.courseId, course.id)
      )
    )
    .limit(1);

  if (!enrollment) {
    return <div>Not enrolled in this course</div>;
  }

  // Get curriculum version (if exists)
  let curriculumVersion = null;
  if (course.curriculumVersionId) {
    const [version] = await db
      .select()
      .from(curriculumVersions)
      .where(eq(curriculumVersions.id, course.curriculumVersionId))
      .limit(1);
    curriculumVersion = version;
  }

  // Get activities for this lesson
  const lessonActivities = await db
    .select()
    .from(activities)
    .where(eq(activities.lessonId, lesson.id))
    .orderBy(activities.sequence);

  // Get or create progress record
  let [progressRecord] = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.studentId, student.id),
        eq(progress.lessonId, lesson.id),
        eq(progress.enrollmentId, enrollment.id)
      )
    )
    .limit(1);

  if (!progressRecord) {
    // Create progress record
    const [newProgress] = await db
      .insert(progress)
      .values({
        studentId: student.id,
        lessonId: lesson.id,
        enrollmentId: enrollment.id,
        startedAt: new Date(),
        lastAccessedAt: new Date(),
      })
      .returning();
    progressRecord = newProgress;
  } else {
    // Update last accessed
    await db
      .update(progress)
      .set({ lastAccessedAt: new Date() })
      .where(eq(progress.id, progressRecord.id));
  }

  // Log access
  await logAuditEvent({
    userId: payload.userId,
    userRole: payload.role,
    action: "read",
    resourceType: "lesson",
    resourceId: lesson.id,
    requestId: crypto.randomUUID(),
  });

  // Render Tier-4 content (scaffolding would be applied based on teacher tier)
  // For now, we show the full Tier-4 content
  const tier4Content = lesson.tier4Content;

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>{course.name}</span> / <span>{unit.name}</span> / <span>{lesson.name}</span>
        </nav>
        <h1 className="text-3xl font-bold">{lesson.name}</h1>
        {curriculumVersion && (
          <p className="text-sm text-gray-500 mt-2">
            Curriculum Version: {curriculumVersion.version} (Approved)
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: tier4Content.content }}
        />
        
        {tier4Content.resources && tier4Content.resources.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Resources</h3>
            <ul className="space-y-2">
              {tier4Content.resources.map((resource, idx) => (
                <li key={idx}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {resource.title} ({resource.type})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tier4Content.concepts && tier4Content.concepts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {tier4Content.concepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {lessonActivities.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Activities</h2>
          <div className="space-y-4">
            {lessonActivities.map((activity) => (
              <div key={activity.id} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">{activity.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {activity.content.instructions}
                </p>
                {activity.content.scaffolding && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Scaffolding available for different tiers</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Progress: {progressRecord.completedAt ? "Completed" : "In Progress"}
        </p>
      </div>
    </div>
  );
}

