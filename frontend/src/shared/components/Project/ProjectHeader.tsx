// components/project/ProjectHeader.tsx
import React from "react";

interface Props {
  name: string;
  keyCode: string;
  status: string;
  startDate: string;
  endDate: string;
  description: string;
}

const ProjectHeader: React.FC<Props> = ({
  name,
  keyCode,
  status,
  startDate,
  endDate,
  description,
}) => {
  return (
    <div className="rounded-xl border border-[#dfdcef] p-6 shadow-md space-y-4 bg-[#fbfbfb]">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold text-[#3b3b3b] leading-tight">
          {name}
          <span className="ml-2 inline-block text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {keyCode}
          </span>
        </h1>
      </div>

      <p className="text-lg text-[#3b3b3b] leading-relaxed max-w-2xl">
        {description}
      </p>

      <div className="flex flex-wrap gap-6 text-sm text-gray-600">
        <span className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 bg-[#009063] rounded-full"></span>
          Status: <span className="text-[#009063] font-semibold">{status}</span>
        </span>
        <span className="flex items-center gap-1">
          Start: <time className="text-[#3b3b3b] font-medium">{new Date(startDate).toLocaleDateString()}</time>
        </span>
        <span className="flex items-center gap-1">
          End: <time className="text-[#3b3b3b] font-medium">{new Date(endDate).toLocaleDateString()}</time>
        </span>
      </div>
      
    </div>
  );
};

export default ProjectHeader;