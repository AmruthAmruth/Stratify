import api from "./axiosInstance";

export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    joiningDate: string;
    gender: "male" | "female" | "other";
    profileImage?: string;
    departmentId: string;
    managerId?: string;
}

export interface TeamAnalytics {
    totalEmployees: number;
    activeEmployees: number;
    employeesOnLeave: number;
    averageExperience: number;
    positionDistribution: { [position: string]: number };
    genderDistribution: { male: number; female: number; other: number };
    projectAllocation: {
        assigned: number;
        unassigned: number;
    };
}

export const getDepartmentEmployees = async (): Promise<Employee[]> => {
    try {
        const response = await api.get("/api/manager/team/employees");
        return response.data.employees;
    } catch (error) {
        console.error("Error fetching department employees:", error);
        throw error;
    }
};

export const getTeamAnalytics = async (): Promise<TeamAnalytics> => {
    try {
        const response = await api.get("/api/manager/team/analytics");
        return response.data.analytics;
    } catch (error) {
        console.error("Error fetching team analytics:", error);
        throw error;
    }
};
