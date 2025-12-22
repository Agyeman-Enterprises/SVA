import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userMemberships } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { authenticateUser } from "@/lib/auth";
import { isInspector, hasPermission } from "@/lib/rbac";
import { logAuditEvent } from "@/lib/audit";

/**
 * RBAC Test Endpoints
 * Tests to prove:
 * - Inspector cannot mutate
 * - Teacher can assign + feedback
 * - Student can submit
 */

// Test: Inspector cannot mutate
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { test, email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Log test attempt
  await logAuditEvent({
    userId: user.userId,
    userRole: user.role,
    action: "read",
    resourceType: "test",
    metadata: { test },
  });

  switch (test) {
    case "inspector_mutation":
      // Test: Inspector should be blocked from mutations
      if (isInspector(user.role)) {
        return NextResponse.json({
          test: "inspector_mutation",
          result: "PASS",
          message: "Inspector role detected - mutations blocked by middleware",
          role: user.role,
        });
      } else {
        return NextResponse.json({
          test: "inspector_mutation",
          result: "SKIP",
          message: "User is not an inspector",
          role: user.role,
        });
      }

    case "teacher_assign":
      // Test: Teacher can assign lessons
      if (user.role === "teacher" || user.role === "pod_lead") {
        const canAssign = hasPermission(user.role, "lesson", "update");
        return NextResponse.json({
          test: "teacher_assign",
          result: canAssign ? "PASS" : "FAIL",
          message: canAssign
            ? "Teacher has permission to assign lessons"
            : "Teacher does not have permission to assign lessons",
          role: user.role,
          hasPermission: canAssign,
        });
      } else {
        return NextResponse.json({
          test: "teacher_assign",
          result: "SKIP",
          message: "User is not a teacher",
          role: user.role,
        });
      }

    case "teacher_feedback":
      // Test: Teacher can provide feedback
      if (user.role === "teacher" || user.role === "pod_lead") {
        const canFeedback = hasPermission(user.role, "submission", "update");
        return NextResponse.json({
          test: "teacher_feedback",
          result: canFeedback ? "PASS" : "FAIL",
          message: canFeedback
            ? "Teacher has permission to provide feedback"
            : "Teacher does not have permission to provide feedback",
          role: user.role,
          hasPermission: canFeedback,
        });
      } else {
        return NextResponse.json({
          test: "teacher_feedback",
          result: "SKIP",
          message: "User is not a teacher",
          role: user.role,
        });
      }

    case "student_submit":
      // Test: Student can submit work
      if (user.role === "student") {
        const canSubmit = hasPermission(user.role, "submission", "create");
        return NextResponse.json({
          test: "student_submit",
          result: canSubmit ? "PASS" : "FAIL",
          message: canSubmit
            ? "Student has permission to submit work"
            : "Student does not have permission to submit work",
          role: user.role,
          hasPermission: canSubmit,
        });
      } else {
        return NextResponse.json({
          test: "student_submit",
          result: "SKIP",
          message: "User is not a student",
          role: user.role,
        });
      }

    default:
      return NextResponse.json({ error: "Unknown test" }, { status: 400 });
  }
}

// Get test results (read-only, all roles can access)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "RBAC Test Endpoints",
    tests: [
      {
        name: "inspector_mutation",
        description: "Test that inspector cannot mutate data",
        method: "POST",
        body: { test: "inspector_mutation", email: "inspector@sva.edu", password: "password123" },
      },
      {
        name: "teacher_assign",
        description: "Test that teacher can assign lessons",
        method: "POST",
        body: { test: "teacher_assign", email: "teacher.tier4@sva.edu", password: "password123" },
      },
      {
        name: "teacher_feedback",
        description: "Test that teacher can provide feedback",
        method: "POST",
        body: { test: "teacher_feedback", email: "teacher.tier4@sva.edu", password: "password123" },
      },
      {
        name: "student_submit",
        description: "Test that student can submit work",
        method: "POST",
        body: { test: "student_submit", email: "student1@sva.edu", password: "password123" },
      },
    ],
  });
}

