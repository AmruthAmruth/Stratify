import { Request, Response } from "express";
import { ICreateProjectUseCase } from "../../application/interfaces/project/ICreateProjectUseCase";
import { ICreateUserStoryUseCase } from "../../application/interfaces/project/ICreateUserStoryUseCase";
import { ICreateBacklogUseCase } from "../../application/interfaces/project/ICreateBacklogUseCase";
import { ICreateTaskUseCase } from "../../application/interfaces/project/ICreateTaskUseCase";
import { IGetProjectsByCompanyUseCase } from "../../application/interfaces/project/IGetProjectsByCompanyUseCase";
import { IGetProjectsByDepartmentUseCase } from "../../application/interfaces/project/IGetProjectsByDepartmentUseCase";
import { IGetProjectsForEmployeeUseCase } from "../../application/interfaces/project/IGetProjectsForEmployeeUseCase";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { ICreateIssueUseCase } from "../../application/interfaces/project/ICreateIssueUseCase";
import { ICreateSubTaskUseCase } from "../../application/interfaces/project/ICreateSubTaskUseCase";
import { ICreateSprintUseCase } from "../../application/interfaces/project/ICreateSprintUseCase";
import { IAssignIssueToSprintUseCase } from "../../application/interfaces/project/IAssignIssueToSprintUseCase";
import { IProjectLevelEmployeeAllocationUseCase } from "../../application/interfaces/project/IProjectLeavelEmployeeAllocationUseCase";
import { IIssueLevelEmployeeAllocation } from "../../application/interfaces/project/IIssueLevelEmployeeAllocationUseCase";
import { IAddEmployeeProjectUseCase } from "../../application/interfaces/project/IAddEmployeeProjectUseCase";
import { IGetProjectDetailsUseCase } from "../../application/interfaces/project/IGetProjectDetailsUseCase";
import { IDeleteProjectUseCase } from "../../application/interfaces/project/IDeleteProjectUseCase";
import { IUpdateProjectUseCase } from "../../application/interfaces/project/IUpdateProjectUseCase";
import { IGetEmployeeNotInProjectUseCase } from "../../application/interfaces/project/IGetEmployeeNotInProjectUseCase";
import { IGetIssueForEmployeeUseCase } from "../../application/interfaces/project/IGetIssueForEmployeeUseCase";
import { IGetIssuesForManagerUseCase } from "../../application/interfaces/project/IGetIssuesForManagerUseCase";
import { IRemoveEmployeeInProjectUseCase } from "../../application/interfaces/project/IRemoveEmployeeINProjectUseCase";
import { IUpdateIssueUseCase } from "../../application/interfaces/project/IUpdateIssueUseCase";
import { IDeleteIssueUseCase } from "../../application/interfaces/project/IDeleteIssueUseCase";
import { IUpdateSprintUseCase } from "../../application/interfaces/project/IUpdateSprintUseCase";
import { IDeleteSprintUseCase } from "../../application/interfaces/project/IDeleteSprintUseCase";
import { IUpdateSubTaskUseCase } from "../../application/interfaces/project/IUpdateSubTaskUseCase";
import { IDeleteSubTaskUseCase } from "../../application/interfaces/project/IDeleteSubTaskUseCase";

