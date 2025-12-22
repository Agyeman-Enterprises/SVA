import { db } from "@/db";
import { courses, units, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || payload.role !== "student") {
    return <div>Unauthorized</div>;
  }

  // Get course with units
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, params.courseId))
    .limit(1);

  if (!course) {
    notFound();
  }

  // Get units for this course
  const courseUnits = await db
    .select()
    .from(units)
    .where(eq(units.courseId, course.id))
    .orderBy(units.sequence);

  // Get lessons for each unit (simplified - would batch in production)
  const unitsWithLessons = await Promise.all(
    courseUnits.map(async (unit) => {
      const unitLessons = await db
        .select()
        .from(lessons)
        .where(eq(lessons.unitId, unit.id))
        .orderBy(lessons.sequence);
      return { unit, lessons: unitLessons };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{course.description}</p>
      </div>

      <div className="space-y-6">
        {unitsWithLessons.map(({ unit, lessons }) => (
          <div key={unit.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Unit {unit.sequence}: {unit.name}
            </h2>
            {unit.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{unit.description}</p>
            )}
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/student/lessons/${lesson.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Lesson {lesson.sequence}: {lesson.name}
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

