import React, { useState } from "react";

interface SimpleCollapsibleProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

const SimpleCollapsible: React.FC<SimpleCollapsibleProps> = ({
    title,
    defaultOpen = true,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-bg border border-accent rounded-xl shadow-sm overflow-hidden">
            <div
                className="bg-bg p-4 cursor-pointer hover:bg-accent transition-colors flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-bold text-heading">{title}</h3>
                <div
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all duration-300 ${isOpen
                        ? "bg-primary text-white transform rotate-180"
                        : "bg-accent text-text hover:bg-[#d0cce3]"
                        }`}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                    </svg>
                </div>
            </div>
            {isOpen && <div className="p-6">{children}</div>}
        </div>
    );
};

export default SimpleCollapsible;
