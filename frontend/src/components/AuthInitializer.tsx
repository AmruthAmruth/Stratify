import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import StratifyLoader from './StratifyLoader';

interface AuthInitializerProps {
    children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
    const { isInitialized } = useAuth();

    if (!isInitialized) {
        return <StratifyLoader />;
    }

    return <>{children}</>;
};

export default AuthInitializer;

