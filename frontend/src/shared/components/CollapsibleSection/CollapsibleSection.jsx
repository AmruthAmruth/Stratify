// Updated CollapsibleSection.tsx
import React, { useState } from "react";

const CollapsibleSection = ({ 
  title, 
  icon, 
  iconBgColor, 
  iconColor, 
  data, 
  type, 
  expandedItem, 
  setExpandedItem, 
  getStatusColor, 
  getPriorityColor, 
  getTypeColor,
  onAssignIssue
}) => {
  const [expandedIssue, setExpandedIssue] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-md border border-[#dfdcef] overflow-hidden">
      <div className="bg-[#fbfbfb] p-6 border-b border-[#dfdcef]">
        <h3 className="text-2xl font-bold text-[#3b3b3b] flex items-center">
          <div className={`w-8 h-8 ${iconBgColor} rounded flex items-center justify-center mr-3`}>
            {icon}
          </div>
          {title}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {data.map((item, index) => {
          const itemId = type === 'sprint' ? item.id || item._id : item.id || item._id;
          const itemName = type === 'sprint' ? item.name : item.heading;
          const isExpanded = expandedItem === itemId;

          // For backlog items, render differently
          if (type === 'backlog') {
            return (
              <div
                key={itemId}
                className="border border-[#dfdcef] rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div
                  className="bg-[#fbfbfb] p-5 cursor-pointer hover:bg-[#f5f5f5] transition-all duration-200"
                  onClick={() => setExpandedItem(isExpanded ? null : itemId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <h4 className="text-lg font-bold text-[#3b3b3b]">{item.heading}</h4>
                      </div>
                      
                      <p className="text-[#3b3b3b] text-sm leading-relaxed mb-3 opacity-80">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded border ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <div className="flex items-center space-x-2 text-sm text-[#3b3b3b]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z" />
                          </svg>
                          <span className="font-medium">{item.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[#3b3b3b]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                          </svg>
                          <span className="font-medium">Size: {item.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div
                        className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
                          isExpanded
                            ? "bg-[#009063] text-white transform rotate-180"
                            : "bg-[#dfdcef] text-[#3b3b3b] hover:bg-[#d0cce3]"
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
                  <div className="p-6 bg-white border-t border-[#dfdcef]">
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-semibold text-[#3b3b3b] mb-2">Acceptance Criteria</h5>
                        <p className="text-sm text-[#3b3b3b] opacity-80 leading-relaxed">{item.acceptanceCriteria}</p>
                      </div>
                      {item.assignedTo && (
                        <div className="flex items-center space-x-2 text-sm text-[#3b3b3b]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                          <span className="font-medium">Assigned to: {item.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // For sprint items
          return (
            <div
              key={itemId}
              className="border-2 border-[#dfdcef] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`bg-[#fbfbfb] p-6 cursor-pointer hover:bg-[#f5f5f5] transition-all duration-300`}
                onClick={() => setExpandedItem(isExpanded ? null : itemId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 bg-[#009063] text-white text-sm font-bold rounded">
                        {item.name}
                      </span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-[#3b3b3b] mb-3">{item.goal}</h4>
                    
                    <p className="text-[#3b3b3b] text-sm leading-relaxed mb-3 opacity-80">
                      {new Date(item.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(item.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    
                    <div className="flex items-center space-x-6">
                      <span className="text-sm font-semibold text-[#009063]">
                        {item.issues.length} {item.issues.length === 1 ? "Issue" : "Issues"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div
                      className={`w-12 h-12 rounded flex items-center justify-center transition-all duration-300 ${
                        isExpanded
                          ? "bg-[#009063] text-white transform rotate-180"
                          : "bg-[#dfdcef] text-[#3b3b3b] hover:bg-[#d0cce3]"
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
                <div className="p-6 space-y-6 bg-white border-t border-[#dfdcef]">
                  <div className="flex justify-end mb-4">
                    {onAssignIssue && (
                      <button
                        onClick={() => onAssignIssue(itemId)}
                        className="px-4 py-2 bg-[#009063] text-white rounded-lg text-sm font-semibold hover:bg-[#007a52] transition-colors duration-200 shadow-sm"
                      >
                        Assign Issue to Sprint
                      </button>
                    )}
                  </div>
                  {item.issues.length > 0 ? (
                    item.issues.map((issue) => {
                      const issueId = issue.id || issue._id;
                      const isIssueExpanded = expandedIssue === issueId;

                      return (
                        <div
                          key={issueId}
                          className="border border-[#dfdcef] rounded-lg overflow-hidden"
                        >
                          <div
                            className="bg-[#fbfbfb] p-5 cursor-pointer hover:bg-[#f5f5f5] transition-all duration-200"
                            onClick={() => setExpandedIssue(isIssueExpanded ? null : issueId)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded border ${getTypeColor(issue.type)}`}>
                                    {issue.type}
                                  </span>
                                  <h5 className="text-lg font-bold text-[#3b3b3b]">{issue.heading}</h5>
                                  <span className={`px-3 py-1 text-xs font-semibold rounded border ${getPriorityColor(issue.priority)}`}>
                                    {issue.priority}
                                  </span>
                                </div>
                                <p className="text-[#3b3b3b] text-sm leading-relaxed mb-3 opacity-80">
                                  {issue.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                  <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(issue.status)}`}>
                                    {issue.status}
                                  </span>
                                  <div className="flex items-center space-x-2 text-sm text-[#3b3b3b]">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 11.586V6z" />
                                    </svg>
                                    <span className="font-medium">{issue.estimatedHours}h</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-[#3b3b3b]">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                    </svg>
                                    <span className="font-medium">{issue.assignedTo || "Unassigned"}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-[#3b3b3b]">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                                    </svg>
                                    <span className="font-medium">{issue.subTasks?.length || 0} SubTasks</span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div
                                  className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
                                    isIssueExpanded
                                      ? "bg-[#009063] text-white transform rotate-180"
                                      : "bg-[#dfdcef] text-[#3b3b3b] hover:bg-[#d0cce3]"
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
                            <div className="p-6 bg-white border-t border-[#dfdcef]">
                              <div className="mb-4">
                                <h6 className="text-sm font-semibold text-[#3b3b3b] mb-2">Acceptance Criteria</h6>
                                <p className="text-sm text-[#3b3b3b] opacity-80 leading-relaxed">{issue.acceptanceCriteria}</p>
                              </div>
                              
                              <h6 className="text-lg font-bold text-[#3b3b3b] flex items-center mb-4">
                                <svg className="w-5 h-5 text-[#009063] mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                                </svg>
                                SubTasks
                              </h6>
                              
                              <div className="grid gap-4">
                                {issue.subTasks && issue.subTasks.length > 0 ? (
                                  issue.subTasks.map((task) => (
                                    <div
                                      key={task.id || task._id}
                                      className="bg-[#fbfbfb] border border-[#dfdcef] rounded-lg p-4 hover:shadow-md transition-all duration-200"
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                          <h6 className="text-base font-bold text-[#3b3b3b] mb-2">
                                            {task.heading}
                                          </h6>
                                          <p className="text-sm text-[#3b3b3b] opacity-80 leading-relaxed mb-3">
                                            {task.description}
                                          </p>
                                        </div>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(task.status)}`}>
                                          {task.status}
                                        </span>
                                      </div>
                                      
                                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#3b3b3b]">
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
                                  <div className="text-center py-8 text-[#3b3b3b] opacity-60">
                                    <div className="w-12 h-12 mx-auto mb-4 bg-[#fbfbfb] rounded-full flex items-center justify-center border border-[#dfdcef]">
                                      <svg className="w-6 h-6 text-[#3b3b3b]" fill="currentColor" viewBox="0 0 20 20">
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
                    <div className="text-center py-12 text-[#3b3b3b] opacity-60">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#fbfbfb] rounded-full flex items-center justify-center border border-[#dfdcef]">
                        <svg className="w-8 h-8 text-[#3b3b3b]" fill="currentColor" viewBox="0 0 20 20">
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