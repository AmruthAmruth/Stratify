import React from "react";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import SubtaskCard from "./SubtaskCard";
import type { SubTask } from "@/types/types";

interface KanbanBoardProps {
    subtasks: SubTask[];
    onDragEnd: (event: DragEndEvent) => void;
    onSubtaskClick?: (subtask: SubTask) => void;
}

interface ColumnProps {
    id: string;
    title: string;
    subtasks: SubTask[];
    onSubtaskClick?: (subtask: SubTask) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, subtasks, onSubtaskClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const getColumnColor = () => {
        switch (id) {
            case "To Do":
                return "border-accent bg-bg";
            case "In Progress":
                return "border-orange-500/30 bg-orange-50/30";
            case "Done":
                return "border-primary/30 bg-primary/10/30";
            default:
                return "border-accent bg-bg";
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 min-w-[280px] border-2 rounded-xl p-4 transition-all ${getColumnColor()} ${isOver ? "ring-2 ring-primary bg-primary/10/50" : ""
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-heading text-sm uppercase tracking-wide">
                    {title}
                </h3>
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                    {subtasks.length}
                </span>
            </div>
            <div className="space-y-2 min-h-[200px]">
                {subtasks.length === 0 ? (
                    <div className="text-center text-text/50 text-sm py-8">
                        No subtasks
                    </div>
                ) : (
                    subtasks.map((subtask) => (
                        <SubtaskCard
                            key={subtask.id}
                            id={subtask.id}
                            heading={subtask.heading}
                            description={subtask.description}
                            hours={subtask.hours}
                            status={subtask.status}
                            onClick={() => onSubtaskClick?.(subtask)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
    subtasks,
    onDragEnd,
    onSubtaskClick,
}) => {
    const todoSubtasks = subtasks.filter((s) => s.status === "To Do");
    const inProgressSubtasks = subtasks.filter((s) => s.status === "In Progress");
    const doneSubtasks = subtasks.filter((s) => s.status === "Done");

    return (
        <DndContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
                <Column
                    id="To Do"
                    title="To Do"
                    subtasks={todoSubtasks}
                    onSubtaskClick={onSubtaskClick}
                />
                <Column
                    id="In Progress"
                    title="In Progress"
                    subtasks={inProgressSubtasks}
                    onSubtaskClick={onSubtaskClick}
                />
                <Column
                    id="Done"
                    title="Done"
                    subtasks={doneSubtasks}
                    onSubtaskClick={onSubtaskClick}
                />
            </div>
        </DndContext>
    );
};

export default KanbanBoard;
