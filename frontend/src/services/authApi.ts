import api from './axiosInstance'




export const superAdminLogin = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/super-admin/login", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};



export const companyRegistration = async (data: any) => {
  try {
    const formData = new FormData();

    
      for (const key in data) {
      if (key === "profileImage" && data.profileImage instanceof File) {
       
        formData.append("profileImage", data.profileImage);
      } else {
       
        formData.append(key, String(data[key]));
      }
    }


    const response = await api.post("/company/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const verifyOTP = async (data: { otp: string; email: string }) => {
  try {
    const response = await api.post("/company/verify-otp", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};


export const companyLogin = async (data:{email:string,password:string})=>{
    try{
      const response = await api.post('/company/login',data);
      return response.data
    }catch(err:any){
       throw err.response?.data || new Error("Network error");
    }
}


export const logout = async()=>{
  try{
    const response = await api.post('company/logout');
    return response.data;
  }catch(err:any){
      throw err.response?.data || new Error("Network error");
  }
}