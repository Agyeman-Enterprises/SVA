/**
 * CRITICAL VALIDATION SCRIPT
 * 
 * Tests the master query and all acceptance criteria:
 * - Students exist
 * - Pods exist
 * - Course versions exist
 * - Pod → course version assignment resolves
 * - Master query: "Which lessons does Student X see today, and why?"
 * 
 * Run with: npm run validate
 */

import { db } from "../db";
import {
  users,
  userMemberships,
  pods,
  courses,
  courseVersions,
  units,
  lessons,
  podCourseAssignments,
  lessonAssignments,
  subjects,
  gradeBands,
} from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

interface ValidationResult {
  test: string;
  passed: boolean;
  message: string;
  data?: any;
}

async function validate() {
  console.log("🔍 SVA LMS VALIDATION - Testing Critical Requirements\n");
  console.log("=" .repeat(60));

  const results: ValidationResult[] = [];

  try {
    // TEST 1: Students exist
    console.log("\n📋 TEST 1: Students exist");
    const students = await db
      .select({
        user: users,
        membership: userMemberships,
      })
      .from(users)
      .innerJoin(userMemberships, eq(users.id, userMemberships.userId))
      .where(eq(userMemberships.role, "student"))
      .limit(10);

    const test1 = students.length > 0;
    results.push({
      test: "Students exist",
      passed: test1,
      message: test1
        ? `✅ Found ${students.length} student(s)`
        : "❌ No students found",
      data: students.map((s) => ({
        id: s.user.id,
        email: s.user.email,
        displayName: s.user.displayName,
        podId: s.membership.podId,
      })),
    });
    console.log(results[results.length - 1].message);

    if (!test1) {
      console.log("\n⚠️  Cannot proceed without students. Run seed script first.");
      return results;
    }

    // TEST 2: Pods exist
    console.log("\n📋 TEST 2: Pods exist");
    const allPods = await db.select().from(pods).limit(10);
    const test2 = allPods.length > 0;
    results.push({
      test: "Pods exist",
      passed: test2,
      message: test2
        ? `✅ Found ${allPods.length} pod(s)`
        : "❌ No pods found",
      data: allPods.map((p) => ({
        id: p.id,
        name: p.name,
        languageCode: p.languageCode,
        schoolId: p.schoolId,
      })),
    });
    console.log(results[results.length - 1].message);

    // TEST 3: Course versions exist
    console.log("\n📋 TEST 3: Course versions exist");
    const versions = await db
      .select({
        version: courseVersions,
        course: courses,
        subject: subjects,
      })
      .from(courseVersions)
      .innerJoin(courses, eq(courseVersions.courseId, courses.id))
      .innerJoin(subjects, eq(courses.subjectId, subjects.id))
      .limit(10);

    const test3 = versions.length > 0;
    results.push({
      test: "Course versions exist",
      passed: test3,
      message: test3
        ? `✅ Found ${versions.length} course version(s)`
        : "❌ No course versions found",
      data: versions.map((v) => ({
        versionId: v.version.id,
        version: v.version.version,
        status: v.version.status,
        courseTitle: v.course.title,
        subject: v.subject.name,
      })),
    });
    console.log(results[results.length - 1].message);

    // TEST 4: Pod → course version assignment resolves
    console.log("\n📋 TEST 4: Pod → course version assignment resolves");
    const assignments = await db
      .select({
        assignment: podCourseAssignments,
        pod: pods,
        version: courseVersions,
        course: courses,
      })
      .from(podCourseAssignments)
      .innerJoin(pods, eq(podCourseAssignments.podId, pods.id))
      .innerJoin(courseVersions, eq(podCourseAssignments.courseVersionId, courseVersions.id))
      .innerJoin(courses, eq(courseVersions.courseId, courses.id))
      .limit(10);

    const test4 = assignments.length > 0;
    results.push({
      test: "Pod → course version assignment resolves",
      passed: test4,
      message: test4
        ? `✅ Found ${assignments.length} pod-course assignment(s)`
        : "❌ No pod-course assignments found",
      data: assignments.map((a) => ({
        podName: a.pod.name,
        courseTitle: a.course.title,
        version: a.version.version,
        status: a.version.status,
      })),
    });
    console.log(results[results.length - 1].message);

    // TEST 5: MASTER QUERY - "Which lessons does Student X see today, and why?"
    console.log("\n📋 TEST 5: MASTER QUERY");
    console.log("Query: 'Which lessons does Student X see today, and why?'");

    if (students.length === 0) {
      results.push({
        test: "Master Query",
        passed: false,
        message: "❌ Cannot test master query - no students found",
      });
      console.log(results[results.length - 1].message);
    } else {
      const testStudent = students[0];
      const studentId = testStudent.user.id;
      const studentPodId = testStudent.membership.podId;

      if (!studentPodId) {
        results.push({
          test: "Master Query",
          passed: false,
          message: `❌ Student ${testStudent.user.email} is not in a pod`,
        });
        console.log(results[results.length - 1].message);
      } else {
        // THE MASTER QUERY
        const masterQuery = await db
          .select({
            lessonId: lessons.id,
            lessonTitle: lessons.title,
            lessonNumber: lessons.lessonNumber,
            unitTitle: units.title,
            unitNumber: units.unitNumber,
            courseTitle: courses.title,
            courseVersion: courseVersions.version,
            courseVersionStatus: courseVersions.status,
            subjectName: subjects.name,
            gradeBandCode: gradeBands.code,
            podName: pods.name,
            podLanguage: pods.languageCode,
            assignmentDate: podCourseAssignments.assignedAt,
            why: sql<string>`CONCAT(
              'Student is in pod ', ${pods.name}, 
              ' (', ${pods.languageCode}, '), ',
              'which is assigned course version ', ${courseVersions.version}, 
              ' (', ${courseVersions.status}, ') of ', ${courses.title}, 
              ' (', ${subjects.name}, ', ', ${gradeBands.code}, ')'
            )`,
          })
          .from(lessons)
          .innerJoin(units, eq(lessons.unitId, units.id))
          .innerJoin(courseVersions, eq(units.courseVersionId, courseVersions.id))
          .innerJoin(courses, eq(courseVersions.courseId, courses.id))
          .innerJoin(subjects, eq(courses.subjectId, subjects.id))
          .innerJoin(gradeBands, eq(courses.gradeBandId, gradeBands.id))
          .innerJoin(podCourseAssignments, eq(podCourseAssignments.courseVersionId, courseVersions.id))
          .innerJoin(pods, eq(podCourseAssignments.podId, pods.id))
          .where(eq(pods.id, studentPodId))
          .orderBy(units.unitNumber, lessons.lessonNumber)
          .limit(20);

        const test5 = masterQuery.length > 0;
        results.push({
          test: "Master Query",
          passed: test5,
          message: test5
            ? `✅ Student ${testStudent.user.email} sees ${masterQuery.length} lesson(s)`
            : `❌ Student ${testStudent.user.email} sees no lessons`,
          data: {
            student: {
              id: studentId,
              email: testStudent.user.email,
              displayName: testStudent.user.displayName,
            },
            pod: {
              id: studentPodId,
              name: masterQuery[0]?.podName,
              language: masterQuery[0]?.podLanguage,
            },
            lessons: masterQuery.map((l) => ({
              lesson: l.lessonTitle,
              unit: l.unitTitle,
              course: l.courseTitle,
              version: l.courseVersion,
              why: l.why,
            })),
          },
        });
        console.log(results[results.length - 1].message);
        if (test5 && masterQuery.length > 0) {
          console.log("\n📚 Sample lesson access:");
          console.log(`   Lesson: ${masterQuery[0].lessonTitle}`);
          console.log(`   Why: ${masterQuery[0].why}`);
        }
      }
    }

    // SUMMARY
    console.log("\n" + "=".repeat(60));
    console.log("📊 VALIDATION SUMMARY");
    console.log("=".repeat(60));

    const passed = results.filter((r) => r.passed).length;
    const total = results.length;

    results.forEach((result) => {
      const icon = result.passed ? "✅" : "❌";
      console.log(`${icon} ${result.test}: ${result.message}`);
    });

    console.log("\n" + "=".repeat(60));
    console.log(`Results: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log("🎉 ALL VALIDATION TESTS PASSED!");
      console.log("\n✅ System is ready for:");
      console.log("   - RBAC enforcement");
      console.log("   - Curriculum delivery");
      console.log("   - Student submission loop");
      console.log("   - Inspector view");
    } else {
      console.log("⚠️  SOME TESTS FAILED - Fix issues before proceeding");
      console.log("\n💡 Next steps:");
      if (!results[0].passed) {
        console.log("   1. Run seed script: npm run db:seed");
      }
      if (!results[3].passed) {
        console.log("   2. Ensure pod-course assignments exist in seed data");
      }
    }

    return results;
  } catch (error) {
    console.error("\n❌ VALIDATION ERROR:", error);
    throw error;
  }
}

// Run validation
validate()
  .then(() => {
    console.log("\n✅ Validation complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Validation failed:", error);
    process.exit(1);
  });

