import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, Users, Target, Clock, CheckCircle,
    AlertCircle, BarChart3, FolderKanban, User, Building2,
    TrendingUp, Activity
} from 'lucide-react';
import { getProjectDetails } from '@/services/projects';

interface ProjectDetails {
    id: string;
    name: string;  // Backend uses 'name' not 'projectName'
    key: string;   // Backend uses 'key' not 'projectKey'
    description: string;
    status: string;
    startDate: Date | string;
    endDate: Date | string;
    departmentId: string;
    projectLeadId: string;
    companyId: string;
    backlog: Array<{
        id: string;
        heading: string;
        description: string;
        type: string;
        status: string;
        priority: string;
        assignedTo?: string | null;
    }>;
    activeSprints: Array<{
        id: string;
        name: string;
        goal: string;
        status: string;
        startDate: Date | string;
        endDate: Date | string;
        issues: Array<{
            id: string;
            heading: string;
            type: string;
            status: string;
            priority: string;
            assignedTo?: string | null;
        }>;
    }>;
    plannedSprints: Array<any>;
    completedSprints: Array<any>;
    assignedEmployee: Array<{  // Backend uses 'assignedEmployee' not 'teamMembers'
        id: string;
        name: string;
        position: string;
    }>;
    activeSprintCount: number;
    plannedSprintCount: number;
    completedSprintCount: number;
}

