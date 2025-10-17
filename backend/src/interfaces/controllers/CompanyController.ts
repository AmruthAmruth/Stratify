import { Request, Response } from "express";
import { IGetCompanyByIdUseCase } from "../../application/interfaces/company/IGetCompanyUseCase";
import { IGetPaginatedCompaniesUseCase } from "../../application/interfaces/company/IListCompanyUseCase";
import { IApproveCompanyUseCase } from "../../application/interfaces/company/IApproveCompanyUseCase";
import { IUnapproveCompany } from "../../application/interfaces/company/IUnapprovedCompanyUseCase";
import { IGetCompanyMemebersUseCase } from "../../application/interfaces/company/IGetCompanyMembersUseCase";
import { IGetProfileUseCase } from "../../application/interfaces/company/IGetProfileUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { IGetMemberForCompanyUseCase } from "../../application/interfaces/chat/IGetMemberForCompanyUseCase";

export class CompanyController {
  constructor(
    private _getCompanyByIdUseCase: IGetCompanyByIdUseCase,
    private _getPaginatedCompaniesUseCase: IGetPaginatedCompaniesUseCase,
    private _approveCompanyUseCase: IApproveCompanyUseCase,
    private _unapproveCompanyUseCase: IUnapproveCompany,
    private _getCompanyMembersUseCase: IGetCompanyMemebersUseCase,
    private _getTeamMemberProfileUseCase: IGetProfileUseCase,
    private _getMemberForCompanyUseCase: IGetMemberForCompanyUseCase,
  ) {}

  getCompanyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const company = await this._getCompanyByIdUseCase.execute(id);
    res.status(StatusCodes.OK).json(company);
  };

  getPaginatedCompanies = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { page, pageSize, cursor, filter, sort } = req.query;
    const result = await this._getPaginatedCompaniesUseCase.execute({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      cursor: cursor as string,
      filter: filter ? JSON.parse(filter as string) : undefined,
      sort: sort ? JSON.parse(sort as string) : undefined,
    });
    res.status(StatusCodes.OK).json(result);
  };

  approveCompany = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.body;
    await this._approveCompanyUseCase.execute(companyId);
    res
      .status(StatusCodes.OK)
      .json({ message: "Company approved successfully" });
  };

  unapproveCompany = async (req: Request, res: Response): Promise<void> => {
    const { companyId, reason } = req.body;
    await this._unapproveCompanyUseCase.execute(companyId, reason);
    res
      .status(StatusCodes.OK)
      .json({ message: "Company unapproved successfully" });
  };

  getCompanyMembers = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const companyId = req.userId!;
    const response = await this._getCompanyMembersUseCase.execute(companyId);
    res.status(StatusCodes.OK).json({ response });
  };

  getTeamMemberProfile = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const response = await this._getTeamMemberProfileUseCase.execute(id);
    res.status(StatusCodes.OK).json({ response });
  };

  getMemberForCompany = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const companyId = req.userId;
    const response = await this._getMemberForCompanyUseCase.execute(companyId!);
    res.status(StatusCodes.OK).json(response);
  };
}
