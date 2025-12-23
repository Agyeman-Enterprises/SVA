"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Project {
  id: string;
  projectName: string;
  projectCode: string;
  description: string | null;
}

export default function EngineeringSubmissionPage({
  params,
}: {
  params: { projectId: string };
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    documentation: "",
    evidence: {
      photos: [] as string[],
      videos: [] as string[],
      documents: [] as string[],
    },
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/engineering/projects`);
      const data = await res.json();
      const foundProject = data.projects?.find((p: Project) => p.id === params.projectId);
      setProject(foundProject || null);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/engineering/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: params.projectId,
          documentation: formData.documentation,
          submissionEvidence: formData.evidence,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project");
      }

      router.push(`/student/engineering/${params.projectId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleFileUpload(type: "photos" | "videos" | "documents", files: FileList | null) {
    if (!files) return;

    const fileArray = Array.from(files);
    const fileUrls = fileArray.map((file) => {
      // In production, upload to S3/Supabase Storage and return URL
      // For now, create object URL
      return URL.createObjectURL(file);
    });

    setFormData({
      ...formData,
      evidence: {
        ...formData.evidence,
        [type]: [...formData.evidence[type], ...fileUrls],
      },
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-200">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/student/engineering/${params.projectId}`}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to Project
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Submit: {project.projectName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Documentation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Documentation
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Describe your project, what you built, challenges you faced, and what you learned.
          </p>
          <textarea
            value={formData.documentation}
            onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
            rows={12}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your project documentation here..."
          />
        </div>

        {/* Evidence Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Project Evidence
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Upload photos, videos, or documents that demonstrate your completed project.
          </p>

          {/* Photos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Photos
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload("photos", e.target.files)}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
            />
            {formData.evidence.photos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {formData.evidence.photos.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        const newPhotos = formData.evidence.photos.filter((_, i) => i !== idx);
                        setFormData({
                          ...formData,
                          evidence: { ...formData.evidence, photos: newPhotos },
                        });
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Videos
            </label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileUpload("videos", e.target.files)}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
            />
            {formData.evidence.videos.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.evidence.videos.map((url, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Video {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newVideos = formData.evidence.videos.filter((_, i) => i !== idx);
                        setFormData({
                          ...formData,
                          evidence: { ...formData.evidence, videos: newVideos },
                        });
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Documents
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={(e) => handleFileUpload("documents", e.target.files)}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
            />
            {formData.evidence.documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.evidence.documents.map((url, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Document {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newDocs = formData.evidence.documents.filter((_, i) => i !== idx);
                        setFormData({
                          ...formData,
                          evidence: { ...formData.evidence, documents: newDocs },
                        });
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href={`/student/engineering/${params.projectId}`}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

