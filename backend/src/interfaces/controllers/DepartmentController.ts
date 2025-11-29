import { Request, Response } from "express";
import { ICreateDepartmentUseCase } from "../../application/interfaces/departments/ICreateDepartmentUseCase";
import { IGetCompanyDepartmentUseCase } from "../../application/interfaces/departments/IGetCompanyDepartmentsUseCase";
import { IGetCompanyDepartmentDetailsUseCase } from "../../application/interfaces/departments/IGetDepartmentDetailsUseCase";
import { IGetUnassignedDepartments } from "../../application/interfaces/departments/IGetUnassignedDepartmentsUseCase";
import { IGetManagerDepartmentsUseCase } from "../../application/interfaces/departments/IGetManagerDepartmentsUseCase";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { DepartmentDetailsSchema } from "../../application/validators/CreateDepartment";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";

export class DepartmentController {
  constructor(
    private _createDepartmentUseCase: ICreateDepartmentUseCase,
    private _getCompanyDepartmentsUseCase: IGetCompanyDepartmentUseCase,
    private _getDepartmentDetailsUseCase: IGetCompanyDepartmentDetailsUseCase,
    private _getUnassignedDepartmentsUseCase: IGetUnassignedDepartments,
    private _getManagerDepartmentsUseCase: IGetManagerDepartmentsUseCase,
  ) { }

  createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = DepartmentDetailsSchema.safeParse(req.body);
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
    const response = await this._createDepartmentUseCase.execute({
      ...req.body,
      companyId,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: Messages.DEPARTMENT_CREATED, response });
  };

  getCompanyDepartments = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const companyId = req.userId!;
    const response =
      await this._getCompanyDepartmentsUseCase.execute(companyId);
    res.status(StatusCodes.OK).json({ response });
  };

  getDepartmentDetails = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const response = await this._getDepartmentDetailsUseCase.execute(id);
    res.status(StatusCodes.OK).json({ response });
  };

  getUnassignedDepartments = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const companyId = req.userId!;
    const departments =
      await this._getUnassignedDepartmentsUseCase.execute(companyId);
    res.status(StatusCodes.OK).json({ departments });
  };

  getManagerDepartments = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { managerId } = req.params;
    const response =
      await this._getManagerDepartmentsUseCase.execute(managerId);
    res.status(StatusCodes.OK).json(response);
  };
}
