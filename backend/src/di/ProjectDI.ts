
import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { UserStoryRepository } from "../infrastructure/repositories/UserStoryRepository";
import { BacklogRepository } from "../infrastructure/repositories/BacklogRepository";
import { SprintRepository } from "../infrastructure/repositories/SprintRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { CreateProjectUseCase } from "../application/use-cases/project/CreateProjectUseCase";
import { CreateUserStoryUseCase } from "../application/use-cases/project/CreateUserStoryUseCase";
import { CreateBacklogUseCase } from "../application/use-cases/project/CreateBacklogUseCase";
import { CreateSprintUseCase } from "../application/use-cases/project/CreateSprintUseCase";
import { CreateTaskUseCase } from "../application/use-cases/project/CreateTaskUseCase";
import { GetProjectsByCompanyUseCase } from "../application/use-cases/project/GetProjectsByCompanyUseCase";
import { GetProjectsByDepartmentUseCase } from "../application/use-cases/project/GetProjectsByDepartmentUseCase";
import { GetProjectDetailsUseCase } from "../application/use-cases/project/GetProjectDetailsUseCase";
import { AssignUserStoryToSprintUseCase } from "../application/use-cases/project/AssignUserStoryToSprintUseCase";
import { ProjectController } from "../interfaces/controllers/ProjectController";
import { IssueRepository } from "../infrastructure/repositories/IssueRepository";
import { CreateIssueUseCase } from "../application/use-cases/project/CreateIssuesUseCase";
import { CreateSubTaskUseCase } from "../application/use-cases/project/CreateSubTaskUseCase";
import { SubTaskRepository } from "../infrastructure/repositories/SubTaskRepository";

export const projectDI = () => {
  const companyRepo = new companyRepository();
  const projectRepo = new ProjectRepository();
  const userStoryRepo = new UserStoryRepository();
  const backlogRepo = new BacklogRepository();
  const sprintRepo = new SprintRepository();
  const taskRepo = new TaskRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const departmentRepo = new DepartmentRepository();
  const issueRepo=new IssueRepository()
  const subTaskRepo=new SubTaskRepository()


  const createProjectUseCase = new CreateProjectUseCase(projectRepo, companyRepo, managerRepo, departmentRepo, employeeRepo);
  const createUserStoryUseCase = new CreateUserStoryUseCase(userStoryRepo, backlogRepo, projectRepo, employeeRepo);
  const createBacklogUseCase = new CreateBacklogUseCase(backlogRepo, companyRepo, managerRepo, projectRepo);
  const createSprintUseCase = new CreateSprintUseCase(sprintRepo, projectRepo);
  const createTaskUseCase = new CreateTaskUseCase(taskRepo, userStoryRepo, employeeRepo, projectRepo);
  const getProjectsByCompanyUseCase = new GetProjectsByCompanyUseCase(projectRepo, managerRepo, departmentRepo);
  const getProjectsByDepartmentUseCase = new GetProjectsByDepartmentUseCase(projectRepo, managerRepo);
  const getProjectDetailsUseCase = new GetProjectDetailsUseCase(projectRepo, backlogRepo, userStoryRepo, taskRepo, sprintRepo);
  const assignUserStoryToSprintUseCase = new AssignUserStoryToSprintUseCase(sprintRepo, userStoryRepo);
  const createIssueUseCase=new CreateIssueUseCase(projectRepo,issueRepo)
  const createSubTaskUseCase=new CreateSubTaskUseCase(issueRepo,subTaskRepo)


  return new ProjectController(
    createProjectUseCase,
    createUserStoryUseCase,
    createBacklogUseCase,
    createSprintUseCase,
    createTaskUseCase,
    getProjectsByCompanyUseCase,
    getProjectsByDepartmentUseCase,
    getProjectDetailsUseCase,
    assignUserStoryToSprintUseCase,
    createIssueUseCase,
    createSubTaskUseCase
  );
};