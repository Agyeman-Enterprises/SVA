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
import { subjects, gradeBands, pods } from "./academic";
import { users } from "./people";
import { courseVersionStatus, teacherTier, assignmentStatus } from "./enums";

// ---------- Curriculum Authoring ----------
export const courses = pgTable(
  "courses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id").notNull().references(() => subjects.id, { onDelete: "restrict" }),
    gradeBandId: uuid("grade_band_id").notNull().references(() => gradeBands.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    subjGradeIdx: index("courses_subject_grade_idx").on(t.subjectId, t.gradeBandId),
  })
);

export const courseVersions = pgTable(
  "course_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    status: courseVersionStatus("status").notNull().default("draft"),
    isImmutable: boolean("is_immutable").default(false).notNull(), // set true when approved
    authoredByUserId: uuid("authored_by_user_id").references(() => users.id, { onDelete: "set null" }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    courseVersionUx: uniqueIndex("course_versions_course_version_ux").on(t.courseId, t.version),
    statusIdx: index("course_versions_status_idx").on(t.status),
  })
);

export const units = pgTable(
  "units",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseVersionId: uuid("course_version_id")
      .notNull()
      .references(() => courseVersions.id, { onDelete: "cascade" }),
    unitNumber: integer("unit_number").notNull(),
    title: text("title").notNull(),
    overview: text("overview"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    unitUx: uniqueIndex("units_course_version_unit_ux").on(t.courseVersionId, t.unitNumber),
  })
);

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    unitId: uuid("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
    lessonNumber: integer("lesson_number").notNull(),
    title: text("title").notNull(),
    canonicalText: text("canonical_text").notNull(), // Tier-4 canonical authoring
    objectives: jsonb("objectives").$type<string[]>().default([]).notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    estimatedMinutes: integer("estimated_minutes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    lessonUx: uniqueIndex("lessons_unit_lesson_ux").on(t.unitId, t.lessonNumber),
    unitIdx: index("lessons_unit_idx").on(t.unitId),
  })
);

export const lessonAssets = pgTable(
  "lesson_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(), // "audio" | "video" | "pdf" | "image" | "link"
    title: text("title").notNull(),
    uri: text("uri").notNull(), // stored location; S3/Supabase Storage/etc.
    mimeType: text("mime_type"),
    durationSeconds: integer("duration_seconds"),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    lessonIdx: index("lesson_assets_lesson_idx").on(t.lessonId),
  })
);

export const activities = pgTable(
  "activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    activityType: text("activity_type").notNull(), // "worksheet" | "discussion" | "lab" | "project" | etc.
    prompt: text("prompt").notNull(),
    rubric: jsonb("rubric").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    lessonIdx: index("activities_lesson_idx").on(t.lessonId),
  })
);

export const assessments = pgTable(
  "assessments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
    unitId: uuid("unit_id").references(() => units.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    kind: text("kind").notNull(), // "quiz" | "oral" | "practical" | "exam"
    maxScore: integer("max_score").notNull().default(100),
    masteryMap: jsonb("mastery_map").$type<Record<string, string[]>>() // objective -> skills
      .default({})
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    lessonIdx: index("assessments_lesson_idx").on(t.lessonId),
    unitIdx: index("assessments_unit_idx").on(t.unitId),
  })
);

export const assessmentItems = pgTable(
  "assessment_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assessmentId: uuid("assessment_id").notNull().references(() => assessments.id, { onDelete: "cascade" }),
    itemNumber: integer("item_number").notNull(),
    itemType: text("item_type").notNull(), // "mcq" | "short" | "long" | "oral" | "upload"
    prompt: text("prompt").notNull(),
    correctAnswer: jsonb("correct_answer").$type<unknown>(), // optional (MCQ etc.)
    points: integer("points").notNull().default(1),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
  },
  (t) => ({
    itemUx: uniqueIndex("assessment_items_assessment_item_ux").on(t.assessmentId, t.itemNumber),
  })
);

// ---------- Delivery / Assignment ----------
export const podCourseAssignments = pgTable(
  "pod_course_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    podId: uuid("pod_id").notNull().references(() => pods.id, { onDelete: "cascade" }),
    courseVersionId: uuid("course_version_id")
      .notNull()
      .references(() => courseVersions.id, { onDelete: "restrict" }),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    podIdx: index("pod_course_assignments_pod_idx").on(t.podId),
  })
);

export const lessonAssignments = pgTable(
  "lesson_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    podId: uuid("pod_id").notNull().references(() => pods.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "restrict" }),
    assignedByUserId: uuid("assigned_by_user_id").references(() => users.id, { onDelete: "set null" }),
    // Tier-aware scaffolding parameters (delivery layer; canonical content unchanged)
    deliveryTier: teacherTier("delivery_tier").notNull().default("4"),
    scaffoldingConfig: jsonb("scaffolding_config").$type<Record<string, unknown>>().default({}).notNull(),
    status: assignmentStatus("status").notNull().default("assigned"),
    dueAt: timestamp("due_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    podIdx: index("lesson_assignments_pod_idx").on(t.podId),
    lessonIdx: index("lesson_assignments_lesson_idx").on(t.lessonId),
  })
);

// Relations
export const coursesRelations = relations(courses, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [courses.subjectId],
    references: [subjects.id],
  }),
  gradeBand: one(gradeBands, {
    fields: [courses.gradeBandId],
    references: [gradeBands.id],
  }),
  versions: many(courseVersions),
}));

export const courseVersionsRelations = relations(courseVersions, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseVersions.courseId],
    references: [courses.id],
  }),
  author: one(users, {
    fields: [courseVersions.authoredByUserId],
    references: [users.id],
  }),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  courseVersion: one(courseVersions, {
    fields: [units.courseVersionId],
    references: [courseVersions.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  assets: many(lessonAssets),
  activities: many(activities),
  assessments: many(assessments),
}));

export const lessonAssetsRelations = relations(lessonAssets, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonAssets.lessonId],
    references: [lessons.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  lesson: one(lessons, {
    fields: [activities.lessonId],
    references: [lessons.id],
  }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [assessments.lessonId],
    references: [lessons.id],
  }),
  unit: one(units, {
    fields: [assessments.unitId],
    references: [units.id],
  }),
  items: many(assessmentItems),
}));

export const assessmentItemsRelations = relations(assessmentItems, ({ one }) => ({
  assessment: one(assessments, {
    fields: [assessmentItems.assessmentId],
    references: [assessments.id],
  }),
}));

