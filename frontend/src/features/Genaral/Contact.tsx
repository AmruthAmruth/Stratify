import React, { useState } from "react";
import { Calendar, Users, Target, CheckCircle2, Clock, AlertCircle, TrendingUp, Layers } from "lucide-react";

const Contact: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const project = {
    id: "68e73c57631cbc69cdd9957c",
    name: "Webandcrafts Website Revamp",
    key: "WAC",
    description:
      "Revamping the Webandcrafts company website to improve performance and UI/UX experience.",
    startDate: new Date("2025-10-08T18:30:00.000Z"),
    endDate: new Date("2025-12-15T18:30:00.000Z"),
    status: "Active",
    departmentId: "dep123",
    projectLeadId: "lead001",
    companyId: "comp789",
    backlog: [
      {
        id: "issue001",
        heading: "Add responsive navigation bar",
        description:
          "Implement a responsive navbar that adapts to mobile and desktop views.",
        acceptanceCriteria:
          "Navbar should collapse into hamburger menu on small screens.",
        size: 3,
        estimatedHours: 8,
        type: "User Story",
        status: "Planned",
        priority: "High",
        assignedTo: "dev002",
        subTasks: [
          {
            id: "sub001",
            heading: "Implement desktop navbar",
            description: "Build full navbar with dropdowns for desktop view.",
            hours: 3,
            status: "Done",
            assignedToId: "dev003",
          },
          {
            id: "sub002",
            heading: "Add mobile hamburger menu",
            description: "Collapse navbar to a hamburger icon on mobile devices.",
            hours: 2,
            status: "In Progress",
            assignedToId: "dev002",
          },
        ],
      },
      {
        id: "issue002",
        heading: "Fix contact form validation bug",
        description:
          "Resolve issue where email validation fails for valid domains.",
        acceptanceCriteria: "Form should accept all valid email formats.",
        size: 2,
        estimatedHours: 4,
        type: "Bug",
        status: "In Progress",
        priority: "Medium",
        assignedTo: "dev004",
      },
    ],
    activeSprints: [
      {
        id: "sprint001",
        name: "Sprint 1 - Homepage & Auth",
        goal: "Build core homepage and authentication features.",
        startDate: new Date("2025-10-05T18:30:00.000Z"),
        endDate: new Date("2025-10-20T18:30:00.000Z"),
        status: "Active",
        issues: [
          {
            id: "issue003",
            heading: "Implement user login",
            description: "Create login API and integrate it with frontend form.",
            acceptanceCriteria:
              "User can log in with valid credentials and see dashboard.",
            size: 5,
            estimatedHours: 10,
            type: "User Story",
            status: "In Progress",
            priority: "High",
            assignedTo: "dev001",
            subTasks: [
              {
                id: "sub003",
                heading: "Backend login API",
                description: "Develop Express route for authentication.",
                hours: 4,
                status: "Done",
                assignedToId: "dev001",
              },
              {
                id: "sub004",
                heading: "Frontend integration",
                description:
                  "Connect login form to backend API and handle JWT tokens.",
                hours: 3,
                status: "In Progress",
                assignedToId: "dev002",
              },
            ],
          },
        ],
      },
    ],
    plannedSprints: [
      {
        id: "sprint002",
        name: "Sprint 2 - Dashboard Enhancements",
        goal: "Improve dashboard UI and analytics widgets.",
        startDate: new Date("2025-10-22T18:30:00.000Z"),
        endDate: new Date("2025-11-05T18:30:00.000Z"),
        status: "Planned",
        issues: [
          {
            id: "issue004",
            heading: "Add project analytics section",
            description:
              "Display sprint progress, issue count, and active users.",
            acceptanceCriteria: "Dashboard shows correct live metrics.",
            size: 4,
            estimatedHours: 6,
            type: "User Story",
            status: "Planned",
            priority: "High",
          },
        ],
      },
    ],
    completedSprints: [
      {
        id: "sprint000",
        name: "Sprint 0 - Setup & Deployment",
        goal: "Set up initial repo, CI/CD pipeline, and staging environment.",
        startDate: new Date("2025-09-20T18:30:00.000Z"),
        endDate: new Date("2025-09-30T18:30:00.000Z"),
        status: "Completed",
        issues: [
          {
            id: "issue000",
            heading: "Initialize project structure",
            description:
              "Set up base MERN structure with TypeScript and ESLint configuration.",
            acceptanceCriteria:
              "Repo builds successfully and passes lint checks.",
            size: 2,
            estimatedHours: 5,
            type: "User Story",
            status: "Done",
            priority: "Medium",
            assignedTo: "dev001",
          },
        ],
      },
    ],
    activeSprintCount: 1,
    plannedSprintCount: 1,
    completedSprintCount: 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-700 border-red-200";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done": case "Completed": return "bg-green-50 text-green-700 border-green-200";
      case "In Progress": case "Active": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Planned": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const calculateProgress = (sprint: any) => {
    const totalIssues = sprint.issues.length;
    const doneIssues = sprint.issues.filter((i: any) => i.status === "Done").length;
    return totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;
  };

  const allIssues = [
    ...project.backlog,
    ...project.activeSprints.flatMap(s => s.issues),
    ...project.plannedSprints.flatMap(s => s.issues),
    ...project.completedSprints.flatMap(s => s.issues)
  ];

  const totalEstimatedHours = allIssues.reduce((sum, issue) => sum + (issue.estimatedHours || 0), 0);
  const completedIssues = allIssues.filter(i => i.status === "Done").length;

  return (
    <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #009063 0%, #007a54 100%)',
        padding: '4rem 2rem 6rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              letterSpacing: '0.05em'
            }}>
              {project.key}
            </div>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: '#009063',
              padding: '0.375rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {project.status}
            </span>
          </div>
          
          <h1 style={{ 
            color: 'white', 
            fontSize: '3rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            {project.name}
          </h1>
          
          <p style={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '1.25rem', 
            maxWidth: '800px',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            {project.description}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1400px', margin: '-3rem auto 0', padding: '0 2rem 3rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: <Calendar size={24} />, label: 'Timeline', value: `${formatDate(project.startDate)} - ${formatDate(project.endDate)}` },
            { icon: <Layers size={24} />, label: 'Total Issues', value: allIssues.length },
            { icon: <CheckCircle2 size={24} />, label: 'Completed', value: `${completedIssues} / ${allIssues.length}` },
            { icon: <Clock size={24} />, label: 'Estimated Hours', value: `${totalEstimatedHours}h` }
          ].map((stat, idx) => (
            <div key={idx} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05)',
              border: '1px solid #dfdcef',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05)';
            }}>
              <div style={{ color: '#009063', marginBottom: '1rem' }}>
                {stat.icon}
              </div>
              <div style={{ color: '#999', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                {stat.label}
              </div>
              <div style={{ color: '#3b3b3b', fontSize: '1.5rem', fontWeight: '700' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 2rem' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '0.5rem',
          border: '1px solid #dfdcef',
          display: 'inline-flex',
          gap: '0.5rem'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: <TrendingUp size={18} /> },
            { id: 'sprints', label: 'Sprints', icon: <Target size={18} /> },
            { id: 'backlog', label: 'Backlog', icon: <Layers size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#009063' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#3b3b3b',
                fontSize: '0.9375rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Sprint Progress Overview */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              padding: '2.5rem',
              border: '1px solid #dfdcef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h2 style={{ color: '#3b3b3b', fontSize: '1.75rem', marginBottom: '2rem', fontWeight: '700' }}>
                Sprint Progress
              </h2>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    backgroundColor: '#009063', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {project.activeSprintCount}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#3b3b3b', fontWeight: '600', fontSize: '1.125rem' }}>
                      Active Sprints
                    </div>
                    <div style={{ color: '#999', fontSize: '0.875rem' }}>
                      Currently in progress
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    backgroundColor: '#dfdcef', 
                    color: '#3b3b3b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {project.plannedSprintCount}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#3b3b3b', fontWeight: '600', fontSize: '1.125rem' }}>
                      Planned Sprints
                    </div>
                    <div style={{ color: '#999', fontSize: '0.875rem' }}>
                      Scheduled for future
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    backgroundColor: '#f0f0f0', 
                    color: '#3b3b3b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {project.completedSprintCount}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#3b3b3b', fontWeight: '600', fontSize: '1.125rem' }}>
                      Completed Sprints
                    </div>
                    <div style={{ color: '#999', fontSize: '0.875rem' }}>
                      Successfully finished
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Issues Summary */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              padding: '2.5rem',
              border: '1px solid #dfdcef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h2 style={{ color: '#3b3b3b', fontSize: '1.75rem', marginBottom: '2rem', fontWeight: '700' }}>
                Recent Activity
              </h2>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[...project.activeSprints.flatMap(s => s.issues), ...project.backlog].slice(0, 3).map(issue => (
                  <div key={issue.id} style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    backgroundColor: '#fbfbfb',
                    border: '1px solid #dfdcef'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <h3 style={{ color: '#3b3b3b', fontSize: '1.125rem', fontWeight: '600', flex: 1 }}>
                        {issue.heading}
                      </h3>
                      <span style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        border: '1px solid',
                        whiteSpace: 'nowrap',
                        marginLeft: '1rem'
                      }} className={getStatusColor(issue.status)}>
                        {issue.status}
                      </span>
                    </div>
                    
                    <p style={{ color: '#666', fontSize: '0.9375rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                      {issue.description}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        border: '1px solid'
                      }} className={getPriorityColor(issue.priority)}>
                        {issue.priority}
                      </span>
                      <span style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        fontSize: '0.8125rem',
                        backgroundColor: '#f8f8f8',
                        color: '#3b3b3b',
                        border: '1px solid #dfdcef'
                      }}>
                        {issue.type}
                      </span>
                      <span style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        fontSize: '0.8125rem',
                        backgroundColor: '#f8f8f8',
                        color: '#3b3b3b',
                        border: '1px solid #dfdcef',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem'
                      }}>
                        <Clock size={14} />
                        {issue.estimatedHours}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sprints Tab */}
        {activeTab === 'sprints' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Active Sprints */}
            {project.activeSprints.map(sprint => (
              <div key={sprint.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: '2.5rem',
                border: '2px solid #009063',
                boxShadow: '0 4px 12px rgba(0,144,99,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h2 style={{ color: '#3b3b3b', fontSize: '1.75rem', fontWeight: '700' }}>
                        {sprint.name}
                      </h2>
                      <span style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        backgroundColor: '#009063',
                        color: 'white'
                      }}>
                        Active
                      </span>
                    </div>
                    <p style={{ color: '#666', fontSize: '1rem', marginBottom: '0.75rem' }}>
                      {sprint.goal}
                    </p>
                    <div style={{ color: '#999', fontSize: '0.875rem' }}>
                      {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#3b3b3b', fontSize: '0.875rem', fontWeight: '600' }}>
                      Progress
                    </span>
                    <span style={{ color: '#009063', fontSize: '0.875rem', fontWeight: '700' }}>
                      {calculateProgress(sprint)}%
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      backgroundColor: '#009063',
                      width: `${calculateProgress(sprint)}%`,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {sprint.issues.map(issue => (
                    <div key={issue.id} style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      backgroundColor: '#fbfbfb',
                      border: '1px solid #dfdcef'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <h3 style={{ color: '#3b3b3b', fontSize: '1.125rem', fontWeight: '600', flex: 1 }}>
                          {issue.heading}
                        </h3>
                        <span style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: '20px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          border: '1px solid',
                          whiteSpace: 'nowrap',
                          marginLeft: '1rem'
                        }} className={getStatusColor(issue.status)}>
                          {issue.status}
                        </span>
                      </div>
                      
                      <p style={{ color: '#666', fontSize: '0.9375rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                        {issue.description}
                      </p>

                      {issue.subTasks && issue.subTasks.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ color: '#3b3b3b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                            Subtasks ({issue.subTasks.filter(st => st.status === 'Done').length}/{issue.subTasks.length})
                          </div>
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {issue.subTasks.map(subtask => (
                              <div key={subtask.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #dfdcef'
                              }}>
                                <div style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderColor: subtask.status === 'Done' ? '#009063' : '#dfdcef',
                                  backgroundColor: subtask.status === 'Done' ? '#009063' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  {subtask.status === 'Done' && (
                                    <CheckCircle2 size={12} color="white" />
                                  )}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ 
                                    color: '#3b3b3b', 
                                    fontSize: '0.875rem',
                                    textDecoration: subtask.status === 'Done' ? 'line-through' : 'none',
                                    opacity: subtask.status === 'Done' ? 0.6 : 1
                                  }}>
                                    {subtask.heading}
                                  </div>
                                </div>
                                <div style={{ 
                                  color: '#999', 
                                  fontSize: '0.8125rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <Clock size={12} />
                                  {subtask.hours}h
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: '20px',
                          fontSize: '0.8125rem',
                          fontWeight: '600',
                          border: '1px solid'
                        }} className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </span>
                        <span style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: '20px',
                          fontSize: '0.8125rem',
                          backgroundColor: '#f8f8f8',
                          color: '#3b3b3b',
                          border: '1px solid #dfdcef'
                        }}>
                          Size: {issue.size}
                        </span>
                        <span style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: '20px',
                          fontSize: '0.8125rem',
                          backgroundColor: '#f8f8f8',
                          color: '#3b3b3b',
                          border: '1px solid #dfdcef',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                          <Clock size={14} />
                          {issue.estimatedHours}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Planned Sprints */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              padding: '2.5rem',
              border: '1px solid #dfdcef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h2 style={{ color: '#3b3b3b', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                Upcoming Sprints
              </h2>
              
              {project.plannedSprints.map(sprint => (
                <div key={sprint.id} style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  backgroundColor: '#fbfbfb',
                  border: '1px solid #dfdcef',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <h3 style={{ color: '#3b3b3b', fontSize: '1.25rem', fontWeight: '600' }}>
                      {sprint.name}
                    </h3>
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      backgroundColor: '#dfdcef',
                      color: '#3b3b3b'
                    }}>
                      Planned
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                    {sprint.goal}
                  </p>
                  <div style={{ color: '#999', fontSize: '0.875rem' }}>
                    {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                  </div>
                </div>
              ))}
            </div>

            {/* Completed Sprints */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              padding: '2.5rem',
              border: '1px solid #dfdcef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <h2 style={{ color: '#3b3b3b', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                Completed Sprints
              </h2>
              
              {project.completedSprints.map(sprint => (
                <div key={sprint.id} style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  backgroundColor: '#f8fdf9',
                  border: '1px solid #c4f1dd',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <h3 style={{ color: '#3b3b3b', fontSize: '1.25rem', fontWeight: '600' }}>
                      {sprint.name}
                    </h3>
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      backgroundColor: '#009063',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                    {sprint.goal}
                  </p>
                  <div style={{ color: '#999', fontSize: '0.875rem' }}>
                    {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backlog Tab */}
        {activeTab === 'backlog' && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '2.5rem',
            border: '1px solid #dfdcef',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#3b3b3b', fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Product Backlog
              </h2>
              <p style={{ color: '#666', fontSize: '1rem' }}>
                {project.backlog.length} items waiting to be scheduled
              </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {project.backlog.map(issue => (
                <div key={issue.id} style={{
                  padding: '2rem',
                  borderRadius: '12px',
                  backgroundColor: '#fbfbfb',
                  border: '1px solid #dfdcef',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#009063';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,144,99,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#dfdcef';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#3b3b3b', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                        {issue.heading}
                      </h3>
                      <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                        {issue.description}
                      </p>
                      
                      {issue.acceptanceCriteria && (
                        <div style={{ 
                          padding: '1rem', 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          border: '1px solid #dfdcef',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ color: '#3b3b3b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Acceptance Criteria
                          </div>
                          <div style={{ color: '#666', fontSize: '0.875rem', lineHeight: '1.5' }}>
                            {issue.acceptanceCriteria}
                          </div>
                        </div>
                      )}

                      {issue.subTasks && issue.subTasks.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ color: '#3b3b3b', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                            Subtasks ({issue.subTasks.filter(st => st.status === 'Done').length}/{issue.subTasks.length})
                          </div>
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {issue.subTasks.map(subtask => (
                              <div key={subtask.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #dfdcef'
                              }}>
                                <div style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderColor: subtask.status === 'Done' ? '#009063' : '#dfdcef',
                                  backgroundColor: subtask.status === 'Done' ? '#009063' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  {subtask.status === 'Done' && (
                                    <CheckCircle2 size={12} color="white" />
                                  )}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ 
                                    color: '#3b3b3b', 
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.25rem',
                                    textDecoration: subtask.status === 'Done' ? 'line-through' : 'none',
                                    opacity: subtask.status === 'Done' ? 0.6 : 1
                                  }}>
                                    {subtask.heading}
                                  </div>
                                  <div style={{ color: '#999', fontSize: '0.8125rem' }}>
                                    {subtask.description}
                                  </div>
                                </div>
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-end',
                                  gap: '0.25rem'
                                }}>
                                  <span style={{
                                    padding: '0.25rem 0.625rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    border: '1px solid'
                                  }} className={getStatusColor(subtask.status)}>
                                    {subtask.status}
                                  </span>
                                  <div style={{ 
                                    color: '#999', 
                                    fontSize: '0.8125rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}>
                                    <Clock size={12} />
                                    {subtask.hours}h
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      border: '1px solid',
                      whiteSpace: 'nowrap',
                      marginLeft: '1rem'
                    }} className={getStatusColor(issue.status)}>
                      {issue.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      border: '1px solid'
                    }} className={getPriorityColor(issue.priority)}>
                      {issue.priority} Priority
                    </span>
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      backgroundColor: '#f8f8f8',
                      color: '#3b3b3b',
                      border: '1px solid #dfdcef',
                      fontWeight: '500'
                    }}>
                      {issue.type}
                    </span>
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      backgroundColor: '#f8f8f8',
                      color: '#3b3b3b',
                      border: '1px solid #dfdcef',
                      fontWeight: '500'
                    }}>
                      Story Points: {issue.size}
                    </span>
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      backgroundColor: '#f8f8f8',
                      color: '#3b3b3b',
                      border: '1px solid #dfdcef',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontWeight: '500'
                    }}>
                      <Clock size={14} />
                      {issue.estimatedHours} hours
                    </span>
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.8125rem',
                      backgroundColor: '#f8f8f8',
                      color: '#3b3b3b',
                      border: '1px solid #dfdcef',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontWeight: '500'
                    }}>
                      <Users size={14} />
                      {issue.assignedTo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;