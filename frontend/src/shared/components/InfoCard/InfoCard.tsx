import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  hoverColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  icon, 
  label, 
  value, 
  bgColor, 
  hoverColor = "hover:scale-105" 
}) => {
  return (
    <div className="group relative overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-gray-100/30 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      
      {/* Main card */}
      <div className={`
        relative bg-white backdrop-blur-sm
        p-6 rounded-2xl border border-gray-100/60
        shadow-sm hover:shadow-lg hover:shadow-gray-200/50
        transition-all duration-300 ease-out
        hover:border-gray-200/80 hover:-translate-y-1
        ${hoverColor}
        before:absolute before:inset-0 before:rounded-2xl 
        before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-gray-50/20
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
      `}>
        
        {/* Content */}
        <div className="relative flex items-center gap-5">
          
          {/* Icon container with enhanced styling */}
          <div className={`
            relative p-4 rounded-xl ${bgColor}
            shadow-sm group-hover:shadow-md
            transition-all duration-300 ease-out
            group-hover:scale-110 group-hover:rotate-3
            before:absolute before:inset-0 before:rounded-xl
            before:bg-gradient-to-br before:from-white/20 before:to-transparent
            before:opacity-0 group-hover:before:opacity-100
            before:transition-opacity before:duration-300
          `}>
            <div className="relative z-10 flex items-center justify-center">
              {React.cloneElement(icon as React.ReactElement, { 
                className: "w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors duration-300" 
              })}
            </div>
            
            {/* Subtle inner glow effect */}
            <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider letter-spacing-wide group-hover:text-gray-600 transition-colors duration-300">
              {label}
            </p>
            <p className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 truncate">
              {value}
            </p>
            
            {/* Subtle underline effect */}
            <div className="w-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 mt-2 group-hover:w-full transition-all duration-500 ease-out"></div>
          </div>
        </div>
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-gray-100/40 to-transparent transform rotate-45 translate-x-4 -translate-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Subtle bottom border */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default InfoCard;