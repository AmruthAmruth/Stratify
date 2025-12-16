import { useSelector } from 'react-redux';
import { RootState } from '@/store';

/**
 * Custom hook to access theme colors from Redux store
 * Makes it easy to use dynamic themes throughout the application
 * 
 * @returns Theme colors object
 */
export const useTheme = () => {
    const theme = useSelector((state: RootState) => state.theme);

    return {
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        accentColor: theme.accentColor,
        backgroundColor: theme.backgroundColor,
        textColor: theme.textColor,
        mode: theme.mode,
        themeName: theme.themeName,
        isCustom: theme.isCustom,

        // Derived colors for common use cases
        primaryHover: `${theme.primaryColor}dd`, // Slightly transparent for hover
        accentTransparent: `${theme.accentColor}50`, // 50% transparent accent
    };
};
