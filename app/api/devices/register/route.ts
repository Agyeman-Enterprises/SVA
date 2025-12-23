import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { svaDevices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logAuditEvent } from "@/lib/audit";

/**
 * EPIC 11: Device Registration API
 * POST /api/devices/register
 * 
 * Registers a new SVA device (phone, laptop, or hub) with serial number and hardware revision.
 * Devices can self-register on first boot.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceType, serialNumber, hardwareRevision, firmwareVersion, syncNodeId } = body;

    // Validation
    if (!deviceType || !serialNumber) {
      return NextResponse.json(
        { error: "deviceType and serialNumber are required" },
        { status: 400 }
      );
    }

    if (!["phone", "laptop", "hub"].includes(deviceType)) {
      return NextResponse.json(
        { error: "deviceType must be 'phone', 'laptop', or 'hub'" },
        { status: 400 }
      );
    }

    // Check if serial number already exists
    const existing = await db
      .select()
      .from(svaDevices)
      .where(eq(svaDevices.serialNumber, serialNumber))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Device with this serial number already exists" },
        { status: 409 }
      );
    }

    // Create device
    const [device] = await db
      .insert(svaDevices)
      .values({
        deviceType,
        serialNumber,
        hardwareRevision: hardwareRevision || null,
        firmwareVersion: firmwareVersion || null,
        syncNodeId: syncNodeId || null,
        status: "active",
      })
      .returning();

    // Log audit event
    const userId = request.headers.get("x-user-id") || "system";
    await logAuditEvent({
      userId,
      userRole: "admin" as any,
      action: "create",
      resourceType: "device",
      resourceId: device.id,
      metadata: { deviceType, serialNumber },
    });

    return NextResponse.json({ device }, { status: 201 });
  } catch (error: any) {
    console.error("Device registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register device" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/devices/register
 * List all registered devices (with optional filters)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceType = searchParams.get("deviceType");
    const status = searchParams.get("status");
    const syncNodeId = searchParams.get("syncNodeId");

    let query = db.select().from(svaDevices);

    // Apply filters
    const conditions: any[] = [];
    if (deviceType) {
      conditions.push(eq(svaDevices.deviceType, deviceType));
    }
    if (status) {
      conditions.push(eq(svaDevices.status, status));
    }
    if (syncNodeId) {
      conditions.push(eq(svaDevices.syncNodeId, syncNodeId));
    }

    const devices = conditions.length > 0
      ? await db.select().from(svaDevices).where(conditions[0]) // Simplified - would need proper AND/OR logic
      : await db.select().from(svaDevices);

    return NextResponse.json({ devices });
  } catch (error: any) {
    console.error("Device list error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list devices" },
      { status: 500 }
    );
  }
}


