/**
 * Theme type definitions for the application
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
    themeName: string;
    themeMode: ThemeMode;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    surfaceColor: string;
    borderColor: string;
    mutedColor: string;
    headingColor: string;
    isCustom: boolean;
    companyId?: string;
    isCompanyTheme?: boolean;
}

export interface ThemePreset {
    name: string;
    mode: ThemeMode;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    surfaceColor: string;
    borderColor: string;
    mutedColor: string;
    headingColor: string;
}

export const DEFAULT_THEME: ThemeConfig = {
    themeName: 'Clean Professional',
    themeMode: 'light',
    primaryColor: '#16a34a',
    secondaryColor: '#1f2937',
    accentColor: '#e5e7eb',
    backgroundColor: '#f7faf9',
    textColor: '#1f2937',
    surfaceColor: '#ffffff',
    borderColor: '#e5e7eb',
    mutedColor: '#6b7280',
    headingColor: '#0f172a',
    isCustom: false,
};
