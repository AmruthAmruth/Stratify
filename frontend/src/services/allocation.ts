import api from './axiosInstance';

export interface EmployeeAllocationDTO {
    id: string;
    employeeId: string;
    employeeName?: string;
    projectId: string | null;
    projectName?: string;
    allocationPercent: number;
    hoursPerWeek: number;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ForecastAllocationDTO {
    id: string;
    employeeId: string;
    employeeName?: string;
    employeePosition?: string;
    projectId: string;
    projectName?: string;
    projectKey?: string;
    forecastHoursPerWeek: number;
    startDate: string;
    endDate: string | null;
    status: 'Active' | 'Completed' | 'Cancelled';
    notes?: string;
    totalForecastHours?: number;
    weeksInPeriod?: number;
    createdBy: string;
    createdByModel: 'Company' | 'Manager';
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ForecastVsActualDTO {
    employeeId: string;
    employeeName: string;
    projectId: string;
    projectName: string;
    forecastHours: number;
    actualHours: number;
    variance: number;
    variancePercent: number;
    leaveHours: number;
    availableHours: number;
    utilizationPercent: number;
    period: {
        startDate: string;
        endDate: string;
    };
}

// Get allocations for a specific employee
export const getEmployeeAllocations = async (employeeId: string): Promise<EmployeeAllocationDTO[]> => {
    const response = await api.get(`/allocations/employee/${employeeId}`);
    return response.data.data || [];
};

// Get allocations for all employees in a project
export const getProjectAllocations = async (projectId: string): Promise<EmployeeAllocationDTO[]> => {
    const response = await api.get(`/allocations/project/${projectId}`);
    return response.data.data || [];
};

// Create new allocation
export const createAllocation = async (data: {
    employeeId: string;
    projectId: string | null;
    allocationPercent: number;
    startDate: string;
    endDate?: string | null;
}): Promise<EmployeeAllocationDTO> => {
    const response = await api.post('/allocations', data);
    return response.data.data;
};

// Update allocation
export const updateAllocation = async (
    id: string,
    data: Partial<EmployeeAllocationDTO>
): Promise<EmployeeAllocationDTO> => {
    const response = await api.put(`/allocations/${id}`, data);
    return response.data.data;
};

// Delete allocation
export const deleteAllocation = async (id: string): Promise<boolean> => {
    const response = await api.delete(`/allocations/${id}`);
    return response.data.data.deleted;
};

// ============================================
// FORECAST ALLOCATION METHODS
// ============================================

// Create forecast allocation
export const createForecastAllocation = async (data: {
    employeeId: string;
    projectId: string;
    forecastHoursPerWeek: number;
    startDate: string;
    endDate?: string | null;
    notes?: string;
}): Promise<ForecastAllocationDTO> => {
    const response = await api.post('/forecast-allocations', data);
    return response.data.data;
};

// Update forecast allocation
export const updateForecastAllocation = async (
    id: string,
    data: {
        forecastHoursPerWeek?: number;
        startDate?: string;
        endDate?: string | null;
        status?: 'Active' | 'Completed' | 'Cancelled';
        notes?: string;
    }
): Promise<ForecastAllocationDTO> => {
    const response = await api.put(`/forecast-allocations/${id}`, data);
    return response.data.data;
};

// Get forecast allocations by employee
export const getForecastAllocationsByEmployee = async (employeeId: string): Promise<ForecastAllocationDTO[]> => {
    const response = await api.get(`/forecast-allocations/employee/${employeeId}`);
    return response.data.data || [];
};

// Get forecast allocations by project
export const getForecastAllocationsByProject = async (projectId: string): Promise<ForecastAllocationDTO[]> => {
    const response = await api.get(`/forecast-allocations/project/${projectId}`);
    return response.data.data || [];
};

// Get forecast allocation by ID
export const getForecastAllocationById = async (id: string): Promise<ForecastAllocationDTO> => {
    const response = await api.get(`/forecast-allocations/${id}`);
    return response.data.data;
};

// Calculate forecast vs actual
export const getForecastVsActual = async (
    employeeId: string,
    projectId: string,
    startDate?: string,
    endDate?: string
): Promise<ForecastVsActualDTO> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = `/forecast-allocations/compare/${employeeId}/${projectId}${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url);
    return response.data.data;
};

// Delete forecast allocation
export const deleteForecastAllocation = async (id: string): Promise<boolean> => {
    const response = await api.delete(`/forecast-allocations/${id}`);
    return response.data.success || false;
};
