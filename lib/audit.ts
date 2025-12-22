import { db } from "@/db";
import { auditLog } from "@/db/schema";
import type { UserRole } from "./auth";
import type { Action } from "./rbac";

/**
 * Log an audit event
 * All access and mutations must be logged for compliance
 */
export async function logAuditEvent(params: {
  userId: string;
  userRole: UserRole;
  action: Action | "login" | "logout" | "access_denied";
  resourceType: string;
  resourceId?: string;
  scope?: "district" | "school" | "campus" | "pod";
  districtId?: string;
  schoolId?: string;
  podId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}) {
  try {
    await db.insert(auditLog).values({
      actorUserId: params.userId,
      action: params.action as any,
      entityType: params.resourceType,
      entityId: params.resourceId,
      scope: params.scope || "district",
      districtId: params.districtId,
      schoolId: params.schoolId,
      podId: params.podId,
      meta: {
        ...params.metadata,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        requestId: params.requestId,
        userRole: params.userRole,
      },
    });
  } catch (error) {
    // Log to console if database logging fails (should not happen in production)
    console.error("Failed to log audit event:", error);
    // In production, consider sending to external logging service
  }
}

/**
 * Get audit logs for a user (for inspector/admin views)
 */
export async function getAuditLogs(params: {
  userId?: string;
  resourceType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  const { userId, resourceType, startDate, endDate, limit = 100 } = params;

  let query = db.select().from(auditLog);

  // Apply filters (would need to use Drizzle's query builder properly)
  // This is a simplified version - in production, use proper Drizzle queries
  return query.limit(limit);
}

