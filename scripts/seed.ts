/**
 * Seed script for SVA LMS
 * Creates realistic, non-toy data for development and testing
 * 
 * Run with: npm run db:seed
 */

import { db } from "../db";
import {
  schools,
  campuses,
  pods,
  subjects,
  courses,
  units,
  lessons,
  activities,
  assessments,
  users,
  students,
  teachers,
  guardians,
  studentGuardians,
  inspectors,
  admins,
  enrollments,
  curriculumVersions,
} from "../db/schema";
import { hashPassword } from "../lib/auth";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding SVA LMS database...");

  try {
    // 1. Create School
    const [school] = await db
      .insert(schools)
      .values({
        name: "Scientia Vitae Academy - Main Campus",
        jurisdiction: "Portugal",
        timezone: "Europe/Lisbon",
        academicYearStart: new Date("2024-09-01"),
        academicYearEnd: new Date("2025-06-30"),
      })
      .returning();

    console.log("✅ Created school:", school.name);

    // 2. Create Campus
    const [campus] = await db
      .insert(campuses)
      .values({
        schoolId: school.id,
        name: "Lisbon Main Campus",
        address: "Rua da Educação, 123, Lisbon, Portugal",
        timezone: "Europe/Lisbon",
      })
      .returning();

    console.log("✅ Created campus:", campus.name);

    // 3. Create Subjects
    const subjectData = [
      { name: "Mathematics", code: "MATH", category: "core" as const },
      { name: "Language Arts", code: "LIT", category: "core" as const },
      { name: "Science", code: "SCI", category: "core" as const },
      { name: "Civics", code: "CIV", category: "civics" as const },
      { name: "Leadership", code: "LEAD", category: "leadership" as const },
    ];

    const insertedSubjects = await db.insert(subjects).values(subjectData).returning();
    console.log(`✅ Created ${insertedSubjects.length} subjects`);

    const mathSubject = insertedSubjects.find((s) => s.code === "MATH")!;
    const litSubject = insertedSubjects.find((s) => s.code === "LIT")!;

    // 4. Create Pod
    const [pod] = await db
      .insert(pods)
      .values({
        campusId: campus.id,
        name: "Mixed-Age Pod Alpha",
        instructionalLanguage: "English",
        minGradeBand: "G1",
        maxGradeBand: "G3",
        rotationStartDate: new Date("2024-09-01"),
        rotationEndDate: new Date("2026-08-31"),
      })
      .returning();

    console.log("✅ Created pod:", pod.name);

    // 5. Create Admin User
    const adminPasswordHash = await hashPassword("admin123");
    const [adminUser] = await db
      .insert(users)
      .values({
        email: "admin@sva.edu",
        passwordHash: adminPasswordHash,
        role: "school_admin",
        firstName: "Admin",
        lastName: "User",
        locale: "en-US",
      })
      .returning();

    await db.insert(admins).values({
      id: adminUser.id,
      adminNumber: "ADM-001",
      adminLevel: "school",
      schoolId: school.id,
    });

    console.log("✅ Created admin user:", adminUser.email);

    // 6. Create Teacher User
    const teacherPasswordHash = await hashPassword("teacher123");
    const [teacherUser] = await db
      .insert(users)
      .values({
        email: "teacher@sva.edu",
        passwordHash: teacherPasswordHash,
        role: "teacher",
        firstName: "Maria",
        lastName: "Silva",
        locale: "en-US",
      })
      .returning();

    await db.insert(teachers).values({
      id: teacherUser.id,
      teacherNumber: "TCH-001",
      tier: "tier4",
      hireDate: new Date("2024-01-15"),
      specialization: "Mathematics",
    });

    // Update pod with teacher as lead
    await db.update(pods).set({ podLeadId: teacherUser.id }).where(eq(pods.id, pod.id));

    console.log("✅ Created teacher user:", teacherUser.email);

    // 7. Create Student User
    const studentPasswordHash = await hashPassword("student123");
    const [studentUser] = await db
      .insert(users)
      .values({
        email: "student@sva.edu",
        passwordHash: studentPasswordHash,
        role: "student",
        firstName: "João",
        lastName: "Santos",
        preferredName: "João",
        locale: "en-US",
      })
      .returning();

    const [student] = await db
      .insert(students)
      .values({
        id: studentUser.id,
        studentNumber: "STU-001",
        dateOfBirth: new Date("2015-05-10"),
        enrollmentDate: new Date("2024-09-01"),
        currentPodId: pod.id,
        gradeBand: "G2",
        emergencyContactName: "Ana Santos",
        emergencyContactPhone: "+351912345678",
        emergencyContactRelation: "mother",
      })
      .returning();

    console.log("✅ Created student user:", studentUser.email);

    // 8. Create Guardian
    const guardianPasswordHash = await hashPassword("guardian123");
    const [guardianUser] = await db
      .insert(users)
      .values({
        email: "guardian@sva.edu",
        passwordHash: guardianPasswordHash,
        role: "student", // Guardians use student role for access
        firstName: "Ana",
        lastName: "Santos",
        locale: "en-US",
      })
      .returning();

    const [guardian] = await db
      .insert(guardians)
      .values({
        userId: guardianUser.id,
        firstName: "Ana",
        lastName: "Santos",
        email: "ana.santos@example.com",
        phone: "+351912345678",
        relationship: "mother",
        isPrimary: true,
      })
      .returning();

    await db.insert(studentGuardians).values({
      studentId: student.id,
      guardianId: guardian.id,
      relationship: "mother",
      isPrimary: true,
    });

    console.log("✅ Created guardian:", guardian.email);

    // 9. Create Inspector User
    const inspectorPasswordHash = await hashPassword("inspector123");
    const [inspectorUser] = await db
      .insert(users)
      .values({
        email: "inspector@sva.edu",
        passwordHash: inspectorPasswordHash,
        role: "inspector",
        firstName: "Inspector",
        lastName: "Audit",
        locale: "en-US",
      })
      .returning();

    await db.insert(inspectors).values({
      id: inspectorUser.id,
      inspectorNumber: "INS-001",
      jurisdiction: "Portugal",
    });

    console.log("✅ Created inspector user:", inspectorUser.email);

    // 10. Create Course (Mathematics G2)
    const [course] = await db
      .insert(courses)
      .values({
        subjectId: mathSubject.id,
        name: "Mathematics Grade 2",
        code: "MATH-G2",
        gradeBand: "G2",
        description: "Grade 2 Mathematics curriculum covering number sense, operations, and geometry",
      })
      .returning();

    console.log("✅ Created course:", course.name);

    // 11. Create Curriculum Version
    const [curriculumVersion] = await db
      .insert(curriculumVersions)
      .values({
        version: "1.0.0",
        courseId: course.id,
        status: "approved",
        contentHash: "sha256:abc123def456...", // In production, compute actual hash
        description: "Initial approved version",
        approvedBy: adminUser.id,
        approvedAt: new Date(),
      })
      .returning();

    // Update course with curriculum version
    await db
      .update(courses)
      .set({ curriculumVersionId: curriculumVersion.id })
      .where(eq(courses.id, course.id));

    console.log("✅ Created curriculum version:", curriculumVersion.version);

    // 12. Create Unit
    const [unit] = await db
      .insert(units)
      .values({
        courseId: course.id,
        name: "Addition and Subtraction within 100",
        sequence: 1,
        description: "Students learn to add and subtract numbers within 100",
        learningObjectives: [
          "Add two-digit numbers with regrouping",
          "Subtract two-digit numbers with regrouping",
          "Solve word problems involving addition and subtraction",
        ],
        estimatedDuration: 1200, // 20 hours
      })
      .returning();

    console.log("✅ Created unit:", unit.name);

    // 13. Create Lesson
    const [lesson] = await db
      .insert(lessons)
      .values({
        unitId: unit.id,
        name: "Introduction to Two-Digit Addition",
        sequence: 1,
        description: "First lesson on two-digit addition",
        tier4Content: {
          content: `
            <h2>Two-Digit Addition</h2>
            <p>In this lesson, we explore how to add two-digit numbers. We'll use place value understanding and various strategies.</p>
            <p><strong>Key Concepts:</strong></p>
            <ul>
              <li>Place value (tens and ones)</li>
              <li>Regrouping when sum exceeds 9 in ones place</li>
              <li>Multiple strategies for addition</li>
            </ul>
          `,
          resources: [
            {
              type: "video",
              url: "https://example.com/videos/two-digit-addition",
              title: "Two-Digit Addition Explained",
            },
          ],
          concepts: ["addition-within-100", "place-value", "regrouping"],
        },
        estimatedDuration: 45,
      })
      .returning();

    console.log("✅ Created lesson:", lesson.name);

    // 14. Create Activity
    await db.insert(activities).values({
      lessonId: lesson.id,
      name: "Practice: Adding Two-Digit Numbers",
      sequence: 1,
      type: "practice",
      content: {
        instructions: "Solve the following addition problems using any strategy you prefer.",
        materials: [
          {
            type: "worksheet",
            url: "https://example.com/worksheets/addition-practice",
            title: "Addition Practice Worksheet",
          },
        ],
        scaffolding: {
          tier0: "Follow these steps: 1) Add the ones, 2) If the sum is 10 or more, write the ones digit and carry the ten, 3) Add the tens including any carried ten.",
          tier4: "Explore different strategies for adding two-digit numbers. Consider: place value blocks, number lines, mental math, or written algorithms. Which strategy feels most natural to you?",
        },
      },
      estimatedDuration: 20,
    });

    console.log("✅ Created activity");

    // 15. Create Assessment
    await db.insert(assessments).values({
      lessonId: lesson.id,
      name: "Mastery Check: Two-Digit Addition",
      type: "mastery_check",
      description: "Assess understanding of two-digit addition",
      questions: [
        {
          id: "q1",
          type: "multiple_choice",
          question: "What is 23 + 17?",
          options: ["30", "40", "41", "50"],
          correctAnswer: "40",
          points: 10,
          concepts: ["addition-within-100"],
        },
        {
          id: "q2",
          type: "short_answer",
          question: "Explain your strategy for adding 45 + 28.",
          points: 20,
          concepts: ["addition-within-100", "regrouping"],
        },
      ],
      totalPoints: 30,
      timeLimit: 15,
      concepts: ["addition-within-100", "regrouping"],
    });

    console.log("✅ Created assessment");

    // 16. Create Enrollment
    await db.insert(enrollments).values({
      studentId: student.id,
      courseId: course.id,
      podId: pod.id,
      status: "active",
      enrolledAt: new Date("2024-09-01"),
    });

    console.log("✅ Created enrollment");

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\nTest accounts created:");
    console.log("  Admin:    admin@sva.edu / admin123");
    console.log("  Teacher:  teacher@sva.edu / teacher123");
    console.log("  Student:  student@sva.edu / student123");
    console.log("  Guardian: guardian@sva.edu / guardian123");
    console.log("  Inspector: inspector@sva.edu / inspector123");
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

