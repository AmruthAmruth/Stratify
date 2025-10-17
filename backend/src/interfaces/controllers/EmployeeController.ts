import { Response } from "express";
import { ICreateManagerUseCase } from "../../application/interfaces/managers/ICreateManagerUseCase";
import { ICreateEmployeeUseCase } from "../../application/interfaces/employees/ICreateEmployeeUseCase";
import { IGetUnassignedManagersUseCase } from "../../application/interfaces/managers/IGetUnassignedManagersUseCase";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { CreateManagerSchema } from "../../application/validators/CreateManager";
import { CreateEmployeeSchema } from "../../application/validators/CreateEmployee";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { IGetMemberForMangerUseCase } from "../../application/interfaces/chat/IGetMemberForMangerUseCase";
import { IGetmemberForEmployeeUseCase } from "../../application/interfaces/chat/IGetMemberForEmployeeUseCase";

export class EmployeeController {
  constructor(
    private _createManagerUseCase: ICreateManagerUseCase,
    private _createEmployeeUseCase: ICreateEmployeeUseCase,
    private _getUnassignedManagersUseCase: IGetUnassignedManagersUseCase,
    private _getMemberForManagerUseCase: IGetMemberForMangerUseCase,
    private _getMemberForEmployeeUseCase: IGetmemberForEmployeeUseCase,
  ) {}

  createManager = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = CreateManagerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const companyId = req.userId;
    const response = await this._createManagerUseCase.execute({
      ...req.body,
      companyId,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Manager created successfully", response });
  };

  createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = CreateEmployeeSchema.safeParse(req.body);
    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const creatorId = req.userId!;
    const employeeDto = req.body;
    const response = await this._createEmployeeUseCase.execute(
      employeeDto,
      creatorId,
    );
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Employee created successfully", response });
  };

  getUnassignedManagers = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const companyId = req.userId;
    const managers = await this._getUnassignedManagersUseCase.execute(
      companyId!,
    );
    res.status(StatusCodes.OK).json({ managers });
  };

  getMembersForManager = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const managerId = req.userId;
    const response = await this._getMemberForManagerUseCase.execute(managerId!);
    res.status(StatusCodes.OK).json(response);
  };

  getMemberForEmployee = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const employeeId = req.userId;
    const response = await this._getMemberForEmployeeUseCase.execute(
      employeeId!,
    );
    res.status(StatusCodes.OK).json(response);
  };
}
