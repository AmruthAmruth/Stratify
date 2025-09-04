import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

type DashboardCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "none";
  badge?: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  trend = "none",
  badge,
}) => {
  return (
     <div className="bg-white border mt-5 mb-10 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between w-full group hover:border-gray-300">
      {/* Title and Trend */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
          {title}
        </h3>
        {trend !== "none" && (
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            trend === "up" 
              ? "bg-emerald-50 text-emerald-600" 
              : "bg-red-50 text-red-600"
          }`}>
            {trend === "up" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>

      {/* Value and Badge */}
      <div className="flex items-end justify-between mb-2">
        <span className="text-4xl font-bold text-gray-900 leading-none">
          {value}
        </span>
        {badge && (
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-gray-500 font-medium">
          {subtitle}
        </p>
      )}
      
      {/* Subtle bottom accent */}
      <div className="mt-4 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default DashboardCard;
