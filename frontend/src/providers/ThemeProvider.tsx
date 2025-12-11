import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCompanyColor } from '@/store/slices/themeSlice';
import { applyThemeColors } from '@/utils/themeUtils';

interface ThemeProviderProps {
    children: React.ReactNode;
}

/**
 * ThemeProvider component that manages and applies company theme colors
 * Listens to Redux state and updates CSS variables accordingly
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const dispatch = useDispatch();
    const companyThemeColor = useSelector((state: RootState) => state.auth.companyThemeColor);
    const themeBackgroundColor = useSelector((state: RootState) => state.auth.themeBackgroundColor);
    const themeTextColor = useSelector((state: RootState) => state.auth.themeTextColor);
    const themeColor = useSelector((state: RootState) => state.theme.companyColor);

    // Apply theme colors from auth state (background + text from logo extraction)
    useEffect(() => {
        if (themeBackgroundColor && themeTextColor) {
            const root = document.documentElement;
            root.style.setProperty('--theme-bg-color', themeBackgroundColor);
            root.style.setProperty('--theme-text-color', themeTextColor);

            // Also apply as primary color
            applyThemeColors(themeBackgroundColor);
        } else if (companyThemeColor) {
            // Fallback to single theme color if no extracted colors
            dispatch(setCompanyColor(companyThemeColor));
            applyThemeColors(companyThemeColor);
        }
    }, [themeBackgroundColor, themeTextColor, companyThemeColor, dispatch]);

    // Apply theme color from theme state (when theme is changed manually)
    useEffect(() => {
        if (themeColor) {
            applyThemeColors(themeColor);
        }
    }, [themeColor]);

    return <>{children}</>;
};
