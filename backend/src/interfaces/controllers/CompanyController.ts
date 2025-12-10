import { Request, Response } from "express";
import { IGetCompanyByIdUseCase } from "../../application/interfaces/company/IGetCompanyUseCase";
import { IGetPaginatedCompaniesUseCase } from "../../application/interfaces/company/IListCompanyUseCase";
import { IApproveCompanyUseCase } from "../../application/interfaces/company/IApproveCompanyUseCase";
import { IUnapproveCompany } from "../../application/interfaces/company/IUnapprovedCompanyUseCase";
import { IGetCompanyMemebersUseCase } from "../../application/interfaces/company/IGetCompanyMembersUseCase";
import { IGetProfileUseCase } from "../../application/interfaces/company/IGetProfileUseCase";
import { IGetCompanyAnalyticsUseCase } from "../../application/interfaces/company/IGetCompanyAnalyticsUseCase";
import { IUpdateCompanyProfileUseCase } from "../../application/interfaces/company/IUpdateCompanyProfileUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { AuthRequest } from "../middleware/AuthMiddleware";


export class CompanyController {
  constructor(
    private _getCompanyByIdUseCase: IGetCompanyByIdUseCase,
    private _getPaginatedCompaniesUseCase: IGetPaginatedCompaniesUseCase,
    private _approveCompanyUseCase: IApproveCompanyUseCase,
    private _unapproveCompanyUseCase: IUnapproveCompany,
    private _getCompanyMembersUseCase: IGetCompanyMemebersUseCase,
    private _getTeamMemberProfileUseCase: IGetProfileUseCase,
    private _getCompanyAnalyticsUseCase: IGetCompanyAnalyticsUseCase,
    private _updateCompanyProfileUseCase: IUpdateCompanyProfileUseCase,
  ) { }

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
      .json({ message: Messages.COMPANY_APPROVED });
  };

  unapproveCompany = async (req: Request, res: Response): Promise<void> => {
    const { companyId, reason } = req.body;
    await this._unapproveCompanyUseCase.execute(companyId, reason);
    res
      .status(StatusCodes.OK)
      .json({ message: Messages.COMPANY_UNAPPROVED });
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

  getCompanyAnalytics = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void> => {
    const companyId = req.userId!;
    const analytics = await this._getCompanyAnalyticsUseCase.execute(companyId);
    res.status(StatusCodes.OK).json(analytics);
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const companyId = req.userId!;
    const data = req.body;
    const updatedCompany = await this._updateCompanyProfileUseCase.execute(companyId, data);
    res.status(StatusCodes.OK).json(updatedCompany);
  };
}
