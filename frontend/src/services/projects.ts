import { PROJECT_ROUTES } from "@/constants/routes";
import api from "./axiosInstance";
import { AxiosError } from "axios";


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


export const getCompanyProjects = () =>
  handleRequest(api.get(PROJECT_ROUTES.COMPANY_PROJECTS));

export const getDepartmentProjects = () =>
  handleRequest(api.get(PROJECT_ROUTES.DEPARTMENT_PROJECTS));

export const getProjectDetails = (id: string) =>
  handleRequest(api.get(PROJECT_ROUTES.PROJECT_DETAILS(id)));

export const createProject = (data: Record<string, unknown>) =>
  handleRequest(api.post(PROJECT_ROUTES.CREATE_PROJECT, data));

export const updateProject = (data: Record<string, unknown>) =>
  handleRequest(api.put(PROJECT_ROUTES.UPDATE_PROJECT, data));

export const projectLevelTeamAllocation = () =>
  handleRequest(api.get(PROJECT_ROUTES.PROJECT_LEVEL_ALLOCATION));

export const deleteProject = (id: string) =>
  handleRequest(api.delete(PROJECT_ROUTES.DELETE_PROJECT(id)));

// Issue, Sprint, SubTask APIs
export const createIssue = (data: Record<string, unknown>) =>
  handleRequest(api.post(PROJECT_ROUTES.CREATE_ISSUE, data));

export const createSprint = (data: Record<string, unknown>) =>
  handleRequest(api.post(PROJECT_ROUTES.CREATE_SPRINT, data));

export const createSubTask = (data: Record<string, unknown>) =>
  handleRequest(api.post(PROJECT_ROUTES.CREATE_SUB_TASK, data));



export const updateSprint = () =>
  handleRequest(api.get(PROJECT_ROUTES.CREATE_SPRINT));

export const updateTask = () =>
  handleRequest(api.get(PROJECT_ROUTES.PROJECT_LEVEL_ALLOCATION));

export const assingIssueToSprint = (data: Record<string, unknown>) =>
  handleRequest(api.post(PROJECT_ROUTES.ASSINGED_STORY_TO_SPRINT, data));





export const employeeUnderTheProject = (id: string) =>
  handleRequest(api.get(PROJECT_ROUTES.GET_EMPLOYEE_UNDER_PROJECT(id)));

export const employeeInDepartment = () =>
  handleRequest(api.post(PROJECT_ROUTES.GET_DEPARTMENT_EMPLOYEES));

export const getEmployeesNotInProject = (id: string) =>
  handleRequest(api.get(PROJECT_ROUTES.GET_EMPLOYEE_NOT_IN_PROJECT(id)));

export const addEmployeetoProject = (data: Record<string, unknown>) =>
  handleRequest(api.post(PROJECT_ROUTES.Add_EMPLOYEE_TO_PROJECT, data));




export const getIssuesForEmployee = () =>
  handleRequest(api.get(PROJECT_ROUTES.GET_ISSSUES_FOR_EMPLOYEE));


export const updateIssue=(data: Record<string, unknown>)=>{
  handleRequest(api.put(PROJECT_ROUTES.UPDATE_ISSUE,data))
}


export const deleteIssue=(issueId:string)=>{
  handleRequest(api.delete(PROJECT_ROUTES.DELETE_ISSUE(issueId)))
}



