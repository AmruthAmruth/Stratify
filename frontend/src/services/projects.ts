

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


export const createBacklog=async(data:Record<string, unknown>)=>{
  try{
    const response = await api.post(PROJECT_ROUTES.CREATE_BACKLOG,data);
    return response.data
  }catch(err:any){
    throw err.response?.data || new Error("Network error")
  }
}



export const createStory=async(data:Record<string, unknown>)=>{
  try{
    const response = await api.post(PROJECT_ROUTES.CREATE_STORY,data);
    return response.data
  }catch(err:any){
    throw err.response?.data || new Error("Network error")
  }
}





export const createTask=async(data:Record<string, unknown>)=>{
  try{
    const response = await api.post(PROJECT_ROUTES.CREATE_TASK,data);
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


export const updateIssue=async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.PROJECT_LEVEL_ALLOCATION);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const updateSprint=async () => {
  try {
    const response = await api.get(PROJECT_ROUTES.PROJECT_LEVEL_ALLOCATION);
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
