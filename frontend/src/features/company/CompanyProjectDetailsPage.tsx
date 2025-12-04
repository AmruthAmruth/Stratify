import { getProjectDetails } from '@/services/projects';
import ProjectDetailsLayout from '@/shared/components/Project/ProjectDetailsLayout';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CompanyProjectDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProjectData = async () => {
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
    };

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fbfbfb' }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-[#009063] border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <p style={{ color: '#6b6b6b' }}>Loading project details...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fbfbfb' }}>
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2" style={{ color: '#3b3b3b' }}>Project Not Found</h2>
                    <p className="mb-4" style={{ color: '#6b6b6b' }}>The project you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-6 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: '#009063', color: 'white' }}
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: '#fbfbfb' }}>
            {/* Back Button */}
            <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg hover:bg-white transition-colors"
                style={{ color: '#009063' }}
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
