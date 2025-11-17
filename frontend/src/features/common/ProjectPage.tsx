import { getProjectDetails } from '@/services/projects'
import ProjectDetailsLayout from '@/shared/components/Project/ProjectDetailsLayout'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!id) return;

    getProjectDetails(id).then((data) => {
      console.log("Project Details:", data);
      setProject(data); // ← Important
    });
  }, [id]);

  return (
    <div className="p-6">
      {/* Show loader until project is fetched */}
      {project ? (
        <ProjectDetailsLayout project={project} role={"manager"} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProjectPage;
