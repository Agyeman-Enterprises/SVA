import { db } from "@/db";
import { submissions, users, lessonAssignments, lessons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";

export default async function SubmissionsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || (payload.role !== "teacher" && payload.role !== "pod_lead")) {
    return <div>Unauthorized</div>;
  }

  // Get pending submissions
  const pendingSubmissions = await db
    .select({
      submission: submissions,
      student: users,
      lesson: lessons,
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.studentUserId, users.id))
    .innerJoin(lessonAssignments, eq(submissions.lessonAssignmentId, lessonAssignments.id))
    .innerJoin(lessons, eq(lessonAssignments.lessonId, lessons.id))
    .where(eq(submissions.status, "submitted" as any))
    .limit(50);

  // Get reviewed submissions
  const reviewedSubmissions = await db
    .select({
      submission: submissions,
      student: users,
      lesson: lessons,
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.studentUserId, users.id))
    .innerJoin(lessonAssignments, eq(submissions.lessonAssignmentId, lessonAssignments.id))
    .innerJoin(lessons, eq(lessonAssignments.lessonId, lessons.id))
    .where(eq(submissions.status, "graded" as any))
    .limit(20);

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    reviewed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    needs_revision: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Student Submissions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and provide feedback on student work
        </p>
      </div>

      {/* Pending Submissions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pending Review ({pendingSubmissions.length})
          </h2>
        </div>
        {pendingSubmissions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-600 dark:text-gray-400">
              No pending submissions. All caught up!
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingSubmissions.map(({ submission, student, lesson }) => (
                <Link
                  key={submission.id}
                  href={`/teacher/submissions/${submission.id}`}
                  className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {student.displayName}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            statusColors[submission.status] || statusColors.draft
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {lesson.title}
                      </p>
                      {submission.submittedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
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
            </div>
          </div>
        )}
      </div>

      {/* Recently Reviewed */}
      {reviewedSubmissions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recently Reviewed
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {reviewedSubmissions.map(({ submission, student, lesson }) => (
                <Link
                  key={submission.id}
                  href={`/teacher/submissions/${submission.id}`}
                  className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {student.displayName}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            statusColors[submission.status] || statusColors.draft
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {lesson.title}
                      </p>
                      {submission.updatedAt && submission.status === "graded" && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Reviewed: {new Date(submission.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

