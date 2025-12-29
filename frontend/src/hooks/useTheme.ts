import { useSelector } from 'react-redux';
import { RootState } from '@/store';

/**
 * Custom hook to access theme configuration from Redux store
 * Makes it easy to use dynamic themes throughout the application
 * 
 * @returns Complete theme configuration
 */
export const useTheme = () => {
    const theme = useSelector((state: RootState) => state.theme);
    return theme;
};
