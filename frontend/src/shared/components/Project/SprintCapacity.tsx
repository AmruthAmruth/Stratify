import React, { useEffect, useState } from "react";
import { getSprintCapacity } from "@/services/projects";

interface EmployeeCapacity {
    employeeId: string;
    name: string;
    position: string;
    totalHours: number;
    leaveHours: number;
    availableHours: number;
    utilizationPercent: number;
    leaves?: Array<{
        startDate: Date;
        endDate: Date;
        type: string;
    }>;
}

interface SprintCapacity {
    sprintId: string;
    sprintName: string;
    startDate: Date;
    endDate: Date;
    totalWorkingDays: number;
    employees: EmployeeCapacity[];
    teamSummary: {
        totalCapacity: number;
        availableCapacity: number;
        leaveLoss: number;
        availabilityPercent: number;
    };
}

interface Props {
    sprintId: string;
}

const SprintCapacity: React.FC<Props> = ({ sprintId }) => {
    const [capacity, setCapacity] = useState<SprintCapacity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCapacity = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('[SprintCapacity] Fetching capacity for sprintId:', sprintId);
                const data = await getSprintCapacity(sprintId);
                console.log('[SprintCapacity] Received data:', data);
                setCapacity(data as SprintCapacity);
            } catch (err: unknown) {
                console.error("[SprintCapacity] Error fetching sprint capacity:", err);
                setError((err as Error).message || "Failed to load capacity data");
            } finally {
                setLoading(false);
            }
        };

        if (sprintId) {
            console.log('[SprintCapacity] Component mounted with sprintId:', sprintId);
            fetchCapacity();
        } else {
            console.warn('[SprintCapacity] No sprintId provided');
        }
    }, [sprintId]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md border border-[#dfdcef] p-6 animate-pulse">
                <div className="h-6 bg-[#dfdcef] rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-[#fbfbfb] rounded w-full mb-2"></div>
                <div className="h-4 bg-[#fbfbfb] rounded w-2/3"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                <p className="text-red-700 text-sm">⚠️ {error}</p>
            </div>
        );
    }

    if (!capacity) {
        return null;
    }

    const { teamSummary, employees } = capacity;
    const percent = teamSummary.availabilityPercent;

    // Determine color based on capacity
    const getCapacityColor = (percentage: number) => {
        if (percentage >= 90) return { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", badge: "bg-green-500" };
        if (percentage >= 70) return { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", badge: "bg-yellow-500" };
        return { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", badge: "bg-red-500" };
    };

    const colorScheme = getCapacityColor(percent);

    const getEmployeeColor = (percentage: number) => {
        if (percentage >= 90) return "text-green-700";
        if (percentage >= 70) return "text-yellow-700";
        return "text-red-700";
    };

    return (
        <div
            className={`rounded-lg shadow-md border ${colorScheme.border} ${colorScheme.bg} p-6 mb-6 transition-all duration-300 hover:shadow-lg`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#3b3b3b] flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${colorScheme.badge}`}></span>
                    📊 Sprint Capacity
                </h3>
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${colorScheme.text}`}>
                        {Math.round(percent)}%
                    </span>
                    <span className="text-sm text-[#3b3b3b]/70">Available</span>
                </div>
            </div>

            {/* Capacity Summary */}
            <div className="bg-white/50 rounded-lg p-4 mb-4 border border-[#dfdcef]/30">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-[#3b3b3b]/60 uppercase tracking-wide mb-1">
                            Available Hours
                        </p>
                        <p className="text-lg font-bold text-[#3b3b3b]">
                            {teamSummary.availableCapacity} / {teamSummary.totalCapacity}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-[#3b3b3b]/60 uppercase tracking-wide mb-1">
                            Leave Loss
                        </p>
                        <p className="text-lg font-bold text-red-600">
                            {teamSummary.leaveLoss} hours
                        </p>
                    </div>
                </div>
            </div>

            {/* Employee List */}
            {employees.length > 0 ? (
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#3b3b3b]/80 mb-2">
                        Team Members:
                    </p>
                    {employees.map((employee) => (
                        <div
                            key={employee.employeeId}
                            className="bg-white rounded-lg border border-[#dfdcef]/50 p-3 hover:border-[#009063]/30 transition-colors duration-200"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-semibold text-[#3b3b3b]">
                                        👤 {employee.name}
                                    </p>
                                    <p className="text-xs text-[#3b3b3b]/60">
                                        {employee.position}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-[#3b3b3b]">
                                        {employee.availableHours}/{employee.totalHours}h
                                    </p>
                                    <p
                                        className={`text-xs font-bold ${getEmployeeColor(
                                            employee.utilizationPercent
                                        )}`}
                                    >
                                        {Math.round(employee.utilizationPercent)}%
                                    </p>
                                </div>
                            </div>

                            {/* Show leave details if employee has leaves */}
                            {employee.leaves && employee.leaves.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-[#dfdcef]/30">
                                    <p className="text-xs text-[#3b3b3b]/70 mb-1">
                                        🏖️ On leave ({employee.leaveHours}h):
                                    </p>
                                    {employee.leaves.map((leave, idx) => (
                                        <p key={idx} className="text-xs text-[#3b3b3b]/60 ml-4">
                                            • {new Date(leave.startDate).toLocaleDateString()} -{" "}
                                            {new Date(leave.endDate).toLocaleDateString()} (
                                            {leave.type})
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-[#3b3b3b]/60 text-center py-4">
                    No team members assigned to this sprint
                </p>
            )}

            {/* Warning for low capacity */}
            {percent < 70 && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700 font-semibold flex items-center gap-2">
                        <span>⚠️</span>
                        <span>Low capacity warning!</span>
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                        Team is at {Math.round(percent)}% capacity. Consider reducing sprint
                        scope or adjusting timelines.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SprintCapacity;
