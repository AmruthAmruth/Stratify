import axiosInstance from './axiosInstance';
import type { SuperAdminProfile } from '@/types/types';

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
