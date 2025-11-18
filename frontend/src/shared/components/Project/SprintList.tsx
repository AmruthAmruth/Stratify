// components/project/SprintList.tsx
import React from "react";
import { SprintDTO, UserRole } from "./types";
import IssueList from "./IssueList"; // ✅ Added missing import

interface Props {
  sprints: SprintDTO[];
  role: UserRole;
}

const SprintList: React.FC<Props> = ({ sprints, role }) => {
  if (!sprints.length) {
    return (
      <div className="text-center py-16 bg-[#fbfbfb] rounded-2xl border border-[#dfdcef]/50 backdrop-blur-sm">
        <p className="text-xl text-[#3b3b3b]/60 font-light leading-relaxed">
          No sprints available.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {sprints.map((sprint) => (
        <div
          key={sprint.id}
          className="relative group rounded-2xl border border-[#dfdcef]/50 p-8 shadow-lg bg-gradient-to-br from-[#fbfbfb] via-white to-[#dfdcef]/10 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Subtle futuristic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#009063]/5 via-transparent to-[#009063]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="relative space-y-4">
            <h3 className="text-3xl font-black text-[#3b3b3b] leading-tight tracking-tight drop-shadow-sm">
              {sprint.name}
            </h3>
            <p className="text-lg text-[#3b3b3b]/90 leading-relaxed font-light max-w-3xl">
              {sprint.goal}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-[#3b3b3b]/70">
              <span className="flex items-center gap-2 font-mono bg-white/50 rounded-lg px-4 py-2 border border-[#dfdcef]/50 backdrop-blur-sm">
                <time className="text-[#3b3b3b] font-semibold">
                  {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
                </time>
              </span>
              <span className="flex items-center gap-3 font-medium bg-white/50 rounded-lg px-4 py-2 border border-[#dfdcef]/50 backdrop-blur-sm">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-[#009063] to-[#00d084] rounded-full shadow-lg"></span>
                <span className="text-xs text-[#3b3b3b]/60">Status:</span>
                <span className="text-[#009063] font-bold tracking-wide">{sprint.status}</span>
              </span>
            </div>

            {/* Issues Section */}
            {sprint.issues?.length > 0 && (
              <div className="mt-8">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#009063]/30 to-transparent mb-4"></div>
                <h4 className="text-xl font-black text-[#3b3b3b] mb-4 tracking-tight">
                  Issues
                </h4>
                <IssueList issues={sprint.issues} role={role} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SprintList;
