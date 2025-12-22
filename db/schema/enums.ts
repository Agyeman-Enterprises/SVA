import { pgEnum } from "drizzle-orm/pg-core";

// ---------- Enums ----------
export const userGlobalRole = pgEnum("user_global_role", [
  "student",
  "teacher",
  "pod_lead",
  "school_admin",
  "district_admin",
  "inspector",
]);

export const membershipScope = pgEnum("membership_scope", [
  "district",
  "school",
  "campus",
  "pod",
]);

export const teacherTier = pgEnum("teacher_tier", ["0", "1", "2", "3", "4"]);

export const courseVersionStatus = pgEnum("course_version_status", [
  "draft",
  "in_review",
  "approved",
  "deprecated",
]);

export const assignmentStatus = pgEnum("assignment_status", [
  "assigned",
  "in_progress",
  "submitted",
  "returned",
  "completed",
]);

export const submissionStatus = pgEnum("submission_status", [
  "draft",
  "submitted",
  "needs_revision",
  "graded",
]);

export const masteryLevel = pgEnum("mastery_level", [
  "not_started",
  "emerging",
  "developing",
  "proficient",
  "mastered",
]);

export const auditAction = pgEnum("audit_action", [
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "export",
  "login",
  "logout",
]);

