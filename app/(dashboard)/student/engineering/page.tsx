"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  description: string | null;
  isCapstone: boolean;
}

interface Submission {
  id: string;
  projectId: string;
  status: string;
  submittedAt: string | null;
}

/**
 * EPIC 12: Engineering Dashboard (Student View)
 * Shows student's engineering progression, projects, and submissions
 */
export default function EngineeringDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch all projects
      const projectsRes = await fetch("/api/engineering/projects");
      const projectsData = await projectsRes.json();
      setProjects(projectsData.projects || []);

      // Fetch student's submissions (would need studentId from auth)
      const submissionsRes = await fetch("/api/engineering/submissions?studentId=current");
      const submissionsData = await submissionsRes.json();
      setSubmissions(submissionsData.submissions || []);
    } catch (error) {
      console.error("Failed to fetch engineering data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading engineering dashboard...</div>;
  }

  const getSubmissionStatus = (projectId: string) => {
    const submission = submissions.find((s) => s.projectId === projectId);
    return submission ? submission.status : "not_started";
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Engineering Curriculum</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Engineering Journey</h2>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-700">
            Build your own devices. Learn by making. Teach others.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Available Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const status = getSubmissionStatus(project.id);
              return (
                <Link
                  key={project.id}
                  href={`/student/engineering/${project.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {project.projectName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.projectCode}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : status === "submitted"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    {project.isCapstone && (
                      <span className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full font-medium">
                        ⭐ Capstone
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      View Details
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


