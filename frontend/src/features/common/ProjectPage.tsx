import { getProjectDetails } from '@/services/projects'
import ProjectDetailsLayout from '@/shared/components/Project/ProjectDetailsLayout'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  const fetchProjectData = async () => {
    if (!id) return;
    const data = await getProjectDetails(id);
    console.log("Project Details:", data);
    setProject(data);
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

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
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProjectPage;
