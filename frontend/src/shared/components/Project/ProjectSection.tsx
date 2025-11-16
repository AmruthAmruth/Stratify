// components/project/ProjectSection.tsx
import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const ProjectSection: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
};

export default ProjectSection;