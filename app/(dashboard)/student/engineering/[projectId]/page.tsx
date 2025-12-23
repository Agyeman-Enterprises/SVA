import { db } from "@/db";
import { engineeringProjects, engineeringProjectSubmissions, engineeringPhases, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EngineeringProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const payload = verifyToken(token || "");

  if (!payload || payload.role !== "student") {
    return <div>Unauthorized</div>;
  }

  // Get project
  const [project] = await db
    .select()
    .from(engineeringProjects)
    .where(eq(engineeringProjects.id, params.projectId))
    .limit(1);

  if (!project) {
    notFound();
  }

  // Get phase info
  const [phase] = await db
    .select()
    .from(engineeringPhases)
    .where(eq(engineeringPhases.id, project.phaseId))
    .limit(1);

  // Get student's submission if exists
  const [submission] = await db
    .select()
    .from(engineeringProjectSubmissions)
    .where(
      and(
        eq(engineeringProjectSubmissions.studentId, payload.userId),
        eq(engineeringProjectSubmissions.projectId, params.projectId)
      )
    )
    .limit(1);

  const instructions = project.instructions as any;
  const materialsList = project.materialsList as any;
  const assessmentCriteria = project.assessmentCriteria as any;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {phase && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                  {phase.phaseName}
                </span>
              )}
              {project.isCapstone && (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                  Capstone
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {project.projectName}
            </h1>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {project.description}
              </p>
            )}
          </div>
        </div>
        {project.estimatedHours && (
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>⏱️ Estimated: {project.estimatedHours} hours</span>
          </div>
        )}
      </div>

      {/* Submission Status */}
      {submission && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                Submission Status
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 capitalize">
                {submission.status.replace(/_/g, " ")}
              </p>
              {submission.submittedAt && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <Link
              href={`/student/engineering/submissions/${submission.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              View Submission
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions */}
          {instructions && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Instructions
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                {Array.isArray(instructions) ? (
                  <ol className="space-y-3">
                    {instructions.map((step: any, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {instructions}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Assessment Criteria */}
          {assessmentCriteria && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Assessment Criteria
              </h2>
              <div className="space-y-3">
                {Array.isArray(assessmentCriteria) ? (
                  assessmentCriteria.map((criterion: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-medium">
                        ✓
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {criterion.criterion || criterion}
                        </p>
                        {criterion.weight && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Weight: {criterion.weight}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{assessmentCriteria}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Materials List */}
          {materialsList && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Materials Needed
              </h3>
              <ul className="space-y-2">
                {Array.isArray(materialsList) ? (
                  materialsList.map((item: any, index: number) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.item || item.name || item}
                      </span>
                      {item.quantity && (
                        <span className="text-gray-500 dark:text-gray-400">
                          x{item.quantity}
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 dark:text-gray-300">{materialsList}</li>
                )}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {project.requiredSkills && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(project.requiredSkills) &&
                  project.requiredSkills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {!submission && (
            <Link
              href={`/student/engineering/${params.projectId}/submit`}
              className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Start Project
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

