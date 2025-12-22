"use client";

import { useEffect, useState } from "react";

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
          <h2 className="text-xl font-semibold mb-4">Available Projects</h2>
          <div className="grid gap-4">
            {projects.map((project) => {
              const status = getSubmissionStatus(project.id);
              return (
                <div key={project.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{project.projectName}</h3>
                      <p className="text-sm text-gray-600">{project.projectCode}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded ${
                      status === "approved" ? "bg-green-100 text-green-800" :
                      status === "submitted" ? "bg-blue-100 text-blue-800" :
                      status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {status.replace("_", " ")}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                  )}
                  {project.isCapstone && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                      Capstone Project
                    </span>
                  )}
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      {status === "not_started" ? "Start Project" : "View Submission"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

