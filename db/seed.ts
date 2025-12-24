/**
 * Seed script for SVA LMS
 * Creates district-grade test data as specified:
 * - 1 district, 1 school, 1 campus, 3 pods (language-coded)
 * - Grade bands K1-G12
 * - Core subjects
 * - 1 district_admin, 1 school_admin, 1 inspector, 2 teachers (tier 0 + tier 4), 6 students
 * 
 * Run with: npm run db:seed
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import {
  districts,
  schools,
  campuses,
  pods,
  gradeBands,
  subjects,
  courses,
  courseVersions,
  units,
  lessons,
  users,
  userMemberships,
  enrollments,
  podCourseAssignments,
  syncNodes,
  teacherProfiles,
  teacherTrainingCourses,
  guardianProfiles,
  studentGuardianLinks,
  communityEvents,
} from "./schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../lib/auth";

async function seed() {
  console.log("🌱 Seeding SVA LMS database...");

  try {
    // 1. Create District
    const [district] = await db
      .insert(districts)
      .values({
        name: "Scientia Vitae Academy District",
        countryCode: "PT", // Portugal
      })
      .returning();

    console.log("✅ Created district:", district.name);

    // 2. Create School
    const [school] = await db
      .insert(schools)
      .values({
        districtId: district.id,
        name: "SVA Main School",
        timezone: "Europe/Lisbon",
      })
      .returning();

    console.log("✅ Created school:", school.name);

    // 3. Create Campus
    const [campus] = await db
      .insert(campuses)
      .values({
        schoolId: school.id,
        name: "Lisbon Campus",
        address: "Rua da Educação, 123, Lisbon, Portugal",
      })
      .returning();

    console.log("✅ Created campus:", campus.name);

    // 4. Create Grade Bands (K1-G12)
    const gradeBandCodes = [
      "K1", "K2", "K3",
      "G1", "G2", "G3", "G4", "G5", "G6",
      "G7", "G8", "G9", "G10", "G11", "G12",
    ];

    const insertedGradeBands = await db
      .insert(gradeBands)
      .values(
        gradeBandCodes.map((code, idx) => ({
          code,
          sortOrder: idx + 1,
        }))
      )
      .returning();

    console.log(`✅ Created ${insertedGradeBands.length} grade bands`);

    // 5. Create 3 Pods (language-coded)
    const podData = [
      {
        name: "Pod Alpha",
        languageCode: "en",
        rotationStartDate: new Date("2024-09-01"),
        rotationEndDate: new Date("2026-08-31"),
      },
      {
        name: "Pod Beta",
        languageCode: "pt-PT",
        rotationStartDate: new Date("2024-09-01"),
        rotationEndDate: new Date("2026-08-31"),
      },
      {
        name: "Pod Gamma",
        languageCode: "sv",
        rotationStartDate: new Date("2024-09-01"),
        rotationEndDate: new Date("2026-08-31"),
      },
    ];

    const insertedPods = await db
      .insert(pods)
      .values(
        podData.map((pod) => ({
          schoolId: school.id,
          campusId: campus.id,
          ...pod,
        }))
      )
      .returning();

    console.log(`✅ Created ${insertedPods.length} pods`);

    // 6. Create Core Subjects
    const subjectData = [
      { code: "MATH", name: "Mathematics" },
      { code: "ELA", name: "English Language Arts" },
      { code: "SCI", name: "Science" },
      { code: "CIVICS", name: "Civics" },
      { code: "HIST", name: "History" },
    ];

    const insertedSubjects = await db.insert(subjects).values(subjectData).returning();
    console.log(`✅ Created ${insertedSubjects.length} subjects`);

    // 7. Create Users
    const passwordHash = await hashPassword("password123");

    // District Admin
    const [districtAdminUser] = await db
      .insert(users)
      .values({
        email: "district.admin@sva.edu",
        displayName: "District Administrator",
        passwordHash,
      })
      .returning();

    await db.insert(userMemberships).values({
      userId: districtAdminUser.id,
      role: "district_admin",
      scope: "district",
      districtId: district.id,
    });

    console.log("✅ Created district admin");

    // School Admin
    const [schoolAdminUser] = await db
      .insert(users)
      .values({
        email: "school.admin@sva.edu",
        displayName: "School Administrator",
        passwordHash,
      })
      .returning();

    await db.insert(userMemberships).values({
      userId: schoolAdminUser.id,
      role: "school_admin",
      scope: "school",
      schoolId: school.id,
    });

    console.log("✅ Created school admin");

    // Inspector
    const [inspectorUser] = await db
      .insert(users)
      .values({
        email: "inspector@sva.edu",
        displayName: "Inspector",
        passwordHash,
      })
      .returning();

    await db.insert(userMemberships).values({
      userId: inspectorUser.id,
      role: "inspector",
      scope: "district",
      districtId: district.id,
    });

    console.log("✅ Created inspector");

    // Teachers (Tier 0 and Tier 4)
    const [tier0Teacher] = await db
      .insert(users)
      .values({
        email: "teacher.tier0@sva.edu",
        displayName: "Tier 0 Teacher",
        passwordHash,
      })
      .returning();

    await db.insert(userMemberships).values({
      userId: tier0Teacher.id,
      role: "teacher",
      scope: "pod",
      podId: insertedPods[0].id,
      teacherTier: "0",
    });

    const [tier4Teacher] = await db
      .insert(users)
      .values({
        email: "teacher.tier4@sva.edu",
        displayName: "Tier 4 Teacher",
        passwordHash,
      })
      .returning();

    await db.insert(userMemberships).values({
      userId: tier4Teacher.id,
      role: "teacher",
      scope: "pod",
      podId: insertedPods[0].id,
      teacherTier: "4",
    });

    console.log("✅ Created 2 teachers (tier 0 and tier 4)");

    // 6 Students
    const studentEmails = [
      "student1@sva.edu",
      "student2@sva.edu",
      "student3@sva.edu",
      "student4@sva.edu",
      "student5@sva.edu",
      "student6@sva.edu",
    ];

    const studentUsers = await db
      .insert(users)
      .values(
        studentEmails.map((email, idx) => ({
          email,
          displayName: `Student ${idx + 1}`,
          passwordHash,
        }))
      )
      .returning();

    // Assign students to pods (2 per pod)
    for (let i = 0; i < studentUsers.length; i++) {
      const pod = insertedPods[i % insertedPods.length];
      await db.insert(userMemberships).values({
        userId: studentUsers[i].id,
        role: "student",
        scope: "pod",
        podId: pod.id,
      });

      // Create enrollment
      await db.insert(enrollments).values({
        studentUserId: studentUsers[i].id,
        podId: pod.id,
        active: true,
      });
    }

    console.log("✅ Created 6 students with enrollments");

    // 8. Create a sample course with version
    const mathSubject = insertedSubjects.find((s: { code: string }) => s.code === "MATH")!;
    const g1GradeBand = insertedGradeBands.find((gb: { code: string }) => gb.code === "G1")!;

    const [course] = await db
      .insert(courses)
      .values({
        subjectId: mathSubject.id,
        gradeBandId: g1GradeBand.id,
        title: "Mathematics Grade 1",
        description: "Introduction to numbers, operations, and basic geometry",
      })
      .returning();

    const [courseVersion] = await db
      .insert(courseVersions)
      .values({
        courseId: course.id,
        version: 1,
        status: "approved",
        isImmutable: true,
        authoredByUserId: districtAdminUser.id,
        notes: "Initial approved version",
      })
      .returning();

    console.log("✅ Created course with approved version");

    // 9. Assign course version to first pod
    await db.insert(podCourseAssignments).values({
      podId: insertedPods[0].id,
      courseVersionId: courseVersion.id,
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-06-30"),
    });

    console.log("✅ Assigned course version to pod");

    // 10. Create sample unit and lesson
    const [unit] = await db
      .insert(units)
      .values({
        courseVersionId: courseVersion.id,
        unitNumber: 1,
        title: "Numbers 1-20",
        overview: "Students learn to count, read, and write numbers 1-20",
      })
      .returning();

    const [lesson] = await db
      .insert(lessons)
      .values({
        unitId: unit.id,
        lessonNumber: 1,
        title: "Counting to 10",
        canonicalText: `
          <h2>Counting to 10</h2>
          <p>In this lesson, we explore the numbers 1 through 10. We'll learn to count objects, recognize numerals, and understand quantity.</p>
          <p><strong>Key Concepts:</strong></p>
          <ul>
            <li>Number recognition (1-10)</li>
            <li>One-to-one correspondence</li>
            <li>Quantity understanding</li>
          </ul>
        `,
        objectives: ["Recognize numbers 1-10", "Count objects accurately", "Understand quantity"],
        tags: ["counting", "numbers", "foundation"],
        estimatedMinutes: 45,
      })
      .returning();

    console.log("✅ Created sample unit and lesson");

    // 11. Create Sync Node (Learning Center)
    const [syncNode] = await db
      .insert(syncNodes)
      .values({
        nodeType: "learning_center",
        schoolId: school.id,
        name: "Takoradi Learning Center",
        location: {
          lat: 4.8845,
          lng: -1.7554,
          address: "Takoradi, Ghana",
        },
        syncStatus: "synced",
        localDbVersion: 1,
        lastSyncAt: new Date(),
      })
      .returning();

    console.log("✅ Created sync node (learning center)");

    // 12. Create Teacher Profiles
    const [tier0Profile] = await db
      .insert(teacherProfiles)
      .values({
        userId: tier0Teacher.id,
        currentTier: "0",
        targetTier: "4",
        strengths: ["relationship-building", "consistency"],
        growthAreas: ["pedagogical depth", "assessment"],
      })
      .returning();

    const [tier4Profile] = await db
      .insert(teacherProfiles)
      .values({
        userId: tier4Teacher.id,
        currentTier: "4",
        targetTier: "4",
        strengths: ["inquiry-based instruction", "curriculum design", "mentoring"],
        growthAreas: [],
        mentorUserId: tier4Teacher.id, // Self-mentor (T4)
      })
      .returning();

    // Set tier4 teacher as mentor for tier0 teacher
    await db
      .update(teacherProfiles)
      .set({ mentorUserId: tier4Teacher.id })
      .where(eq(teacherProfiles.id, tier0Profile.id));

    console.log("✅ Created teacher profiles with mentorship");

    // 13. Create Teacher Training Course
    const [trainingCourse] = await db
      .insert(teacherTrainingCourses)
      .values({
        title: "T0 to T1: Building Pedagogical Foundations",
        description: "Essential skills for moving from scripted to adaptive instruction",
        targetTier: "1",
        prerequisiteTier: "0",
        competencies: [
          "T1.CLASSROOM_MGMT.BASICS",
          "T1.INSTRUCTION.PACING",
          "T1.ASSESSMENT.FORMATIVE",
        ],
        estimatedHours: 40,
      })
      .returning();

    console.log("✅ Created teacher training course");

    // 14. Create Guardian Profiles
    const guardianUsers = await db
      .insert(users)
      .values(
        studentUsers.slice(0, 3).map((_student: typeof studentUsers[0], idx: number) => ({
          email: `guardian${idx + 1}@sva.edu`,
          displayName: `Guardian ${idx + 1}`,
          passwordHash,
        }))
      )
      .returning();

    for (let idx = 0; idx < guardianUsers.length; idx++) {
      await db.insert(guardianProfiles).values({
        userId: guardianUsers[idx].id,
        preferredContactMethod: idx % 2 === 0 ? "app" : "whatsapp",
        phoneNumber: `+233${500000000 + idx}`,
        languageCode: "en",
      });
    }

    // Link guardians to students
    for (let i = 0; i < Math.min(guardianUsers.length, studentUsers.length); i++) {
      await db.insert(studentGuardianLinks).values({
        studentUserId: studentUsers[i].id,
        guardianUserId: guardianUsers[i].id,
        relationship: "parent",
        isPrimary: true,
        canViewProgress: true,
        canCommunicateWithTeacher: true,
      });
    }

    console.log("✅ Created guardian profiles and links");

    // 15. Create Community Event
    await db.insert(communityEvents).values({
      schoolId: school.id,
      podId: insertedPods[0].id,
      eventType: "showcase",
      title: "Pod Alpha Learning Showcase",
      description: "Students present their work to families and community",
      scheduledAt: new Date("2024-12-15T14:00:00Z"),
      location: "Takoradi Learning Center",
      createdByUserId: tier4Teacher.id,
    });

    console.log("✅ Created community event");

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\nTest accounts (all passwords: password123):");
    console.log("  District Admin: district.admin@sva.edu");
    console.log("  School Admin:  school.admin@sva.edu");
    console.log("  Inspector:     inspector@sva.edu");
    console.log("  Teacher Tier0: teacher.tier0@sva.edu");
    console.log("  Teacher Tier4: teacher.tier4@sva.edu");
    console.log("  Students:      student1@sva.edu through student6@sva.edu");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    console.log("✅ Seed script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });

