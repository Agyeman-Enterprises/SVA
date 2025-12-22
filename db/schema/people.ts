import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userGlobalRole, membershipScope, teacherTier } from "./enums";
import { districts, schools, campuses } from "./org";
import { pods } from "./academic";

// ---------- Users & Membership ----------
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    displayName: text("display_name").notNull(),
    passwordHash: text("password_hash").notNull(), // bcrypt hash
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    emailUx: uniqueIndex("users_email_ux").on(t.email),
  })
);

/**
 * SVA uses scoped role membership:
 * a user can be a teacher in one school, inspector in another, etc.
 */
export const userMemberships = pgTable(
  "user_memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: userGlobalRole("role").notNull(),
    scope: membershipScope("scope").notNull(),
    districtId: uuid("district_id").references(() => districts.id, { onDelete: "cascade" }),
    schoolId: uuid("school_id").references(() => schools.id, { onDelete: "cascade" }),
    campusId: uuid("campus_id").references(() => campuses.id, { onDelete: "cascade" }),
    podId: uuid("pod_id").references(() => pods.id, { onDelete: "cascade" }),
    teacherTier: teacherTier("teacher_tier"), // only meaningful when role includes teaching
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("user_memberships_user_idx").on(t.userId),
    scopeIdx: index("user_memberships_scope_idx").on(t.scope),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(userMemberships),
}));

export const userMembershipsRelations = relations(userMemberships, ({ one }) => ({
  user: one(users, {
    fields: [userMemberships.userId],
    references: [users.id],
  }),
  district: one(districts, {
    fields: [userMemberships.districtId],
    references: [districts.id],
  }),
  school: one(schools, {
    fields: [userMemberships.schoolId],
    references: [schools.id],
  }),
  campus: one(campuses, {
    fields: [userMemberships.campusId],
    references: [campuses.id],
  }),
  // pod relation added after pods table is defined
}));
