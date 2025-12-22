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
import { pods } from "./academic";
import { lessons, lessonAssignments, assessments, assessmentItems } from "./curriculum";
import { subjects, gradeBands } from "./academic";
import { submissionStatus, masteryLevel } from "./enums";

// ---------- Submissions & Feedback ----------
export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentUserId: uuid("student_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    podId: uuid("pod_id").notNull().references(() => pods.id, { onDelete: "cascade" }),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    enrollmentUx: uniqueIndex("enrollments_student_pod_ux").on(t.studentUserId, t.podId),
    podIdx: index("enrollments_pod_idx").on(t.podId),
  })
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lessonAssignmentId: uuid("lesson_assignment_id")
      .notNull()
      .references(() => lessonAssignments.id, { onDelete: "cascade" }),
    studentUserId: uuid("student_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: submissionStatus("status").notNull().default("submitted"),
    content: jsonb("content").$type<Record<string, unknown>>().default({}).notNull(), // text/attachments refs
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    studentIdx: index("submissions_student_idx").on(t.studentUserId),
    assignmentIdx: index("submissions_assignment_idx").on(t.lessonAssignmentId),
  })
);

export const submissionFeedback = pgTable(
  "submission_feedback",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    submissionId: uuid("submission_id").notNull().references(() => submissions.id, { onDelete: "cascade" }),
    teacherUserId: uuid("teacher_user_id").references(() => users.id, { onDelete: "set null" }),
    comment: text("comment").notNull(),
    rubricScores: jsonb("rubric_scores").$type<Record<string, number>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    submissionIdx: index("submission_feedback_submission_idx").on(t.submissionId),
  })
);

// ---------- Assessment Attempts ----------
export const assessmentAttempts = pgTable(
  "assessment_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assessmentId: uuid("assessment_id").notNull().references(() => assessments.id, { onDelete: "restrict" }),
    studentUserId: uuid("student_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    score: integer("score"),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
  },
  (t) => ({
    assessmentIdx: index("assessment_attempts_assessment_idx").on(t.assessmentId),
    studentIdx: index("assessment_attempts_student_idx").on(t.studentUserId),
  })
);

export const assessmentItemResponses = pgTable(
  "assessment_item_responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    attemptId: uuid("attempt_id").notNull().references(() => assessmentAttempts.id, { onDelete: "cascade" }),
    assessmentItemId: uuid("assessment_item_id").notNull().references(() => assessmentItems.id, { onDelete: "restrict" }),
    response: jsonb("response").$type<unknown>().notNull(),
    isCorrect: boolean("is_correct"),
    pointsAwarded: integer("points_awarded"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    attemptIdx: index("assessment_item_responses_attempt_idx").on(t.attemptId),
  })
);

// ---------- Mastery & Progress ----------
export const masteryRecords = pgTable(
  "mastery_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentUserId: uuid("student_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id").notNull().references(() => subjects.id, { onDelete: "restrict" }),
    gradeBandId: uuid("grade_band_id").notNull().references(() => gradeBands.id, { onDelete: "restrict" }),
    skillKey: text("skill_key").notNull(), // canonical skill identifier, e.g. "K1.MATH.NUMBERS.1-10"
    level: masteryLevel("level").notNull().default("not_started"),
    evidence: jsonb("evidence").$type<Record<string, unknown>>().default({}).notNull(), // attempt/submission references
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    masteryUx: uniqueIndex("mastery_records_student_skill_ux").on(
      t.studentUserId,
      t.subjectId,
      t.gradeBandId,
      t.skillKey
    ),
    studentIdx: index("mastery_records_student_idx").on(t.studentUserId),
  })
);

export const progressEvents = pgTable(
  "progress_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentUserId: uuid("student_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    podId: uuid("pod_id").notNull().references(() => pods.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
    eventType: text("event_type").notNull(), // "lesson_viewed" | "asset_played" | "submission_created" | etc.
    eventData: jsonb("event_data").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    studentIdx: index("progress_events_student_idx").on(t.studentUserId),
    podIdx: index("progress_events_pod_idx").on(t.podId),
  })
);

// Relations
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentUserId],
    references: [users.id],
  }),
  // pod relation added after pods table is defined
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  lessonAssignment: one(lessonAssignments, {
    fields: [submissions.lessonAssignmentId],
    references: [lessonAssignments.id],
  }),
  student: one(users, {
    fields: [submissions.studentUserId],
    references: [users.id],
  }),
  feedback: many(submissionFeedback),
}));

export const submissionFeedbackRelations = relations(submissionFeedback, ({ one }) => ({
  submission: one(submissions, {
    fields: [submissionFeedback.submissionId],
    references: [submissions.id],
  }),
  teacher: one(users, {
    fields: [submissionFeedback.teacherUserId],
    references: [users.id],
  }),
}));

export const assessmentAttemptsRelations = relations(assessmentAttempts, ({ one, many }) => ({
  student: one(users, {
    fields: [assessmentAttempts.studentUserId],
    references: [users.id],
  }),
  itemResponses: many(assessmentItemResponses),
  // assessment relation added after assessments table is defined
}));

export const assessmentItemResponsesRelations = relations(assessmentItemResponses, ({ one }) => ({
  attempt: one(assessmentAttempts, {
    fields: [assessmentItemResponses.attemptId],
    references: [assessmentAttempts.id],
  }),
  // assessmentItem relation added after assessmentItems table is defined
}));

export const masteryRecordsRelations = relations(masteryRecords, ({ one }) => ({
  student: one(users, {
    fields: [masteryRecords.studentUserId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [masteryRecords.subjectId],
    references: [subjects.id],
  }),
  gradeBand: one(gradeBands, {
    fields: [masteryRecords.gradeBandId],
    references: [gradeBands.id],
  }),
}));

export const progressEventsRelations = relations(progressEvents, ({ one }) => ({
  student: one(users, {
    fields: [progressEvents.studentUserId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [progressEvents.lessonId],
    references: [lessons.id],
  }),
  // pod relation added after pods table is defined
}));
