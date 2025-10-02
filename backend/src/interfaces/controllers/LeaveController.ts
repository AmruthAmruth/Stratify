import { Request, Response } from "express";
import { ICreateLeaveUseCase } from "../../application/interfaces/leave/ICreateLeaveUseCase";
import { IGetEmployeeLeaveUseCase } from "../../application/interfaces/leave/IGetEmployeeLeaveUseCase";
import { IGetDepartmentLeaveUseCase } from "../../application/interfaces/leave/IGetDepartmentLeavsUseCase";
import { IApproveLeaveUseCase } from "../../application/interfaces/leave/IApproveLeaveUseCase";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { StatusCodes } from "../../shared/constants/statusCodes";

export class LeaveController {
  constructor(
    private _createLeaveUseCase: ICreateLeaveUseCase,
    private _getEmployeeLeaveUseCase: IGetEmployeeLeaveUseCase,
    private _getDepartmentLeaveUseCase: IGetDepartmentLeaveUseCase,
    private _approveLeaveUseCase: IApproveLeaveUseCase
  ) {}

  createLeave = async (req: AuthRequest, res: Response): Promise<void> => {
    const employeeId = req.userId;
    const leaveDTO = { employeeId, ...req.body };
    const response = await this._createLeaveUseCase.execute(leaveDTO);
    res.status(StatusCodes.CREATED).json({ message: "Leave created successfully", response });
  };

  getEmployeeLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
    const employeeId = req.userId;
    const response = await this._getEmployeeLeaveUseCase.execute(employeeId!);
    res.status(StatusCodes.OK).json(response);
  };

  getDepartmentLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
    const managerId = req.userId;
    const response = await this._getDepartmentLeaveUseCase.execute(managerId!);
    res.status(StatusCodes.OK).json(response);
  };

  approveLeave = async (req: Request, res: Response): Promise<void> => {
    const response = await this._approveLeaveUseCase.execute(req.body);
    res.status(StatusCodes.OK).json({ message: response });
  };
}
