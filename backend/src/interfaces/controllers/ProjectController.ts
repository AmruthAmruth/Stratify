import { Request, Response } from "express";
import { ICreateProjectUseCase } from "../../application/interfaces/project/ICreateProjectUseCase";
import { ICreateUserStoryUseCase } from "../../application/interfaces/project/ICreateUserStoryUseCase";
import { ICreateBacklogUseCase } from "../../application/interfaces/project/ICreateBacklogUseCase";
import { ICreateTaskUseCase } from "../../application/interfaces/project/ICreateTaskUseCase";
import { IGetProjectsByCompanyUseCase } from "../../application/interfaces/project/IGetProjectsByCompanyUseCase";
import { IGetProjectsByDepartmentUseCase } from "../../application/interfaces/project/IGetProjectsByDepartmentUseCase";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";
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
import { IRemoveEmployeeInProjectUseCase } from "../../application/interfaces/project/IRemoveEmployeeINProjectUseCase";

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
    private _getIssueForEmployeeUseCase:IGetIssueForEmployeeUseCase,
    private _removeEmployeeInProjectUseCase:IRemoveEmployeeInProjectUseCase
  ) {}

  createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    const createdBy = req.userId;
    const projectDTO = { ...req.body, createdBy };
    const response = await this._createProjectUseCase.execute(projectDTO);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Project created successfully", response });
  };

  createUserStory = async (req: AuthRequest, res: Response): Promise<void> => {
    const createdBy = req.userId;
    const userStoryDTO = { ...req.body, createdBy };
    const response = await this._createUserStoryUseCase.execute(userStoryDTO);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User story created successfully", response });
  };

  createBacklog = async (req: AuthRequest, res: Response): Promise<void> => {
    const createdBy = req.userId;
    const backlogDTO = { ...req.body, createdBy };
    const response = await this._createBacklogUseCase.execute(backlogDTO);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Backlog created successfully", response });
  };

 

  createTask = async (req: Request, res: Response): Promise<void> => {
    const response = await this._createTaskUseCase.execute(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Task created successfully", response });
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

  getProjectDetails = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const response = await this._getProjectDetailsUseCase.execute(id);
    res.status(StatusCodes.OK).json(response);
  };

  createIssue = async (req: Request, res: Response): Promise<void> => {
    const response = await this._createIssueUseCase.execute(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Issue Created Successfully", response });
  };

  createSubTask = async (req: Request, res: Response): Promise<void> => {
    const response = await this._createSubTaskUseCase.execute(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Task Created Successfully", response });
  };

  createSprint = async (req: Request, res: Response): Promise<void> => {
    const response = await this._createSprentUseCase.execute(req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "Sprint Created Successfully!", response });
  };

  assignIssueToSprint = async (req: Request, res: Response): Promise<void> => {
    const { issueId, sprintId } = req.body;
    const response = await this._assignIssueToSprintUseCase.execute(
      issueId,
      sprintId,
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "Assine Issue to Sprint", response });
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
      .json({ message: "Added Employee to the Project" });
  };

  deleteProject = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await this._deleteProjectUseCase.execute(id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Project Deleted Successfully!" });
  };

  updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
    const createdBy = req.userId;
    const response = await this._updateProjectUseCase.execute({
      ...req.body,
      createdBy,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Updated the project successfully!", response });
  };

  getEmployeesNotInProject = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;
    const response = await this._getEmployeeNotInProjectUseCase.execute(id);
    res.status(StatusCodes.OK).json(response);
  };




  getIssueForEmployee=async(req:AuthRequest,res:Response):Promise<void>=>{
    const userId=req.userId;
    const resposne = await this._getIssueForEmployeeUseCase.execute(userId!)
    res.status(StatusCodes.OK).json(resposne)
  }


  removeEmployeeInProject=async(req:AuthRequest,res:Response):Promise<void>=>{
    const {projectId,empoyeeId}=req.body

   await this._removeEmployeeInProjectUseCase.execute(projectId,empoyeeId)

    res.status(StatusCodes.OK).json({message:"Employee Removed Successfully from project!"})
  }


}
