

import { PROJECT_ROUTES } from "@/constants/routes";
import api from "./axiosInstance";



export const getCompanyProjects = async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.COMPANY_PROJECTS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};



export const getDepartmentProjects = async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.DEPARTMENT_PROJECTS);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};





export const getProjectDetails = async (id:string) => {
  try {
    const response = await api.get(PROJECT_ROUTES.PROJECT_DETAILS(id));
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};




export const createProject = async(data:Record<string, unknown>)=>{
  try{
    const response = await api.post(PROJECT_ROUTES.CREATE_PROJECT,data);
    return response.data
  }catch(err:any){
    throw err.response?.data || new Error("Network error")
  }
}





export const projectLevelTeamAllocation=async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.PROJECT_LEVEL_ALLOCATION);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};



export const deleteProject = async (id: string) => {
  try {
    console.log("Delte id",id);
    
  const response = await api.delete(PROJECT_ROUTES.DELETE_PROJECT(id));  
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};





export const createIssue=async(data:Record<string, unknown>)=>{
  try{
    const response = await api.post(PROJECT_ROUTES.CREATE_ISSUE,data);
    return response.data
  }catch(err:any){
    throw err.response?.data || new Error("Network error")
  }
}



export const createSprint=async(data:Record<string, unknown>)=>{
  try{
    const response = await api.post(PROJECT_ROUTES.CREATE_SPRINT,data);
    return response.data
  }catch(err:any){
    throw err.response?.data || new Error("Network error")
  }
}


export const createSubTask=async(data:Record<string, unknown>)=>{
  try{
    const response = await api.post(PROJECT_ROUTES.CREATE_SUB_TASK,data);
    return response.data
  }catch(err:any){
    throw err.response?.data || new Error("Network error")
  }
}



export const employeeUnderTheProject = async (id: string) => {
  try {
    const response = await api.get(PROJECT_ROUTES.GET_EMPLOYEE_UNDER_PROJECT(id));
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const updateIssue = async (id: string, data: Record<string, unknown>) => {
  try {
    const response = await api.put(`/issues/${id}`, data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const updateSprint=async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.CREATE_SPRINT);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};





export const updateTask=async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.PROJECT_LEVEL_ALLOCATION);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};



