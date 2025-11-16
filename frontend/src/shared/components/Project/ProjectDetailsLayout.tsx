// components/project/ProjectDetailsLayout.tsx
import React from "react";
import { ProjectDTO, UserRole } from "./types";

import ProjectHeader from "./ProjectHeader";
import ProjectSection from "./ProjectSection";
import IssueList from "./IssueList";
import SprintList from "./SprintList";
import EmployeeList from "./EmployeeList";
import DashboardCard from "../DashboardCards/Cards";
import ReusableChart from "../Chart/ReusableChart";

interface Props {
  project: ProjectDTO;
  role: UserRole; // company | manager | employee
}

const ProjectDetailsLayout: React.FC<Props> = ({ project, role }) => {
  const canCreateIssue = role === "company" || role === "manager";
  const canCreateSprint = role === "company" || role === "manager";

  return (
    <div className="space-y-6 p-4 text-black">
      <ProjectHeader
        name={project.name}
        keyCode={project.key}
        status={project.status}
        startDate={project.startDate}
        endDate={project.endDate}
        description={project.description}
      />




<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
  <DashboardCard
    title="Total Backlogs"
    value={project.backlog.length}
    subtitle="Issues waiting"
    badge="Backlog"
  />
  <DashboardCard
    title="Planned Sprints"
    value={project.plannedSprintCount}
    subtitle="Upcoming work"
    trend="up"
    badge="Planned"
  />
  <DashboardCard
    title="Active Sprints"
    value={project.activeSprintCount}
    subtitle="Currently active"
    trend="up"
    badge="Active"
  />
  <DashboardCard
    title="Completed Sprints"
    value={project.completedSprintCount}
    subtitle="Completed cycles"
    trend="down"
    badge="Done"
  />
</div>




{/* CHARTS SECTION */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
  {/* Sprint Status Chart */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm">
    <ReusableChart
      type="doughnut"
      title="Sprint Overview"
      labels={["Planned", "Active", "Completed"]}
      data={[
        project.plannedSprintCount,
        project.activeSprintCount,
        project.completedSprintCount,
      ]}
    />
  </div>

  {/* Issue Type Distribution */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm">
    <ReusableChart
      type="pie"
      title="Backlog Issue Types"
      labels={["User Story", "Bug"]}
      data={[
        project.backlog.filter((i) => i.type === "User Story").length,
        project.backlog.filter((i) => i.type === "Bug").length,
      ]}
    />
  </div>

  {/* Issue Priority Overview */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm">
    <ReusableChart
      type="bar"
      title="Backlog Priority Breakdown"
      labels={["High", "Medium", "Low"]}
      data={[
        project.backlog.filter((i) => i.priority === "High").length,
        project.backlog.filter((i) => i.priority === "Medium").length,
        project.backlog.filter((i) => i.priority === "Low").length,
      ]}
    />
  </div>

  {/* Employee Distribution Across Issues */}
  <div className="p-6 bg-[#fbfbfb] border border-[#dfdcef] rounded-xl shadow-sm">
    <ReusableChart
      type="line"
      title="Workload by Employees"
      labels={project.assignedEmployee.map((emp) => emp.name)}
      data={project.assignedEmployee.map(
        (emp) =>
          project.backlog.filter((i) => i.assignedTo === emp.id).length +
          project.activeSprints.flatMap((s) => s.issues).filter((i) => i.assignedTo === emp.id).length
      )}
    />
  </div>
</div>

      



      {/* BACKLOG */}
      <ProjectSection title="Backlog Items">
        {canCreateIssue && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded mb-3">
            + Create Issue
          </button>
        )}
        <IssueList issues={project.backlog} role={role} />
      </ProjectSection>

      {/* ACTIVE SPRINTS */}
      <ProjectSection title="Active Sprints">
        {canCreateSprint && (
          <button className="bg-green-600 text-white px-4 py-2 rounded mb-3">
            + Create Sprint
          </button>
        )}
        <SprintList sprints={project.activeSprints} role={role} />
      </ProjectSection>

      {/* PLANNED SPRINTS */}
      <ProjectSection title="Planned Sprints">
        <SprintList sprints={project.plannedSprints} role={role} />
      </ProjectSection>

      {/* COMPLETED SPRINTS */}
      <ProjectSection title="Completed Sprints">
        <SprintList sprints={project.completedSprints} role={role} />
      </ProjectSection>

      {/* EMPLOYEES */}
      <ProjectSection title="Assigned Employees">
        <EmployeeList employees={project.assignedEmployee} />
      </ProjectSection>
    </div>
  );
};

export default ProjectDetailsLayout;