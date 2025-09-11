import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { ProfileDTO } from "../../dto/company/ProfileDTO";
import { IGetProfileUseCase } from "../../interfaces/company/IGetProfileUseCase";




export class GetProfileUseCase implements IGetProfileUseCase{
    constructor(
        private _managerRepo:IManagerRepository,
        private _employeeRepo:IEmployeeRepository,
        private _departmentRepo:IDepartmentRepository
    ){}
    async execute(id: string): Promise<ProfileDTO | null> {
        
          const calculateYears = (date: Date) => {
            const diff = new Date().getTime() - new Date(date).getTime();
            return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        };

         const manager = await this._managerRepo.findById(id);
        if (manager) {
            const departmentName = manager.departmentId
                ? (await this._departmentRepo.findById(manager.departmentId))?.name
                : undefined;

            return {
                id: manager.id,
                name: manager.name,
                email: manager.email,
                phone: manager.phone,
                role: manager.role,
                position: manager.position,
                companyId: manager.companyId,
                departmentId: manager.departmentId,
                departmentName,
                profileImage: manager.profileImage,
                dob: manager.dob,
                gender: manager.gender,
                joiningDate: manager.joiningDate,
                experience: calculateYears(manager.joiningDate),
                age: calculateYears(manager.dob)
            } as ProfileDTO;
        }



          const employee = await this._employeeRepo.findById(id);
        if (employee) {
            const departmentName = employee.departmentId
                ? (await this._departmentRepo.findById(employee.departmentId))?.name
                : undefined;

            return {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                phone: employee.phone,
                role: employee.role,
                position: employee.position,
                companyId: employee.companyId,
                departmentId: employee.departmentId,
                departmentName,
                profileImage: employee.profileImage,
                dob: employee.dob,
                gender: employee.gender,
                joiningDate: employee.joiningDate,
                experience: calculateYears(employee.joiningDate),
                age: calculateYears(employee.dob)
            } as ProfileDTO;
        }
        return null;
    }
}