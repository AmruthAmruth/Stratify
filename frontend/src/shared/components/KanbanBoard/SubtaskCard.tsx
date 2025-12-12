import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface SubtaskCardProps {
    id: string;
    title: string;
    description?: string;
    estimatedHours?: number;
    status: string;
    onClick?: () => void;
}

const SubtaskCard: React.FC<SubtaskCardProps> = ({
    id,
    title,
    description,
    estimatedHours,
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
            className={`bg-white border border-[#dfdcef] rounded-lg p-4 mb-3 cursor-move hover:shadow-md transition-all ${isDragging ? "shadow-lg ring-2 ring-[#009063]" : ""
                }`}
        >
            <h4 className="font-semibold text-[#2f2f2f] text-sm mb-2">{title}</h4>
            {description && (
                <p className="text-xs text-[#3b3b3b]/80 mb-2 line-clamp-2">
                    {description}
                </p>
            )}
            <div className="flex items-center justify-between mt-2">
                {estimatedHours !== undefined && (
                    <span className="text-xs text-[#3b3b3b]/70 bg-[#fbfbfb] px-2 py-1 rounded">
                        ⏱️ {estimatedHours}h
                    </span>
                )}
                <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${status === "Done"
                            ? "bg-[#e6f7f0] text-[#009063]"
                            : status === "In Progress"
                                ? "bg-[#fff4e6] text-[#ff9800]"
                                : "bg-[#dfdcef] text-[#3b3b3b]"
                        }`}
                >
                    {status}
                </span>
            </div>
        </div>
    );
};

export default SubtaskCard;
