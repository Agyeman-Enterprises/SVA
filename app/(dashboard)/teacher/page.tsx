import { db } from "@/db";
import { users, userMemberships, pods, lessonAssignments, submissions, submissionFeedback } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function TeacherDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || (payload.role !== "teacher" && payload.role !== "pod_lead")) {
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

  // Get teacher's membership
  const [membership] = await db
    .select()
    .from(userMemberships)
    .where(and(eq(userMemberships.userId, payload.userId), eq(userMemberships.role, payload.role)))
    .limit(1);

  if (!membership) {
    return <div>Teacher membership not found</div>;
  }

  // Get pod if scoped to pod
  let pod = null;
  if (membership.podId) {
    const [podData] = await db.select().from(pods).where(eq(pods.id, membership.podId)).limit(1);
    pod = podData;
  }

  // Get lesson assignments for this pod
  const assignments = membership.podId
    ? await db
        .select()
        .from(lessonAssignments)
        .where(eq(lessonAssignments.podId, membership.podId))
        .limit(10)
    : [];

  // Get pending submissions (simplified - would need proper joins)
  const pendingSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.status, "submitted" as any))
    .limit(10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome, {user.displayName}
        </p>
        {membership.teacherTier && (
          <p className="text-sm text-gray-500 mt-1">
            Tier: {membership.teacherTier}
          </p>
        )}
        {pod && (
          <p className="text-sm text-gray-500 mt-1">
            Pod: {pod.name} ({pod.languageCode})
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Pod</h2>
          {pod ? (
            <div>
              <p className="font-medium">{pod.name}</p>
              <p className="text-sm text-gray-500">
                Language: {pod.languageCode}
              </p>
              <p className="text-sm text-gray-500">
                Rotation: {new Date(pod.rotationStartDate).toLocaleDateString()} - {new Date(pod.rotationEndDate).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No pod assigned</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Lesson Assignments</h2>
          <p className="text-gray-500 text-sm mb-2">
            {assignments.length} assignments
          </p>
          {assignments.length > 0 && (
            <ul className="space-y-1 text-sm">
              {assignments.slice(0, 5).map((assignment) => (
                <li key={assignment.id}>
                  Assignment #{assignment.id.substring(0, 8)} - {assignment.status}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pending Submissions</h2>
          <p className="text-gray-500 text-sm mb-2">
            {pendingSubmissions.length} pending review
          </p>
          {pendingSubmissions.length > 0 && (
            <ul className="space-y-1 text-sm">
              {pendingSubmissions.slice(0, 5).map((submission) => (
                <li key={submission.id}>
                  Submission #{submission.id.substring(0, 8)} - {submission.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
