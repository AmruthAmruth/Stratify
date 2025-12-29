import api from './axiosInstance';
import { ThemeConfig, ThemePreset } from '@/types/theme';

/**
 * Get company theme by company ID
 */
export const getCompanyTheme = async (companyId: string) => {
    const response = await api.get(`/api/company/theme/${companyId}`);
    return response.data;
};

/**
 * Update company theme with full configuration
 */
export const updateCompanyTheme = async (themeConfig: Omit<ThemeConfig, 'isCustom'> & { isCustom?: boolean }) => {
    const response = await api.put('/api/company/theme', themeConfig);
    return response.data;
};

/**
 * Get all available theme presets
 */
export const getThemePresets = async (): Promise<{ response: ThemePreset[] }> => {
    const response = await api.get('/api/company/theme-presets');
    return response.data;
};

/**
 * Apply a preset theme by name
 */
export const applyPresetTheme = async (presetName: string) => {
    const response = await api.post('/api/company/theme/apply-preset', { presetName });
    return response.data;
};
