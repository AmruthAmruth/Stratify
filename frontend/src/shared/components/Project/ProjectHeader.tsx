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
    <div className="rounded-2xl border border-[#dfdcef] p-8 shadow-sm bg-[#fbfbfb]">
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-[#3b3b3b] leading-tight">
            {name}
          </h1>
          <span className="inline-block text-sm font-medium text-[#3b3b3b]/70 bg-white border border-[#dfdcef] px-3 py-1.5 rounded-full">
            {keyCode}
          </span>
        </div>

        <p className="text-lg text-[#3b3b3b]/80 leading-relaxed max-w-3xl">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#3b3b3b]/70">
          <div className="bg-white border border-[#dfdcef] rounded-lg p-4">
            <span className="flex items-center gap-2 font-medium">
              <span className="inline-block w-2 h-2 bg-[#009063] rounded-full"></span>
              Status
            </span>
            <span className="block text-[#009063] font-semibold mt-1">{status}</span>
          </div>
          <div className="bg-white border border-[#dfdcef] rounded-lg p-4">
            <span className="block font-medium mb-1">Start Date</span>
            <time className="text-[#3b3b3b] font-semibold block">{new Date(startDate).toLocaleDateString()}</time>
          </div>
          <div className="bg-white border border-[#dfdcef] rounded-lg p-4">
            <span className="block font-medium mb-1">End Date</span>
            <time className="text-[#3b3b3b] font-semibold block">{new Date(endDate).toLocaleDateString()}</time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;