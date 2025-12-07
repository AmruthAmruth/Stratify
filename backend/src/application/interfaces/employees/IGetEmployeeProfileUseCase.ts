export interface IGetEmployeeProfileUseCase {
    execute(employeeId: string): Promise<EmployeeProfileResponse>;
}

export interface EmployeeProfileResponse {
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
    position: string;
    companyId: string;
    managerId?: string;
}
