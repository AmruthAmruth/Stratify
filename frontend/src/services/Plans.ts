import api from './axiosInstance';

export const createSubscription = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post("/super-admin/create-plan", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const updateSubscription = async (data: Record<string, unknown>) => {
  try {
    const response = await api.put("/super-admin/update-plan", data);
    return response.data;
  } catch (err: any) {
    throw err.response?.data || new Error("Network error");
  }
};

export const deleteSubscription = async (plan: string) => {
  try {
    const response = await api.delete("/super-admin/delete-plan", {
      data: { plan }
    });
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err; 
    } else {
      throw new Error("Network error"); 
    }
  }
};