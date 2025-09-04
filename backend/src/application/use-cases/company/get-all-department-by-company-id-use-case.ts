import { ICompanyRepository } from "../../../domain/repositories/i-company-repository";
import { IDepartmentRepo } from "../../../domain/repositories/i-department-repository";
import { IManagerRepo } from "../../../domain/repositories/i-manager-repository";
import { IEmployeeRepository } from "../../../domain/repositories/i-employee-repository";
import { Messages } from "../../../shared/constants/messages";

interface DepartmentDetails {
  departmentName: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  employeeCount: number;
}

interface CompanyDepartmentSummary {
  companyName: string;
  totalDepartments: number;
  totalEmployees: number;
  departments: DepartmentDetails[];
}

export class GetAllDepartmentByCompanyId {
  constructor(
    private readonly _companyRepo: ICompanyRepository,
    private readonly _departmentRepo: IDepartmentRepo,
    private readonly _managerRepo: IManagerRepo,
    private readonly _employeeRepo: IEmployeeRepository
  ) {}

async execute(companyId: string): Promise<CompanyDepartmentSummary> {
  const company = await this._companyRepo.findById(companyId);
  if (!company) throw new Error(Messages.COMPANY_NOT_FOUND);

  const departments = await this._departmentRepo.getAllDepartment(companyId);
  if (!departments || departments.length === 0) {
    throw new Error("Department Not found"); 
  }
  console.log(departments);
  

  const departmentDetails: DepartmentDetails[] = await Promise.all(
    departments.map(async (dept) => {
      const manager = dept.managerId
        ? await this._managerRepo.findById(dept.managerId)
        : null;

      const employees = (await this._employeeRepo.findByDepartmentId(dept.id)) ?? [];

console.log("Employee Details",employees);


      return {
        departmentName: dept.name,
        managerName: manager?.name ?? "N/A",
        managerEmail: manager?.email ?? "N/A",
        managerPhone: manager?.phone ?? "N/A",
        employeeCount: employees.length,
      };
    })
  );

  const totalEmployees = departmentDetails.reduce(
    (sum, dept) => sum + dept.employeeCount,
    0
  );

  return {
    companyName: company.name,
    totalDepartments: departments.length,
    totalEmployees,
    departments: departmentDetails,
  };
}
}
