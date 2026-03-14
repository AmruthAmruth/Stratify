import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { projectDI } from "../../di/ProjectDI";
import { validateRequest } from "../middleware/ValidationMiddleware";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  CreateUserStorySchema,
  CreateIssueSchema,
  UpdateIssueSchema,
  CreateSubTaskSchema,
  UpdateSubTaskSchema,
  CreateSprintSchema,
  UpdateSprintSchema,
  AssignIssueToSprintSchema,
  AddEmployeeToProjectSchema,
  RemoveEmployeeFromProjectSchema,
  ValidateEmployeeCapacitySchema,
} from "../../application/validators/ProjectValidator";

const projectRouter = Router();
const controller = projectDI();

projectRouter.post(
  "/create-project",
  authMiddleware(["company", "manager"]),
  validateRequest(CreateProjectSchema),
  asyncHandler(controller.createProject)
);

projectRouter.put(
  "/project",
  authMiddleware(["company", "manager"]),
  validateRequest(UpdateProjectSchema),
  asyncHandler(controller.updateProject)
);

projectRouter.delete(
  "/project/:id",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.deleteProject)
);

projectRouter.get(
  "/project/:id",
  authMiddleware(["company", "manager", "employee"]),
  asyncHandler(controller.getProjectDetails)
);

projectRouter.get(
  "/company-projects",
  authMiddleware(["company"]),
  asyncHandler(controller.getProjectsByCompany)
);

projectRouter.get(
  "/department-projects",
  authMiddleware(["manager"]),
  asyncHandler(controller.getProjectsByDepartment)
);

projectRouter.get(
  "/employee-projects",
  authMiddleware(["employee"]),
  asyncHandler(controller.getProjectsForEmployee)
);

projectRouter.post(
  "/create-user-story",
  authMiddleware(["company", "manager"]),
  validateRequest(CreateUserStorySchema),
  asyncHandler(controller.createUserStory)
);

projectRouter.post(
  "/create-issue",
  authMiddleware(["company", "manager"]),
  validateRequest(CreateIssueSchema),
  asyncHandler(controller.createIssue)
);

projectRouter.put(
  "/update-issue",
  authMiddleware(["company", "manager", "employee"]),
  validateRequest(UpdateIssueSchema),
  asyncHandler(controller.updateIssue)
);

projectRouter.get(
  "/issuelevel-allocated-employee/:id",
  asyncHandler(controller.issueLevelEmployeeAllocation)
);

projectRouter.post(
  "/assign-to-sprint",
  authMiddleware(["company", "manager"]),
  validateRequest(AssignIssueToSprintSchema),
  asyncHandler(controller.assignIssueToSprint)
);

projectRouter.delete(
  "/delete-issue/:issueId",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.deleteIssue)
);

projectRouter.post(
  "/create-sub-task",
  authMiddleware(["company", "manager", "employee"]),
  validateRequest(CreateSubTaskSchema),
  asyncHandler(controller.createSubTask)
);

projectRouter.put(
  "/update-sub-task",
  authMiddleware(["company", "manager", "employee"]),
  validateRequest(UpdateSubTaskSchema),
  asyncHandler(controller.updateSubTask)
);

projectRouter.delete(
  "/delete-sub-task/:id",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.deleteSubTask)
);

projectRouter.post(
  "/create-sprint",
  authMiddleware(["company", "manager"]),
  validateRequest(CreateSprintSchema),
  asyncHandler(controller.createSprint)
);

projectRouter.put(
  "/update-sprint",
  authMiddleware(["company", "manager"]),
  validateRequest(UpdateSprintSchema),
  asyncHandler(controller.updateSprint)
);

projectRouter.delete(
  "/delete-sprint/:id",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.deleteSprint)
);

projectRouter.post(
  "/add-employee-project",
  authMiddleware(["company", "manager"]),
  validateRequest(AddEmployeeToProjectSchema),
  asyncHandler(controller.addEmployeeProject)
);

projectRouter.post(
  "/remove-emp",
  authMiddleware(["company", "manager"]),
  validateRequest(RemoveEmployeeFromProjectSchema),
  asyncHandler(controller.removeEmployeeInProject)
);

projectRouter.get(
  "/projectlevel-allocated-employee",
  authMiddleware(["manager"]),
  asyncHandler(controller.projectLevelEmployeeAllocation)
);

projectRouter.get(
  "/employee-out-project/:id",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.getEmployeesNotInProject)
);

projectRouter.get(
  "/issues",
  authMiddleware(["employee"]),
  asyncHandler(controller.getIssueForEmployee)
);

projectRouter.get(
  "/manager/issues",
  authMiddleware(["manager"]),
  asyncHandler(controller.getIssuesForManager)
);

projectRouter.post(
  "/validate-capacity",
  authMiddleware(["company", "manager"]),
  validateRequest(ValidateEmployeeCapacitySchema),
  asyncHandler(controller.validateEmployeeCapacity)
);

projectRouter.get(
  "/sprints/:sprintId/capacity",
  authMiddleware(["company", "manager", "employee"]),
  asyncHandler(controller.getSprintCapacity)
);

export default projectRouter;
