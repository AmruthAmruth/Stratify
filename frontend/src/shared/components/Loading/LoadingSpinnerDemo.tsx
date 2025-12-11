import React, { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

/**
 * Demo component showing all LoadingSpinner variants
 * This file is for demonstration purposes only
 */
const LoadingSpinnerDemo: React.FC = () => {
    const [showFullscreen, setShowFullscreen] = useState(false);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                Loading Spinner Variants
            </h1>

            {/* Size Variations */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                    Size Variations
                </h2>
                <div className="flex items-end gap-8">
                    <div className="text-center">
                        <LoadingSpinner size="small" />
                        <p className="mt-2 text-sm text-gray-600">Small</p>
                    </div>
                    <div className="text-center">
                        <LoadingSpinner size="medium" />
                        <p className="mt-2 text-sm text-gray-600">Medium</p>
                    </div>
                    <div className="text-center">
                        <LoadingSpinner size="large" />
                        <p className="mt-2 text-sm text-gray-600">Large</p>
                    </div>
                </div>
            </section>

            {/* Variant Demonstrations */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                    Animation Variants
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="spinner" />
                        <p className="mt-4 text-sm font-medium text-gray-600">Spinner</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="dots" />
                        <p className="mt-4 text-sm font-medium text-gray-600">Dots</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="pulse" />
                        <p className="mt-4 text-sm font-medium text-gray-600">Pulse</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="bars" />
                        <p className="mt-4 text-sm font-medium text-gray-600">Bars</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="ring" />
                        <p className="mt-4 text-sm font-medium text-gray-600">Ring</p>
                    </div>
                </div>
            </section>

            {/* With Text */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                    With Loading Text
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="spinner" text="Loading..." />
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="dots" text="Please wait..." />
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="pulse" text="Fetching data..." />
                    </div>
                </div>
            </section>

            {/* Custom Colors */}
            <section className="mb-12 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                    Custom Colors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="spinner" color="#009063" />
                        <p className="mt-4 text-sm text-gray-600">#009063</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="dots" color="#3b3b3b" />
                        <p className="mt-4 text-sm text-gray-600">#3b3b3b</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="pulse" color="#ef4444" />
                        <p className="mt-4 text-sm text-gray-600">#ef4444</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="bars" color="#3b82f6" />
                        <p className="mt-4 text-sm text-gray-600">#3b82f6</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded">
                        <LoadingSpinner variant="ring" color="#8b5cf6" />
                        <p className="mt-4 text-sm text-gray-600">#8b5cf6</p>
                    </div>
                </div>
            </section>

            {/* Fullscreen Demo */}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                    Fullscreen Mode
                </h2>
                <button
                    onClick={() => setShowFullscreen(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    Show Fullscreen Loading
                </button>
                <p className="mt-2 text-sm text-gray-600">
                    Click to see fullscreen loading overlay (will auto-close after 3 seconds)
                </p>
            </section>

            {/* Fullscreen Loading */}
            {showFullscreen && (
                <LoadingSpinner
                    fullScreen={true}
                    variant="spinner"
                    text="Loading your content..."
                    color="#009063"
                />
            )}

            {/* Auto-close fullscreen after 3 seconds */}
            {showFullscreen &&
                setTimeout(() => setShowFullscreen(false), 3000) &&
                null}
        </div>
    );
};

export default LoadingSpinnerDemo;
