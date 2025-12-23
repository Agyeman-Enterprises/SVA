import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { deviceMaintenanceLog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logAuditEvent } from "@/lib/audit";

/**
 * EPIC 11: Device Maintenance API
 * POST /api/devices/maintenance
 * Log maintenance events (repairs, replacements, firmware updates)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, maintenanceType, description, performedBy, partsUsed, costUsd, nextMaintenanceDue } = body;

    if (!deviceId || !maintenanceType) {
      return NextResponse.json(
        { error: "deviceId and maintenanceType are required" },
        { status: 400 }
      );
    }

    const [logEntry] = await db
      .insert(deviceMaintenanceLog)
      .values({
        deviceId,
        maintenanceType,
        description: description || null,
        performedBy: performedBy || null,
        partsUsed: partsUsed || null,
        costUsd: costUsd || null,
        nextMaintenanceDue: nextMaintenanceDue || null,
      })
      .returning();

    const userId = request.headers.get("x-user-id") || performedBy || "system";
    await logAuditEvent({
      userId,
      userRole: "admin" as any,
      action: "create",
      resourceType: "device_maintenance",
      resourceId: logEntry.id,
      metadata: { deviceId, maintenanceType },
    });

    return NextResponse.json({ logEntry }, { status: 201 });
  } catch (error: any) {
    console.error("Maintenance log error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log maintenance" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/devices/maintenance
 * List maintenance logs (with optional filters)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    let logs = await db.select().from(deviceMaintenanceLog);

    if (deviceId) {
      logs = logs.filter((l) => l.deviceId === deviceId);
    }

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("List maintenance error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list maintenance logs" },
      { status: 500 }
    );
  }
}


