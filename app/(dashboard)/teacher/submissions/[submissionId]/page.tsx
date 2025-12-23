import { db } from "@/db";
import { submissions, submissionFeedback, users, lessonAssignments, lessons, units, courses, courseVersions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SubmissionDetailPage({
  params,
}: {
  params: { submissionId: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || (payload.role !== "teacher" && payload.role !== "pod_lead")) {
    return <div>Unauthorized</div>;
  }

  // Get submission
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, params.submissionId))
    .limit(1);

  if (!submission) {
    notFound();
  }

  // Get student
  const [student] = await db
    .select()
    .from(users)
    .where(eq(users.id, submission.studentUserId))
    .limit(1);

  if (!student) {
    notFound();
  }

  // Get lesson assignment
  const [lessonAssignment] = await db
    .select()
    .from(lessonAssignments)
    .where(eq(lessonAssignments.id, submission.lessonAssignmentId))
    .limit(1);

  if (!lessonAssignment) {
    notFound();
  }

  // Get lesson
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonAssignment.lessonId))
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

  // Get existing feedback
  const existingFeedback = await db
    .select()
    .from(submissionFeedback)
    .where(eq(submissionFeedback.submissionId, submission.id))
    .limit(1);

  const content = submission.content as any;
  const statusColors: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    reviewed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    needs_revision: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/teacher/submissions"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to Submissions
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Submission Review
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {student.displayName} • {lesson.title}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                statusColors[submission.status] || statusColors.draft
              }`}
            >
              {submission.status}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>Course: {course.title} (v{courseVersion.version})</p>
            <p>Unit {unit.unitNumber}: {unit.title}</p>
            <p>Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Submission Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Student Work
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          {content.text && (
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
              {content.text}
            </div>
          )}
          {content.attachments && Array.isArray(content.attachments) && content.attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Attachments</h3>
              {content.attachments.map((attachment: any, idx: number) => (
                <a
                  key={idx}
                  href={attachment.url || attachment.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>📎</span>
                  <span>{attachment.name || attachment.title || `Attachment ${idx + 1}`}</span>
                </a>
              ))}
            </div>
          )}
          {!content.text && (!content.attachments || content.attachments.length === 0) && (
            <p className="text-gray-500 dark:text-gray-400 italic">No content submitted</p>
          )}
        </div>
      </div>

      {/* Existing Feedback */}
      {existingFeedback.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-4">
            Your Feedback
          </h2>
          <div className="space-y-4">
            {existingFeedback.map((feedback) => (
              <div key={feedback.id}>
                <p className="text-green-800 dark:text-green-300 whitespace-pre-wrap">
                  {feedback.comment}
                </p>
                {feedback.rubricScores && Object.keys(feedback.rubricScores).length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                      Rubric Scores:
                    </p>
                    {Object.entries(feedback.rubricScores).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-green-700 dark:text-green-300">{key}</span>
                        <span className="font-medium text-green-900 dark:text-green-200">
                          {value}/100
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  {new Date(feedback.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {existingFeedback.length > 0 ? "Update Feedback" : "Provide Feedback"}
        </h2>
        <form action="/api/submissions/feedback" method="POST" className="space-y-4">
          <input type="hidden" name="submissionId" value={submission.id} />
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Comments
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={6}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide constructive feedback on the student's work..."
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              name="action"
              value="approve"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Approve
            </button>
            <button
              type="submit"
              name="action"
              value="needs_revision"
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors"
            >
              Needs Revision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

