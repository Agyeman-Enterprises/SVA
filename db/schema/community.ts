import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schools } from "./org";
import { pods } from "./academic";
import { users } from "./people";

// ---------- Village/Community Structure ----------
export const communityEvents = pgTable(
  "community_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    schoolId: uuid("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
    podId: uuid("pod_id").references(() => pods.id, { onDelete: "set null" }), // null = school-wide
    eventType: text("event_type").notNull(), // "celebration" | "showcase" | "family_day" | "graduation" | "community_service"
    title: text("title").notNull(),
    description: text("description"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    location: text("location"),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    schoolIdx: index("community_events_school_idx").on(t.schoolId),
    podIdx: index("community_events_pod_idx").on(t.podId),
    scheduledAtIdx: index("community_events_scheduled_at_idx").on(t.scheduledAt),
    eventTypeIdx: index("community_events_event_type_idx").on(t.eventType),
  })
);

export const alumniConnections = pgTable(
  "alumni_connections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    graduatedFromSchoolId: uuid("graduated_from_school_id").references(() => schools.id, { onDelete: "set null" }),
    graduationYear: integer("graduation_year"),
    currentStatus: text("current_status"), // "further_education" | "employed" | "entrepreneur" | "mentor"
    willingToMentor: boolean("willing_to_mentor").default(false).notNull(),
    successStory: text("success_story"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdIdx: index("alumni_connections_user_idx").on(t.userId),
    schoolIdx: index("alumni_connections_school_idx").on(t.graduatedFromSchoolId),
  })
);

// Relations
export const communityEventsRelations = relations(communityEvents, ({ one }) => ({
  school: one(schools, {
    fields: [communityEvents.schoolId],
    references: [schools.id],
  }),
  pod: one(pods, {
    fields: [communityEvents.podId],
    references: [pods.id],
  }),
  creator: one(users, {
    fields: [communityEvents.createdByUserId],
    references: [users.id],
  }),
}));

export const alumniConnectionsRelations = relations(alumniConnections, ({ one }) => ({
  user: one(users, {
    fields: [alumniConnections.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [alumniConnections.graduatedFromSchoolId],
    references: [schools.id],
  }),
}));

