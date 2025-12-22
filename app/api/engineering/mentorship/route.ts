import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { engineeringMentorshipSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logAuditEvent } from "@/lib/audit";

/**
 * EPIC 12: Engineering Mentorship API
 * POST /api/engineering/mentorship
 * Log mentorship sessions between senior and junior students
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mentorId, menteeId, projectId, podId, sessionDate, durationMinutes, topicsCovered, menteeProgress, mentorReflection, assessment } = body;

    if (!mentorId || !menteeId || !sessionDate) {
      return NextResponse.json(
        { error: "mentorId, menteeId, and sessionDate are required" },
        { status: 400 }
      );
    }

    const [session] = await db
      .insert(engineeringMentorshipSessions)
      .values({
        mentorId,
        menteeId,
        projectId: projectId || null,
        podId: podId || null,
        sessionDate: new Date(sessionDate),
        durationMinutes: durationMinutes || null,
        topicsCovered: topicsCovered || null,
        menteeProgress: menteeProgress || null,
        mentorReflection: mentorReflection || null,
        assessment: assessment || null,
      })
      .returning();

    const userId = request.headers.get("x-user-id") || mentorId;
    await logAuditEvent({
      userId,
      userRole: "student" as any,
      action: "create",
      resourceType: "engineering_mentorship",
      resourceId: session.id,
      metadata: { mentorId, menteeId },
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (error: any) {
    console.error("Mentorship session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log mentorship session" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/engineering/mentorship
 * List mentorship sessions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get("mentorId");
    const menteeId = searchParams.get("menteeId");

    let sessions = await db.select().from(engineeringMentorshipSessions);

    if (mentorId) {
      sessions = sessions.filter((s) => s.mentorId === mentorId);
    }
    if (menteeId) {
      sessions = sessions.filter((s) => s.menteeId === menteeId);
    }

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error("List mentorship error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list mentorship sessions" },
      { status: 500 }
    );
  }
}

