import { Router } from "express";
import { asyncHandler } from "../middleware/AsyncHandler";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { projectDI } from "../../di/ProjectDI";

const projectRouter = Router();
const controller = projectDI();

projectRouter.post("/create-project", authMiddleware(["company", "manager"]), asyncHandler(controller.createProject));
projectRouter.post("/create-user-story", authMiddleware(["company", "manager"]), asyncHandler(controller.createUserStory));
//projectRouter.post("/create-backlog", authMiddleware(["company", "manager"]), asyncHandler(controller.createBacklog));
//projectRouter.post("/create-sprint", authMiddleware(["company", "manager"]), asyncHandler(controller.createSprint));
//projectRouter.post("/create-task", asyncHandler(controller.createTask));
//projectRouter.post("/assigned-to-sprint", authMiddleware(["company", "manager"]), asyncHandler(controller.assignUserStoryToSprint));
projectRouter.post("/create-issue",asyncHandler(controller.createIssue))
projectRouter.post("/create-sprint",asyncHandler(controller.createSprint))
projectRouter.post("/add-employee-project",asyncHandler(controller.addEmployeeProject))
projectRouter.post("/create-subtask",asyncHandler(controller.createSubTask))
projectRouter.post("/assing-to-sprint",asyncHandler(controller.assignIssueToSprint))

projectRouter.delete('/project/:id',asyncHandler(controller.deleteProject))
projectRouter.put("/project",authMiddleware(["company","manager"]),asyncHandler(controller.updateProject))
projectRouter.get("/company-projects", authMiddleware(["company"]), asyncHandler(controller.getProjectsByCompany));
projectRouter.get('/projectlevel-allocated-employee',authMiddleware(["manager"]),asyncHandler(controller.projectLevelEmployeeAllocation))
projectRouter.get("/issuelevel-allcated-employee/:id",asyncHandler(controller.issueLevelEmployeeAllocation))
projectRouter.get("/department-projects", authMiddleware(["manager"]), asyncHandler(controller.getProjectsByDepartment));
projectRouter.get("/project/:id", asyncHandler(controller.getProjectDetails));

export default projectRouter;





