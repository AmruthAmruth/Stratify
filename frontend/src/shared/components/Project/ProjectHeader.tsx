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
    <div className="rounded-2xl border border-accent p-8 shadow-sm bg-bg">
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-text leading-tight">
            {name}
          </h1>
          <span className="inline-block text-sm font-medium text-text/70 bg-white border border-accent px-3 py-1.5 rounded-full">
            {keyCode}
          </span>
        </div>

        <p className="text-lg text-text/80 leading-relaxed max-w-3xl">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-text/70">
          <div className="bg-white border border-accent rounded-lg p-4">
            <span className="flex items-center gap-2 font-medium">
              <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
              Status
            </span>
            <span className="block text-primary font-semibold mt-1">{status}</span>
          </div>
          <div className="bg-white border border-accent rounded-lg p-4">
            <span className="block font-medium mb-1">Start Date</span>
            <time className="text-text font-semibold block">{new Date(startDate).toLocaleDateString()}</time>
          </div>
          <div className="bg-white border border-accent rounded-lg p-4">
            <span className="block font-medium mb-1">End Date</span>
            <time className="text-text font-semibold block">{new Date(endDate).toLocaleDateString()}</time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;