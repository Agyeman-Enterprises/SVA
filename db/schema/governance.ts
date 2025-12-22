import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./people";
import { districts, schools } from "./org";
import { pods } from "./academic";
import { courseVersions } from "./curriculum";
import { membershipScope, auditAction } from "./enums";

// ---------- Governance ----------
export const approvalRecords = pgTable(
  "approval_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseVersionId: uuid("course_version_id")
      .notNull()
      .references(() => courseVersions.id, { onDelete: "cascade" }),
    approvedByUserId: uuid("approved_by_user_id").references(() => users.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }).defaultNow().notNull(),
    approvalNote: text("approval_note"),
  },
  (t) => ({
    courseVersionIdx: index("approval_records_course_version_idx").on(t.courseVersionId),
  })
);

export const inspectionReports = pgTable(
  "inspection_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    inspectorUserId: uuid("inspector_user_id").references(() => users.id, { onDelete: "set null" }),
    schoolId: uuid("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
    reportPeriodStart: timestamp("report_period_start", { withTimezone: true }).notNull(),
    reportPeriodEnd: timestamp("report_period_end", { withTimezone: true }).notNull(),
    findings: jsonb("findings").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    schoolIdx: index("inspection_reports_school_idx").on(t.schoolId),
  })
);

export const retentionPolicies = pgTable(
  "retention_policies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    districtId: uuid("district_id").notNull().references(() => districts.id, { onDelete: "cascade" }),
    rawTextDays: integer("raw_text_days").notNull().default(60),
    derivedYears: integer("derived_years").notNull().default(3),
    dualApprovalRequired: boolean("dual_approval_required").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    districtUx: uniqueIndex("retention_policies_district_ux").on(t.districtId),
  })
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    action: auditAction("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    scope: membershipScope("scope").notNull(),
    districtId: uuid("district_id").references(() => districts.id, { onDelete: "set null" }),
    schoolId: uuid("school_id").references(() => schools.id, { onDelete: "set null" }),
    podId: uuid("pod_id").references(() => pods.id, { onDelete: "set null" }),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    actorIdx: index("audit_log_actor_idx").on(t.actorUserId),
    entityIdx: index("audit_log_entity_idx").on(t.entityType, t.entityId),
    createdIdx: index("audit_log_created_idx").on(t.createdAt),
  })
);

// Relations
export const approvalRecordsRelations = relations(approvalRecords, ({ one }) => ({
  courseVersion: one(courseVersions, {
    fields: [approvalRecords.courseVersionId],
    references: [courseVersions.id],
  }),
  approver: one(users, {
    fields: [approvalRecords.approvedByUserId],
    references: [users.id],
  }),
}));

export const inspectionReportsRelations = relations(inspectionReports, ({ one }) => ({
  inspector: one(users, {
    fields: [inspectionReports.inspectorUserId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [inspectionReports.schoolId],
    references: [schools.id],
  }),
}));

export const retentionPoliciesRelations = relations(retentionPolicies, ({ one }) => ({
  district: one(districts, {
    fields: [retentionPolicies.districtId],
    references: [districts.id],
  }),
}));
