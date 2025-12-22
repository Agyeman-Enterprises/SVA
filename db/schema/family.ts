import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./people";

// ---------- Guardian/Family Integration ----------
export const guardianProfiles = pgTable(
  "guardian_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    preferredContactMethod: text("preferred_contact_method")
      .notNull()
      .default("app"), // "app" | "sms" | "whatsapp" | "in_person"
    phoneNumber: text("phone_number"),
    languageCode: varchar("language_code", { length: 12 }).notNull().default("en"),
    canReceiveOfflineReports: boolean("can_receive_offline_reports").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdUx: index("guardian_profiles_user_id_idx").on(t.userId),
  })
);

export const studentGuardianLinks = pgTable(
  "student_guardian_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentUserId: uuid("student_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    guardianUserId: uuid("guardian_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    relationship: text("relationship").notNull(), // "parent" | "grandparent" | "uncle_aunt" | "sibling" | "guardian"
    isPrimary: boolean("is_primary").default(false).notNull(),
    canViewProgress: boolean("can_view_progress").default(true).notNull(),
    canCommunicateWithTeacher: boolean("can_communicate_with_teacher").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    studentIdx: index("student_guardian_links_student_idx").on(t.studentUserId),
    guardianIdx: index("student_guardian_links_guardian_idx").on(t.guardianUserId),
  })
);

export const familyProgressReports = pgTable(
  "family_progress_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentUserId: uuid("student_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    guardianUserId: uuid("guardian_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    reportPeriodStart: timestamp("report_period_start", { withTimezone: true }).notNull(),
    reportPeriodEnd: timestamp("report_period_end", { withTimezone: true }).notNull(),
    summary: text("summary").notNull(),
    masteryHighlights: jsonb("mastery_highlights")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    teacherNotes: text("teacher_notes"),
    generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
    deliveredVia: text("delivered_via"), // "app" | "sms" | "printed" | "in_person"
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  },
  (t) => ({
    studentIdx: index("family_progress_reports_student_idx").on(t.studentUserId),
    guardianIdx: index("family_progress_reports_guardian_idx").on(t.guardianUserId),
    generatedAtIdx: index("family_progress_reports_generated_at_idx").on(t.generatedAt),
  })
);

// Relations
export const guardianProfilesRelations = relations(guardianProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [guardianProfiles.userId],
    references: [users.id],
  }),
  studentLinks: many(studentGuardianLinks),
  progressReports: many(familyProgressReports),
}));

export const studentGuardianLinksRelations = relations(studentGuardianLinks, ({ one }) => ({
  student: one(users, {
    fields: [studentGuardianLinks.studentUserId],
    references: [users.id],
  }),
  guardian: one(users, {
    fields: [studentGuardianLinks.guardianUserId],
    references: [users.id],
  }),
}));

export const familyProgressReportsRelations = relations(familyProgressReports, ({ one }) => ({
  student: one(users, {
    fields: [familyProgressReports.studentUserId],
    references: [users.id],
  }),
  guardian: one(users, {
    fields: [familyProgressReports.guardianUserId],
    references: [users.id],
  }),
}));