export default function CompanyProjectDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'sprints' | 'team'>('overview');

    useEffect(() => {
        if (id) {
            setLoading(true);
            getProjectDetails(id)
                .then((data: any) => {
                    console.log('API Response:', data);
                    // Backend returns the project details directly, not wrapped in a 'project' property
                    setProject(data);
                })
                .catch((error) => {
                    console.error('Failed to load project:', error);
                    setProject(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
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
                    <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#d97706' }} />
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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'on-track':
            case 'done':
                return { text: '#046c47', bg: 'rgba(0,144,99,0.06)', border: 'rgba(0,144,99,0.12)' };
            case 'planned':
            case 'to do':
                return { text: '#134e8a', bg: 'rgba(13,90,165,0.06)', border: 'rgba(13,90,165,0.12)' };
            case 'in progress':
                return { text: '#b45309', bg: 'rgba(190,110,0,0.06)', border: 'rgba(190,110,0,0.12)' };
            case 'blocked':
            case 'at-risk':
                return { text: '#dc2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.12)' };
            case 'completed':
                return { text: '#059669', bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.12)' };
            default:
                return { text: '#3b3b3b', bg: 'rgba(59,59,59,0.03)', border: 'rgba(59,59,59,0.06)' };
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return { text: '#dc2626', bg: 'rgba(220,38,38,0.06)' };
            case 'medium':
                return { text: '#d97706', bg: 'rgba(217,119,6,0.06)' };
            case 'low':
                return { text: '#059669', bg: 'rgba(5,150,105,0.06)' };
            default:
                return { text: '#6b6b6b', bg: 'rgba(107,107,107,0.06)' };
        }
    };

    const statusStyle = getStatusColor(project.status);
    const allSprints = [...(project.activeSprints || []), ...(project.plannedSprints || []), ...(project.completedSprints || [])];
    const completedSprints = project.completedSprints?.length || 0;
    const totalSprints = allSprints.length;
    const sprintProgress = totalSprints > 0 ? (completedSprints / totalSprints) * 100 : 0;

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: '#fbfbfb', color: '#3b3b3b' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg hover:bg-white transition-colors"
                        style={{ color: '#009063' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Back to Projects</span>
                    </button>

                    <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'rgba(223,220,239,0.7)' }}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold">{project.name}</h1>
                                    <span
                                        className="px-3 py-1 rounded-lg text-xs font-medium border"
                                        style={{
                                            color: statusStyle.text,
                                            backgroundColor: statusStyle.bg,
                                            borderColor: statusStyle.border
                                        }}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-sm mb-3" style={{ color: '#6b6b6b' }}>{project.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4" style={{ color: '#6b6b6b' }} />
                                        <span style={{ color: '#6b6b6b' }}>Department ID:</span>
                                        <span className="font-medium">{project.departmentId}</span>
                                    </div>
                                    <span className="text-slate-300">•</span>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" style={{ color: '#6b6b6b' }} />
                                        <span style={{ color: '#6b6b6b' }}>Lead ID:</span>
                                        <span className="font-medium">{project.projectLeadId}</span>
                                    </div>
                                    <span className="text-slate-300">•</span>
                                    <div className="flex items-center gap-2">
                                        <FolderKanban className="w-4 h-4" style={{ color: '#6b6b6b' }} />
                                        <span className="font-medium">{project.key}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t" style={{ borderColor: 'rgba(223,220,239,0.5)' }}>
                            <StatCard
                                icon={<Calendar className="w-5 h-5" />}
                                label="Start Date"
                                value={new Date(project.startDate).toLocaleDateString()}
                            />
                            <StatCard
                                icon={<Clock className="w-5 h-5" />}
                                label="End Date"
                                value={new Date(project.endDate).toLocaleDateString()}
                            />
                            <StatCard
                                icon={<Users className="w-5 h-5" />}
                                label="Team Size"
                                value={project.assignedEmployee?.length || 0}
                            />
                            <StatCard
                                icon={<Activity className="w-5 h-5" />}
                                label="Sprint Progress"
                                value={`${Math.round(sprintProgress)}%`}
                                highlight={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['overview', 'sprints', 'team'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab ? 'shadow-sm' : ''
                                }`}
                            style={{
                                backgroundColor: activeTab === tab ? 'white' : 'transparent',
                                color: activeTab === tab ? '#009063' : '#6b6b6b',
                                borderBottom: activeTab === tab ? '2px solid #009063' : 'none'
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-3 gap-6">
                        {/* Sprint Progress */}
                        <div className="col-span-2 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'rgba(223,220,239,0.7)' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" style={{ color: '#009063' }} />
                                    Sprint Progress
                                </h2>
                                <span className="text-sm font-medium" style={{ color: '#6b6b6b' }}>
                                    {completedSprints} of {totalSprints} completed
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span style={{ color: '#6b6b6b' }}>Overall Progress</span>
                                    <span className="font-medium">{Math.round(sprintProgress)}%</span>
                                </div>
                                <div className="w-full bg-[rgba(59,59,59,0.03)] rounded-full h-3">
                                    <div
                                        className="h-3 rounded-full transition-all"
                                        style={{
                                            width: `${sprintProgress}%`,
                                            background: 'linear-gradient(90deg, #009063, #046c47)'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Recent Sprints */}
                            <div className="space-y-3 mt-6">
                                <h3 className="font-medium text-sm" style={{ color: '#6b6b6b' }}>Recent Sprints</h3>
                                {allSprints.slice(0, 3).map((sprint) => {
                                    const sprintStatus = getStatusColor(sprint.status);
                                    return (
                                        <div key={sprint.id} className="border rounded-xl p-4" style={{ borderColor: 'rgba(223,220,239,0.55)' }}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm">{sprint.name}</h4>
                                                    <p className="text-xs mt-1" style={{ color: '#6b6b6b' }}>{sprint.goal}</p>
                                                </div>
                                                <span
                                                    className="px-2 py-1 rounded-lg text-xs font-medium border"
                                                    style={{
                                                        color: sprintStatus.text,
                                                        backgroundColor: sprintStatus.bg,
                                                        borderColor: sprintStatus.border
                                                    }}
                                                >
                                                    {sprint.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs mt-3" style={{ color: '#6b6b6b' }}>
                                                <span>{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{sprint.issues?.length || 0} issues</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'rgba(223,220,239,0.7)' }}>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5" style={{ color: '#009063' }} />
                                    Quick Stats
                                </h3>
                                <div className="space-y-4">
                                    <QuickStat label="Total Sprints" value={totalSprints} />
                                    <QuickStat label="Active Sprints" value={project.activeSprints?.length || 0} />
                                    <QuickStat label="Total Issues" value={allSprints.reduce((acc, s) => acc + (s.issues?.length || 0), 0)} />
                                    <QuickStat label="Team Members" value={project.assignedEmployee?.length || 0} />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'rgba(223,220,239,0.7)' }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5" style={{ color: '#009063' }} />
                                    <h3 className="font-semibold">Project Health</h3>
                                </div>
                                <p className="text-sm" style={{ color: '#6b6b6b' }}>
                                    {sprintProgress >= 75 ? 'Excellent progress! Project is on track.' :
                                        sprintProgress >= 50 ? 'Good progress. Keep up the momentum.' :
                                            sprintProgress >= 25 ? 'Moderate progress. Consider reviewing timelines.' :
                                                'Project needs attention. Review sprint planning.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sprints' && (
                    <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'rgba(223,220,239,0.7)' }}>
                        <h2 className="text-lg font-semibold mb-6">All Sprints</h2>
                        <div className="space-y-4">
                            {allSprints && allSprints.length > 0 ? (
                                allSprints.map((sprint) => {
                                    const sprintStatus = getStatusColor(sprint.status);
                                    return (
                                        <div key={sprint.id} className="border rounded-xl p-5" style={{ borderColor: 'rgba(223,220,239,0.55)' }}>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-lg">{sprint.name}</h3>
                                                        <span
                                                            className="px-3 py-1 rounded-lg text-xs font-medium border"
                                                            style={{
                                                                color: sprintStatus.text,
                                                                backgroundColor: sprintStatus.bg,
                                                                borderColor: sprintStatus.border
                                                            }}
                                                        >
                                                            {sprint.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mb-3" style={{ color: '#6b6b6b' }}>{sprint.goal}</p>
                                                    <div className="flex items-center gap-4 text-sm" style={{ color: '#6b6b6b' }}>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{sprint.issues?.length || 0} issues</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sprint Issues */}
                                            {sprint.issues && sprint.issues.length > 0 && (
                                                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(223,220,239,0.3)' }}>
                                                    <h4 className="font-medium text-sm mb-3" style={{ color: '#6b6b6b' }}>Issues</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {sprint.issues.map((issue) => {
                                                            const issueStatus = getStatusColor(issue.status);
                                                            const priorityStyle = getPriorityColor(issue.priority);
                                                            return (
                                                                <div key={issue.id} className="border rounded-lg p-3" style={{ borderColor: 'rgba(223,220,239,0.4)' }}>
                                                                    <div className="flex items-start justify-between mb-2">
                                                                        <h5 className="font-medium text-sm flex-1">{issue.heading}</h5>
                                                                        <span
                                                                            className="px-2 py-0.5 rounded text-xs font-medium ml-2"
                                                                            style={{
                                                                                color: priorityStyle.text,
                                                                                backgroundColor: priorityStyle.bg
                                                                            }}
                                                                        >
                                                                            {issue.priority}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs">
                                                                        <span
                                                                            className="px-2 py-0.5 rounded border"
                                                                            style={{
                                                                                color: issueStatus.text,
                                                                                backgroundColor: issueStatus.bg,
                                                                                borderColor: issueStatus.border
                                                                            }}
                                                                        >
                                                                            {issue.status}
                                                                        </span>
                                                                        <span style={{ color: '#6b6b6b' }}>•</span>
                                                                        <span style={{ color: '#6b6b6b' }}>{issue.type}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <FolderKanban className="w-16 h-16 mx-auto mb-4" style={{ color: '#dfdcef' }} />
                                    <p style={{ color: '#6b6b6b' }}>No sprints created yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'rgba(223,220,239,0.7)' }}>
                        <h2 className="text-lg font-semibold mb-6">Team Members</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {project.assignedEmployee && project.assignedEmployee.length > 0 ? (
                                project.assignedEmployee.map((member) => (
                                    <div key={member.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow" style={{ borderColor: 'rgba(223,220,239,0.55)' }}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: '#dfdcef', color: '#3b3b3b' }}>
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{member.name}</h3>
                                                <p className="text-sm" style={{ color: '#6b6b6b' }}>{member.position}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-12">
                                    <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#dfdcef' }} />
                                    <p style={{ color: '#6b6b6b' }}>No team members assigned yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, highlight = false }: { icon: React.ReactNode; label: string; value: string | number; highlight?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: highlight ? 'rgba(0,144,99,0.1)' : 'rgba(223,220,239,0.45)' }}>
                <div style={{ color: highlight ? '#009063' : '#6b6b6b' }}>{icon}</div>
            </div>
            <div>
                <p className="text-xs" style={{ color: '#6b6b6b' }}>{label}</p>
                <p className="font-semibold" style={{ color: highlight ? '#009063' : '#3b3b3b' }}>{value}</p>
            </div>
        </div>
    );
}

function QuickStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between pb-4 border-b last:border-0" style={{ borderColor: 'rgba(223,220,239,0.3)' }}>
            <span className="text-sm" style={{ color: '#6b6b6b' }}>{label}</span>
            <span className="text-xl font-bold" style={{ color: '#009063' }}>{value}</span>
        </div>
    );
}
