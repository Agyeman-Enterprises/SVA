import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { svaDevices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logAuditEvent } from "@/lib/audit";

/**
 * EPIC 11: Device Assignment API
 * POST /api/devices/assign
 * 
 * Assigns a device to a student or teacher, tracking custody chain.
 * Business logic: One student = one phone, shared laptops tracked differently.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, assignedStudentId, assignedTeacherId } = body;

    if (!deviceId) {
      return NextResponse.json(
        { error: "deviceId is required" },
        { status: 400 }
      );
    }

    if (!assignedStudentId && !assignedTeacherId) {
      return NextResponse.json(
        { error: "Either assignedStudentId or assignedTeacherId is required" },
        { status: 400 }
      );
    }

    // Get current device
    const [device] = await db
      .select()
      .from(svaDevices)
      .where(eq(svaDevices.id, deviceId))
      .limit(1);

    if (!device) {
      return NextResponse.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }

    // Update assignment
    const [updated] = await db
      .update(svaDevices)
      .set({
        assignedStudentId: assignedStudentId || null,
        assignedTeacherId: assignedTeacherId || null,
        updatedAt: new Date(),
      })
      .where(eq(svaDevices.id, deviceId))
      .returning();

    // Log audit event
    const userId = request.headers.get("x-user-id") || "system";
    await logAuditEvent({
      userId,
      userRole: "admin" as any,
      action: "update",
      resourceType: "device",
      resourceId: deviceId,
      metadata: {
        previousStudentId: device.assignedStudentId,
        previousTeacherId: device.assignedTeacherId,
        newStudentId: assignedStudentId,
        newTeacherId: assignedTeacherId,
      },
    });

    return NextResponse.json({ device: updated });
  } catch (error: any) {
    console.error("Device assignment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to assign device" },
      { status: 500 }
    );
  }
}

