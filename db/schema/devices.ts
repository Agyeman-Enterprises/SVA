import { pgTable, uuid, text, timestamp, integer, decimal, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { syncNodes } from "./offline";
import { users } from "./people";
import { teacherProfiles } from "./teacher_development";
import { contentPackages } from "./offline";

/**
 * EPIC 11: SVA Education Device - Device Registry
 * Tracks all SVA devices (phones, laptops, hubs) in the fleet
 */
export const svaDevices = pgTable("sva_devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceType: text("device_type").notNull(), // 'phone' | 'laptop' | 'hub'
  serialNumber: text("serial_number").notNull().unique(),
  hardwareRevision: text("hardware_revision"), // 'v1.0', 'v1.1', etc.
  firmwareVersion: text("firmware_version"),
  syncNodeId: uuid("sync_node_id").references(() => syncNodes.id),
  assignedStudentId: uuid("assigned_student_id").references(() => users.id),
  assignedTeacherId: uuid("assigned_teacher_id").references(() => teacherProfiles.id),
  status: text("status").default("active").notNull(), // 'active' | 'maintenance' | 'lost' | 'retired'
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  batteryHealthPercent: integer("battery_health_percent"), // 0-100
  storageUsedMb: integer("storage_used_mb"),
  storageTotalMb: integer("storage_total_mb"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 11: Device Maintenance Log
 * Tracks all maintenance events (repairs, replacements, firmware updates)
 */
export const deviceMaintenanceLog = pgTable("device_maintenance_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: uuid("device_id").references(() => svaDevices.id).notNull(),
  maintenanceType: text("maintenance_type").notNull(), // 'repair' | 'replacement' | 'firmware_update' | 'battery_swap' | 'preventive'
  description: text("description"),
  performedBy: uuid("performed_by").references(() => users.id), // Technician/admin user
  partsUsed: jsonb("parts_used"), // [{part: 'battery', cost: 3.00, quantity: 1}]
  costUsd: decimal("cost_usd", { precision: 10, scale: 2 }),
  performedAt: timestamp("performed_at", { withTimezone: true }).defaultNow().notNull(),
  nextMaintenanceDue: timestamp("next_maintenance_due", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 11: Device Content Deployments
 * Tracks which content packages are deployed to which devices
 */
export const deviceContentDeployments = pgTable("device_content_deployments", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: uuid("device_id").references(() => svaDevices.id).notNull(),
  contentPackageId: uuid("content_package_id").references(() => contentPackages.id).notNull(),
  deployedAt: timestamp("deployed_at", { withTimezone: true }).defaultNow().notNull(),
  deployedVersion: text("deployed_version"), // Version of content package
  deploymentMethod: text("deployment_method").notNull(), // 'hub_sync' | 'direct_download' | 'sd_card' | 'manual'
  verificationChecksum: text("verification_checksum"), // SHA-256 checksum for integrity
  status: text("status").default("pending").notNull(), // 'pending' | 'downloading' | 'installed' | 'failed' | 'verified'
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const svaDevicesRelations = relations(svaDevices, ({ one, many }) => ({
  syncNode: one(syncNodes, {
    fields: [svaDevices.syncNodeId],
    references: [syncNodes.id],
  }),
  assignedStudent: one(users, {
    fields: [svaDevices.assignedStudentId],
    references: [users.id],
  }),
  assignedTeacher: one(teacherProfiles, {
    fields: [svaDevices.assignedTeacherId],
    references: [teacherProfiles.id],
  }),
  maintenanceLogs: many(deviceMaintenanceLog),
  contentDeployments: many(deviceContentDeployments),
}));

export const deviceMaintenanceLogRelations = relations(deviceMaintenanceLog, ({ one }) => ({
  device: one(svaDevices, {
    fields: [deviceMaintenanceLog.deviceId],
    references: [svaDevices.id],
  }),
  performedByUser: one(users, {
    fields: [deviceMaintenanceLog.performedBy],
    references: [users.id],
  }),
}));

export const deviceContentDeploymentsRelations = relations(deviceContentDeployments, ({ one }) => ({
  device: one(svaDevices, {
    fields: [deviceContentDeployments.deviceId],
    references: [svaDevices.id],
  }),
  contentPackage: one(contentPackages, {
    fields: [deviceContentDeployments.contentPackageId],
    references: [contentPackages.id],
  }),
}));

