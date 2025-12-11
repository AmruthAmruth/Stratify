import api from './axiosInstance';

/**
 * Update company theme color
 */
export const updateCompanyTheme = async (themeColor: string) => {
    const response = await api.patch('/company/theme', { themeColor });
    return response.data;
};

/**
 * Get company profile (includes theme color)
 */
export const getCompanyProfile = async (companyId: string) => {
    const response = await api.get(`/company/${companyId}`);
    return response.data;
};
