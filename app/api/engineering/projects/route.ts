import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { engineeringProjects, engineeringProjectSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logAuditEvent } from "@/lib/audit";

/**
 * EPIC 12: Engineering Projects API
 * GET /api/engineering/projects
 * List all engineering projects
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phaseId = searchParams.get("phaseId");
    const isCapstone = searchParams.get("isCapstone");

    let query = db.select().from(engineeringProjects);

    if (phaseId) {
      // Would need proper where clause with eq
      const projects = await db
        .select()
        .from(engineeringProjects)
        .where(eq(engineeringProjects.phaseId, phaseId));
      return NextResponse.json({ projects });
    }

    const projects = await db.select().from(engineeringProjects);
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Engineering projects error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/engineering/projects
 * Create a new engineering project
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phaseId, projectCode, projectName, description, instructions, requiredSkills, estimatedHours, materialsList, assessmentCriteria, isCapstone } = body;

    if (!phaseId || !projectCode || !projectName) {
      return NextResponse.json(
        { error: "phaseId, projectCode, and projectName are required" },
        { status: 400 }
      );
    }

    const [project] = await db
      .insert(engineeringProjects)
      .values({
        phaseId,
        projectCode,
        projectName,
        description: description || null,
        instructions: instructions || null,
        requiredSkills: requiredSkills || null,
        estimatedHours: estimatedHours || null,
        materialsList: materialsList || null,
        assessmentCriteria: assessmentCriteria || null,
        isCapstone: isCapstone || false,
      })
      .returning();

    const userId = request.headers.get("x-user-id") || "system";
    await logAuditEvent({
      userId,
      userRole: "admin" as any,
      action: "create",
      resourceType: "engineering_project",
      resourceId: project.id,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}

