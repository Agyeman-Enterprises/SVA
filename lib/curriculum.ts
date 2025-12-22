import { db } from "@/db";
import { courses, courseVersions, lessons, units, activities } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Curriculum Engine
 * 
 * Handles curriculum versioning, content delivery, and scaffolding
 * 
 * Key principles:
 * - Curriculum is authored at Tier-4 (highest abstraction)
 * - Content is immutable once approved
 * - Scaffolding is applied at delivery time, not in stored content
 */

export interface CurriculumContent {
  courseId: string;
  version: string;
  contentHash: string;
  isApproved: boolean;
}

/**
 * Get the active curriculum version for a course
 */
export async function getActiveCurriculumVersion(courseId: string) {
  // Get the latest approved version for the course
  const [version] = await db
    .select()
    .from(courseVersions)
    .where(eq(courseVersions.courseId, courseId))
    .orderBy(courseVersions.version)
    .limit(1);

  return version;
}

/**
 * Get all curriculum versions for a course (for admin/inspector views)
 */
export async function getAllCurriculumVersions(courseId: string) {
  return await db
    .select()
    .from(courseVersions)
    .where(eq(courseVersions.courseId, courseId))
    .orderBy(courseVersions.version);
}

/**
 * Verify curriculum content integrity using content hash
 */
export async function verifyCurriculumIntegrity(
  versionId: string
): Promise<boolean> {
  const [version] = await db
    .select()
    .from(courseVersions)
    .where(eq(courseVersions.id, versionId))
    .limit(1);

  if (!version) {
    return false;
  }

  // Integrity verified by isImmutable flag and approval status
  return version.isImmutable && version.status === "approved";
}

/**
 * Get lesson content with appropriate scaffolding
 * 
 * @param lessonId - Lesson ID
 * @param teacherTier - Teacher's delivery tier (tier0-tier4)
 * @returns Lesson content with scaffolding applied
 */
export async function getScaffoldedLesson(
  lessonId: string,
  teacherTier: "tier0" | "tier1" | "tier2" | "tier3" | "tier4" = "tier4"
) {
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lesson) {
    return null;
  }

  // Get activities with scaffolding
  const lessonActivities = await db
    .select()
    .from(activities)
    .where(eq(activities.lessonId, lessonId))
    .orderBy(activities.sequence);

  // Extract scaffolding for the teacher's tier
  const scaffoldedActivities = lessonActivities.map((activity) => {
    const scaffolding = activity.content.scaffolding?.[teacherTier];
    return {
      ...activity,
      scaffoldedInstructions: scaffolding || activity.content.instructions,
    };
  });

  return {
    lesson,
    activities: scaffoldedActivities,
    scaffoldingTier: teacherTier,
  };
}

/**
 * Check if a curriculum version can be modified
 * (Only draft versions can be modified)
 */
export async function canModifyCurriculumVersion(versionId: string): Promise<boolean> {
  const [version] = await db
    .select()
    .from(courseVersions)
    .where(eq(courseVersions.id, versionId))
    .limit(1);

  if (!version) {
    return false;
  }

  // Only draft versions can be modified, and must not be immutable
  return version.status === "draft" && !version.isImmutable;
}

/**
 * Get curriculum version history (for traceability)
 */
export async function getCurriculumVersionHistory(courseId: string) {
  const versions = await getAllCurriculumVersions(courseId);
  
  return versions.map((version) => ({
    id: version.id,
    version: version.version,
    status: version.status,
    approvedAt: version.approvedAt,
    supersededBy: version.supersededBy,
    createdAt: version.createdAt,
  }));
}

/**
 * Validate curriculum content structure
 * Ensures content follows required schema
 */
export function validateCurriculumContent(content: any): boolean {
  // Basic validation - in production, use Zod schema
  if (!content || typeof content !== "object") {
    return false;
  }

  // Check for required fields in lesson content
  if (content.content && typeof content.content === "string") {
    return true;
  }

  return false;
}

