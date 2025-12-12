import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/axiosInstance';

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

export const useAuth = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Try to refresh token from cookie
                const response = await api.post('/api/auth/refresh-token');
                const { accessToken } = response.data;

                if (accessToken) {
                    const decoded: DecodedToken = jwtDecode(accessToken);

                    dispatch(setCredentials({
                        accessToken,
                        role: decoded.role,
                        userId: decoded.id,
                        name: null, // Will be fetched by profile endpoints
                    }));
                    console.log('Session restored successfully');
                }
            } catch (error: any) {
                // Silently handle errors - user is simply not logged in
                if (error.response?.status === 404 || error.response?.status === 401) {
                    console.log('No valid session found - user not logged in');
                } else {
                    console.error('Session restoration error:', error.message);
                }
            } finally {
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, [dispatch]);

    return { isInitialized };
};
