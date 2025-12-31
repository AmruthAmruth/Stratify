
import React, { useState, ReactNode, Dispatch, SetStateAction } from "react";
import ReusableChart from "../Chart/ReusableChart";


interface LocalSubTask {
  id?: string;
  _id?: string;
  heading: string;
  description?: string;
  status: string;
  hours?: number;
  assignedToId?: string;
}

interface LocalIssue {
  id?: string;
  _id?: string;
  heading: string;
  description?: string;
  type?: string;
  status: string;
  priority?: string;
  size?: number;
  estimatedHours?: number;
  acceptanceCriteria?: string;
  assignedTo?: string;
  subTasks?: LocalSubTask[];
}

interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  data: unknown[];
  type: 'sprint' | 'backlog';
  expandedItem: string | null;
  setExpandedItem: Dispatch<SetStateAction<string | null>>;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  getTypeColor: (type: string) => string;
  onAssignIssue?: (sprintId: string) => void;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  iconBgColor,
  data,
  type,
  expandedItem,
  setExpandedItem,
  getStatusColor,
  getPriorityColor,
  getTypeColor,
  onAssignIssue
}) => {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  return (
    <div className="bg-bg rounded-lg shadow-md border border-accent overflow-hidden">
      <div className="bg-bg p-6 border-b border-accent">
        <h3 className="text-2xl font-bold text-text flex items-center">
          <div className={`w-8 h-8 ${iconBgColor} rounded flex items-center justify-center mr-3`}>
            {icon}
          </div>
          {title}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {data.map((item, index) => {
          const typedItem = item as Record<string, unknown>;
          const itemId = String(type === 'sprint' ? (typedItem.id || typedItem._id) : (typedItem.id || typedItem._id));
          const isExpanded = expandedItem === itemId;

          // For backlog items, render differently
          if (type === 'backlog') {
            const backlogItem = item as LocalIssue;
            return (
              <div
                key={itemId}
                className="border border-accent rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div
                  className="bg-bg p-5 cursor-pointer hover:bg-accent transition-all duration-200"
                  onClick={() => setExpandedItem(isExpanded ? null : itemId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${getTypeColor(backlogItem.type || '')}`}>
                          {backlogItem.type}
                        </span>
                        <h4 className="text-lg font-bold text-text">{backlogItem.heading}</h4>
                      </div>

                      <p className="text-text text-sm leading-relaxed mb-3 opacity-80">
                        {backlogItem.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(backlogItem.status)}`}>
                          {backlogItem.status}
                        </span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded border ${getPriorityColor(backlogItem.priority || '')}`}>
                          {backlogItem.priority}
                        </span>
                        <div className="flex items-center space-x-2 text-sm text-text">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z" />
                          </svg>
                          <span className="font-medium">{backlogItem.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-text">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                          <span className="font-medium">Size: {backlogItem.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div
                        className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${isExpanded
                          ? "bg-primary text-white transform rotate-180"
                          : "bg-accent text-text hover:bg-[#d0cce3]"
                          }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="p-6 bg-bg border-t border-accent">
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-semibold text-text mb-2">Acceptance Criteria</h5>
                        <p className="text-sm text-text opacity-80 leading-relaxed">{backlogItem.acceptanceCriteria}</p>
                      </div>
                      {backlogItem.assignedTo && (
                        <div className="flex items-center space-x-2 text-sm text-text">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                          <span className="font-medium">Assigned to: {backlogItem.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // For sprint items
          interface SprintItem {
            id?: string;
            _id?: string;
            name: string;
            goal: string;
            status: string;
            startDate: string;
            endDate: string;
            issues: LocalIssue[];
          }
          const sprintItem = item as SprintItem;
          return (
            <div
              key={itemId}
              className="border-2 border-accent rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`bg-bg p-6 cursor-pointer hover:bg-accent transition-all duration-300`}
                onClick={() => setExpandedItem(isExpanded ? null : itemId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded">
                        {sprintItem.name}
                      </span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(sprintItem.status)}`}>
                        {sprintItem.status}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-text mb-3">{sprintItem.goal}</h4>

                    <p className="text-text text-sm leading-relaxed mb-3 opacity-80">
                      {new Date(sprintItem.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(sprintItem.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    <div className="flex items-center space-x-6">
                      <span className="text-sm font-semibold text-primary">
                        {sprintItem.issues.length} {sprintItem.issues.length === 1 ? "Issue" : "Issues"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div
                      className={`w-12 h-12 rounded flex items-center justify-center transition-all duration-300 ${isExpanded
                        ? "bg-primary text-white transform rotate-180"
                        : "bg-accent text-text hover:bg-[#d0cce3]"
                        }`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="p-6 space-y-6 bg-bg border-t border-accent">
                  <div className="flex justify-end mb-4">
                    {onAssignIssue && (
                      <button
                        onClick={() => onAssignIssue(itemId)}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primaryHover transition-colors duration-200 shadow-sm"
                      >
                        Assign Issue to Sprint
                      </button>
                    )}
                  </div>

                  {/* Sprint Analytics Dashboard */}
                  {sprintItem.issues && sprintItem.issues.length > 0 && (
                    <div className="mb-8">
                      <h5 className="text-lg font-bold text-text mb-4 flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        Sprint Analytics
                      </h5>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Drilldown Chart - Issue Breakdown by Status */}
                        <div className="p-4 bg-bg border border-accent rounded-xl shadow-sm h-[300px]">
                          <ReusableChart
                            type="bar"
                            title="Issue Breakdown"
                            labels={["Planned", "In Progress", "Done", "Blocked"]}
                            data={[
                              sprintItem.issues.filter((i: LocalIssue) => i.status === "Planned").length,
                              sprintItem.issues.filter((i: LocalIssue) => i.status === "In Progress").length,
                              sprintItem.issues.filter((i: LocalIssue) => i.status === "Done").length,
                              sprintItem.issues.filter((i: LocalIssue) => i.status === "Blocked").length,
                            ]}
                            backgroundColors={["#dfdcef", "#FFB84D", "#009063", "#FF6B6B"]}
                          />
                        </div>

                        {/* Burndown Chart - Subtask Hours */}
                        <div className="p-4 bg-bg border border-accent rounded-xl shadow-sm h-[300px]">
                          <ReusableChart
                            type="line"
                            title="Burndown (Subtask Hours)"
                            labels={(() => {
                              const totalSubtaskHours = sprintItem.issues.reduce((sum: number, issue: LocalIssue) =>
                                sum + (issue.subTasks?.reduce((s: number, st: LocalSubTask) => s + (st.hours || 0), 0) || 0), 0
                              );
                              const completedHours = sprintItem.issues.reduce((sum: number, issue: LocalIssue) =>
                                sum + (issue.subTasks?.filter((st: LocalSubTask) => st.status === "Done")
                                  .reduce((s: number, st: LocalSubTask) => s + (st.hours || 0), 0) || 0), 0
                              );
                              void totalSubtaskHours; // Used in data calculation below
                              void completedHours; // Used in data calculation below
                              return ["Total Hours", "Completed", "Remaining"];
                            })()}
                            data={(() => {
                              const totalSubtaskHours = sprintItem.issues.reduce((sum: number, issue: LocalIssue) =>
                                sum + (issue.subTasks?.reduce((s: number, st: LocalSubTask) => s + (st.hours || 0), 0) || 0), 0
                              );
                              const completedHours = sprintItem.issues.reduce((sum: number, issue: LocalIssue) =>
                                sum + (issue.subTasks?.filter((st: LocalSubTask) => st.status === "Done")
                                  .reduce((s: number, st: LocalSubTask) => s + (st.hours || 0), 0) || 0), 0
                              );
                              const remainingHours = totalSubtaskHours - completedHours;
                              return [totalSubtaskHours, completedHours, remainingHours];
                            })()}
                            backgroundColors={["#3b3b3b", "#009063", "#FFB84D"]}
                          />
                        </div>

                        {/* Velocity Chart - Completion Rate */}
                        <div className="p-4 bg-bg border border-accent rounded-xl shadow-sm h-[300px]">
                          <ReusableChart
                            type="doughnut"
                            title="Velocity (Completion %)"
                            labels={["Completed", "In Progress", "Pending"]}
                            data={[
                              sprintItem.issues.filter((i: LocalIssue) => i.status === "Done").length,
                              sprintItem.issues.filter((i: LocalIssue) => i.status === "In Progress").length,
                              sprintItem.issues.filter((i: LocalIssue) => i.status === "Planned" || i.status === "Blocked").length,
                            ]}
                            backgroundColors={["#009063", "#FFB84D", "#dfdcef"]}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {sprintItem.issues.length > 0 ? (
                    sprintItem.issues.map((issue: LocalIssue) => {
                      const issueId = issue.id || issue._id;
                      const isIssueExpanded = expandedIssue === issueId;

                      return (
                        <div
                          key={issueId || `issue-${index}`}
                          className="border border-accent rounded-lg overflow-hidden"
                        >
                          <div
                            className="bg-bg p-5 cursor-pointer hover:bg-accent transition-all duration-200"
                            onClick={() => setExpandedIssue(isIssueExpanded ? null : issueId || null)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded border ${getTypeColor(issue.type || '')}`}>
                                    {issue.type}
                                  </span>
                                  <h5 className="text-lg font-bold text-text">{issue.heading}</h5>
                                  <span className={`px-3 py-1 text-xs font-semibold rounded border ${getPriorityColor(issue.priority || '')}`}>
                                    {issue.priority}
                                  </span>
                                </div>
                                <p className="text-text text-sm leading-relaxed mb-3 opacity-80">
                                  {issue.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                  <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(issue.status)}`}>
                                    {issue.status}
                                  </span>
                                  <div className="flex items-center space-x-2 text-sm text-text">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z" />
                                    </svg>
                                    <span className="font-medium">{issue.estimatedHours}h</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-text">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
                                    <span className="font-medium">{issue.assignedTo || "Unassigned"}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-text">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                                    </svg>
                                    <span className="font-medium">{issue.subTasks?.length || 0} SubTasks</span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div
                                  className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${isIssueExpanded
                                    ? "bg-primary text-white transform rotate-180"
                                    : "bg-accent text-text hover:bg-[#d0cce3]"
                                    }`}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          {isIssueExpanded && (
                            <div className="p-6 bg-bg border-t border-accent">
                              <div className="mb-4">
                                <h6 className="text-sm font-semibold text-text mb-2">Acceptance Criteria</h6>
                                <p className="text-sm text-text opacity-80 leading-relaxed">{issue.acceptanceCriteria}</p>
                              </div>

                              <h6 className="text-lg font-bold text-text flex items-center mb-4">
                                <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                                </svg>
                                SubTasks
                              </h6>

                              <div className="grid gap-4">
                                {issue.subTasks && issue.subTasks.length > 0 ? (
                                  issue.subTasks.map((task: LocalSubTask) => (
                                    <div
                                      key={task.id || (task as { _id?: string })._id}
                                      className="bg-bg border border-accent rounded-lg p-4 hover:shadow-md transition-all duration-200"
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                          <h6 className="text-base font-bold text-text mb-2">
                                            {task.heading}
                                          </h6>
                                          <p className="text-sm text-text opacity-80 leading-relaxed mb-3">
                                            {task.description}
                                          </p>
                                        </div>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(task.status)}`}>
                                          {task.status}
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-4 text-sm text-text">
                                        {task.assignedToId && (
                                          <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                            </svg>
                                            <span className="font-medium">Assigned to: {task.assignedToId}</span>
                                          </div>
                                        )}

                                        {task.hours && (
                                          <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z" />
                                            </svg>
                                            <span className="font-medium">{task.hours}h</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-8 text-text opacity-60">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-bg rounded-full flex items-center justify-center border border-accent">
                                      <svg className="w-6 h-6 text-text" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                                      </svg>
                                    </div>
                                    <p className="text-base font-semibold mb-2">No subtasks available</p>
                                    <p className="text-sm">Subtasks will appear here when they are added.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-text opacity-60">
                      <div className="w-16 h-16 mx-auto mb-4 bg-bg rounded-full flex items-center justify-center border border-accent">
                        <svg className="w-8 h-8 text-text" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h2a1 1 0 100-2H7z" />
                        </svg>
                      </div>
                      <p className="text-xl font-semibold mb-2">No issues in this sprint</p>
                      <p className="text-sm">Issues will appear here when they are added to this sprint.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollapsibleSection;