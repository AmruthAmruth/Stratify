import { Types } from "mongoose";



export interface ManagerProfileResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    profileImage?: string;
    department: {
        id: string;
        name: string;
    } | null;
    role: string;
    employeeId: string;
    joinDate?: string;
    projectsManaged: number;
    teamSize: number;
    companyId: string;
    address?: string;
}

export interface UpdateManagerProfileData {
    name?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    profileImage?: string;
    address?: string;
}

export interface UpdateManagerProfileResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    profileImage?: string;
    address?: string;
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
    address?: string;
}
