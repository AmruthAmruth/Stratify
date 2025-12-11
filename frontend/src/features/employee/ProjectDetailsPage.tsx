import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectDetails } from "@/services/projects";
import ProjectDetailsLayout from "@/shared/components/Project/ProjectDetailsLayout";
import { LoadingSpinner } from "@/shared/components/Loading";

const EmployeeProjectDetailsPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      console.log("Fetching project details for ID:", id);
      const data = await getProjectDetails(id);
      console.log("Project data received:", data);
      setProject(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError(err?.message || "Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner variant="spinner" size="large" />
          <p className="mt-4 text-lg text-[#3b3b3b]">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">
              {error || "Failed to load project details"}
            </span>
          </div>
          <button
            onClick={fetchProjectData}
            className="mt-4 bg-[#009063] hover:bg-[#007a52] text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <ProjectDetailsLayout
        project={project}
        role="employee"
        onRefresh={fetchProjectData}
      />
    </div>
  );
};

export default EmployeeProjectDetailsPage;