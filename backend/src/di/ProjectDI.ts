import { companyRepository } from "../infrastructure/repositories/CompanyRepository";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { UserStoryRepository } from "../infrastructure/repositories/UserStoryRepository";
import { BacklogRepository } from "../infrastructure/repositories/BacklogRepository";
import { TaskRepository } from "../infrastructure/repositories/TaskRepository";
import { EmployeeRepository } from "../infrastructure/repositories/EmployeeRepository";
import { ManagerRepository } from "../infrastructure/repositories/ManagerRepository";
import { DepartmentRepository } from "../infrastructure/repositories/DepartmentRepository";
import { CreateProjectUseCase } from "../application/use-cases/project/CreateProjectUseCase";
import { CreateUserStoryUseCase } from "../application/use-cases/project/CreateUserStoryUseCase";
import { CreateBacklogUseCase } from "../application/use-cases/project/CreateBacklogUseCase";
import { CreateTaskUseCase } from "../application/use-cases/project/CreateTaskUseCase";
import { GetProjectsByCompanyUseCase } from "../application/use-cases/project/GetProjectsByCompanyUseCase";
import { GetProjectsByDepartmentUseCase } from "../application/use-cases/project/GetProjectsByDepartmentUseCase";
import { ProjectController } from "../interfaces/controllers/ProjectController";
import { IssueRepository } from "../infrastructure/repositories/IssueRepository";
import { CreateIssueUseCase } from "../application/use-cases/project/CreateIssuesUseCase";
import { CreateSubTaskUseCase } from "../application/use-cases/project/CreateSubTaskUseCase";
import { SubTaskRepository } from "../infrastructure/repositories/SubTaskRepository";
import { SprintRepository } from "../infrastructure/repositories/SprintRepository";
import { CreateSprentUseCase } from "../application/use-cases/project/CreateSprintUseCase";
import { AssignIssueToSprintUseCase } from "../application/use-cases/project/AssignIssueToSprintUseCase";
import { ProjectLevelEmployeeAllocationUseCase } from "../application/use-cases/project/ProjectLevelEmployeeAllocationUseCase";
import { IssueLevelEmployeeAllocationUseCase } from "../application/use-cases/project/IssueLevelEmployeeAllocationUseCase";
import { AddEmployeeProjectUseCase } from "../application/use-cases/project/AddEmployeeProjectUseCase";
import { GetProjectDetailsUseCase } from "../application/use-cases/project/GetProjectDetailsUseCase";
import { DeleteProjectUseCase } from "../application/use-cases/project/DeleteProjectUseCase";

export const projectDI = () => {
  const companyRepo = new companyRepository();
  const projectRepo = new ProjectRepository();
  const userStoryRepo = new UserStoryRepository();
  const backlogRepo = new BacklogRepository();
  const taskRepo = new TaskRepository();
  const employeeRepo = new EmployeeRepository();
  const managerRepo = new ManagerRepository();
  const departmentRepo = new DepartmentRepository();
  const issueRepo = new IssueRepository();
  const subTaskRepo = new SubTaskRepository();
  const sprintRepo = new SprintRepository();

  const createProjectUseCase = new CreateProjectUseCase(
    projectRepo,
    companyRepo,
    managerRepo,
    departmentRepo,
    employeeRepo
  );
  const createUserStoryUseCase = new CreateUserStoryUseCase(
    userStoryRepo,
    backlogRepo,
    projectRepo,
    employeeRepo
  );
  const createBacklogUseCase = new CreateBacklogUseCase(
    backlogRepo,
    companyRepo,
    managerRepo,
    projectRepo
  );
  const createTaskUseCase = new CreateTaskUseCase(
    taskRepo,
    userStoryRepo,
    employeeRepo,
    projectRepo
  );
  const getProjectsByCompanyUseCase = new GetProjectsByCompanyUseCase(
    projectRepo,
    managerRepo,
    departmentRepo
  );
  const getProjectsByDepartmentUseCase = new GetProjectsByDepartmentUseCase(
    projectRepo,
    managerRepo
  );
  const createIssueUseCase = new CreateIssueUseCase(
    projectRepo,
    issueRepo,
    employeeRepo
  );
  const createSubTaskUseCase = new CreateSubTaskUseCase(issueRepo, subTaskRepo);
  const createSprentUseCase = new CreateSprentUseCase(projectRepo, sprintRepo);
  const assineIssueToSprintUseCase = new AssignIssueToSprintUseCase(
    issueRepo,
    sprintRepo
  );
  const projectLevelEmployeeAllocationUseCase =
    new ProjectLevelEmployeeAllocationUseCase(managerRepo, employeeRepo);
  const issueLevelEmployeeAllocationUseCase =
    new IssueLevelEmployeeAllocationUseCase(projectRepo, employeeRepo);

    const addEmployeeProjectUseCase =new AddEmployeeProjectUseCase(projectRepo,employeeRepo)


    const getProjectDetailsUseCase= new GetProjectDetailsUseCase(projectRepo,issueRepo,subTaskRepo,sprintRepo)


    const deleteProjectUseCase = new DeleteProjectUseCase(projectRepo,issueRepo,subTaskRepo,sprintRepo)

  return new ProjectController(
    createProjectUseCase,
    createUserStoryUseCase,
    createBacklogUseCase,
    createTaskUseCase,
    getProjectsByCompanyUseCase,
    getProjectsByDepartmentUseCase,
    createIssueUseCase,
    createSubTaskUseCase,
    createSprentUseCase,
    assineIssueToSprintUseCase,
    projectLevelEmployeeAllocationUseCase,
    issueLevelEmployeeAllocationUseCase,
    addEmployeeProjectUseCase,
    getProjectDetailsUseCase,
    deleteProjectUseCase
  );
};
