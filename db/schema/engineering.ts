import { pgTable, uuid, text, timestamp, integer, jsonb, boolean, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./people";
import { pods } from "./academic";
import { svaDevices } from "./devices";

/**
 * EPIC 12: Applied Engineering Curriculum
 * Engineering phases (K-2 Explorers, 3-4 Circuit Builders, etc.)
 */
export const engineeringPhases = pgTable("engineering_phases", {
  id: uuid("id").defaultRandom().primaryKey(),
  phaseCode: text("phase_code").notNull().unique(), // 'K2_EXPLORERS', 'G34_CIRCUITS', 'G56_CODE', 'G78_PHONE', 'G910_LAPTOP', 'G1112_MASTER'
  phaseName: text("phase_name").notNull(),
  gradeBandStart: integer("grade_band_start").notNull(), // K=0, G1=1, etc.
  gradeBandEnd: integer("grade_band_end").notNull(),
  description: text("description"),
  capstoneProject: text("capstone_project"), // Description of capstone
  materialsCostUsd: decimal("materials_cost_usd", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 12: Engineering Projects
 * Individual projects within phases (e.g., "Build a flashlight", "Build SVA Phone")
 */
export const engineeringProjects = pgTable("engineering_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  phaseId: uuid("phase_id").references(() => engineeringPhases.id).notNull(),
  projectCode: text("project_code").notNull().unique(), // 'G3_FLASHLIGHT', 'G8_SVA_PHONE', etc.
  projectName: text("project_name").notNull(),
  description: text("description"),
  instructions: jsonb("instructions"), // Step-by-step instructions
  requiredSkills: jsonb("required_skills"), // Array of skill codes
  estimatedHours: integer("estimated_hours"),
  materialsList: jsonb("materials_list"), // [{item: 'LED', quantity: 1, cost: 0.50}]
  assessmentCriteria: jsonb("assessment_criteria"), // Rubric for evaluation
  isCapstone: boolean("is_capstone").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 12: Engineering Skills
 * Skills that students can master (soldering, CAD, etc.)
 */
export const engineeringSkills = pgTable("engineering_skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  skillCode: text("skill_code").notNull().unique(), // 'SOLDERING_THROUGH_HOLE', 'CAD_BASIC', etc.
  skillName: text("skill_name").notNull(),
  category: text("category").notNull(), // 'electronics' | 'mechanical' | 'software' | 'documentation' | 'teaching'
  description: text("description"),
  phaseId: uuid("phase_id").references(() => engineeringPhases.id), // Phase where skill is introduced
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 12: Student Engineering Progression
 * Tracks which phase each student is in
 */
export const studentEngineeringProgression = pgTable("student_engineering_progression", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  phaseId: uuid("phase_id").references(() => engineeringPhases.id).notNull(),
  status: text("status").default("in_progress").notNull(), // 'in_progress' | 'completed' | 'certified'
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  certifiedAt: timestamp("certified_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 12: Project Submissions
 * Student submissions for engineering projects with evidence
 */
export const engineeringProjectSubmissions = pgTable("engineering_project_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  projectId: uuid("project_id").references(() => engineeringProjects.id).notNull(),
  deviceId: uuid("device_id").references(() => svaDevices.id), // If project results in a device
  status: text("status").default("in_progress").notNull(), // 'in_progress' | 'submitted' | 'reviewed' | 'approved' | 'needs_revision'
  submissionEvidence: jsonb("submission_evidence"), // {photos: [], videos: [], documents: [], testResults: {}}
  documentation: text("documentation"), // Written documentation/guide
  mentorId: uuid("mentor_id").references(() => users.id), // Senior student mentor
  mentorNotes: text("mentor_notes"),
  teacherFeedback: text("teacher_feedback"),
  assessmentScore: decimal("assessment_score", { precision: 5, scale: 2 }), // 0-100
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 12: Engineering Mentorship Sessions
 * Tracks mentorship between senior and junior students
 */
export const engineeringMentorshipSessions = pgTable("engineering_mentorship_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  mentorId: uuid("mentor_id").references(() => users.id).notNull(), // Senior student (G9-12)
  menteeId: uuid("mentee_id").references(() => users.id).notNull(), // Junior student (G3-8)
  projectId: uuid("project_id").references(() => engineeringProjects.id), // Project being mentored
  podId: uuid("pod_id").references(() => pods.id), // Pod context
  sessionDate: timestamp("session_date", { withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes"),
  topicsCovered: jsonb("topics_covered"), // Array of topics
  menteeProgress: text("mentee_progress"), // Notes on mentee's progress
  mentorReflection: text("mentor_reflection"), // Mentor's reflection on teaching
  assessment: text("assessment"), // Assessment of mentee's work
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 12: Engineering Skills Mastery
 * Tracks which skills each student has mastered
 */
export const engineeringSkillsMastery = pgTable("engineering_skills_mastery", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  skillId: uuid("skill_id").references(() => engineeringSkills.id).notNull(),
  level: text("level").default("introduced").notNull(), // 'introduced' | 'practicing' | 'proficient' | 'master'
  evidence: jsonb("evidence"), // Projects/submissions demonstrating skill
  certifiedBy: uuid("certified_by").references(() => users.id), // Teacher or senior mentor
  certifiedAt: timestamp("certified_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 12: Engineering Certifications
 * Certificates issued for completed skills/phases (e.g., "SVA Engineering Mentor")
 */
export const engineeringCertifications = pgTable("engineering_certifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  certificationType: text("certification_type").notNull(), // 'skill' | 'phase' | 'mentor' | 'device_build'
  certificationCode: text("certification_code").notNull().unique(), // 'SVA_ENG_MENTOR_2025_001'
  certificationName: text("certification_name").notNull(), // 'SVA Engineering Mentor'
  skillId: uuid("skill_id").references(() => engineeringSkills.id), // If skill-based
  phaseId: uuid("phase_id").references(() => engineeringPhases.id), // If phase-based
  issuedBy: uuid("issued_by").references(() => users.id).notNull(), // Teacher/admin
  issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }), // If applicable
  qrCode: text("qr_code"), // QR code for verification
  verificationUrl: text("verification_url"), // Public verification URL
  metadata: jsonb("metadata"), // Additional certificate data
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * EPIC 12: Device Build Workflow
 * Step-by-step tracking for device builds (phone/laptop)
 */
export const deviceBuildWorkflows = pgTable("device_build_workflows", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  projectId: uuid("project_id").references(() => engineeringProjects.id).notNull(),
  deviceId: uuid("device_id").references(() => svaDevices.id), // Resulting device
  workflowSteps: jsonb("workflow_steps").notNull(), // [{step: 1, name: 'Power on test', status: 'completed', completedAt: '...'}]
  currentStep: integer("current_step").default(1).notNull(),
  componentChecklist: jsonb("component_checklist"), // [{component: 'SC9863A mainboard', received: true, tested: true}]
  testResults: jsonb("test_results"), // {dropTest: {passed: true, notes: '...'}, batteryTest: {...}}
  issues: jsonb("issues"), // [{issue: 'Display not working', resolved: true, resolution: '...'}]
  status: text("status").default("not_started").notNull(), // 'not_started' | 'in_progress' | 'testing' | 'completed' | 'failed'
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const engineeringPhasesRelations = relations(engineeringPhases, ({ many }) => ({
  projects: many(engineeringProjects),
  skills: many(engineeringSkills),
  studentProgressions: many(studentEngineeringProgression),
}));

export const engineeringProjectsRelations = relations(engineeringProjects, ({ one, many }) => ({
  phase: one(engineeringPhases, {
    fields: [engineeringProjects.phaseId],
    references: [engineeringPhases.id],
  }),
  submissions: many(engineeringProjectSubmissions),
  mentorshipSessions: many(engineeringMentorshipSessions),
  buildWorkflows: many(deviceBuildWorkflows),
}));

export const engineeringSkillsRelations = relations(engineeringSkills, ({ one, many }) => ({
  phase: one(engineeringPhases, {
    fields: [engineeringSkills.phaseId],
    references: [engineeringPhases.id],
  }),
  masteryRecords: many(engineeringSkillsMastery),
  certifications: many(engineeringCertifications),
}));

export const studentEngineeringProgressionRelations = relations(studentEngineeringProgression, ({ one }) => ({
  student: one(users, {
    fields: [studentEngineeringProgression.studentId],
    references: [users.id],
  }),
  phase: one(engineeringPhases, {
    fields: [studentEngineeringProgression.phaseId],
    references: [engineeringPhases.id],
  }),
}));

export const engineeringProjectSubmissionsRelations = relations(engineeringProjectSubmissions, ({ one }) => ({
  student: one(users, {
    fields: [engineeringProjectSubmissions.studentId],
    references: [users.id],
  }),
  project: one(engineeringProjects, {
    fields: [engineeringProjectSubmissions.projectId],
    references: [engineeringProjects.id],
  }),
  device: one(svaDevices, {
    fields: [engineeringProjectSubmissions.deviceId],
    references: [svaDevices.id],
  }),
  mentor: one(users, {
    fields: [engineeringProjectSubmissions.mentorId],
    references: [users.id],
  }),
}));

export const engineeringMentorshipSessionsRelations = relations(engineeringMentorshipSessions, ({ one }) => ({
  mentor: one(users, {
    fields: [engineeringMentorshipSessions.mentorId],
    references: [users.id],
  }),
  mentee: one(users, {
    fields: [engineeringMentorshipSessions.menteeId],
    references: [users.id],
  }),
  project: one(engineeringProjects, {
    fields: [engineeringMentorshipSessions.projectId],
    references: [engineeringProjects.id],
  }),
  pod: one(pods, {
    fields: [engineeringMentorshipSessions.podId],
    references: [pods.id],
  }),
}));

export const engineeringSkillsMasteryRelations = relations(engineeringSkillsMastery, ({ one }) => ({
  student: one(users, {
    fields: [engineeringSkillsMastery.studentId],
    references: [users.id],
  }),
  skill: one(engineeringSkills, {
    fields: [engineeringSkillsMastery.skillId],
    references: [engineeringSkills.id],
  }),
  certifiedByUser: one(users, {
    fields: [engineeringSkillsMastery.certifiedBy],
    references: [users.id],
  }),
}));

export const engineeringCertificationsRelations = relations(engineeringCertifications, ({ one }) => ({
  student: one(users, {
    fields: [engineeringCertifications.studentId],
    references: [users.id],
  }),
  skill: one(engineeringSkills, {
    fields: [engineeringCertifications.skillId],
    references: [engineeringSkills.id],
  }),
  phase: one(engineeringPhases, {
    fields: [engineeringCertifications.phaseId],
    references: [engineeringPhases.id],
  }),
  issuedByUser: one(users, {
    fields: [engineeringCertifications.issuedBy],
    references: [users.id],
  }),
}));

export const deviceBuildWorkflowsRelations = relations(deviceBuildWorkflows, ({ one }) => ({
  student: one(users, {
    fields: [deviceBuildWorkflows.studentId],
    references: [users.id],
  }),
  project: one(engineeringProjects, {
    fields: [deviceBuildWorkflows.projectId],
    references: [engineeringProjects.id],
  }),
  device: one(svaDevices, {
    fields: [deviceBuildWorkflows.deviceId],
    references: [svaDevices.id],
  }),
}));

