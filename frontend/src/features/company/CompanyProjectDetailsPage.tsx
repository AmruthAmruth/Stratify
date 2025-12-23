import { getProjectDetails } from '@/services/projects';
import ProjectDetailsLayout from '@/shared/components/Project/ProjectDetailsLayout';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProjectDTO } from '@/shared/components/Project/types';

const CompanyProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProjectData = React.useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await getProjectDetails(id);
            console.log("Project Details:", data);
            setProject(data);
        } catch (error) {
            console.error('Failed to load project:', error);
            setProject(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProjectData();
    }, [id, fetchProjectData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-primary border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2 text-text">Project Not Found</h2>
                    <p className="mb-4 text-muted">The project you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-6 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primaryHover transition-colors"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-bg">
            {/* Back Button */}
            <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg hover:bg-surface transition-colors text-primary"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Projects</span>
            </button>

            {/* Use reusable ProjectDetailsLayout component */}
            <ProjectDetailsLayout
                project={project}
                role="company"
                onRefresh={fetchProjectData}
            />
        </div>
    );
};

export default CompanyProjectDetailsPage;
