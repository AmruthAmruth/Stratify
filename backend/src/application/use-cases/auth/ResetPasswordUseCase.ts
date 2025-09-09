import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { Messages } from "../../../shared/constants/messages";
import { hashPassword } from "../../../shared/utils/password";

import { Company } from "../../../domain/entities/Company";
import { Employee } from "../../../domain/entities/Employee";
import { IManagerRepository } from "../../../domain/repositories/IManagerRepository";
import { Manager } from "../../../domain/entities/Manager";

type UserType = Company | Manager | Employee;

export class ResetPasswordUseCase {
  constructor(
    private readonly _companyRepository: ICompanyRepository,
    private readonly _managerRepository: IManagerRepository,
    private readonly _employeeRepository: IEmployeeRepository
  ) {}

  async execute(email: string, password: string): Promise<boolean> {
    
    let user: UserType | null = await this._companyRepository.findByEmail(email);
    let repo: ICompanyRepository | IManagerRepository | IEmployeeRepository | null =
      this._companyRepository;

    if (!user) {
      user = await this._managerRepository.findByEmail(email);
      if (user) repo = this._managerRepository;
    }

    if (!user) {
      user = await this._employeeRepository.findByEmail(email);
      if (user) repo = this._employeeRepository;
    }

    if (!user || !repo) throw new Error(Messages.EMAIL_NOT_FOUND);

   
    const hashedPassword = await hashPassword(password);

   
    await repo.updatePassword(email, hashedPassword);

    return true;
  }
}
