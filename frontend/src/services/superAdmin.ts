import axiosInstance from './axiosInstance';
import type { SuperAdminProfile } from '@/types/types';

// Dashboard stats response type
export interface SuperAdminDashboardResponse {
    stats?: {
        totalCompanies: number;
        activeCompanies: number;
        pendingApprovals: number;
        totalRevenue: number;
    };
    graphs?: Record<string, unknown>;
    totalCompanies?: number;
    activeCompanies?: number;
    pendingApprovals?: number;
    totalRevenue?: number;
}

export const getSuperAdminProfile = async (): Promise<SuperAdminProfile> => {
    try {
        const response = await axiosInstance.get('/api/super-admin/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching super admin profile:', error);
        throw error;
    }
};

export const updateSuperAdminProfile = async (data: FormData): Promise<SuperAdminProfile> => {
    try {
        const response = await axiosInstance.put('/api/super-admin/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating super admin profile:', error);
        throw error;
    }
};

export const getSuperAdminDashboardStats = async (): Promise<SuperAdminDashboardResponse> => {
    try {
        const response = await axiosInstance.get('/api/super-admin/dashboard-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching super admin dashboard stats:', error);
        throw error;
    }
};
