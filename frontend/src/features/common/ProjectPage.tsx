import { getProjectDetails } from '@/services/projects'
import ProjectDetailsLayout from '@/shared/components/Project/ProjectDetailsLayout'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingSpinner } from '@/shared/components/Loading';
import { ProjectDTO } from '@/shared/components/Project/types';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDTO | null>(null);

  const fetchProjectData = React.useCallback(async () => {
    if (!id) return;
    const data = await getProjectDetails(id);
    console.log("Project Details:", data);
    setProject(data);
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [id, fetchProjectData]);

  return (
    <div className="p-6">
      {/* Show loader until project is fetched */}
      {project ? (
        <ProjectDetailsLayout
          project={project}
          role={"manager"}
          onRefresh={fetchProjectData}
        />
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner variant="spinner" size="large" text="Loading project..." />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
