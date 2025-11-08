import { LeaveRepository } from "../infrastructure/repositories/LeaveRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { EmailService } from "../infrastructure/services/EmailService";
import { CreateLeaveUseCase } from "../application/use-cases/leave/CreateLeaveUseCase";
import { GetEmployeeLeaveUseCase } from "../application/use-cases/leave/GetEmployeeLeaveUseCase";
import { GetDepartmentLeaveUseCase } from "../application/use-cases/leave/GetDepartmentLeaveUseCase";
import { ApproveLeaveUseCase } from "../application/use-cases/leave/ApproveLeaveUseCase";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { LeaveController } from "../interfaces/controllers/LeaveController";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";

export const leaveDI = () => {
  const leaveRepo = new LeaveRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const emailService = new EmailService();
 const notificationRepo=new NotificationRepository()

  const createLeaveUseCase = new CreateLeaveUseCase(leaveRepo, employeeRepo);
  const getEmployeeLeaveUseCase = new GetEmployeeLeaveUseCase(leaveRepo);
  const getDepartmentLeaveUseCase = new GetDepartmentLeaveUseCase(
    leaveRepo,
    managerRepo,
    employeeRepo,
  );
  const approveLeaveUseCase = new ApproveLeaveUseCase(
    leaveRepo,
    employeeRepo,
    emailService,
    notificationRepo
  );

  return new LeaveController(
    createLeaveUseCase,
    getEmployeeLeaveUseCase,
    getDepartmentLeaveUseCase,
    approveLeaveUseCase,
  );
};
