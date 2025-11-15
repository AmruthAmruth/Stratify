import { SprintWithIssuesDTO } from "../dto/project/GetProjectDetailsDTO";

export class ProjectDetailsMapper {
  static mapIssue(issue: any, subtasks: any[]) {
    return {
      id: issue.id!,
      heading: issue.heading,
      description: issue.description,
      acceptanceCriteria: issue.acceptanceCriteria,
      size: issue.size,
      estimatedHours: issue.estimatedHours,
      type: issue.type,
      status: issue.status,
      priority: issue.priority,
      assignedTo: issue.assignedTo ?? null,
      sprintId: issue.sprintId ?? null,
      subTasks: subtasks.map((st) => this.mapSubtask(st)),
    };
  }

  static mapSubtask(subtask: any) {
    return {
      id: subtask.id!,
      heading: subtask.heading,
      description: subtask.description,
      hours: subtask.hours,
      status: subtask.status,
      assignedToId: subtask.assignedToId ?? null,
    };
  }

  static mapSprint(sprint: any, issues: any[]): SprintWithIssuesDTO {
    return {
      id: sprint.id!,
      name: sprint.name,
      goal: sprint.goal,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status,
      issues,
    };
  }

  static categorizeSprints(sprints: any[], issues: any[]) {
    const today = new Date();

    const active: SprintWithIssuesDTO[] = [];
    const planned: SprintWithIssuesDTO[] = [];
    const completed: SprintWithIssuesDTO[] = [];

    sprints.forEach((sprint) => {
      const sprintIssues = issues.filter((i) => i.sprintId === sprint.id);
      const sprintDTO = this.mapSprint(sprint, sprintIssues);

      const start = new Date(sprint.startDate);
      const end = new Date(sprint.endDate);

      if (start <= today && end >= today) active.push(sprintDTO);
      else if (start > today) planned.push(sprintDTO);
      else completed.push(sprintDTO);
    });

    return { active, planned, completed };
  }
}
