import Link from "next/link";

interface CourseCardProps {
  courseId: string;
  courseTitle: string;
  version: string;
  status: string;
  description?: string;
  progress?: number;
}

export default function CourseCard({
  courseId,
  courseTitle,
  version,
  status,
  description,
  progress,
}: CourseCardProps) {
  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    archived: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  return (
    <Link
      href={`/student/courses/${courseId}/version/${version}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {courseTitle}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            statusColors[status] || statusColors.draft
          }`}
        >
          {status}
        </span>
      </div>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Version {version}</span>
        {progress !== undefined && (
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

