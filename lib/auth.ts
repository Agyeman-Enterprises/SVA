// @ts-ignore - bcryptjs types are included in the package
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users, userMemberships } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { env } from "./env";

export type UserRole = "student" | "teacher" | "pod_lead" | "school_admin" | "district_admin" | "inspector";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  membershipId?: string; // Scoped membership ID
  scope?: "district" | "school" | "campus" | "pod";
}

// JWT_SECRET from environment (validated when accessed via lazy proxy)
function getJwtSecret(): string {
  return env.JWT_SECRET;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Authenticate a user by email and password
 * Returns the primary membership (first active membership found)
 */
export async function authenticateUser(
  email: string,
  password: string,
  scopeContext?: { districtId?: string; schoolId?: string; campusId?: string; podId?: string }
): Promise<JWTPayload | null> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  // Get user's primary membership (first active membership, optionally scoped)
  let membershipQuery = db
    .select()
    .from(userMemberships)
    .where(eq(userMemberships.userId, user.id))
    .limit(1);

  // If scope context provided, prefer matching membership
  if (scopeContext) {
    const conditions = [eq(userMemberships.userId, user.id)];
    if (scopeContext.districtId) {
      conditions.push(eq(userMemberships.districtId, scopeContext.districtId));
    }
    if (scopeContext.schoolId) {
      conditions.push(eq(userMemberships.schoolId, scopeContext.schoolId));
    }
    if (scopeContext.campusId) {
      conditions.push(eq(userMemberships.campusId, scopeContext.campusId));
    }
    if (scopeContext.podId) {
      conditions.push(eq(userMemberships.podId, scopeContext.podId));
    }
    membershipQuery = db.select().from(userMemberships).where(and(...conditions)).limit(1);
  }

  const [membership] = await membershipQuery;

  if (!membership) {
    // User exists but has no memberships - cannot authenticate
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    role: membership.role as UserRole,
    membershipId: membership.id,
    scope: membership.scope as "district" | "school" | "campus" | "pod",
  };
}

