




import DashboardCard from '@/shared/components/DashboardCards/Cards'
import React from 'react'

const ProjectDetails = () => {


    const projects = {
  id: "68e48cfc4c3d354e330e1c50",
  name: "Employee Management System",
  key: "EMS",
  description: "A system to manage employees, attendance, and payroll efficiently.",
  startDate: new Date("2025-10-10T00:00:00.000Z"),
  endDate: new Date("2026-03-31T00:00:00.000Z"),
  status: "Planned",
  departmentId: "68c8adaf0d5786939d1946bd",
  projectLeadId: "68d65b4e441d94a5ffcf5bb6",
  companyId: "68a4518fa64f6fb2aac09084",
  backlog: [
    {
      id: "68e4994c6c5aa40809c5ed49",
      heading: "Crash on clicking 'Save Settings'",
      description: "The application crashes when users click the 'Save Settings' button in the profile page.",
      acceptanceCriteria: "Users can click 'Save Settings' without the app crashing. All changes are saved correctly.",
      size: 3,
      estimatedHours: 6,
      type: "Bug",
      status: "Planned",
      priority: "Medium",
      assignedTo: "68db6613fd33754f08625031",
      sprintId: null,
      subTasks: []
    },
    {
      id: "68e499626c5aa40809c5ed4e",
      heading: "Add multi-factor authentication",
      description: "As a user, I want to enable multi-factor authentication (MFA) so that my account is more secure.",
      acceptanceCriteria: "Users can enable MFA from their account settings. During login, users are prompted to verify via a secondary method. Users can disable MFA if needed.",
      size: 5,
      estimatedHours: 12,
      type: "User Story",
      status: "Planned",
      priority: "High",
      assignedTo: "68db6613fd33754f08625031",
      sprintId: null,
      subTasks: []
    }
  ],
  activeSprints: [],
  plannedSprints: [
    {
      id: "68e49a436c5aa40809c5ed52",
      name: "Sprint 1",
      goal: "Implement user authentication and profile management",
      startDate: new Date("2025-10-08T09:00:00.000Z"),
      endDate: new Date("2025-10-22T18:00:00.000Z"),
      status: "Planned",
      issues: []
    },
    {
      id: "68e49bb86c5aa40809c5ed68",
      name: "Sprint 2",
      goal: "Implement notifications feature",
      startDate: new Date("2025-10-23T09:00:00.000Z"),
      endDate: new Date("2025-10-29T18:00:00.000Z"),
      status: "Planned",
      issues: [
        {
          id: "68e499336c5aa40809c5ed44",
          heading: "Error when uploading profile picture",
          description: "Users encounter an error message when trying to upload a profile picture larger than 5MB.",
          acceptanceCriteria: "Users can upload profile pictures up to 5MB without errors. Larger files show a clear validation message.",
          size: 2,
          estimatedHours: 4,
          type: "Bug",
          status: "Planned",
          priority: "Low",
          assignedTo: "68db6613fd33754f08625031",
          sprintId: "68e49bb86c5aa40809c5ed68",
          subTasks: [
            {
              id: "68e5f1b935302bd52ccb8f17",
              heading: "Implement login functionality",
              description: "Create backend and frontend logic for user login with validation",
              hours: 8,
              status: "In Progress",
              assignedToId: "68db6613fd33754f08625031"
            },
            {
              id: "68e5f1e035302bd52ccb8f1b",
              heading: "Implement Register functionality",
              description: "Create backend logic for user Registration with validation",
              hours: 8,
              status: "Done",
              assignedToId: "68db6613fd33754f08625031"
            }
          ]
        }
      ]
    }
  ],
  completedSprints: [],
  activeSprintCount: 0,
  plannedSprintCount: 2,
  completedSprintCount: 0
};

  return (
    <div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Active Sprint "
          value={projects.activeSprintCount}
          subtitle="Active sprint count"
          trend={projects.activeSprintCount > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Planned Sprint "
          value={projects.plannedSprintCount}
          subtitle="Planed Sprint count"
          trend={projects.plannedSprintCount > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Completed Sprint"
          value={projects.completedSprintCount}
          subtitle="Completed Sprint count"
          trend={projects.completedSprintCount > 0 ? 'up' : 'down'}
        />


        
      </div>
    </div>
  )
}

export default ProjectDetails