import React from 'react';
import { EmployeeWithAllocation } from './types';

interface Props {
    employee: EmployeeWithAllocation;
    onManageAllocation?: (employeeId: string) => void;
    onManageForecast?: (employeeId: string) => void;
    canManage: boolean;
}

const EmployeeAllocationCard: React.FC<Props> = ({ employee, onManageAllocation, onManageForecast, canManage }) => {
    const allocation = employee.allocation;
    const forecast = employee.forecastAllocation;
    const vsActual = employee.forecastVsActual;

    const allocationPercent = allocation?.allocationPercent || 0;
    const hoursPerWeek = allocation?.hoursPerWeek || 0;
    const totalPercent = employee.totalAllocatedPercent || 0;

    // Forecast data
    const forecastHoursPerWeek = forecast?.forecastHoursPerWeek || 0;
    const variancePercent = vsActual?.variancePercent || 0;
    const leaveHours = vsActual?.leaveHours || 0;
    const utilizationPercent = vsActual?.utilizationPercent || 0;

    // Color coding based on total allocation
    const getStatusColor = () => {
        if (totalPercent > 100) return 'text-red-700 bg-red-50 border-red-300';
        if (totalPercent >= 90) return 'text-orange-700 bg-orange-50 border-orange-300';
        if (totalPercent >= 70) return 'text-yellow-700 bg-yellow-50 border-yellow-300';
        return 'text-primaryHover bg-green-50 border-green-300';
    };

    const getStatusLabel = () => {
        if (totalPercent > 100) return 'Overcommitted';
        if (totalPercent >= 90) return 'High';
        if (totalPercent >= 70) return 'Moderate';
        return 'Healthy';
    };

    const getVarianceColor = () => {
        if (variancePercent > 20) return 'text-red-600';
        if (variancePercent > 10) return 'text-orange-600';
        if (variancePercent < -10) return 'text-blue-600';
        return 'text-primary';
    };

    return (
        <div className="bg-white rounded-lg border border-accent p-5 hover:shadow-md transition-all duration-200">
            {/* Employee Info */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h4 className="font-semibold text-heading text-lg">{employee.name}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{employee.position}</p>
                </div>
                {canManage && (
                    <div className="flex gap-2">
                        {onManageAllocation && (
                            <button
                                onClick={() => onManageAllocation(employee.id)}
                                className="text-primary hover:text-[#007a52] text-sm font-medium px-3 py-1 rounded hover:bg-primary/10 transition-colors"
                                aria-label={`Manage allocation for ${employee.name}`}
                            >
                                Manage
                            </button>
                        )}
                        {onManageForecast && (
                            <button
                                onClick={() => onManageForecast(employee.id)}
                                className="text-[#9b8dc9] hover:text-[#7d6fb3] text-sm font-medium px-3 py-1 rounded hover:bg-[#f3f0ff] transition-colors"
                                aria-label={`Manage forecast for ${employee.name}`}
                            >
                                Forecast
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Forecast Hours Section */}
            {forecast && (
                <div className="mb-4 p-3 bg-[#f8f7fc] rounded-lg border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-[#7d6fb3]">📊 Forecast Allocation</span>
                        <span className="text-lg font-bold text-[#7d6fb3]">{forecastHoursPerWeek}h/week</span>
                    </div>

                    {vsActual && (
                        <div className="space-y-2 mt-3">
                            {/* Variance Indicator */}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">Variance:</span>
                                <span className={`font-semibold ${getVarianceColor()}`}>
                                    {variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                                    {variancePercent > 0 ? ' over' : variancePercent < 0 ? ' under' : ' on track'}
                                </span>
                            </div>

                            {/* Leave Impact */}
                            {leaveHours > 0 && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600">Leave Impact:</span>
                                    <span className="font-semibold text-orange-600">-{leaveHours.toFixed(0)}h</span>
                                </div>
                            )}

                            {/* Utilization */}
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">Utilization:</span>
                                <span className="font-semibold text-heading">{utilizationPercent.toFixed(0)}%</span>
                            </div>
                        </div>
                    )}

                    {/* Forecast Period */}
                    {forecast.startDate && (
                        <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-purple-100">
                            <span className="font-medium">Period:</span>{' '}
                            {new Date(forecast.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })} - {' '}
                            {forecast.endDate
                                ? new Date(forecast.endDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : 'Ongoing'}
                        </div>
                    )}
                </div>
            )}

            {/* Allocation Details */}
            {allocation ? (
                <div className="space-y-4">
                    {/* Allocation to This Project */}
                    <div>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-text font-medium">This Project</span>
                            <span className="font-bold text-heading text-base">{allocationPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${allocationPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-600 mt-1.5">
                            <span className="font-semibold">{hoursPerWeek}h</span> per week
                        </p>
                    </div>

                    {/* Total Allocation Across All Projects */}
                    <div>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-text font-medium">Total Capacity</span>
                            <span className={`font-semibold px-2.5 py-1 rounded-md text-xs border ${getStatusColor()}`}>
                                {totalPercent}% • {getStatusLabel()}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-300 ${totalPercent > 100 ? 'bg-red-500' :
                                    totalPercent >= 90 ? 'bg-orange-500' :
                                        totalPercent >= 70 ? 'bg-yellow-500' :
                                            'bg-[#9b8dc9]'
                                    }`}
                                style={{ width: `${Math.min(totalPercent, 100)}%` }}
                            />
                        </div>
                        {totalPercent > 100 && (
                            <p className="text-xs text-red-600 mt-1.5 font-medium">
                                ⚠️ Over capacity by {(totalPercent - 100).toFixed(0)}%
                            </p>
                        )}
                    </div>

                    {/* Date Range */}
                    {allocation.startDate && (
                        <div className="text-xs text-gray-600 pt-3 border-t border-purple-100">
                            <div className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Period:</span>{' '}
                                {new Date(allocation.startDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })} - {' '}
                                {allocation.endDate
                                    ? new Date(allocation.endDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })
                                    : 'Ongoing'}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-6 px-4 bg-bg rounded-lg border border-dashed border-accent">
                    <svg className="w-10 h-10 mx-auto text-[#9b8dc9] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-600 font-medium">No allocation set</p>
                    <p className="text-xs text-gray-600 mt-1">Click "Manage" or "Forecast" to configure</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeAllocationCard;
