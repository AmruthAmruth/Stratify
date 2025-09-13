import api from './axiosInstance'


export const getAllCompanies = async (params?: {
  page?: number;
  pageSize?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
}) => {
  try {
    const response = await api.get("/company/companies", { params });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const getAllDepartmentInACompany = async () => {
  try {
    const response = await api.get("/company/company-departments");
   
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const createDepartment = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post("/company/create-department", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const createEmployee = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post("/company/create-employee", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};




export const createManager= async (data: Record<string, unknown>) => {
  try {
    const response = await api.post("/company/create-manager", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const getTeamMember = async () => {
  try {
    const response = await api.get("/company/team-members"); 
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const getUnassignedManager = async () => {
  try {
    const response = await api.get("/company/unassigned-managers");
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const getUnassignedDepartments = async () => {
  try {
    const response = await api.get("/company/unassigned-department");
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


  export const getDepartmentDetails = async (departmentId: string) => {
    try {
      const response = await api.get(`/company/department-details/${departmentId}`);
      console.log("Here is the response ",response.data);
      
      return response.data;
    } catch (err: any) {
      throw err.response?.data || new Error("Network error");
    }

}




  export const getTeamMemeberProfile=async(profileId:string)=>{
      try {
      const response = await api.get(`/company/team-member-profile/${profileId}`);
      console.log("Here is the response ",response.data);
      
      return response.data;
    } catch (err: any) {
      throw err.response?.data || new Error("Network error");
    }
  }


  export const getCompanyProfile=async(profileId:string)=>{
     try {
      const response = await api.get(`/company/company/${profileId}`);
      console.log("Here is the response ",response.data);
      
      return response.data;
    } catch (err: any) {
      throw err.response?.data || new Error("Network error");
    }
  }