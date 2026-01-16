import { CompanyRepository } from "../infrastructure/repositories/CompanyRepository";
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
import { GetProjectsForEmployeeUseCase } from "../application/use-cases/project/GetProjectsForEmployeeUseCase";
import { ProjectController } from "../interfaces/controllers/ProjectController";
import { IssueRepository } from "../infrastructure/repositories/IssueRepository";
import { CreateIssueUseCase } from "../application/use-cases/project/CreateIssuesUseCase";
import { CreateSubTaskUseCase } from "../application/use-cases/project/CreateSubTaskUseCase";
import { SubTaskRepository } from "../infrastructure/repositories/SubTaskRepository";
import { SprintRepository } from "../infrastructure/repositories/SprintRepository";
import { CreateSprintUseCase } from "../application/use-cases/project/CreateSprintUseCase";
import { AssignIssueToSprintUseCase } from "../application/use-cases/project/AssignIssueToSprintUseCase";
import { ProjectLevelEmployeeAllocationUseCase } from "../application/use-cases/project/ProjectLevelEmployeeAllocationUseCase";
import { IssueLevelEmployeeAllocationUseCase } from "../application/use-cases/project/IssueLevelEmployeeAllocationUseCase";
import { AddEmployeeProjectUseCase } from "../application/use-cases/project/AddEmployeeProjectUseCase";
import { GetProjectDetailsUseCase } from "../application/use-cases/project/GetProjectDetailsUseCase";
import { DeleteProjectUseCase } from "../application/use-cases/project/DeleteProjectUseCase";
import { UpdateProjectUseCase } from "../application/use-cases/project/UpdateProjectUseCase";
import { GetEmployeeNotInProjectUseCase } from "../application/use-cases/project/GetEmployeeNotInProjectUseCase";
import { GetIssueForEmployeeUseCase } from "../application/use-cases/project/GetIssueForEmployeeUseCase";
import { GetIssuesForManagerUseCase } from "../application/use-cases/project/GetIssuesForManagerUseCase";
import { RemoveEmployeeInProjectUseCase } from "../application/use-cases/project/RemoveEmployeeInProjectUseCase";
import { UpdateIssueUseCase } from "../application/use-cases/project/UpdateIssueUseCase";
import { DeleteIssueUseCase } from "../application/use-cases/project/DeleteIssueUseCase";
import { UpdateSprintUseCase } from "../application/use-cases/project/UpdateSprintUseCase";
import { DeleteSprintUseCase } from "../application/use-cases/project/DeleteSprintUseCase";
import { UpdateSubTaskUseCase } from "../application/use-cases/project/UpdateSubTaskUseCase";
import { DeleteSubTaskUseCase } from "../application/use-cases/project/DeleteSubTaskUseCase";
import { NotificationRepository } from "../infrastructure/repositories/NotificationRepository";
import { ValidateEmployeeCapacityUseCase } from "../application/use-cases/project/ValidateEmployeeCapacityUseCase";
import { CalculateSprintCapacityUseCase } from "../application/use-cases/project/CalculateSprintCapacityUseCase";
import { LeaveRepository } from "../infrastructure/repositories/LeaveRepository";


