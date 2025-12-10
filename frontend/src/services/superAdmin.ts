import axiosInstance from './axiosInstance';

export const getSuperAdminProfile = async () => {
    try {
        const response = await axiosInstance.get('/api/super-admin/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching super admin profile:', error);
        throw error;
    }
};

export const updateSuperAdminProfile = async (data: FormData) => {
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
