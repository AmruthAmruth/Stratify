import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import api from '@/services/axiosInstance';

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
    name?: string;
}

export const useAuth = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async (retryCount = 0) => {
            let shouldRetry = false;

            try {
                // Try to refresh token from cookie
                const response = await api.post('/auth/refresh-token');
                const { accessToken } = response.data;

                if (!accessToken) {
                    console.log('No access token received from refresh');
                    return;
                }

                // Decode and validate the token
                try {
                    const decoded: DecodedToken = jwtDecode(accessToken);

                    // Validate required fields
                    if (!decoded.id || !decoded.role || !decoded.exp) {
                        console.error('Invalid token payload - missing required fields');
                        return;
                    }

                    // Check if token is already expired
                    if (decoded.exp * 1000 < Date.now()) {
                        console.error('Received expired token from refresh');
                        return;
                    }

                    dispatch(setCredentials({
                        accessToken,
                        role: decoded.role,
                        userId: decoded.id,
                        name: decoded.name || null,
                    }));

                    console.log('Session restored successfully');
                } catch (decodeError) {
                    console.error('Failed to decode token:', decodeError);
                }
            } catch (error: unknown) {
                const err = error as { response?: { status?: number }; message?: string };
                const status = err.response?.status;
                const isNetworkError = !err.response && err.message === 'Network Error';

                // Handle different error types
                if (status === 404 || status === 401) {
                    // No valid refresh token - user is not logged in (expected)
                    console.log('No valid session found - user not logged in');
                } else if (isNetworkError && retryCount < 2) {
                    // Retry on network errors (up to 2 retries)
                    console.log(`Network error during session restoration, retrying... (${retryCount + 1}/2)`);
                    shouldRetry = true;
                    setTimeout(() => initializeAuth(retryCount + 1), 1000 * (retryCount + 1));
                } else if (status && status >= 500) {
                    // Server error
                    console.error('Server error during session restoration:', status);
                } else {
                    // Other errors
                    console.error('Session restoration error:', err.message);
                }
            } finally {
                // Only set initialized if we're not going to retry
                if (!shouldRetry) {
                    setIsInitialized(true);
                }
            }
        };

        initializeAuth();
    }, [dispatch]);

    return { isInitialized };
};
