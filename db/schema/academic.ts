import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools, campuses } from "./org";
import { teacherTier, courseVersionStatus, assignmentStatus } from "./enums";

// ---------- Pods & Academics ----------
export const gradeBands = pgTable(
  "grade_bands",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(), // e.g. "K1", "K2", "K3", "G1"..."G12"
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    codeUx: uniqueIndex("grade_bands_code_ux").on(t.code),
  })
);

export const pods = pgTable(
  "pods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    schoolId: uuid("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
    campusId: uuid("campus_id").references(() => campuses.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    languageCode: varchar("language_code", { length: 12 }).notNull(), // "en", "pt-PT", "sv", etc.
    rotationStartDate: timestamp("rotation_start_date", { withTimezone: true }).notNull(),
    rotationEndDate: timestamp("rotation_end_date", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    schoolIdx: index("pods_school_idx").on(t.schoolId),
    podNameUx: uniqueIndex("pods_school_name_ux").on(t.schoolId, t.name),
    langIdx: index("pods_language_idx").on(t.languageCode),
  })
);

export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(), // "MATH", "SCI", "ELA", "CIVICS" etc.
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    codeUx: uniqueIndex("subjects_code_ux").on(t.code),
  })
);

// Relations
export const podsRelations = relations(pods, ({ one }) => ({
  school: one(schools, {
    fields: [pods.schoolId],
    references: [schools.id],
  }),
  campus: one(campuses, {
    fields: [pods.campusId],
    references: [campuses.id],
  }),
}));
