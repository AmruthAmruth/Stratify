import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { IssueDTO, EmployeeDTO } from "./types";

interface DraggableIssueCardProps {
    issue: IssueDTO;
    employees?: EmployeeDTO[];
    onClick?: () => void;
}

const DraggableIssueCard: React.FC<DraggableIssueCardProps> = ({
    issue,
    employees,
    onClick,
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: issue.id,
        data: { issue },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const assignedEmployee = employees?.find((e) => e.id === issue.assignedTo);

    const getPriorityColor = () => {
        switch (issue.priority) {
            case "High":
                return "bg-red-100 text-red-700 border-red-300";
            case "Medium":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "Low":
                return "bg-green-100 text-primaryHover border-green-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={`
        bg-white border-2 border-accent rounded-xl p-4 
        cursor-grab active:cursor-grabbing
        hover:shadow-lg hover:border-primary 
        transition-all duration-200
        ${isDragging ? "shadow-2xl ring-2 ring-primary" : ""}
      `}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <h4 className="text-base font-semibold text-text line-clamp-2 flex-1">
                    {issue.heading}
                </h4>
                <span
                    className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor()}`}
                >
                    {issue.priority}
                </span>
            </div>

            {/* Description */}
            {issue.description && (
                <p className="text-sm text-text/70 mb-3 line-clamp-2">
                    {issue.description}
                </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-accent/30 rounded text-text/80">
                        {issue.type}
                    </span>
                    <span className="px-2 py-1 bg-accent/30 rounded text-text/80">
                        Size: {issue.size}
                    </span>
                </div>

                {/* Assignment Status */}
                {assignedEmployee ? (
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                        <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="truncate max-w-[100px]">{assignedEmployee.name}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium">
                        <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Unassigned</span>
                    </div>
                )}
            </div>

            {/* Drag Handle Indicator */}
            <div className="mt-3 pt-3 border-t border-accent/50 flex items-center justify-center gap-1 text-text/40">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                <span className="text-xs">Drag to sprint</span>
            </div>
        </div>
    );
};

export default DraggableIssueCard;
