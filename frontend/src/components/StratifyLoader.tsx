import React from 'react';

/**
 * StratifyLoader Component
 * 
 * A professional branded loading screen for Stratify application.
 * Features animated logo, smooth transitions, and theme-aware styling.
 */
const StratifyLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-primary via-primary to-primaryHover flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-8 animate-fade-in">
                {/* Animated Logo Container */}
                <div className="relative">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 w-24 h-24 border-4 border-white/30 rounded-full animate-spin-slow" />

                    {/* Inner pulsing ring */}
                    <div className="absolute inset-2 w-20 h-20 border-4 border-white/50 rounded-full animate-pulse" />

                    {/* Logo/Brand Text */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="text-white font-bold text-3xl tracking-tight">
                            S
                        </div>
                    </div>
                </div>

                {/* Brand Name */}
                <div className="flex flex-col items-center gap-3">
                    <h1 className="text-white text-4xl font-bold tracking-wide animate-slide-up">
                        Stratify
                    </h1>

                    {/* Loading Text */}
                    <p className="text-white/90 text-lg font-medium animate-pulse-slow">
                        Loading your workspace...
                    </p>
                </div>

                {/* Loading Bar */}
                <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full animate-loading-bar" />
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slide-up {
                    from { 
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes loading-bar {
                    0% { 
                        transform: translateX(-100%);
                    }
                    100% { 
                        transform: translateX(400%);
                    }
                }
                
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                }
                
                .animate-loading-bar {
                    animation: loading-bar 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default StratifyLoader;
