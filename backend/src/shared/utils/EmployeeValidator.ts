import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { AppError } from "../../interfaces/middleware/ErrorMiddleware";

export async function validateEmployees(
  employeeRepo: IEmployeeRepository,
  employeeIds: string[] | undefined,
  companyId: string,
  context: string = "Employee",
) {
  if (!employeeIds || employeeIds.length === 0) return;

  for (const employeeId of employeeIds) {
    const employee = await employeeRepo.findById(employeeId);
    if (!employee) {
      throw new AppError(
        `${context} with ID ${employeeId} does not exist`,
        404,
      );
    }
    if (employee.companyId !== companyId) {
      throw new AppError(
        `${context} with ID ${employeeId} does not belong to the company`,
        400,
      );
    }
  }
}
