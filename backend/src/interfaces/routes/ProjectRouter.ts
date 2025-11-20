import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { projectDI } from "../../di/ProjectDI";

const projectRouter = Router();
const controller = projectDI();

/* ----------------------------------------------------
 * PROJECT CREATION & MANAGEMENT
 * ---------------------------------------------------- */
projectRouter.post(
  "/create-project",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.createProject)
);

projectRouter.put(
  "/project",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.updateProject)
);

projectRouter.delete(
  "/project/:id",
  asyncHandler(controller.deleteProject)
);

projectRouter.get(
  "/project/:id",
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


/* ----------------------------------------------------
 * USER STORIES
 * ---------------------------------------------------- */
projectRouter.post(
  "/create-user-story",
  authMiddleware(["company", "manager"]),
  asyncHandler(controller.createUserStory)
);


/* ----------------------------------------------------
 * ISSUES
 * ---------------------------------------------------- */
projectRouter.post(
  "/create-issue",
  asyncHandler(controller.createIssue)
);

projectRouter.put(
  "/update-issue",
  asyncHandler(controller.updateIssue)
);

projectRouter.get(
  "/issuelevel-allcated-employee/:id",
  asyncHandler(controller.issueLevelEmployeeAllocation)
);

projectRouter.post(
  "/assing-to-sprint",
  asyncHandler(controller.assignIssueToSprint)
);


/* ----------------------------------------------------
 * SUBTASKS
 * ---------------------------------------------------- */
projectRouter.post(
  "/create-subtask",
  asyncHandler(controller.createSubTask)
);


/* ----------------------------------------------------
 * SPRINTS
 * ---------------------------------------------------- */
projectRouter.post(
  "/create-sprint",
  asyncHandler(controller.createSprint)
);


/* ----------------------------------------------------
 * EMPLOYEE MANAGEMENT (PROJECT LEVEL)
 * ---------------------------------------------------- */
projectRouter.post(
  "/add-employee-project",
  asyncHandler(controller.addEmployeeProject)
);

projectRouter.post(
  "/remove-emp",
  asyncHandler(controller.removeEmployeeInProject)
);

projectRouter.get(
  "/projectlevel-allocated-employee",
  authMiddleware(["manager"]),
  asyncHandler(controller.projectLevelEmployeeAllocation)
);

projectRouter.get(
  "/employee-out-project/:id",
  asyncHandler(controller.getEmployeesNotInProject)
);


/* ----------------------------------------------------
 * EMPLOYEE — ISSUE VIEW
 * ---------------------------------------------------- */
projectRouter.get(
  "/issues",
  authMiddleware(["employee"]),
  asyncHandler(controller.getIssueForEmployee)
);

export default projectRouter;
