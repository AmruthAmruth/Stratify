import { PROJECT_ROUTES } from "@/constants/routes";
import api from "./axiosInstance";
import { AxiosError } from "axios";
import type { ProjectsResponse, Project, Issue, SubTask, TeamMember } from "@/types/types";
import type { ProjectDTO } from "@/shared/components/Project/types";


const handleRequest = async <T>(request: Promise<{ data: T }>): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data || new Error("Network error");
    }
    throw new Error("Network error");
  }
};


export const getCompanyProjects = (): Promise<ProjectsResponse> =>
  handleRequest(api.get(PROJECT_ROUTES.COMPANY_PROJECTS));

export const getDepartmentProjects = (): Promise<ProjectsResponse> =>
  handleRequest(api.get(PROJECT_ROUTES.DEPARTMENT_PROJECTS));

export const getEmployeeProjects = (): Promise<ProjectsResponse> =>
  handleRequest(api.get(PROJECT_ROUTES.EMPLOYEE_PROJECTS));

export const getProjectDetails = (id: string): Promise<ProjectDTO> =>
  handleRequest(api.get(PROJECT_ROUTES.PROJECT_DETAILS(id)));


export const createProject = (data: Record<string, unknown>): Promise<Project> =>
  handleRequest(api.post(PROJECT_ROUTES.CREATE_PROJECT, data));

export const updateProject = (data: Record<string, unknown>): Promise<Project> =>
  handleRequest(api.put(PROJECT_ROUTES.UPDATE_PROJECT, data));

export const projectLevelTeamAllocation = (): Promise<unknown> =>
  handleRequest(api.get(PROJECT_ROUTES.PROJECT_LEVEL_ALLOCATION));

export const deleteProject = (id: string): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.delete(PROJECT_ROUTES.DELETE_PROJECT(id)));

// Issue, Sprint, SubTask APIs
export const createIssue = (data: Record<string, unknown>): Promise<Issue> =>
  handleRequest(api.post(PROJECT_ROUTES.CREATE_ISSUE, data));

export const createSprint = (data: Record<string, unknown>): Promise<unknown> =>
  handleRequest(api.post(PROJECT_ROUTES.CREATE_SPRINT, data));

export const createSubTask = (data: Record<string, unknown>): Promise<SubTask> =>
  handleRequest(api.post(PROJECT_ROUTES.CREATE_SUB_TASK, data));



export const updateSprint = (data: Record<string, unknown>): Promise<unknown> =>
  handleRequest(api.put(PROJECT_ROUTES.UPDATE_SPRINT, data));

export const deleteSprint = (id: string): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.delete(PROJECT_ROUTES.DELETE_SPRINT(id)));

export const updateTask = (data: Record<string, unknown>): Promise<SubTask> =>
  handleRequest(api.put(PROJECT_ROUTES.UPDATE_SUB_TASK, data));

export const deleteSubTask = (id: string): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.delete(PROJECT_ROUTES.DELETE_SUB_TASK(id)));

export const assignIssueToSprint = (data: Record<string, unknown>): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.post(PROJECT_ROUTES.ASSINGED_STORY_TO_SPRINT, data));





export const employeeUnderTheProject = (id: string): Promise<TeamMember[]> =>
  handleRequest(api.get(PROJECT_ROUTES.GET_EMPLOYEE_UNDER_PROJECT(id)));

export const employeeInDepartment = (): Promise<TeamMember[]> =>
  handleRequest(api.post(PROJECT_ROUTES.GET_DEPARTMENT_EMPLOYEES));

export const getEmployeesNotInProject = (id: string): Promise<TeamMember[]> =>
  handleRequest(api.get(PROJECT_ROUTES.GET_EMPLOYEE_NOT_IN_PROJECT(id)));

export const addEmployeeProject = (data: Record<string, unknown>): Promise<{ success: boolean; message: string }> =>
  handleRequest(api.post(PROJECT_ROUTES.Add_EMPLOYEE_TO_PROJECT, data));




export const getIssuesForEmployee = (): Promise<Issue[]> =>
  handleRequest(api.get(PROJECT_ROUTES.GET_ISSSUES_FOR_EMPLOYEE));

export const getIssuesForManager = () =>
  handleRequest(api.get(PROJECT_ROUTES.GET_ISSUES_FOR_MANAGER));


export const updateIssue = (data: Record<string, unknown>): Promise<Issue> => {
  return handleRequest(api.put(PROJECT_ROUTES.UPDATE_ISSUE, data))
}


export const deleteIssue = (issueId: string): Promise<{ success: boolean; message: string }> => {
  return handleRequest(api.delete(PROJECT_ROUTES.DELETE_ISSUE(issueId)))
}




export const removeEmployeeInProject = (data: Record<string, unknown>): Promise<{ success: boolean; message: string }> => {
  console.log("Yes, I'm Working");

  return handleRequest(api.post(PROJECT_ROUTES.REMOVE_EMPLOYEE_TO_PROJECT, data))
}

// Alias for updateTask - used in Task.tsx
export const updateSubTask = updateTask;