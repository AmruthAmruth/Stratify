import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthInitializerProps {
    children: React.ReactNode;
}

/**
 * AuthInitializer Component
 * 
 * This component ensures that the authentication state is properly initialized
 * before rendering the application. It attempts to restore the user's session
 * from the refresh token stored in HTTP-only cookies.
 * 
 * Flow:
 * 1. On mount, calls the refresh token endpoint via useAuth hook
 * 2. If successful, restores access token to Redux state
 * 3. Once initialized, renders children components
 * 4. Shows loading spinner during initialization
 */
const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
    const { isInitialized } = useAuth();

    if (!isInitialized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '5px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '5px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }} />
                    <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
                    <p style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '500',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}>
                        Initializing session...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthInitializer;
