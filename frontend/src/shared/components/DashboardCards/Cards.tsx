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
    <div className="bg-[#fbfbfb] border mt-5 mb-10 border-[#dfdcef] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between w-full group hover:border-[#c7c4e4]">
      {/* Title and Trend */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[#3b3b3b] uppercase tracking-wider">
          {title}
        </h3>
        {trend !== "none" && (
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              trend === "up"
                ? "bg-[#009063]/10 text-[#009063]"
                : "bg-red-100 text-red-600"
            }`}
          >
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
        <span className="text-4xl font-bold text-[#3b3b3b] leading-none">
          {value}
        </span>
        {badge && (
          <span className="text-xs font-medium bg-[#009063]/10 text-[#009063] px-3 py-1.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-[#3b3b3b]/70 font-medium">{subtitle}</p>
      )}

      {/* Subtle bottom accent */}
      <div className="mt-4 w-full h-0.5 bg-gradient-to-r from-[#009063] via-[#dfdcef] to-[#009063] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default DashboardCard;
