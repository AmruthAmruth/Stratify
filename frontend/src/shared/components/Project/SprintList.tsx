import React, { useState } from "react";
import { SprintDTO, UserRole, EmployeeDTO } from "./types";
import IssueList from "./IssueList";

interface Props {
  sprints: SprintDTO[];
  role: UserRole;
  employees?: EmployeeDTO[];
}

const SprintList: React.FC<Props> = ({ sprints, role, employees }) => {
  const [expandedSprints, setExpandedSprints] = useState<Set<string>>(new Set());

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

  const toggleSprint = (id: string) => {
    setExpandedSprints(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {sprints.map((sprint) => {
        const isExpanded = expandedSprints.has(sprint.id);

        return (
          <div
            key={sprint.id}
            className="relative group rounded-2xl border border-[#dfdcef]/50 shadow-lg bg-gradient-to-br from-[#fbfbfb] via-white to-[#dfdcef]/10 overflow-hidden transition-all duration-300"
          >
            {/* Header (compact drill) */}
            <button
              type="button"
              onClick={() => toggleSprint(sprint.id)}
              aria-expanded={isExpanded}
              className="w-full flex items-center justify-between gap-4 px-8 py-6 bg-transparent hover:bg-gray-50 transition"
            >
              <div>
                <h3 className="text-2xl font-black text-[#3b3b3b] tracking-tight">
                  {sprint.name}
                </h3>
                <p className="text-sm text-[#3b3b3b]/70 mt-1 max-w-xl">
                  {sprint.goal}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-[#3b3b3b]/70 text-right">
                  <div>
                    <time className="text-[#3b3b3b] font-semibold">
                      {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
                    </time>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-[#3b3b3b]/60">Status</span>
                    <div className="text-[#009063] font-bold">{sprint.status}</div>
                  </div>
                </div>

                <svg
                  className={`w-6 h-6 transform transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div className="p-8 border-t bg-white">
                <div className="space-y-4">
                  <p className="text-lg text-[#3b3b3b]/90 leading-relaxed font-light max-w-3xl">
                    {sprint.goal}
                  </p>

                  <div className="flex flex-wrap gap-6 text-sm text-[#3b3b3b]/70">
                    <span className="flex items-center gap-2 font-mono bg-white/50 rounded-lg px-4 py-2 border border-[#dfdcef]/50">
                      <time className="text-[#3b3b3b] font-semibold">
                        {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
                      </time>
                    </span>
                    <span className="flex items-center gap-3 font-medium bg-white/50 rounded-lg px-4 py-2 border border-[#dfdcef]/50">
                      <span className="inline-block w-3 h-3 bg-gradient-to-r from-[#009063] to-[#00d084] rounded-full shadow-lg"></span>
                      <span className="text-xs text-[#3b3b3b]/60">Status:</span>
                      <span className="text-[#009063] font-bold tracking-wide">{sprint.status}</span>
                    </span>
                  </div>

                  {/* Issues Section */}
                  {sprint.issues?.length > 0 ? (
                    <div className="mt-6">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#009063]/30 to-transparent mb-4"></div>
                      <h4 className="text-xl font-black text-[#3b3b3b] mb-4 tracking-tight">
                        Issues
                      </h4>
                      <IssueList issues={sprint.issues} role={role} employees={employees} />
                    </div>
                  ) : (
                    <div className="mt-6 text-sm text-[#3b3b3b]/60">
                      No issues in this sprint.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SprintList;
