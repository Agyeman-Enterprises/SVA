import type { UserRole } from "./auth";

/**
 * Permission matrix: role -> resource -> actions
 * This enforces RBAC at the application level
 */
export type ResourceType =
  | "student"
  | "teacher"
  | "course"
  | "lesson"
  | "submission"
  | "mastery"
  | "curriculum"
  | "audit"
  | "inspection"
  | "admin";

export type Action = "create" | "read" | "update" | "delete" | "export" | "approve";

interface PermissionMatrix {
  [role: string]: {
    [resource: string]: Action[];
  };
}

const permissions: PermissionMatrix = {
  student: {
    course: ["read"],
    lesson: ["read"],
    submission: ["create", "read", "update"], // Can create/update own submissions
    mastery: ["read"], // Can view own mastery
  },
  teacher: {
    student: ["read"], // Can view students in their pods
    course: ["read"],
    lesson: ["read", "update"], // Can assign lessons
    submission: ["read", "update"], // Can grade submissions
    mastery: ["read", "update"], // Can update mastery records
    curriculum: ["read"],
  },
  pod_lead: {
    student: ["read", "update"], // Can manage students in pod
    teacher: ["read"],
    course: ["read"],
    lesson: ["read", "update"],
    submission: ["read", "update"],
    mastery: ["read", "update"],
    curriculum: ["read"],
  },
  school_admin: {
    student: ["create", "read", "update", "delete"],
    teacher: ["create", "read", "update", "delete"],
    course: ["create", "read", "update", "delete"],
    lesson: ["create", "read", "update", "delete"],
    submission: ["read", "update"],
    mastery: ["read", "update"],
    curriculum: ["create", "read", "update", "approve"],
    admin: ["read", "update"],
  },
  district_admin: {
    student: ["create", "read", "update", "delete"],
    teacher: ["create", "read", "update", "delete"],
    course: ["create", "read", "update", "delete"],
    lesson: ["create", "read", "update", "delete"],
    submission: ["read", "update"],
    mastery: ["read", "update"],
    curriculum: ["create", "read", "update", "approve"],
    admin: ["create", "read", "update", "delete"],
    audit: ["read", "export"],
  },
  inspector: {
    // Read-only access, fully audited
    student: ["read"], // Anonymized views only
    course: ["read"],
    lesson: ["read"],
    curriculum: ["read"],
    mastery: ["read"], // Anonymized views only
    audit: ["read", "export"],
    inspection: ["read", "create", "update"], // Can create inspection reports
  },
};

/**
 * Check if a role has permission to perform an action on a resource
 */
export function hasPermission(
  role: UserRole,
  resource: ResourceType,
  action: Action
): boolean {
  const rolePermissions = permissions[role];
  if (!rolePermissions) {
    return false;
  }

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) {
    return false;
  }

  return resourcePermissions.includes(action);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Record<ResourceType, Action[]> {
  const rolePermissions = permissions[role] || {};
  return rolePermissions as Record<ResourceType, Action[]>;
}

/**
 * Check if a role is inspector (read-only, audited)
 */
export function isInspector(role: UserRole): boolean {
  return role === "inspector";
}

/**
 * Check if a role can mutate data
 */
export function canMutate(role: UserRole): boolean {
  return role !== "inspector";
}

