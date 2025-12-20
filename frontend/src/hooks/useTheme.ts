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
        mode: theme.mode,
        companyColor: theme.companyColor,
        // Derived colors for common use cases
        primaryColor: theme.companyColor || '#009063',
        primaryHover: `${theme.companyColor || '#009063'}dd`, // Slightly transparent for hover
    };
};