export const projectDI = () => {
  const companyRepo = new CompanyRepository();
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
  const notificationRepo = new NotificationRepository();
  const leaveRepo = new LeaveRepository();

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
    employeeRepo,
  );
  const createBacklogUseCase = new CreateBacklogUseCase(
    backlogRepo,
    companyRepo,
    managerRepo,
    projectRepo,
  );
  const createTaskUseCase = new CreateTaskUseCase(
    taskRepo,
    userStoryRepo,
    employeeRepo,
    projectRepo,
  );
  const getProjectsByCompanyUseCase = new GetProjectsByCompanyUseCase(
    projectRepo,
    managerRepo,
    departmentRepo,
  );
  const getProjectsByDepartmentUseCase = new GetProjectsByDepartmentUseCase(
    projectRepo,
    managerRepo,
  );
  const getProjectsForEmployeeUseCase = new GetProjectsForEmployeeUseCase(
    projectRepo,
    employeeRepo,
  );
  const createIssueUseCase = new CreateIssueUseCase(
    projectRepo,
    issueRepo,
    employeeRepo,
    notificationRepo
  );
  const createSubTaskUseCase = new CreateSubTaskUseCase(issueRepo, subTaskRepo);
  const createSprentUseCase = new CreateSprintUseCase(projectRepo, sprintRepo);

  const validateEmployeeCapacityUseCase = new ValidateEmployeeCapacityUseCase(
    sprintRepo,
    employeeRepo,
    leaveRepo,
    issueRepo
  );

  const calculateSprintCapacityUseCase = new CalculateSprintCapacityUseCase(
    sprintRepo,
    projectRepo,
    leaveRepo,
    employeeRepo,
    issueRepo
  );

  const assineIssueToSprintUseCase = new AssignIssueToSprintUseCase(
    issueRepo,
    sprintRepo,
    validateEmployeeCapacityUseCase
  );
  const projectLevelEmployeeAllocationUseCase =
    new ProjectLevelEmployeeAllocationUseCase(managerRepo, employeeRepo);
  const issueLevelEmployeeAllocationUseCase =
    new IssueLevelEmployeeAllocationUseCase(projectRepo, employeeRepo);

  const addEmployeeProjectUseCase = new AddEmployeeProjectUseCase(
    projectRepo,
    employeeRepo,
    notificationRepo
  );

  const getProjectDetailsUseCase = new GetProjectDetailsUseCase(
    projectRepo,
    issueRepo,
    subTaskRepo,
    sprintRepo,
    employeeRepo
  );

  const deleteProjectUseCase = new DeleteProjectUseCase(
    projectRepo,
    issueRepo,
    subTaskRepo,
    sprintRepo,
  );

  const updateProjectUseCase = new UpdateProjectUseCase(
    projectRepo,
    companyRepo,
    managerRepo,
    departmentRepo,
    employeeRepo,
  );

  const getEmployeeNotInProjectUseCase = new GetEmployeeNotInProjectUseCase(
    projectRepo,
    employeeRepo,
  );


  const getIssueForEmployeeUseCase = new GetIssueForEmployeeUseCase(issueRepo)



  const removeEmployeeInProjectUseCase = new RemoveEmployeeInProjectUseCase(
    projectRepo,
    issueRepo,
    employeeRepo,
    notificationRepo
  )

  const updateIssueUseCase = new UpdateIssueUseCase(
    issueRepo,
    employeeRepo,
    projectRepo,
    validateEmployeeCapacityUseCase
  )

  const deleteIssueUseCase = new DeleteIssueUseCase(issueRepo)

  const updateSprintUseCase = new UpdateSprintUseCase(sprintRepo);
  const deleteSprintUseCase = new DeleteSprintUseCase(sprintRepo);
  const updateSubTaskUseCase = new UpdateSubTaskUseCase(subTaskRepo);
  const deleteSubTaskUseCase = new DeleteSubTaskUseCase(subTaskRepo);

  const getIssuesForManagerUseCase = new GetIssuesForManagerUseCase(
    issueRepo,
    managerRepo,
    projectRepo
  );

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
    deleteProjectUseCase,
    updateProjectUseCase,
    getEmployeeNotInProjectUseCase,
    getIssueForEmployeeUseCase,
    removeEmployeeInProjectUseCase,
    updateIssueUseCase,
    deleteIssueUseCase,
    updateSprintUseCase,
    deleteSprintUseCase,
    updateSubTaskUseCase,
    deleteSubTaskUseCase,
    getProjectsForEmployeeUseCase,
    getIssuesForManagerUseCase,
    validateEmployeeCapacityUseCase,
    calculateSprintCapacityUseCase
  );
};
