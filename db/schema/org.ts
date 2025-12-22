import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Org ----------
export const districts = pgTable(
  "districts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    countryCode: varchar("country_code", { length: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    nameIdx: uniqueIndex("districts_name_ux").on(t.name),
  })
);

export const schools = pgTable(
  "schools",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    districtId: uuid("district_id").notNull().references(() => districts.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    timezone: text("timezone").notNull(), // e.g. "Pacific/Guam"
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    districtIdx: index("schools_district_idx").on(t.districtId),
    schoolNameUx: uniqueIndex("schools_district_name_ux").on(t.districtId, t.name),
  })
);

export const campuses = pgTable(
  "campuses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    schoolId: uuid("school_id").notNull().references(() => schools.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    address: text("address"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    schoolIdx: index("campuses_school_idx").on(t.schoolId),
    campusNameUx: uniqueIndex("campuses_school_name_ux").on(t.schoolId, t.name),
  })
);

// Relations
export const districtsRelations = relations(districts, ({ many }) => ({
  schools: many(schools),
}));

export const schoolsRelations = relations(schools, ({ one, many }) => ({
  district: one(districts, {
    fields: [schools.districtId],
    references: [districts.id],
  }),
  campuses: many(campuses),
}));

export const campusesRelations = relations(campuses, ({ one }) => ({
  school: one(schools, {
    fields: [campuses.schoolId],
    references: [schools.id],
  }),
}));

