import { Types } from "mongoose";

// Type definitions for Manager profile operations

export interface ManagerProfileResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    profileImage?: string;
    department: {
        id: string;
        name: string;
    } | null;
    role: string;
    employeeId: string;
    joinDate: Date;
    projectsManaged: number;
    teamSize: number;
    companyId: string;
}

export interface UpdateManagerProfileData {
    name?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
    profileImage?: string;
}

export interface UpdateManagerProfileResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    profileImage?: string;
}

export interface ManagerWithDepartment {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    dob: Date;
    profileImage?: string;
    role: string;
    joiningDate: Date;
    companyId: string;
    departmentId?: {
        _id: Types.ObjectId;
        name: string;
    };
}
