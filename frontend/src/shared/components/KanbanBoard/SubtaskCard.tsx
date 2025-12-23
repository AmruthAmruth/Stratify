import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface SubtaskCardProps {
    id: string;
    heading: string;
    description?: string;
    hours?: number;
    status: string;
    onClick?: () => void;
}

const SubtaskCard: React.FC<SubtaskCardProps> = ({
    id,
    heading,
    description,
    hours,
    status,
    onClick,
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: id,
        });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={`bg-surface border border-accent rounded-lg p-4 mb-3 cursor-move hover:shadow-md transition-all ${isDragging ? "shadow-lg ring-2 ring-primary" : ""
                }`}
        >
            <h4 className="font-semibold text-heading text-sm mb-2">{heading}</h4>
            {description && (
                <p className="text-xs text-text/80 mb-2 line-clamp-2">
                    {description}
                </p>
            )}
            <div className="flex items-center justify-between mt-2">
                {hours !== undefined && (
                    <span className="text-xs text-text/70 bg-bg px-2 py-1 rounded">
                        ⏱️ {hours}h
                    </span>
                )}
                <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${status === "Done"
                        ? "bg-primary/10 text-primary"
                        : status === "In Progress"
                            ? "bg-orange-50 text-orange-500"
                            : "bg-accent text-text"
                        }`}
                >
                    {status}
                </span>
            </div>
        </div>
    );
};

export default SubtaskCard;
