import axiosInstance from './axiosInstance';
import { EMPLOYEE_ROUTES } from '@/constants/routes';
import type { UserProfile, EmployeeDashboardStats, EmployeeChartData } from '@/types/types';

// Dashboard stats response type
export interface DashboardStatsResponse {
    stats?: EmployeeDashboardStats;
    graphs?: EmployeeChartData;
}

export const getEmployeeDashboardStats = async (): Promise<DashboardStatsResponse> => {
    try {
        const response = await axiosInstance.get('/api/employee/dashboard-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching employee dashboard stats:', error);
        throw error;
    }
};

export const getEmployeeProfile = async (): Promise<UserProfile> => {
    try {
        const response = await axiosInstance.get(EMPLOYEE_ROUTES.GET_PROFILE);
        return response.data;
    } catch (error) {
        console.error('Error fetching employee profile:', error);
        throw error;
    }
};

export const updateEmployeeProfile = async (data: Record<string, unknown>): Promise<UserProfile> => {
    try {
        const response = await axiosInstance.put(EMPLOYEE_ROUTES.UPDATE_PROFILE, data);
        return response.data;
    } catch (error) {
        console.error('Error updating employee profile:', error);
        throw error;
    }
};
