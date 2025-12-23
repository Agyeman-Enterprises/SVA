import Link from "next/link";
import "./CourseCard.css";

interface CourseCardProps {
  courseId: string;
  courseTitle: string;
  version: string | number;
  status: string;
  description?: string;
  progress?: number;
  category?: string;
  instructor?: string;
  nextLesson?: string;
  imageUrl?: string;
}

export default function CourseCard({
  courseId,
  courseTitle,
  version,
  status,
  description,
  progress = 0,
  category,
  instructor,
  nextLesson,
  imageUrl,
}: CourseCardProps) {
  return (
    <article className="sva-course-card">
      {/* Course Image */}
      <div
        className="sva-course-image"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : "linear-gradient(135deg, var(--sva-green) 0%, var(--sva-green-light) 100%)",
        }}
      >
        {category && (
          <span className="sva-course-category">{category}</span>
        )}
      </div>

      {/* Course Content */}
      <div className="sva-course-content">
        <h3 className="sva-course-title">{courseTitle}</h3>
        {instructor && (
          <p className="sva-course-instructor">{instructor}</p>
        )}

        {/* Progress */}
        <div className="sva-course-progress">
          <div className="sva-progress-bar">
            <div
              className="sva-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="sva-progress-text">{progress}% complete</span>
        </div>

        {/* Next Lesson */}
        {nextLesson && (
          <div className="sva-course-next">
            <span className="sva-next-label">Next:</span>
            <span className="sva-next-lesson">{nextLesson}</span>
          </div>
        )}

        {/* Continue Button */}
        <Link href={`/student/courses/${courseId}/version/${String(version)}`} className="sva-continue-btn">
          Continue →
        </Link>
      </div>
    </article>
  );
}

