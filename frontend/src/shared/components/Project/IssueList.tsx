// components/project/IssueList.tsx
import React from "react";
import { IssueDTO, UserRole, SubTaskDTO } from "./types";

interface Props {
  issues: IssueDTO[];
  role: UserRole;
}

const IssueList: React.FC<Props> = ({ issues, role }) => {
  const canEdit = role === "company" || role === "manager";

  if (!issues.length) return <p>No issues found.</p>;

  return (
    <div className="space-y-4 text-black">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="border rounded-md p-4 bg-white shadow-sm"
        >
          {/* Issue Header */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{issue.heading}</h3>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              {issue.priority}
            </span>
          </div>

          {/* Issue Description */}
          <p className="text-sm text-gray-700 mt-1">{issue.description}</p>

          {/* Meta Info */}
          <div className="text-sm mt-3 grid grid-cols-2 gap-2">
            <span><strong>Type:</strong> {issue.type}</span>
            <span><strong>Status:</strong> {issue.status}</span>
            <span><strong>Size:</strong> {issue.size}</span>
            <span><strong>Est. Hours:</strong> {issue.estimatedHours}</span>
          </div>

          {/* Company + Manager Controls */}
          {canEdit && (
            <div className="flex gap-3 mt-3">
              <button className="text-blue-600 hover:underline">Edit</button>
              <button className="text-red-600 hover:underline">Delete</button>
            </div>
          )}

          {/* Subtasks Section */}
          {issue.subTasks && issue.subTasks.length > 0 && (
            <div className="mt-4 border-l-2 pl-4 border-gray-300">
              <h4 className="font-semibold text-md mb-2">Subtasks</h4>

              {issue.subTasks.map((sub: SubTaskDTO) => (
                <div
                  key={sub.id}
                  className="border rounded p-2 bg-gray-50 mb-2 text-sm"
                >
                  <div className="flex justify-between">
                    <p className="font-medium">{sub.heading}</p>
                    <span className="text-xs bg-gray-300 px-2 py-1 rounded">
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-gray-600">{sub.description}</p>

                  <p className="text-gray-700 mt-1 text-xs">
                    <strong>Hours:</strong> {sub.hours}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IssueList;