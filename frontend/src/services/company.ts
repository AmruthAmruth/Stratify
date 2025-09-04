import api from './axiosInstance'

export const getAllCompanies = async (params?: {
  page?: number;
  pageSize?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
}) => {
  try {
    const response = await api.get("/company/companies", {
      params, 
    });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const getAllDepartmentInACompany = async () => {
  try {
     const response = await api.get(`/company/departments`);
     console.log("RESPONSE DATA",response.data)
     return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};
 

export const addDepartmentwithManager = async (data: Record<string, unknown>) => {
  try {
    
    const response = await api.post("/company/department", data);

    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const createEmployee = async (data:Record<string,unknown>)=>{
  try{
const response = await api.post("/company/employee", data);

    return response.data;
  }catch(err:any){
    throw err.response?.data || new Error("Network error");
  }
}

export const getTeamMember=async()=>{
  try{
const response = await api.get('/company/depa')
  }catch(err:any){
    throw err.response?.data || new Error("Network error");
  }
}