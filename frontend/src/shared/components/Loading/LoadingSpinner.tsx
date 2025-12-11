import React from "react";
import "./LoadingSpinner.css";

type LoadingVariant = "spinner" | "dots" | "pulse" | "bars" | "ring";
type LoadingSize = "small" | "medium" | "large";

interface LoadingSpinnerProps {
    variant?: LoadingVariant;
    size?: LoadingSize;
    color?: string;
    fullScreen?: boolean;
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    variant = "spinner",
    size = "medium",
    color = "#009063",
    fullScreen = false,
    text,
}) => {
    const sizeClasses = {
        small: "loading-small",
        medium: "loading-medium",
        large: "loading-large",
    };

    const renderLoader = () => {
        switch (variant) {
            case "spinner":
                return (
                    <div className={`loading-spinner ${sizeClasses[size]}`}>
                        <div className="spinner" style={{ borderTopColor: color }}></div>
                    </div>
                );

            case "dots":
                return (
                    <div className={`loading-dots ${sizeClasses[size]}`}>
                        <div className="dot" style={{ backgroundColor: color }}></div>
                        <div className="dot" style={{ backgroundColor: color }}></div>
                        <div className="dot" style={{ backgroundColor: color }}></div>
                    </div>
                );

            case "pulse":
                return (
                    <div className={`loading-pulse ${sizeClasses[size]}`}>
                        <div className="pulse-circle" style={{ backgroundColor: color }}></div>
                    </div>
                );

            case "bars":
                return (
                    <div className={`loading-bars ${sizeClasses[size]}`}>
                        <div className="bar" style={{ backgroundColor: color }}></div>
                        <div className="bar" style={{ backgroundColor: color }}></div>
                        <div className="bar" style={{ backgroundColor: color }}></div>
                        <div className="bar" style={{ backgroundColor: color }}></div>
                    </div>
                );

            case "ring":
                return (
                    <div className={`loading-ring ${sizeClasses[size]}`}>
                        <div className="ring" style={{ borderColor: `${color} transparent transparent transparent` }}></div>
                        <div className="ring" style={{ borderColor: `${color} transparent transparent transparent` }}></div>
                        <div className="ring" style={{ borderColor: `${color} transparent transparent transparent` }}></div>
                        <div className="ring" style={{ borderColor: `${color} transparent transparent transparent` }}></div>
                    </div>
                );

            default:
                return null;
        }
    };

    const content = (
        <div className="loading-content">
            {renderLoader()}
            {text && <p className="loading-text" style={{ color }}>{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="loading-fullscreen">
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;