export class ProjectController {
  constructor(
    private _createProjectUseCase: ICreateProjectUseCase,
    private _createUserStoryUseCase: ICreateUserStoryUseCase,
    private _createBacklogUseCase: ICreateBacklogUseCase,
    private _createTaskUseCase: ICreateTaskUseCase,
    private _getProjectsByCompanyUseCase: IGetProjectsByCompanyUseCase,
    private _getProjectsByDepartmentUseCase: IGetProjectsByDepartmentUseCase,
    private _createIssueUseCase: ICreateIssueUseCase,
    private _createSubTaskUseCase: ICreateSubTaskUseCase,
    private _createSprentUseCase: ICreateSprintUseCase,
    private _assignIssueToSprintUseCase: IAssignIssueToSprintUseCase,
    private _projectLevelEmployeeAllocationUseCase: IProjectLevelEmployeeAllocationUseCase,
    private _issueLevelEmployeeAllocationUseCase: IIssueLevelEmployeeAllocation,
    private _addEmployeeProjectUseCase: IAddEmployeeProjectUseCase,
    private _getProjectDetailsUseCase: IGetProjectDetailsUseCase,
    private _deleteProjectUseCase: IDeleteProjectUseCase,
    private _updateProjectUseCase: IUpdateProjectUseCase,
    private _getEmployeeNotInProjectUseCase: IGetEmployeeNotInProjectUseCase,
    private _getIssueForEmployeeUseCase: IGetIssueForEmployeeUseCase,
    private _removeEmployeeInProjectUseCase: IRemoveEmployeeInProjectUseCase,
    private _updateIssueUseCase: IUpdateIssueUseCase,
    private _deleteIssueUseCase: IDeleteIssueUseCase,
    private _updateSprintUseCase: IUpdateSprintUseCase,
    private _deleteSprintUseCase: IDeleteSprintUseCase,
    private _updateSubTaskUseCase: IUpdateSubTaskUseCase,
    private _deleteSubTaskUseCase: IDeleteSubTaskUseCase,
    private _getProjectsForEmployeeUseCase: IGetProjectsForEmployeeUseCase,
    private _getIssuesForManagerUseCase: IGetIssuesForManagerUseCase
  ) { }

  createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    const createdBy = req.userId;
    const projectDTO = { ...req.body, createdBy };
    const response = await this._createProjectUseCase.execute(projectDTO);
    res
      .status(StatusCodes.CREATED)
      .json({ message: Messages.PROJECT_CREATED, response });
  };

  createUserStory = async (req: AuthRequest, res: Response): Promise<void> => {
    const createdBy = req.userId;
    const userStoryDTO = { ...req.body, createdBy };
    const response = await this._createUserStoryUseCase.execute(userStoryDTO);
    res
      .status(StatusCodes.CREATED)
      .json({ message: Messages.USER_STORY_CREATED, response });
  };

  createBacklog = async (req: AuthRequest, res: Response): Promise<void> => {
    const createdBy = req.userId;
    const backlogDTO = { ...req.body, createdBy };
    const response = await this._createBacklogUseCase.execute(backlogDTO);
    res
      .status(StatusCodes.CREATED)
      .json({ message: Messages.BACKLOG_CREATED, response });
  };



  createTask = async (req: Request, res: Response): Promise<void> => {
    const response = await this._createTaskUseCase.execute(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: Messages.TASK_CREATED, response });
  };

  getProjectsByCompany = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const companyId = req.userId;
    const response = await this._getProjectsByCompanyUseCase.execute(
      companyId!,
    );
    res.status(StatusCodes.OK).json(response);
  };

  getProjectsByDepartment = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const managerId = req.userId;
    const response = await this._getProjectsByDepartmentUseCase.execute(
      managerId!,
    );
    res.status(StatusCodes.OK).json(response);
  };

  getProjectsForEmployee = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const employeeId = req.userId;
    const response = await this._getProjectsForEmployeeUseCase.execute(
      employeeId!,
    );
    res.status(StatusCodes.OK).json(response);
  };

  getProjectDetails = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const response = await this._getProjectDetailsUseCase.execute(id);
    res.status(StatusCodes.OK).json(response);
  };

  createIssue = async (req: Request, res: Response): Promise<void> => {
    const response = await this._createIssueUseCase.execute(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: Messages.ISSUE_CREATED, response });
  };

  createSubTask = async (req: AuthRequest, res: Response): Promise<void> => {
    const response = await this._createSubTaskUseCase.execute(
      req.body,
      req.userId,
      req.role
    );
    res
      .status(StatusCodes.CREATED)
      .json({ message: Messages.SUBTASK_CREATED, response });
  };

  createSprint = async (req: Request, res: Response): Promise<void> => {
    const response = await this._createSprentUseCase.execute(req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.SPRINT_CREATED, response });
  };

  assignIssueToSprint = async (req: Request, res: Response): Promise<void> => {
    const { issueId, sprintId } = req.body;
    const response = await this._assignIssueToSprintUseCase.execute(
      issueId,
      sprintId,
    );
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.ISSUE_ASSIGNED_TO_SPRINT, response });
  };

  projectLevelEmployeeAllocation = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const managerId = req.userId;
    const response = await this._projectLevelEmployeeAllocationUseCase.execute(
      managerId!,
    );
    res.status(StatusCodes.OK).json(response);
  };

  issueLevelEmployeeAllocation = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    const response =
      await this._issueLevelEmployeeAllocationUseCase.execute(id);
    res.status(StatusCodes.OK).json(response);
  };

  addEmployeeProject = async (req: Request, res: Response): Promise<void> => {
    await this._addEmployeeProjectUseCase.execute(
      req.body.projectId,
      req.body.employeeId,
    );
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.EMPLOYEE_ADDED_TO_PROJECT });
  };

  deleteProject = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await this._deleteProjectUseCase.execute(id);
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.PROJECT_DELETED });
  };

  updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
    const createdBy = req.userId;
    const response = await this._updateProjectUseCase.execute({
      ...req.body,
      createdBy,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.PROJECT_UPDATED, response });
  };

  getEmployeesNotInProject = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    const response = await this._getEmployeeNotInProjectUseCase.execute(id);
    res.status(StatusCodes.OK).json(response);
  };




  getIssueForEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const resposne = await this._getIssueForEmployeeUseCase.execute(userId!)
    res.status(StatusCodes.OK).json(resposne)
  }


  removeEmployeeInProject = async (req: AuthRequest, res: Response): Promise<void> => {
    const { projectId, employeeId } = req.body
    console.log(req.body);

    await this._removeEmployeeInProjectUseCase.execute(projectId, employeeId)

    res.status(StatusCodes.OK).json({ message: Messages.EMPLOYEE_REMOVED_FROM_PROJECT })
  }




  updateIssue = async (req: Request, res: Response): Promise<void> => {
    const response = await this._updateIssueUseCase.execute(req.body)
    res.status(StatusCodes.OK).json({ message: Messages.ISSUE_UPDATED, response })
  }



  deleteIssue = async (req: Request, res: Response): Promise<void> => {
    const { issueId } = req.params
    await this._deleteIssueUseCase.execute(issueId!)
    res.status(StatusCodes.OK).json({ message: Messages.ISSUE_DELETED })
  }

  updateSprint = async (req: Request, res: Response): Promise<void> => {
    const response = await this._updateSprintUseCase.execute(req.body);
    res.status(StatusCodes.OK).json({ message: Messages.SPRINT_UPDATED, response });
  };

  deleteSprint = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this._deleteSprintUseCase.execute(id);
    res.status(StatusCodes.OK).json({ message: Messages.SPRINT_DELETED });
  };

  updateSubTask = async (req: Request, res: Response): Promise<void> => {
    const response = await this._updateSubTaskUseCase.execute(req.body);
    res.status(StatusCodes.OK).json({ message: Messages.SUBTASK_UPDATED, response });
  };

  deleteSubTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this._deleteSubTaskUseCase.execute(id);
    res.status(StatusCodes.OK).json({ message: Messages.SUBTASK_DELETED });
  };

  getIssuesForManager = async (req: AuthRequest, res: Response): Promise<void> => {
    const managerId = req.userId;
    const response = await this._getIssuesForManagerUseCase.execute(managerId!);
    res.status(StatusCodes.OK).json(response);
  };

}
