// components/project/SprintList.tsx
import React from "react";
import { SprintDTO, UserRole } from "./types";
import IssueList from "./IssueList";

interface Props {
  sprints: SprintDTO[];
  role: UserRole;
}

const SprintList: React.FC<Props> = ({ sprints, role }) => {
  if (!sprints.length) return <p>No sprints available.</p>;

  return (
    <div className="space-y-4">
      {sprints.map((sprint) => (
        <div
          key={sprint.id}
          className="border rounded-md p-3 bg-gray-50 shadow-sm"
        >
          <h3 className="font-semibold">{sprint.name}</h3>
          <p className="text-sm">{sprint.goal}</p>

          <div className="text-xs mt-2 text-gray-600 flex gap-4">
            <span>
              {new Date(sprint.startDate).toLocaleDateString()} →{" "}
              {new Date(sprint.endDate).toLocaleDateString()}
            </span>

            <span>Status: {sprint.status}</span>
          </div>

          {/* Issues Section */}
          {sprint.issues && sprint.issues.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold text-md mb-2">Issues</h4>
              <IssueList issues={sprint.issues} role={role} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SprintList;