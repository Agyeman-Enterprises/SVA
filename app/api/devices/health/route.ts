import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { svaDevices } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * EPIC 11: Device Health Monitoring API
 * POST /api/devices/health
 * 
 * Endpoint for devices to report battery health, storage, last sync.
 * Triggers alerts when battery < 20% health, storage > 90% full.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, batteryHealthPercent, storageUsedMb, storageTotalMb } = body;

    if (!deviceId) {
      return NextResponse.json(
        { error: "deviceId is required" },
        { status: 400 }
      );
    }

    // Update device health metrics
    const [updated] = await db
      .update(svaDevices)
      .set({
        batteryHealthPercent: batteryHealthPercent !== undefined ? batteryHealthPercent : null,
        storageUsedMb: storageUsedMb !== undefined ? storageUsedMb : null,
        storageTotalMb: storageTotalMb !== undefined ? storageTotalMb : null,
        lastSeenAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(svaDevices.id, deviceId))
      .returning();

    // Check for alerts
    const alerts: string[] = [];
    if (batteryHealthPercent !== undefined && batteryHealthPercent < 20) {
      alerts.push("Battery health below 20%");
    }
    if (storageUsedMb !== undefined && storageTotalMb !== undefined) {
      const usagePercent = (storageUsedMb / storageTotalMb) * 100;
      if (usagePercent > 90) {
        alerts.push("Storage usage above 90%");
      }
    }

    return NextResponse.json({
      device: updated,
      alerts: alerts.length > 0 ? alerts : undefined,
    });
  } catch (error: any) {
    console.error("Device health update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update device health" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/devices/health
 * Get fleet health overview
 */
export async function GET(request: NextRequest) {
  try {
    const devices = await db.select().from(svaDevices);

    const healthSummary = {
      total: devices.length,
      active: devices.filter((d) => d.status === "active").length,
      maintenance: devices.filter((d) => d.status === "maintenance").length,
      lowBattery: devices.filter((d) => d.batteryHealthPercent !== null && d.batteryHealthPercent < 20).length,
      highStorage: devices.filter((d) => {
        if (d.storageUsedMb && d.storageTotalMb) {
          return (d.storageUsedMb / d.storageTotalMb) * 100 > 90;
        }
        return false;
      }).length,
      devicesNeedingAttention: devices.filter((d) => {
        const lowBattery = d.batteryHealthPercent !== null && d.batteryHealthPercent < 20;
        const highStorage = d.storageUsedMb && d.storageTotalMb
          ? (d.storageUsedMb / d.storageTotalMb) * 100 > 90
          : false;
        return lowBattery || highStorage || d.status === "maintenance";
      }),
    };

    return NextResponse.json({ healthSummary });
  } catch (error: any) {
    console.error("Fleet health error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get fleet health" },
      { status: 500 }
    );
  }
}


