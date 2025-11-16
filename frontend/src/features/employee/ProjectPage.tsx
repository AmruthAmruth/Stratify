// pages/project/[id].tsx (or app/project/[id]/page.tsx depending on your routing)
import { ProjectDTO } from "@/shared/components/Project/types";
import ProjectDetailsLayout from "@/shared/components/Project/ProjectDetailsLayout";

export default function ProjectPage() {
  const userRole = "company"; // dynamic based on login

  const sampleProject: ProjectDTO = {
    id: "proj-1001",
    name: "Website Redesign",
    key: "WR2025",
    description: "Redesign and improve the company's main website with modern UI/UX.",
    startDate: "2025-10-15",
    endDate: "2026-01-15",
    status: "Active",
    departmentId: "dep-01",
    projectLeadId: "mgr-01",
    companyId: "cmp-01",

    // -------- BACKLOG --------
    backlog: [
      {
        id: "issue-1",
        heading: "Revamp Landing Page",
        description: "Redesign the landing page for better user engagement.",
        acceptanceCriteria: "New UI, responsive, improved load time",
        size: 5,
        estimatedHours: 10,
        type: "User Story",
        status: "Planned",
        priority: "Medium",
        assignedTo: "emp-1",
        sprintId: null,
        subTasks: [
          {
            id: "sub-1",
            heading: "Landing page wireframe",
            description: "Create high-fidelity wireframes",
            hours: 3,
            status: "To Do",
            assignedToId: "emp-1"
          },
          {
            id: "sub-2",
            heading: "UI Components",
            description: "Build the UI components for landing page",
            hours: 4,
            status: "To Do",
            assignedToId: "emp-2"
          }
        ]
      },

      {
        id: "issue-2",
        heading: "Fix Login Bug",
        description: "Fix the issue where login fails on Safari browser",
        acceptanceCriteria: "Login should work on all browsers",
        size: 2,
        estimatedHours: 4,
        type: "Bug",
        status: "Planned",
        priority: "High",
        assignedTo: null,
        sprintId: null,
        subTasks: []
      }
    ],

    // -------- ACTIVE SPRINTS --------
    activeSprints: [
      {
        id: "sprint-101",
        name: "Sprint 1",
        goal: "Prepare core redesign work",
        startDate: "2025-11-01",
        endDate: "2025-11-15",
        status: "Active",
        issues: [
          {
            id: "issue-3",
            heading: "Header Redesign",
            description: "Create new responsive header",
            acceptanceCriteria: "Responsive on all devices",
            size: 3,
            estimatedHours: 6,
            type: "User Story",
            status: "In Progress",
            priority: "High",
            assignedTo: "emp-2",
            sprintId: "sprint-101",
            subTasks: [
              {
                id: "sub-3",
                heading: "Create Navbar",
                description: "Implement dynamic navbar",
                hours: 2,
                status: "In Progress",
                assignedToId: "emp-2"
              }
            ]
          }
        ]
      }
    ],

    // -------- PLANNED SPRINTS --------
    plannedSprints: [
      {
        id: "sprint-102",
        name: "Sprint 2",
        goal: "Complete UI components",
        startDate: "2025-11-16",
        endDate: "2025-11-30",
        status: "Planned",
        issues: []
      }
    ],

    // -------- COMPLETED SPRINTS --------
    completedSprints: [
      {
        id: "sprint-100",
        name: "Sprint 0",
        goal: "Initial Setup & Research",
        startDate: "2025-10-01",
        endDate: "2025-10-15",
        status: "Completed",
        issues: [
          {
            id: "issue-4",
            heading: "Research Competitors",
            description: "Study other websites for inspiration",
            acceptanceCriteria: "Research document prepared",
            size: 1,
            estimatedHours: 2,
            type: "User Story",
            status: "Done",
            priority: "Low",
            assignedTo: "emp-3",
            sprintId: "sprint-100",
            subTasks: []
          }
        ]
      }
    ],

    // -------- ASSIGNED EMPLOYEES --------
    assignedEmployee: [
      { id: "emp-1", name: "John Doe", position: "Frontend Engineer" },
      { id: "emp-2", name: "Bob Smith", position: "UI Developer" },
      { id: "emp-3", name: "Alice", position: "Business Analyst" }
    ],

    // -------- COUNTS --------
    activeSprintCount: 1,
    plannedSprintCount: 1,
    completedSprintCount: 1
  };

  return (
    <div className="p-6">
      <ProjectDetailsLayout project={sampleProject} role={userRole} />
    </div>
  );
}