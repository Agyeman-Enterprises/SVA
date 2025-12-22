import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./org";
import { users } from "./people";
import { courseVersions } from "./curriculum";
import { lessonAssignments } from "./curriculum";

// ---------- Offline Sync Infrastructure ----------
export const syncNodes = pgTable(
  "sync_nodes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nodeType: text("node_type").notNull(), // "learning_center" | "mobile_unit" | "cafe_partner"
    schoolId: uuid("school_id").references(() => schools.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    location: jsonb("location").$type<{ lat: number; lng: number; address: string }>(),
    lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
    syncStatus: text("sync_status").notNull().default("pending"), // "synced" | "pending" | "conflict"
    localDbVersion: integer("local_db_version").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    schoolIdx: index("sync_nodes_school_idx").on(t.schoolId),
    nodeTypeIdx: index("sync_nodes_node_type_idx").on(t.nodeType),
    syncStatusIdx: index("sync_nodes_sync_status_idx").on(t.syncStatus),
  })
);

export const contentPackages = pgTable(
  "content_packages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseVersionId: uuid("course_version_id")
      .notNull()
      .references(() => courseVersions.id, { onDelete: "cascade" }),
    packageVersion: integer("package_version").notNull(),
    sizeMb: integer("size_mb").notNull(),
    checksum: text("checksum").notNull(),
    downloadUrl: text("download_url").notNull(),
    includesAudio: boolean("includes_audio").default(true).notNull(),
    includesVideo: boolean("includes_video").default(true).notNull(),
    minimalPackageUrl: text("minimal_package_url"), // text-only version for low bandwidth
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    courseVersionIdx: index("content_packages_course_version_idx").on(t.courseVersionId),
  })
);

export const offlineSubmissions = pgTable(
  "offline_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    localId: text("local_id").notNull(), // UUID generated offline
    syncNodeId: uuid("sync_node_id").notNull().references(() => syncNodes.id, { onDelete: "cascade" }),
    studentUserId: uuid("student_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonAssignmentId: uuid("lesson_assignment_id").references(() => lessonAssignments.id, { onDelete: "set null" }),
    content: jsonb("content").$type<Record<string, unknown>>().notNull(),
    createdAtLocal: timestamp("created_at_local", { withTimezone: true }).notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true }),
    syncStatus: text("sync_status").notNull().default("pending"), // "pending" | "synced" | "conflict"
    conflictResolution: jsonb("conflict_resolution").$type<Record<string, unknown>>(),
  },
  (t) => ({
    syncNodeIdx: index("offline_submissions_sync_node_idx").on(t.syncNodeId),
    studentIdx: index("offline_submissions_student_idx").on(t.studentUserId),
    localIdIdx: index("offline_submissions_local_id_idx").on(t.localId),
    syncStatusIdx: index("offline_submissions_sync_status_idx").on(t.syncStatus),
  })
);

// Relations
export const syncNodesRelations = relations(syncNodes, ({ one, many }) => ({
  school: one(schools, {
    fields: [syncNodes.schoolId],
    references: [schools.id],
  }),
  offlineSubmissions: many(offlineSubmissions),
}));

export const contentPackagesRelations = relations(contentPackages, ({ one }) => ({
  courseVersion: one(courseVersions, {
    fields: [contentPackages.courseVersionId],
    references: [courseVersions.id],
  }),
}));

export const offlineSubmissionsRelations = relations(offlineSubmissions, ({ one }) => ({
  syncNode: one(syncNodes, {
    fields: [offlineSubmissions.syncNodeId],
    references: [syncNodes.id],
  }),
  student: one(users, {
    fields: [offlineSubmissions.studentUserId],
    references: [users.id],
  }),
  lessonAssignment: one(lessonAssignments, {
    fields: [offlineSubmissions.lessonAssignmentId],
    references: [lessonAssignments.id],
  }),
}));

