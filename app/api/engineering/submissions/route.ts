import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { engineeringProjectSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logAuditEvent } from "@/lib/audit";

/**
 * EPIC 12: Engineering Project Submissions API
 * POST /api/engineering/submissions
 * Submit a project with evidence (photos, videos, documentation)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, projectId, deviceId, submissionEvidence, documentation, mentorId } = body;

    if (!studentId || !projectId) {
      return NextResponse.json(
        { error: "studentId and projectId are required" },
        { status: 400 }
      );
    }

    const [submission] = await db
      .insert(engineeringProjectSubmissions)
      .values({
        studentId,
        projectId,
        deviceId: deviceId || null,
        submissionEvidence: submissionEvidence || null,
        documentation: documentation || null,
        mentorId: mentorId || null,
        status: "submitted",
        submittedAt: new Date(),
      })
      .returning();

    const userId = request.headers.get("x-user-id") || studentId;
    await logAuditEvent({
      userId,
      userRole: "student" as any,
      action: "create",
      resourceType: "engineering_submission",
      resourceId: submission.id,
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit project" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/engineering/submissions
 * List submissions (with optional filters)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");

    let submissions = await db.select().from(engineeringProjectSubmissions);

    // Apply filters (simplified - would need proper where clauses)
    if (studentId) {
      submissions = submissions.filter((s) => s.studentId === studentId);
    }
    if (projectId) {
      submissions = submissions.filter((s) => s.projectId === projectId);
    }
    if (status) {
      submissions = submissions.filter((s) => s.status === status);
    }

    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error("List submissions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list submissions" },
      { status: 500 }
    );
  }
}


