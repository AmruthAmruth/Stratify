import axiosInstance from './axiosInstance';

export const getEmployeeDashboardStats = async () => {
    try {
        const response = await axiosInstance.get('/api/employee/dashboard-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching employee dashboard stats:', error);
        throw error;
    }
};
