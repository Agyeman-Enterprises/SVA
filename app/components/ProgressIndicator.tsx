interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ProgressIndicator({
  current,
  total,
  label,
  showPercentage = true,
  size = "md",
}: ProgressIndicatorProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300 ${
            percentage === 100 ? "bg-green-600 dark:bg-green-500" : ""
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!label && showPercentage && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {current} of {total} completed
        </div>
      )}
    </div>
  );
}

