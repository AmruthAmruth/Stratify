import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SprintDTO, UserRole, EmployeeDTO } from "./types";
import IssueList from "./IssueList";
import ReusableChart from "../Chart/ReusableChart";

interface Props {
  sprints: SprintDTO[];
  role: UserRole;
  employees?: EmployeeDTO[];
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface SprintItemProps {
  sprint: SprintDTO;
  role: UserRole;
  employees?: EmployeeDTO[];
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const SprintItem: React.FC<SprintItemProps> = ({ sprint, role, employees, isExpanded, onToggle }) => {
  // Burndown Calculation
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const dateLabels = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const totalPoints = sprint.issues?.reduce((acc, i) => acc + (i.size || 0), 0) || 0;
  const completedPoints = sprint.issues?.filter((i) => i.status === "Done").reduce((acc, i) => acc + (i.size || 0), 0) || 0;
  const remainingPoints = totalPoints - completedPoints;

  const idealData = dateLabels.map((_, i) => Math.max(0, totalPoints - (totalPoints / (totalDays - 1)) * i));

  const today = new Date();
  const todayIndex = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const actualData = new Array(totalDays).fill(null);
  actualData[0] = totalPoints;
  if (todayIndex > 0 && todayIndex < totalDays) {
    actualData[todayIndex] = remainingPoints;
  } else if (todayIndex >= totalDays) {
    actualData[totalDays - 1] = remainingPoints;
  }

  // Droppable zone for Active and Planned sprints
  const canDrop = sprint.status === "Active" || sprint.status === "Planned";
  const { setNodeRef, isOver } = useDroppable({
    id: sprint.id,
    disabled: !canDrop,
    data: { sprint },
  });

  return (
    <div
      ref={canDrop ? setNodeRef : undefined}
      className={`
        relative group rounded-2xl border shadow-lg 
        bg-gradient-to-br from-bg via-white to-accent/10 
        overflow-hidden transition-all duration-300
        ${isOver && canDrop
          ? "border-primary border-4 ring-4 ring-primary/20 bg-primary/10/30"
          : "border-accent/50"
        }
      `}
    >
      {/* Header (compact drill) */}
      <button
        type="button"
        onClick={() => onToggle(sprint.id)}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between gap-4 px-8 py-6 bg-transparent hover:bg-gray-50 transition"
      >
        <div>
          <h3 className="text-2xl font-black text-text tracking-tight">
            {sprint.name}
          </h3>
          <p className="text-sm text-text/70 mt-1 max-w-xl">
            {sprint.goal}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-text/70 text-right">
            <div>
              <time className="text-text font-semibold">
                {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
              </time>
            </div>
            <div className="mt-1">
              <span className="text-xs text-text/60">Status</span>
              <div className="text-primary font-bold">{sprint.status}</div>
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

      {/* Drop Indicator Overlay */}
      {isOver && canDrop && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none flex items-center justify-center z-10">
          <div className="bg-white/95 border-2 border-primary rounded-xl px-6 py-3 shadow-xl">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Drop issue here</span>
            </div>
          </div>
        </div>
      )}

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-8 border-t bg-white">
          <div className="space-y-4">
            <p className="text-lg text-text/90 leading-relaxed font-light max-w-3xl">
              {sprint.goal}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-text/70">
              <span className="flex items-center gap-2 font-mono bg-white/50 rounded-lg px-4 py-2 border border-accent/50">
                <time className="text-text font-semibold">
                  {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
                </time>
              </span>
              <span className="flex items-center gap-3 font-medium bg-white/50 rounded-lg px-4 py-2 border border-accent/50">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-primary to-[#00d084] rounded-full shadow-lg"></span>
                <span className="text-xs text-text/60">Status:</span>
                <span className="text-primary font-bold tracking-wide">{sprint.status}</span>
              </span>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Velocity Chart */}
              <div className="bg-bg border border-accent rounded-xl p-4 h-[300px] shadow-sm">
                <ReusableChart
                  type="bar"
                  title="Sprint Velocity (Points)"
                  labels={["Committed", "Completed"]}
                  data={[
                    sprint.issues?.reduce((acc, i) => acc + (i.size || 0), 0) || 0,
                    sprint.issues?.filter((i) => i.status === "Done").reduce((acc, i) => acc + (i.size || 0), 0) || 0,
                  ]}
                  backgroundColors={["#3b3b3b", "#009063"]}
                />
              </div>

              {/* Burndown Chart */}
              <div className="bg-bg border border-accent rounded-xl p-4 h-[300px] shadow-sm">
                <ReusableChart
                  type="line"
                  title="Burndown Chart"
                  labels={dateLabels}
                  datasets={[
                    {
                      label: "Ideal Burndown",
                      data: idealData,
                      borderColor: "#dfdcef",
                      borderDash: [5, 5],
                      borderWidth: 2,
                      pointRadius: 0,
                    },
                    {
                      label: "Actual Remaining",
                      data: actualData,
                      borderColor: "#009063",
                      backgroundColor: "#009063",
                      borderWidth: 2,
                      spanGaps: true,
                      tension: 0.1,
                    },
                  ]}
                />
              </div>

              {/* Workload by Assignee */}
              <div className="bg-bg border border-accent rounded-xl p-4 h-[300px] shadow-sm">
                <ReusableChart
                  type="bar"
                  title="Workload by Assignee"
                  labels={
                    Array.from(new Set(sprint.issues?.map((i) => i.assignedTo).filter(Boolean)))
                      .map((id) => employees?.find((e) => e.id === id)?.name || "Unknown")
                  }
                  data={
                    Array.from(new Set(sprint.issues?.map((i) => i.assignedTo).filter(Boolean)))
                      .map((id) =>
                        sprint.issues
                          ?.filter((i) => i.assignedTo === id)
                          .reduce((acc, i) => acc + (i.size || 0), 0) || 0
                      )
                  }
                  backgroundColors={["#3b3b3b"]}
                />
              </div>
            </div>

            {/* Issues Section */}
            {sprint.issues?.length > 0 ? (
              <div className="mt-6">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4"></div>
                <h4 className="text-xl font-black text-text mb-4 tracking-tight">
                  Issues
                </h4>
                <IssueList issues={sprint.issues} role={role} employees={employees} />
              </div>
            ) : (
              <div className="mt-6 text-sm text-text/60">
                No issues in this sprint.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SprintList: React.FC<Props> = ({ sprints, role, employees }) => {
  const [expandedSprints, setExpandedSprints] = useState<Set<string>>(new Set());

  if (!sprints.length) {
    return (
      <div className="text-center py-16 bg-bg rounded-2xl border border-accent/50 backdrop-blur-sm">
        <p className="text-xl text-text/60 font-light leading-relaxed">
          No sprints available.
        </p>
      </div>
    );
  }

  const toggleSprint = (id: string) => {
    setExpandedSprints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {sprints.map((sprint) => (
        <SprintItem
          key={sprint.id}
          sprint={sprint}
          role={role}
          employees={employees}
          isExpanded={expandedSprints.has(sprint.id)}
          onToggle={toggleSprint}
        />
      ))}
    </div>
  );
};

export default SprintList;
