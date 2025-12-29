import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '@/store';
import { resetToDefaultTheme } from '@/store/slices/themeSlice';
import { applyFullTheme } from '@/utils/themeUtils';
import { DEFAULT_THEME } from '@/types/theme';

interface ThemeProviderProps {
    children: React.ReactNode;
}

// Define public routes that should always use default theme
const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/verify-otp',
    '/forgot-otp',
    '/forgot-password',
    '/reset-password',
    '/about',
    '/contact',
    '/pricing',
    '/super-admin-login'
];

/**
 * ThemeProvider component that manages and applies company theme
 * Listens to Redux state and updates CSS variables accordingly
 * Applies default theme for public routes and company theme for authenticated routes
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);
    const location = useLocation();

    // Check if current route is a public route
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

    // Apply theme based on route and authentication status
    useEffect(() => {
        if (isPublicRoute) {
            // Always apply default theme for public routes
            console.log('🎨 ThemeProvider: Applying default theme for public route', location.pathname);
            applyFullTheme({
                ...DEFAULT_THEME,
                themeMode: DEFAULT_THEME.themeMode,
            });
        } else if (isAuthenticated) {
            // Apply company theme for authenticated routes
            console.log('🎨 ThemeProvider: Applying company theme', theme);
            applyFullTheme({
                primaryColor: theme.primaryColor,
                secondaryColor: theme.secondaryColor,
                accentColor: theme.accentColor,
                backgroundColor: theme.backgroundColor,
                textColor: theme.textColor,
                surfaceColor: theme.surfaceColor,
                borderColor: theme.borderColor,
                mutedColor: theme.mutedColor,
                headingColor: theme.headingColor,
                themeMode: theme.themeMode,
            });
            console.log('✅ ThemeProvider: Company theme applied successfully');
        } else {
            // Fallback to default theme for unauthenticated users on protected routes
            console.log('🎨 ThemeProvider: Applying default theme (unauthenticated)');
            applyFullTheme({
                ...DEFAULT_THEME,
                themeMode: DEFAULT_THEME.themeMode,
            });
        }
    }, [theme, isAuthenticated, isPublicRoute, location.pathname]);

    // Theme persistence: We no longer reset the theme on logout
    // This allows the company theme to persist for the next login
    // The ThemeProvider will still apply the default theme for public routes (like login)
    // based on the isPublicRoute check above

    return <>{children}</>;
};
