import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./people";
import { teacherTier, masteryLevel } from "./enums";

// ---------- Teacher Development ----------
export const teacherProfiles = pgTable(
  "teacher_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    currentTier: teacherTier("current_tier").notNull().default("0"),
    targetTier: teacherTier("target_tier").notNull().default("4"),
    journeyStartDate: timestamp("journey_start_date", { withTimezone: true }).defaultNow().notNull(),
    backgroundNotes: text("background_notes"), // trauma-informed context, kept private
    strengths: jsonb("strengths").$type<string[]>().default([]).notNull(),
    growthAreas: jsonb("growth_areas").$type<string[]>().default([]).notNull(),
    mentorUserId: uuid("mentor_user_id").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdUx: uniqueIndex("teacher_profiles_user_id_ux").on(t.userId),
    mentorIdx: index("teacher_profiles_mentor_idx").on(t.mentorUserId),
  })
);

export const teacherMasteryRecords = pgTable(
  "teacher_mastery_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherProfileId: uuid("teacher_profile_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    competencyKey: text("competency_key").notNull(), // e.g., "T2.CLASSROOM_MGMT.ENGAGEMENT"
    tier: teacherTier("tier").notNull(),
    level: masteryLevel("level").notNull().default("not_started"),
    evidence: jsonb("evidence").$type<Record<string, unknown>>().default({}).notNull(),
    assessedByUserId: uuid("assessed_by_user_id").references(() => users.id, { onDelete: "set null" }),
    assessedAt: timestamp("assessed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    teacherProfileIdx: index("teacher_mastery_records_profile_idx").on(t.teacherProfileId),
    competencyIdx: index("teacher_mastery_records_competency_idx").on(t.competencyKey),
    tierIdx: index("teacher_mastery_records_tier_idx").on(t.tier),
  })
);

export const teacherTrainingCourses = pgTable(
  "teacher_training_courses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    targetTier: teacherTier("target_tier").notNull(), // which tier this prepares for
    prerequisiteTier: teacherTier("prerequisite_tier"), // minimum tier to begin
    competencies: jsonb("competencies").$type<string[]>().default([]).notNull(),
    estimatedHours: integer("estimated_hours"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    targetTierIdx: index("teacher_training_courses_target_tier_idx").on(t.targetTier),
  })
);

export const teacherTrainingEnrollments = pgTable(
  "teacher_training_enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherProfileId: uuid("teacher_profile_id")
      .notNull()
      .references(() => teacherProfiles.id, { onDelete: "cascade" }),
    trainingCourseId: uuid("training_course_id")
      .notNull()
      .references(() => teacherTrainingCourses.id, { onDelete: "restrict" }),
    status: text("status").notNull().default("enrolled"), // "enrolled" | "in_progress" | "completed" | "paused"
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    teacherProfileIdx: index("teacher_training_enrollments_profile_idx").on(t.teacherProfileId),
    trainingCourseIdx: index("teacher_training_enrollments_course_idx").on(t.trainingCourseId),
  })
);

export const mentorshipRelationships = pgTable(
  "mentorship_relationships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mentorUserId: uuid("mentor_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    menteeUserId: uuid("mentee_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    relationshipType: text("relationship_type").notNull(), // "teacher_teacher" | "teacher_student" | "peer"
    status: text("status").notNull().default("active"), // "active" | "paused" | "completed"
    goals: jsonb("goals").$type<string[]>().default([]).notNull(),
    notes: text("notes"),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (t) => ({
    mentorIdx: index("mentorship_relationships_mentor_idx").on(t.mentorUserId),
    menteeIdx: index("mentorship_relationships_mentee_idx").on(t.menteeUserId),
    statusIdx: index("mentorship_relationships_status_idx").on(t.status),
  })
);

// Relations
export const teacherProfilesRelations = relations(teacherProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [teacherProfiles.userId],
    references: [users.id],
  }),
  mentor: one(users, {
    fields: [teacherProfiles.mentorUserId],
    references: [users.id],
  }),
  masteryRecords: many(teacherMasteryRecords),
  trainingEnrollments: many(teacherTrainingEnrollments),
}));

export const teacherMasteryRecordsRelations = relations(teacherMasteryRecords, ({ one }) => ({
  teacherProfile: one(teacherProfiles, {
    fields: [teacherMasteryRecords.teacherProfileId],
    references: [teacherProfiles.id],
  }),
  assessor: one(users, {
    fields: [teacherMasteryRecords.assessedByUserId],
    references: [users.id],
  }),
}));

export const teacherTrainingCoursesRelations = relations(teacherTrainingCourses, ({ many }) => ({
  enrollments: many(teacherTrainingEnrollments),
}));

export const teacherTrainingEnrollmentsRelations = relations(teacherTrainingEnrollments, ({ one }) => ({
  teacherProfile: one(teacherProfiles, {
    fields: [teacherTrainingEnrollments.teacherProfileId],
    references: [teacherProfiles.id],
  }),
  trainingCourse: one(teacherTrainingCourses, {
    fields: [teacherTrainingEnrollments.trainingCourseId],
    references: [teacherTrainingCourses.id],
  }),
}));

export const mentorshipRelationshipsRelations = relations(mentorshipRelationships, ({ one }) => ({
  mentor: one(users, {
    fields: [mentorshipRelationships.mentorUserId],
    references: [users.id],
  }),
  mentee: one(users, {
    fields: [mentorshipRelationships.menteeUserId],
    references: [users.id],
  }),
}));

