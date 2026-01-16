import React from 'react';
import ReusableChart from '../Chart/ReusableChart';

interface EmployeeCapacity {
    employeeId: string;
    name: string;
    position: string;
    totalHours: number;
    leaveHours: number;
    availableHours: number;
    assignedHours: number;
    remainingHours: number;
    utilizationPercent: number;
    workloadPercent: number;
}

interface ForecastAllocationGraphProps {
    employees: EmployeeCapacity[];
    sprintName: string;
}

const ForecastAllocationGraph: React.FC<ForecastAllocationGraphProps> = ({ employees, sprintName }) => {
    if (employees.length === 0) {
        return (
            <div className="bg-surface rounded-lg border border-accent/50 p-6 text-center">
                <p className="text-text/60">No team members in this sprint</p>
            </div>
        );
    }

    // Prepare data for stacked bar chart
    const labels = employees.map(emp => emp.name.split(' ')[0]); // First names for cleaner display

    const datasets = [
        {
            label: 'Leave Hours',
            data: employees.map(emp => emp.leaveHours),
            backgroundColor: '#ef4444', // red
            borderColor: '#1f2937',
            borderWidth: 1,
        },
        {
            label: 'Assigned Hours',
            data: employees.map(emp => emp.assignedHours),
            backgroundColor: employees.map(emp => {
                // Color based on workload percentage
                if (emp.workloadPercent > 100) return '#ef4444'; // red - overcommitted
                if (emp.workloadPercent > 80) return '#eab308'; // yellow - high utilization
                return '#3b82f6'; // blue - healthy
            }),
            borderColor: '#1f2937',
            borderWidth: 1,
        },
        {
            label: 'Remaining Hours',
            data: employees.map(emp => emp.remainingHours),
            backgroundColor: '#10b981', // green
            borderColor: '#1f2937',
            borderWidth: 1,
        },
    ];

    return (
        <div className="bg-surface rounded-lg border border-accent/50 p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-text mb-1">
                    📊 Forecast Allocation - {sprintName}
                </h3>
                <p className="text-sm text-text/60">
                    Employee capacity breakdown showing leave, assigned workload, and remaining availability
                </p>
            </div>

            <div className="h-[400px]">
                <ReusableChart
                    type="bar"
                    labels={labels}
                    datasets={datasets}
                />
            </div>

            {/* Legend explanation */}
            <div className="mt-4 pt-4 border-t border-accent/30">
                <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-text/70">Leave Hours (unavailable)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-text/70">Assigned Hours (workload)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-text/70">Remaining Hours (capacity)</span>
                    </div>
                </div>
                <p className="text-xs text-text/60 mt-3">
                    💡 <strong>Assigned bar color:</strong> Blue (&lt;80%), Yellow (80-100%), Red (&gt;100% overcommitted)
                </p>
            </div>
        </div>
    );
};

export default ForecastAllocationGraph;
